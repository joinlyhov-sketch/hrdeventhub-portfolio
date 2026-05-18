"use client";

import { useState } from "react";
import { Code, LockKeyhole, Link2, UserCircle, Bell } from "lucide-react";
import ProfilePrivacy from "../../../../components/site/profile/privacy-profiles/Profile-privacy";
import SettingVisibilityModeCard from "../../../../components/site/profile/privacy-profiles/SettingVisibilityModeCard";

interface SelectiveVisibility {
  profile: boolean;
  contactInfo: boolean;
  education: boolean;
  socialAccounts: boolean;
}

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  time: string;
  icon: React.ComponentType<any>;
  isVisible: boolean;
}

const initialActivities: ActivityItem[] = [
  {
    id: 1,
    type: "skills",
    title: "Updated Full Stack Web Development Skills",
    time: "1 hour ago",
    icon: Code,
    isVisible: true,
  },
  {
    id: 2,
    type: "password",
    title: "Password Changed",
    time: "3 hours ago",
    icon: LockKeyhole,
    isVisible: true,
  },
  {
    id: 3,
    type: "social",
    title: "Social Account Linked",
    time: "2 days ago",
    icon: Link2,
    isVisible: true,
  },
  {
    id: 4,
    type: "picture",
    title: "Profiles Picture Updated",
    time: "1 week ago",
    icon: UserCircle,
    isVisible: true,
  },
  {
    id: 5,
    type: "notification",
    title: "Notification settings updated",
    time: "1 week ago",
    icon: Bell,
    isVisible: true,
  },
];

export default function Page() {
  const [visibilityMode, setVisibilityMode] = useState<"share_all" | "private" | "selective">("share_all");
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);

  const [selectiveConfig, setSelectiveConfig] = useState<SelectiveVisibility>({
    profile: true,
    contactInfo: false,
    education: false,
    socialAccounts: true,
  });

  return (
    <main className="flex-1 w-full py-6 overflow-x-hidden text-slate-800">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-amber-500 flex items-center gap-2">
          Privacy Setting
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Control who can see your profile information and manage your privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full items-start">
        <ProfilePrivacy 
          visibilityMode={visibilityMode} 
          selectiveConfig={selectiveConfig} 
        />
        <SettingVisibilityModeCard 
          visibilityMode={visibilityMode}
          setVisibilityMode={setVisibilityMode}
          activities={activities}
          setActivities={setActivities}
          selectiveConfig={selectiveConfig}
          setSelectiveConfig={setSelectiveConfig}
        />
      </div>
    </main>
  );
}