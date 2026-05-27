import { Clock3 } from "lucide-react";

export default function WeekCalendarView() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-[42px_repeat(7,1fr)] bg-primary text-primary-foreground">
        <div className="flex h-[49px] items-center justify-center border-r border-white/30">
          <Clock3 size={16} />
        </div>
      </div>
    </div>
  );
}
