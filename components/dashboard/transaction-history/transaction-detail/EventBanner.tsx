"use client";

import { Clock } from "lucide-react";
import { EventDetail } from "../../../../types/transaction-detail";
import { Button } from "../../../ui/button";

interface EventBannerProps {
  event: EventDetail;
}

export function EventBanner({ event }: EventBannerProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 bg-gray-800">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-6">
        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit">
          {event.badge}
        </span>
        <div className="flex items-end justify-between">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <p className="text-sm flex items-center gap-2">
              <span>
                <Clock />
              </span>{" "}
              {event.date}, {event.time} - {event.location}
            </p>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg">
            View Detail
          </Button>
        </div>
      </div>
    </div>
  );
}
