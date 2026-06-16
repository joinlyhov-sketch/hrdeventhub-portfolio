"use client";

import { useCallback, useState } from "react";
import { ChatMessage } from "@/types/chat";
import { getMessages, editMessage, deleteMessage } from "@/service/message.service";
import { useChatStore } from "@/store/useChatStore";

export function useMessages(token: string) {
  const [loading, setLoading] = useState(false);
  const store = useChatStore();

  const loadMessages = useCallback(
    async (conversationId: string) => {
      const alreadyHas = useChatStore.getState().messages[conversationId]?.length > 0;
      if (!alreadyHas) setLoading(true);

      try {
        const msgs = await getMessages(token, conversationId);
        store.mergeMessages(conversationId, msgs);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const addMessage = useCallback((msg: ChatMessage) => {
    store.addMessage(msg);
  }, []);

  const updateMessage = useCallback((msg: ChatMessage) => {
    store.updateMessage(msg);
  }, []);

  const removeMessage = useCallback((messageId: string, conversationId: string) => {
    store.removeMessage(messageId, conversationId);
  }, []);

  const editMsg = useCallback(
    async (messageId: string, content: string) => {
      await editMessage(token, messageId, content);
    },
    [token],
  );

  const deleteMsg = useCallback(
    async (messageId: string, conversationId: string) => {
      await deleteMessage(token, messageId);
      store.removeMessage(messageId, conversationId);
    },
    [token],
  );

  const updateRead = useCallback((conversationId: string, readerUserId: string) => {
    store.markRead(conversationId, readerUserId);
  }, []);

  return {
    loading,
    loadMessages,
    addMessage,
    updateMessage,
    removeMessage,
    editMessage: editMsg,
    deleteMessage: deleteMsg,
    updateRead,
  };
}