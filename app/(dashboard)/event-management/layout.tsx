import { EventManagementNavbar } from "../../../components/dashboard/EventManagementNavbar";
import { Metadata } from "next";
import Header from "../../../components/dashboard/header/Header";

export const metadata: Metadata = {
  title: { default: "Event Hub", template: "%s | HRD Event Hub" },
  icons: { icon: "/favicon.ico" },
  description: "A platform for managing and promoting HRD events.",
};

export default function EventManagementLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="w-full bg-white sticky top-0 z-20">
         <Header
        titlePrimary="Event"
        titleSecondary="Management"
        description="Monitor participant responses and review insights from completed community surveys."
      />
      </div>
      <main className="flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12">
        {children}
      </main>
    </div>
  );
}
