import "../globals.css";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/site/AppSidebar";
import { TooltipProvider } from "../../components/ui/tooltip";
import { Metadata } from "next";
import { MobileBottomNavWrapper } from "@/components/site/button-nav/MobileBottomNavWrapper";

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
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <div className="flex flex-col flex-1 min-w-0 w-full ">
            {children}
          </div>
            <MobileBottomNavWrapper />
        </SidebarProvider>
      </TooltipProvider>      
    </div>
  );
}
