export interface CreateInvitationRequest {
  workspaceId: string;
  generationId: string;
  ttlDays: number;
}

export interface InvitationPayload {
  invitationId: string;
  token: string;
  roles: string;
  createdAt: string;
  expiredAt: string;
  generationId: string;
  appUserId: string;
  workspaceId: string;
  inviteLink: string;
}

export interface CreateInvitationResponse {
  success: boolean;
  message: string;
  status: string;
  payload: InvitationPayload;
  timestamp: string;
}