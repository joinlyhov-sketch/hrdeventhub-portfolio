"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/reaction/popover";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/reaction/toggle-group";

export function TwemojiImg({
  emoji,
  size = 18,
}: {
  emoji: string;
  size?: number;
}) {
  const codePoint = [...emoji]
    .map((c) => c.codePointAt(0)!.toString(16))
    .filter((c) => c !== "fe0f")
    .join("-");

  return (
    <Image
      src={`https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets/${codePoint}/color/${codePoint}_color.svg`}
      alt={emoji}
      width={size}
      height={size}
      unoptimized
      draggable={false}
      className="select-none inline-block"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codePoint}.svg`;
      }}
    />
  );
}

export const REACTIONS = [
  {
    id: "like",
    label: "Like",
    emoji: "😊",
    displayText: "Like",
    color: "text-blue-500 hover:text-blue-600",
  },
  {
    id: "please",
    label: "Please",
    emoji: "😚",
    displayText: "Please",
    color: "text-purple-500 hover:text-purple-600",
  },
  {
    id: "too_hard",
    label: "Too Hard",
    emoji: "😭",
    displayText: "Too Hard",
    color: "text-red-500 hover:text-red-600",
  },
  {
    id: "great",
    label: "Great",
    emoji: "🤩",
    displayText: "Great",
    color: "text-emerald-500 hover:text-emerald-600",
  },
  {
    id: "thank_you",
    label: "Thank You",
    emoji: "😍",
    displayText: "Thank You",
    color: "text-pink-500 hover:text-pink-600",
  },
];

export const COMMENT_REACTIONS = [
  {
    id: "like",
    label: "Like",
    emoji: "😊",
    displayText: "Like",
    color: "text-blue-500 hover:text-blue-600",
  },
  {
    id: "please",
    label: "Please",
    emoji: "😚",
    displayText: "Please",
    color: "text-purple-500 hover:text-purple-600",
  },
  {
    id: "too_hard",
    label: "Too Hard",
    emoji: "😭",
    displayText: "Too Hard",
    color: "text-red-500 hover:text-red-600",
  },
  {
    id: "great",
    label: "Great",
    emoji: "🤩",
    displayText: "Great",
    color: "text-emerald-500 hover:text-emerald-600",
  },
  {
    id: "thank_you",
    label: "Thank You",
    emoji: "😍",
    displayText: "Thank You",
    color: "text-pink-500 hover:text-pink-600",
  },
];

interface ReactionPopoverProps {
  children: React.ReactNode;
  onReactionSelect: (id: string) => void;
  selectedValue: string | null;
  reactions?: typeof REACTIONS;
}

export function ReactionPopover({
  children,
  onReactionSelect,
  selectedValue,
  reactions = REACTIONS,
}: ReactionPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div>{children}</div>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align="start"
          sideOffset={8}
          className="w-auto rounded-2xl p-2 shadow-lg border bg-background/95 backdrop-blur z-50 transition-none"
          onMouseEnter={handleMouseEnter}
        >
          <ToggleGroup
            type="single"
            value={selectedValue || ""}
            onValueChange={(val) => {
              if (val) onReactionSelect(val);
              setIsOpen(false);
            }}
            className="flex gap-1"
          >
            <AnimatePresence>
              {reactions.map((item) => (
                <ToggleGroupItem
                  key={item.id}
                  value={item.id}
                  aria-label={item.label}
                  asChild
                  className="h-11 w-11 rounded-xl bg-transparent border-none data-[state=on]:bg-primary/10 cursor-pointer flex items-center justify-center"
                >
                  <motion.button
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                    whileHover={{ y: -5, scale: 1.35 }}
                    title={item.label}
                    className="outline-none flex items-center justify-center"
                  >
                    <TwemojiImg emoji={item.emoji} size={28} />
                  </motion.button>
                </ToggleGroupItem>
              ))}
            </AnimatePresence>
          </ToggleGroup>
        </PopoverContent>
      </Popover>
    </div>
  );
}
