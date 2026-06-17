import { chatService } from "@/service/chat.service";
import { Conversation, ChatMessage, UserResult } from "@/types/chat";

export async function searchUsersAction(query: string, token: string): Promise<UserResult[]> {
  if (!query.trim()) return [];
  return chatService.searchUsers(query.trim(), token);
}

export async function startConversationAction(
  targetName: string,
  token: string,
): Promise<Conversation> {
  return chatService.getOrCreateConversation(targetName, token);
}

export async function fetchMyConversationsAction(token: string): Promise<Conversation[]> {
  return chatService.getMyConversations(token);
}

export async function fetchMessagesAction(
  conversationId: string,
  token: string,
): Promise<ChatMessage[]> {
  return chatService.getMessages(conversationId, token);
}

export async function editMessageAction(
  messageId: string,
  content: string,
  token: string,
): Promise<ChatMessage> {
  return chatService.editMessage(messageId, content, token);
}

export async function deleteMessageAction(messageId: string, token: string): Promise<void> {
  return chatService.deleteMessage(messageId, token);
}

export async function uploadFileAction(
  conversationId: string,
  file: File,
  token: string,
): Promise<ChatMessage> {
  return chatService.uploadFile(conversationId, file, token);
}