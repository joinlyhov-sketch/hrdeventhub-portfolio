"use client";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { workspaceService } from "@/service/workspace.service";

export function useWorkspace(workspaceId: string) {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const { data, error, isLoading ,mutate} = useSWR(
    workspaceId && token ? ["workspace", workspaceId, token] : null,
    () => workspaceService.getById(workspaceId, token!)
  );

  return {
    workspaces: data ?? null,
    isLoading,
    isError: error,
    mutate,
  };
}