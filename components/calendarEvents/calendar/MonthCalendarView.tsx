import { monthDays, monthEvents, weekDays } from "../../../data/calendarData";
import { Dot } from "lucide-react";

export default function MonthCalendarView() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-7 bg-primary text-primary-foreground">
        {weekDays.map((day) => (
          <div key={day} className="type-detail-semibold py-4 text-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {monthDays.map((day, index) => {
          const events = monthEvents.filter((event) => event.day === day);

          return (
            <div
              key={index}
              className="min-h-36 border-r border-t border-border bg-card p-3"
            >
              <span
                className={`type-detail ${
                  index < 3 ? "text-grey-300" : "text-foreground"
                }`}
              >
                {day}
              </span>

              <div className="mt-3 space-y-1">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-center w-full rounded-md border type-detail-small-medium ${
                      event.tone === "accent"
                        ? "border-accent bg-accent/10 text-accent"
                        : event.tone === "primary"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-action bg-action/10 text-action"
                    }`}
                  >
                    <Dot size={30} className="shrink-0" />
                    <span className="truncate">
                      {event.time} {event.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
