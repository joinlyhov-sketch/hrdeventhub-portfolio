import { AnnouncementPost } from "./announcement-type";
import { CreateAnnouncementResponse } from "./post-types";

export interface FileUploadPayload {
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  status: string;
  payload: {
    fileName: string;
    fileType: string;
    fileUrl: string;
    fileSize: number;
  };
  timestamp: string;
}

export interface ServerActionResponse<T> {
  ok: boolean;
  payload?: T;
  error?: string;
}

export interface PostMediaItem {
  filePath: string;
  isCover: boolean;
}

export interface ServerActionResponse2<T> {
  ok: boolean;
  payload?: T;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  status: string;
  payload: T;
  timestamp: string;
}
export interface CommentUser {
  appUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}

export interface MentionedUsers {
  userIds: string[];
}

export interface Comment {
  commentId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
  appUser: CommentUser;
  mentionedUserId: MentionedUsers;
  replies: Comment[];
}
