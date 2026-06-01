import { apiPost } from "@/libs/api";
import { CreatePostPayload, CreatePostResponse } from "@/types/post-types";

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
};
