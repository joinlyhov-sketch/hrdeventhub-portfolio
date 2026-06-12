"use client";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { workspaceService } from "@/service/workspace.service";

export function useMyWorkspaces() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const { data, error, isLoading, mutate } = useSWR(
    token ? ["workspaces-me", token] : null,
    () => workspaceService.getMyWorkspaces(token!)
  );

  return {
    workspaces: data ?? [],
    isLoading,
    error,
    mutate,
  };
}