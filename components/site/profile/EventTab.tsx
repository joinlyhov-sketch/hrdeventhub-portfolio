import { ChevronRight } from "lucide-react";

export default function EventTab() {
  const events = [
    {
      id: 1,
      name: "Coding Challenge",
      date: "April 6, 2026",
      image: "/images/codingchallenge.png",
    },
    {
      id: 2,
      name: "Khmer New Year",
      date: "April 14, 2026",
      image: "/images/khmernewyear.png",
    },
    {
        id: 3,
      name: "Closing Day",
      date: "July 9, 2026",
      image: "/images/closingDay.png",
    },
    {
        id: 4,
      name: "Montly Party",
      date: "May 22, 2026",
      image: "/images/monthlyparty.png",
    },
    {
        id: 5,
      name: "Pchum Ben Day",
      date: "Oct 10, 2026",
      image: "/images/pchumben.png",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="type-subtitle text-primary mb-2">All events</h3>
      <div className="space-y-3">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-border rounded-lg bg-grey-50 hover:bg-grey-100 transition-colors duration-200"
          >
            <div className="flex gap-4 items-center">
              <div className="w-24 h-16 bg-muted border border-border/40 rounded-md shrink-0 overflow-hidden relative">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover block"
                  onError={(e) => {
                    console.error(`Failed to load asset path: ${event.image}`);
                  }}
                />
              </div>

              <div>
                <p className="type-desc-semibold text-secondary">
                  {event.name}
                </p>
                <p className="type-detail-small-medium text-muted-foreground">
                  {event.date}
                </p>
              </div>
            </div>

            <a href={`/group/${event.id}/event/${event.id}`} className="shrink-0">
              <button className="flex items-center gap-1 type-detail-small-medium text-muted-foreground border border-border bg-card px-3 py-1.5 rounded-md hover:border-primary transition-all duration-200 cursor-pointer">
              View Detail <ChevronRight size={14} />
            </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
