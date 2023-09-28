import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Project",
  description: "Project using lit-protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="flex justify-center  bg-white">
      <body className="w-60 bg-cyan-50 h-screen py-4 px-2">{children}</body>
    </html>
  );
}
