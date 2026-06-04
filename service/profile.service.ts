import { apiGet, apiPut } from "@/libs/api";
import { UpdateProfileRequest, UpdateProfileResponse } from "@/types/profile-edit-type";
import type { UserProfileResponse, SharingMode } from "@/types/profile-types";

export interface UpdateIdentityRequest {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  phoneNumber: string;
}

export interface UpdateSharingModeRequest {
  mode: SharingMode;
}

export interface UpdatePreferencesRequest {
  showBirthdate: boolean;
  showEmail: boolean;
  showSocial: boolean;
  showPhoneNumber: boolean;
  showCurrentStatus: boolean;
}

export const profileService = {
  getProfileMe: async (token: string): Promise<UserProfileResponse> => {
    return await apiGet<UserProfileResponse>("/profile/me", { authToken: token });
  },

  updateProfileMe: async (
    payload: UpdateProfileRequest,
    token: string
  ): Promise<UpdateProfileResponse> => {
    return await apiPut<UpdateProfileResponse>("/profile/me", payload, {
      authToken: token,
    });
  },

  getIdentityMe: async (token: string): Promise<any> => {
    return await apiGet<any>("/auths/me", { authToken: token });
  },

  updateIdentityMe: async (
    payload: UpdateIdentityRequest,
    token: string
  ): Promise<any> => {
    return await apiPut<any>("/auths/me", payload, { authToken: token });
  },

  updateSharingMode: async (
    payload: UpdateSharingModeRequest,
    token: string
  ): Promise<any> => {
    return await apiPut<any>("/profile/me/sharing-mode", payload, {
      authToken: token,
    });
  },

  updatePreferences: async (
    payload: UpdatePreferencesRequest,
    token: string
  ): Promise<any> => {
    return await apiPut<any>("/profile/me/preferences", payload, {
      authToken: token,
    });
  },
};