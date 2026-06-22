"use client";

import { useRouter } from "next/navigation";
import { Bell, Trash2, MoreHorizontal, CheckCheck, AlertCircle, BarChart2, CalendarDays, FileText, MessageCircle } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { NotificationPayload } from "@/types/notification";
import { cn } from "@/libs/utils";
import { formatDistanceToNow } from "date-fns";
import { useRef, useState, useEffect } from "react";

//filter

type Filter = "all" | "post" | "update" | "mention" | "message";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",     label: "All" },
  { key: "post",    label: "Posts" },
  { key: "update",  label: "Updates" },
  { key: "mention", label: "Mentions" },
  { key: "message", label: "Messages" },
];

function matchesFilter(n: NotificationPayload, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "post")    return n.type === "POST_CREATED" || n.type === "SURVEY_CREATED" || n.type === "POLL_CREATED";
  if (filter === "update")  return n.type === "POST_UPDATED" || n.type === "POST_DELETED";
  if (filter === "mention") return n.type === "MENTION";
  if (filter === "message") return n.type === "NEW_MESSAGE";
  return true;
}

//noti menu

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
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
        aria-label="More options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 w-36 rounded-xl bg-white border border-gray-100 shadow-lg overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function resolveNotificationHref(n: NotificationPayload): string | null {
  if (n.type === "NEW_MESSAGE") {
    return n.actorName ? `/chat?target=${encodeURIComponent(n.actorName)}` : null;
  }
  if (!n.workspaceId || !n.postId) return null;
  const category = n.postCategory?.toLowerCase();
  if (category === "event") return `/group/${n.workspaceId}/event/${n.postId}`;
  const typeParam = category ? `&type=${category}` : "";
  return `/group/${n.workspaceId}?postId=${n.postId}${typeParam}`;
}

function TypeBadge({ type, category }: {
  type: NotificationPayload["type"];
  category?: string | null;
}) {
  const base = "w-5 h-5 rounded-full flex items-center justify-center";
  const cat = category?.toLowerCase();

  switch (type) {
    case "POST_CREATED":
    case "POST_UPDATED":
      if (cat === "event") {
        return (
          <div className={cn(base)} style={{ backgroundColor: "#1c4d8d" }}>
            <CalendarDays className="w-2.5 h-2.5 text-white" />
          </div>
        );
      }
      if (cat === "survey") {
        return (
          <div className={cn(base, "bg-amber-500")}>
            <BarChart2 className="w-2.5 h-2.5 text-white" />
          </div>
        );
      }
      if (cat === "poll") {
        return (
          <div className={cn(base, "bg-teal-500")}>
            <BarChart2 className="w-2.5 h-2.5 text-white" />
          </div>
        );
      }
      return (
        <div className={cn(base)} style={{ backgroundColor: type === "POST_UPDATED" ? "#2e7d32" : "#1c4d8d" }}>
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
          <span className="text-white text-[9px] font-bold leading-none">@</span>
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
    case "NEW_MESSAGE":
      return (
        <div className={cn(base, "bg-blue-500")}>
          <MessageCircle className="w-2.5 h-2.5 text-white" />
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

function ActorAvatar({ avatar, name, type, category }: {
  avatar?: string | null;
  name?: string | null;
  type: NotificationPayload["type"];
  category?: string | null;
}) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="relative shrink-0">
      {avatar ? (
        <img
          src={avatar}
          alt={name ?? "User"}
          className="w-14 h-14 rounded-full object-cover"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-500">{initials}</span>
        </div>
      )}
      <div className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white rounded-full">
        <TypeBadge type={type} category={category} />
      </div>
    </div>
  );
}

//gruop logic

type Group = "new" | "earlier-today" | "yesterday" | "older";

function getGroup(createdAt: string): Group {
  const now = new Date();
  const date = new Date(createdAt);
  const diffH = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  if (diffH <= 3) return "new";
  if (date >= todayStart) return "earlier-today";
  if (date >= yesterdayStart) return "yesterday";
  return "older";
}

const GROUP_ORDER: Group[] = ["new", "earlier-today", "yesterday", "older"];

const GROUP_LABELS: Record<Group, string> = {
  "new":           "New",
  "earlier-today": "Earlier today",
  "yesterday":     "Yesterday",
  "older":         "Older",
};

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="px-3 pt-4 pb-1 text-[13px] font-semibold text-gray-500 tracking-wide">
      {label}
    </p>
  );
}

//notification row

function NotificationRow({
  n,
  onRemove,
  onNavigate,
}: {
  n: NotificationPayload;
  onRemove: (id: string) => void;
  onNavigate: (n: NotificationPayload) => void;
}) {
  const href = n.type !== "POST_DELETED" ? resolveNotificationHref(n) : null;
  const timeAgo = formatDistanceToNow(new Date(n.createdAt), { addSuffix: true });

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 px-3 py-3  transition-colors",
        !n.read ? "hover:bg-white" : "bg-white hover:bg-gray-100",
        href ? "cursor-pointer" : "cursor-default"
      )}
      style={!n.read ? { backgroundColor: "#e8eef6" } : undefined}
      onClick={() => onNavigate(n)}
    >
      <ActorAvatar
        avatar={n.actorAvatar}
        name={n.actorName}
        type={n.type}
        category={n.postCategory}
      />

      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm leading-snug line-clamp-3",
          !n.read ? "text-gray-900" : "text-gray-600"
        )}>
          {n.message}
        </p>
        <p
          className="text-xs mt-1 font-medium"
          style={{ color: !n.read ? "#1c4d8d" : "#9ca3af" }}
        >
          {timeAgo}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 shrink-0">
        <NotificationMenu onRemove={() => onRemove(n.notificationId)} />
      </div>
    </div>
  );
}

//main component

export function NotificationsClient() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const { notifications, unreadCount, markRead, markAllRead, removeNotification } =
    useNotificationStore();

  const handleNavigate = (n: NotificationPayload) => {
    markRead(n.notificationId);
    if (n.type === "POST_DELETED") return;
    const href = resolveNotificationHref(n);
    if (href) router.push(href);
  };

  const filtered = notifications.filter((n) => matchesFilter(n, activeFilter));

  const grouped = GROUP_ORDER.reduce<Record<Group, NotificationPayload[]>>(
    (acc, g) => ({ ...acc, [g]: [] }),
    {} as Record<Group, NotificationPayload[]>
  );
  for (const n of filtered) {
    grouped[getGroup(n.createdAt)].push(n);
  }

  const hasAny = filtered.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white px-4 pt-5 pb-0 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold" style={{ color: "#1c4d8d" }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "#1c4d8d" }}
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
          {FILTERS.map(({ key, label }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={cn(
                  "relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors rounded-none border-b-2",
                  isActive
                    ? "border-b-2 text-[#1c4d8d]"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                )}
                style={isActive ? { borderBottomColor: "#1c4d8d" } : undefined}
              >
                {label}
                {key !== "all" && (() => {
                  const count = notifications.filter(
                    (n) => !n.read && matchesFilter(n, key)
                  ).length;
                  return count > 0 ? (
                    <span
                      className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: "#1c4d8d" }}
                    >
                      {count}
                    </span>
                  ) : null;
                })()}
                {key === "all" && unreadCount > 0 && (
                  <span
                    className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: "#1c4d8d" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 px-2 py-2">
        {!hasAny ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-base font-semibold text-gray-500">No notifications</p>
            <p className="text-sm mt-1 text-gray-400">
              {activeFilter === "all"
                ? "We will notify you when something arrives"
                : `No ${FILTERS.find(f => f.key === activeFilter)?.label.toLowerCase()} notifications`}
            </p>
          </div>
        ) : (
          GROUP_ORDER.map((group) => {
            const items = grouped[group];
            if (items.length === 0) return null;
            return (
              <div key={group}>
                <SectionHeader label={GROUP_LABELS[group]} />
                <div>
                  {items.map((n) => (
                    <NotificationRow
                      key={n.notificationId}
                      n={n}
                      onRemove={removeNotification}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}