"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/context/user-context";
import { useSession, signOut } from "next-auth/react";
import { logoutAction } from "@/actions/auth.action";
import { LogOut, MessageCircleMore } from "lucide-react";
import { cn } from "@/libs/utils";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { LogoutModal } from "@/components/site/pop-up/commons/LogoutModal";
import { useChatStore } from "@/store/useChatStore"; 

import {
  IconGroup,
  IconMore,
  IconProfile,
  IconEditProfile,
  IconSetting,
  IconScan,
} from "./NavIcons";
import { QRScannerModal } from "../button-nav/qr-scan/QRScannerModal";
import { CheckInSuccessModal } from "../button-nav/qr-scan/CheckInSuccessModal";
import { CheckInErrorModal } from "../button-nav/qr-scan/CheckInErrorModal";
import type {
  CheckInResult,
  CheckInError,
} from "../../../types/bottom-nav/types";

function IconChat() {
  return (
    <MessageCircleMore />
  );
}

const SCANNER_ROLES = ["ADMIN", "ORGANIZER"];
const DIRECTION_THRESHOLD = 4;

function useScrollFade() {
  const [scrolling, setScrolling] = useState(false);
  const lastYRef = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    function handleScroll() {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastYRef.current;

        if (Math.abs(diff) > DIRECTION_THRESHOLD) {
          setScrolling(diff > 0 && currentY > 20);
        }
        lastYRef.current = currentY;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrolling;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isLoading } = useCurrentUser();
  const { data: session } = useSession();
  const [showMore, setShowMore] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null);
  const [checkInError, setCheckInError] = useState<CheckInError | null>(null);
  const searchParams = useSearchParams();
  const isScrolling = useScrollFade();

  const totalUnreadMessages = useChatStore((s) =>
    s.conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
  );

  const isChatRoute = pathname.startsWith("/chat");
  const isMobileChatOpen = isChatRoute && !!searchParams.get("target");

  if (isMobileChatOpen) return null;
  const profileHref = currentUser?.id ? `/profile/${currentUser.id}` : null;
  const canScan = currentUser
    ? SCANNER_ROLES.includes(currentUser.role.toUpperCase())
    : false;
  const showCenterSlot = canScan;

  const LEFT_ITEMS = [
    { label: "Group", icon: IconGroup, href: "/group" },
    { label: "Chat",  icon: IconChat,  href: "/chat" },
  ];
  const RIGHT_ITEMS = [
    { label: "Profile", icon: IconProfile, href: profileHref },
    { label: "More",    icon: IconMore,    href: null, id: "more" },
  ];

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

  const handlePress = (item: { href: string | null; id?: string }) => {
    if (item.id === "more") return setShowMore(true);
    if (item.href) router.push(item.href);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutOpen(false);
    setShowMore(false);
    if (session?.refreshToken) await logoutAction(session.refreshToken);
    signOut({ callbackUrl: "/" });
  };

  const openScanner = () => {
    setCheckInResult(null);
    setCheckInError(null);
    setShowScanner(true);
  };

  const navItemClass = (active: boolean) =>
    cn(
      "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors relative",
      active
        ? "text-[#1c4d8d] dark:text-blue-400"
        : "text-gray-500 dark:text-gray-400",
    );

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 flex items-end border-t border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 md:hidden transition-all duration-300 ease-in-out will-change-transform",
          isScrolling ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {LEFT_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.href ? pathname.startsWith(item.href) : false;
          const isChatTab = item.label === "Chat";

          return (
            <button
              key={item.label}
              onClick={() => handlePress(item)}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={navItemClass(active)}
            >
              <div className="relative">
                <Icon />
                {isChatTab && totalUnreadMessages > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-gray-950 animate-in zoom-in-50 duration-200">
                    {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}

        {showCenterSlot && (
          <div
            className="relative flex flex-col items-center"
            style={{ width: 72, flexShrink: 0 }}
          >
            <button
              onClick={openScanner}
              aria-label="Scan attendee QR code"
              className={cn(
                "absolute -top-6 flex items-center justify-center",
                "h-[58px] w-[58px] rounded-2xl",
                "bg-[#1c4d8d] text-white",
                "shadow-lg shadow-[#1c4d8d]/40",
                "ring-2 ring-white dark:ring-gray-950",
                "active:scale-95 transition-transform duration-150",
              )}
            >
              <IconScan />
            </button>
            <span
              className="mt-1 pb-7 text-[10px] text-transparent select-none"
              aria-hidden
            >
              ·
            </span>
          </div>
        )}

        {RIGHT_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.href ? pathname.startsWith(item.href) : false;
          const isMore = item.id === "more";
          return (
            <button
              key={item.label}
              onClick={() => handlePress(item)}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={navItemClass(active || (isMore && showMore))}
            >
              <Icon />
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
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser.email ?? ""}
                  </p>
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

      {showScanner && session?.accessToken && (
        <QRScannerModal
          token={session.accessToken as string}
          onClose={() => setShowScanner(false)}
          onSuccess={(result) => {
            setShowScanner(false);
            setCheckInResult(result);
          }}
          onError={(err) => {
            setShowScanner(false);
            setCheckInError(err);
          }}
        />
      )}

      {checkInResult && (
        <CheckInSuccessModal
          result={checkInResult}
          onClose={() => setCheckInResult(null)}
          onScanAgain={openScanner}
        />
      )}

      {checkInError && (
        <CheckInErrorModal
          error={checkInError}
          onClose={() => setCheckInError(null)}
          onScanAgain={openScanner}
        />
      )}

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}