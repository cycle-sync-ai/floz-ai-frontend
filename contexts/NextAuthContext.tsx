"use client";
import { SessionProvider } from "next-auth/react";

const NextAuthProvider = (props) => {
  return (
    <SessionProvider session={props.session}>{props.children}</SessionProvider>
  );
};

export default NextAuthProvider;
