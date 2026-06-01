// hooks/use-workspace.ts
"use client";
import useSWR from "swr";
import { workspaceService } from "@/service/workspace.service";

export function useWorkspace(workspaceId: string) {
  const { data, error, isLoading } = useSWR(
    workspaceId ? ["workspace", workspaceId] : null,
    () => workspaceService.getById(workspaceId)
  );

  return {
    workspace: data ?? null,
    isLoading,
    error,
  };
}