"use client";

import { useRef, useEffect } from "react";
import { ChatMessage } from "@/types/chat";

interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onFileUpload: (file: File) => Promise<void>;
  editingMsg: ChatMessage | null;
  onCancelEdit: () => void;
  disabled?: boolean;
  uploading?: boolean;
}

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif,application/pdf";

export default function MessageInput({
  value,
  onChange,
  onSend,
  onFileUpload,
  editingMsg,
  onCancelEdit,
  disabled,
  uploading,
}: MessageInputProps) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingMsg) textRef.current?.focus();
  }, [editingMsg]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await onFileUpload(file);
    e.target.value = "";
  }

  const isDisabled = disabled || uploading;

  return (
    <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
      {editingMsg && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mb-2 text-xs text-amber-800 font-semibold">
          <span className="flex items-center gap-1.5">Editing text...</span>
          <button onClick={onCancelEdit} className="text-amber-600 hover:text-amber-900 font-bold hover:cursor-pointer">✕ Cancel</button>
        </div>
      )}

      <div className="w-full flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED_TYPES}
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={isDisabled}
        />

        {!editingMsg && (
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shrink-0 disabled:opacity-50"
            onClick={() => fileRef.current?.click()}
            disabled={isDisabled}
          >
            {uploading ? (
              <span className="block animate-ping text-sm">...</span>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            )}
          </button>
        )}

        <textarea
          ref={textRef}
          rows={1}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            autoResize(e.target);
          }}
          onKeyDown={handleKey}
          placeholder={
            editingMsg
              ? "Edit your message..."
              : uploading
              ? "Uploading attachment..."
              : "Type a message... (Enter to send)"
          }
          className="flex-1 bg-transparent border-0 outline-none text-sm text-gray-800 resize-none max-h-24 py-1.5 px-2 focus:ring-0 focus:outline-none placeholder:text-gray-400 font-normal leading-relaxed"
          disabled={isDisabled}
        />

        <button
          type="button"
          onClick={onSend}
          disabled={isDisabled || !value.trim()}
          className="p-2 bg-[#1c4d8d]  text-white rounded-xl transition-all shrink-0 disabled:opacity-40 disabled:bg-[#235698] shadow-sm"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}