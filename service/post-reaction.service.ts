import { apiGet, apiPost, apiDelete } from "@/libs/api";

export const reactionService = {
  getReactionComment: async (commentId: string, token: string) => {
    return await apiGet(`/api/v4/comments/${commentId}/reactions`, {
      authToken: token,
    });
  },

  reactComment: async (commentId: string, type: string, token: string) => {
    return await apiPost(
      `/api/v4/comments/${commentId}/reactions`,
      { type },
      { authToken: token },
    );
  },

  removeReactionComment: async (commentId: string, token: string) => {
    return await apiDelete(`/api/v4/comments/${commentId}/reactions`, {
      authToken: token,
    });
  },

  getReactionPost: async (postId: string, token: string) => {
    return await apiGet(`/api/v4/posts/${postId}/reactions`, {
      authToken: token,
    });
  },

  reactPost: async (postId: string, type: string, token: string) => {
    return await apiPost(
      `/api/v4/posts/${postId}/reactions`,
      { type },
      { authToken: token },
    );
  },

  removeReactionPost: async (postId: string, token: string) => {
    return await apiDelete(`/api/v4/posts/${postId}/reactions`, {
      authToken: token,
    });
  },
};