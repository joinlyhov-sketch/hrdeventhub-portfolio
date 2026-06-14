"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/context/user-context";
import { useSession, signOut } from "next-auth/react";
import { logoutAction } from "@/actions/auth.action";
import { Users, Calendar, Bell, UserCircle, MoreHorizontal, Settings, LogOut, UserPen, X } from "lucide-react";
import { cn } from "@/libs/utils";
import { useState } from "react";
import Image from "next/image";
import { LogoutModal } from "@/components/site/pop-up/commons/LogoutModal";

export function MobileBottomNav({ alertCount = 0 }: { alertCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { data: session } = useSession();
  const [showMore, setShowMore] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const profileHref = currentUser?.id ? `/profile/${currentUser.id}` : null;

  const NAV_ITEMS = [
    { label: "Group",    icon: Users,         href: "/group" },
    { label: "Alerts",   icon: Bell,          href: "/notifications", id: "alerts" },
    { label: "Profile",  icon: UserCircle,    href: profileHref },
    { label: "More",     icon: MoreHorizontal, href: null, id: "more" },
  ];

  const handlePress = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.id === "more") return setShowMore(true);
    if (item.href) router.push(item.href);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutOpen(false);
    setShowMore(false);
    if (session?.refreshToken) await logoutAction(session.refreshToken);
    signOut({ callbackUrl: "/" });
  };

  const MORE_ITEMS = [
    {
      label: "Edit Profile",
      icon: UserPen,
      href: profileHref ? `${profileHref}/edit-profile` : null,
    },
    {
      label: "Setting",
      icon: Settings,
      href: profileHref ? `${profileHref}/setting` : null,
    },
  ];

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.href ? pathname.startsWith(item.href) : false;
          const isMore = item.id === "more";

          return (
            <button
              key={item.label}
              onClick={() => handlePress(item)}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                active || (isMore && showMore)
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

      {showMore && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/40 md:hidden"
            onClick={() => setShowMore(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white dark:bg-gray-950 rounded-t-2xl shadow-xl md:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>
            {currentUser && (
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                  {currentUser.profilePicture ? (
                    <Image
                      src={currentUser.profilePicture}
                      alt={currentUser.name ?? "User"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#1c4d8d] uppercase">
                      {currentUser.avatarInitials ?? "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {currentUser.name ?? "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{currentUser.email ?? ""}</p>
                </div>

              </div>
            )}
            <div className="py-2">
              {MORE_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.href) router.push(item.href);
                      setShowMore(false);
                    }}
                    className="flex w-full items-center gap-4 px-5 py-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <Icon size={20} strokeWidth={1.75} className="text-gray-500" />
                    {item.label}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setShowMore(false);
                  setIsLogoutOpen(true);
                }}
                className="flex w-full items-center gap-4 px-5 py-4 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut size={20} strokeWidth={1.75} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}