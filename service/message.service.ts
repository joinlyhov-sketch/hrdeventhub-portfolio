import { API_BASE } from "@/libs/constants";
import { ChatMessage, ApiResponse } from "@/types/chat";

export async function getMessages(
  token: string,
  conversationId: string,
  page = 0,
  size = 50
): Promise<ChatMessage[]> {
  const res = await fetch(
    `${API_BASE}/chat/conversations/${conversationId}/messages?page=${page}&size=${size}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data: ApiResponse<ChatMessage[]> & { data?: ChatMessage[] } = await res.json();
  return data.payload ?? data.data ?? [];
}

export async function editMessage(
  token: string,
  messageId: string,
  content: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/chat/messages/${messageId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to edit message");
}

export async function deleteMessage(
  token: string,
  messageId: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/chat/messages/${messageId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete message");
}