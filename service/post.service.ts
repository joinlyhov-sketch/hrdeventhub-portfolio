import { getSession } from "next-auth/react";
import { apiGet } from "@/libs/api";
import { PostsResponse, Post } from "@/types/posts";

const getToken = async () => {
  const session = await getSession();
  return session?.accessToken;
};

export const postService = {
  getByWorkspace: async (
    workspaceId: string,
    page: number = 1,
    size: number = 10
  ): Promise<Post[]> => {
    const token = await getToken();
    const response = await apiGet<PostsResponse>(
      `/workspaces/${workspaceId}/post?page=${page}&size=${size}`,
      { authToken: token }
    );
    return response.payload;
  },
};