"use client";

import { CheckCircle2, Plus, Search, ChartColumnBig, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";

export default function ActionButtons() {
  return (
    <div className="flex items-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="
              h-11
              w-18
              rounded-full
              bg-primary
              text-primary-foreground
              hover:bg-primary-hover
            "
          >
            <Plus size={24} />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={14}
          className="
            w-50
            rounded-[18px]
            border
            border-border
            bg-card
            p-3
            shadow-[0px_10px_30px_rgba(0,0,0,0.08)]
          "
        >
          <div className="flex flex-col gap-1">
            <button
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
              <CheckCircle2 size={18} className="text-muted-foreground" />

              <span className="type-detail-medium text-foreground">Survey</span>
            </button>

            <button
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
              <ChartColumnBig size={18} className="text-muted-foreground" />

              <span className="type-detail-medium text-foreground">Poll</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
