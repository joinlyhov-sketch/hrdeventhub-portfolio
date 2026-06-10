import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../ui/button";
import PollOptionItem from "./PollOptionItem";

interface PollOptionsListProps {
  options: string[];
  onOptionChange: (index: number, text: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
}

export default function PollOptionsList({
  options,
  onOptionChange,
  onAddOption,
  onRemoveOption,
}: PollOptionsListProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4 w-full">
      <h3 className="text-sm font-bold text-slate-500 tracking-wide">
        Poll Options
      </h3>

      <div className="space-y-3">
        {options.map((option, index) => (
          <PollOptionItem
            key={index}
            option={option}
            index={index}
            isSelected={selectedIdx === index}
            canRemove={options.length > 1}
            onSelect={(idx) => setSelectedIdx(idx)}
            onOptionChange={onOptionChange}
            onRemoveOption={(idx) => {
              if (selectedIdx === idx) {
                setSelectedIdx(null);
              } else if (selectedIdx !== null && idx < selectedIdx) {
                setSelectedIdx(selectedIdx - 1);
              }
              onRemoveOption(idx);
            }}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onAddOption}
        className="w-full p-5 border-dashed border-gray-300 bg-white rounded-xl flex items-center justify-center gap-2 text-gray-500 text-sm font-semibold shadow-sm hover:bg-transparent hover:text-gray-600"
      >
        <Plus size={16} /> Add Option
      </Button>
    </div>
  );
}
