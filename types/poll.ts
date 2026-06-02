export interface PollOption {
  optionId: string;
  text: string;
  voteCount: number;
  percentage?: number;
}

export interface Poll {
  pollId: string;
  title: string;
  description?: string;
  options: PollOption[];
  closingTime: string;
  isActive: boolean;
  totalVotes: number;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  createdBy: string;
}

export interface PollVotePayload {
  pollId: string;
  optionId: string;
  userId: string;
  timestamp: string;
}

export interface PollUpdate {
  type: "vote" | "poll_closed" | "poll_updated";
  data: {
    pollId: string;
    option?: PollOption;
    poll?: Poll;
    message?: string;
  };
}

export interface PollCreateRequest {
  title: string;
  description?: string;
  options: Array<{ text: string }> | string[];
  closingTime: string;
  workspaceId: string;
  type?: string;
  multiSelect?: boolean;
  anonymousVoting?: boolean;
  allowAddOptions?: boolean;
  hiddenPoll?: boolean;
  showResult?: string;
}

export interface PollVoteRequest {
  optionId: string;
}
