"use client";

import { useState } from "react";
import ProfilePrivacy from "../../../../components/site/profile/setting/Profile-privacy";
import SettingVisibilityModeCard from "../../../../components/site/profile/setting/SettingVisibilityModeCard";
import HeaderNoProfile from "../../../../components/dashboard/header/HeaderNoProfile";

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
  icon: React.ReactNode;
  isVisible: boolean;
}

const initialActivities: ActivityItem[] = [
  {
    id: 1,
    type: "skills",
    title: "Updated Full Stack Web Development Skills",
    time: "1 hour ago",
    icon: (
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="44" height="44" rx="22" fill="#1C4D8D" fillOpacity="0.2" />
        <rect x="10" y="10" width="24" height="24" />
        <path
          d="M28 26L32 22L28 18M16 18L12 22L16 26M24.5 14L19.5 30"
          stroke="#1C4D8D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    isVisible: true,
  },
  {
    id: 2,
    type: "password",
    title: "Password Changed",
    time: "3 hours ago",
    icon: (
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="44" height="44" rx="22" fill="#FF9F2E" fillOpacity="0.2" />
        <path
          d="M17 21V17C17 15.6739 17.5268 14.4021 18.4645 13.4645C19.4021 12.5268 20.6739 12 22 12C23.3261 12 24.5979 12.5268 25.5355 13.4645C26.4732 14.4021 27 15.6739 27 17V21M15 21H29C30.1046 21 31 21.8954 31 23V30C31 31.1046 30.1046 32 29 32H15C13.8954 32 13 31.1046 13 30V23C13 21.8954 13.8954 21 15 21Z"
          stroke="#FF9F2E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    isVisible: true,
  },
  {
    id: 3,
    type: "social",
    title: "Social Account Linked",
    time: "2 days ago",
    icon: (
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="44" height="44" rx="22" fill="#3BC1A8" fillOpacity="0.2" />
        <rect x="10" y="10" width="24" height="24" />
        <path
          d="M23.0598 20.9375C25.3098 23.1875 25.3098 26.8275 23.0598 29.0675C20.8098 31.3075 17.1698 31.3175 14.9298 29.0675C12.6898 26.8175 12.6798 23.1775 14.9298 20.9375"
          stroke="#3BC1A8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.5909 23.4128C18.2509 21.0728 18.2509 17.2728 20.5909 14.9228C22.9309 12.5728 26.7309 12.5828 29.0809 14.9228C31.4309 17.2628 31.4209 21.0628 29.0809 23.4128"
          stroke="#3BC1A8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    isVisible: true,
  },
  {
    id: 4,
    type: "picture",
    title: "Profiles Picture Updated",
    time: "1 week ago",
    icon: (
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="44" height="44" rx="22" fill="#D1D1D1" fillOpacity="0.7" />
        <path
          d="M22 22C24.7614 22 27 19.7614 27 17C27 14.2386 24.7614 12 22 12C19.2386 12 17 14.2386 17 17C17 19.7614 19.2386 22 22 22Z"
          stroke="#9B9B9B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30.5901 32C30.5901 28.13 26.7402 25 22.0002 25C17.2602 25 13.4102 28.13 13.4102 32"
          stroke="#9B9B9B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    isVisible: true,
  },
  {
    id: 5,
    type: "notification",
    title: "Notification settings updated",
    time: "1 week ago",
    icon: (
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="44" height="44" rx="22" fill="#1C4D8D" fillOpacity="0.2" />
        <path
          d="M22.0186 12.9062C18.7086 12.9062 16.0186 15.5963 16.0186 18.9062V21.7963C16.0186 22.4063 15.7586 23.3362 15.4486 23.8562L14.2986 25.7663C13.5886 26.9463 14.0786 28.2563 15.3786 28.6963C19.6886 30.1363 24.3386 30.1363 28.6486 28.6963C29.8586 28.2963 30.3886 26.8663 29.7286 25.7663L28.5786 23.8562C28.2786 23.3362 28.0186 22.4063 28.0186 21.7963V18.9062C28.0186 15.6063 25.3186 12.9062 22.0186 12.9062Z"
          stroke="#1C4D8D"
          strokeOpacity="0.7"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
        <path
          d="M23.8719 13.1975C23.5619 13.1075 23.2419 13.0375 22.9119 12.9975C21.9519 12.8775 21.0319 12.9475 20.1719 13.1975C20.4619 12.4575 21.1819 11.9375 22.0219 11.9375C22.8619 11.9375 23.5819 12.4575 23.8719 13.1975Z"
          stroke="#1C4D8D"
          strokeOpacity="0.6"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.0195 29.0625C25.0195 30.7125 23.6695 32.0625 22.0195 32.0625C21.1995 32.0625 20.4395 31.7225 19.8995 31.1825C19.3595 30.6425 19.0195 29.8825 19.0195 29.0625"
          stroke="#1C4D8D"
          strokeOpacity="0.6"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
      </svg>
    ),
    isVisible: true,
  },
];

export default function Page() {
  const [visibilityMode, setVisibilityMode] = useState<
    "share_all" | "private" | "selective"
  >("share_all");
  const [activities, setActivities] =
    useState<ActivityItem[]>(initialActivities);

  const [selectiveConfig, setSelectiveConfig] = useState<SelectiveVisibility>({
    profile: true,
    contactInfo: false,
    education: false,
    socialAccounts: true,
  });

  return (
    <main className="flex-1 w-full overflow-x-hidden text-slate-800 z-20 ">
      <HeaderNoProfile
        titlePrimary="Privacy"
        titleSecondary="Settings"
        description="Manage your profile visibility and control who can see your information and activities."
      />
      <div className="max-w-420 m-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start lg:pr-12 lg:pl-12">
        <div className="xl:col-span-4">
          <ProfilePrivacy
            viewMode="STUDENT_SELF"
            visibilityMode={visibilityMode}
            selectiveConfig={selectiveConfig}
          />
        </div>
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
