import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { cn } from "../libs/utils";
import Providers from "./provider";
import { UserProvider } from "../context/user-context";
import { SessionGuard } from "@/components/auth/SessionGuard";
import { Toaster } from "sonner";
import { NotificationProvider } from "@/context/NotificationProvider";
import { StatusProvider } from "@/context/StatusContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const getGoogleSansFlex = localFont({
  src: "./fonts/GoogleSansFlex.ttf",
  variable: "--font-google-sans-flex",
});

export const metadata: Metadata = {
  title: "Landing | HRD Event Hub",
  icons: { icon: "/favicon.ico" },
  description: "A platform for managing and promoting HRD events.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full scroll-smooth",
        "antialiased",
        getGoogleSansFlex.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body
        className={`${getGoogleSansFlex.className} min-h-full flex flex-col`}
      >
        <Providers>
          <UserProvider>
            <SessionGuard>
              <StatusProvider>
                <NotificationProvider>{children}</NotificationProvider>
              </StatusProvider>
            </SessionGuard>
          </UserProvider>
        </Providers>
        <Toaster position="top-right" richColors closeButton duration={3000} />
      </body>
    </html>
  );
}
