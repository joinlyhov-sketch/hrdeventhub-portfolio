import React from "react";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Question } from "../../../../data/Question";

interface RatingQuestionProps {
  question: Question;
  onScaleChange: (scale: number) => void;
  onRatingChange: (rating: number) => void;
}

export default function RatingQuestion({
  question,
  onScaleChange,
  onRatingChange,
}: RatingQuestionProps) {
  const maxScale = question.maxScale || 5;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Select
          value={String(maxScale)}
          onValueChange={(val) => onScaleChange(Number(val))}
        >
          <SelectTrigger className="w-14 h-10 text-xs font-bold text-gray-800">
            <SelectValue placeholder="Stars Layout" />
          </SelectTrigger>
          <SelectContent
            side="bottom"
            position="popper"
            className="bg-white rounded-2xl border border-gray-100 px-2 py-2 z-50 text-left max-h-35 overflow-y-auto min-w-[50px] w-[50px] mt-1"
          >
            {[3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <SelectItem
                key={val}
                value={String(val)}
                className="px-2 py-1 text-sm font-semibold rounded-sm text-center text-slate-800 transition-colors cursor-pointer focus:bg-slate-100 focus:text-slate-800"
              >
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-10 justify-center pt-2 overflow-x-auto pb-1">
        {Array.from({ length: maxScale }).map((_, i) => {
          const starRating = i + 1;
          const isSelected = starRating <= (question.ratingValue || 0);
          return (
            <button
              key={i}
              type="button"
              onClick={() => onRatingChange(starRating)}
              className="flex flex-col items-center gap-2 outline-none group"
            >
              <span
                className={`text-xs font-bold transition-colors ${isSelected ? "text-secondary" : "text-muted-foreground"}`}
              >
                {starRating}
              </span>
              <Star
                size={24}
                className={`transition-all duration-150 ${
                  isSelected
                    ? "text-action fill-action scale-110"
                    : "text-action border-muted stroke-[1.5] group-hover:text-action"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
