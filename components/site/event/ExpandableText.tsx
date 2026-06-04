"use client";

import { useState } from "react";

interface ExpandableTextProps {
  text: string;
}

export default function ExpandableText({ text }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={`type-desc text-muted-foreground leading-relaxed wrap-break-word ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {text}
      </p>

      {text.length > 120 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-primary text-sm font-medium hover:underline"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
