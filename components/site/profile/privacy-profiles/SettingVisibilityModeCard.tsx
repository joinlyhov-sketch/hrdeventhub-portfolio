"use client";

import {
  Lock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Link2,
  Mails,
  UserCircle,
  Users,
  Globe,
} from "lucide-react";
import React, { useState } from "react";

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

interface SettingVisibilityModeCardProps {
  visibilityMode: "share_all" | "private" | "selective";
  setVisibilityMode: (mode: "share_all" | "private" | "selective") => void;
  activities: ActivityItem[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityItem[]>>;
  selectiveConfig: SelectiveVisibility;
  setSelectiveConfig: React.Dispatch<React.SetStateAction<SelectiveVisibility>>;
}

export default function SettingVisibilityModeCard({
  visibilityMode,
  setVisibilityMode,
  activities,
  setActivities,
  selectiveConfig,
  setSelectiveConfig,
}: SettingVisibilityModeCardProps) {
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
    <div className="xl:col-span-7 w-full space-y-6 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h2 className="type-subtitle font-bold text-secondary text-sm">
              Choose your visibility mode
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setVisibilityMode("share_all")}
              className={`relative p-4 rounded-xl border text-left transition flex flex-col justify-between min-h-[140px] group ${
                visibilityMode === "share_all"
                  ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                  : "border-border hover:border-grey-300"
              }`}
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-secondary text-xs">
                  Share All (Default)
                </h3>
                <p className="type-detail text-muted-foreground mt-1 leading-relaxed">
                  Everyone can see your full profile data and contact cards.
                </p>
              </div>
              <div className="absolute top-4 right-4">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    visibilityMode === "share_all"
                      ? "border-primary bg-primary"
                      : "border-border"
                  }`}
                >
                  {visibilityMode === "share_all" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
              {visibilityMode === "share_all" && (
                <span className="mt-3 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-medium w-fit">
                  Recommended
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setVisibilityMode("private")}
              className={`relative p-4 rounded-xl border text-left transition flex flex-col min-h-[140px] ${
                visibilityMode === "private"
                  ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                  : "border-border hover:border-grey-300"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center mb-3">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-secondary text-xs">Private Mode</h3>
              <p className="type-detail text-muted-foreground mt-1 leading-relaxed">
                Only your name is visible to others. All profile data is hidden.
              </p>
              <div className="absolute top-4 right-4">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    visibilityMode === "private"
                      ? "border-primary bg-primary"
                      : "border-border"
                  }`}
                >
                  {visibilityMode === "private" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setVisibilityMode("selective")}
              className={`relative p-4 rounded-xl border text-left transition flex flex-col min-h-[140px] ${
                visibilityMode === "selective"
                  ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                  : "border-border hover:border-grey-300"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-secondary text-xs">
                Selective Sharing
              </h3>
              <p className="type-detail text-muted-foreground mt-1 leading-relaxed">
                Choose which sections and fields are visible to others
              </p>
              <div className="absolute top-4 right-4">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    visibilityMode === "selective"
                      ? "border-primary bg-primary"
                      : "border-border"
                  }`}
                >
                  {visibilityMode === "selective" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>

        {visibilityMode === "share_all" && (
          <div className="bg-card rounded-xl border border-border shadow-sm p-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h2 className="type-subtitle font-bold text-secondary text-sm">
                  Recent Activity
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAllVisibility(false)}
                  className="px-2.5 py-1 text-[10px] font-medium text-grey-500 bg-muted hover:bg-grey-100 border border-border rounded-md transition"
                >
                  Make All Private
                </button>
                <button
                  type="button"
                  onClick={() => setAllVisibility(true)}
                  className="px-2.5 py-1 text-[10px] font-medium text-grey-500 bg-muted hover:bg-grey-100 border border-border rounded-md transition"
                >
                  Make All Public
                </button>
              </div>
            </div>

            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              {activities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/30 transition gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="type-detail font-semibold text-grey-700 truncate">
                          {activity.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground">
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
                          : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3 h-3 ${activity.isVisible ? "opacity-100" : "opacity-40"}`}
                      />
                      <span>{activity.isVisible ? "Visible" : "Hidden"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {visibilityMode === "private" && (
          <div className="bg-card rounded-xl border border-border shadow-sm p-8 flex flex-col items-center justify-center min-h-[320px] text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground border border-border mb-4 shadow-inner">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="type-subtitle font-bold text-secondary text-sm mb-1">
              Your profile is fully private
            </h3>
            <p className="type-detail text-muted-foreground leading-relaxed max-w-sm">
              While in Private Mode, all your personal details are hidden from
              others. Individual visibility controls are disabled.
            </p>

            <div className="flex gap-1.5 mt-12">
              <span className="w-1 h-1 rounded-full bg-grey-300"></span>
              <span className="w-1 h-1 rounded-full bg-grey-300"></span>
              <span className="w-1 h-1 rounded-full bg-grey-300"></span>
              <span className="w-1 h-1 rounded-full bg-grey-300"></span>
            </div>
          </div>
        )}

        {visibilityMode === "selective" && (
          <div className="bg-card rounded-xl border border-border shadow-sm p-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h2 className="type-subtitle font-bold text-secondary text-sm">
                  Customize your visibility
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAllSelective(false)}
                  className="px-2.5 py-1 text-[10px] font-medium text-grey-500 bg-muted hover:bg-grey-100 border border-border rounded-md transition"
                >
                  Make All Private
                </button>
                <button
                  type="button"
                  onClick={() => setAllSelective(true)}
                  className="px-2.5 py-1 text-[10px] font-medium text-grey-500 bg-muted hover:bg-grey-100 border border-border rounded-md transition"
                >
                  Make All Public
                </button>
              </div>
            </div>

            <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
              <div className="p-3 hover:bg-muted/20 transition">
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                    onClick={() => toggleAccordion("profile")}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                      <UserCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-detail font-semibold text-grey-700 flex items-center gap-1.5">
                        Profile
                      </h4>
                      <span className="text-[10px] text-muted-foreground block truncate">
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
                          : "bg-muted border-border text-muted-foreground"
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
                      className="p-1 text-muted-foreground hover:text-secondary rounded"
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

              <div className="p-3 hover:bg-muted/20 transition">
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                    onClick={() => toggleAccordion("contactInfo")}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                      <Mails className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-detail font-semibold text-grey-700">
                        Contact Information
                      </h4>
                      <span className="text-[10px] text-muted-foreground block truncate">
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
                          : "bg-muted border-border text-muted-foreground"
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
                      className="p-1 text-muted-foreground hover:text-secondary rounded"
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

              <div className="p-3 hover:bg-muted/20 transition">
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                    onClick={() => toggleAccordion("education")}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-detail font-semibold text-grey-700">
                        Education
                      </h4>
                      <span className="text-[10px] text-muted-foreground block truncate">
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
                          : "bg-muted border-border text-muted-foreground"
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
                      className="p-1 text-muted-foreground hover:text-secondary rounded"
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

              <div className="p-3 hover:bg-muted/20 transition">
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                    onClick={() => toggleAccordion("socialAccounts")}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                      <Link2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-detail font-semibold text-grey-700">
                        Social Accounts
                      </h4>
                      <span className="text-[10px] text-muted-foreground block truncate">
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
                          : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3 h-3 ${selectiveConfig.socialAccounts ? "opacity-100" : "opacity-40"}`}
                      />
                      <span>
                        {selectiveConfig.socialAccounts ? "Visible" : "Hidden"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAccordion("socialAccounts")}
                      className="p-1 text-muted-foreground hover:text-secondary rounded"
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
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl type-desc-semibold hover:opacity-90 shadow-sm transition">
          Save changes
        </button>
      </div>
    </div>
  );
}
