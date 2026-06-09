"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import {
  getCommentsService,
  postCommentService,
  editCommentService,
  deleteCommentService,
  replyCommentService,
} from "@/service/comment.service";
import { ServerActionResponse2 } from "@/types/file-types";
import { Comment } from "@/types/comment";
export async function getCommentsAction(
  postId: string,
): Promise<ServerActionResponse2<Comment[]>> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!postId) {
      return {
        ok: false,
        error: "Missing required identifier: postId parameter",
      };
    }

    if (!token) {
      return {
        ok: false,
        error: "Authorization token is missing.",
      };
    }

    const response = await getCommentsService(postId, token);

    if (response.success) {
      return { ok: true, payload: response.payload };
    }

    return {
      ok: false,
      error: response.message || "Failed to fetch comments.",
    };
  } catch (error: unknown) {
    console.error("Server Action Get Comments Error:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected service error occurred.",
    };
  }
}

export async function createCommentAction(
  postId: string,
  comment: string,
): Promise<ServerActionResponse2<boolean>> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!postId || !comment) {
      return {
        ok: false,
        error: "Missing required fields: postId or comment text",
      };
    }

    if (!token) {
      return {
        ok: false,
        error: "Authorization token is missing.",
      };
    }

    const response = await postCommentService(postId, comment, token);

    if (response.success) {
      return { ok: true, payload: true };
    }

    return {
      ok: false,
      error: response.message || "Failed to create comment.",
    };
  } catch (error: unknown) {
    console.error("Server Action Create Comment Error:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected service error occurred.",
    };
  }
}

export async function editCommentAction(
  commentId: string,
  comment: string,
): Promise<ServerActionResponse2<boolean>> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!commentId || !comment) {
      return {
        ok: false,
        error: "Missing required fields: commentId or comment text",
      };
    }

    if (!token) {
      return {
        ok: false,
        error: "Authorization token is missing.",
      };
    }

    const response = await editCommentService(commentId, comment, token);

    if (response.success) {
      return { ok: true, payload: true };
    }

    return {
      ok: false,
      error: response.message || "Failed to edit comment.",
    };
  } catch (error: unknown) {
    console.error("Server Action Edit Comment Error:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected service error occurred.",
    };
  }
}

/**
 * Delete a comment
 */
export async function deleteCommentAction(
  commentId: string,
): Promise<ServerActionResponse2<boolean>> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!commentId) {
      return {
        ok: false,
        error: "Missing required identifier: commentId parameter",
      };
    }

    if (!token) {
      return {
        ok: false,
        error: "Authorization token is missing.",
      };
    }

    const response = await deleteCommentService(commentId, token);

    if (response.success) {
      return { ok: true, payload: true };
    }

    return {
      ok: false,
      error: response.message || "Failed to delete comment.",
    };
  } catch (error: unknown) {
    console.error("Server Action Delete Comment Error:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected service error occurred.",
    };
  }
}

export async function createReplyAction(
  commentId: string,
  reply: string,
): Promise<ServerActionResponse2<Comment>> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!commentId) {
      return {
        ok: false,
        error: "Missing required identifier: commentId parameter",
      };
    }

    if (!reply || !reply.trim()) {
      return {
        ok: false,
        error: "Reply text cannot be empty.",
      };
    }

    if (!token) {
      return {
        ok: false,
        error: "Authorization token is missing.",
      };
    }

    const response = await replyCommentService(commentId, reply, token);

    if (response.success) {
      return { ok: true, payload: response.payload };
    }

    return {
      ok: false,
      error: response.message || "Failed to create reply.",
    };
  } catch (error: unknown) {
    console.error("Server Action Create Reply Error:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected service error occurred.",
    };
  }
}
