import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { cn } from "../libs/utils";
import Providers from "./provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const getGoogleSansFlex = localFont({
  src: "./fonts/GoogleSansFlex.ttf",
  variable: "--font-google-sans-flex",
});

export const metadata: Metadata = {
  title: "Landing | HRD Event Hub",
  icons: {
    icon: "/favicon.ico",
  },
  description: "A platform for managing and promoting HRD events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        getGoogleSansFlex.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body
        className={`${getGoogleSansFlex.className} min-h-full flex flex-col`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
