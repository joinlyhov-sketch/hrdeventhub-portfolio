import { env } from "@/libs/env";
import { Poll, PollVoteRequest, PollCreateRequest } from "@/types/poll";
import { 
  getPollAction, 
  votePollAction, 
  getPollOptionsAction, 
  createPollAction, 
  updatePollAction 
} from "../actions/poll.action";

const apiBaseUrl = env?.NEXT_PUBLIC_API_BASE_URL;
const wsBaseUrl = apiBaseUrl?.replace(/^http/, "ws") || "";

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
    return await getPollAction(pollId);
  }

  async votePoll(pollId: string, voteRequest: PollVoteRequest): Promise<Poll> {
    return await votePollAction(pollId, voteRequest);
  }

  async getPollOptions(pollId: string): Promise<any> {
    return await getPollOptionsAction(pollId);
  }

  async createPoll(request: PollCreateRequest): Promise<Poll> {
    return await createPollAction(request);
  }

  async updatePoll(pollId: string, request: Partial<PollCreateRequest>): Promise<Poll> {
    return await updatePollAction(pollId, request);
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
      const error = new Error(`Max reconnection attempts reached for poll ${pollId}`);
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