export interface PostLocation {
  locationName: string;
  googleMapUrl: string;
  latitude: number;
  longitude: number;
}

export interface PostMediaItem {
  fileName: string;
  filePath: string;
  fileType: string;
  isCover: boolean;
}

export interface PostPayment {
  paymentAmount: number;
  donationGoal: number;
}

export interface CreatePostPayload {
  category: "event" | "announcement" | "article";
  title: string;
  content: string;
  purpose: string;
  isPublished: boolean;
  scheduledAt: string;
  status: "draft" | "published";
  isPinned: boolean;
  expiresAt: string;
  eventStart: string;
  eventEnd: string;
  location: PostLocation;
  media: PostMediaItem[];
  payment: PostPayment;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  payload: {
    id: string;
    title: string;
  };
}
