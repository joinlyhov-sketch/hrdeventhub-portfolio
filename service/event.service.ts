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
  workspaceId?: string;
  sourceWorkspaceId?: string;
  sourceWorkspaceName?: string;
  attendeeCount?: number;
  pendingPaymentCount?: number;
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
  scheduledAt?: string;
  pinned?: boolean;
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
  email?: string;
  gender?: string;
  phoneNumber?: string;
  profilePicture: string;
  generation?: {
    generationId?: string;
    name?: string;
    year?: string;
  };
}

export interface Participant {
  appUserId?: string;
  participantId: string;
  registeredAt: string;
  remark: string;
  postId: string;
  post?: EventItem;
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

interface WorkspaceSummary {
  workspaceId: string;
  name: string;
}

interface WorkspaceResponse {
  success: boolean;
  message: string;
  status: string;
  payload: WorkspaceSummary[];
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
      { authToken: token, tags: ["events-management"] },
    );
    return response.payload;
  },

  getAllPlatformEvents: async (token: string): Promise<EventItem[]> => {
    const pageSize = 100;
    const eventsById = new Map<string, EventItem>();

    const firstPage = await eventService.getAll(token, 1, pageSize);
    firstPage.forEach((event) => {
      eventsById.set(event.postId, {
        ...event,
        sourceWorkspaceId: event.sourceWorkspaceId || event.workspaceId,
      });
    });

    if (firstPage.length === pageSize) {
      const remainingPages = await Promise.all(
        Array.from({ length: 19 }, (_, i) =>
          eventService.getAll(token, i + 2, pageSize),
        ),
      );

      remainingPages.flat().forEach((event) => {
        eventsById.set(event.postId, {
          ...event,
          sourceWorkspaceId: event.sourceWorkspaceId || event.workspaceId,
        });
      });
    }

    return Array.from(eventsById.values()).sort((a, b) => {
      const aTime = new Date(a.eventStart).getTime();
      const bTime = new Date(b.eventStart).getTime();
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return aTime - bTime;
    });
  },

  getAllPlatformEventsWithAttendees: async (
    token: string,
  ): Promise<EventItem[]> => {
    const events = await eventService.getAllPlatformEvents(token);

    return Promise.all(
      events.map(async (event) => {
        try {
          const participantStats = await eventService.getParticipantStats(
            token,
            event.postId,
          );

          return {
            ...event,
            attendeeCount: participantStats.total,
            pendingPaymentCount: participantStats.pendingPayment,
          };
        } catch (error) {
          console.error("Failed to fetch attendee count:", error);
          return {
            ...event,
            attendeeCount: event.attendeeCount ?? 0,
            pendingPaymentCount: event.pendingPaymentCount ?? 0,
          };
        }
      }),
    );
  },

  getAllWorkspaceEvents: async (token: string): Promise<EventItem[]> => {
    const workspaceResponse = await apiGet<WorkspaceResponse>(
      "/workspaces?page=1&size=100",
      { authToken: token },
    );

    const workspaceEvents = await Promise.all(
      (workspaceResponse.payload || []).map(async (workspace) => {
        const events = await eventService.getByWorkspace(
          token,
          workspace.workspaceId,
        );

        return events.map((event) => ({
          ...event,
          sourceWorkspaceId: workspace.workspaceId,
          sourceWorkspaceName: workspace.name,
        }));
      }),
    );

    return workspaceEvents.flat().sort((a, b) => {
      const aTime = new Date(a.eventStart).getTime();
      const bTime = new Date(b.eventStart).getTime();

      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return aTime - bTime;
    });
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

  getParticipantCount: async (
    token: string,
    postId: string,
  ): Promise<number> => {
    const stats = await eventService.getParticipantStats(token, postId);
    return stats.total;
  },

  getParticipantStats: async (
    token: string,
    postId: string,
  ): Promise<{ total: number; pendingPayment: number }> => {
    const pageSize = 100;
    const firstPage = await eventService.getParticipants(
      token,
      postId,
      1,
      pageSize,
    );

    if (firstPage.length < pageSize) {
      return {
        total: firstPage.length,
        pendingPayment: firstPage.filter((p) =>
          eventService.isPendingParticipantPayment(p.paymentStatus),
        ).length,
      };
    }

    const remainingRequests = Array.from({ length: 19 }, (_, i) =>
      eventService.getParticipants(token, postId, i + 2, pageSize),
    );
    const remainingPages = await Promise.all(remainingRequests);
    const all = [firstPage, ...remainingPages].flat();

    return {
      total: all.length,
      pendingPayment: all.filter((p) =>
        eventService.isPendingParticipantPayment(p.paymentStatus),
      ).length,
    };
  },

  isPendingParticipantPayment: (status?: string): boolean => {
    const normalized = status?.trim().toLowerCase();
    if (!normalized) return false;

    return [
      "1",
      "pending",
      "unpaid",
      "failed",
      "fail",
      "not_paid",
      "not paid",
    ].includes(normalized);
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
    size: number = 10,
  ): Promise<Participant[]> => {
    const response = await apiGet<ParticipantResponse>(
      `/posts/participants/me?page=${page}&size=${size}`,
      { authToken: token },
    );
    return response.payload || [];
  },

  getParticipantsByUser: async (
    token: string,
    userId: string,
    page: number = 1,
    size: number = 10,
  ): Promise<Participant[]> => {
    const response = await apiGet<ParticipantResponse>(
      `/posts/participants/user/${userId}?page=${page}&size=${size}`,
      { authToken: token },
    );
    return response.payload || [];
  },
  getOrganizerParticipants: async (
    token: string,
    page: number = 1,
    size: number = 100,
  ): Promise<Participant[]> => {
    const response = await apiGet<ParticipantResponse>(
      `/posts/participants/my-workspaces?page=${page}&size=${size}`,
      { authToken: token, tags: ["organizer-events"] },
    );
    return response.payload || [];
  },

  getOrganizerEvents: async (
    token: string,
  ): Promise<{
    events: EventItem[];
    participantsByPostId: Map<string, Participant[]>;
  }> => {
    const participants = await eventService.getOrganizerParticipants(token);

    const participantsByPostId = new Map<string, Participant[]>();
    const eventsById = new Map<string, EventItem>();

    participants.forEach((p) => {
      if (p.post) {
        eventsById.set(p.postId, p.post);
      }
      const existing = participantsByPostId.get(p.postId) || [];
      existing.push(p);
      participantsByPostId.set(p.postId, existing);
    });

    const events = Array.from(eventsById.values()).sort((a, b) => {
      const aTime = new Date(a.eventStart).getTime();
      const bTime = new Date(b.eventStart).getTime();
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return aTime - bTime;
    });

    return { events, participantsByPostId };
  },
};
