import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { apiGet, apiPost } from "@/libs/api";
import {
  Workspace,
  WorkspaceResponse,
  GetWorkspacesParams,
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
} from "@/types/group";

const getToken = async () => {
  const session = await getSession();
  return session?.accessToken;
};

const getTokenServer = async () => {
  const session = await getServerSession(authOptions);
  return session?.accessToken;
};

export const workspaceService = {
  getAll: async (page: number = 1, size: number = 100): Promise<Workspace[]> => {
    const token = await getToken();
    const response = await apiGet<WorkspaceResponse>(
      `/workspaces?page=${page}&size=${size}`,
      { authToken: token }
    );
    return response.payload;
  },

  getAllWithFilters: async ({
    page = 1,
    size = 10,
    name,
    generationId,
  }: GetWorkspacesParams): Promise<Workspace[]> => {
    const token = await getToken();
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("size", size.toString());
    if (name?.trim()) params.set("name", name.trim());
    if (generationId) params.set("generationId", generationId);

    const response = await apiGet<WorkspaceResponse>(
      `/workspaces?${params.toString()}`,
      { authToken: token }
    );
    return response.payload;
  },

  getById: async (workspaceId: string): Promise<Workspace> => {
    const token = await getToken();
    const response = await apiGet<{
      success: boolean;
      message: string;
      payload: Workspace;
    }>(`/workspaces/${workspaceId}`, { authToken: token });
    return response.payload;
  },

  getByGeneration: async (generationId: string): Promise<Workspace[]> => {
    const token = await getToken();
    const response = await apiGet<{
      success: boolean;
      message: string;
      payload: Workspace[];
    }>(`/workspaces/generation/${generationId}`, { authToken: token });
    return response.payload;
  },

  // Uses server token because it's called from a server action
  async create(payload: CreateWorkspaceRequest) {
    const token = await getTokenServer();
    return apiPost<CreateWorkspaceResponse>("/workspaces", payload, {
      authToken: token,
    });
  },
};