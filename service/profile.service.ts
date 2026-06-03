import { apiGet, apiPut } from "@/libs/api";
import { UpdateProfileRequest, UpdateProfileResponse } from "@/types/profile-edit-type";
import { UserProfileResponse } from "@/types/profile-types";

export interface UpdateIdentityRequest {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  phoneNumber: string;
}

export const profileService = {
  getProfileMe: async (token: string): Promise<UserProfileResponse> => {
    return await apiGet<UserProfileResponse>(
      "/profile/me", 
      { authToken: token }
    );
  },
  updateProfileMe: async (payload: UpdateProfileRequest, token: string): Promise<UpdateProfileResponse> => {
    return await apiPut<UpdateProfileResponse>(
      "/profile/me",
      payload,
      { authToken: token }
    );
  },
  getIdentityMe: async (token: string): Promise<any> => {
    return await apiGet<any>(
      "/auths/me",
      { authToken: token }
    );
  },
  updateIdentityMe: async (payload: UpdateIdentityRequest, token: string): Promise<any> => {
    return await apiPut<any>(
      "/auths/me",
      payload,
      { authToken: token }
    );
  }
};