"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { ChatMessage } from "@/types/chat";
import { formatMessageTimestamp } from "@/libs/utils";

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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isImage = message.messageType === "IMAGE";
  const isFile = message.messageType === "FILE";
  const isText = !message.messageType || message.messageType === "TEXT";

  async function confirmDelete() {
    setDeleting(true);
    try {
      await onDelete(message.id);
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <div
      className={`flex flex-col mb-3 ${isMine ? "items-end" : "items-start"}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`flex items-center gap-2 max-w-[75%] group ${isMine ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`text-xs px-3.5 py-2.5 rounded-2xl shadow-sm ${
            message._pending ? "opacity-60" : ""
          } ${
            isMine
              ? "bg-[#1c4d8d] text-white rounded-tr-none"
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
                onClick={() => setPreviewOpen(true)}
              />
            </div>
          )}

          {isImage && (imgError || !message.fileUrl) && (
            <div className="flex items-center gap-2 text-red-500 font-medium">
              <span>Image transmission failure</span>
            </div>
          )}

          {isFile && message.fileUrl && (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 font-medium underline ${isMine ? "text-blue-50" : "text-[#1c4d8d]"}`}
            >
              <div className="flex flex-col text-left">
                <span className="truncate max-w-[150px] text-xs">
                  {message.fileName ?? "Download Document"}
                </span>
                {message.fileSize && (
                  <span className="text-[10px] opacity-75">
                    {formatFileSize(message.fileSize)}
                  </span>
                )}
              </div>
            </a>
          )}

          {isText && (
            <span className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </span>
          )}

          {message.isEdited && (
            <span className="text-[10px] ml-1 font-normal opacity-70">
              {" "}
              (edited)
            </span>
          )}
        </div>

        {isMine && hover && !message._pending && (
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
              onClick={() => setDeleteOpen(true)}
              className="text-[10px] text-red-500 hover:text-red-700 px-1.5 py-0.5 rounded transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div
        className={`text-[10px] text-gray-400 mt-1 flex items-center gap-1 ${isMine ? "mr-1" : "ml-1"}`}
      >
        {message._pending ? (
          <span className="flex items-center gap-1 text-gray-400 italic">
            <span className="w-2.5 h-2.5 rounded-full border-[1.5px] border-gray-300 border-t-gray-500 animate-spin shrink-0" />
            Sending...
          </span>
        ) : (
          <>
            <span>{formatMessageTimestamp(message.createdAt)}</span>
            {isMine && (
              <span
                className={
                  message.read
                    ? "text-[#1c4d8d] font-semibold"
                    : "text-gray-300"
                }
              >
                {message.read ? "✓✓" : "✓"}
              </span>
            )}
          </>
        )}
      </div>

      {isImage &&
        message.fileUrl &&
        previewOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setPreviewOpen(false)}
          >
            <div
              className="relative max-w-3xl max-h-[85vh] w-full mx-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
                className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <img
                src={message.fileUrl}
                alt={message.fileName ?? "attachment"}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>,
          document.body,
        )}

      {deleteOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
            onClick={(e) =>
              e.target === e.currentTarget && !deleting && setDeleteOpen(false)
            }
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
              <div className="px-5 pt-5 pb-4 flex flex-col items-center text-center gap-3">
                <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Delete message?
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    This message will be removed for everyone. This action
                    can&apos;t be undone.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleting}
                  className="flex-1 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 text-sm font-semibold text-white bg-red-500 rounded-xl py-2.5 hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
