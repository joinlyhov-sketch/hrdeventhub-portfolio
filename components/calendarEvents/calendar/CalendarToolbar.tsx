import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarView } from "../../../types/calendar";

type Props = {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
};

const views: CalendarView[] = ["month", "week", "day"];

export default function CalendarToolbar({ view, onViewChange }: Props) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex gap-2">
        <button title="Previous" className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-card text-primary">
          <ChevronLeft size={18} />
        </button>

        <button className="type-detail-semibold flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-primary">
          <CalendarDays size={16} />
          April 2026
        </button>

        <button title="Next" className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-card text-primary">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {views.map((item) => (
          <button
            key={item}
            onClick={() => onViewChange(item)}
            className={`type-detail-medium px-6 py-3 capitalize transition ${
              view === item
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
