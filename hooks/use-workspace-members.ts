"use client";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { workspaceService } from "@/service/workspace.service";

export function useWorkspaceMembers(workspaceId: string) {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const { data, error, isLoading } = useSWR(
    workspaceId && token ? ["workspace-members", workspaceId, token] : null,
    () => workspaceService.getMembers(workspaceId, token!)
  );

  return {
    members: data ?? [],
    isLoading,
    error,
  };
}