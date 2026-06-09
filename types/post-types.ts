import { ArticlePayload } from "./article-types";

export interface PostLocation {
  locationName: string;
  googleMapUrl: string;
}

export interface PostMediaItem {
  filePath: string;
  isCover: boolean;
}

export interface PostPayment {
  paymentType?: "fixed" | "flexible";
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
  payload?: ArticlePayload;
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
  expiresAt: string;
  scheduledAt: string | null;
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
  payload: Comment[] | Post[];
  timestamp: string;
  postId: string;
}

export interface Post {
  postId: string;
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
  payload?: ArticlePayload;
  timestamp: string;
}

export interface ApiFieldError {
  message: string;
  field: string;
}

export interface ApiFieldError {
  message: string;
  field: string;
}

export interface PostEventPayloadDetails {
  postId: string;
  category: string;
  title: string;
  content: string;
  purpose: string;
  scheduledAt: string;
  status: "draft" | "active" | "closed";
  expiresAt: string;
  eventStart: string;
  eventEnd: string;
  createdAt: string;
  updatedAt: string;
  appUserId: string;
  location: PostLocation & { locationId: string };
  media: unknown[];
  comments: unknown[];
  creator: {
    userId: string;
    fullName: string;
    profilePicture: string;
    role: string;
  };
  pinned: boolean;
  published: boolean;
}

export interface CreatePostSuccessResponse {
  success: true;
  message: string;
  status: string;
  payload: PostEventPayloadDetails;
  timestamp: string;
}

export interface CreatePostErrorResponse {
  detail: string;
  instance: string;
  status: number;
  title: string;
  type: string;
  timestamp: string;
  errors: ApiFieldError[];
}

export type CreatePostActionResponse =
  | {
      ok: true;
      payload: CreatePostSuccessResponse;
      error?: never;
      errors?: never;
    }
  | {
      ok: false;
      error: string;
      errors?: ApiFieldError[];
      payload?: never;
    };

export interface UpdateEventPayload {
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
  location: {
    locationName: string;
    googleMapUrl: string;
  };
  media: PostMediaItem[];
  payment: PostPayment;
}

export type UpdatePostActionResponse =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      error: string;
      errors?: ApiFieldError[];
    };

export interface UpdateArticlePayload {
  title: string;
  content: string;
  isPublished: boolean;
  status: "draft" | "active";
  isPinned: boolean;
}

export interface ApiResponseActionWrapper {
  ok: boolean;
  error?: string;
  errors?: Array<{ message: string }>;
}

export interface ArticleCreator {
  userId: string;
  fullName: string;
  profilePicture: string;
  role: string;
}

export interface UpdateArticleResponsePayload {
  postId: string;
  category: "article" | string;
  title: string;
  content: string;
  status: "draft" | "active" | string;
  createdAt: string;
  updatedAt: string;
  appUserId: string;
  media: unknown[];
  comments: unknown[];
  creator: ArticleCreator;
  pinned: boolean;
  published: boolean;
}

export interface UpdateArticleApiResponse {
  success: boolean;
  message: string;
  status: string;
  payload: UpdateArticleResponsePayload;
  timestamp: string;
}

export interface ApiResponseActionWrapper {
  ok: boolean;
  error?: string;
  data?: UpdateArticleResponsePayload;
}

export interface BackendPostPayload {
  postId: string;
  category: string;
  title: string;
  content: string;
  purpose: string;
  scheduledAt: string;
  status: "draft" | "active" | string;
  expiresAt: string;
  eventStart?: string;
  eventEnd?: string;
  createdAt: string;
  updatedAt: string;
  appUserId: string;
  mentionedUserIds?: { userIds: string[] };
  location?: {
    locationId: string;
    locationName: string;
    googleMapUrl: string;
    latitude: number;
    longitude: number;
  };
  media?: Array<{
    mediaId: string;
    fileName: string;
    filePath: string;
    fileType: string;
    isCover: boolean;
    createdAt: string;
  }>;
  payment?: {
    postPaymentId: string;
    paymentType: string;
    paymentAmount: number;
    donationGoal: number;
    amountRaised: number;
    createdAt: string;
    updatedAt: string;
    khqrData?: string;
    khqrDataBase64?: string;
  };
  pinned: boolean;
  published: boolean;
}

export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  status: string;
  payload: T;
  timestamp: string;
}

export interface AnnouncementCreator {
  userId: string;
  fullName: string;
  profilePicture: string;
  role: string;
}

export interface AnnouncementPost {
  postId: string;
  workspaceId: string;
  appUserId: string;
  category: string;
  title: string;
  content: string;
  purpose: string;

  eventStart: string;
  eventEnd: string;
  scheduledAt: string | null;
  expiresAt: string;

  status: "draft" | "active" | "closed";
  published: boolean;
  pinned: boolean;

  createdAt: string;
  updatedAt: string;

  creator: AnnouncementCreator;

  media: unknown[];
  comments: unknown[];
}

export interface CreateAnnouncementResponseV2 {
  success: boolean;
  message: string;
  status: string;
  payload: AnnouncementPost;
  timestamp: string;
}

export interface ChangeEventStatusPayload {
  status: "draft" | "active" | "closed";
  reason: string;
}

export interface LocationInfo {
  locationId: string;
  locationName: string;
  googleMapUrl: string;
  latitude: number;
  longitude: number;
}

export interface MediaItem {
  mediaId: string;
  filePath: string;
  isCover: boolean;
  createdAt: string;
}

export interface PaymentInfo {
  postPaymentId: string;
  paymentType: "fixed" | "free" | "donation"; // Adjusted based on common configurations, expand as needed
  paymentAmount: number;
  donationGoal: number;
  amountRaised: number;
  createdAt: string;
  updatedAt: string;
  paymentAccId: string;
}

export interface CreatorInfo {
  userId: string;
  fullName: string;
  profilePicture: string;
  role: "ADMIN" | "STAFF" | "VISITOR";
}

export interface PostPayload {
  postId: string;
  category: string;
  title: string;
  content: string;
  purpose: string;
  status: "draft" | "active" | "closed";
  expiresAt: string;
  eventStart: string;
  eventEnd: string;
  createdAt: string;
  updatedAt: string;
  appUserId: string;
  location: LocationInfo;
  media: MediaItem[];
  payment: PaymentInfo;
  comments: any[];
  creator: CreatorInfo;
  workspaceId: string;
  pinned: boolean;
  published: boolean;
}

export interface ChangePostStatusResponse {
  success: boolean;
  message: string;
  status: string;
  payload: PostPayload;
  timestamp: string;
}

export type UpdateArticleResponse = ApiResponseWrapper<BackendPostPayload>;
export type PublishPostResponse = ApiResponseWrapper<BackendPostPayload>;
