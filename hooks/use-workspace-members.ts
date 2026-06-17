"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { workspaceService } from "@/service/workspace.service";

export interface WorkspaceMember {
  appUserId: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  role?: string;
  username?: string;
}

export function useWorkspaceMembers(workspaceId: string) {
  const { data: session, status } = useSession();
  const token = session?.accessToken as string | undefined;

  const { data, error, isLoading, mutate } = useSWR(
    status === "authenticated" && workspaceId && token
      ? ["workspace-members", workspaceId]
      : null,
    () => workspaceService.getMembers(workspaceId, token!),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      keepPreviousData: true,
    }
  );

  return {
    members: (data?.payload as WorkspaceMember[]) ?? [],
    isLoading,
    error,
    refreshMembers: mutate,
  };
}