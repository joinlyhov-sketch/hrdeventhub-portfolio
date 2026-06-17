"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Conversation, ChatMessage } from "@/types/chat";
import { useMessages } from "@/hooks/useMessages";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useChatStore } from "@/store/useChatStore";
import { initials } from "@/libs/utils";
import { uploadFileAction } from "@/actions/chat.action";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ChatAvatar from "./ChatAvatar";
import { usePresence } from "@/hooks/use-presence";

interface ChatWindowProps {
  conversation: Conversation;
  token: string;
  userId: string;
  userName: string;
  onConversationUpdate: () => void;
  onBack: () => void;
}

const EMPTY_MESSAGES: ChatMessage[] = [];

export default function ChatWindow({
  conversation,
  token,
  userId,
  onConversationUpdate,
  onBack,
}: Readonly<ChatWindowProps>) {
  const normalizedUserId = String(userId ?? "").trim();
  const presence = usePresence(conversation.otherUserId, token);
  const [inputVal, setInputVal] = useState("");
  const [editingMsg, setEditingMsg] = useState<ChatMessage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const readSentRef = useRef(false);
  const onUpdateRef = useRef(onConversationUpdate);
  const sendReadRef = useRef<((id: string) => boolean) | null>(null);
  const updateReadRef = useRef<
    ((convId: string, userId: string) => void) | null
  >(null);

  useEffect(() => {
    onUpdateRef.current = onConversationUpdate;
  }, [onConversationUpdate]);

  const messages = useChatStore(
    (s) => s.messages[conversation.id] ?? EMPTY_MESSAGES,
  );

  const {
    loading,
    loadMessages,
    addMessage,
    updateMessage,
    removeMessage,
    editMessage,
    deleteMessage,
    updateRead,
  } = useMessages(token);


  const handleIncomingMessage = useCallback(
    (msg: ChatMessage) => {
      if (String(msg.conversationId) !== String(conversation.id)) {
        onUpdateRef.current();
        return;
      }
      addMessage(msg);
      onUpdateRef.current();
      readSentRef.current = false;
      setTimeout(() => {
        if (readSentRef.current) return;
        readSentRef.current = true;
        sendReadRef.current?.(conversation.id);
        updateReadRef.current?.(conversation.id, normalizedUserId);
        onUpdateRef.current();
      }, 50);
    },
    [addMessage, conversation.id, normalizedUserId],
  );

  const handleEdit = useCallback(
    (e: any) => updateMessage(e.message),
    [updateMessage],
  );
  const handleDelete = useCallback(
    (e: any) => removeMessage(e.messageId, e.conversationId),
    [removeMessage],
  );
  const handleRead = useCallback(
    (e: any) => {
      if (String(e.readBy) === normalizedUserId) return;
      updateRead(e.conversationId, e.readBy);
      onUpdateRef.current();
    },
    [normalizedUserId, updateRead],
  );

  const { status, subscribe, sendMessage, sendRead } = useWebSocket({
    token,
    onMessage: handleIncomingMessage,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onRead: handleRead,
  });

  useEffect(() => {
    sendReadRef.current = sendRead;
  }, [sendRead]);
  useEffect(() => {
    updateReadRef.current = updateRead;
  }, [updateRead]);

  useEffect(() => {
    readSentRef.current = false;
    setEditingMsg(null);
    setInputVal("");
    setUploadError(null);
    subscribe(conversation.id);
    loadMessages(conversation.id);
  }, [conversation.id]);

  useEffect(() => {
    if (status !== "connected") return;
    subscribe(conversation.id);

    const timer = setTimeout(() => {
      if (readSentRef.current) return;
      const msgs = useChatStore.getState().messages[conversation.id] ?? [];
      const hasUnread = msgs.some(
        (m) => String(m.senderId).trim() !== normalizedUserId && !m.read,
      );
      if (!hasUnread) return;
      readSentRef.current = true;
      sendRead(conversation.id);
      updateRead(conversation.id, normalizedUserId);
      onUpdateRef.current();
    }, 100);

    return () => clearTimeout(timer);
  }, [status, conversation.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend() {
    const content = inputVal.trim();
    if (!content) return;
    if (editingMsg) {
      try {
        await editMessage(editingMsg.id, content);
        updateMessage({ ...editingMsg, content, isEdited: true });
      } catch {}
      setEditingMsg(null);
      setInputVal("");
      return;
    }
    const sent = sendMessage(conversation.id, content);
    if (!sent) return;
    setInputVal("");
  }

  async function handleFileUpload(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      await uploadFileAction(conversation.id, file, token);
      onUpdateRef.current();
      loadMessages(conversation.id);
    } catch (err: any) {
      setUploadError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteMsg(id: string) {
    if (!confirm("Delete this message?")) return;
    await deleteMessage(id, conversation.id);
  }

  function handleEditMsg(msg: ChatMessage) {
    setEditingMsg(msg);
    setInputVal(msg.content);
  }

  function cancelEdit() {
    setEditingMsg(null);
    setInputVal("");
  }

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      <header className="h-[64px] border-b border-gray-100 px-4 flex items-center gap-3 bg-white flex-shrink-0 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="md:hidden p-1.5 -ml-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          type="button"
          aria-label="Back"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <ChatAvatar
          name={conversation.otherUserName}
          avatarUrl={conversation.otherUserAvatar}
          size="sm"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="text-sm font-bold text-gray-900 leading-tight truncate">
            {conversation.otherUserName}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                presence?.status === "ONLINE" ? "bg-emerald-500" : "bg-gray-300"
              }`}
            />
            <span className="text-[10px] font-semibold text-gray-400">
              {presence?.label ??
                (presence?.status === "ONLINE" ? "Active now" : "Offline")}
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="More options"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <i className="ti ti-dots-vertical text-base" aria-hidden="true" />
        </button>
      </header>

      {uploadError && (
        <div className="bg-rose-50 text-rose-700 border-b border-rose-100 text-xs px-4 py-2 flex items-center justify-between font-medium flex-shrink-0">
          <span>{uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            className="font-bold hover:opacity-70"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-gray-50/30">
        {loading && messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xs text-gray-400 animate-pulse font-medium">
              Loading messages...
            </p>
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <i
                className="ti ti-message-2 text-xl text-[#1c4d8d]"
                aria-hidden="true"
              />
            </div>
            <p className="text-xs text-gray-400 font-semibold">
              Say hello to {conversation.otherUserName}!
            </p>
          </div>
        )}
        {messages.map((m) => {
          const isMine =
            String(m.senderId ?? "").trim() !== "" &&
            String(m.senderId ?? "").trim() === normalizedUserId;
          return (
            <MessageBubble
              key={`${m.id}-${m.read}`}
              message={m}
              isMine={isMine}
              onEdit={handleEditMsg}
              onDelete={handleDeleteMsg}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      <MessageInput
        value={inputVal}
        onChange={setInputVal}
        onSend={handleSend}
        onFileUpload={handleFileUpload}
        editingMsg={editingMsg}
        onCancelEdit={cancelEdit}
        disabled={status !== "connected"}
        uploading={uploading}
      />
    </div>
  );
}
