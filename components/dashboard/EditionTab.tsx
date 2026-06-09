"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Megaphone, BookOpenTextIcon } from "lucide-react";
import { Button } from "../ui/button";

export function EditionTabs({
  groupId = "",
  postId = "",
  category = "",
}: {
  groupId: string | null;
  postId: string | null;
  category: string | null | undefined;
}) {
  const pathname = usePathname();
  const navigationItems = [
    {
      href: "/event-management/edition/event",
      label: "Event",
      icon: CalendarDays,
      type: "event",
    },
    {
      href: "/event-management/edition/announcement",
      label: "Announcement",
      icon: Megaphone,
      type: "announcement",
    },
    {
      href: "/event-management/edition/article",
      label: "Article",
      icon: BookOpenTextIcon,
      type: "article",
    },
  ];

  return (
    <div className="mt-6 md:mt-8 grid grid-cols-3 bg-muted p-1 rounded-xl border border-border">
      {navigationItems.map((item) => {
        const Icon = item.icon;

        const isActive = pathname === item.href;
        const isDisabled = category !== item.type;

        return (
          <Button
            key={item.href}
            disabled={isDisabled}
            variant={isActive ? "default" : "ghost"}
            className={`
        w-full rounded-lg
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
          >
            {isDisabled ? (
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
            ) : (
              <Link
                href={`${item.href}?groupId=${groupId}&postId=${postId}`}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )}
          </Button>
        );
      })}
    </div>
  );
}
