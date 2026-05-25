"use client";

import React, { useState } from "react";
import {
  AlignLeft,
  FileText,
  CheckCircle,
  ListChecks,
  ArrowDownCircle,
  Star,
  ToggleLeft,
  Grid,
  BarChart4,
  Loader2,
  Plus,
  Type,
  TextAlignStart,
  CircleDot,
  SquareCheck,
  ChevronDown,
  ToggleRight,
  LayoutGrid,
} from "lucide-react";
import SurveyHeader from "./SurveyHeader";
import SurveyQuestionsList, { Question } from "./SurveyQuestionsList";
import SidebarItemButton from "./SidebarItemButton";

type QuestionType =
  | "short-text"
  | "long-text"
  | "choice"
  | "dropdown"
  | "rating"
  | "linear"
  | "matrix"
  | "yes-no";

export default function SurveyCreationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      type: "rating",
      text: "How would you rate today's event overall?",
      maxScale: 5,
      ratingValue: 0,
    },
    {
      id: "2",
      type: "linear",
      text: "On a scale of 1 to 5, how satisfied were you with today's event?",
      linearStart: 1,
      linearEnd: 5,
    },
  ]);

  const addQuestionByType = (type: QuestionType) => {
    const templates: Record<QuestionType, Partial<Question>> = {
      "short-text": { text: "Untitled Short Text Question", textAnswer: "" },
      "long-text": { text: "Untitled Long Text Question", textAnswer: "" },
      choice: {
        text: "Untitled Choice Question",
        options: ["Option 1", "Option 2"],
        selectedChoice: "",
      },
      dropdown: {
        text: "Untitled Dropdown Question",
        options: ["Choice A", "Choice B"],
        selectedChoice: "",
      },
      rating: { text: "Untitled Rating Question", maxScale: 5, ratingValue: 0 },
      linear: {
        text: "Untitled Scale Question",
        linearStart: 1,
        linearEnd: 5,
        minLabel: "Low",
        maxLabel: "High",
      },
      "yes-no": { text: "Untitled Binary Choice Question", toggleValue: false },
      matrix: {
        text: "Untitled Matrix Question Grid",
        matrixRows: ["Statement Row 1"],
        matrixCols: ["Poor", "Excellent"],
        matrixAnswers: {},
      },
    };

    setQuestions([
      ...questions,
      { id: `${Date.now()}`, type, ...templates[type] } as Question,
    ]);
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert("Survey Created Successfully!");
  };

  return (
    <form
      onSubmit={handleFormSubmission}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto border-gray-100 w-full"
    >
      <div className="lg:col-span-3 p-4 sm:p-6 lg:p-8 w-full mx-auto flex flex-col justify-between order-1">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2">
            <div></div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto p-2.5 px-5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 min-w-[120px]"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting ? "Posting..." : "Post Survey"}
            </button>
          </div>

          <SurveyHeader
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />

          <div className="w-full max-w-full overflow-hidden">
            <SurveyQuestionsList
              questions={questions}
              setQuestions={setQuestions}
            />
          </div>

          <button
            type="button"
            onClick={() => addQuestionByType("choice")}
            className="w-full p-4 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:bg-gray-100/50 hover:text-gray-600 transition-all text-sm font-semibold shadow-sm"
          >
            <Plus size={16} /> Add Questions
          </button>
        </div>
      </div>

      <div className="bg-white border-t lg:border-t-0 lg:border-l border-gray-100 p-4 sm:p-6 space-y-6 order-2 lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 overflow-y-auto sticky top-50 z-30">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-400 tracking-wider mb-4 uppercase">
            Question Types
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 sm:gap-4 lg:space-y-6">
            <div className="bg-slate-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-100 sm:border-none">
              <span className="text-[10px] font-bold text-gray-300 block mb-2 tracking-widest">
                BASIC
              </span>
              <div className="space-y-2">
                <SidebarItemButton
                  label="Short Text"
                  icon={<Type size={16} />}
                  onClick={() => addQuestionByType("short-text")}
                />
                <SidebarItemButton
                  label="Long Text"
                  icon={<TextAlignStart size={16} />}
                  onClick={() => addQuestionByType("long-text")}
                />
              </div>
            </div>

            <div className="bg-slate-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-100 sm:border-none">
              <span className="text-[10px] font-bold text-gray-300 block mb-2 tracking-widest">
                CHOICE
              </span>
              <div className="space-y-2">
                <SidebarItemButton
                  label="Single Choice"
                  icon={<CircleDot size={16} />}
                  onClick={() => addQuestionByType("choice")}
                />
                <SidebarItemButton
                  label="Multiple Choice"
                  icon={<SquareCheck size={16} />}
                  onClick={() => addQuestionByType("choice")}
                />
                <SidebarItemButton
                  label="Dropdown"
                  icon={<ChevronDown size={16} />}
                  onClick={() => addQuestionByType("dropdown")}
                />
              </div>
            </div>

            <div className="bg-slate-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-100 sm:border-none">
              <span className="text-[10px] font-bold text-gray-300 block mb-2 tracking-widest">
                ADVANCED
              </span>
              <div className="space-y-2">
                <SidebarItemButton
                  label="Rating"
                  icon={<Star size={16} />}
                  onClick={() => addQuestionByType("rating")}
                />
                <SidebarItemButton
                  label="Yes/No Toggle"
                  icon={<ToggleRight size={16} />}
                  onClick={() => addQuestionByType("yes-no")}
                />
                <SidebarItemButton
                  label="Matrix"
                  icon={<LayoutGrid size={16} />}
                  onClick={() => addQuestionByType("matrix")}
                />
                <SidebarItemButton
                  label="Linear Scale"
                  icon={<BarChart4 size={16} />}
                  onClick={() => addQuestionByType("linear")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
