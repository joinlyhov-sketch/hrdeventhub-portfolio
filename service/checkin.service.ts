import { apiGet, apiPost } from "@/libs/api";

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

export interface Attendee {
  ticketId: string;
  appUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  role: string;
  postId: string;
  postTitle: string;
  eventStart: string | null;
  eventEnd: string | null;
  workspaceId: string;
  workspaceName: string;
  ticketStatus: "CHECKED_IN" | "PENDING";
  checkedInAt: string | null;
  createdAt: string;
}

export interface AttendeesApiResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Attendee[];
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

  getAllAttendees: async (
    token: string,
    page: number = 1,
    size: number = 200,
  ): Promise<AttendeesApiResponse> => {
    return await apiGet<AttendeesApiResponse>(
      `/tickets/admin/attendees?page=${page}&size=${size}`,
      { authToken: token },
    );
  },
};