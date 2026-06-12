"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Trash2, Eye, BarChart3 } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Survey } from "../../../types/survey";
import { surveyService } from "../../../service/survey.service";
import { useSurveyListStore } from "../../../store/useSurveyStore";

import { deleteSurveyAction } from "@/actions/survey.action";
import SurveyListSkeleton from "./SurveyListSkeleton";

interface SurveyListProps {
  workspaceId?: string;
  showActions?: boolean;
}

export default function SurveyList({ workspaceId, showActions = true }: SurveyListProps) {
  const { surveys, loading, error, setSurveys, setLoading, setError, removeSurvey } = useSurveyListStore();
  const [responseCount, setResponseCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const data = workspaceId
          ? await surveyService.getSurveysByWorkspace(workspaceId)
          : await surveyService.getAllSurveys();
        setSurveys(data);
        setError(null);

        // Fetch response counts for each survey
        const counts: Record<string, number> = {};
        for (const survey of data) {
          try {
            counts[survey.surveyId] = await surveyService.countResponses(survey.surveyId);
          } catch (err) {
            counts[survey.surveyId] = 0;
          }
        }
        setResponseCount(counts);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch surveys";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [workspaceId, setSurveys, setLoading, setError]);

  const handleDelete = async (surveyId: string) => {
    if (!confirm("Are you sure you want to delete this survey?")) return;

    try {
      await deleteSurveyAction(surveyId, workspaceId);
      removeSurvey(surveyId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete survey");
    }
  };

  if (loading) {
    return <SurveyListSkeleton />;
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <p className="text-red-700">{error}</p>
      </Card>
    );
  }

  if (surveys.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 mb-4">No surveys found</p>
        <Link href="/dashboard/feedback/create">
          <Button className="bg-primary">Create First Survey</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {surveys.map((survey) => (
        <Card
          key={survey.surveyId}
          className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-600"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {survey.title}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    survey.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {survey.isActive ? "Active" : "Closed"}
                </span>
              </div>
              {survey.description && (
                <p className="text-sm text-gray-600 mb-2">{survey.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>Responses: {responseCount[survey.surveyId] || 0}</span>
                <span>
                  Closes: {format(new Date(survey.closingTime), "MMM dd, yyyy HH:mm")}
                </span>
              </div>
            </div>

            {showActions && (
              <div className="flex gap-2 flex-wrap">
                <Link href={`/dashboard/feedback/survey/${survey.surveyId}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye size={16} />
                    View
                  </Button>
                </Link>
                <Link href={`/dashboard/feedback/survey/${survey.surveyId}/responses`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <BarChart3 size={16} />
                    Analytics
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(survey.surveyId)}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
