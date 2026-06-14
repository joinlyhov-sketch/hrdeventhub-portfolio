"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/context/user-context";
import { useSession, signOut } from "next-auth/react";
import { logoutAction } from "@/actions/auth.action";
import { Bell, MoreHorizontal, LogOut} from "lucide-react";
import { cn } from "@/libs/utils";
import { useState } from "react";
import Image from "next/image";
import { LogoutModal } from "@/components/site/pop-up/commons/LogoutModal";


function IconGroup() {
  return (
    <svg width="22" height="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.87187 8.1525C6.79687 8.145 6.70687 8.145 6.62437 8.1525C4.83937 8.0925 3.42188 6.63 3.42188 4.83C3.42187 2.9925 4.90688 1.5 6.75188 1.5C8.58938 1.5 10.0819 2.9925 10.0819 4.83C10.0744 6.63 8.65688 8.0925 6.87187 8.1525Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.3084 3C13.7634 3 14.9334 4.1775 14.9334 5.625C14.9334 7.0425 13.8084 8.1975 12.4059 8.25C12.3459 8.2425 12.2784 8.2425 12.2109 8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.11906 10.92C1.30406 12.135 1.30406 14.115 3.11906 15.3225C5.18156 16.7025 8.56406 16.7025 10.6266 15.3225C12.4416 14.1075 12.4416 12.1275 10.6266 10.92C8.57156 9.5475 5.18906 9.5475 3.11906 10.92Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.7539 15C14.2939 14.8875 14.8039 14.67 15.2239 14.3475C16.3939 13.47 16.3939 12.0225 15.2239 11.145C14.8114 10.83 14.3089 10.62 13.7764 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconBell() {
  return <Bell size={22} strokeWidth={1.75} />;
}

function IconMore() {
  return <MoreHorizontal size={22} strokeWidth={1.75} />;
}

function IconProfile() {
  return (
    <svg width="22" height="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.4436 16.5C15.4436 13.5975 12.5561 11.25 9.00109 11.25C5.44609 11.25 2.55859 13.5975 2.55859 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconEditProfile() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.4083 11.8048L11.7532 14.4598C11.6482 14.5648 11.5508 14.7598 11.5283 14.9023L11.3858 15.9148C11.3333 16.2823 11.5883 16.5373 11.9558 16.4848L12.9682 16.3423C13.1107 16.3198 13.3133 16.2223 13.4108 16.1173L16.0657 13.4623C16.5232 13.0048 16.7407 12.4723 16.0657 11.7973C15.3982 11.1298 14.8658 11.3473 14.4083 11.8048Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.0273 12.1875C14.2523 12.9975 14.8823 13.6275 15.6923 13.8525" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.55859 16.5C2.55859 13.5975 5.44611 11.25 9.00111 11.25C9.78111 11.25 10.5311 11.3625 11.2286 11.5725" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconSetting() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.5 9.66105V8.34105C1.5 7.56105 2.1375 6.91605 2.925 6.91605C4.2825 6.91605 4.8375 5.95605 4.155 4.77855C3.765 4.10355 3.9975 3.22605 4.68 2.83605L5.9775 2.09355C6.57 1.74105 7.335 1.95105 7.6875 2.54355L7.77 2.68605C8.445 3.86355 9.555 3.86355 10.2375 2.68605L10.32 2.54355C10.6725 1.95105 11.4375 1.74105 12.03 2.09355L13.3275 2.83605C14.01 3.22605 14.2425 4.10355 13.8525 4.77855C13.17 5.95605 13.725 6.91605 15.0825 6.91605C15.8625 6.91605 16.5075 7.55355 16.5075 8.34105V9.66105C16.5075 10.4411 15.87 11.0861 15.0825 11.0861C13.725 11.0861 13.17 12.0461 13.8525 13.2236C14.2425 13.9061 14.01 14.7761 13.3275 15.1661L12.03 15.9086C11.4375 16.2611 10.6725 16.0511 10.32 15.4586L10.2375 15.3161C9.5625 14.1386 8.4525 14.1386 7.77 15.3161L7.6875 15.4586C7.335 16.0511 6.57 16.2611 5.9775 15.9086L4.68 15.1661C3.9975 14.7761 3.765 13.8986 4.155 13.2236C4.8375 12.0461 4.2825 11.0861 2.925 11.0861C2.1375 11.0861 1.5 10.4411 1.5 9.66105Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MobileBottomNav({ alertCount = 0 }: { alertCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { data: session } = useSession();
  const [showMore, setShowMore] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const profileHref = currentUser?.id ? `/profile/${currentUser.id}` : null;

  const NAV_ITEMS = [
    { label: "Group",    icon: IconGroup,   href: "/group" },
    { label: "Alerts",   icon: IconBell,    href: "/notifications", id: "alerts" },
    { label: "Profile",  icon: IconProfile, href: profileHref },
    { label: "More",     icon: IconMore,    href: null, id: "more" },
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
      icon: IconEditProfile,
      href: profileHref ? `${profileHref}/edit-profile` : null,
    },
    {
      label: "Setting",
      icon: IconSetting,
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
                <Icon />
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
          <div
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white dark:bg-gray-950 rounded-t-2xl shadow-xl md:hidden"
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
                    <Icon />
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