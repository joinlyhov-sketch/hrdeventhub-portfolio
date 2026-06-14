"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import SurveyHeader from "./SurveyHeader";
import SurveyQuestionsList from "./SurveyQuestionsList";
import QuestionTypeSidebar from "./QuestionTypeSidebar";
import WorkspaceSelector from "./WorkspaceSelector";
import { Button } from "../../ui/button";
import { Question } from "../../../data/Question";
import { useSurveyFormStore } from "../../../store/useSurveyFormStore";
import { surveyService } from "../../../service/survey.service";
import { SurveyContent, SurveyElement } from "../../../types/survey";

import {
  createSurveyAction,
  updateSurveyAction,
} from "@/actions/survey.action";

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
  surveyId?: string; // Add optional surveyId parameter prop configuration
  onSuccess?: () => void;
}

export default function SurveyCreationForm({
  workspaceId,
  surveyId,
  onSuccess,
}: SurveyCreationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formStore = useSurveyFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const isEditMode = !!surveyId;

  useEffect(() => {
    if (!surveyId) {
      queueMicrotask(() => setQuestions([
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
      ]));
      return;
    }

    const loadExistingSurveyData = async () => {
      setIsLoadingData(true);
      try {
        const survey = await surveyService.getSurveyById(surveyId);

        formStore.setTitle(survey.title);
        formStore.setDescription(survey.description || "");
        const isActiveSafe: boolean = Boolean((survey as unknown as { active?: boolean }).active ?? survey.isActive ?? true);
        formStore.setIsActive(isActiveSafe);
        if (survey.closingTime) {
          formStore.setClosingTime(
            new Date(survey.closingTime).toISOString().slice(0, 16),
          );
        }
        formStore.setSelectedWorkspaceId(survey.workspaceId);

        if (survey.content?.pages?.[0]?.elements) {
          const mappedQuestions: Question[] =
            survey.content.pages[0].elements.map((el, index) => {
              const extractedId =
                el.name.replace("question_", "") || `${index + 1}`;

              return {
                id: extractedId,
                type: el.type as QuestionType,
                text: el.title,
                options: el.choices,
                matrixRows: el.rows,
                matrixCols: el.columns,
                minLabel: el.minRateLabel,
                maxLabel: el.maxRateLabel,
                maxScale: el.maxRateDescription,
              } as Question;
            });
          setQuestions(mappedQuestions);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load survey data.",
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    loadExistingSurveyData();
  }, [surveyId, formStore]);

  useEffect(() => {
    const urlQueryId =
      searchParams.get("groupId") || searchParams.get("groupid");
    const resolvedId = urlQueryId || workspaceId;
    if (resolvedId && !isEditMode) {
      formStore.setSelectedWorkspaceId(resolvedId);
    }
  }, [searchParams, workspaceId, isEditMode, formStore]);

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
    const QUESTIONS_PER_PAGE = 3;

    const chunks: Question[][] = [];
    for (let i = 0; i < questions.length; i += QUESTIONS_PER_PAGE) {
      chunks.push(questions.slice(i, i + QUESTIONS_PER_PAGE));
    }

    const pages = chunks.map((chunk, pageIndex) => {
      const elements: SurveyElement[] = chunk.map((q) => {
        const element: SurveyElement = {
          name: `question_${q.id}`,
          type: q.type,
          title: q.text,
        };
        if (q.options) element.choices = q.options;
        if (q.matrixRows) element.rows = q.matrixRows;
        if (q.matrixCols) element.columns = q.matrixCols;
        if (q.minLabel) element.minRateLabel = q.minLabel;
        if (q.maxLabel) element.maxRateLabel = q.maxLabel;
        if (q.maxScale) element.maxRateDescription = q.maxScale;
        return element;
      });

      return {
        name: `page${pageIndex + 1}`,
        title: `Page ${pageIndex + 1}`,
        elements,
      };
    });

    if (pages.length === 0) {
      pages.push({ name: "page1", title: "Page 1", elements: [] });
    }

    return {
      title: formStore.title || "Untitled Survey",
      pages,
    };
  }, [questions, formStore.title]);

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formStore.title.trim()) throw new Error("Survey title is required");
      if (questions.length === 0)
        throw new Error("At least one question is required");
      if (!formStore.closingTime) throw new Error("Closing time is required");
      if (!formStore.selectedWorkspaceId)
        throw new Error("Please select a workspace");

      const content = convertQuestionsToBEFormat();

      const surveyData = {
        title: formStore.title,
        description: formStore.description,
        content,
        isActive: formStore.isActive ?? true,
        closingTime: new Date(formStore.closingTime).toISOString(),
        workspaceId: formStore.selectedWorkspaceId,
      };

      console.log(
        "Transmitting complete payload structure to backend endpoint:",
        surveyData,
      );

      if (isEditMode) {
        await updateSurveyAction(surveyId!, surveyData);
      } else {
        await createSurveyAction(surveyData);
      }

      const savedWorkspaceId = formStore.selectedWorkspaceId;
      formStore.reset();
      setQuestions([]);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/group/${savedWorkspaceId}`);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save survey modifications.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWorkspaceContextLocked =
    !!searchParams.get("groupId") ||
    !!searchParams.get("groupid") ||
    !!workspaceId ||
    isEditMode;

  if (isLoadingData) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          Loading survey configuration data from database...
        </p>
      </div>
    );
  }

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
              className="w-full sm:w-auto px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 min-w-[140px]"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting
                ? isEditMode
                  ? "Saving Changes..."
                  : "Posting..."
                : isEditMode
                  ? "Save Survey"
                  : "Post Survey"}
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
            disabled={isWorkspaceContextLocked}
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
            <Plus size={24} />
            Add Questions
          </Button>
        </div>
      </div>
      <QuestionTypeSidebar onAddQuestion={addQuestionByType} />
    </form>
  );
}
