import { apiGet, apiPut } from "@/libs/api";
import { UpdateProfileRequest, UpdateProfileResponse } from "@/types/profile-edit-type";

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
  endYear: any;
  institutionName: string;
  institutionAbbreviation: string;
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
  preferences?: ProfilePreferences[];
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
    return await apiGet<UserProfileResponse>("/profile/me", { authToken: token });
  },

  updateProfileMe: async (
    payload: UpdateProfileRequest,
    token: string
  ): Promise<UpdateProfileResponse> => {
    return await apiPut<UpdateProfileResponse>("/profile/me", payload, { authToken: token });
  },

  getIdentityMe: async (token: string): Promise<any> => {
    return await apiGet<any>("/auths/me", { authToken: token });
  },

  updateIdentityMe: async (payload: UpdateIdentityRequest, token: string): Promise<any> => {
    return await apiPut<any>("/auths/me", payload, { authToken: token });
  },

  updateSharingMode: async (payload: UpdateSharingModeRequest, token: string): Promise<any> => {
    return await apiPut<any>("/profile/me/sharing-mode", payload, { authToken: token });
  },

  updatePreferences: async (payload: UpdatePreferencesRequest, token: string): Promise<any> => {
    return await apiPut<any>("/profile/me/preferences", payload, { authToken: token });
  },
  getProfileById: async (id: string, token: string): Promise<UserProfileResponse> => {
return await apiGet<UserProfileResponse>(`/profile/${id}`, { authToken: token });
},
};