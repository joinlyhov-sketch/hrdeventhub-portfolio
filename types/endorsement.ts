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
  profilePicture: string | null;
}

export interface EndorsementAlumni {
  appUserId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string | null; 
}

export interface EndorsementStudent {
  appUserId: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

export interface EndorsementLocation {
  locationId: string;
  locationName: string;
  googleMapUrl: string;
  latitude: number;
  longitude: number;
}

export interface EndorsementMedia {
  mediaId: string;
  filePath: string;
  isCover: boolean;
}

export interface EndorsementPost {
  postId: string;
  category: string;
  title: string;
  content: string;
  purpose: string;
  status: string;
  eventStart: string;
  eventEnd: string;
  expiresAt: string;
  location: EndorsementLocation;
  media: EndorsementMedia[];
}

// This is the key interface TypeScript is complaining about
export interface EndorsementItem {
  endorsementId: string;
  skill: string;
  comment: string;
  createdAt: string;
  alumni: EndorsementAlumni;   
  student: EndorsementStudent; 
  post: EndorsementPost;       
}

export interface FetchReceivedEndorsementsResponse {
  success: boolean;
  message: string;
  status: string;
  payload: EndorsementItem[];
  timestamp: string;
}

export interface RegistrationPayloadItem {
    postTitle: string;
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