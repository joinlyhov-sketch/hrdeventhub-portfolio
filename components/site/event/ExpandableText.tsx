"use client";

import { useState, useRef, useEffect } from "react";

interface ExpandableTextProps {
  text: string;
}

export default function ExpandableText({ text }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [text]);

  return (
    <div className="mb-4">
      <p
        ref={ref}
        className={`type-desc text-muted-foreground leading-relaxed wrap-break-word ${
          !expanded ? "line-clamp-2" : "line-clamp-none"
        }`}
      >
        {text}
      </p>

      {(isClamped || expanded) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-primary text-sm font-medium hover:underline cursor-pointer"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}