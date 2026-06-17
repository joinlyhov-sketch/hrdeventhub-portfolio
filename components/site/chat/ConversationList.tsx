"use client";

import { useState, useEffect, useRef } from "react";
import { Conversation, UserResult } from "@/types/chat";
import { searchUsersAction } from "@/actions/chat.action";
import { initials, cn, formatConvTime } from "@/libs/utils";
import ChatAvatar from "./ChatAvatar";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  myName: string;
  token: string;
  onSelect: (conv: Conversation) => void;
  onNewChat: (username: string) => void;
}

export default function ConversationList({
  conversations,
  activeId,
  myName,
  token,
  onSelect,
  onNewChat,
}: ConversationListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!query.trim()) { setResults([]); return; }
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

  const filteredConversations = conversations.filter((c) =>
    (c.otherUserName ?? "").toLowerCase().includes(filterText.trim().toLowerCase()),
  );

  if (!conversations) {
    return <div className="p-4 text-sm text-gray-400">Loading chats...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="px-4 pt-5 pb-4 flex-shrink-0 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900 mb-3.5">Messages</h1>
        <div className="relative mb-2.5">
          <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true" />
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
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
        >
          <i className="ti ti-plus text-base" aria-hidden="true" />
          New conversation
        </button>
      </div>

      {filteredConversations.length > 0 && (
        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Recent</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <i className="ti ti-message-2 text-xl text-[#1c4d8d]" aria-hidden="true" />
            </div>
            <p className="text-xs text-gray-400 font-medium">No conversations yet</p>
            <button type="button" onClick={() => setModalOpen(true)} className="text-xs text-[#1c4d8d] font-semibold hover:underline">
              Start one
            </button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-6 py-12 text-center">
            <i className="ti ti-user-off text-xl text-gray-300" aria-hidden="true" />
            <p className="text-xs text-gray-400 font-medium">No matches found</p>
          </div>
        ) : (
          filteredConversations.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => onSelect(c)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all outline-none mb-0.5",
                  isActive ? "bg-blue-50" : "hover:bg-gray-50",
                )}
              >
                <ChatAvatar name={c.otherUserName} avatarUrl={c.otherUserAvatar} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("text-sm truncate", isActive ? "font-bold text-gray-900" : "font-semibold text-gray-800")}>
                      {c.otherUserName ?? "Unknown"}
                    </span>
                    {c.lastMessageAt && (
                      <span className="text-[11px] text-gray-400 shrink-0">
                        {formatConvTime(c.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {c.lastMessage ?? "No messages yet"}
                  </p>
                </div>

                {c.unreadCount > 0 && (
                  <span className="bg-[#1c4d8d] text-white text-[10px] font-black w-[18px] h-[18px] flex items-center justify-center rounded-full shrink-0">
                    {c.unreadCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">New conversation</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 flex-1">
              <div className="relative mb-3">
                <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true" />
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
                    <span className="text-xs text-gray-400 animate-pulse">Searching...</span>
                  </div>
                )}
                {searchError && <p className="text-xs text-rose-500 text-center py-6">{searchError}</p>}
                {!searching && !searchError && query.trim() && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <i className="ti ti-user-off text-2xl text-gray-300" aria-hidden="true" />
                    <p className="text-xs text-gray-400">No users found</p>
                  </div>
                )}
                {!searching && !query.trim() && (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <i className="ti ti-users text-2xl text-gray-300" aria-hidden="true" />
                    <p className="text-xs text-gray-400">Type a name to find someone</p>
                  </div>
                )}
                {Array.isArray(results) && results.map((user) => (
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
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-400 truncate">@{user.username}</p>
                    </div>
                    <i className="ti ti-chevron-right text-sm text-[#1c4d8d] opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}