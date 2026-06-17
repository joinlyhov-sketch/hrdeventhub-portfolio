export interface UpdateEducationRequest {
  institutionName: string;
  institutionAbbreviation: string;
  degree: string;
  startYear: number;
  endYear: number | null;
  isCurrent: boolean;
}

export interface UpdateSocialAccountRequest {
  platform: string;
  url: string;
}

export interface UpdateProfileRequest {
  bio: string;
  profilePicture: string | null;
  major: string;
  currentStatus: string;
  cvResumeUrl: string | null;
  socialAccount: UpdateSocialAccountRequest[];
  education: UpdateEducationRequest[];
  skills: string[];
  profileSharingMode: "PUBLIC" | "PRIVATE";
  preferences: unknown | null;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  status: string;
  payload: unknown;
  timestamp: string;
}