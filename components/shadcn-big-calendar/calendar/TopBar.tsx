import { CalendarDays } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-white px-4 pt-4 pb-3 lg:px-12">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="type-title flex items-center gap-2">
            <CalendarDays className="text-action" size={20} />
            <span className="text-primary">Calendar</span>
          </h1>
          <p className="type-desc mt-1 text-muted-foreground">
            Review all of the events in this page
          </p>
        </div>
      </header>
    </div>
  );
}
