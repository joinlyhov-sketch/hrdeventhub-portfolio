"use client";

import React from "react";
import { Input } from "../../ui/input";
import { Card } from "../../ui/card";

interface PollHeaderProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
}

export default function PollHeader({
  title,
  setTitle,
  description,
  setDescription,
}: PollHeaderProps) {
  return (
    <Card className="bg-background rounded-2xl border-l-[6px] border-l-blue-900 border-y-border border-r-border p-8 shadow-sm mb-6">
      <h1 className="relative mb-4 w-full text-3xl font-bold text-foreground">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Poll"
          className="w-full bg-transparent outline-none border-0 p-0 m-0 font-inherit text-inherit placeholder:text-muted-foreground/30 focus:ring-0 focus-visible:ring-0"
        />
      </h1>
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description for your poll participants..."
        className="w-full text-desc text-muted-foreground placeholder:text-muted-foreground/30 border-0 border-b border-border p-0 pb-2 shadow-none rounded-none bg-transparent transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary"
      />
    </Card>
  );
}