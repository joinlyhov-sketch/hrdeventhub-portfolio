import React from "react";
import { Plus, X } from "lucide-react";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Question } from "../../../../data/Question";

interface ChoiceQuestionProps {
  question: Question;
  onSelect: (opt: string) => void;
  onUpdateOption: (idx: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (idx: number) => void;
}

export default function ChoiceQuestion({
  question,
  onSelect,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
}: ChoiceQuestionProps) {
  return (
    <div className="space-y-3">
      {question.options?.map((opt, optIdx) => {
        const isSelected = question.selectedChoice === opt;
        return (
          <div
            key={optIdx}
            className="flex items-center justify-between group/opt gap-2"
          >
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => onSelect(opt)}
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  isSelected
                    ? "border-primary bg-transparent scale-105"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                {isSelected && (
                  <div className="w-3 h-3 rounded-full bg-primary transition-transform duration-150" />
                )}
              </button>
              <Input
                type="text"
                value={opt}
                onChange={(e) => onUpdateOption(optIdx, e.target.value)}
                className="text-sm shadow-none h-auto py-1 border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-input bg-transparent pb-0.5 w-full"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveOption(optIdx)}
              className="text-muted-foreground hover:text-destructive h-8 w-8"
            >
              <X size={16} />
            </Button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={onAddOption}
        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground pt-1 transition-colors"
      >
        <Plus size={16} />
        Add Option
      </button>
    </div>
  );
}
