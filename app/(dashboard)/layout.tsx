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
        <div className="flex flex-col flex-1 min-w-0 w-full">
          {children}
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}