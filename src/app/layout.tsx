import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSession } from "../auth";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "../lib/utils";

// If using next/font
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_FRAME_NAME || "Ethereum Magicians",
  description: process.env.NEXT_PUBLIC_FRAME_DESCRIPTION || "Connecting Ethereum Magicians",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  const session = await getSession()

  return (
    <html lang="en" className={`${inter.variable} dark font-sans`} suppressHydrationWarning>
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
