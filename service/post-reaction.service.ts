import { apiGet, apiPost, apiDelete } from "@/libs/api";

export const reactionService = {
  getReactionComment: async (commentId: string, token: string) => {
    return await apiGet(`/api/reactions/comment/${commentId}`, {
      authToken: token,
    });
  },

  reactComment: async (commentId: string, type: string, token: string) => {
    return await apiPost(
      `/api/reactions/comment/${commentId}`,
      { type },
      { authToken: token },
    );
  },

  removeReactionComment: async (commentId: string, token: string) => {
    return await apiDelete(`/api/reactions/comment/${commentId}`, {
      authToken: token,
    });
  },

  getReactionPost: async (postId: string, token: string) => {
    return await apiGet(`/api/reactions/post/${postId}`, {
      authToken: token,
    });
  },

  reactPost: async (postId: string, type: string, token: string) => {
    return await apiPost(
      `/api/reactions/post/${postId}`,
      { type },
      { authToken: token },
    );
  },

  removeReactionPost: async (postId: string, token: string) => {
    return await apiDelete(`/api/reactions/post/${postId}`, {
      authToken: token,
    });
  },
};
