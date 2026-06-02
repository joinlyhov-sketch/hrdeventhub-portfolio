"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { postService } from "@/service/post.service";

export async function deletePostAction(workspaceId: string, postId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error("Unauthorized");
  }

  const result = await postService.delete(workspaceId, postId, session.accessToken);
  return result;
}