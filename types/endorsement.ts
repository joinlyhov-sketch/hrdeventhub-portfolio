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

export interface RegistrationPost {
  postId: string;
  category: string;
  title: string;
  content: string;
  purpose: string;
  published: boolean;
  scheduledAt: string | null;
  status: string;
  pinned: boolean;
  expiresAt: string | null;
  eventStart: string | null;
  eventEnd: string | null;
  deletedAt: string | null;
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  appUserId: string;
  media?: EndorsementMedia[];
  location?: EndorsementLocation;
  payment?: {
    postPaymentId: string;
    paymentType: string;
    paymentAmount: number | null;
    donationGoal: number | null;
    amountRaised: number;
    postId: string;
    paymentAccId: string | null;
    billNo: string | null;
    accountNo: string | null;
    khqrData: string | null;
    khqrDataBase64: string | null;
    requestId: string | null;
  };
}

export interface RegistrationPayloadItem {
  participantId: string;
  registeredAt: string;
  remark: string;
  postId: string;
  post: RegistrationPost;
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