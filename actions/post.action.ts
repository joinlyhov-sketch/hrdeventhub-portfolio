"use server";

import { getServerSession } from "next-auth";
import { postService } from "@/service/post.service";
import { revalidateTag } from "next/cache";

export async function deletePostAction(workspaceId: string, postId: string) {
  const session = await getServerSession();
  
  if (!session?.accessToken) {
    throw new Error("Unauthorized");
  }

  const result = await postService.delete(workspaceId, postId, session.accessToken);
  revalidateTag("workspace-posts", "max");
  return result;
}