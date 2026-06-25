export type NotificationType =
  | "POST_CREATED"
  | "POST_UPDATED"
  | "POST_DELETED"
  | "MENTION"
  | "SURVEY_CREATED"
  | "POLL_CREATED"
  | "NEW_MESSAGE";

export interface NotificationPayload {
  notificationId: string;
  type: NotificationType;
  workspaceId?: string;
  postId?: string;
  postTitle?: string;
  postCategory?: string;
  conversationId?: string;
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  mentionedInCommentId?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface WsPostNotification {
  type: "POST_CREATED" | "POST_UPDATED" | "POST_DELETED" | "SURVEY_CREATED" | "POLL_CREATED";
  workspaceId: string;
  postId: string;
  postTitle: string;
  postCategory: string;
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  timestamp: string;
}

export interface WsMentionNotification {
  type: "MENTION";
  workspaceId: string;
  postId: string;
  postTitle: string;
  commentId: string;
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  timestamp: string;
}

export interface WsMessageNotification {
  type: "NEW_MESSAGE";
  conversationId: string;
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  timestamp: string;
}

export type WsNotification =
  | WsPostNotification
  | WsMentionNotification
  | WsMessageNotification;