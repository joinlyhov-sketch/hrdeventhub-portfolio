"use client";

import { useMemo, useState } from "react";
import { useWorkspaceEvents } from "@/hooks/use-workspace-events";

type Props = {
  workspaceId?: string;
  role?: "admin" | "student" | "alumni" | "organizer";
};

export function useUpcomingEvents({ workspaceId, role }: Props) {
  const { events: workspaceEvents, isLoading, error, mutate } =
    useWorkspaceEvents(workspaceId, role);
  const [now] = useState(() => Date.now());
  const events = useMemo(
    () =>
      workspaceEvents
        .filter((event) => {
          const startTime = new Date(event.eventStart).getTime();
          return !Number.isNaN(startTime) && startTime >= now;
        })
        .sort(
          (a, b) =>
            new Date(a.eventStart).getTime() -
            new Date(b.eventStart).getTime(),
        ),
    [now, workspaceEvents],
  );

  return {
    events,
    isLoading,
    error,
    mutate,
  };
}
