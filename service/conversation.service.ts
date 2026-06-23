import { API_BASE } from "@/libs/constants";
import { Conversation } from "@/types/chat";

type FlexResponse<T> = { payload?: T; data?: T; message?: string };

export async function getConversations(token: string): Promise<Conversation[]> {
  const res = await fetch(`${API_BASE}/chat/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data: FlexResponse<Conversation[]> = await res.json();
  return data.payload ?? data.data ?? [];
}

export async function getOrCreateConversation(
  token: string,
  targetName: string
): Promise<Conversation> {
  const res = await fetch(
    `${API_BASE}/chat/conversations?targetName=${targetName}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data: FlexResponse<Conversation> = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to create conversation");
  return (data.payload ?? data.data) as Conversation;
}