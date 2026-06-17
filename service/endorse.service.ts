import { apiPost, apiGet } from "@/libs/api";
import {
  CreateEndorsementPayload,
  BaseEndorsementResponse,
  FetchRegistrationsResponse,
  RegistrationPayloadItem,
  EndorsementItem,
  FetchReceivedEndorsementsResponse,
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

  getAlumniRegistrations: async (
    authToken: string
  ): Promise<RegistrationPayloadItem[]> => {
    const response = await apiGet<FetchRegistrationsResponse>(
      "/posts/participants/me?page=1&size=100",
      { authToken }
    );
    return response.payload ?? [];
  },

  getStudentRegistrations: async (
    studentId: string,
    authToken: string
  ): Promise<RegistrationPayloadItem[]> => {
    const response = await apiGet<FetchRegistrationsResponse>(
      `/posts/participants/user/${studentId}?page=1&size=100`,
      { authToken }
    );
    return response.payload ?? [];
  },

  getMutualRegistrations: async (
    studentId: string,
    authToken: string
  ): Promise<RegistrationPayloadItem[]> => {
    const [alumniRegs, studentRegs] = await Promise.all([
      endorsementService.getAlumniRegistrations(authToken),
      endorsementService.getStudentRegistrations(studentId, authToken),
    ]);

    const studentPostIds = new Set(studentRegs.map((reg) => reg.postId));
    return alumniRegs.filter((reg) => studentPostIds.has(reg.postId));
  },

  getMutualPostIds: async (
    studentId: string,
    authToken: string
  ): Promise<string[]> => {
    const [alumniRegs, studentRegs] = await Promise.all([
      endorsementService.getAlumniRegistrations(authToken),
      endorsementService.getStudentRegistrations(studentId, authToken),
    ]);

    const studentPostIds = new Set(studentRegs.map((reg) => reg.postId));

    return alumniRegs
      .map((reg) => reg.postId)
      .filter((postId) => studentPostIds.has(postId));
  },

  getReceivedEndorsements: async (
    authToken: string
  ): Promise<EndorsementItem[]> => {
    const response = await apiGet<FetchReceivedEndorsementsResponse>(
      "/endorsements/my-received",
      { authToken }
    );
    return response.payload ?? [];
  },

  getStudentEndorsementsAsGuest: async (
    studentId: string,
    authToken: string
  ): Promise<EndorsementItem[]> => {
    const response = await apiGet<FetchReceivedEndorsementsResponse>(
      `/endorsements/student/${studentId}`,
      { authToken }
    );
    return response.payload ?? [];
  },
};