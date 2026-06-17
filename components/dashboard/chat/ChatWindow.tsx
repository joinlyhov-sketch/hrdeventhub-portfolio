"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Conversation, ChatMessage } from "@/types/chat";
import { useMessages } from "@/hooks/useMessages";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useChatStore } from "@/store/useChatStore";
import { initials } from "@/libs/utils";
import { API_BASE } from "@/libs/constants";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
  conversation: Conversation;
  token: string;
  userId: string;
  userName: string;
  onConversationUpdate: () => void;
  onBack: () => void;
}

export default function ChatWindow({
  conversation,
  token,
  userId,
  onConversationUpdate,
  onBack,
}: Readonly<ChatWindowProps>) {
  const normalizedUserId = String(userId ?? "").trim();
  const [inputVal, setInputVal] = useState("");
  const [editingMsg, setEditingMsg] = useState<ChatMessage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const readSentRef = useRef(false);

  const messages = useChatStore((s) => s.messages[conversation.id] ?? []);

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
        onConversationUpdate();
        return;
      }
      addMessage(msg);
      onConversationUpdate();
      readSentRef.current = false;
    },
    [addMessage, conversation.id, onConversationUpdate],
  );

  const handleEdit = useCallback((e: any) => updateMessage(e.message), [updateMessage]);

  const handleDelete = useCallback(
    (e: any) => removeMessage(e.messageId, e.conversationId),
    [removeMessage],
  );

  const handleRead = useCallback(
    (e: any) => {
      if (String(e.readBy) === normalizedUserId) return;
      updateRead(e.conversationId, e.readBy);
      onConversationUpdate();
    },
    [normalizedUserId, updateRead, onConversationUpdate],
  );

  const { status, subscribe, sendMessage, sendRead } = useWebSocket({
    token,
    onMessage: handleIncomingMessage,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onRead: handleRead,
  });

  useEffect(() => {
    subscribe(conversation.id);
    loadMessages(conversation.id);
    setEditingMsg(null);
    setInputVal("");
    setUploadError(null);
    readSentRef.current = false;
  }, [conversation.id]);

  useEffect(() => {
    if (status === "connected") {
      subscribe(conversation.id);
    }
  }, [status, conversation.id]);

  useEffect(() => {
    if (readSentRef.current) return;
    const hasUnread = messages.some(
      (m) => String(m.senderId).trim() !== normalizedUserId && !m.read,
    );
    if (status === "connected" && hasUnread) {
      sendRead(conversation.id);
      updateRead(conversation.id, normalizedUserId);
      onConversationUpdate();
      readSentRef.current = true;
    }
  }, [messages, status, conversation.id, normalizedUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/chat/conversations/${conversation.id}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? `Upload failed (${res.status})`);
      }
      onConversationUpdate();
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
      <header className="h-[73px] border-b border-gray-200 px-4 flex items-center gap-3 bg-white flex-shrink-0 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="md:hidden p-1.5 -ml-1 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          type="button"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
          {initials(conversation.otherUserName)}
        </div>
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-gray-900 leading-tight">
            {conversation.otherUserName}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-2 h-2 rounded-full ${
                status === "connected" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">
              {status}
            </span>
          </div>
        </div>
      </header>

      {uploadError && (
        <div className="bg-rose-50 text-rose-800 border-b border-rose-100 text-xs px-4 py-2 flex items-center justify-between font-medium flex-shrink-0">
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="font-bold hover:opacity-80">
            ✕
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/40">
        {loading && messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xs text-gray-400 animate-pulse font-medium">Loading messages...</p>
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xs text-gray-400 font-semibold">
              No messages yet. Say hello!
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