import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
          authorization: {
            params: {
              access_type: "offline",
              prompt: 'consent',
              scope: "profile email https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.send",
            }
          }
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
          session.user["id"] = token.id;
          session["accessToken"] = token.accessToken;
          session["refreshToken"] = token.refreshToken;
          return session;
        },
        async jwt({ token, user, account, profile }) {
          if (user) {
            token.id = user.id;
          }
          if (account) {
            token.accessToken = account.access_token;
            token.refreshToken = account.refresh_token;
          }
          return token;
        },
      }
});

export { handler as GET, handler as POST};