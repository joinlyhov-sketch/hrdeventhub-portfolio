"use server";
import { workspaceService } from "@/service/workspace.service";
import { CreateWorkspaceRequest } from "@/types/group";
import { revalidateTag } from "next/cache";

export async function createWorkspaceAction(payload: CreateWorkspaceRequest) {
  const result = await workspaceService.create(payload);
  revalidateTag("workspaces", "max");
  return result;
}