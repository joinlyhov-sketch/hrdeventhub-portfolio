"use client";

import { Bell, Trash2, CheckCheck } from "lucide-react";
import Image from "next/image";
import { useNotificationStore } from "@/store/useNotificationStore";
import { NotificationPayload } from "@/types/notification";
import { cn } from "@/libs/utils";
import { formatDistanceToNow } from "date-fns";

function NotificationIcon({ type }: { type: NotificationPayload["type"] }) {
  const base =
    "w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0";
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

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    removeNotification,
  } = useNotificationStore();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#1c4d8d]">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      <div className="flex-1 divide-y">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Bell className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs mt-1 opacity-70">
              We will notify you when something arrives
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.notificationId}
              className={cn(
                "flex items-start gap-3 px-4 py-4 hover:bg-muted/50 cursor-pointer group transition-colors active:bg-muted",
                !n.read && "bg-blue-50 dark:bg-blue-950/20",
              )}
              onClick={() => markRead(n.notificationId)}
            >
              {n.actorAvatar ? (
                <Image
                  src={n.actorAvatar}
                  alt={n.actorName}
                  width={36}
                  height={36}
                  unoptimized
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
              ) : (
                <NotificationIcon type={n.type} />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">
                  {n.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(n.notificationId);
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                  aria-label="Remove notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
