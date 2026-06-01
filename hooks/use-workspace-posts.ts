"use client";
import useSWR from "swr";
import { postService } from "@/service/post.service";

export function useWorkspacePosts(workspaceId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    workspaceId ? ["workspace-posts", workspaceId] : null,
    () => postService.getByWorkspace(workspaceId)
  );

  return {
    posts: data ?? [],
    isLoading,
    error,
    mutate,
  };
}