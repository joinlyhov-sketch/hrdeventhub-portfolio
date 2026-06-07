
export interface CreateEndorsementPayload {
  skill: string;
  comment: string;
  studentId: string;
  postId: string;
}

export interface BaseEndorsementResponse {
  success: boolean;
  message: string;
  status: string;
  timestamp: string;
}

export interface ParticipantUser {
  appUserId: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface RegistrationPayloadItem {
  participantId: string;
  registeredAt: string;
  remark: string;
  postId: string;
  user: ParticipantUser;
  paymentStatus: string;
}

export interface FetchRegistrationsResponse {
  success: boolean;
  message: string;
  status: string;
  payload: RegistrationPayloadItem[];
  timestamp: string;
}