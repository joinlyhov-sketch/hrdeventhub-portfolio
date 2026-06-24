import useSWR from "swr";
import { useSession } from "next-auth/react";
import { postService } from "@/service/post.service";

export function useWorkspaceFeed(workspaceId: string, page: number = 1, size: number = 20) {
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const { data, error, isLoading, mutate } = useSWR(
    workspaceId && token ? `/workspaces/${workspaceId}/feed?page=${page}&size=${size}` : null,
    async () => postService.getWorkspaceFeed(workspaceId, token, page, size),
    { revalidateOnFocus: false, dedupingInterval: 10_000 }
  );

  return {
    feedItems: data ?? [],
    isLoading: isLoading || !token,
    isError: error,
    mutate,
  };
}