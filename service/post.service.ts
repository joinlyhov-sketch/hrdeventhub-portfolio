import { apiGet, apiDelete } from "@/libs/api";
import { PostsResponse, Post } from "@/types/posts";

export const postService = {
  getByWorkspace: async (workspaceId: string, token: string, page = 1, size = 10): Promise<Post[]> => {
    const response = await apiGet<PostsResponse>(
      `/workspaces/${workspaceId}/post?page=${page}&size=${size}`,
      { authToken: token }
    );
    return response.payload;
  },

  delete: async (workspaceId: string, postId: string, token: string): Promise<any> => {
    return await apiDelete(`/workspaces/${workspaceId}/post/${postId}`, {
      headers: {
        accept: "*/*",
      },
      authToken: token,
    });
  },
};