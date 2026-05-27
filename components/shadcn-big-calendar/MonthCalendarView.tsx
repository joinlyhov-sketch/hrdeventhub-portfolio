import { monthDays, monthEvents, weekDays } from "@/data/calendarData";

export default function MonthCalendarView() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-7 bg-primary text-primary-foreground">
        {weekDays.map((day) => (
          <div
            key={day}
            className="flex h-[42px] items-center justify-center border-r border-white/20 type-detail-semibold"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {monthDays.map((day, index) => {
          const events = monthEvents.filter((event) => event.day === day);
          const isPreviousMonth = index < 3;
          const isActiveDay = day === 5;
          return (
            <div
              key={`${day}-${index}`}
              className={`min-h-[112px] border-r border-t border-border bg-card p-3 ${
                isActiveDay ? "border-t-2 border-t-accent" : ""
              }`}
            >
              <span
                className={`type-detail ${
                  isPreviousMonth ? "text-grey-300" : "text-foreground"
                } ${isActiveDay ? "text-accent" : ""}`}
              >
                {day}
              </span>

              <div className="mt-3 space-y-1.5">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`flex h-[24px] w-full items-center gap-1.5 rounded-md border px-2 text-[10px] font-semibold leading-none ${
                      event.tone === "accent"
                        ? "border-accent bg-accent/10 text-accent"
                        : event.tone === "primary"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-action bg-action/10 text-action"
                    }`}
                  >
                    <span
                      className={`size-2 shrink-0 rounded-full ${
                        event.tone === "accent"
                          ? "bg-accent"
                          : event.tone === "primary"
                            ? "bg-primary"
                            : "bg-action"
                      }`}
                    />
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
