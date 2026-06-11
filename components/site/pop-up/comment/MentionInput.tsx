"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Smile, SendHorizontal } from "lucide-react";
import { WorkspaceMember } from "@/hooks/use-workspace-members";
import { EmojiPopover } from "./EmojiPopover";

interface MentionInputProps {
  value: string;
  onChange: (value: string, mentionedIds: string[]) => void;
  onSubmit: () => void;
  onClose?: () => void;
  onBlurClose?: boolean;
  placeholder?: string;
  members: WorkspaceMember[];
  mentionedIds: string[];
  autoFocus?: boolean;
}

export function MentionInput({
  value,
  onChange,
  onSubmit,
  onClose,
  onBlurClose = false,
  placeholder,
  members,
  mentionedIds,
  autoFocus = false,
}: MentionInputProps) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [dropdownIndex, setDropdownIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredMembers =
    mentionQuery !== null
      ? members.filter((m) =>
          `${m.firstName} ${m.lastName}`
            .toLowerCase()
            .includes(mentionQuery.toLowerCase()),
        )
      : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cursor = e.target.selectionStart ?? val.length;
    const textUpToCursor = val.slice(0, cursor);
    const match = textUpToCursor.match(/@(\w*)$/);
    if (match) {
      setMentionQuery(match[1]);
      setDropdownIndex(0);
    } else {
      setMentionQuery(null);
    }
    onChange(val, mentionedIds);
  };

  const pickMember = useCallback(
    (member: WorkspaceMember) => {
      const cursor = inputRef.current?.selectionStart ?? value.length;
      const before = value.slice(0, cursor);
      const after = value.slice(cursor);
      const replaced = before.replace(/@\w*$/, `@${member.firstName}${member.lastName} `);
      const newIds = mentionedIds.includes(member.appUserId)
        ? mentionedIds
        : [...mentionedIds, member.appUserId];
      onChange(replaced + after, newIds);
      setMentionQuery(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [value, mentionedIds, onChange],
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !value.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, value, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mentionQuery !== null && filteredMembers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setDropdownIndex((i) => (i + 1) % filteredMembers.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setDropdownIndex((i) => (i - 1 + filteredMembers.length) % filteredMembers.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        pickMember(filteredMembers[dropdownIndex]);
        return;
      }
      if (e.key === "Escape") {
        setMentionQuery(null);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey && mentionQuery === null) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape" && onClose) onClose();
  };

  const handleBlur = useCallback(() => {
    if (!onBlurClose || !onClose) return;
    setTimeout(() => {
      if (
        containerRef.current &&
        !containerRef.current.contains(document.activeElement) &&
        !isSubmitting
      ) {
        if (!showEmoji && mentionQuery === null) onClose();
      }
    }, 200);
  }, [onBlurClose, onClose, showEmoji, mentionQuery, isSubmitting]);

  return (
    <div ref={containerRef} className="relative w-full" onBlur={handleBlur}>
      {mentionQuery !== null && filteredMembers.length > 0 && (
        <div className="absolute bottom-full mb-2 left-0 z-50 w-72 bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="max-h-56 overflow-y-auto">
            {filteredMembers.map((member, idx) => {
              const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
              return (
                <button
                  key={member.appUserId}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pickMember(member)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left cursor-pointer ${
                    idx === dropdownIndex ? "bg-primary/10" : "hover:bg-grey-50"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#EBF5FB] overflow-hidden shrink-0 flex items-center justify-center border">
                    {member.profileImage ? (
                      <Image
                        src={member.profileImage}
                        alt={`${member.firstName} ${member.lastName}`}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-primary uppercase">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-grey-900 truncate">
                      {member.firstName} {member.lastName}
                    </p>
                    {member.role && (
                      <p className="text-xs text-grey-400 truncate">{member.role}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="px-3 py-1.5 border-t border-border bg-grey-50">
            <p className="text-xs text-grey-400">
              Showing {filteredMembers.length} result{filteredMembers.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center bg-grey-100 rounded-full py-1.5 pl-4 pr-2 gap-2 w-full h-11">
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          type="text"
          placeholder={placeholder ?? "Write a comment…"}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-sm text-grey-900 placeholder:text-grey-400 min-w-0"
        />
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="relative">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowEmoji((v) => !v)}
              className="text-grey-400 hover:text-grey-600 transition-colors cursor-pointer flex items-center"
            >
              <Smile size={18} />
            </button>
            {showEmoji && (
              <EmojiPopover
                onPick={(emoji) => onChange(value + emoji, mentionedIds)}
                onClose={() => setShowEmoji(false)}
              />
            )}
          </div>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSubmit}
            disabled={!value.trim() || isSubmitting}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-opacity"
          >
            <SendHorizontal size={15} className="relative left-[-0.5px]" />
          </button>
        </div>
      </div>
    </div>
  );
}