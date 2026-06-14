"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { postService } from "@/service/post.service";
import {
  ApiResponseActionWrapper,
  ChangeEventStatusPayload,
  CreateAnnouncementPayload,
  CreateAnnouncementResponseV2,
  CreateArticlePayload,
  CreatePostPayload,
  UpdateArticlePayload,
  UpdateEventPayload,
  UpdatePostActionResponse,
} from "@/types/post-types";
import {
  ServerActionResponse,
  ServerActionResponse2,
} from "@/types/file-types";
import { revalidatePath } from "next/cache";
import { CreateArticleResponseV2 } from "@/types/article-types";

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
): Promise<ServerActionResponse<CreateAnnouncementResponseV2>> {
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
      return { ok: true, payload: response };
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
): Promise<ServerActionResponse2<CreateArticleResponseV2>> {
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
      return { ok: true, payload: response };
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

export async function updatePostAction(
  workspaceId: string,
  postId: string,
  payload: UpdateEventPayload,
): Promise<UpdatePostActionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!workspaceId || !postId) {
      return {
        ok: false,
        error:
          "Required context identification attributes (workspaceId/postId) are missing.",
      };
    }
    if (!token) {
      return { ok: false, error: "Authorization session has expired." };
    }

    const response = await postService.updateEventPost(
      workspaceId,
      postId,
      payload,
      token,
    );

    return {
      ok: true,
      message: response.message || "Event updated successfully",
    };
  } catch (error: unknown) {
    console.error("Server Action Process Failure:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected core network engine failure occurred.",
    };
  }
}

export async function updateAnnouncementAction(
  workspaceId: string,
  postId: string,
  payload: UpdateEventPayload,
): Promise<UpdatePostActionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!workspaceId || !postId) {
      return {
        ok: false,
        error:
          "Required context identification attributes (workspaceId/postId) are missing.",
      };
    }
    if (!token) {
      return { ok: false, error: "Authorization session has expired." };
    }

    const response = await postService.updateAnnouncementPost(
      workspaceId,
      postId,
      payload,
      token,
    );

    revalidatePath(`/group/${workspaceId}`);

    return {
      ok: true,
      message: response.message || "Announcement updated successfully",
    };
  } catch (error: unknown) {
    console.error("Server Action Process Failure (Announcement):", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected core network engine failure occurred.",
    };
  }
}

export async function updateArticleAction(
  workspaceId: string,
  postId: string,
  payload: UpdateArticlePayload,
): Promise<ApiResponseActionWrapper> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    const response = await postService.UpdateArticlePost(
      workspaceId,
      postId,
      payload,
      token,
    );

    revalidatePath(`/group/${workspaceId}`);

    return {
      ok: true,
      data: response.payload,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected server execution lifecycle error occurred.",
    };
  }
}

export async function deletePostAction(workspaceId: string, postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");

  const result = await postService.delete(
    workspaceId,
    postId,
    session.accessToken,
  );
  revalidatePath("/event-management");
  return result;
}

export async function getPostDetailAction(workspaceId: string, postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");

  return await postService.getById(workspaceId, postId, session.accessToken);
}

export async function publishDraftPostAction(
  workspaceId: string,
  postId: string,
) {
  try {
    if (!workspaceId || !postId) {
      return {
        ok: false,
        error: "Required context target parameters missing.",
      };
    }
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) throw new Error("Unauthorized");

    const response = await postService.publishDraftPost(
      workspaceId,
      postId,
      session.accessToken,
    );

    if (response.success) {
      console.log("response :", response);
      return { ok: true, data: response.payload };
    }

    return {
      ok: false,
      error: response.message || "Failed to publish draft post.",
    };
  } catch (error: string | unknown) {
    console.error("Action error publishing draft:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Internal network connection issue.",
    };
  }
}

export async function changePostStatusAction(
  workspaceId: string,
  postId: string,
  payload: ChangeEventStatusPayload,
) {
  try {
    if (!workspaceId || !postId) {
      return {
        ok: false,
        error: "Required context target parameters missing.",
      };
    }
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) throw new Error("Unauthorized");

    const response = await postService.changePostStatus(
      workspaceId,
      postId,
      payload,
      session.accessToken,
    );

    if (response.success) {
      revalidatePath(`/event-management`);
      return { ok: true, data: response.payload };
    }

    return {
      ok: false,
      error: response.message || "Failed to update event status.",
    };
  } catch (error: unknown) {
    console.error("Action error updating event status:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Internal network connection issue.",
    };
  }
}

export async function togglePinAction(
  workspaceId: string,
  postId: string,
  pinned: boolean,
) {
  try {
    if (!workspaceId || !postId) {
      return { ok: false, error: "Missing identity contextual attributes." };
    }
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;
    if (!token) {
      return { ok: false, error: "Authorization credentials expired or not found." };
    }

    await postService.togglePin(workspaceId, postId, pinned, token);
    revalidatePath(`/group/${workspaceId}`);

    return { ok: true };
  } catch (error: unknown) {
    console.error("Action error pinning post resource:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Internal system endpoint timeout exception.",
    };
  }
}