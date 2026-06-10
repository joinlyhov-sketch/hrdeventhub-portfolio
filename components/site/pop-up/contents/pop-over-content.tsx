"use client";

import * as React from "react";
import Link from "next/link";
import { LucideIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";

export interface PopoverItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface ContentTypePopoverProps {
  items: PopoverItem[];
}

export default function ContentTypePopover({ items }: ContentTypePopoverProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="
            h-10
            w-10
            rounded-full
            bg-primary
            text-white
            hover:bg-primary-hover
            transition-all
            shadow-sm
            relative
            overflow-hidden
          "
        >
          <div
            className={`
              transform 
              transition-transform 
              duration-300 
              flex 
              items-center 
              justify-center
              ${open ? "rotate-45" : "rotate-0"}
            `}
          >
            <Plus size={20} />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="
          w-56
          bg-white
          border
          border-gray-100
          rounded-2xl
          shadow-xl
          p-2
          data-[state=open]:animate-in 
          data-[state=closed]:animate-out 
          data-[state=open]:fade-in-0 
          data-[state=closed]:fade-out-0 
          data-[state=open]:slide-in-from-top-2 
          data-[state=closed]:slide-out-to-top-2 
          duration-200
        "
      >
        <div className="flex flex-col">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="
                  group
                  w-full 
                  flex 
                  items-center 
                  gap-3 
                  px-4 
                  py-3 
                  text-sm 
                  font-medium 
                  text-gray-600 
                  hover:bg-blue-50/50 
                  hover:text-blue-900 
                  rounded-xl 
                  transition-all 
                  duration-150 
                  cursor-pointer
                "
              >
                <Icon
                  size={18}
                  className="text-gray-400 group-hover:text-blue-900 transition-colors"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
