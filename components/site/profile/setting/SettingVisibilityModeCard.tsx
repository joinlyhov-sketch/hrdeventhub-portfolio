"use client";

import { CheckCircle2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  profileService,
  SharingMode,
  UpdatePreferencesRequest,
  UserProfilePayload,
} from "@/service/profile.service";
import type { VisibilityMode, SelectiveVisibility } from "./PrivacySettingsClient";
import { ALL_VISIBLE as ALL_VIS, ALL_HIDDEN as ALL_HID } from "./PrivacySettingsClient";

interface SettingVisibilityModeCardProps {
  profile: UserProfilePayload;
  visibilityMode: VisibilityMode;
  setVisibilityMode: (mode: VisibilityMode) => void;
  selectiveConfig: SelectiveVisibility;
  setSelectiveConfig: React.Dispatch<React.SetStateAction<SelectiveVisibility>>;
}

type AccordionKey = "profile" | "contactInfo" | "education" | "socialAccounts";

const SECTION_KEYS: Record<AccordionKey, (keyof SelectiveVisibility)[]> = {
  profile: ["showProfilePicture", "showBio", "showGender", "showBirthdate", "showGeneration"],
  contactInfo: ["showEmail", "showPhoneNumber"],
  education: ["showMajor", "showCurrentStatus", "showCv", "showEducation", "showSkills"],
  socialAccounts: ["showSocial"],
};

function uiModeToApiMode(mode: VisibilityMode): SharingMode {
  if (mode === "share_all") return "PUBLIC";
  if (mode === "private") return "PRIVATE";
  return "SELECTIVE";
}

function buildPreferencesPayload(config: SelectiveVisibility): UpdatePreferencesRequest {
  return {
    showEmail: config.showEmail,
    showPhoneNumber: config.showPhoneNumber,
    showBirthdate: config.showBirthdate,
    showGender: config.showGender,
    showBio: config.showBio,
    showProfilePicture: config.showProfilePicture,
    showMajor: config.showMajor,
    showCurrentStatus: config.showCurrentStatus,
    showCv: config.showCv,
    showEducation: config.showEducation,
    showSkills: config.showSkills,
    showSocial: config.showSocial,
    showGeneration: config.showGeneration,
  };
}

function sectionState(
  config: SelectiveVisibility,
  keys: (keyof SelectiveVisibility)[]
): "all" | "none" | "mixed" {
  const values = keys.map((k) => config[k]);
  if (values.every(Boolean)) return "all";
  if (values.every((v) => !v)) return "none";
  return "mixed";
}

interface FieldToggleItemProps {
  label: string;
  value: string;
  fieldKey: keyof SelectiveVisibility;
  config: SelectiveVisibility;
  onToggle: (key: keyof SelectiveVisibility) => void;
}

function FieldToggleItem({ label, value, fieldKey, config, onToggle }: FieldToggleItemProps) {
  const isVisible = config[fieldKey];
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 px-3 hover:bg-muted/10 transition">
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">{label}</span>
        <span className="type-detail text-grey-700 truncate max-w-md">{value}</span>
      </div>
      <button
        type="button"
        onClick={() => onToggle(fieldKey)}
        className={`px-2.5 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 cursor-pointer ${
          isVisible
            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
            : "bg-muted border-border text-muted-foreground"
        }`}
      >
        <CheckCircle2 className={`w-3 h-3 ${isVisible ? "opacity-100" : "opacity-40"}`} />
        <span>{isVisible ? "Visible" : "Hidden"}</span>
      </button>
    </div>
  );
}

interface SectionRowProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  sectionKey: AccordionKey;
  config: SelectiveVisibility;
  isOpen: boolean;
  onToggleSection: (key: AccordionKey) => void;
  onToggleAccordion: (key: AccordionKey) => void;
  children: React.ReactNode;
}

function SectionRow({
  label,
  description,
  icon,
  sectionKey,
  config,
  isOpen,
  onToggleSection,
  onToggleAccordion,
  children,
}: SectionRowProps) {
  const state = sectionState(config, SECTION_KEYS[sectionKey]);
  const isVisible = state !== "none";
  const isMixed = state === "mixed";

  return (
    <div className="hover:bg-muted/20 transition">
      <div className="p-3">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            className="flex items-center gap-3 min-w-0 cursor-pointer text-left flex-1"
            onClick={() => onToggleAccordion(sectionKey)}
          >
            <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <h4 className="type-subtitle font-semibold text-grey-700 flex items-center gap-2">
                {label}
                {isMixed && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600">
                    Partial
                  </span>
                )}
              </h4>
              <span className="type-detail text-muted-foreground block truncate">{description}</span>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSection(sectionKey)}
              className={`px-3 py-1 rounded-md text-[10px] font-medium border transition ${
                isVisible
                  ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                  : "bg-muted border-border text-muted-foreground"
              }`}
            >
              {state === "none" ? "Hidden" : "Visible"}
            </button>
            <button
              type="button"
              onClick={() => onToggleAccordion(sectionKey)}
              className="p-1 text-muted-foreground hover:text-secondary rounded cursor-pointer"
            >
              {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-3 ml-11 border-t border-border/40 divide-y divide-border/30 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

export default function SettingVisibilityModeCard({
  profile,
  visibilityMode,
  setVisibilityMode,
  selectiveConfig,
  setSelectiveConfig,
}: SettingVisibilityModeCardProps) {
  const { data: session } = useSession();

  const [expandedSections, setExpandedSections] = useState<Record<AccordionKey, boolean>>({
    profile: false,
    contactInfo: false,
    education: false,
    socialAccounts: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (visibilityMode === "share_all") {
      setSelectiveConfig({ ...ALL_VIS });
    } else if (visibilityMode === "private") {
      setSelectiveConfig({ ...ALL_HID });
    }
  }, [visibilityMode, setSelectiveConfig]);

  const toggleAccordion = (key: AccordionKey) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateAndSyncMode = (updatedConfig: SelectiveVisibility) => {
    const vals = Object.values(updatedConfig);
    if (vals.every(Boolean)) {
      setVisibilityMode("share_all");
    } else if (vals.every((v) => !v)) {
      setVisibilityMode("private");
    } else {
      setVisibilityMode("selective");
    }
  };

  const toggleField = (fieldKey: keyof SelectiveVisibility) => {
    if (visibilityMode === "private") return;
    const nextConfig = { ...selectiveConfig, [fieldKey]: !selectiveConfig[fieldKey] };
    setSelectiveConfig(nextConfig);
    calculateAndSyncMode(nextConfig);
  };

  const toggleSection = (sectionKey: AccordionKey) => {
    if (visibilityMode === "private") return;

    const keys = SECTION_KEYS[sectionKey];
    const currentState = sectionState(selectiveConfig, keys);
    const nextValue = currentState !== "all";

    const nextConfig = { ...selectiveConfig };
    keys.forEach((k) => {
      nextConfig[k] = nextValue;
    });

    setSelectiveConfig(nextConfig);
    calculateAndSyncMode(nextConfig);
  };

  const handleSave = async () => {
    const token = session?.accessToken;
    if (!token) {
      setSaveError("Session expired. Please log in again.");
      return;
    }

    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    const computedMode = uiModeToApiMode(visibilityMode);
    const computedPreferences = buildPreferencesPayload(selectiveConfig);

    try {
      const modeResult = await profileService.updateSharingMode(
        { mode: computedMode },
        token
      );
      if (!modeResult?.success) throw new Error("Failed to update sharing mode.");

      const prefResult = await profileService.updatePreferences(
        computedPreferences,
        token
      );
      if (!prefResult?.success) throw new Error("Failed to update preferences.");

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const isShareAll = visibilityMode === "share_all";
  const isPrivate = visibilityMode === "private";
  const isSelective = visibilityMode === "selective";
  const showCustomizePanel = isShareAll || isSelective;

  const { appUser, generation, education = [], socialAccount = [], skills = [], currentStatus, cvResumeUrl, major } = profile;

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—";

  return (
    <div className="xl:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6 duration-500 ease-in-out">
      <div className="space-y-6">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</span>
            <h2 className="type-subtitle-24 text-secondary text-sm">Choose your visibility mode</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setVisibilityMode("share_all")}
              className={`relative p-4 rounded-2xl border text-left transition flex flex-col justify-between min-h-[140px] cursor-pointer ${
                isShareAll
                  ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                  : "border-border hover:border-grey-300"
              }`}
            >
              <div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="25" fill="#CDD4E2" />
                    <path d="M25 35C30.52 35 35 30.52 35 25C35 19.48 30.52 15 25 15C19.48 15 15 19.48 15 25C15 30.52 19.48 35 25 35Z" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 16H22C20.05 21.84 20.05 28.16 22 34H21" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M28 16C29.95 21.84 29.95 28.16 28 34" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 29V28C21.84 29.95 28.16 29.95 34 28V29" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 22C21.84 20.05 28.16 20.05 34 22" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {isShareAll && (
                  <span className="type-detail text-primary bg-primary/10 px-2 py-0.5 rounded-2xl text-[10px]">
                    Recommended
                  </span>
                )}
                <h3 className="type-subtitle text-secondary text-xs mt-1">Share All (Default)</h3>
                <p className="type-detail text-muted-foreground mt-1 leading-relaxed">
                  Everyone can see your full profile data and contact cards.
                </p>
              </div>
              <RadioDot active={isShareAll} />
            </button>

            <button
              type="button"
              onClick={() => setVisibilityMode("private")}
              className={`relative p-4 rounded-2xl border text-left transition flex flex-col min-h-[140px] cursor-pointer ${
                isPrivate
                  ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                  : "border-border hover:border-grey-300"
              }`}
            >
              <div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="25" fill="#CDD4E2" />
                    <path d="M19 23V21C19 17.69 20 15 25 15C30 15 31 17.69 31 21V23" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M25 31.5C26.38 31.5 27.5 30.38 27.5 29C27.5 27.62 26.38 26.5 25 26.5C23.62 26.5 22.5 27.62 22.5 29C22.5 30.38 23.62 31.5 25 31.5Z" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M30 35H20C16 35 15 34 15 30V28C15 24 16 23 20 23H30C34 23 35 24 35 28V30C35 34 34 35 30 35Z" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="type-subtitle text-secondary text-xs">Private Mode</h3>
                <p className="type-detail text-muted-foreground mt-1 leading-relaxed">
                  Only your name is visible to others. All profile data is hidden.
                </p>
              </div>
              <RadioDot active={isPrivate} />
            </button>

            <button
              type="button"
              onClick={() => setVisibilityMode("selective")}
              className={`relative p-4 rounded-2xl border text-left transition flex flex-col min-h-[140px] cursor-pointer ${
                isSelective
                  ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                  : "border-border hover:border-grey-300"
              }`}
            >
              <div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="25" fill="#FF9F2E" fillOpacity="0.25" />
                    <path d="M22.16 23.87C22.06 23.86 21.94 23.86 21.83 23.87C19.45 23.79 17.56 21.84 17.56 19.44C17.56 16.99 19.54 15 22 15C24.45 15 26.44 16.99 26.44 19.44C26.43 21.84 24.54 23.79 22.16 23.87Z" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M29.41 17C31.35 17 32.91 18.57 32.91 20.5C32.91 22.39 31.41 23.93 29.54 24" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.16 27.56C14.74 29.18 14.74 31.82 17.16 33.43C19.91 35.27 24.42 35.27 27.17 33.43C29.59 31.81 29.59 29.17 27.17 27.56C24.43 25.73 19.92 25.73 17.16 27.56Z" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M31.34 33C32.06 32.85 32.74 32.56 33.3 32.13C34.86 30.96 34.86 29.03 33.3 27.86C32.75 27.44 32.08 27.16 31.37 27" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="type-subtitle text-secondary text-xs">Selective Sharing</h3>
                <p className="type-detail text-muted-foreground mt-1 leading-relaxed">
                  Choose which sections and fields are visible to others
                </p>
              </div>
              <RadioDot active={isSelective} />
            </button>
          </div>
        </div>

        {showCustomizePanel && (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2 h-10">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</span>
                <h2 className="type-subtitle font-bold text-secondary text-sm">Customize your visibility</h2>
              </div>
              <div className="flex type-detail text-primary gap-2">
                <button
                  type="button"
                  onClick={() => setVisibilityMode("private")}
                  className="px-2.5 py-1 type-detail text-primary transition cursor-pointer hover:underline"
                >
                  Make All Private
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilityMode("share_all")}
                  className="px-2.5 py-1 type-detail text-primary transition cursor-pointer hover:underline"
                >
                  Make All Public
                </button>
              </div>
            </div>

            <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border">
              <SectionRow
                label="Profile"
                description="Profile photo, username, bio, gender, generation"
                icon={<ProfileIcon />}
                sectionKey="profile"
                config={selectiveConfig}
                isOpen={expandedSections.profile}
                onToggleSection={toggleSection}
                onToggleAccordion={toggleAccordion}
              >
                <FieldToggleItem
                  label="Profile Picture"
                  value={profile.profilePicture ? "Uploaded" : "No Photo"}
                  fieldKey="showProfilePicture"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
                <FieldToggleItem
                  label="Bio"
                  value={profile.bio || "—"}
                  fieldKey="showBio"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
                <FieldToggleItem
                  label="Gender Identity"
                  value={appUser.gender === "F" ? "Female" : appUser.gender === "M" ? "Male" : "—"}
                  fieldKey="showGender"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
                <FieldToggleItem
                  label="Date of birth"
                  value={formatDate(appUser.dateOfBirth)}
                  fieldKey="showBirthdate"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
                <FieldToggleItem
                  label="Generation"
                  value={generation?.name || "—"}
                  fieldKey="showGeneration"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
              </SectionRow>

              <SectionRow
                label="Contact Information"
                description="Email address, phone numbers"
                icon={<ContactIcon />}
                sectionKey="contactInfo"
                config={selectiveConfig}
                isOpen={expandedSections.contactInfo}
                onToggleSection={toggleSection}
                onToggleAccordion={toggleAccordion}
              >
                <FieldToggleItem
                  label="Email"
                  value={appUser.email}
                  fieldKey="showEmail"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
                <FieldToggleItem
                  label="Phone"
                  value={appUser.phoneNumber || "—"}
                  fieldKey="showPhoneNumber"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
              </SectionRow>

              <SectionRow
                label="Education"
                description="University, major, skills, current status"
                icon={<EducationIcon />}
                sectionKey="education"
                config={selectiveConfig}
                isOpen={expandedSections.education}
                onToggleSection={toggleSection}
                onToggleAccordion={toggleAccordion}
              >
                <FieldToggleItem
                  label="Major"
                  value={major || "—"}
                  fieldKey="showMajor"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
                <FieldToggleItem
                  label="Status"
                  value={currentStatus || "—"}
                  fieldKey="showCurrentStatus"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
                <FieldToggleItem
                  label="CV / Resume"
                  value={cvResumeUrl ? "Active CV URL" : "Not Linked"}
                  fieldKey="showCv"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
                <FieldToggleItem
                  label="Education History"
                  value={education.length ? education.map((e) => e.institutionAbbreviation || e.institutionName).join(", ") : "—"}
                  fieldKey="showEducation"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
                <FieldToggleItem
                  label="Skills"
                  value={skills.length ? skills.join(", ") : "—"}
                  fieldKey="showSkills"
                  config={selectiveConfig}
                  onToggle={toggleField}
                />
              </SectionRow>

              <SectionRow
                label="Social Accounts"
                description="LinkedIn, GitHub, Facebook, Telegram"
                icon={<SocialIcon />}
                sectionKey="socialAccounts"
                config={selectiveConfig}
                isOpen={expandedSections.socialAccounts}
                onToggleSection={toggleSection}
                onToggleAccordion={toggleAccordion}
              >
                {socialAccount.length > 0 ? (
                  <FieldToggleItem
                    label="Connected Social Accounts"
                    value={socialAccount.map((s) => s.platform).join(", ")}
                    fieldKey="showSocial"
                    config={selectiveConfig}
                    onToggle={toggleField}
                  />
                ) : (
                  <p className="type-detail text-muted-foreground p-3 italic">No social accounts linked</p>
                )}
              </SectionRow>
            </div>
          </div>
        )}

        {isPrivate && (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-8 flex flex-col items-center justify-center min-h-[410px] text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-[#E1F1FD] rounded-full flex items-center justify-center mb-4">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="64" height="64" rx="32" fill="#E1F1FD" />
                <path d="M26 30V28C26 24.69 27 22 32 22C37 22 38 24.69 38 28V30" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M32 38.5C33.38 38.5 34.5 37.38 34.5 36C34.5 34.62 33.38 33.5 32 33.5C30.62 33.5 29.5 34.62 29.5 36C29.5 37.38 30.62 38.5 32 38.5Z" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M37 42H27C23 42 22 41 22 37V35C22 31 23 30 27 30H37C41 30 42 31 42 35V37C42 41 41 42 37 42Z" stroke="#1C4D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="type-subtitle font-bold text-secondary text-sm mb-1">Your profile is fully private</h3>
            <p className="type-detail text-muted-foreground leading-relaxed max-w-sm">
              While in Private Mode, all your personal details are hidden from others. Individual visibility controls are disabled.
            </p>
            <div className="flex gap-1.5 mt-12">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="w-1 h-1 rounded-full bg-grey-300" />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 mt-4">
        {saveError && (
          <p className="type-detail text-destructive text-xs">{saveError}</p>
        )}
        {saveSuccess && (
          <p className="type-detail text-emerald-600 text-xs">Changes saved successfully.</p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-2xl type-desc-semibold hover:opacity-90 shadow-sm transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function RadioDot({ active }: { active: boolean }) {
  return (
    <div className="absolute top-4 right-4">
      <div
        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
          active ? "border-primary bg-primary" : "border-border"
        }`}
      >
        {active && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
      </div>
    </div>
  );
}

const ProfileIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="22" fill="#1C4D8D" fillOpacity="0.2" />
    <path d="M22 22C24.7614 22 27 19.7614 27 17C27 14.2386 24.7614 12 22 12C19.2386 12 17 14.2386 17 17C17 19.7614 19.2386 22 22 22Z" stroke="#1C4D8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30.59 32C30.59 28.13 26.74 25 22 25C17.26 25 13.41 28.13 13.41 32" stroke="#1C4D8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ContactIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="22" fill="#3BC1A8" fillOpacity="0.2" />
    <path d="M27 29C27 29.53 26.79 30.04 26.41 30.41C26.04 30.79 25.53 31 25 31H14C13.47 31 12.96 30.79 12.59 30.41C12.21 30.04 12 29.53 12 29V21C12 20.65 12.09 20.3 12.27 20 Flext" />
    <path d="M32 15.5L25.58 19.68C25.26 19.89 24.88 20 24.5 20C24.12 20 23.74 19.89 23.42 19.68L17 15.5M19 13H30C31.1 13 32 13.9 32 15V23C32 24.1 31.1 25 30 25H19C17.9 25 17 24.1 17 23V15C17 13.9 17.9 13 19 13Z" stroke="#3BC1A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EducationIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="22" fill="#4663AC" fillOpacity="0.2" />
    <path d="M22 12L34 18L22 24L10 18L22 12Z" stroke="#4663AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 20.5V27C14 27 16.5 30 22 30C27.5 30 30 27 30 27V20.5" stroke="#4663AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 18V24" stroke="#4663AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SocialIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="22" fill="#FF9F2E" fillOpacity="0.2" />
    <path d="M22 32C27.52 32 32 27.52 32 22C32 16.48 27.52 12 22 12C16.48 12 12 16.48 12 22C12 27.52 16.48 32 22 32Z" stroke="#FF9F2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 13H19C17.05 18.84 17.05 25.16 19 31H18" stroke="#FF9F2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 13C26.95 18.84 26.95 25.16 25 31" stroke="#FF9F2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 26V25C18.84 26.95 25.16 26.95 31 25V26" stroke="#FF9F2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 19C18.84 17.05 25.16 17.05 31 19" stroke="#FF9F2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);