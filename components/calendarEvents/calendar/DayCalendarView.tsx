import { MapPin, Utensils } from "lucide-react";
import { dayEvents } from "../../../data/calendarData";

const timeSlots = [
  "4 AM",
  "8 AM",
  "9 AM",
  "12 PM",
  "1 PM",
  "4 PM",
  "8 PM",
  "11 PM",
];

export default function DayCalendarView() {
  return (
    <div className="relative rounded-xl bg-card px-8 py-6">
      <div className="mb-4 ml-16">
        <p className="type-detail-small-medium text-muted-foreground">SUN</p>
        <h2 className="type-subtitle text-foreground">01</h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-[258px] z-20 h-px bg-destructive">
          <span className="absolute -left-1 -top-1.5 size-3 rounded-full bg-destructive" />
        </div>

        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-[64px_1fr]">
            <div className="type-detail-small-medium flex justify-center pt-0 text-foreground">
              {time}
            </div>

            <div className="h-[76px] border-t border-border" />
          </div>
        ))}

        <article className="absolute left-[80px] right-4 top-[155px] border-l-4 border-primary bg-primary/10 px-4 py-3">
          <h3 className="type-detail-semibold text-primary">
            Tech Innovation Summit
          </h3>

          <p className="type-detail-small-medium flex items-center gap-1 text-foreground">
            <MapPin size={13} />
            Grand Ballroom, Level 4
          </p>

          <p className="type-detail-small-medium mt-1 text-primary">
            9:15 AM - 11:30 AM
          </p>
        </article>

        <article className="absolute left-[80px] right-4 top-[340px] border-l-4 border-accent bg-accent/10 px-4 py-3">
          <h3 className="type-detail-semibold text-accent">
            Executive Networking Luncheon
          </h3>

          <p className="type-detail-small-medium flex items-center gap-1 text-foreground">
            <Utensils size={13} />
            Sky Lounge
          </p>

          <p className="type-detail-small-medium mt-1 text-accent">
            1:00 PM - 2:30 PM
          </p>
        </article>
      </div>
    </div>
  );
}
