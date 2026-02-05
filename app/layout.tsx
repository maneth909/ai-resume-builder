import "../styles/globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "JDify",
  description: "AI-Powered Resume Builder",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {/* <ThemeProvider> */}
        {/* <ResumeProvider> */}
        {children}
        {modal}
        {/* </ResumeProvider> */}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
