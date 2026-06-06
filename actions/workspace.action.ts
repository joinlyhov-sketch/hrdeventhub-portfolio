"use server";
import { workspaceService } from "@/service/workspace.service";
import { CreateWorkspaceRequest, UpdateWorkspaceRequest } from "@/types/workspace-type/group";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function createWorkspaceAction(payload: CreateWorkspaceRequest) {
  return workspaceService.create(payload);
}

export async function updateWorkspaceAction(workspaceId: string, payload: UpdateWorkspaceRequest) {
  return workspaceService.update(workspaceId, payload);
}

export async function deleteWorkspaceAction(workspaceId: string) {
  return workspaceService.remove(workspaceId);
}

export async function togglePinWorkspaceAction(workspaceId: string, isPinned: boolean) {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken || ""; 
  
  return workspaceService.togglePin(workspaceId, isPinned, token);
}