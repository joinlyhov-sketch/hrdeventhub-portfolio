"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Survey } from "../../../types/survey";
import { surveyService } from "../../../service/survey.service";

import { submitSurveyResponseAction } from "@/actions/survey.action";

interface SurveyResponseFormProps {
  surveyId: string;
}

export default function SurveyResponseForm({
  surveyId,
}: SurveyResponseFormProps) {
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [responses, setResponses] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const fetchSurvey = async () => {
      setLoading(true);
      try {
        const data = await surveyService.getSurveyById(surveyId);
        setSurvey(data);

        const submitted = await surveyService.hasSubmitted(surveyId);
        setHasSubmitted(submitted);

        if (submitted) {
          const myResponse = await surveyService.getMyResponse(surveyId);
          if (myResponse) {
            setResponses(myResponse.content);
          }
        }

        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch survey";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId]);

  const handleResponseChange = (elementName: string, value: unknown) => {
    setResponses((prev) => ({
      ...prev,
      [elementName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!survey) throw new Error("Survey not found");

      const allElements = survey.content.pages.flatMap((p) => p.elements);
      const emptyFields = allElements.filter((el) => !responses[el.name]);

      if (emptyFields.length > 0) {
        throw new Error(
          `Please answer all questions. Missing: ${emptyFields
            .map((f) => f.title)
            .join(", ")}`,
        );
      }

      await submitSurveyResponseAction(surveyId, { content: responses });

      setSuccess(true);
      setHasSubmitted(true);

      setTimeout(() => {
        router.push("/dashboard/feedback");
      }, 2000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit survey";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin mr-2" />
        Loading survey...
      </div>
    );
  }

  if (!survey) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <p className="text-red-700">Survey not found</p>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="p-8 text-center border-green-200 bg-green-50">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Survey Submitted Successfully!
        </h3>
        <p className="text-green-700 mb-4">
          Thank you for completing this survey. Redirecting...
        </p>
      </Card>
    );
  }

  if (hasSubmitted) {
    return (
      <Card className="p-8 border-blue-200 bg-blue-50">
        <div className="flex gap-4">
          <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              You&apos;ve Already Submitted This Survey
            </h3>
            <p className="text-blue-700 mb-4">
              Your response has been recorded.
            </p>
            <div className="space-y-2 mb-4">
              <h4 className="font-medium text-blue-900">Your Responses:</h4>
              <div className="bg-white rounded p-3 text-sm">
                <pre>{JSON.stringify(responses, null, 2)}</pre>
              </div>
            </div>
            <Button onClick={() => router.push("/dashboard/feedback")}>
              Back to Surveys
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Survey Header */}
      <Card className="p-8 border-l-4 border-l-blue-600">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {survey.title}
        </h1>
        {survey.description && (
          <p className="text-gray-600 mb-4">{survey.description}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>
            Status:{" "}
            <span
              className={`font-medium ${
                survey.isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {survey.isActive ? "Active" : "Closed"}
            </span>
          </span>
        </div>
      </Card>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50 flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      <div className="space-y-6">
        {survey.content.pages.map((page) =>
          page.elements.map((element) => (
            <Card key={element.name} className="p-6">
              <label className="block mb-4">
                <span className="block font-semibold text-foreground mb-2">
                  {element.title}
                </span>

                {["short-text", "long-text"].includes(element.type) && (
                  <textarea
                    value={(responses[element.name] as string | undefined) || ""}
                    onChange={(e) =>
                      handleResponseChange(element.name, e.target.value)
                    }
                    placeholder="Enter your answer..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={element.type === "long-text" ? 4 : 2}
                  />
                )}

                {element.type === "choice" && element.choices && (
                  <div className="space-y-2">
                    {element.choices.map((choice) => (
                      <label
                        key={choice}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={element.name}
                          value={choice}
                          checked={responses[element.name] === choice}
                          onChange={(e) =>
                            handleResponseChange(element.name, e.target.value)
                          }
                          className="w-4 h-4"
                        />
                        <span>{choice}</span>
                      </label>
                    ))}
                  </div>
                )}

                {element.type === "dropdown" && element.choices && (
                  <select
                    value={(responses[element.name] as string | undefined) || ""}
                    onChange={(e) =>
                      handleResponseChange(element.name, e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select an option --</option>
                    {element.choices.map((choice) => (
                      <option key={choice} value={choice}>
                        {choice}
                      </option>
                    ))}
                  </select>
                )}

                {element.type === "rating" && (
                  <div className="flex gap-2">
                    {[...Array(element.maxRateDescription || 5)].map((_, i) => (
                      <button
                        key={i + 1}
                        type="button"
                        onClick={() =>
                          handleResponseChange(element.name, i + 1)
                        }
                        className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                          responses[element.name] === i + 1
                            ? "bg-yellow-400 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}

                {element.type === "linear" && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{element.minRateLabel || "Low"}</span>
                      <span>{element.maxRateLabel || "High"}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={(responses[element.name] as string | number | undefined) || "3"}
                      onChange={(e) =>
                        handleResponseChange(
                          element.name,
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full"
                    />
                    <div className="text-center text-sm font-medium">
                      {(responses[element.name] as number | undefined) ?? 3}
                    </div>
                  </div>
                )}

                {element.type === "matrix" &&
                  element.rows &&
                  element.columns && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="p-2 text-left font-medium"></th>
                            {element.columns.map((col) => (
                              <th key={col} className="p-2 text-center text-sm">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {element.rows.map((row) => (
                            <tr key={row} className="border-t">
                              <td className="p-2 font-medium">{row}</td>
                              {element.columns!.map((col) => (
                                <td
                                  key={`${row}-${col}`}
                                  className="p-2 text-center"
                                >
                                  <input
                                    type="radio"
                                    name={`${element.name}-${row}`}
                                    value={col}
                                    checked={
                                      (responses[element.name] as Record<string, string> | undefined)?.[row] === col
                                    }
                                    onChange={() => {
                                      const currentMatrix =
                                        (responses[element.name] as Record<string, string> | undefined) || {};
                                      handleResponseChange(element.name, {
                                        ...currentMatrix,
                                        [row]: col,
                                      });
                                    }}
                                    className="w-4 h-4"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                {element.type === "yes-no" && (
                  <div className="flex gap-4">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={element.name}
                          value={option}
                          checked={responses[element.name] === option}
                          onChange={(e) =>
                            handleResponseChange(element.name, e.target.value)
                          }
                          className="w-4 h-4"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </label>
            </Card>
          )),
        )}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting && <Loader2 className="animate-spin mr-2" size={18} />}
        {submitting ? "Submitting..." : "Submit Survey"}
      </Button>
    </form>
  );
}
