"use client";

import { create } from "zustand";
import { Survey, SurveySubmission } from "../types/survey";

interface SurveyListState {
  surveys: Survey[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;

  // Actions
  setSurveys: (surveys: Survey[]) => void;
  addSurvey: (survey: Survey) => void;
  removeSurvey: (surveyId: string) => void;
  updateSurvey: (surveyId: string, survey: Survey) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
}

export const useSurveyListStore = create<SurveyListState>((set) => ({
  surveys: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,

  setSurveys: (surveys: Survey[]) => set({ surveys }),
  addSurvey: (survey: Survey) =>
    set((state) => ({
      surveys: [survey, ...state.surveys],
    })),
  removeSurvey: (surveyId: string) =>
    set((state) => ({
      surveys: state.surveys.filter((s) => s.surveyId !== surveyId),
    })),
  updateSurvey: (surveyId: string, survey: Survey) =>
    set((state) => ({
      surveys: state.surveys.map((s) =>
        s.surveyId === surveyId ? survey : s
      ),
    })),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setPageSize: (size: number) => set({ pageSize: size }),
  reset: () =>
    set({
      surveys: [],
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 10,
    }),
}));

interface SurveyResponseState {
  submissions: SurveySubmission[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;

  // Actions
  setSubmissions: (submissions: SurveySubmission[]) => void;
  addSubmission: (submission: SurveySubmission) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
}

export const useSurveyResponseStore = create<SurveyResponseState>((set) => ({
  submissions: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,

  setSubmissions: (submissions: SurveySubmission[]) => set({ submissions }),
  addSubmission: (submission: SurveySubmission) =>
    set((state) => ({
      submissions: [submission, ...state.submissions],
    })),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setPageSize: (size: number) => set({ pageSize: size }),
  reset: () =>
    set({
      submissions: [],
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 10,
    }),
}));
