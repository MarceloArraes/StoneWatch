import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { TRPCProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StoneWatch",
  description: "Production error tracking for stonemasonry",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body
        className="min-h-screen flex flex-col"
        style={{
          fontFamily: "var(--font-body)",
          background: "#0C1520",
          color: "#EAE5D9",
        }}
      >
        <SessionProvider>
          <TRPCProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
