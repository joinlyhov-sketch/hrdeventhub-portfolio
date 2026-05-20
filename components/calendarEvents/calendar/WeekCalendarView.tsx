import { Clock3 } from "lucide-react";
import {
  weekEvents,
  weekHeaderDays,
  weekDayTimeSlots,
} from "../../../data/calendarData";

const ROW_HEIGHT = 42;
const CALENDAR_HEIGHT = 400;

export default function WeekCalendarView() {
  const timelineHeight = weekDayTimeSlots.length * ROW_HEIGHT;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-[42px_repeat(7,1fr)] bg-primary text-primary-foreground">
        <div className="flex h-[44px] items-center justify-center border-r border-white/30">
          <Clock3 size={16} />
        </div>
        {weekHeaderDays.map((item, index) => (
          <div
            key={item.day}
            className={`flex h-[44px] flex-col items-center justify-center border-r border-white/30 text-center ${
              index === 1 ? "bg-primary-hover/40" : ""
            }`}
          >
            <p className="text-[8px] font-semibold uppercase leading-none opacity-80">
              {item.day}
            </p>
            <h3 className="mt-1 text-[16px] font-bold leading-none text-white">
              {item.date}
            </h3>
          </div>
        ))}
      </div>
      <div className="overflow-y-auto" style={{ height: CALENDAR_HEIGHT }}>
        <div
          className="relative grid grid-cols-[42px_repeat(7,1fr)]"
          style={{ height: timelineHeight }}
        >
          <div
            className="absolute left-0 right-0 z-20 h-px bg-destructive"
            style={{ top: ROW_HEIGHT * 3 }}
          >
            <span className="absolute left-[36px] -top-1.5 size-3 rounded-full bg-destructive" />
          </div>
          <div>
            {weekDayTimeSlots.map((time) => (
              <div
                key={time}
                className="flex justify-center border-b border-r border-border pt-1"
                style={{ height: ROW_HEIGHT }}
              >
                <span className="text-[8px] font-semibold leading-tight text-muted-foreground">
                  {time}
                </span>
              </div>
            ))}
          </div>
          {weekHeaderDays.map((_, dayIndex) => (
            <div key={dayIndex} className="relative bg-card">
              {weekDayTimeSlots.map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="border-b border-r border-border"
                  style={{ height: ROW_HEIGHT }}
                />
              ))}

              {weekEvents
                .filter((event) => event.dayIndex === dayIndex)
                .map((event) => (
                  <article
                    key={event.id}
                    style={{ top: event.top }}
                    className={`absolute left-[4px] right-[4px] rounded-[4px] border-l-[3px] px-2 py-1.5 ${
                      event.tone === "accent"
                        ? "border-accent bg-accent/10 text-accent"
                        : event.tone === "primary"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-destructive bg-destructive/10 text-destructive"
                    }`}
                  >
                    <h4 className="text-[8px] font-bold uppercase leading-none">
                      {event.title}
                    </h4>

                    <p className="mt-1 text-[7px] font-medium leading-none">
                      {event.time}
                    </p>
                  </article>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
