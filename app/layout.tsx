import "../styles/globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "JDify",
  description: "AI-Powered Resume Builder",
  // icons: {
  //   icon: [
  //     {
  //       url: "/logo.png", // Ensure this file is in /public folder
  //       href: "/logo.png", // Some browsers look for href
  //     },
  //   ],
  //   shortcut: "/logo.png",
  //   apple: "/logo.png",
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
