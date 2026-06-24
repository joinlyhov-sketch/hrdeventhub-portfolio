export interface VoterDTO {
  appUserId: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

export interface OptionVotersDTO {
  optionId: string;
  optionText: string;
  voters: VoterDTO[];
}

export interface PollVotersResponse {
  success: boolean;
  message: string;
  status: string;
  payload: OptionVotersDTO[];
  timestamp: string;
}
