import { apiGet, apiPost, apiPut, apiDelete } from "@/libs/api";
import { CommentsResponse, PostCommentResponse } from "@/types/comment";

export const getCommentsService = async (postId: string, authToken?: string) => {
  return apiGet<CommentsResponse>(
    `/posts/${postId}/comments`,
    {
      authToken,
      tags: [`post-comments-${postId}`],
    }
  );
};

export const postCommentService = async (
  postId: string,
  comment: string,
  authToken?: string
) => {
  return apiPost<PostCommentResponse>(
    `/posts/${postId}/comments`,
    { comment },
    {
      authToken,
    }
  );
};
export const editCommentService = async (
  commentId: string,
  comment: string,
  authToken?: string
) => {
  return apiPut<PostCommentResponse>(
    `/posts/comments/${commentId}`,
    { comment },
    {
      authToken,
    }
  );
};
export const deleteCommentService = async (
  commentId: string,
  authToken?: string
) => {
  return apiDelete<PostCommentResponse>(
    `/posts/comments/${commentId}`,
    {
      authToken,
    }
  );
};

export const replyCommentService = async (
  commentId: string,
  reply: string,
  authToken?: string
) => {
  return apiPost<PostCommentResponse>(
    `/posts/comments/${commentId}/replies`,
    { comment: reply },
    {
      authToken,
    }
  );
};
