// Your AuthContextProvider file
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { setCookie, deleteCookie } from 'cookies-next';
import axios from 'axios';
import api from '../api/api';
import { createUser, getUserByEmail, signInUser } from '../service/user.service';
import { IUser } from '../models';
import { setProviderToken } from '@providerVar';

interface AuthContextInterface {
  isSignedIn: boolean;
  userSession: any; // Update the type accordingly
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (session !== undefined) {
      checkSession();
    }
  }, [session]);

  async function checkSession() {
    if (!session) {
      deleteCookie('user_id');
      deleteCookie("user_organization");
      router.push("/");
    } else {
      await handleSessionChange(session);
    }
  }

  async function handleSessionChange(session: any) {
    if (!session || session.accessToken === null || session.accessToken === undefined || session.accessToken === "") {
      setCookie("AUTH_STATUS", "SIGNED_OUT");
      setIsSignedIn(false);
      setProviderToken(null);
      router.push("/");
      return;
    }
    setProviderToken(session.accessToken);
    setCookie("p_token", session.accessToken);
    setCookie("r_token", session.refreshToken);
    const accessToken = session?.accessToken;
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // Add the user if this is the first time they are signing in
    await addUserIfNew({ ...session.user, oAuthToken: accessToken, refreshToken: session.refreshToken });

    const resp = await signInUser({
      email: session.user.email,
      name: session.user.name as string,
      oAuthToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
    
    setUser(resp);
    setCookie("user_id", resp._id);
    setCookie("user_organization", resp.organization);
    setCookie("AUTH_STATUS", "SIGNED_IN");
    setIsSignedIn(true);
  }

  // Adds the user if they don't already exist
  type AddUserIfNewArgs = {
    email?: string;
    name?: string;
    picture?: string;
    oAuthToken?: string;
    refreshToken?: string;
  };
  async function addUserIfNew(userMetadata: AddUserIfNewArgs) {
    // Check if the user exists
    let userExists = true;
    try {
      const user = await getUserByEmail(userMetadata.email)

      userExists = user.length > 0;
    } catch (error) {
      // TODO: Error handler
      console.error(`Error: ${error}`);
      return;
    }

    // Only create a user if this is the first time they are logging in
    if (userExists) return;

    try {
      await createUser(userMetadata);
    } catch (error) {
      // TODO: error handler
      console.error(`Error: ${error}`);
    }
  }

  async function signInWithGoogle() {
    try {
      await signIn('google', { callbackUrl: window.location.origin });
      // The 'google' here should match the provider ID configured in your NextAuth.js file.
    } catch (error) {
      // Handle the error, such as showing a notification to the user.
      console.error('Error signing in with Google:', error);
    }
  }

  async function handleSignOut() {
    
    setUser(null);
    setIsSignedIn(false);
    deleteCookie("AUTH_STATUS");
    deleteCookie("p_token");
    deleteCookie("r_token");
    deleteCookie("user_id");
    deleteCookie("user_organization");
    await signOut({redirect: false});
  }

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        userSession: session,
        signInWithGoogle,
        signOut: handleSignOut,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextInterface => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('AuthContext must be within AuthContextProvider');
  }

  return context;
};
