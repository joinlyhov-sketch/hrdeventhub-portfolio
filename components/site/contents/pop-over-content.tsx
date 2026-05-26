"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover/popover";
import { CalendarDays, FileText, Newspaper, Plus } from "lucide-react";



const options = [
  {
    label: "Event",
    icon: CalendarDays,
  },
  {
    label: "Announcement",
    icon: FileText,
  },
  {
    label: "Article",
    icon: Newspaper,
  },
];

export default function ContentTypePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="
          h-[44px]
              w-[72px]
              rounded-full
              bg-primary
              text-primary-foreground
              hover:bg-primary-hover
          "
        >
          <Plus size={28} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={14}
        className="
            w-[200px]
            rounded-[18px]
            border
            border-border
            bg-card
            p-3
            shadow-[0px_10px_30px_rgba(0,0,0,0.08)]
        "
      >
        <div className="flex flex-col gap-1">
          {options.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className="
                flex
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                transition-colors
                hover:bg-muted
                "
              >
                <Icon size={18} className="text-muted-foreground" />

                <span className="type-detail-medium text-foreground">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
