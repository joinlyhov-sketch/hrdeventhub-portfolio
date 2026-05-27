import { CalendarMinus2, Clock, MapPin } from "lucide-react";
import { MOCK_EVENTS } from "../../../data/event-detail";

export default function DetailContentComponent() {
  const event = MOCK_EVENTS[0];
  return (
    <section className="flex flex-col justify-between gap-y-3.2 h-full w-full ml-1">
      <section className="space-y-1">
        <p className="text-subtitle font-semibold text-secondary">
          {event.eventTitle}
        </p>
        <p className="text-desc text-grey-500">{event.description}</p>
      </section>

      <section className="flex flex-col gap-y-2">
        <span className="flex  items-center gap-x-3">
          <CalendarMinus2 size={18} className="text-grey-500" />
          <p className="text-detail-semibold font-semibold text-grey-700">
            {event.date}
          </p>
        </span>
        <span className="flex  items-center gap-x-3">
          <Clock size={18} className="text-grey-500" />
          <p className="text-detail-semibold font-semibold text-grey-700">
            {event.time}
          </p>
        </span>
        <span className="flex  items-center gap-x-3">
          <MapPin size={20} className="text-grey-500" />
          <p className="text-detail-semibold font-semibold text-grey-700">
            {event.location}
          </p>
        </span>
      </section>

      <section className="flex flex-col gap-y-2">
        <section className="flex items-center gap-x-2.5 pt-2">
          <p className="text-detail text-grey-600">
            Joined by <span className="font-semibold">{event.joinedCount}</span>{" "}
            others
          </p>
          <section className="flex -space-x-2.5 isolation-auto">
            {event.joinedUserAvatars?.map((url, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-cover bg-center bg-no-repeat border-2 border-white ring-1 ring-slate-200/50"
                style={{
                  backgroundImage: `url(${url})`,
                  zIndex: event.joinedUserAvatars.length - index,
                }}
                aria-label={`joined user profile ${index + 1}`}
              />
            ))}
          </section>
        </section>
      </section>

      <div className="w-full bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 text-xs text-gray-500 space-y-1 mt-1 mb-4">
        <p className="font-semibold text-gray-700">General Information:</p>
        <p>
          • Please head directly to the reception counter to sign your name on
          the physical attendance list.
        </p>
        <p>• The schedule might change slightly on the day of the event.</p>
      </div>
    </section>
  );
}
