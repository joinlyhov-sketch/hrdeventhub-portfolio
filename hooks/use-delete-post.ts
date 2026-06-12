"use client";

import useSWR, { useSWRConfig } from "swr";
import { useSession } from "next-auth/react";
import { postService } from "@/service/post.service";
import { deletePostAction } from "@/actions/post.action";

export function useWorkspacePosts(workspaceId: string) {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const { mutate: globalMutate } = useSWRConfig();

  const cacheKey = token ? ["workspace-posts", workspaceId, token] : null;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    () => postService.getByWorkspace(workspaceId, token!)
  );

  const deletePost = async (postId: string) => {
    try {
      await deletePostAction(workspaceId, postId);
      if (cacheKey) {
        globalMutate(cacheKey);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    posts: data ?? [],
    isLoading,
    error,
    deletePost,
  };
}