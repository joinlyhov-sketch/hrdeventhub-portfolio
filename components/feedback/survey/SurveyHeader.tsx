"use client";

import React from "react";
import { Input } from "../../ui/input";
import { Card } from "../../ui/card";
import { Label } from "../../ui/label";

interface SurveyHeaderProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  closingTime?: string;
  setClosingTime?: (val: string) => void;
  isActive?: boolean;
  setIsActive?: (val: boolean) => void;
}

export default function SurveyHeader({
  title,
  setTitle,
  description,
  setDescription,
  closingTime,
  setClosingTime,
  isActive,
  setIsActive,
}: SurveyHeaderProps) {
  return (
    <Card className="bg-background rounded-2xl border-l-[6px] border-l-blue-900 border-y-border border-r-border p-8 shadow-sm mb-6">
      <h1 className="relative mb-4 w-full text-3xl font-bold text-foreground">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Survey"
          className="w-full bg-transparent outline-none border-0 p-0 m-0 font-inherit text-inherit placeholder:text-muted-foreground/30 focus:ring-0 focus-visible:ring-0"
        />
      </h1>
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description for your survey participants..."
        className="w-full text-desc text-muted-foreground placeholder:text-muted-foreground/30 border-0 border-b border-border p-0 pb-2 shadow-none rounded-none bg-transparent transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {closingTime !== undefined && setClosingTime && (
          <div>
            <Label htmlFor="closing-time" className="block mb-2 text-sm font-medium">
              Survey Closing Time
            </Label>
            <Input
              id="closing-time"
              type="datetime-local"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              className="w-full"
              required
            />
          </div>
        )}

        {isActive !== undefined && setIsActive && (
          <div>
            <Label className="block mb-2 text-sm font-medium">
              Survey Status
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                id="survey-active"
              />
              <label htmlFor="survey-active" className="cursor-pointer text-sm">
                {isActive ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}