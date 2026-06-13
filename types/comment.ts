export type CommentUser = {
  id: number;
  authorName: string;
};

export type CommentItem = {
  id: number;
  content: string;
  user: CommentUser;
};

export interface AppUserComment {
  appUserId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}

export interface MentionedUserId {
  userIds: string[];
}

export interface Comment {
  commentId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
  appUser: AppUserComment;
  mentionedUserId: MentionedUserId;
  parentCommentId?: string;
  replies: Comment[];
}

export interface CommentsResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Comment[];
  timestamp: string;
}

export interface PostCommentResponse {
  success: boolean;
  message: string;
  status: string;
  payload?: Comment;
  timestamp: string;
}
