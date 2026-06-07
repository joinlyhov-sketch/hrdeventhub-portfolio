"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import type { UserRole } from "@/context/user-context";
import EditPostDropDown from "@/components/site/pop-up/action-button/action-edit-post";
import { Survey, SurveyElement } from "@/types/survey";
import { submitSurveyResponseAction } from "@/actions/survey.action";
import { surveyService } from "@/service/survey.service";
import { deleteSurveyAction } from "@/actions/survey.action";
import { isAfter } from "date-fns";

interface SurveyCardProps {
  survey: Survey;
  role: UserRole;
  searchQuery: string;
  onVisibilityChange: (visible: boolean) => void;
  onDelete?: (surveyId: string) => void;
}

type Answers = Record<string, unknown>;

function QuestionField({
  element,
  value,
  onChange,
  disabled,
}: {
  element: SurveyElement;
  value: unknown;
  onChange: (val: unknown) => void;
  disabled: boolean;
}) {
  const base =
    "w-full border border-grey-200 rounded-xl p-4 text-grey-900 placeholder:text-grey-400 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-none disabled:opacity-60";

  switch (element.type) {
    case "short-text":
      return (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer..."
          disabled={disabled}
          className={base}
          style={{ fontSize: "16px" }}
        />
      );

    case "long-text":
      return (
        <textarea
          rows={4}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your response here..."
          disabled={disabled}
          className={base}
          style={{ fontSize: "16px" }}
        />
      );

    case "choice":
      return (
        <div className="space-y-2">
          {(element.choices ?? []).map((choice) => {
            const isSelected = value === choice;
            return (
              <label
                key={choice}
                className={`flex items-center gap-3 border p-3 rounded-xl cursor-pointer transition-all ${
                  isSelected ? "border-[#00366F]" : "border-grey-200 hover:border-grey-300"
                } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name={element.name}
                  value={choice}
                  checked={isSelected}
                  disabled={disabled}
                  onChange={() => onChange(choice)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? "border-[#00366F]" : "border-grey-300"
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#00366F]" />}
                </div>              
                <span className="font-medium text-grey-700" style={{ fontSize: "18px" }}>
                  {choice}
                </span>
              </label>
            );
          })}
        </div>
      );

    case "dropdown":
      return (
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${base} bg-white`}
          style={{ fontSize: "16px" }}
        >
          <option value="">— Select an option —</option>
          {(element.choices ?? []).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      );

    case "rating": {
      const max = element.maxRateDescription ?? 5;
      const current = (value as number) ?? 0;
      return (
        <div className="flex gap-1">
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              disabled={disabled}
              onClick={() => onChange(n)}            
              className="transition-colors disabled:opacity-60 cursor-pointer leading-none"
              style={{ fontSize: "28px" }}
            >
              <span className={n <= current ? "text-yellow-400" : "text-grey-200"}>★</span>
            </button>
          ))}
        </div>
      );
    }

    case "linear": {
      const min = 1;
      const max = element.maxRateDescription ?? 5;
      const current = (value as number) ?? min;
      return (
        <div className="space-y-3">
          <div className="flex justify-between font-medium text-grey-400" style={{ fontSize: "14px" }}>
            <span>{element.minRateLabel ?? "Low"}</span>
            <span>{element.maxRateLabel ?? "High"}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={current}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-secondary disabled:opacity-60"
          />
          <div className="text-center font-bold text-secondary" style={{ fontSize: "18px" }}>
            {current}
          </div>
        </div>
      );
    }

    case "yes-no":
      return (
        <div className="flex gap-4">
          {["Yes", "No"].map((opt) => {
            const isSelected = value === opt;
            return (
              <button
                key={opt}
                type="button"
                disabled={disabled}
                onClick={() => onChange(opt)}
                className={`flex-1 py-3 rounded-xl font-bold border transition-all ${
                  isSelected
                    ? "bg-secondary text-white border-secondary"
                    : "bg-white text-grey-600 border-grey-200 hover:border-grey-300"
                } disabled:opacity-60`}
                style={{ fontSize: "18px" }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      );

    case "matrix": {
      const rows = element.rows ?? [];
      const cols = element.columns ?? [];
      const matrixVal = (value as Record<string, string>) ?? {};
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ fontSize: "16px" }}>
            <thead>
              <tr>
                <th className="p-2 text-left text-grey-400 font-medium" />
                {cols.map((col) => (
                  <th key={col} className="p-2 text-center text-grey-600 font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row} className="border-t border-grey-100">
                  <td className="p-2 pr-4 text-grey-700 font-medium whitespace-nowrap">{row}</td>
                  {cols.map((col) => (
                    <td key={`${row}-${col}`} className="p-2 text-center">
                      <input
                        type="radio"
                        name={`${element.name}-${row}`}
                        value={col}
                        disabled={disabled}
                        checked={matrixVal[row] === col}
                        onChange={() => onChange({ ...matrixVal, [row]: col })}
                        className="w-4 h-4 accent-secondary"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    default:
      return (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer..."
          disabled={disabled}
          className={base}
          style={{ fontSize: "16px" }}
        />
      );
  }
}

export function SurveyCard({
  survey,
  role,
  searchQuery,
  onVisibilityChange,
  onDelete,
}: SurveyCardProps) {
  const pages = survey.content?.pages ?? [];
  const totalSteps = Math.max(pages.length, 1);

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isActiveSafe =
    (survey as unknown as { active?: boolean }).active ?? survey.isActive ?? true;

  const isClosed =
    !isActiveSafe ||
    (!!survey.closingTime && isAfter(new Date(), new Date(survey.closingTime)));

  const title = survey.title ?? "";
  const description = survey.description ?? "";
  const isMatch =
    title.toLowerCase().includes((searchQuery || "").toLowerCase().trim()) ||
    description.toLowerCase().includes((searchQuery || "").toLowerCase().trim());

  useEffect(() => {
    onVisibilityChange(isMatch);
  }, [isMatch, onVisibilityChange]);

  useEffect(() => {
    let cancelled = false;
    setLoadingStatus(true);
    surveyService
      .hasSubmitted(survey.surveyId)
      .then((has) => { if (!cancelled) setAlreadySubmitted(has); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingStatus(false); });
    return () => { cancelled = true; };
  }, [survey.surveyId]);

  const handleAnswerChange = useCallback((name: string, val: unknown) => {
    setAnswers((prev) => ({ ...prev, [name]: val }));
  }, []);

  const currentPage = pages[currentStep - 1];
  const currentElements: SurveyElement[] = currentPage?.elements ?? [];

  const handleNext = () => { if (currentStep < totalSteps) setCurrentStep((s) => s + 1); };
  const handleBack = () => { if (currentStep > 1) setCurrentStep((s) => s - 1); setError(null); };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await submitSurveyResponseAction(survey.surveyId, { content: answers });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit survey.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSurveyAction(survey.surveyId, survey.workspaceId?.toString());
      onDelete?.(survey.surveyId);
    } catch (err) {
      console.error("Failed to delete survey:", err);
    }
  };

  if (!isMatch) return null;

  const SurveyBadge = () => (
    <span
      className="font-semibold px-3 py-1 rounded-[10px] uppercase tracking-wider"
      style={{
        fontSize: "14px",
        backgroundColor: "rgba(0, 54, 111, 0.10)",
        color: "#00366F",
      }}
    >
      Survey
    </span>
  );

  const CardHeader = ({
    badge,
    showMenu = false,
  }: {
    badge: React.ReactNode;
    showMenu?: boolean;
  }) => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-bold leading-tight" style={{ color: "#1C4D8D", fontSize: "34px" }}>
        {title}
      </h2>
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {badge}
        {showMenu && (role === "admin" || role === "organizer") && (
          <EditPostDropDown
            title={title}
            editUrl={`/event-management/edition/survey?surveyId=${survey.surveyId}`}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );

  if (submitted || alreadySubmitted) {
    return (
      <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm">
        <CardHeader badge={<SurveyBadge />} />
        <div className="py-10 flex flex-col items-center gap-3 text-center">
          <CheckCircle2 size={52} className="text-green-500" />
          <p className="font-bold text-grey-800" style={{ fontSize: "20px" }}>
            {submitted ? "Response Submitted!" : "Already Submitted"}
          </p>
          <p className="text-grey-400 max-w-xs" style={{ fontSize: "16px" }}>
            {submitted
              ? "Thank you for completing this survey."
              : "You have already submitted a response for this survey."}
          </p>
        </div>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm">
        <CardHeader
          badge={
            <span
              className="font-semibold px-3 py-1 rounded-[12px] uppercase tracking-wider"
              style={{ fontSize: "14px", backgroundColor: "#fef2f2", color: "#ef4444" }}
            >
              Closed
            </span>
          }
          showMenu
        />
    
        <p style={{ color: "#434750", fontSize: "20px" }} className="font-semibold">
          {description}
        </p>
        <p className="text-grey-300 mt-4 italic" style={{ fontSize: "16px" }}>
          This survey is no longer accepting responses.
        </p>
      </div>
    );
  }

  if (loadingStatus) {
    return (
      <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm animate-pulse">
        <div className="h-8 bg-grey-100 rounded w-2/3 mb-3" />
        <div className="h-5 bg-grey-100 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm">
      <CardHeader badge={<SurveyBadge />} showMenu />
      
      <p className="mb-6 font-semibold" style={{ color: "#434750", fontSize: "20px" }}>
        {description}
      </p>

      {currentPage?.title && currentPage.title !== "Survey Page" && (
        <p
          className="font-semibold uppercase tracking-widest mb-5"
          style={{ color: "#1C4D8D", fontSize: "16px" }}
        >
          {currentPage.title}
        </p>
      )}

      {currentElements.length === 0 ? (
        <div className="py-10 text-center text-grey-400" style={{ fontSize: "16px" }}>
          No questions on this page.
        </div>
      ) : (
        <div className="space-y-8">
          {currentElements.map((el) => (
            <div key={el.name}>              
              <h3
                className="font-semibold mb-4 leading-snug"
                style={{ color: "#1A1C20", fontSize: "24px" }}
              >
                {el.title}
              </h3>
              <QuestionField
                element={el}
                value={answers[el.name]}
                onChange={(val) => handleAnswerChange(el.name, val)}
                disabled={submitting}
              />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div
          className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
          style={{ fontSize: "16px" }}
        >
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="border-t border-grey-100 my-6" />

      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1 || submitting}
          className={`flex items-center gap-2 font-bold transition-colors select-none ${
            currentStep === 1 ? "text-grey-300 cursor-not-allowed" : "cursor-pointer hover:opacity-80"
          }`}
          style={{
            fontSize: "18px",
            color: currentStep !== 1 ? "#434750" : undefined,
          }}
        >
          <ChevronLeft size={22} />
          <span className="uppercase tracking-wider">
            Step {currentStep} of {totalSteps}
          </span>
        </button>

        {currentStep < totalSteps ? (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all cursor-pointer tracking-wider disabled:opacity-60"
            style={{ fontSize: "18px", backgroundColor: "#1C4D8D" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#163f75")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1C4D8D")}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all cursor-pointer tracking-wider disabled:opacity-60 flex items-center gap-2"
            style={{ fontSize: "18px", backgroundColor: "#1C4D8D" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#163f75")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1C4D8D")}
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {submitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}