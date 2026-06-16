"use client";

import { useCallback, useState } from "react";
import { Conversation } from "@/types/chat";
import { getConversations, getOrCreateConversation } from "@/service/conversation.service";
import { useChatStore } from "@/store/useChatStore";

export function useConversations(token: string | null) {
  const [loading, setLoading] = useState(false);
  const { conversations, setConversations, upsertConversation } = useChatStore();

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getConversations(token);
      setConversations(data);
    } catch {
      // keep stale store data on network failure
    } finally {
      setLoading(false);
    }
  }, [token, setConversations]);

  const startChat = useCallback(
    async (targetUserId: string): Promise<Conversation | null> => {
      if (!token) return null;
      try {
        const conv = await getOrCreateConversation(token, targetUserId);
        upsertConversation(conv);
        return conv;
      } catch {
        return null;
      }
    },
    [token, upsertConversation],
  );

  return { conversations, loading, refresh, startChat };
}