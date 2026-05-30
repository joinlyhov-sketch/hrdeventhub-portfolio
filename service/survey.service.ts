import { env } from "../libs/env";
import {
  Survey,
  SurveyRequest,
  SurveyResponseRequest,
  SurveySubmission,
  ApiResponse,
} from "../types/survey";
import { getSession } from "next-auth/react";

const apiBaseUrl = env?.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("API base URL is not configured.");
}

const handleResponseError = async (
  res: Response,
  defaultMessage: string
): Promise<never> => {
  let errorMessage = defaultMessage;

  try {
    const bodyText = await res.text();
    if (bodyText) {
      try {
        const errorJson = JSON.parse(bodyText) as {
          detail?: string;
          message?: string;
          payload?: any; // Adjusted for payload architecture
        };
        errorMessage =
          errorJson?.detail || errorJson?.message || defaultMessage;
      } catch {
        errorMessage = bodyText;
      }
    }
  } catch {}

  throw new Error(errorMessage);
};

const getAuthHeaders = async () => {
  const session = await getSession();
  const token = session?.user?.token || session?.accessToken;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const surveyService = {
  // Create a new survey
  createSurvey: async (data: SurveyRequest): Promise<Survey> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiBaseUrl}/survey`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) await handleResponseError(res, "Failed to create survey.");
    const response = (await res.json()) as any;
    return response.payload!; // Fixed mapping
  },

  // Get all surveys with pagination
  getAllSurveys: async (page: number = 1, size: number = 10): Promise<Survey[]> => {
    const headers = await getAuthHeaders();
    const url = new URL(`${apiBaseUrl}/survey`);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("size", size.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
    });
    if (!res.ok) await handleResponseError(res, "Failed to fetch surveys.");
    const response = (await res.json()) as any;
    return response.payload || []; // Fixed mapping
  },

  // Get survey by ID
  getSurveyById: async (surveyId: string): Promise<Survey> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiBaseUrl}/survey/${surveyId}`, {
      method: "GET",
      headers,
    });
    if (!res.ok) await handleResponseError(res, "Failed to fetch survey.");
    const response = (await res.json()) as any;
    return response.payload!; // Fixed mapping
  },

  // Get surveys by workspace
  getSurveysByWorkspace: async (
    workspaceId: string,
    page: number = 1,
    size: number = 10
  ): Promise<Survey[]> => {
    const headers = await getAuthHeaders();
    const url = new URL(
      `${apiBaseUrl}/survey/workspace/${workspaceId}`
    );
    url.searchParams.set("page", page.toString());
    url.searchParams.set("size", size.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
    });
    if (!res.ok)
      await handleResponseError(res, "Failed to fetch workspace surveys.");
    const response = (await res.json()) as any;
    return response.payload || []; // Fixed mapping
  },

  // Update survey
  updateSurvey: async (
    surveyId: string,
    data: Partial<SurveyRequest>
  ): Promise<Survey> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiBaseUrl}/survey/${surveyId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) await handleResponseError(res, "Failed to update survey.");
    const response = (await res.json()) as any;
    return response.payload!; // Fixed mapping
  },

  // Delete survey
  deleteSurvey: async (surveyId: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiBaseUrl}/survey/${surveyId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) await handleResponseError(res, "Failed to delete survey.");
  },

  // Submit survey response
  submitSurveyResponse: async (
    surveyId: string,
    data: SurveyResponseRequest
  ): Promise<SurveySubmission> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiBaseUrl}/survey/${surveyId}/submit`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok)
      await handleResponseError(res, "Failed to submit survey response.");
    const response = (await res.json()) as any;
    return response.payload!; // Fixed mapping
  },

  // Get all responses for a survey
  getResponses: async (
    surveyId: string,
    page: number = 1,
    size: number = 10
  ): Promise<SurveySubmission[]> => {
    const headers = await getAuthHeaders();
    const url = new URL(
      `${apiBaseUrl}/survey/${surveyId}/responses`
    );
    url.searchParams.set("page", page.toString());
    url.searchParams.set("size", size.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
    });
    if (!res.ok)
      await handleResponseError(res, "Failed to fetch survey responses.");
    const response = (await res.json()) as any;
    return response.payload || []; // Fixed mapping
  },

  // Count responses for a survey
  countResponses: async (surveyId: string): Promise<number> => {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${apiBaseUrl}/survey/${surveyId}/responses/count`,
      {
        method: "GET",
        headers,
      }
    );
    if (!res.ok)
      await handleResponseError(res, "Failed to count survey responses.");
    const response = (await res.json()) as any;
    return response.payload || 0; // Fixed mapping
  },

  // Get my response for a survey
  getMyResponse: async (surveyId: string): Promise<SurveySubmission | null> => {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${apiBaseUrl}/survey/${surveyId}/responses/me`,
      {
        method: "GET",
        headers,
      }
    );
    if (res.status === 404) return null;
    if (!res.ok)
      await handleResponseError(res, "Failed to fetch your response.");
    const response = (await res.json()) as any;
    return response.payload || null; // Fixed mapping
  },

  // Get response by ID
  getResponseById: async (
    surveyId: string,
    responseId: string
  ): Promise<SurveySubmission> => {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${apiBaseUrl}/survey/${surveyId}/responses/${responseId}`,
      {
        method: "GET",
        headers,
      }
    );
    if (!res.ok)
      await handleResponseError(res, "Failed to fetch response.");
    const response = (await res.json()) as any;
    return response.payload!; // Fixed mapping
  },

  // Check if user has submitted
  hasSubmitted: async (surveyId: string): Promise<boolean> => {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${apiBaseUrl}/survey/${surveyId}/submitted`,
      {
        method: "GET",
        headers,
      }
    );
    if (!res.ok) await handleResponseError(res, "Failed to check submission.");
    const response = (await res.json()) as any;
    return response.payload || false; // Fixed mapping
  },
};