import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { apiPost } from "@/libs/api";
import { CreateInvitationRequest, CreateInvitationResponse } from "@/types/invitation";

export const invitationService = {
  create: async (payload: CreateInvitationRequest) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    return apiPost<CreateInvitationResponse>("/invitations", payload, { authToken: token });
  },
};