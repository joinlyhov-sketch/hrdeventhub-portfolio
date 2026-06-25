"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { eventService } from "@/service/event.service";
import { workspaceService } from "@/service/workspace.service";

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
  const shouldFetch = Boolean(token && normalizedRole);

  const cacheKey =
    normalizedRole === "admin"
      ? ["calendar-events", "admin-platform-all-v2", token]
      : ["calendar-events", "all-my-workspaces", normalizedRole, token];

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? cacheKey : null,
    async () => {
      if (normalizedRole === "admin") {
        return eventService.getAllPlatformEvents(token!);
      }
      const myWorkspaces = await workspaceService.getMyWorkspaces(token!);
      if (!myWorkspaces || myWorkspaces.length === 0) return [];

      const allEventsNested = await Promise.all(
        myWorkspaces.map(async (workspace) => {
          const events = await eventService.getByWorkspace(
            token!,
            workspace.workspaceId,
          );
          return events.map((event) => ({
            ...event,
            sourceWorkspaceId: event.sourceWorkspaceId || workspace.workspaceId,
            sourceWorkspaceName: event.sourceWorkspaceName || workspace.name,
          }));
        }),
      );
      const eventsById = new Map<string, (typeof allEventsNested)[0][0]>();
      allEventsNested.flat().forEach((event) => {
        if (!eventsById.has(event.postId)) {
          eventsById.set(event.postId, event);
        }
      });

      return Array.from(eventsById.values());
    },
    { revalidateOnFocus: false, dedupingInterval: 30_000 },
  );

  return {
    events: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
