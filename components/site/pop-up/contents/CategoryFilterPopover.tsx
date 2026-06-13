"use client";

import * as React from "react";
import { Filter, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";

export interface FilterOption {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface CategoryFilterPopoverProps {
  options: FilterOption[];
  activeFilter: string | null;
  onFilterChange: (value: string | null) => void;
}

export default function CategoryFilterPopover({
  options,
  activeFilter,
  onFilterChange,
}: CategoryFilterPopoverProps) {
  const [open, setOpen] = React.useState(false);

  const currentLabel = options.find((opt) => opt.value === activeFilter)?.label;
  const ActiveIcon =
    options.find((opt) => opt.value === activeFilter)?.icon ?? Filter;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="
            flex 
            items-center 
            gap-2 
            bg-primary 
            text-white 
            px-3 sm:px-4
            py-3 
            rounded-full 
            type-detail-semibold 
            hover:bg-primary-hover 
            transition-all 
            shadow-sm 
            whitespace-nowrap 
            select-none
            h-auto
          "
        >
          {activeFilter ? <ActiveIcon size={18} /> : <Filter size={18} />}
          <span className="hidden sm:inline">
            {activeFilter ? `Category: ${currentLabel}` : "Filter by category"}
          </span>
          {activeFilter && <span className="sm:hidden">{currentLabel}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="
          w-48 sm:w-56 
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
          {activeFilter && (
            <button
              type="button"
              onClick={() => {
                onFilterChange(null);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all mb-1 cursor-pointer"
            >
              Clear Filter
            </button>
          )}

          {options.map((option) => {
            const Icon = option.icon;
            const isActive = activeFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onFilterChange(option.value);
                  setOpen(false);
                }}
                className={`
                  w-full 
                  flex 
                  items-center 
                  gap-3 
                  px-3 sm:px-4 
                  py-2.5 sm:py-3 
                  text-sm 
                  cursor-pointer 
                  font-medium 
                  rounded-xl 
                  transition-all 
                  duration-150
                  ${
                    isActive
                      ? "bg-blue-50 text-primary font-semibold"
                      : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-900"
                  }
                `}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-primary" : "text-gray-500"}
                />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}