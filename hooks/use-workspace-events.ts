"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { eventService } from "@/service/event.service";

type UserRole = "admin" | "student" | "alumni" | "organizer";

export function useWorkspaceEvents(workspaceId?: string, role?: UserRole) {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const shouldFetch = Boolean(token && (role === "admin" || workspaceId));

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ["calendar-events", role ?? "workspace", workspaceId, token] : null,
    () => {
      if (role === "admin") {
        return eventService.getAll(token!, 1, 100);
      }

      return eventService.getByWorkspace(token!, workspaceId!);
    },
  );

  return {
    events: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
