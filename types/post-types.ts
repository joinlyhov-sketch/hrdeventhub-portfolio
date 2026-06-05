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
