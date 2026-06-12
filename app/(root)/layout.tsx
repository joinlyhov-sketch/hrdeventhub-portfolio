import "../globals.css";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/site/AppSidebar";
import { TooltipProvider } from "../../components/ui/tooltip";
import { Metadata } from "next";
import { NotificationProvider } from "@/context/NotificationProvider";
import { NotificationBell } from "@/components/NotificationBell";

export const metadata: Metadata = {
  title: {
    default: "Event Hub",
    template: "%s | HRD Event Hub",
  },
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
    <div>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
            {children}
        </SidebarProvider>
      </TooltipProvider>      
    </div>
  );
}
