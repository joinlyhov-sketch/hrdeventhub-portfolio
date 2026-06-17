export interface CreateAnnouncementResponse {
  success: boolean;
  message: string;
  status: string;
  payload: AnnouncementPost;
  timestamp: string;
}

export interface AnnouncementPost {
  postId: string;
  category: "announcement";
  title: string;
  content: string;
  purpose: string;
  status: string;
  expiresAt: string;
  eventStart: string;
  eventEnd: string;
  createdAt: string;
  updatedAt: string;
  appUserId: string;
  media: AnnouncementMedia[];
  comments: AnnouncementComment[];
  creator: AnnouncementCreator;
  pinned: boolean;
  published: boolean;
}

export interface AnnouncementMedia {
  mediaId?: string;
  filePath: string;
  isCover: boolean;
  createdAt?: string;
}

export interface AnnouncementComment {
  commentId?: string;
  content?: string;
  createdAt?: string;
}

export interface AnnouncementCreator {
  userId: string;
  fullName: string;
  profilePicture: string;
  role: string;
}

export interface CreateAnnouncementResponse {
  success: boolean;
  message: string;
  status: string;
  payload: AnnouncementPost;
  timestamp: string;
}

export interface AnnouncementPostPay {
  postId: string;
  category: string;
  title: string;
  content: string;
}
