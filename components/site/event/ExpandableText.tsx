"use client";

import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export default function ExpandableText({ text, maxLength = 150, className = "" }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  if (text.length <= maxLength) {
    return <span className={`break-words break-all ${className}`}>{text}</span>;
  }

  return (
    <span className={`break-words break-all ${className}`}>
      {expanded ? text : `${text.slice(0, maxLength)}....`}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="text-subtle hover:underline ml-1 font-medium text-xs whitespace-nowrap inline-flex items-center"
      >
        {expanded ? "(See less)" : "(See more)"}
      </button>
    </span>
  );
}