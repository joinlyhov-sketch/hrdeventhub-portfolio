"use client";

import { useRef, useEffect } from "react";

const EMOJI_LIST = [
  "😀","😂","😍","🥰","😎","🤔","😢","😡","👍","👎",
  "❤️","🔥","🎉","✨","💯","🙏","😭","🤣","😊","😅",
  "😆","🥲","😇","🤩","😏","😒","😳","🤯","😱","😴",
  "🤗","🫡","🫠","😬","🙄","😤","🤬","💀","👀","💪",
];

export function EmojiPopover({
  onPick,
  onClose,
}: {
  onPick: (e: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 right-0 z-50 bg-background border border-border rounded-2xl shadow-lg p-3 w-64"
    >
      <div className="grid grid-cols-8 gap-1">
        {EMOJI_LIST.map((e) => (
          <button
            key={e}
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={() => { onPick(e); onClose(); }}
            className="text-lg hover:scale-125 transition-transform cursor-pointer flex items-center justify-center h-7 w-7"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}