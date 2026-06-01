"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, AlertCircle } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { SurveySubmission } from "../../../types/survey";
import { surveyService } from "../../../service/survey.service";

interface SurveyResponsesViewProps {
  surveyId: string;
}

export default function SurveyResponsesView({ surveyId }: SurveyResponsesViewProps) {
  const [responses, setResponses] = useState<SurveySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responseCount, setResponseCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [data, count] = await Promise.all([
          surveyService.getResponses(surveyId, currentPage, pageSize),
          surveyService.countResponses(surveyId),
        ]);
        setResponses(data);
        setResponseCount(count);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch responses";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [surveyId, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin mr-2" />
        Loading responses...
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50 flex gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0" />
        <p className="text-red-700">{error}</p>
      </Card>
    );
  }

  const totalPages = Math.ceil(responseCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Total Responses</p>
          <p className="text-3xl font-bold text-blue-600">{responseCount}</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Current Page</p>
          <p className="text-3xl font-bold text-blue-600">
            {currentPage} of {totalPages || 1}
          </p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Showing</p>
          <p className="text-3xl font-bold text-blue-600">
            {Math.min(pageSize, responses.length)}
          </p>
        </Card>
      </div>

      {responses.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No responses yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {responses.map((response) => (
            <Card key={response.responseId} className="p-6">
              <div className="mb-4 flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-mono text-sm break-all">{response.appUserId}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(response.submittedAt), "MMM dd, yyyy HH:mm")}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                  {JSON.stringify(response.content, null, 2)}
                </pre>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
