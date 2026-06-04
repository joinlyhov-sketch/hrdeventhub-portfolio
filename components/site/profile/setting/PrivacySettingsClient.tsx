"use client";

import { useState } from "react";
import { UserProfilePayload , SharingMode} from "@/types/profile-types";
import ProfilePrivacy from "@/components/site/profile/setting/Profile-privacy";
import SettingVisibilityModeCard from "@/components/site/profile/setting/SettingVisibilityModeCard";

interface Props {
  profile: UserProfilePayload;
}

function deriveSelectiveConfig(profile: UserProfilePayload): SelectiveVisibility {
  const prefs = profile.preferences?.[0];
  if (!prefs) {
    return { profile: true, contactInfo: true, education: true, socialAccounts: true };
  }
  return {

    profile: prefs.showBirthdate,

    contactInfo: prefs.showEmail && prefs.showPhoneNumber,
    education: prefs.showCurrentStatus,
    socialAccounts: prefs.showSocial,
  };
}


/** Map API SharingMode to UI visibility mode */
function apiModeToUiMode(mode: SharingMode): VisibilityMode {
  if (mode === "PUBLIC") return "share_all";
  if (mode === "PRIVATE") return "private";
  return "selective";
}

export type VisibilityMode = "share_all" | "private" | "selective";

export interface SelectiveVisibility {
  profile: boolean;
  contactInfo: boolean;
  education: boolean;
  socialAccounts: boolean;
}

export default function PrivacySettingsClient({ profile }: Props) {
  const [visibilityMode, setVisibilityMode] = useState<VisibilityMode>(
    apiModeToUiMode(profile.profileSharingMode)
  );
  const [selectiveConfig, setSelectiveConfig] = useState<SelectiveVisibility>(
    deriveSelectiveConfig(profile)
  );

  return (
    <div className="max-w-420 m-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start lg:pr-12 lg:pl-12">
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