import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Conversation, ChatMessage } from "@/types/chat";

interface ChatStore {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  setConversations: (convs: Conversation[]) => void;
  upsertConversation: (conv: Conversation) => void;
  mergeMessages: (conversationId: string, incoming: ChatMessage[]) => void;
  addMessage: (msg: ChatMessage) => void;
  updateMessage: (updated: ChatMessage) => void;
  removeMessage: (messageId: string, conversationId: string) => void;
  markRead: (conversationId: string, readerUserId: string) => void;
  bumpLastMessage: (conversationId: string, content: string, at: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      conversations: [],
      messages: {},

      setConversations: (convs) =>
        set({ conversations: convs }),

      upsertConversation: (conv) =>
        set((s) => {
          const exists = s.conversations.find((c) => c.id === conv.id);
          if (!exists) return { conversations: [conv, ...s.conversations] };
          return {
            conversations: s.conversations.map((c) =>
              c.id === conv.id ? { ...c, ...conv } : c,
            ),
          };
        }),
      mergeMessages: (conversationId, incoming) =>
        set((s) => {
          const stored = s.messages[conversationId] ?? [];
          const map = new Map<string, ChatMessage>();
          for (const m of stored) map.set(m.id, m);
          for (const m of incoming) map.set(m.id, { ...map.get(m.id), ...m });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          return { messages: { ...s.messages, [conversationId]: merged } };
        }),

      addMessage: (msg) =>
        set((s) => {
          const list = s.messages[msg.conversationId] ?? [];
          if (list.find((m) => m.id === msg.id)) return s;
          const updatedConvs = s.conversations.map((c) =>
            c.id === msg.conversationId
              ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt }
              : c,
          );
          return {
            messages: {
              ...s.messages,
              [msg.conversationId]: [...list, msg],
            },
            conversations: updatedConvs,
          };
        }),

      updateMessage: (updated) =>
        set((s) => {
          const list = s.messages[updated.conversationId] ?? [];
          return {
            messages: {
              ...s.messages,
              [updated.conversationId]: list.map((m) =>
                m.id === updated.id ? { ...m, ...updated } : m,
              ),
            },
          };
        }),

      removeMessage: (messageId, conversationId) =>
        set((s) => {
          const list = s.messages[conversationId] ?? [];
          return {
            messages: {
              ...s.messages,
              [conversationId]: list.filter((m) => m.id !== messageId),
            },
          };
        }),

      markRead: (conversationId, readerUserId) =>
        set((s) => {
          const list = s.messages[conversationId] ?? [];
          return {
            messages: {
              ...s.messages,
              [conversationId]: list.map((m) =>
                String(m.senderId) !== String(readerUserId)
                  ? { ...m, read: true }
                  : m,
              ),
            },
            conversations: s.conversations.map((c) =>
              c.id === conversationId ? { ...c, unreadCount: 0 } : c,
            ),
          };
        }),

      bumpLastMessage: (conversationId, content, at) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, lastMessage: content, lastMessageAt: at }
              : c,
          ),
        })),
    }),
    {
      name: "hrd-chat-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        conversations: s.conversations,
        messages: s.messages,
      }),
    },
  ),
);