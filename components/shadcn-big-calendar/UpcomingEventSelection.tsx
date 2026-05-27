import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { upcomingEvents } from "@/data/calendarData";

export default function UpcomingEventSection() {
  const groupedEvents = upcomingEvents.reduce<
    Record<string, typeof upcomingEvents>
  >((acc, event) => {
    if (!acc[event.month]) {
      acc[event.month] = [];
    }

    acc[event.month].push(event);

    return acc;
  }, {});

  return (
    <section className="mt-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="inline-flex size-10 items-center justify-center rounded-lg bg-action/10 text-action">
          <CalendarDays size={20} />
        </div>

        <h2 className="type-title text-primary">
          Upcoming <span className="text-action">Event</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {Object.entries(groupedEvents).map(([month, events]) => (
          <div key={month}>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-action" />

              <h3 className="type-subtitle text-primary">{month}</h3>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="flex items-center rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex min-w-[80px] flex-col items-center border-r border-border pr-5">
                    <h3 className="type-title text-primary">{event.day}</h3>

                    <p className="type-detail-small-medium text-action">
                      {event.date}
                    </p>
                  </div>

                  <div className="ml-5 flex-1">
                    <h4 className="type-desc-semibold text-foreground">
                      {event.title}
                    </h4>

                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock3 size={14} />

                        <span className="type-detail">{event.time}</span>
                      </div>

                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin size={14} />

                        <span className="type-detail">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <button className="type-detail-semibold rounded-lg bg-muted px-5 py-3 text-primary transition hover:bg-primary hover:cursor-pointer hover:text-primary-foreground">
                    View Detail
                  </button>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
