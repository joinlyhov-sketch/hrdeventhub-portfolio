"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  SurveyContent,
  SurveyPage,
  SurveyElement,
} from "../types/survey";

interface SurveyFormState {
  title: string;
  description: string;
  content: SurveyContent;
  isActive: boolean;
  closingTime: string;
  workspaceId: string;
  selectedWorkspaceId: string;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setIsActive: (isActive: boolean) => void;
  setClosingTime: (closingTime: string) => void;
  setWorkspaceId: (workspaceId: string) => void;
  setSelectedWorkspaceId: (workspaceId: string) => void;
  setContent: (content: SurveyContent) => void;
  addPage: (page: SurveyPage) => void;
  removePage: (pageIndex: number) => void;
  addElementToPage: (pageIndex: number, element: SurveyElement) => void;
  removeElementFromPage: (pageIndex: number, elementIndex: number) => void;
  updateElement: (
    pageIndex: number,
    elementIndex: number,
    element: SurveyElement
  ) => void;
  reset: () => void;
}

const defaultContent: SurveyContent = {
  title: "",
  pages: [],
};

export const useSurveyFormStore = create<SurveyFormState>()(
  persist(
    (set) => ({
      title: "",
      description: "",
      content: defaultContent,
      isActive: true,
      closingTime: "",
      workspaceId: "",
      selectedWorkspaceId: "",

      setTitle: (title: string) => set({ title }),
      setDescription: (description: string) => set({ description }),
      setIsActive: (isActive: boolean) => set({ isActive }),
      setClosingTime: (closingTime: string) => set({ closingTime }),
      setWorkspaceId: (workspaceId: string) => set({ workspaceId }),
      setSelectedWorkspaceId: (selectedWorkspaceId: string) =>
        set({ selectedWorkspaceId }),

      setContent: (content: SurveyContent) => set({ content }),

      addPage: (page: SurveyPage) =>
        set((state) => ({
          content: {
            ...state.content,
            pages: [...state.content.pages, page],
          },
        })),

      removePage: (pageIndex: number) =>
        set((state) => ({
          content: {
            ...state.content,
            pages: state.content.pages.filter((_, i) => i !== pageIndex),
          },
        })),

      addElementToPage: (pageIndex: number, element: SurveyElement) =>
        set((state) => {
          const newPages = [...state.content.pages];
          if (newPages[pageIndex]) {
            newPages[pageIndex].elements.push(element);
          }
          return {
            content: {
              ...state.content,
              pages: newPages,
            },
          };
        }),

      removeElementFromPage: (pageIndex: number, elementIndex: number) =>
        set((state) => {
          const newPages = [...state.content.pages];
          if (newPages[pageIndex]) {
            newPages[pageIndex].elements = newPages[pageIndex].elements.filter(
              (_, i) => i !== elementIndex
            );
          }
          return {
            content: {
              ...state.content,
              pages: newPages,
            },
          };
        }),

      updateElement: (
        pageIndex: number,
        elementIndex: number,
        element: SurveyElement
      ) =>
        set((state) => {
          const newPages = [...state.content.pages];
          if (newPages[pageIndex] && newPages[pageIndex].elements[elementIndex]) {
            newPages[pageIndex].elements[elementIndex] = element;
          }
          return {
            content: {
              ...state.content,
              pages: newPages,
            },
          };
        }),

      reset: () =>
        set({
          title: "",
          description: "",
          content: defaultContent,
          isActive: true,
          closingTime: "",
          workspaceId: "",
          selectedWorkspaceId: "",
        }),
    }),
    {
      name: "survey-form-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
