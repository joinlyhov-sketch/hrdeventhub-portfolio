"use client";

import React from "react";
import { Trash2, X, Star, Plus, ChevronDown } from "lucide-react";

export interface Question {
  id: string;
  type:
    | "rating"
    | "linear"
    | "choice"
    | "short-text"
    | "long-text"
    | "dropdown"
    | "matrix"
    | "yes-no";
  text: string;
  options?: string[];
  matrixRows?: string[];
  matrixCols?: string[];
  maxScale?: number;
  linearStart?: number;
  linearEnd?: number;
  minLabel?: string;
  maxLabel?: string;

  textAnswer?: string;
  ratingValue?: number;
  toggleValue?: boolean;
  selectedChoice?: string;
  matrixAnswers?: Record<string, string>;
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

  const updateTextAnswer = (id: string, textAnswer: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, textAnswer } : q)),
    );
  };

  const updateRatingValue = (id: string, value: number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ratingValue: value } : q)),
    );
  };

  const updateQuestionState = (id: string, key: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [key]: value } : q)),
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
          const updated = [...q.options];
          updated[optIdx] = value;
          return { ...q, options: updated };
        }
        return q;
      }),
    );
  };

  const updateMatrixItem = (
    qId: string,
    key: "matrixRows" | "matrixCols",
    idx: number,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId && q[key]) {
          const updated = [...q[key]!];
          updated[idx] = value;
          return { ...q, [key]: updated };
        }
        return q;
      }),
    );
  };

  const addMatrixItem = (
    qId: string,
    key: "matrixRows" | "matrixCols",
    placeholder: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId && q[key]) {
          return {
            ...q,
            [key]: [...q[key]!, `${placeholder} ${q[key]!.length + 1}`],
          };
        }
        return q;
      }),
    );
  };

  const removeMatrixItem = (
    qId: string,
    key: "matrixRows" | "matrixCols",
    idx: number,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId && q[key] && q[key]!.length > 1) {
          return { ...q, [key]: q[key]!.filter((_, i) => i !== idx) };
        }
        return q;
      }),
    );
  };

  const updateMatrixAnswer = (
    qId: string,
    rowLabel: string,
    colLabel: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            matrixAnswers: { ...(q.matrixAnswers || {}), [rowLabel]: colLabel },
          };
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
        if (q.id === qId && q.options)
          return {
            ...q,
            options: [...q.options, `Option ${q.options.length + 1}`],
          };
        return q;
      }),
    );
  };

  const removeChoiceOption = (qId: string, optIdx: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId && q.options && q.options.length > 1)
          return {
            ...q,
            options: q.options.filter((_, idx) => idx !== optIdx),
          };
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

          {q.type === "short-text" && (
            <input
              type="text"
              value={q.textAnswer || ""}
              onChange={(e) => updateTextAnswer(q.id, e.target.value)}
              placeholder="Type your short text answer here..."
              className="w-full max-w-md border-b border-gray-200 pb-2 text-sm text-gray-700 outline-none focus:border-blue-500 bg-transparent"
            />
          )}

          {q.type === "long-text" && (
            <textarea
              value={q.textAnswer || ""}
              onChange={(e) => updateTextAnswer(q.id, e.target.value)}
              placeholder="Type your long detailed text answer here..."
              rows={3}
              className="w-full max-w-xl border border-gray-200 rounded-xl p-3 bg-gray-50/50 text-sm text-gray-700 outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
            />
          )}

          {q.type === "yes-no" && (
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={() =>
                  setQuestions(
                    questions.map((item) =>
                      item.id === q.id
                        ? { ...item, toggleValue: !q.toggleValue }
                        : item,
                    ),
                  )
                }
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 ${q.toggleValue ? "bg-blue-900" : "bg-gray-300"}`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-300 ${q.toggleValue ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
              <span className="text-sm font-semibold text-gray-700">
                {q.toggleValue ? "Yes" : "No"}
              </span>
            </div>
          )}

          {q.type === "dropdown" && (
            <div className="space-y-4">
              <div className="relative max-w-xs">
                <select
                  value={q.selectedChoice || ""}
                  onChange={(e) =>
                    updateQuestionState(q.id, "selectedChoice", e.target.value)
                  }
                  className="w-full p-2.5 pr-10 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 outline-none focus:border-blue-500 shadow-sm appearance-none cursor-pointer font-medium"
                >
                  <option value="" disabled>
                    Select Dropdown Choice
                  </option>
                  {q.options?.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Edit Choices Options
                </p>
                {q.options?.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className="flex items-center justify-between gap-2 max-w-md"
                  >
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        updateChoiceOption(q.id, optIdx, e.target.value)
                      }
                      className="text-sm text-gray-700 outline-none w-full bg-transparent border-b border-gray-100 focus:border-blue-500 pb-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => removeChoiceOption(q.id, optIdx)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addChoiceOption(q.id)}
                  className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:text-blue-700"
                >
                  <Plus size={14} /> Add Dropdown Field
                </button>
              </div>
            </div>
          )}

          {q.type === "rating" && (
            <div className="flex flex-col gap-4">
              <div className="relative w-32">
                <select
                  value={q.maxScale || 5}
                  onChange={(e) =>
                    updateQuestionState(
                      q.id,
                      "maxScale",
                      Number(e.target.value),
                    )
                  }
                  className="w-full p-2 pr-10 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 font-bold appearance-none outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                    <option key={val} value={val}>
                      {val} Stars
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              <div className="flex gap-8 justify-start pt-2 overflow-x-auto pb-1">
                {Array.from({ length: q.maxScale || 5 }).map((_, i) => {
                  const starRating = i + 1;
                  const isSelected = starRating <= (q.ratingValue || 0);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => updateRatingValue(q.id, starRating)}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <span
                        className={`text-xs font-bold transition-colors ${isSelected ? "text-amber-500" : "text-gray-400"}`}
                      >
                        {starRating}
                      </span>
                      <Star
                        size={24}
                        className={`transition-all duration-150 ${isSelected ? "text-amber-400 fill-amber-400 scale-110" : "text-gray-300 hover:text-amber-300 stroke-[1.5]"}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {q.type === "linear" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <div className="relative">
                  <select
                    value={q.linearStart || 1}
                    onChange={(e) =>
                      updateQuestionState(
                        q.id,
                        "linearStart",
                        Number(e.target.value),
                      )
                    }
                    className="p-1.5 pr-7 border border-gray-200 rounded-lg bg-white text-xs font-bold outline-none appearance-none cursor-pointer"
                  >
                    {[0, 1, 2, 3, 4, 5].map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>

                <span>to</span>

                <div className="relative">
                  <select
                    value={q.linearEnd || 5}
                    onChange={(e) =>
                      updateQuestionState(
                        q.id,
                        "linearEnd",
                        Number(e.target.value),
                      )
                    }
                    className="p-1.5 pr-7 border border-gray-200 rounded-lg bg-white text-xs font-bold outline-none appearance-none cursor-pointer"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                      (val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ),
                    )}
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-3 max-w-xs">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700 w-4">
                    {q.linearStart || 1}
                  </span>
                  <input
                    type="text"
                    value={q.minLabel || ""}
                    onChange={(e) =>
                      updateLinearLabels(q.id, "minLabel", e.target.value)
                    }
                    placeholder="Not satisfied"
                    className="text-sm text-gray-600 border-b border-gray-200 pb-1 outline-none w-full bg-transparent focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700 w-4">
                    {q.linearEnd || 5}
                  </span>
                  <input
                    type="text"
                    value={q.maxLabel || ""}
                    onChange={(e) =>
                      updateLinearLabels(q.id, "maxLabel", e.target.value)
                    }
                    placeholder="Very satisfied"
                    className="text-sm text-gray-600 border-b border-gray-200 pb-1 outline-none w-full bg-transparent focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {q.type === "matrix" && q.matrixRows && q.matrixCols && (
            <div className="space-y-6">
              <div className="w-full border border-gray-100 rounded-xl overflow-x-auto bg-gray-50/30">
                <table className="w-full text-left border-collapse table-auto min-w-[750px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="p-3 text-xs font-bold text-gray-400 max-w-[200px]">
                        Rows (Questions)
                      </th>
                      {q.matrixCols.map((col, cIdx) => (
                        <th
                          key={cIdx}
                          className="p-3 text-center text-xs font-bold text-gray-400 min-w-[120px]"
                        >
                          <div className="flex items-center justify-center gap-1 group/col">
                            <input
                              type="text"
                              value={col}
                              onChange={(e) =>
                                updateMatrixItem(
                                  q.id,
                                  "matrixCols",
                                  cIdx,
                                  e.target.value,
                                )
                              }
                              className="text-center bg-transparent outline-none border-b border-transparent focus:border-blue-400 font-bold text-gray-600 w-full text-xs"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeMatrixItem(q.id, "matrixCols", cIdx)
                              }
                              className="text-gray-300 hover:text-red-500 opacity-0 group-hover/col:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </th>
                      ))}
                      <th className="p-3 text-center w-12">
                        <button
                          type="button"
                          onClick={() =>
                            addMatrixItem(q.id, "matrixCols", "Column")
                          }
                          className="text-blue-600 hover:scale-125 transition-transform"
                        >
                          <Plus size={14} />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.matrixRows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="border-b border-gray-100 last:border-0 bg-white hover:bg-gray-50/40 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2 group/row">
                            <button
                              type="button"
                              onClick={() =>
                                removeMatrixItem(q.id, "matrixRows", rIdx)
                              }
                              className="text-gray-300 hover:text-red-500 opacity-0 group-hover/row:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                            <input
                              type="text"
                              value={row}
                              onChange={(e) =>
                                updateMatrixItem(
                                  q.id,
                                  "matrixRows",
                                  rIdx,
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none border-b border-transparent focus:border-blue-400 text-sm text-gray-700 font-medium"
                            />
                          </div>
                        </td>
                        {q.matrixCols.map((col, cIdx) => {
                          const isChecked = q.matrixAnswers?.[row] === col;
                          return (
                            <td key={cIdx} className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  updateMatrixAnswer(q.id, row, col)
                                }
                                className={`w-5 h-5 rounded-full border flex items-center justify-center mx-auto transition-all ${
                                  isChecked
                                    ? "border-blue-900 bg-blue-900 shadow-sm scale-110"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                                }`}
                              >
                                {isChecked && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </button>
                            </td>
                          );
                        })}
                        <td />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={() =>
                  addMatrixItem(q.id, "matrixRows", "Row Statement")
                }
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                <Plus size={14} /> Add Row Statement
              </button>
            </div>
          )}

          {q.type === "choice" && (
            <div className="space-y-3">
              {q.options?.map((opt, optIdx) => {
                const isSelected = q.selectedChoice === opt;
                return (
                  <div
                    key={optIdx}
                    className="flex items-center justify-between group/opt gap-2"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuestionState(q.id, "selectedChoice", opt)
                        }
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? "border-blue-900 bg-blue-900" : "border-gray-300 bg-white"}`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </button>
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
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
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
    </div>
  );
}
