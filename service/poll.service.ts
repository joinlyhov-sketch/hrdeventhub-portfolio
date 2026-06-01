import { env } from "@/libs/env";
import { Poll, PollVoteRequest, PollCreateRequest } from "@/types/poll";
import { getSession } from "next-auth/react";

const apiBaseUrl = env?.NEXT_PUBLIC_API_BASE_URL;
const wsBaseUrl = apiBaseUrl?.replace(/^http/, "ws") || "";

if (!apiBaseUrl) {
  throw new Error("API base URL is not configured.");
}

interface PollServiceConfig {
  onVoteUpdate?: (poll: Poll) => void;
  onPollClosed?: (pollId: string) => void;
  onError?: (error: Error) => void;
}

class PollService {
  private wsConnections: Map<string, WebSocket> = new Map();
  private pollTimers: Map<string, NodeJS.Timeout> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  async getPoll(pollId: string): Promise<Poll> {
    const session = await getSession();
    const token = session?.accessToken || (session?.user as any)?.token;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(`${apiBaseUrl}/polls/${pollId}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch poll: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        `Error fetching poll: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  
  async votePoll(pollId: string, voteRequest: PollVoteRequest): Promise<Poll> {
    const session = await getSession();
    const token = session?.accessToken || (session?.user as any)?.token;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(`${apiBaseUrl}/polls/${pollId}/vote`, {
        method: "POST",
        headers,
        body: JSON.stringify(voteRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit vote: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        `Error submitting vote: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getPollOptions(pollId: string): Promise<any> {
    const session = await getSession();
    const token = session?.accessToken || (session?.user as any)?.token;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(`${apiBaseUrl}/polls/${pollId}/options`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch options: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        `Error fetching options: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private formatShowResult(value: string | undefined): string {
    if (!value) return "always";

    const cleanValue = value.toLowerCase().trim();

    if (cleanValue.includes("always")) return "always";
    if (cleanValue.includes("voting") || cleanValue.includes("aftervote"))
      return "after_vote";
    if (cleanValue.includes("expire") || cleanValue.includes("close"))
      return "after_close";

    return "always"; 
  }

  async createPoll(request: PollCreateRequest): Promise<Poll> {
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
    if (closingTime <= Date.now()) {
      throw new Error("Closing time must be in the future");
    }

    if (!request.workspaceId) {
      throw new Error("Workspace ID is required");
    }

    const session = await getSession();
    const token = session?.accessToken || (session?.user as any)?.token;

    if (!token) {
      throw new Error("Authentication required");
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const optionsArray = request.options.map((opt) =>
        typeof opt === "string" ? opt : opt.text,
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
        showResult: this.formatShowResult(request.showResult), // Dynamically formats value to snake_case format
      };

      console.log("Poll service - Creating poll with payload:", payload);

      const response = await fetch(`${apiBaseUrl}/polls`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Poll service - Error response:", errorText);
        throw new Error(
          `Failed to create poll: ${errorText || response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Poll service - Caught error:", error);
      throw new Error(
        `Error creating poll: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async updatePoll(
    pollId: string,
    request: Partial<PollCreateRequest>,
  ): Promise<Poll> {
    if (!pollId) {
      throw new Error("Poll ID is required");
    }

    if (request.closingTime) {
      const closingTime = new Date(request.closingTime).getTime();
      if (closingTime <= Date.now()) {
        throw new Error("Closing time must be in the future");
      }
    }

    const session = await getSession();
    const token = session?.accessToken || (session?.user as any)?.token;

    if (!token) {
      throw new Error("Authentication required");
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const payload: any = {};

      if (request.title !== undefined) {
        payload.title = request.title.trim();
      }

      if (request.description !== undefined) {
        payload.description = request.description.trim();
      }

      if (request.options !== undefined) {
        if (request.options.length < 2) {
          throw new Error("Poll must have at least 2 options");
        }
        payload.options = request.options.map((opt) => ({
          text: typeof opt === "string" ? opt : opt.text,
        }));
      }

      if (request.closingTime !== undefined) {
        payload.closingTime = request.closingTime;
      }

      if (request.showResult !== undefined) {
        payload.showResult = this.formatShowResult(request.showResult);
      }

      const response = await fetch(`${apiBaseUrl}/polls/${pollId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update poll: ${errorText || response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        `Error updating poll: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async setupWebSocket(
    pollId: string,
    config: PollServiceConfig = {},
  ): Promise<WebSocket> {
    const poll = await this.getPoll(pollId);
    const closingTime = new Date(poll.closingTime).getTime();
    const now = Date.now();

    if (now >= closingTime) {
      const error = new Error("Poll has already closed");
      config.onError?.(error);
      throw error;
    }

    if (this.wsConnections.has(pollId)) {
      return this.wsConnections.get(pollId)!;
    }

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${wsBaseUrl}/polls/${pollId}/subscribe`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log(`WebSocket connected for poll ${pollId}`);
          this.wsConnections.set(pollId, ws);
          this.reconnectAttempts.delete(pollId);
          this.setupPollClosingTimer(pollId, closingTime, config);
          resolve(ws);
        };

        ws.onmessage = (event) => {
          try {
            const update = JSON.parse(event.data);
            if (update.type === "vote") {
              config.onVoteUpdate?.(update.data.poll);
            } else if (update.type === "poll_closed") {
              config.onPollClosed?.(pollId);
              this.closePollConnection(pollId);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onerror = (error) => {
          const wsError = new Error(`WebSocket error for poll ${pollId}`);
          console.error(wsError, error);
          config.onError?.(wsError);
          reject(wsError);
        };

        ws.onclose = () => {
          console.log(`WebSocket closed for poll ${pollId}`);
          this.wsConnections.delete(pollId);
          this.attemptReconnect(pollId, config);
        };
      } catch (error) {
        const setupError = new Error(`Failed to setup WebSocket: ${error}`);
        config.onError?.(setupError);
        reject(setupError);
      }
    });
  }

  private setupPollClosingTimer(
    pollId: string,
    closingTime: number,
    config: PollServiceConfig,
  ): void {
    if (this.pollTimers.has(pollId)) {
      clearTimeout(this.pollTimers.get(pollId));
    }

    const timeUntilClosing = closingTime - Date.now();

    if (timeUntilClosing > 0) {
      const timer = setTimeout(() => {
        console.log(`Poll ${pollId} closing time reached`);
        config.onPollClosed?.(pollId);
        this.closePollConnection(pollId);
      }, timeUntilClosing);

      this.pollTimers.set(pollId, timer);
    }
  }

  private attemptReconnect(pollId: string, config: PollServiceConfig): void {
    const attempts = this.reconnectAttempts.get(pollId) || 0;

    if (attempts < this.maxReconnectAttempts) {
      console.log(
        `Attempting to reconnect to poll ${pollId} (attempt ${attempts + 1}/${this.maxReconnectAttempts})`,
      );
      this.reconnectAttempts.set(pollId, attempts + 1);

      setTimeout(
        () => {
          this.setupWebSocket(pollId, config).catch((error) => {
            console.error(`Reconnection failed for poll ${pollId}:`, error);
          });
        },
        this.reconnectDelay * (attempts + 1),
      );
    } else {
      const error = new Error(
        `Max reconnection attempts reached for poll ${pollId}`,
      );
      config.onError?.(error);
    }
  }

  closePollConnection(pollId: string): void {
    const ws = this.wsConnections.get(pollId);
    if (ws) {
      ws.close();
      this.wsConnections.delete(pollId);
    }

    if (this.pollTimers.has(pollId)) {
      clearTimeout(this.pollTimers.get(pollId));
      this.pollTimers.delete(pollId);
    }

    this.reconnectAttempts.delete(pollId);
  }

  closeAllConnections(): void {
    this.wsConnections.forEach((ws, pollId) => {
      this.closePollConnection(pollId);
    });
  }

  isConnected(pollId: string): boolean {
    const ws = this.wsConnections.get(pollId);
    return ws !== undefined && ws.readyState === WebSocket.OPEN;
  }
}

export const pollService = new PollService();
