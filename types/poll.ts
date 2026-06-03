export interface PollOption {
  id: string;
  text: string;
  voteCount?: number;
  percentage?: number;
}

export interface Poll {
  pollId: string;
  appUserId: string;
  workspaceId: string;
  title: string;
  description?: string;
  type: string;
  options: PollOption[];
  closingTime: string;
  multiSelect: boolean;
  anonymousVoting: boolean;
  allowAddOptions: boolean;
  hiddenPoll: boolean;
  showResult: string;
  createdAt: string;
  updatedAt: string;

  hasVoted?: boolean;
  selectedOptionIds?: string[];
  votedOptionIds?: string[];
  totalVotes?: number;
}

export interface PollsResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Poll[];
  timestamp: string;
}

export interface PollResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Poll;
  timestamp: string;
}

export interface PollVoteRequest {
  optionIds: string[];
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