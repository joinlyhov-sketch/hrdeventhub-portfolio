import { API_BASE } from "@/libs/constants";
import { Conversation, ChatMessage, UserResult } from "@/types/chat";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  status: string;
  payload: T;
}


function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Request failed (${res.status})`);
  }

  const data: ApiResponse<T> = await res.json();

  return data.payload;
}

export const chatService = {
searchUsers(query: string, token: string): Promise<UserResult[]> {
  const url = `${API_BASE}/chat/users/search?name=${encodeURIComponent(query)}`;
  return fetch(url, {
    headers: authHeaders(token),
  }).then(async (res) => {
    if (!res.ok) {
      const bodyText = await res.clone().text();
      console.log("[DEBUG searchUsers] status:", res.status, "body:", bodyText);
    }
    return handle<UserResult[]>(res);
  });
},

  getOrCreateConversation(targetName: string, token: string): Promise<Conversation> {
    return fetch(`${API_BASE}/chat/conversations?targetName=${encodeURIComponent(targetName)}`, {
      method: "POST",
      headers: authHeaders(token),
    }).then((res) => handle<Conversation>(res));
  },

  getMyConversations(token: string): Promise<Conversation[]> {
    return fetch(`${API_BASE}/chat/conversations`, {
      headers: authHeaders(token),
    }).then((res) => handle<Conversation[]>(res));
  },

  getMessages(conversationId: string, token: string): Promise<ChatMessage[]> {
    return fetch(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
      headers: authHeaders(token),
    }).then((res) => handle<ChatMessage[]>(res));
  },

  editMessage(messageId: string, content: string, token: string): Promise<ChatMessage> {
    return fetch(`${API_BASE}/chat/messages/${messageId}`, {
      method: "PATCH",
      headers: { ...authHeaders(token), "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }).then((res) => handle<ChatMessage>(res));
  },

  deleteMessage(messageId: string, token: string): Promise<void> {
    return fetch(`${API_BASE}/chat/messages/${messageId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    }).then((res) => handle<void>(res));
  },

  uploadFile(conversationId: string, file: File, token: string): Promise<ChatMessage> {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${API_BASE}/chat/conversations/${conversationId}/upload`, {
      method: "POST",
      headers: authHeaders(token),
      body: formData,
    }).then((res) => handle<ChatMessage>(res));
  },
};