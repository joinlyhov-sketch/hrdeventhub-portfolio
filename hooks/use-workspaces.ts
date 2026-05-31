"use client";
import useSWR from "swr";
import { workspaceService } from "@/service/workspace.service";
import { GetWorkspacesParams } from "@/types/group";

export function useWorkspaces(params: GetWorkspacesParams = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    ["workspaces", params],
    () => workspaceService.getAllWithFilters(params)
  );

  return {
    workspaces: data ?? [],
    isLoading,
    error,
    mutate,
  };
}