"use server";
import { authOptions } from "@/libs/auth";
import { workspaceService } from "@/service/workspace.service";
import { Workspace } from "@/types/survey";
import {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from "@/types/workspace-type/group";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function getAllWorkspacesAction(
  page: number = 1,
  size: number = 100,
): Promise<Workspace[]> {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error("Unauthorized");
  }

  return await workspaceService.getAll(session.accessToken, page, size);
}

export async function createWorkspaceAction(payload: CreateWorkspaceRequest) {
  return workspaceService.create(payload);
}

export async function updateWorkspaceAction(
  workspaceId: string,
  payload: UpdateWorkspaceRequest,
) {
  const result = await workspaceService.update(workspaceId, payload);
  revalidateTag("workspaces", "max");
  return result;
}

export async function deleteWorkspaceAction(workspaceId: string) {
  const result = await workspaceService.remove(workspaceId);
  revalidateTag("workspaces", "max");
  return result;
}
export async function leaveWorkspaceAction(workspaceId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");

  const result = await workspaceService.leave(workspaceId, session.accessToken);
  revalidateTag("workspaces","max");
  return result;
}
