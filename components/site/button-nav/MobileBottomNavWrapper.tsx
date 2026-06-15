"use client";
import { MobileBottomNav } from "@/components/site/button-nav/MobileBottomNav";
import { useNotificationStore } from "@/store/useNotificationStore";

export function MobileBottomNavWrapper() {
  const { unreadCount } = useNotificationStore();
  return <MobileBottomNav alertCount={unreadCount} />;
}