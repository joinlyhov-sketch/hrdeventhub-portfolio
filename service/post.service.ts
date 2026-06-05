import { apiPost, apiGet, apiDelete, apiPut } from "@/libs/api";
import {
  CreateAnnouncementPayload,
  CreateAnnouncementResponse,
  CreateArticleBackendResponse,
  CreateArticlePayload,
  CreatePostPayload,
  CreatePostResponse,
  CreatePostSuccessResponse,
  UpdateArticleApiResponse,
  UpdateArticlePayload,
  UpdateEventPayload,
} from "@/types/post-types";
import { PostsResponse, Post } from "@/types/posts";

export interface SinglePostResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Post;
  timestamp: string;
}

export const postService = {
  createEventPost: async (
    workspaceId: string,
    payload: CreatePostPayload,
    authToken: string,
  ): Promise<CreatePostResponse> => {
    return apiPost<CreatePostResponse, CreatePostPayload>(
      `/workspaces/${workspaceId}/post/event`,
      payload,
      { authToken },
    );
  },

  createAnnouncement: async (
    workspaceId: string,
    payload: CreateAnnouncementPayload,
    token?: string,
  ): Promise<CreateAnnouncementResponse> => {
    const path = `/workspaces/${workspaceId}/post/announcement`;

    return apiPost<CreateAnnouncementResponse, CreateAnnouncementPayload>(
      path,
      payload,
      {
        authToken: token,
        accept: "application/json",
      },
    );
  },

  createArticle: async (
    workspaceId: string,
    payload: CreateArticlePayload,
    token?: string,
  ): Promise<CreateArticleBackendResponse> => {
    const path = `/workspaces/${workspaceId}/post/article`;

    return apiPost<CreateArticleBackendResponse, CreateArticlePayload>(
      path,
      payload,
      {
        authToken: token,
        accept: "application/json",
      },
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

  getById: async (
    workspaceId: string,
    postId: string,
    token: string,
  ): Promise<Post> => {
    const response = await apiGet<SinglePostResponse>(
      `/workspaces/${workspaceId}/post/${postId}`,
      {
        headers: { accept: "*/*" },
        authToken: token,
      },
    );
    return response.payload;
  },

  delete: async (
    workspaceId: string,
    postId: string,
    token: string,
  ): Promise<any> => {
    return await apiDelete(`/workspaces/${workspaceId}/post/${postId}`, {
      headers: { accept: "*/*" },
      authToken: token,
    });
  },

  updateEventPost: async (
    workspaceId: string,
    postId: string,
    payload: UpdateEventPayload,
    authToken: string,
  ): Promise<CreatePostSuccessResponse> => {
    return apiPut<CreatePostSuccessResponse, UpdateEventPayload>(
      `/workspaces/${workspaceId}/post/${postId}/event`,
      payload,
      { authToken },
    );
  },
  updateAnnouncementPost: async (
    workspaceId: string,
    postId: string,
    payload: UpdateEventPayload,
    authToken: string,
  ): Promise<CreatePostSuccessResponse> => {
    return apiPut<CreatePostSuccessResponse, UpdateEventPayload>(
      `/workspaces/${workspaceId}/post/${postId}/announcement`,
      payload,
      { authToken },
    );
  },
  UpdateArticlePost: async (
    workspaceId: string,
    postId: string,
    payload: UpdateArticlePayload,
    authToken?: string,
  ): Promise<UpdateArticleApiResponse> => {
    const path = `/workspaces/${workspaceId}/post/${postId}/article`;

    return apiPut<UpdateArticleApiResponse, UpdateArticlePayload>(
      path,
      payload,
      {
        authToken,
      },
    );
  },
};
