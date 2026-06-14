import { getPostDetailAction } from "@/actions/post.action";
import useSWR from "swr";

interface UsePostDetailOptions {
  enabled?: boolean;
}

export function usePostDetail(
  workspaceId: string | undefined,
  postId: string | undefined,
  options?: UsePostDetailOptions,
) {
  const enabled = options?.enabled ?? true;

  const key =
    workspaceId && postId && enabled
      ? ["workspaces", workspaceId, "posts", postId]
      : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,

    async () => {
      if (!workspaceId || !postId) return null;

      const result = await getPostDetailAction(workspaceId, postId);

      if (!result) {
        throw new Error("Failed to fetch post details.");
      }

      return result;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  return {
    post: data,
    isLoading,
    isError: !!error,
    error: error instanceof Error ? error.message : "An error occurred",
    refresh: mutate,
  };
}
