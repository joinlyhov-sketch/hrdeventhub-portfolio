import { apiPost } from "@/libs/api";

export interface CheckInPayload {
  attendeeName: string;
  postTitle: string;
  checkedInAt: string;
}

export interface CheckInApiResponse {
  success: boolean;
  message: string;
  status: string;
  payload: CheckInPayload;
  timestamp: string;
}

export const checkinService = {
  verifyAttendeeTicket: async (
    registrationToken: string,
    token: string,
  ): Promise<CheckInApiResponse> => {
    return await apiPost<CheckInApiResponse>(
      `/tickets/admin/verify?token=${encodeURIComponent(registrationToken)}`,
      {},
      { authToken: token },
    );
  },
};