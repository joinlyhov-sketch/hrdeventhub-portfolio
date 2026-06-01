export interface WorkspaceMember {
  appUserId: string;
  firstName: string;
  lastName: string;
}

export interface WorkspaceMemberResponse {
  success: boolean;
  message: string;
  status: string;
  payload: WorkspaceMember[];
  timestamp: string;
}