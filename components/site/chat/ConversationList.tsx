"use client";

import { useState, useEffect, useRef } from "react";
import { Conversation, UserResult } from "@/types/chat";
import {
  searchUsersAction,
  deleteConversationAction,
} from "@/actions/chat.action";
import { initials, cn, formatConvTime } from "@/libs/utils";
import { createPortal } from "react-dom";
import ChatAvatar from "./ChatAvatar";
import { usePresence } from "@/hooks/use-presence";
import { SquarePen } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  myName: string;
  token: string;
  onSelect: (conv: Conversation) => void;
  onNewChat: (username: string) => void;
  onDelete: (conversationId: string) => void;
}

interface ConversationRowProps {
  conv: Conversation;
  isActive: boolean;
  token: string;
  onSelect: (conv: Conversation) => void;
  onDelete: (conversationId: string) => void;
}

function ConversationRow({
  conv,
  isActive,
  token,
  onSelect,
  onDelete,
}: ConversationRowProps) {
  const presence = usePresence(conv.otherUserId, token);
  const isOnline = presence?.status === "ONLINE";

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const dotsBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rowRef = useRef<HTMLDivElement>(null);
  const [pressing, setPressing] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFiredRef = useRef(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const LONG_PRESS_MS = 500;
  const MOVE_CANCEL_THRESHOLD_PX = 10;

  function openMenuAtRow() {
    const rect = rowRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen(true);
  }

  function clearLongPressTimer() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (menuOpen || confirmOpen) return;
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    longPressFiredRef.current = false;
    setPressing(true);
    longPressTimerRef.current = setTimeout(() => {
      longPressFiredRef.current = true;
      setPressing(false);
      if (typeof window !== "undefined" && "vibrate" in window.navigator) {
        window.navigator.vibrate(10);
      }
      openMenuAtRow();
    }, LONG_PRESS_MS);
  }

  function handleTouchMove(e: React.TouchEvent) {
    const start = touchStartPosRef.current;
    if (!start) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - start.x);
    const dy = Math.abs(touch.clientY - start.y);
    if (dx > MOVE_CANCEL_THRESHOLD_PX || dy > MOVE_CANCEL_THRESHOLD_PX) {
      clearLongPressTimer();
      setPressing(false);
    }
  }

  function handleTouchEnd() {
    clearLongPressTimer();
    setPressing(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        dotsBtnRef.current &&
        !dotsBtnRef.current.contains(e.target as Node) &&
        rowRef.current &&
        !rowRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [menuOpen]);

  function openMenu(e: React.MouseEvent) {
    e.stopPropagation();
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    const rect = dotsBtnRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen(true);
  }

  async function handleDelete(e?: React.MouseEvent) {
    e?.stopPropagation();
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteConversationAction(conv.id, token);
      setConfirmOpen(false);
      setMenuOpen(false);
      onDelete(conv.id);
    } catch (err: any) {
      setDeleteError(
        err?.message ?? "Failed to delete conversation. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      ref={rowRef}
      className={cn(
        "group flex items-center gap-3 px-3 py-3 rounded-xl mb-0.5 transition-all cursor-pointer select-none",
        isActive ? "bg-[#1C4D8D]/10" : "hover:bg-gray-50",
        pressing && "bg-gray-100 scale-[0.98]",
      )}
      onClick={(e) => {
        if (menuOpen || confirmOpen) {
          e.stopPropagation();
          return;
        }
        if (longPressFiredRef.current) {
          longPressFiredRef.current = false;
          e.stopPropagation();
          return;
        }
        onSelect(conv);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (menuOpen || confirmOpen) return;
        if (e.key === "Enter") onSelect(conv);
      }}
    >
      <div className="relative shrink-0">
        <ChatAvatar
          name={conv.otherUserName}
          avatarUrl={conv.otherUserAvatar}
          size="md"
        />
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
            isOnline ? "bg-emerald-500" : "bg-gray-300",
          )}
          aria-label={isOnline ? "Online" : "Offline"}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <p
            className={cn(
              "text-sm truncate min-w-0",
              isActive
                ? "font-bold text-gray-900"
                : "font-semibold text-gray-800",
            )}
          >
            {conv.otherUserName ?? "Unknown"}
          </p>
          {conv.lastMessageAt && (
            <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0 ml-auto">
              {formatConvTime(conv.lastMessageAt)}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {conv.lastMessage ?? "No messages yet"}
        </p>
      </div>

      <div className="shrink-0 flex items-center gap-2 self-stretch">
        {conv.unreadCount > 0 ? (
          <span className="bg-[#1c4d8d] text-white text-[10px] font-black w-[18px] h-[18px] flex items-center justify-center rounded-full">
            {conv.unreadCount}
          </span>
        ) : null}

        <button
          ref={dotsBtnRef}
          type="button"
          onClick={openMenu}
          aria-label="Conversation options"
          className={cn(
            "w-6 h-6 flex items-center justify-center rounded-md text-gray-400 transition-colors duration-150 hover:cursor-pointer",
            "hover:bg-gray-200 hover:text-gray-600",
            menuOpen && "bg-gray-100 text-gray-600",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
          </svg>
        </button>
      </div>

      {menuOpen &&
        menuPos &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: menuPos.top,
              right: menuPos.right,
              zIndex: 9999,
            }}
            className="w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-1 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                setDeleteError(null);
                setConfirmOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-rose-500 hover:cursor-pointer transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Delete conversation
            </button>
          </div>,
          document.body,
        )}

      {confirmOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
            onClick={(e) => {
              e.stopPropagation();
              if (e.target === e.currentTarget && !deleting)
                setConfirmOpen(false);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 pt-5 pb-4 flex flex-col items-center text-center gap-3">
                <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-red-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Delete conversation?
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    This will permanently delete the entire conversation with{" "}
                    {conv.otherUserName}. This action can&apos;t be undone.
                  </p>
                </div>
                {deleteError && (
                  <p className="text-xs text-red-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 w-full text-left">
                    {deleteError}
                  </p>
                )}
              </div>

              <div className="px-5 pb-5 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmOpen(false);
                  }}
                  disabled={deleting}
                  className="flex-1 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 text-sm font-semibold text-white bg-red-500 rounded-xl py-2.5 hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {deleting ? (
                    <>
                      <svg
                        className="w-3 h-3 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default function ConversationList({
  conversations,
  activeId,
  myName,
  token,
  onSelect,
  onNewChat,
  onDelete,
}: ConversationListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [locallyDeletedIds, setLocallyDeletedIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    setLocallyDeletedIds((prev) => {
      if (prev.size === 0) return prev;
      const stillPresent = new Set(
        [...prev].filter((id) =>
          conversations.some((c) => String(c.id) === id),
        ),
      );
      return stillPresent.size === prev.size ? prev : stillPresent;
    });
  }, [conversations]);

  function handleRowDeleted(conversationId: string) {
    setLocallyDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(String(conversationId));
      return next;
    });
    onDelete(conversationId);
  }

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSearchError(null);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const users = await searchUsersAction(query, token);
        setResults(Array.isArray(users) ? users : []);
      } catch (err) {
        setSearchError("Could not search users. Try again.");
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, [query, token]);

  function handleSelectUser(user: UserResult) {
    onNewChat(user.username);
    setModalOpen(false);
  }

  const filteredConversations = conversations
    .filter((c) => !locallyDeletedIds.has(String(c.id)))
    .filter((c) =>
      (c.otherUserName ?? "")
        .toLowerCase()
        .includes(filterText.trim().toLowerCase()),
    )
    .sort((a, b) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return timeB - timeA;
    });

  if (!conversations) {
    return <div className="p-4 text-sm text-gray-400">Loading chats...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="px-4 pt-5 pb-4 flex-shrink-0 border-b border-gray-100">
        <h1 className="text-title font-bold text-[#1c4d8d] mb-3.5">Messages</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <i
              className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              aria-hidden="true"
            />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search conversations..."
              className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500/60 focus:bg-white transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-label="New conversation"
            className="shrink-0 w-10 h-10 flex items-center justify-center border border-gray-200  rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#1c4d8d] transition-colors hover:cursor-pointer"
          >
           <SquarePen/>
          </button>
        </div>
      </div>

      {filteredConversations.length > 0 && (
        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Recent
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <i
                className="ti ti-message-2 text-xl text-[#1c4d8d]"
                aria-hidden="true"
              />
            </div>
            <p className="text-xs text-gray-400 font-medium">
              No conversations yet
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-xs text-[#1c4d8d] font-semibold hover:underline"
            >
              Start one
            </button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-6 py-12 text-center">
            <i
              className="ti ti-user-off text-xl text-gray-300"
              aria-hidden="true"
            />
            <p className="text-xs text-gray-400 font-medium">
              No matches found
            </p>
          </div>
        ) : (
          filteredConversations.map((c) => (
            <ConversationRow
              key={c.id}
              conv={c}
              isActive={c.id === activeId}
              token={token}
              onSelect={onSelect}
              onDelete={handleRowDeleted}
            />
          ))
        )}
      </div>

      {modalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">
                  New conversation
                </h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4 flex-1">
                <div className="relative mb-3">
                  <i
                    className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                    aria-hidden="true"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or username..."
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#4663ac] focus:bg-white transition-all"
                  />
                </div>

                <div className="min-h-[180px] max-h-[260px] overflow-y-auto">
                  {searching && (
                    <div className="flex items-center justify-center py-10">
                      <span className="text-xs text-gray-400 animate-pulse">
                        Searching...
                      </span>
                    </div>
                  )}
                  {searchError && (
                    <p className="text-xs text-rose-500 text-center py-6">
                      {searchError}
                    </p>
                  )}
                  {!searching &&
                    !searchError &&
                    query.trim() &&
                    results.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <i
                          className="ti ti-user-off text-2xl text-gray-300"
                          aria-hidden="true"
                        />
                        <p className="text-xs text-gray-400">No users found</p>
                      </div>
                    )}
                  {!searching && !query.trim() && (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <i
                        className="ti ti-users text-2xl text-gray-300"
                        aria-hidden="true"
                      />
                      <p className="text-xs text-gray-400">
                        Type a name to find someone
                      </p>
                    </div>
                  )}
                  {Array.isArray(results) &&
                    results.map((user) => (
                      <button
                        type="button"
                        key={user.appUserId}
                        onClick={() => handleSelectUser(user)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-left group"
                      >
                        <ChatAvatar
                          name={`${user.firstName} ${user.lastName}`}
                          avatarUrl={user.profilePicture}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            @{user.username}
                          </p>
                        </div>
                        <i
                          className="ti ti-chevron-right text-sm text-[#1c4d8d] opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
