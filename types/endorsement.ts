export interface CreateEndorsementPayload {
  skill: string;
  comment: string;
  studentId: string;
  postId: string;
}

export interface EndorsementPayload {
  endorsementId: string;
  skill: string;
  comment: string;
  createdAt: string;
  alumniId: string;
  studentId: string;
  postId: string;
}

export interface BaseEndorsementResponse {
  success: boolean;
  message: string;
  status: string;
  timestamp: string;
}

export interface FetchEndorsementsResponse extends BaseEndorsementResponse {
  payload: EndorsementPayload[];
}