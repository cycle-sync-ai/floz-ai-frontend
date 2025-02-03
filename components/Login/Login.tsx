"use client";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import { useAuthContext } from "@/contexts/AuthContext";
import { getCookie } from "cookies-next";
import LoginScreen from "./LoginScreen";

function Login() {
  const router = useRouter();
  const { signInWithGoogle, user, isSignedIn } = useAuthContext();
  
  if (isSignedIn) {
    if (user && user.organization) {
      router.push("/dashboard/home");
    } else {
      router.push("/organization");
    }
  }

  const onGoogleClick = () => {
    signInWithGoogle();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-5">
      <LoginScreen onClick={onGoogleClick} />
    </div>
  );
}

export default Login;
