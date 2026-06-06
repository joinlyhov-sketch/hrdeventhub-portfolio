export type SharingMode = "PUBLIC" | "PRIVATE" | "SELECTIVE";

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



export interface ProfilePreferences {
  showBirthdate: boolean;
  showEmail: boolean;
  showSocial: boolean;
  showPhoneNumber: boolean;
  showCurrentStatus: boolean;
}

export interface UserProfilePayload {
  avatar?: string | null;
  profileId: string;
   bio?: string;
  profilePicture: string | null;
  major: string;
  cvResumeUrl: string | null;
  profileSharingMode: SharingMode;
  currentStatus: string;
  roles: "ADMIN" | "ORGANIZER" | "STUDENT" | "ALUMNI";
  education: Education[];
  skills: string[];
  socialAccount?: Array<{ platform: string; url: string }>;
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