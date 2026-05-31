export interface Group {
  id: string;
  type: "Internal" | "External";
  title: string;
  description: string;
  memberCount: number;
}
export interface Workspace {
  workspaceId: string;
  name: string;
  description: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  generationName?: string;
  telegramChannelUrl?: string;
}

export interface WorkspaceResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Workspace[];
  timestamp: string;
}

export interface GetWorkspacesParams {
  page?: number;
  size?: number;
  name?: string;
  generationId?: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description: string;
  isPublic: boolean;
  generationId: string;
  telegramChannelUrl: string;
}

export interface CreateWorkspaceResponse {
  success: boolean;
  message: string;
  status: string;
  timestamp: string;
}