import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { isMobile } from "react-device-detect";
import { WebLayout } from "../component/Layout/WebLayout";
import { MobileLayout } from "../component/Layout/MobileLayout";
import AuthProvider from "@/lib/next-auth";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Duck mbti",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {isMobile ? (
          <AuthProvider>
            <MobileLayout>{children}</MobileLayout>
          </AuthProvider>
        ) : (
          <AuthProvider>
            <WebLayout>{children}</WebLayout>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
