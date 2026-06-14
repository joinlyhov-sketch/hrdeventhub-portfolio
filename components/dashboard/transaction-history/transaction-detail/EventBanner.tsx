"use client";

import { Clock } from "lucide-react";
import { EventDetail } from "../../../../types/transaction-detail";
import Link from "next/link";

interface EventBannerProps {
  event: EventDetail;
}

export function EventBanner({ event }: EventBannerProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden h-64 bg-gray-800">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/78 to-transparent flex flex-col justify-between p-6">
        <span className="bg-[#7AF8DD] text-[#007261] type-detail-semibold font-bold px-3 py-1 rounded-full w-fit">
          {event.badge}
        </span>
        <div className="flex items-end justify-between">
          <div className="text-white">
            <h2 className="type-subtitle-24 font-bold mb-2">{event.title}</h2>
            <p className="type-desc-semibold text-gray-200 flex items-center gap-2">
              <span>
                <Clock width={18} height={18} />
              </span>
              {event.date}, {event.time} - {event.location}
            </p>
          </div>

          <Link
            href={`/group/${event.workspaceId}/event/${event.id}`}
            className="flex items-center justify-center bg-white text-secondary hover:bg-gray-100 type-desc-semibold w-[140px] h-[44px] rounded-lg"
          >
            View Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
