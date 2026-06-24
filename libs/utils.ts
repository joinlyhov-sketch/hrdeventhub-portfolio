import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initials(name = ""): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
}

export function formatTime(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function formatMessageTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000);
  const startOfWeek = new Date(startOfToday.getTime() - 6 * 86_400_000);

  if (date >= startOfToday) {
    return time;
  }
  if (date >= startOfYesterday) {
    return `Yesterday ${time}`;
  }
  if (date >= startOfWeek) {
    const day = date.toLocaleDateString([], { weekday: "short" });
    return `${day} ${time}`;
  }

  const sameYear = date.getFullYear() === now.getFullYear();
  const datePart = date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  return `${datePart} ${time}`;
}

export function formatConvTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";

  const now            = new Date();
  const todayStart     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - 6);

  if (date >= todayStart) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true,
      timeZone: "Asia/Phnom_Penh",
    });
  }
  if (date >= yesterdayStart) return "Yesterday";
  if (date >= weekStart) {
    return date.toLocaleDateString("en-US", {
      weekday: "long", timeZone: "Asia/Phnom_Penh",
    });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
    timeZone: "Asia/Phnom_Penh",
  });
}