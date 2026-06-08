import { apiGet } from "@/libs/api";

export interface EventLocation {
  locationId: string;
  locationName: string;
  googleMapUrl: string;
  latitude: number;
  longitude: number;
}

export interface EventMedia {
  mediaId: string;
  filePath: string;
  isCover: boolean;
  createdAt: string;
}

export interface EventPayment {
  postPaymentId: string;
  paymentType: string;
  paymentAmount: number;
  donationGoal: number;
  amountRaised: number;
  createdAt: string;
  updatedAt: string;
  paymentAccId: string;
  billNo: string;
  khqrData: string;
}

export interface AppUser {
  appUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}

export interface EventComment {
  commentId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
  appUser: AppUser;
  mentionedUserId: {
    userIds: string[];
  };
  replies: EventComment[];
}

export interface EventItem {
  postId: string;
  category: string;
  title: string;
  content: string;
  purpose: string;
  status: "open" | "closed" | string;
  expiresAt: string;
  eventStart: string;
  eventEnd: string;
  createdAt: string;
  updatedAt: string;
  appUserId: string;
  location: EventLocation;
  media: EventMedia[];
  payment: EventPayment;
  comments: EventComment[];
}

export interface EventResponse {
  success: boolean;
  message: string;
  status: string;
  payload: EventItem[];
}

export interface ParticipantUser {
  appUserId: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface Participant {
  appUserId: string;
  participantId: string;
  registeredAt: string;
  remark: string;
  postId: string;
  user?: ParticipantUser;
  paymentStatus: string;
}

export interface ParticipantResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Participant[];
  timestamp: string;
}

export const eventService = {
  getAll: async (
    token: string,
    page: number = 1,
    size: number = 20,
  ): Promise<EventItem[]> => {
    const response = await apiGet<EventResponse>(
      `/posts/events?page=${page}&size=${size}`,
      { authToken: token },
    );
    return response.payload;
  },

  getParticipants: async (
    token: string,
    postId: string,
    page: number = 1,
    size: number = 10,
  ): Promise<Participant[]> => {
    const response = await apiGet<ParticipantResponse>(
      `/posts/${postId}/participants?page=${page}&size=${size}`,
      { authToken: token },
    );
    return response.payload || [];
  },

  getByWorkspace: async (
    token: string,
    workspaceId: string,
  ): Promise<EventItem[]> => {
    const response = await apiGet<EventResponse>(
      `/workspaces/${workspaceId}/post?page=1&size=100`,
      { authToken: token },
    );
    return (response.payload || []).filter(
      (post) => post.category === "event" && Boolean(post.eventStart),
    );
  },
  getMyRegistrations: async (
    token: string,
    page: number = 1,
    size: number = 10
  ): Promise<Participant[]> => {
    const response = await apiGet<ParticipantResponse>(
      `/posts/participants/me?page=${page}&size=${size}`,
      { authToken: token }
    );
    return response.payload || [];
  },

  getParticipantsByUser: async (
    token: string,
    userId: string,
    page: number = 1,
    size: number = 10
  ): Promise<Participant[]> => {
    const response = await apiGet<ParticipantResponse>(
      `/posts/participants/user/${userId}?page=${page}&size=${size}`,
      { authToken: token }
    );
    return response.payload || [];
  }
};
