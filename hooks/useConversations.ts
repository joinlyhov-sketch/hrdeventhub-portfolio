"use client";

import { useCallback, useState } from "react";
import { Conversation } from "@/types/chat";
import { getConversations, getOrCreateConversation } from "@/service/conversation.service";
import { useChatStore } from "@/store/useChatStore";

export function useConversations(token: string | null) {
  const [loading, setLoading] = useState(false);
  const conversations = useChatStore((s) => s.conversations);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getConversations(token);
      useChatStore.getState().setConversations(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  const startChat = useCallback(
    async (targetUserId: string): Promise<Conversation | null> => {
      if (!token) return null;
      try {
        const conv = await getOrCreateConversation(token, targetUserId);
        useChatStore.getState().upsertConversation(conv);
        return conv;
      } catch {
        return null;
      }
    },
    [token],
  );

  return { conversations, loading, refresh, startChat };
}