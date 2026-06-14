"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

import { Question } from "../../../data/Question";
import TextQuestion from "./survey-items/TextQuestion";
import YesNoQuestion from "./survey-items/YesNoQuestion";
import ChoiceQuestion from "./survey-items/ChoiceQuestion";
import DropdownQuestion from "./survey-items/DropdownQuestion";
import RatingQuestion from "./survey-items/RatingQuestion";
import LinearQuestion from "./survey-items/LinearQuestion";
import MatrixQuestion from "./survey-items/MatrixQuestion";

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

  const updateQuestionState = <K extends keyof Question>(
    id: string,
    key: K,
    value: Question[K],
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

  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <div
          key={q.id}
          className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm relative group"
        >
          <Input
            type="text"
            value={q.text}
            onChange={(e) => updateQuestionText(q.id, e.target.value)}
            className="w-full text-base font-semibold text-foreground outline-none mb-4 bg-transparent border-0 border-b rounded-none p-0 pb-1 h-auto shadow-none focus-visible:ring-0 focus-visible:border-border"
          />

          {(q.type === "short-text" || q.type === "long-text") && (
            <TextQuestion
              question={q}
              onChange={(val) => updateQuestionState(q.id, "textAnswer", val)}
            />
          )}

          {q.type === "yes-no" && (
            <YesNoQuestion
              question={q}
              onChange={(val) => updateQuestionState(q.id, "toggleValue", val)}
            />
          )}

          {q.type === "dropdown" && (
            <DropdownQuestion
              question={q}
              onSelect={(val) =>
                updateQuestionState(q.id, "selectedChoice", val)
              }
              onUpdateOption={(idx, val) => updateChoiceOption(q.id, idx, val)}
              onAddOption={() => addChoiceOption(q.id)}
              onRemoveOption={(idx) => removeChoiceOption(q.id, idx)}
            />
          )}

          {q.type === "rating" && (
            <RatingQuestion
              question={q}
              onScaleChange={(scale) =>
                updateQuestionState(q.id, "maxScale", scale)
              }
              onRatingChange={(rating) =>
                updateQuestionState(q.id, "ratingValue", rating)
              }
            />
          )}

          {q.type === "linear" && (
            <LinearQuestion
              question={q}
              onStateChange={(key, val) => updateQuestionState(q.id, key, val)}
              onLabelChange={(key, val) => updateQuestionState(q.id, key, val)}
            />
          )}

          {q.type === "matrix" && (
            <MatrixQuestion
              question={q}
              onUpdateItem={(key, idx, val) =>
                updateMatrixItem(q.id, key, idx, val)
              }
              onAddItem={(key, placeholder) =>
                addMatrixItem(q.id, key, placeholder)
              }
              onRemoveItem={(key, idx) => removeMatrixItem(q.id, key, idx)}
              onAnswer={(row, col) => updateMatrixAnswer(q.id, row, col)}
            />
          )}

          {q.type === "choice" && (
            <ChoiceQuestion
              question={q}
              onSelect={(opt) =>
                updateQuestionState(q.id, "selectedChoice", opt)
              }
              onUpdateOption={(idx, val) => updateChoiceOption(q.id, idx, val)}
              onAddOption={() => addChoiceOption(q.id)}
              onRemoveOption={(idx) => removeChoiceOption(q.id, idx)}
            />
          )}

          <div className="flex justify-end pt-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                setQuestions(questions.filter((item) => item.id !== q.id))
              }
              className="text-muted-foreground hover:bg-transparent hover:text-destructive h-9 w-9 transition-colors"
            >
              <Trash2 size={24} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
