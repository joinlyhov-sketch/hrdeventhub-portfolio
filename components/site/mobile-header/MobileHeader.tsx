"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useNotificationStore } from "@/store/useNotificationStore";
import Image from "next/image";

export function MobileHeader() {
  const router = useRouter();
const pathname = usePathname();
  const searchParams = useSearchParams();
  const { unreadCount } = useNotificationStore();

  const isChatRoute = pathname.startsWith("/chat");
  const isMobileChatOpen = isChatRoute && !!searchParams.get("target");

  if (isMobileChatOpen) return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 md:hidden"
      style={{ height: 56, paddingTop: "env(safe-area-inset-top)" }}
    >
      <button
        onClick={() => router.push("/")}
        aria-label="Go to home"
        className="flex items-center shrink-0 h-8"
      >
        <Image
          src="/images/Logo.webp"
          alt="HRD EventHub Logo"
          width={140} 
          height={32}
          priority
          className="h-full w-auto object-contain"
        />
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/notifications")}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 dark:bg-gray-900 ring-2 ring-gray-100 dark:ring-gray-800 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-300" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span
              className="absolute top-0.5 right-0.5 flex items-center justify-center rounded-full bg-red-500 text-white font-bold ring-2 ring-white dark:ring-gray-950"
              style={{
                minWidth: 15,
                height: 15,
                fontSize: 9,
                padding: "0 3px",
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}