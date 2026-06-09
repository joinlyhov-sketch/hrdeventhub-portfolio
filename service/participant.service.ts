import { apiPost } from "@/libs/api";

export interface RegisterParticipantPayload {
  remark: string;
  billNo: string | null; 
}

export interface RegisterParticipantResponse {
  success: boolean;
  message: string;
  status: string;
}

export const participantService = {
  register: async (
    postId: string,
    payload: RegisterParticipantPayload,
    authToken: string,
  ): Promise<RegisterParticipantResponse> => {
    return apiPost<RegisterParticipantResponse, RegisterParticipantPayload>(
      `/posts/${postId}/participants`,
      payload,
      { authToken, accept: "*/*" },
    );
  },
};