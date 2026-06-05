"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Megaphone, BookOpenTextIcon } from "lucide-react";
import { Button } from "../ui/button";

export function EditionTabs({
  groupId = "",
  postId = "",
}: {
  groupId: string | null;
  postId: string | null;
}) {
  const pathname = usePathname();
  const navigationItems = [
    {
      href: "/event-management/edition/event",
      label: "Event",
      icon: CalendarDays,
    },
    {
      href: "/event-management/edition/announcement",
      label: "Announcement",
      icon: Megaphone,
    },
    {
      href: "/event-management/edition/article",
      label: "Article",
      icon: BookOpenTextIcon,
    },
  ];

  return (
    <div className="mt-6 md:mt-8 grid grid-cols-3 bg-muted p-1 rounded-xl border border-border">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "default" : "ghost"}
            className={`w-full rounded-lg text-detail-medium ${
              isActive
                ? "shadow-sm text-primary-foreground bg-primary"
                : "bg-transparent hover:bg-transparent border-0"
            }`}
          >
            <Link
              href={`${item.href}?groupId=${groupId}&postId=${postId}`}
              className="flex items-center py-5 justify-center gap-2"
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-primary"}`}
              />
              <span
                className={`truncate ${isActive ? "text-primary-foreground" : "text-primary"}`}
              >
                {item.label}
              </span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
