import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { apiGet, apiPost } from "@/libs/api";
import {
  CreateInvitationRequest,
  CreateInvitationResponse,
  InvitationPreviewResponse,
} from "@/types/invitation";

export const invitationService = {
  create: async (payload: CreateInvitationRequest) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    return apiPost<CreateInvitationResponse>("/invitations", payload, { authToken: token });
  },

  getPreview: async (inviteToken: string): Promise<InvitationPreviewResponse> => {
    return apiGet<InvitationPreviewResponse>(
      `/invitations/public/preview/${inviteToken}`
    );
  },

  join: async (inviteToken: string, accessToken: string) => {
    return apiPost<{ success: boolean; message: string }>(
      `/invitations/join/${inviteToken}`,
      {},
      { authToken: accessToken }
    );
  },
};