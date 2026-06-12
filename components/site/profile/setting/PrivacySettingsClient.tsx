"use client";

import { useState } from "react";
import { UserProfilePayload, SharingMode } from "@/service/profile.service";
import ProfilePrivacy from "@/components/site/profile/setting/Profile-privacy";
import SettingVisibilityModeCard from "@/components/site/profile/setting/SettingVisibilityModeCard";

interface Props {
  profile: UserProfilePayload;
}

export type VisibilityMode = "share_all" | "private" | "selective";

export interface SelectiveVisibility {
  showProfilePicture: boolean;
  showBio: boolean;
  showGender: boolean;
  showBirthdate: boolean;
  showGeneration: boolean;
  showEmail: boolean;
  showPhoneNumber: boolean;
  showMajor: boolean;
  showCurrentStatus: boolean;
  showCv: boolean;
  showEducation: boolean;
  showSkills: boolean;
  showSocial: boolean;
}

export const ALL_VISIBLE: SelectiveVisibility = {
  showProfilePicture: true,
  showBio: true,
  showGender: true,
  showBirthdate: true,
  showGeneration: true,
  showEmail: true,
  showPhoneNumber: true,
  showMajor: true,
  showCurrentStatus: true,
  showCv: true,
  showEducation: true,
  showSkills: true,
  showSocial: true,
};

export const ALL_HIDDEN: SelectiveVisibility = {
  showProfilePicture: false,
  showBio: false,
  showGender: false,
  showBirthdate: false,
  showGeneration: false,
  showEmail: false,
  showPhoneNumber: false,
  showMajor: false,
  showCurrentStatus: false,
  showCv: false,
  showEducation: false,
  showSkills: false,
  showSocial: false,
};

function apiModeToUiMode(mode: SharingMode): VisibilityMode {
  if (mode === "PUBLIC") return "share_all";
  if (mode === "PRIVATE") return "private";
  return "selective";
}

function deriveSelectiveConfig(profile: UserProfilePayload): SelectiveVisibility {
  const prefs = profile.preferences?.[0];
  if (!prefs) return { ...ALL_VISIBLE };
  return {
    showProfilePicture: prefs.showProfilePicture ?? true,
    showBio: prefs.showBio ?? true,
    showGender: prefs.showGender ?? true,
    showBirthdate: prefs.showBirthdate ?? true,
    showGeneration: prefs.showGeneration ?? true,
    showEmail: prefs.showEmail ?? true,
    showPhoneNumber: prefs.showPhoneNumber ?? true,
    showMajor: prefs.showMajor ?? true,
    showCurrentStatus: prefs.showCurrentStatus ?? true,
    showCv: prefs.showCv ?? true,
    showEducation: prefs.showEducation ?? true,
    showSkills: prefs.showSkills ?? true,
    showSocial: prefs.showSocial ?? true,
  };
}

export default function PrivacySettingsClient({ profile }: Props) {
  const [visibilityMode, setVisibilityMode] = useState<VisibilityMode>(
    apiModeToUiMode(profile.profileSharingMode)
  );
  const [selectiveConfig, setSelectiveConfig] = useState<SelectiveVisibility>(
    deriveSelectiveConfig(profile)
  );

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-8 items-start lg:pr-12 lg:pl-12">
      <div className="xl:col-span-4">
        <ProfilePrivacy
          profile={profile}
          visibilityMode={visibilityMode}
          selectiveConfig={selectiveConfig}
        />
      </div>
      <SettingVisibilityModeCard
        profile={profile}
        visibilityMode={visibilityMode}
        setVisibilityMode={setVisibilityMode}
        selectiveConfig={selectiveConfig}
        setSelectiveConfig={setSelectiveConfig}
      />
    </div>
  );
}