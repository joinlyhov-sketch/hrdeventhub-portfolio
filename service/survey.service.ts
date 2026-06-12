import { apiGet, apiPost, apiPatch, apiDelete } from "@/libs/api";
import { getSession } from "next-auth/react";
import {
  Survey,
  SurveyRequest,
  SurveyResponseRequest,
  SurveySubmission,
} from "../types/survey";

import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

const getLiveToken = async (): Promise<string | undefined> => {
  
  if (typeof window === "undefined") {
    const session = await getServerSession(authOptions);
    return session?.accessToken || (session?.user as any)?.token;
  }

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

  createSurvey: async (data: SurveyRequest): Promise<Survey> => {
    const token = await getLiveToken();
    const response = await apiPost<BackendApiResponse<Survey>, SurveyRequest>(
      "/survey",
      data,
      { authToken: token }
    );
    return response.payload;
  },

  getAllSurveys: async (page: number = 1, size: number = 10): Promise<Survey[]> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<Survey[]>>(
      `/survey?page=${page}&size=${size}`,
      { authToken: token }
    );
    return response.payload || [];
  },

  getSurveyById: async (surveyId: string): Promise<Survey> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<Survey>>(
      `/survey/${surveyId}`,
      { authToken: token }
    );
    return response.payload;
  },

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

  updateSurvey: async (surveyId: string, data: Partial<SurveyRequest>): Promise<Survey> => {
    const token = await getLiveToken();
    const response = await apiPatch<BackendApiResponse<Survey>, Partial<SurveyRequest>>(
      `/survey/${surveyId}`,
      data,
      { authToken: token }
    );
    return response.payload;
  },

  deleteSurvey: async (surveyId: string): Promise<void> => {
    const token = await getLiveToken();
    await apiDelete<any>(`/survey/${surveyId}`, { authToken: token });
  },

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

  countResponses: async (surveyId: string): Promise<number> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<number>>(
      `/survey/${surveyId}/responses/count`,
      { authToken: token }
    );
    return response.payload || 0;
  },

  getMyResponse: async (surveyId: string): Promise<SurveySubmission | null> => {
    const token = await getLiveToken();
    try {
      const response = await apiGet<BackendApiResponse<SurveySubmission>>(
        `/survey/${surveyId}/responses/me`,
        { authToken: token }
      );
      return response.payload || null;
    } catch (error: any) {
      if (error.status === 404 || error.message?.includes("404")) return null;
      throw error;
    }
  },

  getResponseById: async (surveyId: string, responseId: string): Promise<SurveySubmission> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<SurveySubmission>>(
      `/survey/${surveyId}/responses/${responseId}`,
      { authToken: token }
    );
    return response.payload;
  },

  hasSubmitted: async (surveyId: string): Promise<boolean> => {
    const token = await getLiveToken();
    const response = await apiGet<BackendApiResponse<boolean>>(
      `/survey/${surveyId}/submitted`,
      { authToken: token }
    );
    return response.payload || false;
  },
};