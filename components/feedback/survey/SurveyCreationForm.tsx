"use client";

import React, { useState, useCallback } from "react";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import SurveyHeader from "./SurveyHeader";
import SurveyQuestionsList from "./SurveyQuestionsList";
import QuestionTypeSidebar from "./QuestionTypeSidebar";
import WorkspaceSelector from "./WorkspaceSelector";
import { Button } from "../../ui/button";
import { Question } from "../../../data/Question";
import { useSurveyFormStore } from "../../../store/useSurveyFormStore";
import { surveyService } from "../../../service/survey.service";
import { SurveyContent, SurveyElement, SurveyPage } from "../../../types/survey";

export type QuestionType =
  | "short-text"
  | "long-text"
  | "choice"
  | "dropdown"
  | "rating"
  | "linear"
  | "matrix"
  | "yes-no";

interface SurveyCreationFormProps {
  workspaceId?: string;
  onSuccess?: () => void;
}

export default function SurveyCreationForm({ workspaceId, onSuccess }: SurveyCreationFormProps) {
  const router = useRouter();
  const formStore = useSurveyFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const convertQuestionsToBEFormat = useCallback((): SurveyContent => {
    const elements: SurveyElement[] = questions.map((q) => {
      const element: SurveyElement = {
        name: `question_${q.id}`,
        type: q.type,
        title: q.text,
      };

      if (q.options) {
        element.choices = q.options;
      }
      if (q.matrixRows) {
        element.rows = q.matrixRows;
      }
      if (q.matrixCols) {
        element.columns = q.matrixCols;
      }
      if (q.minLabel) {
        element.minRateLabel = q.minLabel;
      }
      if (q.maxLabel) {
        element.maxRateLabel = q.maxLabel;
      }
      if (q.maxScale) {
        element.maxRateDescription = q.maxScale;
      }

      return element;
    });

    return {
      title: formStore.title || "Untitled Survey",
      pages: [
        {
          name: "page1",
          title: "Survey Page",
          elements,
        },
      ],
    };
  }, [questions, formStore.title]);

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formStore.title.trim()) {
        throw new Error("Survey title is required");
      }

      if (questions.length === 0) {
        throw new Error("At least one question is required");
      }

      if (!formStore.closingTime) {
        throw new Error("Closing time is required");
      }

      if (!formStore.selectedWorkspaceId) {
        throw new Error("Please select a workspace");
      }

      const content = convertQuestionsToBEFormat();

      const surveyData = {
        title: formStore.title,
        description: formStore.description,
        content,
        isActive: formStore.isActive,
        closingTime: new Date(formStore.closingTime).toISOString(),
        workspaceId: formStore.selectedWorkspaceId,
      };

      await surveyService.createSurvey(surveyData);
      
      // Reset form
      formStore.reset();
      setQuestions([]);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/dashboard/feedback/survey-feedback`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create survey";
      setError(errorMessage);
      console.error("Survey creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmission}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto border-gray-100 w-full items-start"
    >
      <div className="lg:col-span-3 p-4 sm:p-6 lg:p-8 w-full mx-auto flex flex-col justify-between order-1">
        <div className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={20} className="text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

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
            title={formStore.title}
            setTitle={formStore.setTitle}
            description={formStore.description}
            setDescription={formStore.setDescription}
            closingTime={formStore.closingTime}
            setClosingTime={formStore.setClosingTime}
            isActive={formStore.isActive}
            setIsActive={formStore.setIsActive}
          />

          <WorkspaceSelector
            selectedWorkspaceId={formStore.selectedWorkspaceId}
            onSelectWorkspace={formStore.setSelectedWorkspaceId}
            required={true}
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
