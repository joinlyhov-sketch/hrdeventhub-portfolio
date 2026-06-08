import { apiPost } from "@/libs/api";

// ─── Request Types ────────────────────────────────────────────────────────────

export interface RegisterParticipantPayload {
  remark: string;
  billNo: string;
}

// ─── Response Types ───────────────────────────────────────────────────────────

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