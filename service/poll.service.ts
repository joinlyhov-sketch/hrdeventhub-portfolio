import { apiGet, apiPost, apiPatch, apiDelete } from "@/libs/api";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { Poll, PollCreateRequest, PollVoteRequest } from "@/types/poll";

interface BackendApiResponse<T> {
  success: boolean;
  message: string;
  status: string;
  payload: T;
}

type PollWebSocketHandlers = {
  onVoteUpdate?: (poll: Poll) => void;
  onPollClosed?: () => void;
  onError?: (error: Error) => void;
};

const pollSockets = new Map<string, WebSocket>();

const getLiveToken = async (): Promise<string | undefined> => {
  if (typeof window === "undefined") {
    const session = await getServerSession(authOptions);
    return session?.accessToken || (session?.user as Record<string, unknown>)?.token as string | undefined;
  }
  const session = await getSession();
  return session?.accessToken || (session?.user as Record<string, unknown>)?.token as string | undefined;
};

function formatShowResult(value: string | undefined): string {
  if (!value) return "always";
  const cleanValue = value.toLowerCase().trim();
  if (cleanValue.includes("always")) return "always";
  if (cleanValue.includes("voting") || cleanValue.includes("aftervote"))
    return "after_vote";
  if (cleanValue.includes("expire") || cleanValue.includes("close"))
    return "after_close";
  return "always";
}

function getPollWebSocketUrl(pollId: string, token?: string): string {
  const directWsUrl =
    process.env.NEXT_PUBLIC_POLL_WS_URL || process.env.NEXT_PUBLIC_WS_URL;

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
      "Missing NEXT_PUBLIC_POLL_WS_URL or NEXT_PUBLIC_API_BASE_URL for poll WebSocket.",
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
  getAll: async (page: number = 1, size: number = 100): Promise<Poll[]> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<Poll[]>>(
      `/polls?page=${page}&size=${size}`,
      { authToken: token },
    );
    return response.payload || [];
  },

  getById: async (pollId: string): Promise<Poll> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<Poll>>(
      `/polls/${pollId}`,
      { authToken: token },
    );
    return response.payload;
  },

  getByWorkspace: async (
    workspaceId: string,
    page: number = 1,
    size: number = 10,
  ): Promise<Poll[]> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<Poll[]>>(
      `/polls/workspace/${workspaceId}?page=${page}&size=${size}`,
      { authToken: token },
    );
    return response.payload || [];
  },

  create: async (request: PollCreateRequest): Promise<Poll> => {
    if (!request.title?.trim()) throw new Error("Poll title is required");
    if (!request.options || request.options.length < 2)
      throw new Error("Poll must have at least 2 options");
    if (!request.closingTime) throw new Error("Closing time is required");

    const closingTime = new Date(request.closingTime).getTime();
    if (Number.isNaN(closingTime)) throw new Error("Invalid closing time");
    if (closingTime <= Date.now())
      throw new Error("Closing time must be in the future");
    if (!request.workspaceId) throw new Error("Workspace ID is required");

    const token = await getLiveToken();

    const payload = {
      workspaceId: request.workspaceId,
      title: request.title.trim(),
      description: request.description?.trim() || "",
      type: request.type || "text",
      options: request.options.map((opt) =>
        typeof opt === "string" ? opt : opt.text,
      ),
      closingTime: request.closingTime,
      multiSelect: request.multiSelect ?? false,
      anonymousVoting: request.anonymousVoting ?? false,
      allowAddOptions: request.allowAddOptions ?? false,
      hiddenPoll: request.hiddenPoll ?? false,
      showResult: formatShowResult(request.showResult),
    };

    const response = await apiPost<BackendApiResponse<Poll>, typeof payload>(
      "/polls",
      payload,
      { authToken: token },
    );
    return response.payload;
  },

  update: async (
    pollId: string,
    request: Partial<PollCreateRequest> & { newOptionTexts?: string[] },
  ): Promise<Poll> => {
    if (request.closingTime) {
      const closingTime = new Date(request.closingTime).getTime();
      if (Number.isNaN(closingTime)) throw new Error("Invalid closing time");
      if (closingTime <= Date.now())
        throw new Error("Closing time must be in the future");
    }

    const token = await getLiveToken();
    const payload: Record<string, unknown> = {};

    if (request.title !== undefined) payload.title = request.title.trim();
    if (request.description !== undefined)
      payload.description = request.description.trim();
    if (request.closingTime !== undefined)
      payload.closingTime = request.closingTime;
    if (request.type !== undefined) payload.type = request.type;
    if (request.multiSelect !== undefined)
      payload.multiSelect = request.multiSelect;
    if (request.anonymousVoting !== undefined)
      payload.anonymousVoting = request.anonymousVoting;
    if (request.allowAddOptions !== undefined)
      payload.allowAddOptions = request.allowAddOptions;
    if (request.hiddenPoll !== undefined)
      payload.hiddenPoll = request.hiddenPoll;
    if (request.showResult !== undefined)
      payload.showResult = formatShowResult(request.showResult);

    if (request.newOptionTexts && request.newOptionTexts.length > 0) {
    const existingTexts = (request.options ?? []).map((opt) =>
      typeof opt === "string" ? opt : opt.text,
    );
    const newCleaned = request.newOptionTexts
      .map((t) => t.trim())
      .filter(Boolean);
    payload.options = [...existingTexts, ...newCleaned];
  } else if (request.options !== undefined) {
    payload.options = request.options.map((opt) =>
      typeof opt === "string" ? opt : opt.text,
    );
  }

    const response = await apiPatch<BackendApiResponse<Poll>, typeof payload>(
      `/polls/${pollId}`,
      payload,
      { authToken: token },
    );
    return response.payload;
  },

  delete: async (pollId: string): Promise<void> => {
    const token = await getLiveToken();
    await apiDelete<unknown>(`/polls/${pollId}`, { authToken: token });
  },

  vote: async (
    pollId: string,
    voteRequest: PollVoteRequest,
    token?: string,
  ): Promise<Poll> => {
    if (!voteRequest.optionIds || voteRequest.optionIds.length === 0)
      throw new Error("At least one option ID is required");

    const authToken = token ?? (await getLiveToken());
    const response = await apiPost<BackendApiResponse<Poll>, PollVoteRequest>(
      `/polls/${pollId}/vote`,
      voteRequest,
      { authToken },
    );
    return response.payload;
  },

  getOptions: async (pollId: string): Promise<unknown> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<unknown>>(
      `/polls/${pollId}/options`,
      { authToken: token },
    );
    return response.payload;
  },

  setupWebSocket: async (
    pollId: string,
    handlers: PollWebSocketHandlers,
  ): Promise<void> => {
    if (typeof window === "undefined") return;

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
          data.type || data.event || data.action || data.status || "";
        const pollPayload = data.payload || data.poll || data.data || data;

        if (
          String(eventType).toLowerCase().includes("close") ||
          String(eventType).toLowerCase().includes("ended")
        ) {
          handlers.onPollClosed?.();
          return;
        }

        if (pollPayload && typeof pollPayload === "object") {
          handlers.onVoteUpdate?.(pollPayload as Poll);
        }
      } catch (error) {
        handlers.onError?.(
          error instanceof Error ? error : new Error(String(error)),
        );
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
};
