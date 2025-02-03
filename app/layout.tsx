import AuthProvider from "@middlewares/AuthProvider";
import NextAuthProvider from "../contexts/NextAuthContext";
import "./globals.css";
import "./index.css"

export const metadata = {
  title: "FLOZ Cost",
  description: "Cost Estimator Web App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <AuthProvider>{children}</AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
