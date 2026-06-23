"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { eventService } from "@/service/event.service";

type UserRole = "admin" | "student" | "alumni" | "organizer";

const normalizeRole = (role?: string): UserRole | undefined => {
  const normalized = role?.toLowerCase();
  if (
    normalized === "admin" ||
    normalized === "student" ||
    normalized === "alumni" ||
    normalized === "organizer"
  ) {
    return normalized;
  }

  return undefined;
};

export function useWorkspaceEvents(workspaceId?: string, role?: string) {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const normalizedRole = normalizeRole(role || session?.user?.role);
  const shouldFetch = Boolean(
    token && (normalizedRole === "admin" || workspaceId),
  );
  const cacheKey =
    normalizedRole === "admin"
      ? ["calendar-events", "admin-platform-all-v2", token]
      : ["calendar-events", "workspace", workspaceId, token];

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? cacheKey : null,
    () => {
      if (normalizedRole === "admin") {
        return eventService.getAllPlatformEvents(token!);
      }

      return eventService.getByWorkspace(token!, workspaceId!);
    },
    { revalidateOnFocus: false, dedupingInterval: 30_000 }
  );

  return {
    events: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
