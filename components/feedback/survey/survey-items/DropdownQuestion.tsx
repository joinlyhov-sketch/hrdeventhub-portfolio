"use client";

import React from "react";
import { X, Plus } from "lucide-react";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Question } from "../../../../data/Question";

interface DropdownQuestionProps {
  question: Question;
  onSelect: (value: string) => void;
  onUpdateOption: (idx: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (idx: number) => void;
}

export default function DropdownQuestion({
  question,
  onSelect,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
}: DropdownQuestionProps) {
  return (
    <div className="space-y-4">
      <Select value={question.selectedChoice || ""} onValueChange={onSelect}>
        <SelectTrigger className="w-full py-2 max-w-xs rounded-xl shadow-sm">
          <SelectValue placeholder="Select Dropdown Choice" />
        </SelectTrigger>
        <SelectContent
          side="bottom"
          position="popper"
          className="bg-white rounded-2xl shadow-xl border border-gray-100 px-2 py-2 z-50 text-left max-h-50 overflow-y-auto w-[var(--radix-select-trigger-width)] mt-1"
        >
          {question.options?.map((opt, idx) => {          
            const isBlank = opt.trim() === "";
            
            return (
              <SelectItem
                key={idx}                
                value={isBlank ? `empty-fallback-token-${idx}` : opt}
                className="px-3 py-3 text-sm rounded-md text-slate-800 hover:bg-grey-200 transition-colors cursor-pointer focus:bg-slate-100 focus:text-slate-800"
              >
                {isBlank ? (
                  <span className="text-muted-foreground italic">(Empty Option)</span>
                ) : (
                  opt
                )}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <div className="space-y-2 pt-2 border-t border-border/40">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
          Edit Choices
        </p>
        {question.options?.map((opt, optIdx) => (
          <div
            key={optIdx}
            className="flex items-center justify-between gap-2 max-w-md"
          >
            <Input
              type="text"
              value={opt}
              onChange={(e) => onUpdateOption(optIdx, e.target.value)}
              className="text-sm shadow-none h-auto py-0.5 border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-input bg-transparent"
              placeholder={`Option ${optIdx + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveOption(optIdx)}
              className="text-muted-foreground hover:text-destructive h-7 w-7"
            >
              <X size={16} />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="link"
          onClick={onAddOption}
          className="h-auto p-0 flex items-center gap-1 text-xs font-bold text-primary"
        >
          <Plus size={14} /> Add Dropdown Field
        </Button>
      </div>
    </div>
  );
}