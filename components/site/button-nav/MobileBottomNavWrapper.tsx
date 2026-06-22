"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { MobileBottomNav } from "@/components/site/button-nav/MobileBottomNav";


export function MobileBottomNavWrapper() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isChatRoute = pathname.startsWith("/chat");
  const isMobileChatOpen = isChatRoute && !!searchParams.get("target");

  if (isMobileChatOpen) return null;

  return <MobileBottomNav/>;
}