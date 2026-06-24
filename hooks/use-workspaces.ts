"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { workspaceService } from "@/service/workspace.service";
import { GetWorkspacesParams } from "@/types/workspace-type/group";

type UserRole = "admin" | "student" | "alumni" | "organizer";

export function useWorkspaces(
  paramsOrRole: GetWorkspacesParams | UserRole | null = {},
) {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const role =
    typeof paramsOrRole === "string" ? paramsOrRole : undefined;
  const params =
    typeof paramsOrRole === "string" || paramsOrRole === null
      ? {}
      : paramsOrRole;

  const { data, error, isLoading, mutate } = useSWR(
    token && paramsOrRole !== null
      ? ["workspaces", role ?? "admin-list", params, token]
      : null,
    async () => {
      if (role && role !== "admin") {
        const workspaces = await workspaceService.getMyWorkspaces(token!);
        return { workspaces, totalPages: 1 };
      }

      return workspaceService.getAllWithFilters(token!, params);
    },
    { revalidateOnFocus: false, dedupingInterval: 30_000 }
  );

  return {
    workspaces: data?.workspaces ?? [],
    totalPages: data?.totalPages ?? 1,
    isLoading,
    error,
    mutate,
  };
}
