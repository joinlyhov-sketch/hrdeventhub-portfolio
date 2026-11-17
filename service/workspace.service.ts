import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/libs/api";
import { getAppSession as getServerSession } from "@/libs/server-session";
import { authOptions } from "@/libs/auth";
import {
  Workspace,
  WorkspaceResponse,
  GetWorkspacesParams,
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  UpdateWorkspaceRequest,
  UpdateWorkspaceResponse,
  DeleteWorkspaceResponse,
  PinWorkspaceResponse,
} from "@/types/workspace-type/group";
import {
  WorkspaceMemberResponse,
} from "@/types/workspace-type/workspace-members";

export const workspaceService = {
  getAll: async (token: string, page: number = 1, size: number = 100): Promise<Workspace[]> => {
    const response = await apiGet<WorkspaceResponse>(
      `/workspaces?page=${page}&size=${size}`,
      {
        authToken: token,
        next: { tags: ["workspaces"] },
      } as Parameters<typeof apiGet>[1],
    );
    return response.payload;
  },

  getAllWithFilters: async (
  token: string,
  { page = 1, size = 10, name, generationId, isPublic }: GetWorkspacesParams,
): Promise<{ workspaces: Workspace[]; totalPages: number }> => {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("size", size.toString());

  if (name?.trim()) {
    params.set("name", name.trim());
  }

  if (generationId) {
    params.set("generationId", generationId);
  }

  if (typeof isPublic === "boolean") {
    params.set("isPublic", String(isPublic));
  }

  const response = await apiGet<WorkspaceResponse>(
    `/workspaces?${params.toString()}`,
    { authToken: token },
  );

  const hasMore = response.payload.length === size;
  const totalPages = hasMore ? page + 1 : page;

  return {
    workspaces: response.payload,
    totalPages,
  };
},

  getMyWorkspaces: async (token: string): Promise<Workspace[]> => {
    const response = await apiGet<WorkspaceResponse>(`/workspaces/me`, {
      authToken: token,
      next: { tags: ["workspaces"] },
    } as Parameters<typeof apiGet>[1]);
    return response.payload;
  },

  getById: async (workspaceId: string, token: string): Promise<Workspace> => {
    const response = await apiGet<{
      success: boolean;
      message: string;
      payload: Workspace;
    }>(`/workspaces/${workspaceId}`, { authToken: token });
    return response.payload;
  },

  getByGeneration: async (
    generationId: string,
    token: string,
  ): Promise<Workspace[]> => {
    const response = await apiGet<{
      success: boolean;
      message: string;
      payload: Workspace[];
    }>(`/workspaces/generation/${generationId}`, { authToken: token });
    return response.payload;
  },
  leave: async (workspaceId: string, token: string) => {
  return apiDelete<{ success: boolean; message: string; status: string; timestamp: string }>(
    `/workspaces/${workspaceId}/leave`,
    { authToken: token }
  );
},

  getMembers: async (
    workspaceId: string,
    token: string,
  ): Promise<WorkspaceMemberResponse> => {
    const response = await apiGet<WorkspaceMemberResponse>(
      `/workspaces/${workspaceId}/members`,
      { authToken: token },
    );
    return response;
  },

  create: async (payload: CreateWorkspaceRequest) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    return apiPost<CreateWorkspaceResponse>("/workspaces", payload, {
      authToken: token,
    });
  },

  update: async (workspaceId: string, payload: UpdateWorkspaceRequest) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    return apiPut<UpdateWorkspaceResponse>(
      `/workspaces/${workspaceId}`,
      payload,
      { authToken: token },
    );
  },

  remove: async (workspaceId: string) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    return apiDelete<DeleteWorkspaceResponse>(`/workspaces/${workspaceId}`, {
      authToken: token,
    });
  },

  togglePin: async (workspaceId: string, isPinned: boolean, token: string) => {
    return apiPatch<PinWorkspaceResponse>(
      `/workspaces/${workspaceId}/pin?isPinned=${isPinned}`,
      {},
      { authToken: token }
    );
  },
};