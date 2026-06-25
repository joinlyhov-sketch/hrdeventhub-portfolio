"use client";

import { CheckCircle2, ChevronDown, ChevronUp, Loader2, Lock, Unlock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  profileService,
  SharingMode,
  UpdatePreferencesRequest,
  UserProfilePayload,
} from "@/service/profile.service";
import type { VisibilityMode, SelectiveVisibility } from "./PrivacySettingsClient";
import { ALL_VISIBLE as ALL_VIS, ALL_HIDDEN as ALL_HID } from "./PrivacySettingsClient";
import { connectTelegramAction } from "@/actions/telegram.action";

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
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            className="flex items-center gap-3 min-w-0 cursor-pointer text-left flex-1"
            onClick={() => onToggleAccordion(sectionKey)}
          >
            <div className="shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-bold text-[#1C355E] flex items-center gap-2">
                {label}
                {isMixed && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600">
                    Partial
                  </span>
                )}
              </h4>
              <span className="text-sm text-muted-foreground block truncate">{description}</span>
            </div>
          </button>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSection(sectionKey)}
              className={`px-3 py-1 rounded-md text-xs font-medium border transition ${
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
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-3 ml-14 border-t border-border/40 divide-y divide-border/30 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

interface SaveButtonLayoutProps {
  saveError: string | null;
  saveSuccess: boolean;
  isSaving: boolean;
  onSave: () => Promise<void>;
  appUserId?: string;
  telegramError: string | null;
  setTelegramError: (err: string | null) => void;
  isConnectingTelegram: boolean;
  setIsConnectingTelegram: (connecting: boolean) => void;
  isTelegramConnected: boolean;
  telegramNotice: string | null;
  setTelegramNotice: (msg: string | null) => void;
  setAwaitingTelegramRefresh: (pending: boolean) => void;
}

function SaveButtonLayout({
  saveError,
  saveSuccess,
  isSaving,
  onSave,
  appUserId,
  telegramError,
  setTelegramError,
  isConnectingTelegram,
  setIsConnectingTelegram,
  isTelegramConnected,
  telegramNotice,
  setTelegramNotice,
  setAwaitingTelegramRefresh,
}: SaveButtonLayoutProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const accessToken = session?.accessToken;
  const handleTelegramAction = async () => {
  if (!appUserId) {
    setTelegramError(
      "Session context has expired. Please authenticate again."
    );
    return;
  }

  setIsConnectingTelegram(true);
  setTelegramError(null);
  setTelegramNotice(null);

  try {
    if (isTelegramConnected) {
    if (!accessToken) {
      setTelegramError("Authentication session has expired.");
      return;
    }

    await profileService.disconnectTelegram(
      appUserId,
      accessToken
    );

    setTelegramNotice("Telegram disconnected successfully.");
    router.refresh();
    return;
  }

    const result = await connectTelegramAction(appUserId);

    const pollTelegramConnection = async () => {
      const token = session?.accessToken;

      if (!token) return;

      let attempts = 0;

      const interval = setInterval(async () => {
        try {
          attempts++;

          const profile = await profileService.getProfileMe(token);

          if (profile.payload.appUser.telegramSubscribed) {
            clearInterval(interval);

            setTelegramNotice("Telegram connected successfully.");

            router.refresh();
          }

          if (attempts >= 20) {
            clearInterval(interval);
          }
        } catch {
          clearInterval(interval);
        }
      }, 3000);
    };

    if (result?.error) {
      if (typeof result.error === "object" && result.error !== null) {
        setTelegramError(
          (result.error as { message?: string }).message ??
            JSON.stringify(result.error)
        );
      } else {
        setTelegramError(result.error as string);
      }

      return;
    }

    pollTelegramConnection();

    setAwaitingTelegramRefresh(true);

  } catch (err) {
    setTelegramError(
      err instanceof Error
        ? err.message
        : "An unexpected error occurred."
    );
  } finally {
    setIsConnectingTelegram(false);
  }
};

  return (
    <div className="flex flex-col sm:items-end gap-2 mt-6 w-full">
      {saveError && <p className="text-xs text-destructive">{saveError}</p>}
      {telegramError && <p className="text-xs text-destructive">{telegramError}</p>}
      {telegramNotice && <p className="text-xs text-muted-foreground">{telegramNotice}</p>}
      {saveSuccess && <p className="text-xs text-emerald-600">Changes saved successfully.</p>}

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-2">
        <button
          type="button"
          onClick={handleTelegramAction}
          disabled={isConnectingTelegram}
          className={`w-full sm:w-auto px-6 py-2.5 text-white rounded-2xl text-sm font-semibold transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm ${
            isTelegramConnected
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-[#0088cc] hover:bg-[#0077b3]"
          }`}
        >
          {isConnectingTelegram ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.7-2.46 2.75-2.67.01-.03.01-.13-.05-.18-.06-.05-.14-.03-.2-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
          )}
          {isConnectingTelegram
            ? isTelegramConnected
              ? "Disconnecting…"
              : "Connecting Bot…"
            : isTelegramConnected
              ? "Disconnect Telegram"
              : "Connect Telegram"}
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="w-full sm:w-auto px-8 py-2.5 bg-primary text-white rounded-2xl text-sm font-semibold hover:bg-[#153b6c] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? "Saving…" : "Save changes"}
        </button>
      </div>
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
  const router = useRouter();

  const [expandedSections, setExpandedSections] = useState<Record<AccordionKey, boolean>>({
    profile: false,
    contactInfo: false,
    education: false,
    socialAccounts: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isConnectingTelegram, setIsConnectingTelegram] = useState(false);
  const [telegramError, setTelegramError] = useState<string | null>(null);
  const [telegramNotice, setTelegramNotice] = useState<string | null>(null);
  const [awaitingTelegramRefresh, setAwaitingTelegramRefresh] = useState(false);
  const [isTelegramConnected, setIsTelegramConnected] = useState(
    Boolean(profile.appUser?.telegramSubscribed)
  );

  useEffect(() => {
  setIsTelegramConnected(Boolean(profile.appUser?.telegramSubscribed));
}, [profile.appUser?.telegramSubscribed]);

  useEffect(() => {
    if (!awaitingTelegramRefresh) return;

    const triggerRefresh = () => {
      setAwaitingTelegramRefresh(false);
      router.refresh();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        triggerRefresh();
      }
    };

    window.addEventListener("focus", triggerRefresh);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", triggerRefresh);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [awaitingTelegramRefresh, router]);

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
      type ServiceResult = { success?: boolean };
      const modeResult = await profileService.updateSharingMode(
        { mode: computedMode },
        token
      ) as ServiceResult;
      if (!modeResult?.success) throw new Error("Failed to update sharing mode.");

      if (computedMode === "SELECTIVE") {
        const prefResult = await profileService.updatePreferences(
          computedPreferences,
          token
        ) as ServiceResult;
        if (!prefResult?.success) throw new Error("Failed to update preferences.");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setSaveError((err as { message?: string })?.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const isShareAll = visibilityMode === "share_all";
  const isPrivate = visibilityMode === "private";
  const isSelective = visibilityMode === "selective";

  const { appUser, generation, education = [], socialAccount = [], skills = [], currentStatus, cvResumeUrl, major } = profile;

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—";

  return (
    <div className="xl:col-span-8 flex flex-col gap-6 w-full">
      <div className="bg-white rounded-2xl border border-primary/10 p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</span>
          <h2 className="text-lg font-bold text-secondary">Choose your visibility mode</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setVisibilityMode("share_all")}
            className={`relative p-4 sm:p-5 rounded-2xl border text-left transition flex flex-col min-h-35 sm:min-h-40 justify-between cursor-pointer ${
              isShareAll
                ? "border-primary bg-[#F4F7FC] ring-1 ring-primary"
                : "border-border hover:border-grey-300"
            }`}
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="w-10 h-10" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25 35C30.52 35 35 30.52 35 25C35 19.48 30.52 15 25 15C19.48 15 15 19.48 15 25C15 30.52 19.48 35 25 35Z" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 16H22C20.05 21.84 20.05 28.16 22 34H21" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M28 16C29.95 21.84 29.95 28.16 28 34" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 29V28C21.84 29.95 28.16 29.95 34 28V29" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 22C21.84 20.05 28.16 20.05 34 22" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <RadioDot active={isShareAll} />
              </div>
              <h3 className="text-base font-bold text-[#1C355E]">Share All (Default)</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Everyone can see your full profile data and contact cards.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setVisibilityMode("private")}
            className={`relative p-4 sm:p-5 rounded-2xl border text-left transition flex flex-col min-h-35 sm:min-h-40 justify-between cursor-pointer ${
              isPrivate
                ? "border-primary bg-[#F4F7FC] ring-1 ring-primary"
                : "border-border hover:border-grey-300"
            }`}
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="w-10 h-10" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 23V21C19 17.69 20 15 25 15C30 15 31 17.69 31 21V23" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M25 31.5C26.38 31.5 27.5 30.38 27.5 29C27.5 27.62 26.38 26.5 25 26.5C23.62 26.5 22.5 27.62 22.5 29C22.5 30.38 23.62 31.5 25 31.5Z" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M30 35H20C16 35 15 34 15 30V28C15 24 16 23 20 23H30C34 23 35 24 35 28V30C35 34 34 35 30 35Z" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <RadioDot active={isPrivate} />
              </div>
              <h3 className="text-base font-bold text-[#1C355E]">Private Mode</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Only your name is visible to others. All profile data is hidden.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setVisibilityMode("selective")}
            className={`relative p-4 sm:p-5 rounded-2xl border text-left transition flex flex-col min-h-35 sm:min-h-40 justify-between cursor-pointer ${
              isSelective
                ? "border-primary bg-[#F4F7FC] ring-1 ring-primary"
                : "border-border hover:border-grey-300"
            }`}
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-[#FF9F2E]/15 flex items-center justify-center shrink-0">
                  <svg className="w-10 h-10" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.16 23.87C22.06 23.86 21.94 23.86 21.83 23.87C19.45 23.79 17.56 21.84 17.56 19.44C17.56 16.99 19.54 15 22 15C24.45 15 26.44 16.99 26.44 19.44C26.43 21.84 24.54 23.79 22.16 23.87Z" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M29.41 17C31.35 17 32.91 18.57 32.91 20.5C32.91 22.39 31.41 23.93 29.54 24" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.16 27.56C14.74 29.18 14.74 31.82 17.16 33.43C19.91 35.27 24.42 35.27 27.17 33.43C29.59 31.81 29.59 29.17 27.17 27.56C24.43 25.73 19.92 25.73 17.16 27.56Z" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M31.34 33C32.06 32.85 32.74 32.56 33.3 32.13C34.86 30.96 34.86 29.03 33.3 27.86C32.75 27.44 32.08 27.16 31.37 27" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <RadioDot active={isSelective} />
              </div>
              <h3 className="text-base font-bold text-[#1C355E]">Selective Sharing</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Choose which sections and fields are visible to others
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-primary/10 p-6 animate-in fade-in duration-200">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</span>
            <h2 className="text-lg font-bold text-secondary">Customize your visibility</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVisibilityMode("private")}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-primary"
            >
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Make All Private</span>
            </button>
            <button
              type="button"
              onClick={() => setVisibilityMode("share_all")}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-primary"
            >
              <Unlock className="w-3.5 h-3.5 text-primary" />
              <span>Make All Public</span>
            </button>
          </div>
        </div>

        {isPrivate ? ( 
          <div className="border border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-[#F8FAFC]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-base font-bold mb-1">Your profile is fully private</h3>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              While in Private Mode, all your personal details are hidden from others. Individual visibility controls are disabled.
            </p>
          </div>
        ) : (
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
        )}

        <SaveButtonLayout
          saveError={saveError}
          saveSuccess={saveSuccess}
          isSaving={isSaving}
          onSave={handleSave}
          appUserId={appUser?.appUserId}
          telegramError={telegramError}
          setTelegramError={setTelegramError}
          isConnectingTelegram={isConnectingTelegram}
          setIsConnectingTelegram={setIsConnectingTelegram}
          isTelegramConnected={isTelegramConnected}
          telegramNotice={telegramNotice}
          setTelegramNotice={setTelegramNotice}
          setAwaitingTelegramRefresh={setAwaitingTelegramRefresh}
        />
      </div>
    </div>
  );
}
function RadioDot({ active }: { active: boolean }) {
  return (
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
      active ? "border-primary" : "border-gray-300"
    }`}>
      {active && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
    </div>
  );
}

const ProfileIcon = () => (
  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
    <svg width="28" height="28" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 22C24.7614 22 27 19.7614 27 17C27 14.2386 24.7614 12 22 12C19.2386 12 17 14.2386 17 17C17 19.7614 19.2386 22 22 22Z" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30.59 32C30.59 28.13 26.74 25 22 25C17.26 25 13.41 28.13 13.41 32" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const ContactIcon = () => (
  <div className="w-10 h-10 rounded-full bg-[#3BC1A8]/10 flex items-center justify-center">
    <svg width="28" height="28" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M27 29C27 29.53 26.79 30.04 26.41 30.41C26.04 30.79 25.53 31 25 31H14C13.47 31 12.96 30.79 12.59 30.41C12.21 30.04 12 29.53 12 29V21C12 20.65 12.09 20.3 12.27 20" stroke="#3BC1A8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 15.5L25.58 19.68C25.26 19.89 24.88 20 24.5 20C24.12 20 23.74 19.89 23.42 19.68L17 15.5M19 13H30C31.1 13 32 13.9 32 15V23C32 24.1 31.1 25 30 25H19C17.9 25 17 24.1 17 23V15C17 13.9 17.9 13 19 13Z" stroke="#3BC1A8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const EducationIcon = () => (
  <div className="w-10 h-10 rounded-full bg-[#4663AC]/10 flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="path-1-inside-1_57910_146030" fill="white">
        <path d="M0.355971 7.18107L3.93787 8.90649V11.7788C3.93787 12.0203 4.07623 12.2405 4.29384 12.3454L11.1463 15.6462C11.2314 15.6872 11.3247 15.7085 11.4193 15.7085H12.5707C12.6653 15.7085 12.7585 15.6872 12.8437 15.6462L19.6772 12.3544C19.8097 12.2906 19.9156 12.1824 19.9766 12.0486C19.9852 12.0297 19.9934 12.0107 20.0016 11.9915C20.035 11.9134 20.0522 11.8294 20.0522 11.7445V8.90644L21.0292 8.4358V12.3307C20.8178 12.4716 20.6548 12.6828 20.5759 12.94L20.02 14.7514C19.9515 14.9747 19.9534 15.2104 20.0255 15.4327L20.541 17.0215C20.688 17.4747 21.1067 17.789 21.5829 17.8036C21.5861 17.8038 21.5892 17.8038 21.5924 17.8039L21.6081 17.8041C21.6113 17.8042 21.6146 17.8042 21.6179 17.8042C22.0861 17.8042 22.4994 17.5227 22.6711 17.087L23.2671 15.574C23.3591 15.3407 23.3707 15.0797 23.2998 14.8392L22.7441 12.9522C22.6666 12.6891 22.5023 12.4731 22.2871 12.3299V7.82997L23.644 7.17629C23.8616 7.07144 24 6.85126 24 6.60965V6.10878C24 5.86722 23.8616 5.647 23.644 5.54214L12.2679 0.0623012C12.0954 -0.0207671 11.8945 -0.0207671 11.722 0.0623012L0.355971 5.53736C0.138363 5.64217 0 5.86239 0 6.104V6.61448C0 6.85604 0.138363 7.07622 0.355971 7.18107ZM21.6293 16.3001L21.2341 15.0824L21.6556 13.7091L22.081 15.1533L21.6293 16.3001ZM18.7943 11.3836L12.4271 14.4507H11.5628L5.19572 11.3836V9.51247L11.722 12.6562C11.8083 12.6978 11.9016 12.7185 11.995 12.7185C12.0884 12.7185 12.1817 12.6978 12.2679 12.6562L18.7943 9.51252L18.7943 11.3836ZM11.9949 1.32699L22.4417 6.35924L19.2336 7.90463C19.2053 7.91359 19.1774 7.92411 19.1502 7.93714L11.9949 11.3839L4.8397 7.93714C4.81258 7.92411 4.7847 7.91359 4.75648 7.90463L1.54826 6.35919L11.9949 1.32699Z"/>
      </mask>
      <path d="M0.355971 7.18107L3.93787 8.90649V11.7788C3.93787 12.0203 4.07623 12.2405 4.29384 12.3454L11.1463 15.6462C11.2314 15.6872 11.3247 15.7085 11.4193 15.7085H12.5707C12.6653 15.7085 12.7585 15.6872 12.8437 15.6462L19.6772 12.3544C19.8097 12.2906 19.9156 12.1824 19.9766 12.0486C19.9852 12.0297 19.9934 12.0107 20.0016 11.9915C20.035 11.9134 20.0522 11.8294 20.0522 11.7445V8.90644L21.0292 8.4358V12.3307C20.8178 12.4716 20.6548 12.6828 20.5759 12.94L20.02 14.7514C19.9515 14.9747 19.9534 15.2104 20.0255 15.4327L20.541 17.0215C20.688 17.4747 21.1067 17.789 21.5829 17.8036C21.5861 17.8038 21.5892 17.8038 21.5924 17.8039L21.6081 17.8041C21.6113 17.8042 21.6146 17.8042 21.6179 17.8042C22.0861 17.8042 22.4994 17.5227 22.6711 17.087L23.2671 15.574C23.3591 15.3407 23.3707 15.0797 23.2998 14.8392L22.7441 12.9522C22.6666 12.6891 22.5023 12.4731 22.2871 12.3299V7.82997L23.644 7.17629C23.8616 7.07144 24 6.85126 24 6.60965V6.10878C24 5.86722 23.8616 5.647 23.644 5.54214L12.2679 0.0623012C12.0954 -0.0207671 11.8945 -0.0207671 11.722 0.0623012L0.355971 5.53736C0.138363 5.64217 0 5.86239 0 6.104V6.61448C0 6.85604 0.138363 7.07622 0.355971 7.18107ZM21.6293 16.3001L21.2341 15.0824L21.6556 13.7091L22.081 15.1533L21.6293 16.3001ZM18.7943 11.3836L12.4271 14.4507H11.5628L5.19572 11.3836V9.51247L11.722 12.6562C11.8083 12.6978 11.9016 12.7185 11.995 12.7185C12.0884 12.7185 12.1817 12.6978 12.2679 12.6562L18.7943 9.51252L18.7943 11.3836ZM11.9949 1.32699L22.4417 6.35924L19.2336 7.90463C19.2053 7.91359 19.1774 7.92411 19.1502 7.93714L11.9949 11.3839L4.8397 7.93714C4.81258 7.92411 4.7847 7.91359 4.75648 7.90463L1.54826 6.35919L11.9949 1.32699Z" fill="#1C4D8D"/>
      <path d="M0.355971 7.18107L-0.512199 8.98281L-0.511986 8.98292L0.355971 7.18107ZM3.93787 8.90649H5.93787V7.64995L4.80583 7.10464L3.93787 8.90649ZM4.29384 12.3454L3.42567 14.1471L3.42589 14.1472L4.29384 12.3454ZM11.1463 15.6462L10.2783 17.4481L10.2792 17.4485L11.1463 15.6462ZM12.8437 15.6462L13.71 17.4489L13.7117 17.4481L12.8437 15.6462ZM19.6772 12.3544L20.5452 14.1563L20.5461 14.1558L19.6772 12.3544ZM19.9766 12.0486L18.1569 11.2188L18.1567 11.2191L19.9766 12.0486ZM20.0016 11.9915L21.8396 12.78L21.8408 12.7772L20.0016 11.9915ZM20.0522 8.90644L19.1842 7.10458L18.0522 7.64989V8.90644H20.0522ZM21.0292 8.4358H23.0292V5.25248L20.1613 6.63394L21.0292 8.4358ZM21.0292 12.3307L22.1385 13.9949L23.0292 13.4011V12.3307H21.0292ZM20.5759 12.94L18.6639 12.353L18.6639 12.3532L20.5759 12.94ZM20.02 14.7514L18.108 14.1646L18.1078 14.1652L20.02 14.7514ZM20.0255 15.4327L18.123 16.0498L18.1231 16.05L20.0255 15.4327ZM20.541 17.0215L22.4434 16.4044L22.4433 16.4043L20.541 17.0215ZM21.5829 17.8036L21.6464 15.8047L21.6444 15.8046L21.5829 17.8036ZM21.5924 17.8039L21.6245 15.8041L21.6241 15.8041L21.5924 17.8039ZM21.6081 17.8041L21.576 19.8038L21.5773 19.8039L21.6081 17.8041ZM22.6711 17.087L20.8103 16.354L20.8102 16.354L22.6711 17.087ZM23.2671 15.574L21.4065 14.8405L21.4063 14.8409L23.2671 15.574ZM23.2998 14.8392L21.3813 15.4042L21.3814 15.4045L23.2998 14.8392ZM22.7441 12.9522L20.8254 13.5169L20.8256 13.5173L22.7441 12.9522ZM22.2871 12.3299H20.2871V13.4014L21.1791 13.995L22.2871 12.3299ZM22.2871 7.82997L21.4191 6.02813L20.2871 6.57345V7.82997H22.2871ZM23.644 7.17629L24.512 8.97812L24.5122 8.97803L23.644 7.17629ZM23.644 5.54214L24.5122 3.7404L24.512 3.74029L23.644 5.54214ZM12.2679 0.0623012L13.1358 -1.73955L13.1355 -1.7397L12.2679 0.0623012ZM11.722 0.0623012L10.8542 -1.7396L10.854 -1.73954L11.722 0.0623012ZM0.355971 5.53736L1.2238 7.33927L1.22393 7.33921L0.355971 5.53736ZM21.6293 16.3001L19.7269 16.9173L21.4472 22.219L23.4901 17.0331L21.6293 16.3001ZM21.2341 15.0824L19.3221 14.4956L19.1369 15.0992L19.3318 15.6996L21.2341 15.0824ZM21.6556 13.7091L23.5741 13.1439L21.6947 6.76426L19.7436 13.1223L21.6556 13.7091ZM22.081 15.1533L23.9418 15.8863L24.1937 15.2471L23.9995 14.5881L22.081 15.1533ZM18.7943 11.3836L19.6622 13.1855L20.7942 12.6402L20.7943 11.3837L18.7943 11.3836ZM12.4271 14.4507V16.4507H12.8837L13.2951 16.2526L12.4271 14.4507ZM11.5628 14.4507L10.6948 16.2526L11.1062 16.4507H11.5628V14.4507ZM5.19572 11.3836H3.19572V12.6402L4.32775 13.1855L5.19572 11.3836ZM5.19572 9.51247L6.06368 7.71062L3.19572 6.32911V9.51247H5.19572ZM11.722 12.6562L12.5903 10.8545L12.59 10.8544L11.722 12.6562ZM12.2679 12.6562L13.1358 14.4581L13.1359 14.4581L12.2679 12.6562ZM18.7943 9.51252L20.7943 9.51257L20.7944 6.32915L17.9264 7.71066L18.7943 9.51252ZM11.9949 1.32699L12.8629 -0.474855L11.9949 -0.892952L11.127 -0.474855L11.9949 1.32699ZM22.4417 6.35924L23.3097 8.16109L27.0502 6.35924L23.3097 4.55739L22.4417 6.35924ZM19.2336 7.90463L19.8374 9.81129L19.9732 9.76828L20.1015 9.70648L19.2336 7.90463ZM19.1502 7.93714L18.2853 6.13383L18.2823 6.1353L19.1502 7.93714ZM11.9949 11.3839L11.127 13.1858L11.9949 13.6039L12.8629 13.1858L11.9949 11.3839ZM4.8397 7.93714L5.70767 6.1353L5.70592 6.13446L4.8397 7.93714ZM4.75648 7.90463L3.88851 9.70647L4.01635 9.76806L4.15161 9.81098L4.75648 7.90463ZM1.54826 6.35919L0.680305 4.55734L-3.06023 6.35917L0.68029 8.16103L1.54826 6.35919Z" fill="#696969" mask="url(#path-1-inside-1_57910_146030)"/>
    </svg>
  </div>
);

const SocialIcon = () => (
  <div className="w-10 h-10 rounded-full bg-[#FF9F2E]/10 flex items-center justify-center">
    <svg width="28" height="28" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 32C27.52 32 32 27.52 32 22C32 16.48 27.52 12 22 12C16.48 12 12 16.48 12 22C12 27.52 16.48 32 22 32Z" stroke="#FF9F2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 13H19C17.05 18.84 17.05 25.16 19 31H18" stroke="#FF9F2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 13C26.95 18.84 26.95 25.16 25 31" stroke="#FF9F2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 26V25C18.84 26.95 25.16 26.95 31 25V26" stroke="#FF9F2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 19C18.84 17.05 25.16 17.05 31 19" stroke="#FF9F2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);