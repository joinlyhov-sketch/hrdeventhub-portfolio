export interface SurveyPage {
  name: string;
  title: string;
  elements: SurveyElement[];
}

export interface SurveyElement {
  name: string;
  type: string;
  title: string;
  choices?: string[];
  rows?: string[];
  columns?: string[];
  minRateDescription?: number;
  maxRateDescription?: number;
  minRateLabel?: string;
  maxRateLabel?: string;
}

export interface SurveyContent {
  title: string;
  pages: SurveyPage[];
}

export interface Survey {
  surveyId: string;
  title: string;
  description?: string;
  content: SurveyContent;
  isActive: boolean;
  closingTime: string;
  createdAt?: string;
  appUserId: string;
  workspaceId: string;
}

export interface SurveyRequest {
  title: string;
  description?: string;
  content: SurveyContent;
  isActive: boolean;
  closingTime: string;
  workspaceId: string;
}

export interface SurveyResponse {
  surveyId: string;
  title: string;
  description?: string;
  content: SurveyContent;
  isActive: boolean;
  closingTime: string;
  createdAt?: string;
  appUserId: string;
  workspaceId: string;
}

export interface SurveyResponseRequest {
  content: Record<string, any>;
}

export interface SurveySubmission {
  responseId: string;
  surveyId: string;
  appUserId: string;
  content: Record<string, any>;
  submittedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  payload?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination?: {
    page: number;
    size: number;
    total: number;
  };
}

export interface Workspace {
  workspaceId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  generationName?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  telegramChannelUrl?: string;
}
