"use client";
import useSWR from "swr";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { workspaceService } from "@/service/workspace.service";

const EMPTY_WORKSPACES: Awaited<ReturnType<typeof workspaceService.getMyWorkspaces>> = [];

export function useMyWorkspaces() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const { data, error, isLoading, mutate } = useSWR(
    token ? ["workspaces-me", token] : null,
    () => workspaceService.getMyWorkspaces(token!),
    { revalidateOnFocus: false, dedupingInterval: 30_000 }
  );

  const workspaces = useMemo(() => data ?? EMPTY_WORKSPACES, [data]);

  return {
    workspaces,
    isLoading,
    error,
    mutate,
  };
}