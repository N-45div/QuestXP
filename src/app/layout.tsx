import type { Metadata } from "next";
import "./globals.css";
import { CivicAuthProvider } from "@civic/auth-web3/react";

export const metadata: Metadata = {
  title: "QuestXP",
  description: "Play games, earn points, and get token airdrops with QuestXP and Civic Auth integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CivicAuthProvider clientId={process.env.CLIENT_ID || ""}>
          {children}
        </CivicAuthProvider>
      </body>
    </html>
  );
}
