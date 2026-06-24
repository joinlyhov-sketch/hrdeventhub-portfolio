"use client";

import { useEffect, useRef, useCallback } from "react";
import { Conversation } from "@/types/chat";
import { useChatStore } from "@/store/useChatStore";
import { getConversations } from "@/service/conversation.service";
import { WS_URL } from "@/libs/constants";

export function useGlobalChatSync(token: string | null, userId: string | null) {
  const stompRef = useRef<any>(null);
  const subRef = useRef<any>(null);
  const cancelledRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncConversations = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getConversations(token);
      useChatStore.getState().setConversations(data);
    } catch {}
  }, [token]);

  const connect = useCallback(async () => {
    if (cancelledRef.current || !token || !userId) return;

    const { default: SockJS } = await import("sockjs-client");
    const { Stomp } = await import("@stomp/stompjs");

    if (cancelledRef.current) return;

    const client = Stomp.over(() => new SockJS(`${WS_URL}?token=${token}`));
    client.debug = () => {};
    stompRef.current = client;

    client.connect(
      {},
      () => {
        if (cancelledRef.current) return;

        subRef.current = client.subscribe(
          `/user/${userId}/queue/conversations`,
          (frame: any) => {
            try {
              const updated: Conversation = JSON.parse(frame.body);
              useChatStore.getState().upsertConversation(updated);
            } catch {}
          },
        );
      },
      () => {
        if (cancelledRef.current) return;
        syncConversations(); 
        reconnectTimerRef.current = setTimeout(() => connect(), 4000);
      },
    );
  }, [token, userId, syncConversations]);

  useEffect(() => {
    if (!token || !userId) return;

    cancelledRef.current = false;
    syncConversations();
    connect();

    return () => {
      cancelledRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      subRef.current?.unsubscribe();
      stompRef.current?.disconnect?.();
      stompRef.current = null;
    };
  }, [token, userId, connect, syncConversations]);

  useEffect(() => {
    if (!token) return;
    window.addEventListener("focus", syncConversations);
    return () => window.removeEventListener("focus", syncConversations);
  }, [token, syncConversations]);

  useEffect(() => {
    if (!token) return;
    window.addEventListener("online", syncConversations);
    return () => window.removeEventListener("online", syncConversations);
  }, [token, syncConversations]);
}