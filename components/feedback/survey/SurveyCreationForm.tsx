"use client";

import React, { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import SurveyHeader from "./SurveyHeader";
import SurveyQuestionsList from "./SurveyQuestionsList";
import QuestionTypeSidebar from "./QuestionTypeSidebar";
import { Button } from "../../ui/button";
import { Question } from "../../../data/Question";

export type QuestionType =
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
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto border-gray-100 w-full items-start"
    >
      <div className="lg:col-span-3 p-4 sm:p-6 lg:p-8 w-full mx-auto flex flex-col justify-between order-1">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2">
            <div />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 min-w-[120px]"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting ? "Posting..." : "Post Survey"}
            </Button>
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

          <Button
            type="button"
            variant="outline"
            onClick={() => addQuestionByType("choice")}
            className="w-full p-5 border-dashed border-gray-300 bg-white rounded-xl flex items-center justify-center gap-2 text-detail font-semibold text-gray-500 shadow-sm hover:bg-slate-50/50"
          >
            <span>
              <Plus size={24} />
            </span>
            Add Questions
          </Button>
        </div>
      </div>

      <QuestionTypeSidebar onAddQuestion={addQuestionByType} />
    </form>
  );
}
