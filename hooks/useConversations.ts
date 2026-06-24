"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Conversation } from "@/types/chat";
import { getConversations, getOrCreateConversation } from "@/service/conversation.service";
import { useChatStore } from "@/store/useChatStore";

const REVALIDATE_INTERVAL_MS = 30_000;

export function useConversations(token: string | null) {
  const [loading, setLoading] = useState(false);
  const conversations = useChatStore((s) => s.conversations);
  const revalidateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getConversations(token);
      useChatStore.getState().setConversations(data);
    } catch (err) {
      console.error("[Conversations] Failed to fetch:", err);
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


  useEffect(() => {
    if (!token) return;
    refresh();
    revalidateTimerRef.current = setInterval(refresh, REVALIDATE_INTERVAL_MS);
    return () => {
      if (revalidateTimerRef.current) clearInterval(revalidateTimerRef.current);
    };
  }, [token, refresh]);

  return { conversations, loading, refresh, startChat };
}