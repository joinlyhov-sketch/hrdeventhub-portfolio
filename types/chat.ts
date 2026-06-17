export interface AuthPayload {
  token: string;
  accessToken?: string;
  userId: string;
  id?: string;
  appUserId?: string;
  name: string;
  username?: string;
  firstName?: string;
}

export interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
}
export interface UserResult {
  appUserId: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture?: string;
}
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  read: boolean;
  messageType?: "TEXT" | "IMAGE" | "FILE";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isEdited?: boolean;
  createdAt: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
}

export interface WsEditEvent {
  type: "EDIT";
  message: ChatMessage;
}

export interface WsDeleteEvent {
  type: "DELETE";
  messageId: string;
  conversationId: string;
}

export interface WsReadEvent {
  type: "READ";
  conversationId: string;
  readBy: string;
}

export type WsEvent = ChatMessage | WsEditEvent | WsDeleteEvent | WsReadEvent;

export interface ApiResponse<T> {
  payload: T;
  message: string;
  status: number;
}