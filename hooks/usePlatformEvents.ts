"use client";

import useSWR from "swr";
import { eventService } from "@/service/event.service";

const fetchEvents = async ([_, token]: [string, string]) => {
  return eventService.getAllPlatformEventsWithAttendees(token);
};

export function usePlatformEvents(token?: string) {
  return useSWR(token ? ["platform-events", token] : null, fetchEvents);
}
