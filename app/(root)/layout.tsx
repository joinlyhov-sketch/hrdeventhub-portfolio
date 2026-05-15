import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/site/AppSidebar";
import { TooltipProvider } from "../../components/ui/tooltip";
import { Metadata } from "next";

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
    <div className="min-h-full  flex flex-col max-w-full pr-8 pr-8 lg:pr-12 lg:pl-12">
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          {children}
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
