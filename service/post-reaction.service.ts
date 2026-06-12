import { apiGet, apiPost, apiDelete } from "@/libs/api";

export const reactionService = {
  getReactionComment: async (commentId: string, token: string) => {
    return await apiGet(`/comment/${commentId}/reactions`, {
      authToken: token,
    });
  },

  reactComment: async (commentId: string, type: string, token: string) => {
    return await apiPost(
      `/comment/${commentId}/reactions`,
      { type },
      { authToken: token },
    );
  },

  removeReactionComment: async (commentId: string, token: string) => {
    return await apiDelete(`/comment/${commentId}/reactions`, {
      authToken: token,
    });
  },

  getReactionPost: async (postId: string, token: string) => {
    return await apiGet(`/posts/${postId}/reactions`, {
      authToken: token,
    });
  },

  reactPost: async (postId: string, type: string, token: string) => {
    return await apiPost(
      `/posts/${postId}/reactions`,
      { type },
      { authToken: token },
    );
  },

  removeReactionPost: async (postId: string, token: string) => {
    return await apiDelete(`/posts/${postId}/reactions`, {
      authToken: token,
    });
  },
};
