  "use client";
  import useSWR from "swr";
  import { useSession } from "next-auth/react";
  import { workspaceService } from "@/service/workspace.service";
  import { GetWorkspacesParams } from "@/types/workspace-type/group";

  export function useWorkspaces(params: GetWorkspacesParams = {}) {
    const { data: session } = useSession();
    const token = session?.accessToken;

    const { data, error, isLoading, mutate } = useSWR(
      token ? ["workspaces", params, token] : null,
      () => workspaceService.getAllWithFilters(token!, params)
    );

    return {
      workspaces: data?.workspaces ?? [],
      totalPages: data?.totalPages ?? 1,
      isLoading,
      error,
      mutate,
    };
  }