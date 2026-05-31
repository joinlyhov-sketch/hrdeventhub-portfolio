export interface Generation {
  generationId: string;
  name: string;
  year: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Generation[];
  timestamp: string;
}
