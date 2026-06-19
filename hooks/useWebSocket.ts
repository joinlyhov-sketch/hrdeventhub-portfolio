"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { WS_URL } from "@/libs/constants";
import {
  WsEvent,
  ChatMessage,
  WsEditEvent,
  WsDeleteEvent,
  WsReadEvent,
} from "@/types/chat";

type WsStatus = "connecting" | "connected" | "disconnected";

interface UseWebSocketOptions {
  token: string | null;
  onMessage: (msg: ChatMessage) => void;
  onEdit: (event: WsEditEvent) => void;
  onDelete: (event: WsDeleteEvent) => void;
  onRead?: (event: WsReadEvent) => void;
}

export function useWebSocket({
  token,
  onMessage,
  onEdit,
  onDelete,
  onRead,
}: UseWebSocketOptions) {
  const [status, setStatus] = useState<WsStatus>("disconnected");

  const stompRef = useRef<any>(null);
  const subRef = useRef<any>(null);
  const pendingConvRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMessageRef = useRef(onMessage);
  const onEditRef = useRef(onEdit);
  const onDeleteRef = useRef(onDelete);
  const onReadRef = useRef(onRead);

  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { onEditRef.current = onEdit; }, [onEdit]);
  useEffect(() => { onDeleteRef.current = onDelete; }, [onDelete]);
  useEffect(() => { onReadRef.current = onRead; }, [onRead]);

  const doSubscribe = useCallback((client: any, conversationId: string) => {
    subRef.current?.unsubscribe();
    subRef.current = client.subscribe(
      `/topic/conversation/${conversationId}`,
      (frame: any) => {
        try {
          const payload: WsEvent = JSON.parse(frame.body);
          if ("type" in payload && typeof (payload as any).type === "string") {
            const t = (payload as any).type as string;
            if (t === "EDIT") { onEditRef.current(payload as WsEditEvent); return; }
            if (t === "DELETE") { onDeleteRef.current(payload as WsDeleteEvent); return; }
            if (t === "READ") { onReadRef.current?.(payload as WsReadEvent); return; }
          }
          onMessageRef.current(payload as ChatMessage);
        } catch {}
      },
    );
  }, []);

  const connect = useCallback(async () => {
    if (cancelledRef.current || !token) return;

    const { default: SockJS } = await import("sockjs-client");
    const { Stomp } = await import("@stomp/stompjs");

    if (cancelledRef.current) return;

    setStatus("connecting");

    const client = Stomp.over(() => new SockJS(`${WS_URL}?token=${token}`));
    client.debug = () => {};
    stompRef.current = client;

    client.connect(
      {},
      () => {
        if (cancelledRef.current) return;
        setStatus("connected");
        if (pendingConvRef.current) {
          doSubscribe(client, pendingConvRef.current);
        }
      },
      () => {
        if (cancelledRef.current) return;
        setStatus("disconnected");
        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, 4000);
      },
    );
  }, [token, doSubscribe]);

  useEffect(() => {
    if (!token) return;

    cancelledRef.current = false;
    connect();

    return () => {
      cancelledRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      subRef.current?.unsubscribe();
      stompRef.current?.disconnect?.();
      stompRef.current = null;
    };
  }, [token, connect]);

  const subscribe = useCallback(
    (conversationId: string) => {
      pendingConvRef.current = conversationId;
      if (stompRef.current?.connected) {
        doSubscribe(stompRef.current, conversationId);
      }
    },
    [doSubscribe],
  );

  const sendMessage = useCallback((conversationId: string, content: string): boolean => {
    if (!stompRef.current?.connected) return false;
    stompRef.current.send("/app/chat.send", {}, JSON.stringify({ conversationId, content }));
    return true;
  }, []);

  const sendRead = useCallback((conversationId: string): boolean => {
    if (!stompRef.current?.connected) return false;
    stompRef.current.send("/app/chat.read", {}, JSON.stringify({ conversationId }));
    return true;
  }, []);

  return { status, subscribe, sendMessage, sendRead };
}