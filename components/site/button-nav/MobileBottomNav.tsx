"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/context/user-context";
import { Users, Calendar, Bell, UserCircle, MoreHorizontal } from "lucide-react";
import { cn } from "@/libs/utils";

export function MobileBottomNav({ alertCount = 0 }: { alertCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { currentUser } = useCurrentUser();

  const profileHref = currentUser?.id ? `/profile/${currentUser.id}` : null;

  const NAV_ITEMS = [
    { label: "Group",    icon: Users,         href: "/group" },
    { label: "Calendar", icon: Calendar,       href: "/calendar" },
    { label: "Alerts", icon: Bell, href: "/notifications", id: "alerts" },
    { label: "Profile",  icon: UserCircle,     href: profileHref },
    { label: "More",     icon: MoreHorizontal, href: null, id: "more" },
  ];

  const handlePress = (item: (typeof NAV_ITEMS)[0]) => {
  if (item.id === "more") return setOpenMobile(true);
  if (item.href) router.push(item.href);
};

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = item.href ? pathname.startsWith(item.href) : false;

        return (
          <button
            key={item.label}
            onClick={() => handlePress(item)}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
              active
                ? "text-[#1c4d8d] dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            <span className="relative">
              <Icon size={22} strokeWidth={1.75} />
              {item.id === "alerts" && alertCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {alertCount > 9 ? "9+" : alertCount}
                </span>
              )}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}