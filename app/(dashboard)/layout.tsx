import "../globals.css";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/site/AppSidebar";
import { TooltipProvider } from "../../components/ui/tooltip";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12">
          {children}
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}