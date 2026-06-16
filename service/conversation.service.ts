import { API_BASE } from "@/libs/constants";
import { Conversation, ApiResponse } from "@/types/chat";

export async function getConversations(token: string): Promise<Conversation[]> {
  const res = await fetch(`${API_BASE}/chat/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data: ApiResponse<Conversation[]> = await res.json();
  return data.payload ?? (data as any).data ?? [];
}

export async function getOrCreateConversation(
  token: string,
  targetUserId: string
): Promise<Conversation> {
  const res = await fetch(
    `${API_BASE}/chat/conversations?targetUserId=${targetUserId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data: ApiResponse<Conversation> = await res.json();
  if (!res.ok) throw new Error((data as any).message ?? "Failed to create conversation");
  return data.payload ?? (data as any).data;
}