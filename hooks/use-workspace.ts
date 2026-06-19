"use client";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { workspaceService } from "@/service/workspace.service";

export function useWorkspace(workspaceId: string) {
  const { data: session } = useSession();
  const token = session?.accessToken;

    const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR(
    session?.accessToken ? ["workspaces-me", session.accessToken] : null,
    ([, token]) => workspaceService.getMyWorkspaces(token)
  );

  return {
    workspaces: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}