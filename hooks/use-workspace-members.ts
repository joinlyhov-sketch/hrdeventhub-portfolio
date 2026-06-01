"use client";
import useSWR from "swr";
import { workspaceService } from "@/service/workspace.service";

export function useWorkspaceMembers(workspaceId: string) {
  const { data, error, isLoading } = useSWR(
    ["workspace-members", workspaceId],
    () => workspaceService.getMembers(workspaceId)
  );

  return {
    members: data ?? [],
    isLoading,
    error,
  };
}