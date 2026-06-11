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
    <div className="z-10">
      <Header
        titlePrimary="User"
        titleSecondary="Management"
        description="Monitor participant responses and review insights from completed community surveys."
      />
      <main className="flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12 w-full">
        {children}
      </main>
    </div>
  );
}
