import { apiPost, apiGet, apiDelete, apiPatch } from "@/libs/api";
import {
  ChangeEventStatusPayload,
  ChangePostStatusResponse,
  CreateAnnouncementPayload,
  CreateAnnouncementResponseV2,
  CreateArticleBackendResponse,
  CreateArticlePayload,
  CreatePostPayload,
  CreatePostResponse,
  CreatePostSuccessResponse,
  PublishPostResponse,
  UpdateArticleApiResponse,
  UpdateArticlePayload,
  UpdateEventPayload,
} from "@/types/post-types";
import { PostsResponse, Post } from "@/types/posts";
import { FeedItemWrapper, WorkspaceFeedApiResponse } from "@/types/UnifiedFeedItem";

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
  ): Promise<CreateAnnouncementResponseV2> => {
    const path = `/workspaces/${workspaceId}/post/announcement`;

    return apiPost<CreateAnnouncementResponseV2, CreateAnnouncementPayload>(
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
  ): Promise<unknown> => {
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
    return apiPatch<CreatePostSuccessResponse, UpdateEventPayload>(
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
    return apiPatch<CreatePostSuccessResponse, UpdateEventPayload>(
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

    return apiPatch<UpdateArticleApiResponse, UpdateArticlePayload>(
      path,
      payload,
      {
        authToken,
      },
    );
  },

  publishDraftPost: async (
    workspaceId: string,
    postId: string,
    authToken?: string,
  ): Promise<PublishPostResponse> => {
    const path = `/workspaces/${workspaceId}/post/${postId}/publish`;
    return apiPatch<PublishPostResponse, undefined>(path, undefined, {
      authToken,
      accept: "*/*",
    });
  },

  changePostStatus: async (
    workspaceId: string,
    postId: string,
    payload: ChangeEventStatusPayload,
    authToken?: string,
  ): Promise<ChangePostStatusResponse> => {
    const path = `/workspaces/${workspaceId}/post/${postId}/status`;
    return apiPatch<ChangePostStatusResponse, ChangeEventStatusPayload>(
      path,
      payload,
      {
        authToken,
        accept: "*/*",
      },
    );
  },

  togglePin: async (
    workspaceId: string,
    postId: string,
    pinned: boolean,
    authToken: string,
  ): Promise<unknown> => {
    return apiPatch<unknown, undefined>(
      `/workspaces/${workspaceId}/post/${postId}/pin?pinned=${pinned}`,
      undefined,
      {
        authToken,
        accept: "*/*",
      },
    );
  },
  getWorkspaceFeed: async (
    workspaceId: string,
    token: string,
    page: number = 1,
    size: number = 20,
  ): Promise<FeedItemWrapper[]> => {
    const response = await apiGet<WorkspaceFeedApiResponse>(
      `/workspaces/${workspaceId}/feed?page=${page}&size=${size}`,
      { authToken: token },
    );
    return response.payload;
  },
  getParticipants: async (
    postId: string,
    token: string,
    page: number = 1,
    size: number = 100
  ): Promise<unknown> => {
    return apiGet<unknown>(
      `/posts/${postId}/participants?page=${page}&size=${size}`,
      { authToken: token }
    );
  },
};