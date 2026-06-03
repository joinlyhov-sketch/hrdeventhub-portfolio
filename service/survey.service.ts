import { apiGet, apiPost, apiPatch, apiDelete } from "@/libs/api";
import { getSession } from "next-auth/react";
import {
  Survey,
  SurveyRequest,
  SurveyResponseRequest,
  SurveySubmission,
} from "../types/survey";

// Dynamic token fetcher for client-side context (using explicit cast to bypass strict check)
const getLiveToken = async (): Promise<string | undefined> => {
  const session = await getSession();
  return session?.accessToken || (session?.user as any)?.token;
};

interface BackendApiResponse<T> {
  success: boolean;
  message: string;
  status: string;
  payload: T;
}

export const surveyService = {
  // Create a new survey
  createSurvey: async (data: SurveyRequest): Promise<Survey> => {
    const token = await getLiveToken();
    const response = await apiPost<BackendApiResponse<Survey>, SurveyRequest>(
      "/survey",
      data,
      { authToken: token }
    );
    return response.payload;
  },

  // Get all surveys with pagination
  getAllSurveys: async (page: number = 1, size: number = 10): Promise<Survey[]> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<Survey[]>>(
      `/survey?page=${page}&size=${size}`,
      { authToken: token }
    );
    return response.payload || [];
  },

  // Get survey by ID
  getSurveyById: async (surveyId: string): Promise<Survey> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<Survey>>(
      `/survey/${surveyId}`,
      { authToken: token }
    );
    return response.payload;
  },

  // Get surveys by workspace
  getSurveysByWorkspace: async (
    workspaceId: string,
    page: number = 1,
    size: number = 10,
  ): Promise<Survey[]> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<Survey[]>>(
      `/survey/workspace/${workspaceId}?page=${page}&size=${size}`,
      { authToken: token }
    );
    return response.payload || [];
  },

  // Update survey
  updateSurvey: async (surveyId: string, data: Partial<SurveyRequest>): Promise<Survey> => {
    const token = await getLiveToken();
    const response = await apiPatch<BackendApiResponse<Survey>, Partial<SurveyRequest>>(
      `/survey/${surveyId}`,
      data,
      { authToken: token }
    );
    return response.payload;
  },

  // Delete survey
  deleteSurvey: async (surveyId: string): Promise<void> => {
    const token = await getLiveToken();
    await apiDelete<any>(`/survey/${surveyId}`, { authToken: token });
  },

  // Submit survey response
  submitSurveyResponse: async (
    surveyId: string,
    data: SurveyResponseRequest,
  ): Promise<SurveySubmission> => {
    const token = await getLiveToken();
    const response = await apiPost<BackendApiResponse<SurveySubmission>, SurveyResponseRequest>(
      `/survey/${surveyId}/submit`,
      data,
      { authToken: token }
    );
    return response.payload;
  },

  // Get all responses for a survey
  getResponses: async (
    surveyId: string,
    page: number = 1,
    size: number = 10,
  ): Promise<SurveySubmission[]> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<SurveySubmission[]>>(
      `/survey/${surveyId}/responses?page=${page}&size=${size}`,
      { authToken: token }
    );
    return response.payload || [];
  },

  // Count responses for a survey
  countResponses: async (surveyId: string): Promise<number> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<number>>(
      `/survey/${surveyId}/responses/count`,
      { authToken: token }
    );
    return response.payload || 0;
  },

  // Get my response for a survey
  getMyResponse: async (surveyId: string): Promise<SurveySubmission | null> => {
    const token = await getLiveToken();
    try {
      const response = await apiGet<BackendApiResponse<SurveySubmission>>(
        `/survey/${surveyId}/responses/me`,
        { authToken: token }
      );
      return response.payload || null;
    } catch (error: any) {
      // Gracefully handle a 404 response if the current user hasn't submitted an entry yet
      if (error.status === 404 || error.message?.includes("404")) return null;
      throw error;
    }
  },

  // Get response by ID
  getResponseById: async (surveyId: string, responseId: string): Promise<SurveySubmission> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<SurveySubmission>>(
      `/survey/${surveyId}/responses/${responseId}`,
      { authToken: token }
    );
    return response.payload;
  },

  // Check if user has submitted
  hasSubmitted: async (surveyId: string): Promise<boolean> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<boolean>>(
      `/survey/${surveyId}/submitted`,
      { authToken: token }
    );
    return response.payload || false;
  },
};
