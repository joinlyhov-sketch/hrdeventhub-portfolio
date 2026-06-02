import { apiGet, apiPost, apiPatch } from "@/libs/api";
import { getSession } from "next-auth/react";
import {
  Poll,
  PollCreateRequest,
  PollResponse,
  PollsResponse,
  PollVoteRequest,
} from "@/types/poll";

interface PollsResponseLegacy {
  success: boolean;
  message?: string;
  payload: Poll[];
}

type PollWebSocketHandlers = {
  onVoteUpdate?: (poll: Poll) => void;
  onPollClosed?: () => void;
  onError?: (error: Error) => void;
};

const pollSockets = new Map<string, WebSocket>();

function formatShowResult(value: string | undefined): string {
  if (!value) return "always";

  const cleanValue = value.toLowerCase().trim();

  if (cleanValue.includes("always")) return "always";
  if (cleanValue.includes("voting") || cleanValue.includes("aftervote")) {
    return "after_vote";
  }
  if (cleanValue.includes("expire") || cleanValue.includes("close")) {
    return "after_close";
  }

  return "always";
}

async function getLiveToken(): Promise<string | undefined> {
  try {
    const session = await getSession();
    return (
      (session as any)?.accessToken ||
      (session as any)?.user?.token ||
      undefined
    );
  } catch {
    return undefined;
  }
}

function unwrapPoll(response: Poll | PollResponse): Poll {
  if (response && typeof response === "object" && "payload" in response) {
    return response.payload;
  }

  return response as Poll;
}

function unwrapPolls(response: PollsResponse | PollsResponseLegacy | Poll[]): Poll[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && typeof response === "object" && "payload" in response) {
    return response.payload ?? [];
  }

  return [];
}

function getPollWebSocketUrl(pollId: string, token?: string): string {
  const directWsUrl =
    process.env.NEXT_PUBLIC_POLL_WS_URL ||
    process.env.NEXT_PUBLIC_WS_URL;

  if (directWsUrl) {
    const base = directWsUrl.replace(/\/$/, "");
    const url = `${base}/polls/${pollId}`;
    return token ? `${url}?token=${encodeURIComponent(token)}` : url;
  }

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "";

  if (!apiBaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_POLL_WS_URL or NEXT_PUBLIC_API_BASE_URL for poll WebSocket."
    );
  }

  const wsBase = apiBaseUrl
    .replace(/^https:\/\//, "wss://")
    .replace(/^http:\/\//, "ws://")
    .replace(/\/api\/v\d+\/?$/, "")
    .replace(/\/$/, "");

  const url = `${wsBase}/ws/polls/${pollId}`;
  return token ? `${url}?token=${encodeURIComponent(token)}` : url;
}

export const pollService = {
  getByWorkspace: async (
    workspaceId: string,
    token?: string
  ): Promise<Poll[]> => {
    if (!workspaceId) {
      throw new Error("Workspace ID is required");
    }

    const authToken = token ?? (await getLiveToken());

    const response = await apiGet<PollsResponse | PollsResponseLegacy | Poll[]>(
      `/polls/workspace/${workspaceId}`,
      {
        authToken,
        next: {
          tags: ["polls", `workspace-polls-${workspaceId}`],
        },
      } as any
    );

    return unwrapPolls(response);
  },

  getAll: async (page: number = 1, size: number = 100): Promise<Poll[]> => {
    const token = await getLiveToken();

    const response = await apiGet<PollsResponseLegacy | Poll[]>(
      `/polls?page=${page}&size=${size}`,
      {
        authToken: token,
        next: {
          tags: ["polls"],
        },
      } as any
    );

    return unwrapPolls(response);
  },

  getById: async (pollId: string): Promise<Poll> => {
    if (!pollId) {
      throw new Error("Poll ID is required");
    }

    const token = await getLiveToken();

    const response = await apiGet<Poll | PollResponse>(`/polls/${pollId}`, {
      authToken: token,
      next: {
        tags: ["polls", `poll-${pollId}`],
      },
    } as any);

    return unwrapPoll(response);
  },

  vote: async (
    pollId: string,
    voteRequest: PollVoteRequest,
    token?: string
  ): Promise<Poll> => {
    if (!pollId) {
      throw new Error("Poll ID is required");
    }

    if (!voteRequest.optionIds || voteRequest.optionIds.length === 0) {
      throw new Error("At least one option ID is required");
    }

    const authToken = token ?? (await getLiveToken());

    const response = await apiPost<Poll | PollResponse, PollVoteRequest>(
      `/polls/${pollId}/vote`,
      voteRequest,
      {
        authToken,
      }
    );

    return unwrapPoll(response);
  },

  getOptions: async (pollId: string): Promise<any> => {
    if (!pollId) {
      throw new Error("Poll ID is required");
    }

    const token = await getLiveToken();

    return apiGet<any>(`/polls/${pollId}/options`, {
      authToken: token,
    });
  },

  create: async (request: PollCreateRequest): Promise<Poll> => {
    if (!request.title || !request.title.trim()) {
      throw new Error("Poll title is required");
    }

    if (!request.options || request.options.length < 2) {
      throw new Error("Poll must have at least 2 options");
    }

    if (!request.closingTime) {
      throw new Error("Closing time is required");
    }

    const closingTime = new Date(request.closingTime).getTime();

    if (Number.isNaN(closingTime)) {
      throw new Error("Invalid closing time");
    }

    if (closingTime <= Date.now()) {
      throw new Error("Closing time must be in the future");
    }

    if (!request.workspaceId) {
      throw new Error("Workspace ID is required");
    }

    const token = await getLiveToken();

    const optionsArray = request.options.map((option) =>
      typeof option === "string" ? option : option.text
    );

    const payload = {
      workspaceId: request.workspaceId,
      title: request.title.trim(),
      description: request.description?.trim() || "",
      type: request.type || "text",
      options: optionsArray,
      closingTime: request.closingTime,
      multiSelect: request.multiSelect ?? false,
      anonymousVoting: request.anonymousVoting ?? false,
      allowAddOptions: request.allowAddOptions ?? false,
      hiddenPoll: request.hiddenPoll ?? false,
      showResult: formatShowResult(request.showResult),
    };

    const response = await apiPost<Poll | PollResponse, typeof payload>(
      "/polls",
      payload,
      {
        authToken: token,
      }
    );

    return unwrapPoll(response);
  },

  update: async (
    pollId: string,
    request: Partial<PollCreateRequest>
  ): Promise<Poll> => {
    if (!pollId) {
      throw new Error("Poll ID is required");
    }

    if (request.closingTime) {
      const closingTime = new Date(request.closingTime).getTime();

      if (Number.isNaN(closingTime)) {
        throw new Error("Invalid closing time");
      }

      if (closingTime <= Date.now()) {
        throw new Error("Closing time must be in the future");
      }
    }

    const token = await getLiveToken();

    const payload: Record<string, unknown> = {};

    if (request.title !== undefined) {
      payload.title = request.title.trim();
    }

    if (request.description !== undefined) {
      payload.description = request.description.trim();
    }

    if (request.closingTime !== undefined) {
      payload.closingTime = request.closingTime;
    }

    if (request.options !== undefined) {
      if (request.options.length < 2) {
        throw new Error("Poll must have at least 2 options");
      }

      payload.options = request.options.map((option) =>
        typeof option === "string" ? option : option.text
      );
    }

    if (request.type !== undefined) {
      payload.type = request.type;
    }

    if (request.multiSelect !== undefined) {
      payload.multiSelect = request.multiSelect;
    }

    if (request.anonymousVoting !== undefined) {
      payload.anonymousVoting = request.anonymousVoting;
    }

    if (request.allowAddOptions !== undefined) {
      payload.allowAddOptions = request.allowAddOptions;
    }

    if (request.hiddenPoll !== undefined) {
      payload.hiddenPoll = request.hiddenPoll;
    }

    if (request.showResult !== undefined) {
      payload.showResult = formatShowResult(request.showResult);
    }

    const response = await apiPatch<Poll | PollResponse, typeof payload>(
      `/polls/${pollId}`,
      payload,
      {
        authToken: token,
      }
    );

    return unwrapPoll(response);
  },

  setupWebSocket: async (
    pollId: string,
    handlers: PollWebSocketHandlers
  ): Promise<void> => {
    if (typeof window === "undefined") {
      return;
    }

    if (!pollId) {
      throw new Error("Poll ID is required");
    }

    const existingSocket = pollSockets.get(pollId);

    if (
      existingSocket &&
      (existingSocket.readyState === WebSocket.OPEN ||
        existingSocket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const token = await getLiveToken();
    const socketUrl = getPollWebSocketUrl(pollId, token);
    const socket = new WebSocket(socketUrl);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        const eventType =
          data.type ||
          data.event ||
          data.action ||
          data.status ||
          "";

        const pollPayload =
          data.payload ||
          data.poll ||
          data.data ||
          data;

        if (
          String(eventType).toLowerCase().includes("close") ||
          String(eventType).toLowerCase().includes("ended")
        ) {
          handlers.onPollClosed?.();
          return;
        }

        if (pollPayload && typeof pollPayload === "object") {
          handlers.onVoteUpdate?.(unwrapPoll(pollPayload));
        }
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error(String(error));
        handlers.onError?.(err);
      }
    };

    socket.onerror = () => {
      handlers.onError?.(new Error("Poll WebSocket connection error"));
    };

    socket.onclose = () => {
      pollSockets.delete(pollId);
    };

    pollSockets.set(pollId, socket);
  },

  closePollConnection: (pollId: string): void => {
    const socket = pollSockets.get(pollId);

    if (socket) {
      socket.close();
      pollSockets.delete(pollId);
    }
  },

  getPoll: async (pollId: string): Promise<Poll> => {
    return pollService.getById(pollId);
  },

  votePoll: async (
    pollId: string,
    request: PollVoteRequest,
    token?: string
  ): Promise<Poll> => {
    return pollService.vote(pollId, request, token);
  },

  getPollOptions: async (pollId: string): Promise<any> => {
    return pollService.getOptions(pollId);
  },

  createPoll: async (request: PollCreateRequest): Promise<Poll> => {
    return pollService.create(request);
  },

  updatePoll: async (
    pollId: string,
    request: Partial<PollCreateRequest>
  ): Promise<Poll> => {
    return pollService.update(pollId, request);
  },
};