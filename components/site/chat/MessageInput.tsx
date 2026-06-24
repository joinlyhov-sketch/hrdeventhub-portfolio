"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ChatMessage } from "@/types/chat";

const EMOJI_LIST = [
  "😀","😂","😍","🥰","😎","🤔","😢","😡","👍","👎",
  "❤️","🔥","🎉","✨","💯","🙏","😭","🤣","😊","😅",
  "😆","🥲","😇","🤩","😏","😒","😳","🤯","😱","😴",
  "🤗","🫡","🫠","😬","🙄","😤","🤬","💀","👀","💪",
];

function EmojiPopover({
  onPick,
  onClose,
}: {
  onPick: (e: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 right-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 w-64"
      style={{ animation: "fadeInUp 0.15s ease" }}
    >
      <div className="grid grid-cols-8 gap-1">
        {EMOJI_LIST.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => onPick(e)}
            className="text-lg hover:scale-125 transition-transform cursor-pointer flex items-center justify-center h-7 w-7 select-none rounded-md hover:bg-gray-100"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

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
  const [showEmoji, setShowEmoji] = useState(false);

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

  const handlePickEmoji = useCallback(
    (emoji: string) => {
      const textarea = textRef.current;
      if (!textarea) {
        onChange(value + emoji);
        return;
      }

      const start = textarea.selectionStart ?? value.length;
      const end = textarea.selectionEnd ?? value.length;
      const next = value.slice(0, start) + emoji + value.slice(end);

      onChange(next);
      setShowEmoji(false);

      requestAnimationFrame(() => {
        textarea.focus();
        const pos = start + emoji.length;
        textarea.setSelectionRange(pos, pos);
        autoResize(textarea);
      });
    },
    [value, onChange]
  );

  const fileDisabled = disabled || uploading;

  return (
    <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
      {editingMsg && (
        <div className="flex items-center justify-between rounded-xl px-4 py-1 mb-3 text-xs text-[#1c4d8d] font-semibold">
          <span className="flex items-center gap-1.5">Edit message</span>
          <button
            onClick={onCancelEdit}
            className="text-[#1c4d8d] font-bold text-[16px] hover:cursor-pointer"
          >
            x
          </button>
        </div>
      )}

      <div className="w-full flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED_TYPES}
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={fileDisabled}
        />

        {!editingMsg && (
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-[#1c4d8d] hover:bg-blue-50 rounded-xl transition-all shrink-0 disabled:opacity-50 hover:cursor-pointer"
            onClick={() => fileRef.current?.click()}
            disabled={fileDisabled}
            title={disabled ? "Connecting… attachments need an active connection" : undefined}
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
              ? "Editing message..."
              : uploading
              ? "Uploading attachment..."
              : "Type a message… (Enter to send)"
          }
          className="flex-1 bg-transparent border-0 outline-none text-sm text-gray-800 resize-none max-h-24 py-1.5 px-2 focus:ring-0 focus:outline-none placeholder:text-gray-400 font-normal leading-relaxed"
        />

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowEmoji((v) => !v)}
            className={`p-2 rounded-xl transition-all hover:cursor-pointer ${
              showEmoji
                ? "text-[#1c4d8d] bg-blue-50"
                : "text-gray-400 hover:text-[#1c4d8d] hover:bg-blue-50"
            }`}
            title="Emoji"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M8 13.5s1.5 2 4 2 4-2 4-2" />
              <circle cx="9" cy="9.5" r="1" fill="currentColor" stroke="none" />
              <circle cx="15" cy="9.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </button>

          {showEmoji && (
            <EmojiPopover
              onPick={handlePickEmoji}
              onClose={() => setShowEmoji(false)}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim()}
          className="p-2 bg-[#1c4d8d] text-white rounded-xl transition-all shrink-0 disabled:opacity-40 disabled:bg-[#235698] shadow-sm hover:cursor-pointer"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}