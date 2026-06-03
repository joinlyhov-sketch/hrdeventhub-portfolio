export interface PostLocation {
  locationName: string;
  googleMapUrl: string;
  latitude: number;
  longitude: number;
}

export interface PostMediaItem {
  filePath: string;
  isCover: boolean;
}

export interface PostPayment {
  paymentAmount: number;
  donationGoal: number;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  purpose: string;
  eventStart: string;
  eventEnd: string;
  scheduledAt: string | null;
  expiresAt: string;
  isPublished: boolean;
  status: "draft" | "active" | "closed";
  isPinned: boolean;
  location: PostLocation;
  media: PostMediaItem[];
  payment: PostPayment;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  status: string;
  timestamp: string;
}

export interface FileUploadBackendResponse {
  success: boolean;
  message: string;
  status: string;
  payload: string;
  timestamp: string;
}

export interface AnnouncementLocationPayload {
  locationName: string;
  googleMapUrl: string;
  latitude: number;
  longitude: number;
}

export interface AnnouncementMediaPayload {
  filePath: string;
  isCover: boolean;
}

export interface CreateAnnouncementPayload {
  title: string;
  content: string;
  purpose: string;
  eventStart: string;
  eventEnd: string;
  scheduledAt: string | null;
  expiresAt: string;
  isPublished: boolean;
  status: "draft" | "active";
  isPinned: boolean;
  location: AnnouncementLocationPayload;
  media: AnnouncementMediaPayload[];
}
export interface CreateAnnouncementResponse {
  success: boolean;
  message: string;
  status: string;
  payload: string;
  timestamp: string;
}

export interface ServerActionResponse<T> {
  ok: boolean;
  payload?: T;
  error?: string;
}

export interface CreateArticlePayload {
  title: string;
  content: string;
  isPublished: boolean;
  status: "draft" | "active";
  isPinned: boolean;
}

export interface CreateArticleBackendResponse {
  success: boolean;
  message: string;
  status: string;
  payload: string;
  timestamp: string;
}
