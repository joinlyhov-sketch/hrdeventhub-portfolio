"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";

import type { CalendarView } from "@/types/calendar";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";

type Props = {
  view: CalendarView;
  date: Date;
  onViewChange: (view: CalendarView) => void;
  onNavigate: (date: Date) => void;
};

const views: CalendarView[] = ["month", "week", "day"];

export default function CalendarToolbar({
  view,
  date,
  onViewChange,
  onNavigate,
}: Props) {
  const safeDate =
    date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  const handlePrev = () => {
    if (view === "month") onNavigate(subMonths(safeDate, 1));
    if (view === "week") onNavigate(subWeeks(safeDate, 1));
    if (view === "day") onNavigate(subDays(safeDate, 1));
  };

  const handleNext = () => {
    if (view === "month") onNavigate(addMonths(safeDate, 1));
    if (view === "week") onNavigate(addWeeks(safeDate, 1));
    if (view === "day") onNavigate(addDays(safeDate, 1));
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          title="Previous"
          onClick={handlePrev}
          className="size-11 rounded-lg border-border bg-card text-primary"
        >
          <ChevronLeft size={18} />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-auto gap-2 rounded-lg border-border bg-card px-4 text-primary type-detail-semibold"
            >
              <CalendarDays size={16} />
              {format(safeDate, "MMMM yyyy")}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={safeDate}
              month={safeDate}
              onMonthChange={onNavigate}
              onSelect={(selectedDate) => {
                if (!selectedDate) return;
                onNavigate(selectedDate);
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="outline"
          title="Next"
          onClick={handleNext}
          className="size-11 rounded-lg border-border bg-card text-primary"
        >
          <ChevronRight size={18} />
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {views.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onViewChange(item)}
            className={`type-detail-medium px-6 py-3 capitalize transition-colors hover:cursor-pointer ${
              view === item
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-foreground hover:!bg-transparent hover:!text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
