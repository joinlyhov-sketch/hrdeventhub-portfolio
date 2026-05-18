"use client";

import React from "react";
import { Trash2, X, Star, ChevronDown, Plus, Delete } from "lucide-react";

export interface Question {
  id: string;
  type: "rating" | "linear" | "choice";
  text: string;
  options?: string[];
  maxScale?: number;
  minLabel?: string;
  maxLabel?: string;
  ratingValue?: number;
}

interface SurveyQuestionsListProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

export default function SurveyQuestionsList({
  questions,
  setQuestions,
}: SurveyQuestionsListProps) {
  const updateQuestionText = (id: string, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  const updateRatingValue = (id: string, value: number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ratingValue: value } : q)),
    );
  };

  const updateLinearLabels = (
    id: string,
    key: "minLabel" | "maxLabel",
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [key]: value } : q)),
    );
  };

  const updateChoiceOption = (qId: string, optIdx: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId && q.options) {
          const updatedOptions = [...q.options];
          updatedOptions[optIdx] = value;
          return { ...q, options: updatedOptions };
        }
        return q;
      }),
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addChoiceOption = (qId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId && q.options) {
          return {
            ...q,
            options: [...q.options, `Option ${q.options.length + 1}`],
          };
        }
        return q;
      }),
    );
  };

  const removeChoiceOption = (qId: string, optIdx: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId && q.options && q.options.length > 1) {
          return {
            ...q,
            options: q.options.filter((_, idx) => idx !== optIdx),
          };
        }
        return q;
      }),
    );
  };

  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <div
          key={q.id}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative group"
        >
          <input
            type="text"
            value={q.text}
            onChange={(e) => updateQuestionText(q.id, e.target.value)}
            className="w-full text-base font-semibold text-gray-800 outline-none mb-4 bg-transparent border-b border-transparent focus:border-gray-200 pb-1"
          />

          {q.type === "rating" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-2 w-fit bg-white text-sm">
                <span>{q.maxScale || 5}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
              <div className="flex gap-8 justify-start pt-2">
                {Array.from({ length: q.maxScale || 5 }).map((_, i) => {
                  const starRating = i + 1;
                  const isSelected = starRating <= (q.ratingValue || 0);

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => updateRatingValue(q.id, starRating)}
                      className="flex flex-col items-center gap-2 group/star outline-none"
                    >
                      <span
                        className={`text-xs font-medium ${isSelected ? "text-gray-400" : "text-gray-400"}`}
                      >
                        {starRating}
                      </span>
                      <Star
                        size={24}
                        className={`transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? "text-amber-400 fill-amber-400 scale-110"
                            : "text-gray-300 hover:text-amber-300 stroke-[1.5]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {q.type === "linear" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1.5 bg-white">
                  <span>1</span> <ChevronDown size={14} />
                </div>
                <span>to</span>
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1.5 bg-white">
                  <span>5</span> <ChevronDown size={14} />
                </div>
              </div>

              <div className="space-y-3 max-w-xs">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 w-4">
                    1
                  </span>
                  <input
                    type="text"
                    value={q.minLabel || ""}
                    onChange={(e) =>
                      updateLinearLabels(q.id, "minLabel", e.target.value)
                    }
                    placeholder="Not satisfied"
                    className="text-sm text-gray-600 border-b border-gray-200 pb-1 outline-none w-full bg-transparent focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 w-4">
                    5
                  </span>
                  <input
                    type="text"
                    value={q.maxLabel || ""}
                    onChange={(e) =>
                      updateLinearLabels(q.id, "maxLabel", e.target.value)
                    }
                    placeholder="Very satisfied"
                    className="text-sm text-gray-600 border-b border-gray-200 pb-1 outline-none w-full bg-transparent focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {q.type === "choice" && (
            <div className="space-y-3">
              {q.options?.map((opt, optIdx) => (
                <div
                  key={optIdx}
                  className="flex items-center justify-between group/opt gap-2"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        updateChoiceOption(q.id, optIdx, e.target.value)
                      }
                      className="text-sm text-gray-700 outline-none w-full bg-transparent border-b border-transparent focus:border-gray-200 pb-0.5"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeChoiceOption(q.id, optIdx)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    <Delete size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addChoiceOption(q.id)}
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-gray-600 pt-1"
              >
                <div className="w-5 h-5 rounded-full border border-dashed border-gray-300 flex items-center justify-center" />
                Add Option
              </button>
            </div>
          )}

          <div className="flex justify-end border-t border-gray-50 mt-6 pt-3">
            <button
              type="button"
              onClick={() => removeQuestion(q.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setQuestions([
            ...questions,
            {
              id: `${Date.now()}`,
              type: "choice",
              text: "New Choice Question",
              options: ["Option 1"],
            },
          ])
        }
        className="w-full p-4 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:bg-gray-50/50 hover:text-gray-600 transition-all text-sm font-medium"
      >
        <Plus size={16} /> Add Questions
      </button>
    </div>
  );
}
