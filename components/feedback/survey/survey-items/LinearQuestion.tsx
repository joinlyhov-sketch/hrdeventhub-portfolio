import React from "react";
import { Input } from "../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Question } from "../../../../data/Question";

interface LinearQuestionProps {
  question: Question;
  onStateChange: (key: "linearStart" | "linearEnd", value: number) => void;
  onLabelChange: (key: "minLabel" | "maxLabel", value: string) => void;
}

export default function LinearQuestion({
  question,
  onStateChange,
  onLabelChange,
}: LinearQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Select
          value={String(question.linearStart ?? 1)}
          onValueChange={(val) => onStateChange("linearStart", Number(val))}
        >
          <SelectTrigger className="w-20 h-8 text-xs font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[0, 1, 2, 3, 4, 5].map((val) => (
              <SelectItem key={val} value={String(val)}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>to</span>
        <Select
          value={String(question.linearEnd ?? 5)}
          onValueChange={(val) => onStateChange("linearEnd", Number(val))}
        >
          <SelectTrigger className="w-20 h-8 text-xs font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((val) => (
              <SelectItem key={val} value={String(val)}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3 max-w-xs">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground w-4">
            {question.linearStart ?? 1}
          </span>
          <Input
            type="text"
            value={question.minLabel || ""}
            onChange={(e) => onLabelChange("minLabel", e.target.value)}
            placeholder="Not satisfied"
            className="text-sm h-auto py-1 shadow-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary bg-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground w-4">
            {question.linearEnd ?? 5}
          </span>
          <Input
            type="text"
            value={question.maxLabel || ""}
            onChange={(e) => onLabelChange("maxLabel", e.target.value)}
            placeholder="Very satisfied"
            className="text-sm h-auto py-1 shadow-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}