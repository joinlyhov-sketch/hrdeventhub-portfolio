"use client";

import { Briefcase, MapPin, Utensils } from "lucide-react";
import { EventTone } from "../../../types/calendar";
import { weekDayTimeSlots } from "../../../data/calendarData";

const ROW_HEIGHT = 60;
const TIME_COL_WIDTH = 70;
const CALENDAR_HEIGHT = 400;

type CalendarEvent = {
  id: number;
  title: string;
  location: string;
  time: string;
  startTime: string;
  endTime: string;
  tone: EventTone;
};

const dayEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Executive Networking Luncheon",
    location: "Sky Lounge",
    time: "1:00 PM - 2:30 PM",
    startTime: "1 PM",
    endTime: "2:30 PM",
    tone: "accent" as EventTone,
  },
  {
    id: 2,
    title: "Team Meeting",
    location: "Office Room",
    time: "4:00 PM - 5:30 PM",
    startTime: "4 PM",
    endTime: "5:30 PM",
    tone: "primary" as EventTone,
  },
];

function getHourFromTime(time: string) {
  const [raw, period] = time.split(" ");
  const [h, m = "0"] = raw.split(":");

  let hour = Number(h);
  const minute = Number(m);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 24;

  return hour + minute / 60;
}

function getTop(time: string) {
  return (getHourFromTime(time) - 12) * ROW_HEIGHT;
}

function getHeight(startTime: string, endTime: string) {
  return (getHourFromTime(endTime) - getHourFromTime(startTime)) * ROW_HEIGHT;
}

export default function DayCalendarView() {
  const timelineHeight = weekDayTimeSlots.length * ROW_HEIGHT;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-card px-4 py-2">
        <div className="ml-[70px]">
          <p className="text-[8px] font-semibold uppercase leading-none text-muted-foreground">
            SUN
          </p>
          <h2 className="mt-1 text-[16px] font-bold leading-none text-foreground">
            01
          </h2>
        </div>
      </div>
      <div className="overflow-y-auto" style={{ height: CALENDAR_HEIGHT }}>
        <div
          className="relative grid"
          style={{
            height: timelineHeight,
            gridTemplateColumns: `${TIME_COL_WIDTH}px 1fr`,
          }}
        >
          <div
            className="absolute left-0 right-0 z-20 h-px bg-destructive"
            style={{ top: ROW_HEIGHT * 4 }}
          >
            <span
              className="absolute -top-1.5 size-3 rounded-full bg-destructive"
              style={{ left: TIME_COL_WIDTH - 6 }}
            />
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
          <div className="relative bg-card">
            {weekDayTimeSlots.map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="border-b border-border"
                style={{ height: ROW_HEIGHT }}
              />
            ))}

            {dayEvents.map((event, index) => {
              const Icon =
                index === 0 ? Utensils : index === 1 ? MapPin : Briefcase;
              return (
                <article
                  key={event.id}
                  style={{
                    top: getTop(event.startTime),
                    height: getHeight(event.startTime, event.endTime),
                  }}
                  className={`absolute left-[8px] right-[8px] rounded-[4px] border-l-[3px] px-2 py-1.5 ${
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

                  <p className="mt-1 flex items-center gap-1 text-[7px] font-medium leading-none text-muted-foreground">
                    <Icon size={9} />
                    {event.location}
                  </p>

                  <p className="mt-1 text-[7px] font-medium leading-none">
                    {event.time}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
