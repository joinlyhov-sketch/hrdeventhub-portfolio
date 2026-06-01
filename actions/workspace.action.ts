"use server";
import { workspaceService } from "@/service/workspace.service";
import { CreateWorkspaceRequest, UpdateWorkspaceRequest } from "@/types/workspace-type/group";
import { revalidateTag } from "next/cache";

export async function createWorkspaceAction(payload: CreateWorkspaceRequest) {
  const result = await workspaceService.create(payload);
  revalidateTag("workspaces", "max");
  return result;
}

export async function updateWorkspaceAction(workspaceId: string, payload: UpdateWorkspaceRequest) {
  const result = await workspaceService.update(workspaceId, payload);
  revalidateTag("workspaces", "max");
  return result;
}

export async function deleteWorkspaceAction(workspaceId: string) {
  const result = await workspaceService.remove(workspaceId);
  revalidateTag("workspaces", "max");
  return result;
}