import { postService } from "@/service/post.service";
import { CreatePostPayload } from "@/types/post-types";

export async function createPostAction(
  workspaceId: string,
  payload: CreatePostPayload,
  authToken?: string,
) {
  try {
    const response = await postService.createPost(
      workspaceId,
      payload,
      authToken,
    );
    if (!response.success) {
      return {
        error: response.message || "Could not publish your post content.",
      };
    }
    return { ok: true, payload: response.payload };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected service error occurred.",
    };
  }
}
