"use client";

import React, { useState } from "react";
import {
  Globe,
  Lock,
  Users,
  Mail,
  Code,
  GraduationCap,
  User,
  Eye,
  CheckCircle2,
  LockKeyhole,
  Link2,
  UserCircle,
  Bell,
  ChevronDown,
  ChevronUp,
  Phone,
  LockIcon,
  Cake,
  Code2,
  Mails,
} from "lucide-react";

interface SelectiveVisibility {
  profile: boolean;
  contactInfo: boolean;
  education: boolean;
  socialAccounts: boolean;
}

const initialActivities = [
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

export default function PrivacySettings() {
  const [visibilityMode, setVisibilityMode] = useState<
    "share_all" | "private" | "selective"
  >("share_all");
  const [activities, setActivities] = useState(initialActivities);

  const [selectiveConfig, setSelectiveConfig] = useState<SelectiveVisibility>({
    profile: true,
    contactInfo: false,
    education: false,
    socialAccounts: true,
  });

  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    contactInfo: true,
    education: true,
    socialAccounts: true,
  });

  const toggleActivityVisibility = (id: number) => {
    setActivities((prev) =>
      prev.map((act) =>
        act.id === id ? { ...act, isVisible: !act.isVisible } : act,
      ),
    );
  };

  const setAllVisibility = (visible: boolean) => {
    setActivities((prev) =>
      prev.map((act) => ({ ...act, isVisible: visible })),
    );
  };

  const toggleSelectiveField = (key: keyof SelectiveVisibility) => {
    setSelectiveConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAccordion = (key: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setAllSelective = (visible: boolean) => {
    setSelectiveConfig({
      profile: visible,
      contactInfo: visible,
      education: visible,
      socialAccounts: visible,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans antialiased text-slate-800">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-amber-500 flex items-center gap-2">
          Privacy Setting
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Control who can see your profile information and manage your privacy.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl">
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold var(--seconary)text-sm">
              Preview As Public
            </h2>
          </div>

          <div className="p-5 flex-1 flex flex-col items-center">
            {visibilityMode === "private" ? (
              <div className="w-full flex flex-col items-center">
                <div className="w-full bg-gradient-to-b from-[#0f2854] to-[#1c4d8d] rounded-xl h-36 flex items-center justify-center relative mb-14">
                  <div className="absolute -bottom-10 w-20 h-20 rounded-full overflow-hidden shadow-sm bg-white">
                    <img
                      src="/images/Profiles.png"
                      alt="Chham Kaknika"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <h3 className="font-bold var(--primary-hover) text-base leading-tight mb-0.5 tracking-tight">
                  Chham Kaknika
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-12">
                  @kaknika
                </p>

                <div className="w-full px-4 mb-4">
                  <div className="bg-[#f9fafb] border border-slate-100 py-2.5 rounded-xl text-center flex items-center justify-center">
                    <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                      Chham Kaknika's profiles is locked
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {(visibilityMode === "share_all" ||
                  selectiveConfig.profile) && (
                  <div className="w-full bg-gradient-to-b from-[#0f2854] to-[#1c4d8d] rounded-xl h-36 flex items-center justify-center relative mb-14">
                    <div className="absolute -bottom-10 w-20 h-20 rounded-full overflow-hidden bg-white">
                      <img
                        src="/images/Profiles.png"
                        alt="Chham Kaknika"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {(visibilityMode === "share_all" ||
                  selectiveConfig.profile) && (
                  <div className="text-center w-full">
                    <h3 className="font-bold var(--seconary)text-base leading-tight mb-0.5 tracking-tight">
                      Chham Kaknika
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mb-4">
                      @kaknika
                    </p>
                  </div>
                )}

                {(visibilityMode === "share_all" ||
                  selectiveConfig.profile) && (
                  <p className="text-xs text-slate-600 text-center leading-relaxed px-2 mb-6">
                    Dedicated FullStack web Development student with a passion
                    for building scalable HR solutions and strategic talent
                    acquisition platforms.
                  </p>
                )}

                {(visibilityMode === "share_all" ||
                  selectiveConfig.profile ||
                  selectiveConfig.contactInfo ||
                  selectiveConfig.education) && (
                  <div className="w-full space-y-3.5 border-t border-slate-100 pt-5">
                    <h4 className="var(--fs-subtitle-24) var(--seconary) text-xs tracking-wide">
                      Personal Information
                    </h4>

                    <div className="space-y-3">
                      {(visibilityMode === "share_all" ||
                        selectiveConfig.contactInfo) && (
                        <>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <Mails className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">kaknika@gmail.com</span>
                            {visibilityMode === "selective" && (
                              <Lock className="w-3 h-3 text-slate-300 ml-auto" />
                            )}
                          </div>
                        </>
                      )}
                      {(visibilityMode === "share_all" ||
                        selectiveConfig.profile) && (
                        <>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <Cake className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>12 July 2007</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <User className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>14th Generation</span>
                          </div>
                           <div className="flex items-center gap-3 text-xs text-slate-600">
                            <Code2 className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>Fullstack web developement</span>
                            {visibilityMode === "selective" && (
                              <Lock className="w-3 h-3 text-slate-300 ml-auto" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>015849376</span>
                            {visibilityMode === "selective" && (
                              <Lock className="w-3 h-3 text-slate-300 ml-auto" />
                            )}
                          </div>
                           <div className="flex items-center gap-3 text-xs text-slate-600">
                            <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>Studying</span>
                            {visibilityMode === "selective" && (
                              <Lock className="w-3 h-3 text-slate-300 ml-auto" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <User className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>Female</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {(visibilityMode === "share_all" ||
                  selectiveConfig.socialAccounts) && (
                  <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-slate-100 w-full">
                    <a
                      href="#"
                      className="w-7 h-7 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
                      aria-label="Facebook"
                    >
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-7 h-7 bg-[#24A1DE] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
                      aria-label="Telegram"
                    >
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.944 0C5.344 0 0 5.344 0 11.944c0 6.6 5.344 11.944 11.944 11.944 6.6 0 11.944-5.344 11.944-11.944C23.888 5.344 18.544 0 11.944 0zm5.512 8.16l-1.896 8.928c-.144.648-.528.808-1.072.504l-2.888-2.128-1.392 1.344c-.152.152-.28.28-.576.28l.208-2.928 5.336-4.824c.232-.208-.048-.32-.36-.112L8.08 13.16l-2.84-.888c-.616-.192-.632-.616.128-.912l11.104-4.28c.512-.184.96.12.784.912z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-7 h-7 bg-[#24292E] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
                      aria-label="GitHub"
                    >
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-7 h-7 bg-[#0077B5] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            <span>Only visible information is shown to others</span>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h2 className="font-bold var(--seconary)text-sm">
                  Choose your visibility mode
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setVisibilityMode("share_all")}
                  className={`relative p-4 rounded-xl border text-left transition flex flex-col justify-between min-h-[140px] group ${
                    visibilityMode === "share_all"
                      ? "border-blue-900 ring-1 ring-blue-900/30 bg-blue-50/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center mb-3">
                      <Globe className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold var(--seconary)text-xs">
                      Share All (Default)
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Only your name is visible to others. All profile data is
                      hidden.
                    </p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        visibilityMode === "share_all"
                          ? "border-blue-950 bg-blue-950"
                          : "border-slate-300"
                      }`}
                    >
                      {visibilityMode === "share_all" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  {visibilityMode === "share_all" && (
                    <span className="mt-3 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium w-fit">
                      Recommended
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setVisibilityMode("private")}
                  className={`relative p-4 rounded-xl border text-left transition flex flex-col min-h-[140px] ${
                    visibilityMode === "private"
                      ? "border-blue-900 ring-1 ring-blue-900/30 bg-blue-50/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold var(--seconary)text-xs">
                    Private Mode
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Only your name is visible to others. All profile data is
                    hidden.
                  </p>
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        visibilityMode === "private"
                          ? "border-blue-950 bg-blue-950"
                          : "border-slate-300"
                      }`}
                    >
                      {visibilityMode === "private" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibilityMode("selective")}
                  className={`relative p-4 rounded-xl border text-left transition flex flex-col min-h-[140px] ${
                    visibilityMode === "selective"
                      ? "border-blue-900 ring-1 ring-blue-900/30 bg-blue-50/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
                    <React.Fragment>
                      <Users className="w-4 h-4" />
                    </React.Fragment>
                  </div>
                  <h3 className="font-bold var(--seconary)text-xs">
                    Selective Sharing
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Choose which sections and fields are visible to others
                  </p>
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        visibilityMode === "selective"
                          ? "border-blue-950 bg-blue-950"
                          : "border-slate-300"
                      }`}
                    >
                      {visibilityMode === "selective" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {visibilityMode === "share_all" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <h2 className="font-bold var(--seconary)text-sm">
                      Recent Activity
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAllVisibility(false)}
                      className="px-2.5 py-1 text-[10px] font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition"
                    >
                      Make All Private
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllVisibility(true)}
                      className="px-2.5 py-1 text-[10px] font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition"
                    >
                      Make All Public
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {activities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 hover:bg-slate-50/50 transition gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-slate-700 truncate">
                              {activity.title}
                            </h4>
                            <span className="text-[10px] text-slate-400">
                              {activity.time}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleActivityVisibility(activity.id)}
                          className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 shrink-0 ${
                            activity.isVisible
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : "bg-slate-50 border-slate-200 text-slate-400"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3 h-3 ${activity.isVisible ? "opacity-100" : "opacity-40"}`}
                          />
                          <span>
                            {activity.isVisible ? "Visible" : "Hidden"}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {visibilityMode === "private" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[320px] text-center animate-in fade-in duration-200">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100 mb-4 shadow-inner">
                  <LockIcon className="w-5 h-5 text-blue-900" />
                </div>
                <h3 className="font-bold var(--seconary)text-sm mb-1">
                  Your profile is fully private
                </h3>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  While in Private Mode, all your personal details are hidden
                  from others. Individual visibility controls are disabled.
                </p>

                <div className="flex gap-1.5 mt-12">
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                </div>
              </div>
            )}

            {visibilityMode === "selective" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <h2 className="font-bold var(--seconary)text-sm">
                      Customize your visibility
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAllSelective(false)}
                      className="px-2.5 py-1 text-[10px] font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition"
                    >
                      Make All Private
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllSelective(true)}
                      className="px-2.5 py-1 text-[10px] font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition"
                    >
                      Make All Public
                    </button>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                  <div className="p-3 hover:bg-slate-50/40 transition">
                    <div className="flex items-center justify-between gap-4">
                      <div
                        className="flex items-center gap-3 min-w-0 cursor-pointer"
                        onClick={() => toggleAccordion("profile")}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <UserCircle className="w-4 h-4 text-blue-950/70" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            Profile
                          </h4>
                          <span className="text-[10px] text-slate-400 block truncate max-w-md">
                            Profile photo, username, bio, gender, generation
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSelectiveField("profile")}
                          className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 ${
                            selectiveConfig.profile
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : "bg-slate-50 border-slate-200 text-slate-400"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3 h-3 ${selectiveConfig.profile ? "opacity-100" : "opacity-40"}`}
                          />
                          <span>
                            {selectiveConfig.profile ? "Visible" : "Hidden"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAccordion("profile")}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded"
                        >
                          {expandedSections.profile ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 hover:bg-slate-50/40 transition">
                    <div className="flex items-center justify-between gap-4">
                      <div
                        className="flex items-center gap-3 min-w-0 cursor-pointer"
                        onClick={() => toggleAccordion("contactInfo")}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <Mails className="w-4 h-4 text-emerald-600/70" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-700">
                            Contact Information
                          </h4>
                          <span className="text-[10px] text-slate-400 block truncate max-w-md">
                            Email address, phone numbers
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSelectiveField("contactInfo")}
                          className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 ${
                            selectiveConfig.contactInfo
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : "bg-slate-50 border-slate-200 text-slate-400"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3 h-3 ${selectiveConfig.contactInfo ? "opacity-100" : "opacity-40"}`}
                          />
                          <span>
                            {selectiveConfig.contactInfo ? "Visible" : "Hidden"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAccordion("contactInfo")}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded"
                        >
                          {expandedSections.contactInfo ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 hover:bg-slate-50/40 transition">
                    <div className="flex items-center justify-between gap-4">
                      <div
                        className="flex items-center gap-3 min-w-0 cursor-pointer"
                        onClick={() => toggleAccordion("education")}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4 h-4 text-indigo-600/70" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-700">
                            Education
                          </h4>
                          <span className="text-[10px] text-slate-400 block truncate max-w-md">
                            University, major, skills, resume/CV
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSelectiveField("education")}
                          className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 ${
                            selectiveConfig.education
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : "bg-slate-50 border-slate-200 text-slate-400"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3 h-3 ${selectiveConfig.education ? "opacity-100" : "opacity-40"}`}
                          />
                          <span>
                            {selectiveConfig.education ? "Visible" : "Hidden"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAccordion("education")}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded"
                        >
                          {expandedSections.education ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 hover:bg-slate-50/40 transition">
                    <div className="flex items-center justify-between gap-4">
                      <div
                        className="flex items-center gap-3 min-w-0 cursor-pointer"
                        onClick={() => toggleAccordion("socialAccounts")}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <Link2 className="w-4 h-4 text-amber-600/70" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-700">
                            Social Accounts
                          </h4>
                          <span className="text-[10px] text-slate-400 block truncate max-w-md">
                            LinkedIn, GitHub, Facebook, Telegram
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSelectiveField("socialAccounts")}
                          className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 ${
                            selectiveConfig.socialAccounts
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : "bg-slate-50 border-slate-200 text-slate-400"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3 h-3 ${selectiveConfig.socialAccounts ? "opacity-100" : "opacity-40"}`}
                          />
                          <span>
                            {selectiveConfig.socialAccounts
                              ? "Visible"
                              : "Hidden"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAccordion("socialAccounts")}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded"
                        >
                          {expandedSections.socialAccounts ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button className="px-6 py-2 bg-blue-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-950 shadow-sm transition">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
