import { apiPost } from "@/libs/api";
import { CreatePostPayload, CreatePostResponse } from "@/types/post-types";
import { apiGet } from "@/libs/api";
import { PostsResponse, Post } from "@/types/posts";

export const postService = {
  createPost: async (
    workspaceId: string,
    payload: CreatePostPayload,
    authToken?: string,
  ): Promise<CreatePostResponse> => {
    return apiPost<CreatePostResponse, CreatePostPayload>(
      `/workspaces/${workspaceId}/post`,
      payload,
      { authToken },
    );
  },
  getByWorkspace: async (
    workspaceId: string,
    token: string,
    page: number = 1,
    size: number = 10,
  ): Promise<Post[]> => {
    const response = await apiGet<PostsResponse>(
      `/workspaces/${workspaceId}/post?page=${page}&size=${size}`,
      { authToken: token },
    );
    return response.payload;
  },
};
