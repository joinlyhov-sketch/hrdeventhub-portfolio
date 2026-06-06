import { apiPost, apiGet, apiDelete } from "@/libs/api";
import { 
  CreateEndorsementPayload, 
  BaseEndorsementResponse, 
  FetchEndorsementsResponse,
  EndorsementPayload
} from "@/types/endorsement";

export const endorsementService = {
  create: async (
    payload: CreateEndorsementPayload,
    authToken: string
  ): Promise<BaseEndorsementResponse> => {
    return apiPost<BaseEndorsementResponse, CreateEndorsementPayload>(
      "/endorsements",
      payload,
      { authToken }
    );
  },

  getByStudentId: async (
    studentId: string,
    authToken: string
  ): Promise<EndorsementPayload[]> => {
    const response = await apiGet<FetchEndorsementsResponse>(
      `/endorsements/student/${studentId}`,
      { authToken }
    );
    return response.payload;
  },
  
  delete: async (
    endorsementId: string,
    authToken: string
  ): Promise<BaseEndorsementResponse> => {
    return apiDelete<BaseEndorsementResponse>(
      `/endorsements/${endorsementId}`,
      { authToken }
    );
  }
};