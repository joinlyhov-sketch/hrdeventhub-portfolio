"use client";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { ChevronUp, ClipboardList } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { useState } from "react";

export default function VisibilitySelect() {
  const [open, setOpen] = useState(false);

  return (
    <Select.Root open={open} onOpenChange={setOpen}>
      <SelectTrigger
        className="
          h-[110px]
          w-[250px]
          rounded-[24px]
          border-1px
          border-primary
          bg-card
          px-3
          shadow-none
          focus:ring-0
          focus:ring-offset-0
        "
      >
        <div className="flex w-80 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-end justify-center rounded-[18px] bg-muted">
              <ClipboardList size={18} className="text-secondary" />
            </div>

            <SelectValue
              placeholder="Select"
              className="text-[18px] text-muted-foreground"
            />
          </div>

          <ChevronUp
            size={18}
            className={`pointer-events-none size-4 text-muted-foreground transition-transform flex-end ${
              open ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      </SelectTrigger>

      <SelectContent
        position="popper"
        sideOffset={10}
        align="end"
        className="
          w-[200px]
          p-3
          rounded-[20px]
          border
          border-primary
          bg-card
        "
      >
        <SelectItem
          value="always-visible"
          className="rounded-xl type-detail-medium text-foreground focus:bg-muted"
        >
          Always Visible
        </SelectItem>

        <SelectItem
          value="after-voting"
          className="rounded-xl type-detail-medium text-foreground focus:bg-muted"
        >
          After Voting
        </SelectItem>

        <SelectItem
          value="after-poll-expire"
          className="rounded-xl type-detail-medium text-foreground focus:bg-muted"
        >
          After Poll Expire
        </SelectItem>
      </SelectContent>
    </Select.Root>
  );
}
