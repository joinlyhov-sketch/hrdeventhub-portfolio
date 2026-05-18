import { EventManagementNavbar } from "../../../components/dashboard/EventManagementNavbar";
import { Metadata } from "next";

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
      <div className="w-full bg-white sticky top-0 z-10">
        <EventManagementNavbar />
      </div>
      {children}
    </div>
  );
}
