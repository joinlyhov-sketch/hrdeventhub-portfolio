"use client";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { postService } from "@/service/post.service";

export function useWorkspacePosts(workspaceId: string) {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const { data, error, isLoading, mutate } = useSWR(
    workspaceId && token ? ["workspace-posts", workspaceId, token] : null,
    () => postService.getByWorkspace(workspaceId, token!)
  );

  return {
    posts: data ?? [],
    isLoading,
    error,
    mutate,
  };
}