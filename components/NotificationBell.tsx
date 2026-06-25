"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Bell,
  BellOff,
  CheckCheck,
  MoreHorizontal,
  Trash2,
  AlertCircle,
  BarChart2,
  CalendarDays,
  FileText,
} from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { NotificationPayload } from "@/types/notification";
import { cn } from "@/libs/utils";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { useStatusContext } from "@/context/StatusContext";

function resolveNotificationHref(n: NotificationPayload): string | null {
  if (!n.workspaceId || !n.postId) return null;
  const category = n.postCategory?.toLowerCase();
  if (category === "event") {
    let url = `/group/${n.workspaceId}/event/${n.postId}`;
    if (n.type === "MENTION") {
      url += "?action=comment";
    }
    return url;
  }
  const typeParam = category ? `&type=${category}` : "";
  let actionParam = "";
  if (n.type === "MENTION") {
    actionParam = "&action=comment";
  }
  return `/group/${n.workspaceId}?postId=${n.postId}${typeParam}${actionParam}`;
}

function TypeBadge({
  type,
  category,
}: {
  type: NotificationPayload["type"];
  category?: string | null;
}) {
  const base = "w-5 h-5 rounded-full flex items-center justify-center";
  const cat = category?.toLowerCase();
  switch (type) {
    case "POST_CREATED":
    case "POST_UPDATED":
      if (cat === "event")
        return (
          <div className={base} style={{ backgroundColor: "#1c4d8d" }}>
            <CalendarDays className="w-2.5 h-2.5 text-white" />
          </div>
        );
      if (cat === "survey")
        return (
          <div className={cn(base, "bg-amber-500")}>
            <BarChart2 className="w-2.5 h-2.5 text-white" />
          </div>
        );
      if (cat === "poll")
        return (
          <div className={cn(base, "bg-teal-500")}>
            <BarChart2 className="w-2.5 h-2.5 text-white" />
          </div>
        );
      return (
        <div
          className={base}
          style={{
            backgroundColor: type === "POST_UPDATED" ? "#2e7d32" : "#1c4d8d",
          }}
        >
          <FileText className="w-2.5 h-2.5 text-white" />
        </div>
      );
    case "POST_DELETED":
      return (
        <div className={cn(base, "bg-red-500")}>
          <AlertCircle className="w-2.5 h-2.5 text-white" />
        </div>
      );
    case "MENTION":
      return (
        <div className={cn(base, "bg-purple-500")}>
          <span className="text-white text-[9px] font-bold leading-none">
            @
          </span>
          <span className="text-white text-[9px] font-bold leading-none">
            @
          </span>
        </div>
      );
    case "SURVEY_CREATED":
      return (
        <div className={cn(base, "bg-amber-500")}>
          <BarChart2 className="w-2.5 h-2.5 text-white" />
        </div>
      );
    case "POLL_CREATED":
      return (
        <div className={cn(base, "bg-teal-500")}>
          <BarChart2 className="w-2.5 h-2.5 text-white" />
        </div>
      );
    default:
      return (
        <div className={cn(base, "bg-gray-400")}>
          <Bell className="w-2.5 h-2.5 text-white" />
        </div>
      );
  }
}

function ActorAvatar({
  avatar,
  name,
  type,
  category,
}: {
  avatar?: string | null;
  name?: string | null;
  type: NotificationPayload["type"];
  category?: string | null;
}) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";
  return (
    <div className="relative shrink-0">
      {avatar ? (
        <img
          src={avatar}
          alt={name ?? "User"}
          className="w-11 h-11 rounded-full object-cover"
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-500">
            {initials}
          </span>
        </div>
      )}
      <div className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white rounded-full">
        <TypeBadge type={type} category={category} />
      </div>
    </div>
  );
}

function NotificationMenu({ onRemove }: { onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors hover:cursor-pointer" 
        aria-label="More options"
      >
        <MoreHorizontal className="w-3.5 h-3.5"  />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-32 rounded-xl bg-white border border-gray-100 shadow-lg overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
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
  const href =
    notification.type !== "POST_DELETED"
      ? resolveNotificationHref(notification)
      : null;
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 px-3 py-3 transition-colors",
        !notification.read ? "hover:bg-white" : "bg-white hover:bg-gray-100",
        href ? "cursor-pointer" : "cursor-default",
        href ? "cursor-pointer" : "cursor-default",
      )}
      style={!notification.read ? { backgroundColor: "#e8eef6" } : undefined}
      onClick={() => {
        onRead(notification.notificationId);
        onNavigate(href);
      }}
    >
      <ActorAvatar
        avatar={notification.actorAvatar}
        name={notification.actorName}
        type={notification.type}
        category={notification.postCategory}
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm leading-snug line-clamp-3",
            !notification.read ? "text-gray-900" : "text-gray-600",
          )}
        >
          {notification.message}
        </p>
        <p
          className="text-xs mt-1 font-medium"
          style={{ color: !notification.read ? "#1c4d8d" : "#9ca3af" }}
        >
          {timeAgo}
        </p>
      </div>
      <div className="shrink-0">
        <NotificationMenu
          onRemove={() => onRemove(notification.notificationId)}
        />
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
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    removeNotification,
  } = useNotificationStore();
  const { isDoNotDisturb } = useStatusContext();

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !panelRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (status !== "authenticated") return null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed top-4 right-6 z-[9999] hidden md:flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-colors",
          isDoNotDisturb
            ? "bg-gray-400 hover:bg-gray-500"
            : "bg-primary hover:bg-primary/90",
        )}
        aria-label={isDoNotDisturb ? "Notifications silenced" : "Notifications"}
      >
        {isDoNotDisturb ? (
          <BellOff className="w-5 h-5 text-white" />
        ) : (
          <Bell className="w-5 h-5 text-white" />
        )}
        {!isDoNotDisturb && unreadCount > 0 && (
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
            className="fixed z-[9999] w-80 sm:w-96 rounded-xl border bg-[#f0f2f5] shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-base"
                  style={{ color: "#1c4d8d" }}
                >
                  Notifications
                </span>
                {isDoNotDisturb && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-white bg-red-500 px-2 py-0.5 rounded-full">
                    <BellOff className="w-2.5 h-2.5" />
                    Do Not Disturb
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs font-medium transition-colors"
                  style={{ color: "#1c4d8d" }}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all as read
                </button>
              )}
            </div>

            {isDoNotDisturb && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border-b border-red-100 text-xs text-red-600">
                <BellOff className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Notifications are silenced. You won&apos;t be alerted for new
                  notifications.
                </span>
              </div>
            )}

            <div className="max-h-[460px] overflow-y-auto divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-white text-gray-400">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Bell className="w-6 h-6 opacity-40" />
                  </div>
                  <p className="text-sm font-semibold text-gray-500">
                    No notifications
                  </p>
                  <p className="text-xs mt-1 text-gray-400">
                    We&apos;ll notify you when something arrives
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <NotificationItem
                    key={n.notificationId}
                    notification={n}
                    onRead={markRead}
                    onRemove={removeNotification}
                    onNavigate={(href) => {
                      setOpen(false);
                      if (href) router.push(href);
                    }}
                  />
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
