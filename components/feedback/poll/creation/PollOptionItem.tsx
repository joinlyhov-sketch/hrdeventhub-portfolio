import React from "react";
import { Delete, X } from "lucide-react";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";

interface PollOptionItemProps {
  option: string;
  index: number;
  isSelected: boolean;
  canRemove: boolean;
  onSelect: (index: number) => void;
  onOptionChange: (index: number, value: string) => void;
  onRemoveOption: (index: number) => void;
}

export default function PollOptionItem({
  option,
  index,
  isSelected,
  canRemove,
  onSelect,
  onOptionChange,
  onRemoveOption,
}: PollOptionItemProps) {
  return (
    <div
      onClick={() => onSelect(index)}
      className={`flex items-center gap-3 bg-white border rounded-2xl px-5 py-3.5 shadow-sm transition group cursor-pointer ${
        isSelected
          ? "border-primary ring-1 ring-primary/10"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(index);
        }}
        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
          isSelected
            ? "border-primary bg-primary ring-2 ring-white ring-inset"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
      />

      <Input
        type="text"
        value={option}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onOptionChange(index, e.target.value)}
        className="w-full bg-transparent border-0 shadow-none p-1 h-auto font-medium text-slate-700 placeholder-slate-400 focus-visible:ring-0 focus-visible:border-0 cursor-text"
        required
      />

      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveOption(index);
          }}
          className="text-red-400 text-2xl h-8 w-8 rounded-lg shrink-0 md:opacity-100 group-hover:opacity-100 hover:bg-transparent hover:text-red-500"
        >
          <Delete size={20} />
        </Button>
      )}
    </div>
  );
}
