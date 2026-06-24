"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { pollService } from "@/service/poll.service";

export function useWorkspacePolls(workspaceId: string) {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const { data, error, isLoading, mutate } = useSWR(
    workspaceId && token ? ["workspace-polls", workspaceId, token] : null,
    () => pollService.getByWorkspace(workspaceId),
    { revalidateOnFocus: false, dedupingInterval: 10_000 }
  );

  return {
    polls: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
