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
          <SelectTrigger className="w-32 h-9 text-xs font-bold text-muted-foreground">
            <SelectValue placeholder="Stars Layout" />
          </SelectTrigger>
          <SelectContent>
            {[3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <SelectItem key={val} value={String(val)}>
                {val} Stars
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
              <span className={`text-xs font-bold transition-colors ${isSelected ? "text-secondary" : "text-muted-foreground"}`}>
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