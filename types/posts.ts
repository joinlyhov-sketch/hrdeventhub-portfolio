
export interface PostLocation {
  locationId: string;
  googleMapUrl: string;
  latitude: number;
  longitude: number;
}

export interface PostMedia {
  mediaId: string;
  fileName: string;
  filePath: string;
  fileType: "image" | "document";
  isCover: boolean;
  createdAt: string;
}

export interface PostPayment {
  postPaymentId: string;
  paymentType: string;
  paymentAmount: number;
  donationGoal: number;
  amountRaised: number;
  createdAt: string;
  updatedAt: string;
  paymentAccId: string;
}

export type PostCategory = "event" | "announcement" | "article" | "poll" | "survey";

export interface Post {
  postId: string;
  category: PostCategory;
  title: string;
  content: string;
  scheduledAt: string;
  status: string;
  expiresAt: string;
  eventStart: string;
  createdAt: string;
  updatedAt: string;
  appUserId: string;
  location?: PostLocation;
  media?: PostMedia[];
  payment?: PostPayment;
  comments: unknown[];
  pinned: boolean;
  published: boolean;
}

export interface PostsResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Post[];
  timestamp: string;
}