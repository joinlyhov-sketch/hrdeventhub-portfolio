import { NotificationsClient } from "@/components/site/notifications/NotificationsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}