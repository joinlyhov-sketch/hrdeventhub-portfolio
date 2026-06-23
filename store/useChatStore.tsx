import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Conversation, ChatMessage } from "@/types/chat";

interface ChatStore {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  locallyReadIds: Record<string, true>;
  setConversations: (convs: Conversation[]) => void;
  upsertConversation: (conv: Conversation) => void;
  removeConversation: (conversationId: string) => void;
  mergeMessages: (conversationId: string, incoming: ChatMessage[]) => void;
  addMessage: (msg: ChatMessage) => void;
  updateMessage: (updated: ChatMessage) => void;
  removeMessage: (messageId: string, conversationId: string) => void;
  markRead: (conversationId: string, readerUserId: string) => void;
  bumpLastMessage: (
    conversationId: string,
    content: string,
    at: string,
  ) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      locallyReadIds: {},

      setConversations: (convs) =>
        set((s) => {
          const nextLocallyRead = { ...s.locallyReadIds };

          const merged = convs.map((c) => {
            if (s.locallyReadIds[c.id]) {
              if (c.unreadCount === 0) {
                delete nextLocallyRead[c.id];
                return c;
              }
              return { ...c, unreadCount: 0 };
            }
            return c;
          });

          return { conversations: merged, locallyReadIds: nextLocallyRead };
        }),

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
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          if (
            merged.length === stored.length &&
            merged.every(
              (m, i) => m.id === stored[i].id && m.read === stored[i].read,
            )
          ) {
            return s;
          }
          return { messages: { ...s.messages, [conversationId]: merged } };
        }),

      addMessage: (msg) =>
        set((s) => {
          const list = s.messages[msg.conversationId] ?? [];
          if (list.some((m) => m.id === msg.id)) return s;
          const updatedConvs = s.conversations.map((c) =>
            c.id === msg.conversationId
              ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt }
              : c,
          );

          const { [msg.conversationId]: _drop, ...restLocallyRead } =
            s.locallyReadIds;
          return {
            messages: {
              ...s.messages,
              [msg.conversationId]: [...list, msg],
            },
            conversations: updatedConvs,
            locallyReadIds: restLocallyRead,
          };
        }),

      updateMessage: (updated) =>
        set((s) => {
          const list = s.messages[updated.conversationId] ?? [];
          const existing = list.find((m) => m.id === updated.id);
          if (
            existing?.content === updated.content &&
            existing?.isEdited === updated.isEdited
          )
            return s;
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
          if (!list.some((m) => m.id === messageId)) return s;
          return {
            messages: {
              ...s.messages,
              [conversationId]: list.filter((m) => m.id !== messageId),
            },
          };
        }),

      removeConversation: (conversationId) =>
        set((s) => {
          const { [conversationId]: _msgs, ...restMessages } = s.messages;
          const { [conversationId]: _read, ...restLocallyRead } =
            s.locallyReadIds;
          return {
            conversations: s.conversations.filter(
              (c) => String(c.id) !== String(conversationId),
            ),
            messages: restMessages,
            locallyReadIds: restLocallyRead,
          };
        }),

      markRead: (conversationId, readerUserId) =>
        set((s) => {
          const list = s.messages[conversationId] ?? [];
          const hasUnread = list.some(
            (m) => String(m.senderId) !== String(readerUserId) && !m.read,
          );
          const alreadyZero =
            s.conversations.find((c) => c.id === conversationId)
              ?.unreadCount === 0;
          if (!hasUnread && alreadyZero) return s;

          return {
            messages: {
              ...s.messages,
              [conversationId]: list.map((m) =>
                String(m.senderId) !== String(readerUserId) && !m.read
                  ? { ...m, read: true }
                  : m,
              ),
            },
            conversations: s.conversations.map((c) =>
              c.id === conversationId && c.unreadCount !== 0
                ? { ...c, unreadCount: 0 }
                : c,
            ),
            locallyReadIds: { ...s.locallyReadIds, [conversationId]: true },
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
      }),
    },
  ),
);
