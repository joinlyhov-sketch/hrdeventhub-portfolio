import { apiDelete, apiGet, apiPatch, apiPut } from "@/libs/api";
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/types/profile-edit-type";

export interface UpdateIdentityRequest {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  phoneNumber: string;
}

export type SharingMode = "PUBLIC" | "PRIVATE" | "SELECTIVE";

export interface UpdateSharingModeRequest {
  mode: SharingMode;
}

export interface UpdatePreferencesRequest {
  showEmail: boolean;
  showPhoneNumber: boolean;
  showBirthdate: boolean;
  showGender: boolean;
  showBio: boolean;
  showProfilePicture: boolean;
  showMajor: boolean;
  showCurrentStatus: boolean;
  showCv: boolean;
  showEducation: boolean;
  showSkills: boolean;
  showSocial: boolean;
  showGeneration: boolean;
}

export interface Education {
  endYear: number | null;
  institutionName: string;
  institutionAbbreviation: string;
  institutionLogo: string;
  degree: string;
  startYear: number;
  isCurrent: boolean;
}

export interface SocialAccount {
  platform: string;
  url: string;
}

export interface Generation {
  generationId: string;
  name: string;
  year: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface University {
  universityId: string;
  name: string;
  abbreviation?: string;
  logoUrl?: string;
  type?: string;
  established?: string;
  location?: string;
  website?: string;
}

export interface UniversitiesResponse {
  success: boolean;
  message: string;
  status: string;
  payload: University[] | {
    content?: University[];
    items?: University[];
  };
  timestamp?: string;
}

export interface AppUser {
  appUserId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  active: boolean;
  verified: boolean;
  telegramSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfilePreferences {
  showEmail: boolean;
  showPhoneNumber: boolean;
  showBirthdate: boolean;
  showGender: boolean;
  showBio: boolean;
  showProfilePicture: boolean;
  showMajor: boolean;
  showCurrentStatus: boolean;
  showCv: boolean;
  showEducation: boolean;
  showSkills: boolean;
  showSocial: boolean;
  showGeneration: boolean;
}

export interface UserProfilePayload {
  profileId: string;
  bio: string;
  profilePicture: string | null;
  major: string;
  cvResumeUrl: string | null;
  profileSharingMode: SharingMode;
  currentStatus: string;
  roles: "ADMIN" | "ORGANIZER" | "STUDENT" | "ALUMNI";
  education: Education[];
  skills: string[];
  socialAccount: SocialAccount[];
  preferences?: ProfilePreferences;
  generation: Generation;
  appUser: AppUser;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  status: string;
  payload: UserProfilePayload;
  timestamp: string;
}

export const profileService = {
  getProfileMe: async (token: string): Promise<UserProfileResponse> => {
    return await apiGet<UserProfileResponse>("/profile/me", {
      authToken: token,
    });
  },

  updateProfileMe: async (
    payload: UpdateProfileRequest,
    token: string,
  ): Promise<UpdateProfileResponse> => {
    return await apiPatch<UpdateProfileResponse>("/profile/me", payload, {
      authToken: token,
    });
  },

  getIdentityMe: async (token: string): Promise<unknown> => {
    return await apiGet<unknown>("/auths/me", { authToken: token });
  },

  updateIdentityMe: async (
    payload: UpdateIdentityRequest,
    token: string,
  ): Promise<unknown> => {
    return await apiPatch<unknown>("/auths/me", payload, { authToken: token });
  },

  updateSharingMode: async (
    payload: UpdateSharingModeRequest,
    token: string,
  ): Promise<unknown> => {
    return await apiPut<unknown>("/profile/me/sharing-mode", payload, {
      authToken: token,
    });
  },
  getUniversities: async (
  token: string,
  page: number = 1,
  size: number = 100,
): Promise<University[]> => {
  const response = await apiGet<UniversitiesResponse>(
    `/universities?page=${page}&size=${size}`,
    {
      authToken: token,
      accept: "*/*",
    },
  );

  if (Array.isArray(response.payload)) {
    return response.payload;
  }

  if (Array.isArray(response.payload?.content)) {
    return response.payload.content;
  }

  if (Array.isArray(response.payload?.items)) {
    return response.payload.items;
  }

  return [];
},

  updatePreferences: async (
    payload: UpdatePreferencesRequest,
    token: string,
  ): Promise<unknown> => {
    return await apiPatch<unknown>("/profile/me/preferences", payload, {
      authToken: token,
    });
  },
  getProfileById: async (
    id: string,
    token: string,
  ): Promise<UserProfileResponse> => {
    return await apiGet<UserProfileResponse>(`/profile/${id}`, {
      authToken: token,
    });
  },
  deleteResume: async (token: string): Promise<unknown> => {
    return await apiDelete<unknown>("/profile/me/cv", {
      authToken: token,
      accept: "*/*",
    });
  },
  disconnectTelegram: async (
  userId: string,
  token: string,
): Promise<unknown> => {
  return await apiDelete<unknown>(
    `/telegram-bot/disconnect/${userId}`,
    {
      authToken: token,
      accept: "*/*",
    },
  );
},
};
