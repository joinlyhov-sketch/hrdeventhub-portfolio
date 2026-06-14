"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Bell, Trash2, CheckCheck } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { NotificationPayload } from "@/types/notification";
import { cn } from "@/libs/utils";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";

function resolveNotificationHref(n: NotificationPayload): string | null {
  if (!n.workspaceId || !n.postId) return null;

  const category = n.postCategory?.toLowerCase();

  if (category === "event") {
    return `/group/${n.workspaceId}/event/${n.postId}`;
  }

  const typeParam = category ? `&type=${category}` : "";
  return `/group/${n.workspaceId}?postId=${n.postId}${typeParam}`;
}

function NotificationIcon({ type }: { type: NotificationPayload["type"] }) {
  const base =
    "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0";
  switch (type) {
    case "POST_CREATED":
      return <div className={cn(base, "bg-green-500")}>+</div>;
    case "POST_UPDATED":
      return <div className={cn(base, "bg-blue-500")}>✎</div>;
    case "POST_DELETED":
      return <div className={cn(base, "bg-red-500")}>✕</div>;
    case "MENTION":
      return <div className={cn(base, "bg-purple-500")}>@</div>;
    case "SURVEY_CREATED":
      return <div className={cn(base, "bg-amber-500")}>S</div>;
    case "POLL_CREATED":
      return <div className={cn(base, "bg-teal-500")}>P</div>;
    default:
      return <div className={cn(base, "bg-gray-400")}>!</div>;
  }
}

function NotificationItem({
  notification,
  onRead,
  onRemove,
  onNavigate,
}: {
  notification: NotificationPayload;
  onRead: (id: string) => void;
  onRemove: (id: string) => void;
  onNavigate: (href: string | null) => void;
}) {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  const href = notification.type !== "POST_DELETED"
    ? resolveNotificationHref(notification)
    : null;

  const handleClick = () => {
    onRead(notification.notificationId);
    onNavigate(href);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group",
        !notification.read && "bg-blue-50 dark:bg-blue-950/20",
        href ? "cursor-pointer" : "cursor-default"
      )}
      onClick={handleClick}
    >
      {notification.actorAvatar ? (
        <img
          src={notification.actorAvatar}
          alt={notification.actorName}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <NotificationIcon type={notification.type} />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!notification.read && (
          <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:hidden" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(notification.notificationId);
          }}
          className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full hover:bg-muted text-muted-foreground"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function NotificationBell() {
  const { status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markRead, markAllRead, removeNotification } =
    useNotificationStore();

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !panelRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleNavigate = (href: string | null) => {
    setOpen(false);
    if (href) router.push(href);
  };

  if (status !== "authenticated") return null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="fixed top-4 right-6 z-[9999] hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            style={{ top: pos.top, right: pos.right }}
            className="fixed z-[9999] w-80 sm:w-96 rounded-xl border bg-background shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[460px] overflow-y-auto divide-y">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Bell className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <NotificationItem
                    key={n.notificationId}
                    notification={n}
                    onRead={markRead}
                    onRemove={removeNotification}
                    onNavigate={handleNavigate}
                  />
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}