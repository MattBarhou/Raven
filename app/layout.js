import { Quicksand } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const quicksand = Quicksand({ weight: "600", subsets: ["latin"] });

export const metadata = {
  title: "Raven",
  description: "Where Your Voice Takes Flight",
  image: "/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body className={quicksand.className}>
        <SessionProvider>{children}</SessionProvider>
        <p className="text-center mb-2">© Matthew Barhou 2025</p>
      </body>
    </html>
  );
}
