"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { postService } from "@/service/post.service";
import {
  CreateAnnouncementPayload,
  CreateArticlePayload,
  CreatePostPayload,
} from "@/types/post-types";
import { ServerActionResponse } from "@/types/file-types";

export async function createPostAction(
  workspaceId: string,
  payload: CreatePostPayload,
) {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!workspaceId) {
      return {
        ok: false,
        error: "Missing required identifier: workspaceId parameter",
      };
    }
    if (!token) {
      return { error: "Authorization token identifier is missing." };
    }

    const response = await postService.createEventPost(
      workspaceId,
      payload,
      token,
    );

    if (response && response.success === false) {
      return {
        error:
          response.message || "Endpoint validation rejected the body payload.",
      };
    }

    return { ok: true, payload: response };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected service error occurred.",
    };
  }
}

export async function createAnnouncementAction(
  workspaceId: string,
  payload: CreateAnnouncementPayload,
): Promise<ServerActionResponse<boolean>> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!workspaceId) {
      return {
        ok: false,
        error: "Missing required identifier: workspaceId parameter",
      };
    }

    const response = await postService.createAnnouncement(
      workspaceId,
      payload,
      token,
    );

    if (response.success) {
      return { ok: true, payload: true };
    }

    return {
      ok: false,
      error: response.message || "Backend rejected announcement creation.",
    };
  } catch (error: unknown) {
    console.error("Server Action Create Announcement Error:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected service error occurred.",
    };
  }
}

export async function createArticleAction(
  workspaceId: string,
  payload: CreateArticlePayload,
): Promise<ServerActionResponse<boolean>> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!workspaceId) {
      return {
        ok: false,
        error: "Missing mandatory parameter requirement: workspaceId",
      };
    }

    const response = await postService.createArticle(
      workspaceId,
      payload,
      token,
    );

    if (response.success) {
      return { ok: true, payload: true };
    }

    return {
      ok: false,
      error: response.message || "Backend rejected article post creation.",
    };
  } catch (error: unknown) {
    console.error("Server Action Article Process Failure:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected core network engine failure occurred.",
    };
  }
}

export async function deletePostAction(workspaceId: string, postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");

  return await postService.delete(workspaceId, postId, session.accessToken);
}

export async function getPostDetailAction(workspaceId: string, postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");

  return await postService.getById(workspaceId, postId, session.accessToken);
}
