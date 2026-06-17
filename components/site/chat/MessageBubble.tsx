"use client";

import { useState } from "react";
import { ChatMessage } from "@/types/chat";
import { formatTime } from "@/libs/utils";

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  onEdit: (msg: ChatMessage) => void;
  onDelete: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MessageBubble({
  message,
  isMine,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isImage = message.messageType === "IMAGE";
  const isFile = message.messageType === "FILE";
  const isText = !message.messageType || message.messageType === "TEXT";

  return (
    <div
      className={`flex flex-col mb-3 ${isMine ? "items-end" : "items-start"}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={`flex items-center gap-2 max-w-[75%] group ${isMine ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={`text-xs px-3.5 py-2.5 rounded-2xl shadow-sm ${
            isMine
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-white text-gray-800 border border-gray-200/80 rounded-tl-none"
          }`}
        >
          {isImage && message.fileUrl && !imgError && (
            <div className="rounded-lg overflow-hidden cursor-pointer max-w-xs bg-gray-100">
              <img
                src={message.fileUrl}
                alt={message.fileName ?? "attachment"}
                className="max-h-48 object-cover hover:opacity-95 transition-opacity"
                onError={() => setImgError(true)}
                onClick={() => window.open(message.fileUrl, "_blank")}
              />
            </div>
          )}

          {isImage && (imgError || !message.fileUrl) && (
            <div className="flex items-center gap-2 text-red-500 font-medium">
              <span>⚠️ Image transmission failure</span>
            </div>
          )}

          {isFile && message.fileUrl && (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 font-medium underline ${isMine ? "text-blue-50" : "text-blue-600"}`}
            >
              <span className="text-base">📄</span>
              <div className="flex flex-col text-left">
                <span className="truncate max-w-[150px] text-xs">{message.fileName ?? "Download Document"}</span>
                {message.fileSize && (
                  <span className="text-[10px] opacity-75">{formatFileSize(message.fileSize)}</span>
                )}
              </div>
            </a>
          )}

          {isText && <span className="whitespace-pre-wrap leading-relaxed">{message.content}</span>}

          {message.isEdited && (
            <span className="text-[10px] ml-1 font-normal opacity-70"> (edited)</span>
          )}
        </div>

        {isMine && hover && (
          <div className="flex gap-1 items-center bg-white shadow-sm border border-gray-100 rounded-md p-0.5 h-7">
            {isText && (
              <button 
                onClick={() => onEdit(message)}
                className="text-[10px] text-gray-500 hover:text-gray-800 px-1.5 py-0.5 rounded transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => onDelete(message.id)}
              className="text-[10px] text-red-500 hover:text-red-700 px-1.5 py-0.5 rounded transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className={`text-[10px] text-gray-400 mt-1 flex items-center gap-1 ${isMine ? "mr-1" : "ml-1"}`}>
        <span>{formatTime(message.createdAt)}</span>
        {isMine && (
          <span className={message.read ? "text-blue-500 font-semibold" : "text-gray-300"}>
            {message.read ? "✓✓" : "✓"}
          </span>
        )}
      </div>
    </div>
  );
}