"use client";

import { Lock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

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
    const updatedConfig = {
      ...selectiveConfig,
      [key]: !selectiveConfig[key],
    };

    setSelectiveConfig(updatedConfig);

    const allVisible = Object.values(updatedConfig).every(Boolean);

    if (visibilityMode === "share_all" && !updatedConfig[key]) {
      setVisibilityMode("selective");
    }

    if (visibilityMode === "selective" && allVisible) {
      setVisibilityMode("share_all");
    }
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
  useEffect(() => {
    if (visibilityMode === "share_all") {
      setSelectiveConfig({
        profile: true,
        contactInfo: true,
        education: true,
        socialAccounts: true,
      });
    }

    if (visibilityMode === "private") {
      setSelectiveConfig({
        profile: false,
        contactInfo: false,
        education: false,
        socialAccounts: false,
      });
    }
  }, [visibilityMode, setSelectiveConfig]);

  return (
    <div className="xl:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6 duration-500 ease-in-out">
      <div className="space-y-6">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              1
            </span>
            <h2 className="type-subtitle-24 text-secondary text-sm">
              Choose your visibility mode
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setVisibilityMode("share_all")}
              className={`relative p-4 rounded-2xl border text-left transition flex flex-col justify-between min-h-[140px] group cursor-pointer ${
                visibilityMode === "share_all"
                  ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                  : "border-border hover:border-grey-300"
              }`}
            >
              <div>
                <div className="w-8 h-8 rounded-lg text-primary flex items-center justify-center mb-3">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="50" height="50" rx="25" fill="#CDD4E2" />
                    <path
                      d="M25 35C30.5228 35 35 30.5228 35 25C35 19.4772 30.5228 15 25 15C19.4772 15 15 19.4772 15 25C15 30.5228 19.4772 35 25 35Z"
                      stroke="#1C4D8D"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.0016 16H22.0016C20.0516 21.84 20.0516 28.16 22.0016 34H21.0016"
                      stroke="#1C4D8D"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M28 16C29.95 21.84 29.95 28.16 28 34"
                      stroke="#1C4D8D"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 29V28C21.84 29.95 28.16 29.95 34 28V29"
                      stroke="#1C4D8D"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 22.0016C21.84 20.0516 28.16 20.0516 34 22.0016"
                      stroke="#1C4D8D"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="absolute left-14 top-5 block max-[1550px]:hidden">
                  {visibilityMode === "share_all" && (
                    <span className="mt-3 type-detail text-primary bg-primary/10 px-2 py-0.5 rounded-2xl w-full">
                      Recommended
                    </span>
                  )}
                </div>
                <h3 className="type-subtitle text-secondary text-xs">
                  Share All (Default){" "}
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
            </button>

            <button
              type="button"
              onClick={() => setVisibilityMode("private")}
              className={`relative p-4 rounded-2xl border text-left transition flex flex-col min-h-35 cursor-pointer ${
                visibilityMode === "private"
                  ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                  : "border-border hover:border-grey-300"
              }`}
            >
              <div className="w-8 h-8 rounded-lg text-muted-foreground flex items-center justify-center mb-3">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="50" height="50" rx="25" fill="#CDD4E2" />
                  <path
                    d="M19 23V21C19 17.69 20 15 25 15C30 15 31 17.69 31 21V23"
                    stroke="#1C4D8D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M25 31.5C26.3807 31.5 27.5 30.3807 27.5 29C27.5 27.6193 26.3807 26.5 25 26.5C23.6193 26.5 22.5 27.6193 22.5 29C22.5 30.3807 23.6193 31.5 25 31.5Z"
                    stroke="#1C4D8D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M30 35H20C16 35 15 34 15 30V28C15 24 16 23 20 23H30C34 23 35 24 35 28V30C35 34 34 35 30 35Z"
                    stroke="#1C4D8D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="type-subtitle text-secondary text-xs">
                Private Mode
              </h3>
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
              className={`relative p-4 rounded-2xl border text-left transition flex flex-col min-h-[140px]${
                visibilityMode === "selective"
                  ? "border-primary ring-1 ring-primary/30 bg-primary/5 cursor-pointer"
                  : "border-border hover:border-grey-300 cursor-pointer"
              }`}
            >
              <div className="w-8 h-8 rounded-lg text-muted-foreground flex items-center justify-center mb-3">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="50"
                    height="50"
                    rx="25"
                    fill="#FF9F2E"
                    fillOpacity="0.25"
                  />
                  <path
                    d="M22.1586 23.87C22.0586 23.86 21.9386 23.86 21.8286 23.87C19.4486 23.79 17.5586 21.84 17.5586 19.44C17.5586 16.99 19.5386 15 21.9986 15C24.4486 15 26.4386 16.99 26.4386 19.44C26.4286 21.84 24.5386 23.79 22.1586 23.87Z"
                    stroke="#1C4D8D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M29.4112 17C31.3512 17 32.9112 18.57 32.9112 20.5C32.9112 22.39 31.4113 23.93 29.5413 24C29.4613 23.99 29.3713 23.99 29.2812 24"
                    stroke="#1C4D8D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.1588 27.56C14.7387 29.18 14.7387 31.82 17.1588 33.43C19.9088 35.27 24.4188 35.27 27.1688 33.43C29.5888 31.81 29.5888 29.17 27.1688 27.56C24.4288 25.73 19.9188 25.73 17.1588 27.56Z"
                    stroke="#1C4D8D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M31.3398 33C32.0598 32.85 32.7398 32.56 33.2998 32.13C34.8598 30.96 34.8598 29.03 33.2998 27.86C32.7498 27.44 32.0798 27.16 31.3698 27"
                    stroke="#1C4D8D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="type-subtitle text-secondary text-xs">
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
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 flex-wrap h-10 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  2
                </span>
                <h2 className="type-subtitle font-bold text-secondary text-sm">
                  Customize your visibility
                </h2>
              </div>
              <div className="flex type-detail text-primary gap-2">
                <button
                  type="button"
                  onClick={() => setVisibilityMode("private")}
                  className="px-2.5 py-1 type-detail text-primary transition cursor-pointer"
                >
                  Make All Private
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilityMode("share_all")}
                  className="px-2.5 py-1 type-detail text-primary transition cursor-pointer"
                >
                  Make All Public
                </button>
              </div>
            </div>

            <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border">
              <div className="p-3 hover:bg-muted/20 transition">
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                    onClick={() => toggleAccordion("profile")}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 44 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="44"
                          height="44"
                          rx="22"
                          fill="#1C4D8D"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M22 22C24.7614 22 27 19.7614 27 17C27 14.2386 24.7614 12 22 12C19.2386 12 17 14.2386 17 17C17 19.7614 19.2386 22 22 22Z"
                          stroke="#1C4D8D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M30.5901 32C30.5901 28.13 26.7402 25 22.0002 25C17.2602 25 13.4102 28.13 13.4102 32"
                          stroke="#1C4D8D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-subtitle font-semibold text-grey-700 flex items-center gap-1.5">
                        Profile
                      </h4>
                      <span className="type-detail text-muted-foreground">
                        Profile photo, username, bio, gender, generation
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        toggleSelectiveField("profile");
                      }}
                      className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 cursor-pointer ${
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
                      className="p-1 text-muted-foreground hover:text-secondary rounded cursor-pointer"
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
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 44 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="44"
                          height="44"
                          rx="22"
                          fill="#3BC1A8"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M27 29C27 29.5304 26.7893 30.0391 26.4142 30.4142C26.0391 30.7893 25.5304 31 25 31H14C13.4696 31 12.9609 30.7893 12.5858 30.4142C12.2107 30.0391 12 29.5304 12 29V21C12 20.6489 12.0924 20.3041 12.268 20C12.4435 19.696 12.696 19.4435 13 19.268M32 15.5L25.581 19.679C25.2585 19.8862 24.8833 19.9963 24.5 19.9963C24.1167 19.9963 23.7415 19.8862 23.419 19.679L17 15.5M19 13H30C31.1046 13 32 13.8954 32 15V23C32 24.1046 31.1046 25 30 25H19C17.8954 25 17 24.1046 17 23V15C17 13.8954 17.8954 13 19 13Z"
                          stroke="#3BC1A8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-subtitle font-semibold text-grey-700">
                        Contact Information
                      </h4>
                      <span className="type-detail text-muted-foreground">
                        Email address, phone numbers
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSelectiveField("contactInfo")}
                      className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 cursor-pointer ${
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
                      className="p-1 text-muted-foreground hover:text-secondary rounded cursor-pointer"
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
                    <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg- flex items-center justify-center shrink-0">
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 44 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="44"
                          height="44"
                          rx="22"
                          fill="#4663AC"
                          fillOpacity="0.2"
                        />
                        <rect x="10" y="10" width="24" height="24" />
                        <mask id="path-3-inside-1_55420_172364" fill="white">
                          <path d="M10.356 20.2826L13.9379 22.008V24.8803C13.9379 25.1219 14.0762 25.3421 14.2938 25.447L21.1463 28.7478C21.2314 28.7888 21.3247 28.81 21.4193 28.81H22.5707C22.6653 28.81 22.7585 28.7888 22.8437 28.7478L29.6772 25.456C29.8097 25.3921 29.9156 25.2839 29.9766 25.1502C29.9852 25.1313 29.9934 25.1122 30.0016 25.0931C30.035 25.015 30.0522 24.9309 30.0522 24.8461V22.008L31.0292 21.5374V25.4323C30.8178 25.5732 30.6548 25.7844 30.5759 26.0415L30.02 27.8529C29.9515 28.0763 29.9534 28.312 30.0255 28.5343L30.541 30.1231C30.688 30.5763 31.1067 30.8906 31.5829 30.9052C31.5861 30.9053 31.5892 30.9054 31.5924 30.9054L31.6081 30.9057C31.6113 30.9057 31.6146 30.9057 31.6179 30.9057C32.0861 30.9057 32.4994 30.6243 32.6711 30.1886L33.2671 28.6756C33.3591 28.4422 33.3707 28.1813 33.2998 27.9407L32.7441 26.0538C32.6666 25.7907 32.5023 25.5747 32.2871 25.4315V20.9315L33.644 20.2779C33.8616 20.173 34 19.9528 34 19.7112V19.2103C34 18.9688 33.8616 18.7486 33.644 18.6437L22.2679 13.1639C22.0954 13.0808 21.8945 13.0808 21.722 13.1639L10.356 18.6389C10.1384 18.7437 10 18.964 10 19.2056V19.716C10 19.9576 10.1384 20.1778 10.356 20.2826ZM31.6293 29.4016L31.2341 28.1839L31.6556 26.8106L32.081 28.2548L31.6293 29.4016ZM28.7943 24.4852L22.4271 27.5523H21.5628L15.1957 24.4852V22.614L21.722 25.7578C21.8083 25.7994 21.9016 25.8201 21.995 25.8201C22.0884 25.8201 22.1817 25.7994 22.2679 25.7578L28.7943 22.6141L28.7943 24.4852ZM21.9949 14.4286L32.4417 19.4608L29.2336 21.0062C29.2053 21.0152 29.1774 21.0257 29.1502 21.0387L21.9949 24.4855L14.8397 21.0387C14.8126 21.0257 14.7847 21.0152 14.7565 21.0062L11.5483 19.4608L21.9949 14.4286Z" />
                        </mask>
                        <path
                          d="M10.356 20.2826L13.9379 22.008V24.8803C13.9379 25.1219 14.0762 25.3421 14.2938 25.447L21.1463 28.7478C21.2314 28.7888 21.3247 28.81 21.4193 28.81H22.5707C22.6653 28.81 22.7585 28.7888 22.8437 28.7478L29.6772 25.456C29.8097 25.3921 29.9156 25.2839 29.9766 25.1502C29.9852 25.1313 29.9934 25.1122 30.0016 25.0931C30.035 25.015 30.0522 24.9309 30.0522 24.8461V22.008L31.0292 21.5374V25.4323C30.8178 25.5732 30.6548 25.7844 30.5759 26.0415L30.02 27.8529C29.9515 28.0763 29.9534 28.312 30.0255 28.5343L30.541 30.1231C30.688 30.5763 31.1067 30.8906 31.5829 30.9052C31.5861 30.9053 31.5892 30.9054 31.5924 30.9054L31.6081 30.9057C31.6113 30.9057 31.6146 30.9057 31.6179 30.9057C32.0861 30.9057 32.4994 30.6243 32.6711 30.1886L33.2671 28.6756C33.3591 28.4422 33.3707 28.1813 33.2998 27.9407L32.7441 26.0538C32.6666 25.7907 32.5023 25.5747 32.2871 25.4315V20.9315L33.644 20.2779C33.8616 20.173 34 19.9528 34 19.7112V19.2103C34 18.9688 33.8616 18.7486 33.644 18.6437L22.2679 13.1639C22.0954 13.0808 21.8945 13.0808 21.722 13.1639L10.356 18.6389C10.1384 18.7437 10 18.964 10 19.2056V19.716C10 19.9576 10.1384 20.1778 10.356 20.2826ZM31.6293 29.4016L31.2341 28.1839L31.6556 26.8106L32.081 28.2548L31.6293 29.4016ZM28.7943 24.4852L22.4271 27.5523H21.5628L15.1957 24.4852V22.614L21.722 25.7578C21.8083 25.7994 21.9016 25.8201 21.995 25.8201C22.0884 25.8201 22.1817 25.7994 22.2679 25.7578L28.7943 22.6141L28.7943 24.4852ZM21.9949 14.4286L32.4417 19.4608L29.2336 21.0062C29.2053 21.0152 29.1774 21.0257 29.1502 21.0387L21.9949 24.4855L14.8397 21.0387C14.8126 21.0257 14.7847 21.0152 14.7565 21.0062L11.5483 19.4608L21.9949 14.4286Z"
                          fill="#1C4D8D"
                        />
                        <path
                          d="M10.356 20.2826L9.4878 22.0844L9.48801 22.0845L10.356 20.2826ZM13.9379 22.008H15.9379V20.7515L14.8058 20.2062L13.9379 22.008ZM14.2938 25.447L13.4257 27.2487L13.4259 27.2488L14.2938 25.447ZM21.1463 28.7478L20.2783 30.5497L20.2792 30.5501L21.1463 28.7478ZM22.8437 28.7478L23.71 30.5505L23.7117 30.5496L22.8437 28.7478ZM29.6772 25.456L30.5452 27.2579L30.5461 27.2574L29.6772 25.456ZM29.9766 25.1502L28.1569 24.3204L28.1567 24.3206L29.9766 25.1502ZM30.0016 25.0931L31.8396 25.8815L31.8408 25.8788L30.0016 25.0931ZM30.0522 22.008L29.1842 20.2061L28.0522 20.7514V22.008H30.0522ZM31.0292 21.5374H33.0292V18.354L30.1613 19.7355L31.0292 21.5374ZM31.0292 25.4323L32.1385 27.0964L33.0292 26.5027V25.4323H31.0292ZM30.5759 26.0415L28.6639 25.4546L28.6639 25.4547L30.5759 26.0415ZM30.02 27.8529L28.108 27.2661L28.1078 27.2668L30.02 27.8529ZM30.0255 28.5343L28.123 29.1513L28.1231 29.1515L30.0255 28.5343ZM30.541 30.1231L32.4434 29.5059L32.4433 29.5058L30.541 30.1231ZM31.5829 30.9052L31.6464 28.9062L31.6444 28.9062L31.5829 30.9052ZM31.5924 30.9054L31.6245 28.9057L31.6241 28.9057L31.5924 30.9054ZM31.6081 30.9057L31.576 32.9054L31.5773 32.9054L31.6081 30.9057ZM32.6711 30.1886L30.8103 29.4555L30.8102 29.4556L32.6711 30.1886ZM33.2671 28.6756L31.4065 27.942L31.4063 27.9425L33.2671 28.6756ZM33.2998 27.9407L31.3813 28.5058L31.3814 28.5061L33.2998 27.9407ZM32.7441 26.0538L30.8254 26.6185L30.8256 26.6189L32.7441 26.0538ZM32.2871 25.4315H30.2871V26.503L31.1791 27.0966L32.2871 25.4315ZM32.2871 20.9315L31.4191 19.1297L30.2871 19.675V20.9315H32.2871ZM33.644 20.2779L34.512 22.0797L34.5122 22.0796L33.644 20.2779ZM33.644 18.6437L34.5122 16.842L34.512 16.8419L33.644 18.6437ZM22.2679 13.1639L23.1358 11.362L23.1355 11.3619L22.2679 13.1639ZM21.722 13.1639L20.8542 11.362L20.854 11.362L21.722 13.1639ZM10.356 18.6389L11.2238 20.4408L11.2239 20.4408L10.356 18.6389ZM31.6293 29.4016L29.7269 30.0189L31.4472 35.3206L33.4901 30.1347L31.6293 29.4016ZM31.2341 28.1839L29.3221 27.5972L29.1369 28.2007L29.3318 28.8012L31.2341 28.1839ZM31.6556 26.8106L33.5741 26.2454L31.6947 19.8658L29.7436 26.2239L31.6556 26.8106ZM32.081 28.2548L33.9418 28.9879L34.1937 28.3487L33.9995 27.6897L32.081 28.2548ZM28.7943 24.4852L29.6622 26.287L30.7942 25.7418L30.7943 24.4853L28.7943 24.4852ZM22.4271 27.5523V29.5523H22.8837L23.2951 29.3541L22.4271 27.5523ZM21.5628 27.5523L20.6948 29.3541L21.1062 29.5523H21.5628V27.5523ZM15.1957 24.4852H13.1957V25.7417L14.3278 26.287L15.1957 24.4852ZM15.1957 22.614L16.0637 20.8122L13.1957 19.4307V22.614H15.1957ZM21.722 25.7578L22.5903 23.9561L22.59 23.9559L21.722 25.7578ZM22.2679 25.7578L23.1358 27.5597L23.1359 27.5596L22.2679 25.7578ZM28.7943 22.6141L30.7943 22.6141L30.7944 19.4307L27.9264 20.8122L28.7943 22.6141ZM21.9949 14.4286L22.8629 12.6267L21.9949 12.2086L21.127 12.6267L21.9949 14.4286ZM32.4417 19.4608L33.3097 21.2626L37.0502 19.4608L33.3097 17.659L32.4417 19.4608ZM29.2336 21.0062L29.8374 22.9128L29.9732 22.8698L30.1015 22.808L29.2336 21.0062ZM29.1502 21.0387L28.2853 19.2354L28.2823 19.2369L29.1502 21.0387ZM21.9949 24.4855L21.127 26.2873L21.9949 26.7055L22.8629 26.2873L21.9949 24.4855ZM14.8397 21.0387L15.7077 19.2369L15.7059 19.236L14.8397 21.0387ZM14.7565 21.0062L13.8885 22.808L14.0164 22.8696L14.1516 22.9125L14.7565 21.0062ZM11.5483 19.4608L10.6803 17.6589L6.93977 19.4607L10.6803 21.2626L11.5483 19.4608ZM10.356 20.2826L9.48801 22.0845L13.0699 23.8099L13.9379 22.008L14.8058 20.2062L11.2239 18.4808L10.356 20.2826ZM13.9379 22.008H11.9379V24.8803H13.9379H15.9379V22.008H13.9379ZM13.9379 24.8803H11.9379C11.9379 25.8901 12.5162 26.8105 13.4257 27.2487L14.2938 25.447L15.162 23.6452C15.6363 23.8737 15.9379 24.3537 15.9379 24.8803H13.9379ZM14.2938 25.447L13.4259 27.2488L20.2783 30.5496L21.1463 28.7478L22.0143 26.946L15.1618 23.6451L14.2938 25.447ZM21.1463 28.7478L20.2792 30.5501C20.6349 30.7212 21.0245 30.81 21.4193 30.81V28.81V26.81C21.625 26.81 21.828 26.8564 22.0134 26.9455L21.1463 28.7478ZM21.4193 28.81V30.81H22.5707V28.81V26.81H21.4193V28.81ZM22.5707 28.81V30.81C22.9658 30.81 23.355 30.721 23.71 30.5505L22.8437 28.7478L21.9775 26.9451C22.162 26.8565 22.3647 26.81 22.5707 26.81V28.81ZM22.8437 28.7478L23.7117 30.5496L30.5452 27.2579L29.6772 25.456L28.8093 23.6542L21.9758 26.946L22.8437 28.7478ZM29.6772 25.456L30.5461 27.2574C31.0989 26.9908 31.5415 26.539 31.7965 25.9797L29.9766 25.1502L28.1567 24.3206C28.2897 24.0288 28.5205 23.7934 28.8083 23.6546L29.6772 25.456ZM29.9766 25.1502L31.7963 25.98C31.8156 25.9377 31.8322 25.8989 31.8396 25.8815L30.0016 25.0931L28.1636 24.3047C28.1594 24.3143 28.1575 24.3188 28.1561 24.322C28.1548 24.3249 28.1553 24.3238 28.1569 24.3204L29.9766 25.1502ZM30.0016 25.0931L31.8408 25.8788C31.9802 25.5524 32.0522 25.2011 32.0522 24.8461H30.0522H28.0522C28.0522 24.6608 28.0897 24.4776 28.1624 24.3074L30.0016 25.0931ZM30.0522 24.8461H32.0522V22.008H30.0522H28.0522V24.8461H30.0522ZM30.0522 22.008L30.9201 23.8099L31.8972 23.3392L31.0292 21.5374L30.1613 19.7355L29.1842 20.2061L30.0522 22.008ZM31.0292 21.5374H29.0292V25.4323H31.0292H33.0292V21.5374H31.0292ZM31.0292 25.4323L29.9199 23.7681C29.334 24.1586 28.8815 24.746 28.6639 25.4546L30.5759 26.0415L32.4878 26.6285C32.4282 26.8227 32.3016 26.9877 32.1385 27.0964L31.0292 25.4323ZM30.5759 26.0415L28.6639 25.4547L28.108 27.2661L30.02 27.8529L31.9319 28.4397L32.4879 26.6283L30.5759 26.0415ZM30.02 27.8529L28.1078 27.2668C27.9191 27.8825 27.9242 28.5382 28.123 29.1513L30.0255 28.5343L31.9279 27.9172C31.9825 28.0857 31.9839 28.2701 31.9321 28.4391L30.02 27.8529ZM30.0255 28.5343L28.1231 29.1515L28.6386 30.7403L30.541 30.1231L32.4433 29.5058L31.9278 27.917L30.0255 28.5343ZM30.541 30.1231L28.6386 30.7402C29.0461 31.9965 30.2015 32.8637 31.5215 32.9043L31.5829 30.9052L31.6444 28.9062C32.0119 28.9175 32.3299 29.1561 32.4434 29.5059L30.541 30.1231ZM31.5829 30.9052L31.5195 32.9042C31.5409 32.9049 31.5596 32.9051 31.5606 32.9052L31.5924 30.9054L31.6241 28.9057C31.6221 28.9056 31.6245 28.9057 31.6276 28.9057C31.6312 28.9058 31.6379 28.9059 31.6464 28.9062L31.5829 30.9052ZM31.5924 30.9054L31.5603 32.9052L31.576 32.9054L31.6081 30.9057L31.6402 28.9059L31.6245 28.9057L31.5924 30.9054ZM31.6081 30.9057L31.5773 32.9054C31.5985 32.9058 31.617 32.9057 31.6179 32.9057V30.9057V28.9057C31.6157 28.9057 31.6179 28.9057 31.6208 28.9057C31.624 28.9057 31.6305 28.9058 31.6388 28.9059L31.6081 30.9057ZM31.6179 30.9057V32.9057C32.9078 32.9057 34.0592 32.1216 34.5319 30.9216L32.6711 30.1886L30.8102 29.4556C30.9397 29.1269 31.2643 28.9057 31.6179 28.9057V30.9057ZM32.6711 30.1886L34.5319 30.9217L35.1279 29.4086L33.2671 28.6756L31.4063 27.9425L30.8103 29.4555L32.6711 30.1886ZM33.2671 28.6756L35.1278 29.4091C35.3831 28.7614 35.4151 28.0433 35.2183 27.3753L33.2998 27.9407L31.3814 28.5061C31.3263 28.3193 31.3351 28.1231 31.4065 27.942L33.2671 28.6756ZM33.2998 27.9407L35.2183 27.3756L34.6626 25.4887L32.7441 26.0538L30.8256 26.6189L31.3813 28.5058L33.2998 27.9407ZM32.7441 26.0538L34.6627 25.4891C34.4503 24.7675 33.9943 24.1652 33.395 23.7664L32.2871 25.4315L31.1791 27.0966C31.0102 26.9842 30.883 26.8139 30.8254 26.6185L32.7441 26.0538ZM32.2871 25.4315H34.2871V20.9315H32.2871H30.2871V25.4315H32.2871ZM32.2871 20.9315L33.155 22.7334L34.512 22.0797L33.644 20.2779L32.776 18.476L31.4191 19.1297L32.2871 20.9315ZM33.644 20.2779L34.5122 22.0796C35.4216 21.6414 36 20.7211 36 19.7112H34H32C32 19.1845 32.3017 18.7046 32.7759 18.4761L33.644 20.2779ZM34 19.7112H36V19.2103H34H32V19.7112H34ZM34 19.2103H36C36 18.2006 35.4216 17.2802 34.5122 16.842L33.644 18.6437L32.7759 20.4454C32.3016 20.2169 32 19.737 32 19.2103H34ZM33.644 18.6437L34.512 16.8419L23.1358 11.362L22.2679 13.1639L21.4 14.9657L32.7761 20.4456L33.644 18.6437ZM22.2679 13.1639L23.1355 11.3619C22.4148 11.0148 21.5751 11.0147 20.8542 11.362L21.722 13.1639L22.5898 14.9658C22.2138 15.1469 21.776 15.1468 21.4003 14.9659L22.2679 13.1639ZM21.722 13.1639L20.854 11.362L9.48801 16.8371L10.356 18.6389L11.2239 20.4408L22.5899 14.9657L21.722 13.1639ZM10.356 18.6389L9.48814 16.837C8.57823 17.2752 8 18.1959 8 19.2056H10H12C12 19.732 11.6985 20.2122 11.2238 20.4408L10.356 18.6389ZM10 19.2056H8V19.716H10H12V19.2056H10ZM10 19.716H8C8 20.726 8.57851 21.6462 9.4878 22.0844L10.356 20.2826L11.2241 18.4809C11.6982 18.7093 12 19.1892 12 19.716H10ZM31.6293 29.4016L33.5316 28.7844L33.1365 27.5667L31.2341 28.1839L29.3318 28.8012L29.7269 30.0189L31.6293 29.4016ZM31.2341 28.1839L33.1461 28.7707L33.5676 27.3973L31.6556 26.8106L29.7436 26.2239L29.3221 27.5972L31.2341 28.1839ZM31.6556 26.8106L29.7371 27.3758L30.1625 28.82L32.081 28.2548L33.9995 27.6897L33.5741 26.2454L31.6556 26.8106ZM32.081 28.2548L30.2202 27.5218L29.7684 28.6686L31.6293 29.4016L33.4901 30.1347L33.9418 28.9879L32.081 28.2548ZM28.7943 24.4852L27.9263 22.6834L21.5592 25.7504L22.4271 27.5523L23.2951 29.3541L29.6622 26.287L28.7943 24.4852ZM22.4271 27.5523V25.5523H21.5628V27.5523V29.5523H22.4271V27.5523ZM21.5628 27.5523L22.4308 25.7504L16.0637 22.6834L15.1957 24.4852L14.3278 26.287L20.6948 29.3541L21.5628 27.5523ZM15.1957 24.4852H17.1957V22.614H15.1957H13.1957V24.4852H15.1957ZM15.1957 22.614L14.3278 24.4159L20.8541 27.5596L21.722 25.7578L22.59 23.9559L16.0637 20.8122L15.1957 22.614ZM21.722 25.7578L20.8538 27.5595C21.2149 27.7335 21.6055 27.8201 21.995 27.8201V25.8201V23.8201C22.1977 23.8201 22.4016 23.8652 22.5903 23.9561L21.722 25.7578ZM21.995 25.8201V27.8201C22.3847 27.8201 22.7751 27.7334 23.1358 27.5597L22.2679 25.7578L21.4001 23.9559C21.5882 23.8653 21.792 23.8201 21.995 23.8201V25.8201ZM22.2679 25.7578L23.1359 27.5596L29.6623 24.4159L28.7943 22.6141L27.9264 20.8122L21.4 23.9559L22.2679 25.7578ZM28.7943 22.6141L26.7943 22.614L26.7943 24.4852L28.7943 24.4852L30.7943 24.4853L30.7943 22.6141L28.7943 22.6141ZM21.9949 14.4286L21.127 16.2304L31.5738 21.2627L32.4417 19.4608L33.3097 17.659L22.8629 12.6267L21.9949 14.4286ZM32.4417 19.4608L31.5738 17.659L28.3656 19.2044L29.2336 21.0062L30.1015 22.808L33.3097 21.2626L32.4417 19.4608ZM29.2336 21.0062L28.6297 19.0995C28.5331 19.1301 28.4148 19.1733 28.2853 19.2354L29.1502 21.0387L30.0152 22.842C29.94 22.878 29.8774 22.9002 29.8374 22.9128L29.2336 21.0062ZM29.1502 21.0387L28.2823 19.2369L21.127 22.6837L21.9949 24.4855L22.8629 26.2873L30.0182 22.8405L29.1502 21.0387ZM21.9949 24.4855L22.8629 22.6837L15.7077 19.2369L14.8397 21.0387L13.9717 22.8405L21.127 26.2873L21.9949 24.4855ZM14.8397 21.0387L15.7059 19.236C15.5758 19.1735 15.4571 19.1302 15.3613 19.0999L14.7565 21.0062L14.1516 22.9125C14.1123 22.9001 14.0494 22.8779 13.9735 22.8414L14.8397 21.0387ZM14.7565 21.0062L15.6244 19.2044L12.4162 17.6589L11.5483 19.4608L10.6803 21.2626L13.8885 22.808L14.7565 21.0062ZM11.5483 19.4608L12.4162 21.2626L22.8629 16.2304L21.9949 14.4286L21.127 12.6267L10.6803 17.6589L11.5483 19.4608Z"
                          fill="#696969"
                          mask="url(#path-3-inside-1_55420_172364)"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-subtitle font-semibold text-grey-700">
                        Education
                      </h4>
                      <span className="type-detail text-muted-foreground">
                        University, major, skills, resume/CV
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        toggleSelectiveField("education");
                      }}
                      className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 cursor-pointer${
                        selectiveConfig.education
                          ? "border-emerald-100 bg-emerald-50 text-emerald-600"
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
                      className="p-1 text-muted-foreground hover:text-secondary rounded cursor-pointer"
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
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 44 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="44"
                          height="44"
                          rx="22"
                          fill="#FF9F2E"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M22 32C27.5228 32 32 27.5228 32 22C32 16.4772 27.5228 12 22 12C16.4772 12 12 16.4772 12 22C12 27.5228 16.4772 32 22 32Z"
                          stroke="#FF9F2E"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.0016 13H19.0016C17.0516 18.84 17.0516 25.16 19.0016 31H18.0016"
                          stroke="#FF9F2E"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M25 13C26.95 18.84 26.95 25.16 25 31"
                          stroke="#FF9F2E"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 26V25C18.84 26.95 25.16 26.95 31 25V26"
                          stroke="#FF9F2E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 19.0016C18.84 17.0516 25.16 17.0516 31 19.0016"
                          stroke="#FF9F2E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-subtitle font-semibold text-grey-700">
                        Social Accounts
                      </h4>
                      <span className="type-detail text-muted-foreground">
                        LinkedIn, GitHub, Facebook, Telegram
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSelectiveField("socialAccounts")}
                      className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 cursor-pointer ${
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
                      className="p-1 text-muted-foreground hover:text-secondary rounded cursor-pointer"
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

        {visibilityMode === "private" && (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-8 flex flex-col items-center justify-center min-h-[410px] text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground border border-border mb-4 shadow-inner">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="64" height="64" rx="32" fill="#E1F1FD" />
                <path
                  d="M26 30V28C26 24.69 27 22 32 22C37 22 38 24.69 38 28V30"
                  stroke="#1C4D8D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M32 38.5C33.3807 38.5 34.5 37.3807 34.5 36C34.5 34.6193 33.3807 33.5 32 33.5C30.6193 33.5 29.5 34.6193 29.5 36C29.5 37.3807 30.6193 38.5 32 38.5Z"
                  stroke="#1C4D8D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M37 42H27C23 42 22 41 22 37V35C22 31 23 30 27 30H37C41 30 42 31 42 35V37C42 41 41 42 37 42Z"
                  stroke="#1C4D8D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2 h-10">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  2
                </span>
                <h2 className="type-subtitle font-bold text-secondary text-sm">
                  Customize your visibility
                </h2>
              </div>
              <div className="flex type-detail text-primary gap-2">
                <button
                  type="button"
                  onClick={() => setVisibilityMode("private")}
                  className="px-2.5 py-1 type-detail text-primary transition cursor-pointer"
                >
                  Make All Private
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilityMode("share_all")}
                  className="px-2.5 py-1 type-detail text-primary transition cursor-pointer"
                >
                  Make All Public
                </button>
              </div>
            </div>

            <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border">
              <div className="p-3 hover:bg-muted/20 transition">
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                    onClick={() => toggleAccordion("profile")}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 44 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="44"
                          height="44"
                          rx="22"
                          fill="#1C4D8D"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M22 22C24.7614 22 27 19.7614 27 17C27 14.2386 24.7614 12 22 12C19.2386 12 17 14.2386 17 17C17 19.7614 19.2386 22 22 22Z"
                          stroke="#1C4D8D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M30.5901 32C30.5901 28.13 26.7402 25 22.0002 25C17.2602 25 13.4102 28.13 13.4102 32"
                          stroke="#1C4D8D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-subtitle font-semibold text-grey-700 flex items-center gap-1.5">
                        Profile
                      </h4>
                      <span className="type-detail text-muted-foreground">
                        Profile photo, username, bio, gender, generation
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSelectiveField("profile")}
                      className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 cursor-pointer ${
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
                      className="p-1 text-muted-foreground hover:text-secondary rounded cursor-pointer"
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
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 44 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="44"
                          height="44"
                          rx="22"
                          fill="#3BC1A8"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M27 29C27 29.5304 26.7893 30.0391 26.4142 30.4142C26.0391 30.7893 25.5304 31 25 31H14C13.4696 31 12.9609 30.7893 12.5858 30.4142C12.2107 30.0391 12 29.5304 12 29V21C12 20.6489 12.0924 20.3041 12.268 20C12.4435 19.696 12.696 19.4435 13 19.268M32 15.5L25.581 19.679C25.2585 19.8862 24.8833 19.9963 24.5 19.9963C24.1167 19.9963 23.7415 19.8862 23.419 19.679L17 15.5M19 13H30C31.1046 13 32 13.8954 32 15V23C32 24.1046 31.1046 25 30 25H19C17.8954 25 17 24.1046 17 23V15C17 13.8954 17.8954 13 19 13Z"
                          stroke="#3BC1A8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-subtitle font-semibold text-grey-700">
                        Contact Information
                      </h4>
                      <span className="type-detail text-muted-foreground">
                        Email address, phone numbers
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSelectiveField("contactInfo")}
                      className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 cursor-pointer ${
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
                      className="p-1 text-muted-foreground hover:text-secondary rounded cursor-pointer"
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
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 44 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="44"
                          height="44"
                          rx="22"
                          fill="#4663AC"
                          fillOpacity="0.2"
                        />
                        <rect x="10" y="10" width="24" height="24" />
                        <mask id="path-3-inside-1_55420_172364" fill="white">
                          <path d="M10.356 20.2826L13.9379 22.008V24.8803C13.9379 25.1219 14.0762 25.3421 14.2938 25.447L21.1463 28.7478C21.2314 28.7888 21.3247 28.81 21.4193 28.81H22.5707C22.6653 28.81 22.7585 28.7888 22.8437 28.7478L29.6772 25.456C29.8097 25.3921 29.9156 25.2839 29.9766 25.1502C29.9852 25.1313 29.9934 25.1122 30.0016 25.0931C30.035 25.015 30.0522 24.9309 30.0522 24.8461V22.008L31.0292 21.5374V25.4323C30.8178 25.5732 30.6548 25.7844 30.5759 26.0415L30.02 27.8529C29.9515 28.0763 29.9534 28.312 30.0255 28.5343L30.541 30.1231C30.688 30.5763 31.1067 30.8906 31.5829 30.9052C31.5861 30.9053 31.5892 30.9054 31.5924 30.9054L31.6081 30.9057C31.6113 30.9057 31.6146 30.9057 31.6179 30.9057C32.0861 30.9057 32.4994 30.6243 32.6711 30.1886L33.2671 28.6756C33.3591 28.4422 33.3707 28.1813 33.2998 27.9407L32.7441 26.0538C32.6666 25.7907 32.5023 25.5747 32.2871 25.4315V20.9315L33.644 20.2779C33.8616 20.173 34 19.9528 34 19.7112V19.2103C34 18.9688 33.8616 18.7486 33.644 18.6437L22.2679 13.1639C22.0954 13.0808 21.8945 13.0808 21.722 13.1639L10.356 18.6389C10.1384 18.7437 10 18.964 10 19.2056V19.716C10 19.9576 10.1384 20.1778 10.356 20.2826ZM31.6293 29.4016L31.2341 28.1839L31.6556 26.8106L32.081 28.2548L31.6293 29.4016ZM28.7943 24.4852L22.4271 27.5523H21.5628L15.1957 24.4852V22.614L21.722 25.7578C21.8083 25.7994 21.9016 25.8201 21.995 25.8201C22.0884 25.8201 22.1817 25.7994 22.2679 25.7578L28.7943 22.6141L28.7943 24.4852ZM21.9949 14.4286L32.4417 19.4608L29.2336 21.0062C29.2053 21.0152 29.1774 21.0257 29.1502 21.0387L21.9949 24.4855L14.8397 21.0387C14.8126 21.0257 14.7847 21.0152 14.7565 21.0062L11.5483 19.4608L21.9949 14.4286Z" />
                        </mask>
                        <path
                          d="M10.356 20.2826L13.9379 22.008V24.8803C13.9379 25.1219 14.0762 25.3421 14.2938 25.447L21.1463 28.7478C21.2314 28.7888 21.3247 28.81 21.4193 28.81H22.5707C22.6653 28.81 22.7585 28.7888 22.8437 28.7478L29.6772 25.456C29.8097 25.3921 29.9156 25.2839 29.9766 25.1502C29.9852 25.1313 29.9934 25.1122 30.0016 25.0931C30.035 25.015 30.0522 24.9309 30.0522 24.8461V22.008L31.0292 21.5374V25.4323C30.8178 25.5732 30.6548 25.7844 30.5759 26.0415L30.02 27.8529C29.9515 28.0763 29.9534 28.312 30.0255 28.5343L30.541 30.1231C30.688 30.5763 31.1067 30.8906 31.5829 30.9052C31.5861 30.9053 31.5892 30.9054 31.5924 30.9054L31.6081 30.9057C31.6113 30.9057 31.6146 30.9057 31.6179 30.9057C32.0861 30.9057 32.4994 30.6243 32.6711 30.1886L33.2671 28.6756C33.3591 28.4422 33.3707 28.1813 33.2998 27.9407L32.7441 26.0538C32.6666 25.7907 32.5023 25.5747 32.2871 25.4315V20.9315L33.644 20.2779C33.8616 20.173 34 19.9528 34 19.7112V19.2103C34 18.9688 33.8616 18.7486 33.644 18.6437L22.2679 13.1639C22.0954 13.0808 21.8945 13.0808 21.722 13.1639L10.356 18.6389C10.1384 18.7437 10 18.964 10 19.2056V19.716C10 19.9576 10.1384 20.1778 10.356 20.2826ZM31.6293 29.4016L31.2341 28.1839L31.6556 26.8106L32.081 28.2548L31.6293 29.4016ZM28.7943 24.4852L22.4271 27.5523H21.5628L15.1957 24.4852V22.614L21.722 25.7578C21.8083 25.7994 21.9016 25.8201 21.995 25.8201C22.0884 25.8201 22.1817 25.7994 22.2679 25.7578L28.7943 22.6141L28.7943 24.4852ZM21.9949 14.4286L32.4417 19.4608L29.2336 21.0062C29.2053 21.0152 29.1774 21.0257 29.1502 21.0387L21.9949 24.4855L14.8397 21.0387C14.8126 21.0257 14.7847 21.0152 14.7565 21.0062L11.5483 19.4608L21.9949 14.4286Z"
                          fill="#1C4D8D"
                        />
                        <path
                          d="M10.356 20.2826L9.4878 22.0844L9.48801 22.0845L10.356 20.2826ZM13.9379 22.008H15.9379V20.7515L14.8058 20.2062L13.9379 22.008ZM14.2938 25.447L13.4257 27.2487L13.4259 27.2488L14.2938 25.447ZM21.1463 28.7478L20.2783 30.5497L20.2792 30.5501L21.1463 28.7478ZM22.8437 28.7478L23.71 30.5505L23.7117 30.5496L22.8437 28.7478ZM29.6772 25.456L30.5452 27.2579L30.5461 27.2574L29.6772 25.456ZM29.9766 25.1502L28.1569 24.3204L28.1567 24.3206L29.9766 25.1502ZM30.0016 25.0931L31.8396 25.8815L31.8408 25.8788L30.0016 25.0931ZM30.0522 22.008L29.1842 20.2061L28.0522 20.7514V22.008H30.0522ZM31.0292 21.5374H33.0292V18.354L30.1613 19.7355L31.0292 21.5374ZM31.0292 25.4323L32.1385 27.0964L33.0292 26.5027V25.4323H31.0292ZM30.5759 26.0415L28.6639 25.4546L28.6639 25.4547L30.5759 26.0415ZM30.02 27.8529L28.108 27.2661L28.1078 27.2668L30.02 27.8529ZM30.0255 28.5343L28.123 29.1513L28.1231 29.1515L30.0255 28.5343ZM30.541 30.1231L32.4434 29.5059L32.4433 29.5058L30.541 30.1231ZM31.5829 30.9052L31.6464 28.9062L31.6444 28.9062L31.5829 30.9052ZM31.5924 30.9054L31.6245 28.9057L31.6241 28.9057L31.5924 30.9054ZM31.6081 30.9057L31.576 32.9054L31.5773 32.9054L31.6081 30.9057ZM32.6711 30.1886L30.8103 29.4555L30.8102 29.4556L32.6711 30.1886ZM33.2671 28.6756L31.4065 27.942L31.4063 27.9425L33.2671 28.6756ZM33.2998 27.9407L31.3813 28.5058L31.3814 28.5061L33.2998 27.9407ZM32.7441 26.0538L30.8254 26.6185L30.8256 26.6189L32.7441 26.0538ZM32.2871 25.4315H30.2871V26.503L31.1791 27.0966L32.2871 25.4315ZM32.2871 20.9315L31.4191 19.1297L30.2871 19.675V20.9315H32.2871ZM33.644 20.2779L34.512 22.0797L34.5122 22.0796L33.644 20.2779ZM33.644 18.6437L34.5122 16.842L34.512 16.8419L33.644 18.6437ZM22.2679 13.1639L23.1358 11.362L23.1355 11.3619L22.2679 13.1639ZM21.722 13.1639L20.8542 11.362L20.854 11.362L21.722 13.1639ZM10.356 18.6389L11.2238 20.4408L11.2239 20.4408L10.356 18.6389ZM31.6293 29.4016L29.7269 30.0189L31.4472 35.3206L33.4901 30.1347L31.6293 29.4016ZM31.2341 28.1839L29.3221 27.5972L29.1369 28.2007L29.3318 28.8012L31.2341 28.1839ZM31.6556 26.8106L33.5741 26.2454L31.6947 19.8658L29.7436 26.2239L31.6556 26.8106ZM32.081 28.2548L33.9418 28.9879L34.1937 28.3487L33.9995 27.6897L32.081 28.2548ZM28.7943 24.4852L29.6622 26.287L30.7942 25.7418L30.7943 24.4853L28.7943 24.4852ZM22.4271 27.5523V29.5523H22.8837L23.2951 29.3541L22.4271 27.5523ZM21.5628 27.5523L20.6948 29.3541L21.1062 29.5523H21.5628V27.5523ZM15.1957 24.4852H13.1957V25.7417L14.3278 26.287L15.1957 24.4852ZM15.1957 22.614L16.0637 20.8122L13.1957 19.4307V22.614H15.1957ZM21.722 25.7578L22.5903 23.9561L22.59 23.9559L21.722 25.7578ZM22.2679 25.7578L23.1358 27.5597L23.1359 27.5596L22.2679 25.7578ZM28.7943 22.6141L30.7943 22.6141L30.7944 19.4307L27.9264 20.8122L28.7943 22.6141ZM21.9949 14.4286L22.8629 12.6267L21.9949 12.2086L21.127 12.6267L21.9949 14.4286ZM32.4417 19.4608L33.3097 21.2626L37.0502 19.4608L33.3097 17.659L32.4417 19.4608ZM29.2336 21.0062L29.8374 22.9128L29.9732 22.8698L30.1015 22.808L29.2336 21.0062ZM29.1502 21.0387L28.2853 19.2354L28.2823 19.2369L29.1502 21.0387ZM21.9949 24.4855L21.127 26.2873L21.9949 26.7055L22.8629 26.2873L21.9949 24.4855ZM14.8397 21.0387L15.7077 19.2369L15.7059 19.236L14.8397 21.0387ZM14.7565 21.0062L13.8885 22.808L14.0164 22.8696L14.1516 22.9125L14.7565 21.0062ZM11.5483 19.4608L10.6803 17.6589L6.93977 19.4607L10.6803 21.2626L11.5483 19.4608ZM10.356 20.2826L9.48801 22.0845L13.0699 23.8099L13.9379 22.008L14.8058 20.2062L11.2239 18.4808L10.356 20.2826ZM13.9379 22.008H11.9379V24.8803H13.9379H15.9379V22.008H13.9379ZM13.9379 24.8803H11.9379C11.9379 25.8901 12.5162 26.8105 13.4257 27.2487L14.2938 25.447L15.162 23.6452C15.6363 23.8737 15.9379 24.3537 15.9379 24.8803H13.9379ZM14.2938 25.447L13.4259 27.2488L20.2783 30.5496L21.1463 28.7478L22.0143 26.946L15.1618 23.6451L14.2938 25.447ZM21.1463 28.7478L20.2792 30.5501C20.6349 30.7212 21.0245 30.81 21.4193 30.81V28.81V26.81C21.625 26.81 21.828 26.8564 22.0134 26.9455L21.1463 28.7478ZM21.4193 28.81V30.81H22.5707V28.81V26.81H21.4193V28.81ZM22.5707 28.81V30.81C22.9658 30.81 23.355 30.721 23.71 30.5505L22.8437 28.7478L21.9775 26.9451C22.162 26.8565 22.3647 26.81 22.5707 26.81V28.81ZM22.8437 28.7478L23.7117 30.5496L30.5452 27.2579L29.6772 25.456L28.8093 23.6542L21.9758 26.946L22.8437 28.7478ZM29.6772 25.456L30.5461 27.2574C31.0989 26.9908 31.5415 26.539 31.7965 25.9797L29.9766 25.1502L28.1567 24.3206C28.2897 24.0288 28.5205 23.7934 28.8083 23.6546L29.6772 25.456ZM29.9766 25.1502L31.7963 25.98C31.8156 25.9377 31.8322 25.8989 31.8396 25.8815L30.0016 25.0931L28.1636 24.3047C28.1594 24.3143 28.1575 24.3188 28.1561 24.322C28.1548 24.3249 28.1553 24.3238 28.1569 24.3204L29.9766 25.1502ZM30.0016 25.0931L31.8408 25.8788C31.9802 25.5524 32.0522 25.2011 32.0522 24.8461H30.0522H28.0522C28.0522 24.6608 28.0897 24.4776 28.1624 24.3074L30.0016 25.0931ZM30.0522 24.8461H32.0522V22.008H30.0522H28.0522V24.8461H30.0522ZM30.0522 22.008L30.9201 23.8099L31.8972 23.3392L31.0292 21.5374L30.1613 19.7355L29.1842 20.2061L30.0522 22.008ZM31.0292 21.5374H29.0292V25.4323H31.0292H33.0292V21.5374H31.0292ZM31.0292 25.4323L29.9199 23.7681C29.334 24.1586 28.8815 24.746 28.6639 25.4546L30.5759 26.0415L32.4878 26.6285C32.4282 26.8227 32.3016 26.9877 32.1385 27.0964L31.0292 25.4323ZM30.5759 26.0415L28.6639 25.4547L28.108 27.2661L30.02 27.8529L31.9319 28.4397L32.4879 26.6283L30.5759 26.0415ZM30.02 27.8529L28.1078 27.2668C27.9191 27.8825 27.9242 28.5382 28.123 29.1513L30.0255 28.5343L31.9279 27.9172C31.9825 28.0857 31.9839 28.2701 31.9321 28.4391L30.02 27.8529ZM30.0255 28.5343L28.1231 29.1515L28.6386 30.7403L30.541 30.1231L32.4433 29.5058L31.9278 27.917L30.0255 28.5343ZM30.541 30.1231L28.6386 30.7402C29.0461 31.9965 30.2015 32.8637 31.5215 32.9043L31.5829 30.9052L31.6444 28.9062C32.0119 28.9175 32.3299 29.1561 32.4434 29.5059L30.541 30.1231ZM31.5829 30.9052L31.5195 32.9042C31.5409 32.9049 31.5596 32.9051 31.5606 32.9052L31.5924 30.9054L31.6241 28.9057C31.6221 28.9056 31.6245 28.9057 31.6276 28.9057C31.6312 28.9058 31.6379 28.9059 31.6464 28.9062L31.5829 30.9052ZM31.5924 30.9054L31.5603 32.9052L31.576 32.9054L31.6081 30.9057L31.6402 28.9059L31.6245 28.9057L31.5924 30.9054ZM31.6081 30.9057L31.5773 32.9054C31.5985 32.9058 31.617 32.9057 31.6179 32.9057V30.9057V28.9057C31.6157 28.9057 31.6179 28.9057 31.6208 28.9057C31.624 28.9057 31.6305 28.9058 31.6388 28.9059L31.6081 30.9057ZM31.6179 30.9057V32.9057C32.9078 32.9057 34.0592 32.1216 34.5319 30.9216L32.6711 30.1886L30.8102 29.4556C30.9397 29.1269 31.2643 28.9057 31.6179 28.9057V30.9057ZM32.6711 30.1886L34.5319 30.9217L35.1279 29.4086L33.2671 28.6756L31.4063 27.9425L30.8103 29.4555L32.6711 30.1886ZM33.2671 28.6756L35.1278 29.4091C35.3831 28.7614 35.4151 28.0433 35.2183 27.3753L33.2998 27.9407L31.3814 28.5061C31.3263 28.3193 31.3351 28.1231 31.4065 27.942L33.2671 28.6756ZM33.2998 27.9407L35.2183 27.3756L34.6626 25.4887L32.7441 26.0538L30.8256 26.6189L31.3813 28.5058L33.2998 27.9407ZM32.7441 26.0538L34.6627 25.4891C34.4503 24.7675 33.9943 24.1652 33.395 23.7664L32.2871 25.4315L31.1791 27.0966C31.0102 26.9842 30.883 26.8139 30.8254 26.6185L32.7441 26.0538ZM32.2871 25.4315H34.2871V20.9315H32.2871H30.2871V25.4315H32.2871ZM32.2871 20.9315L33.155 22.7334L34.512 22.0797L33.644 20.2779L32.776 18.476L31.4191 19.1297L32.2871 20.9315ZM33.644 20.2779L34.5122 22.0796C35.4216 21.6414 36 20.7211 36 19.7112H34H32C32 19.1845 32.3017 18.7046 32.7759 18.4761L33.644 20.2779ZM34 19.7112H36V19.2103H34H32V19.7112H34ZM34 19.2103H36C36 18.2006 35.4216 17.2802 34.5122 16.842L33.644 18.6437L32.7759 20.4454C32.3016 20.2169 32 19.737 32 19.2103H34ZM33.644 18.6437L34.512 16.8419L23.1358 11.362L22.2679 13.1639L21.4 14.9657L32.7761 20.4456L33.644 18.6437ZM22.2679 13.1639L23.1355 11.3619C22.4148 11.0148 21.5751 11.0147 20.8542 11.362L21.722 13.1639L22.5898 14.9658C22.2138 15.1469 21.776 15.1468 21.4003 14.9659L22.2679 13.1639ZM21.722 13.1639L20.854 11.362L9.48801 16.8371L10.356 18.6389L11.2239 20.4408L22.5899 14.9657L21.722 13.1639ZM10.356 18.6389L9.48814 16.837C8.57823 17.2752 8 18.1959 8 19.2056H10H12C12 19.732 11.6985 20.2122 11.2238 20.4408L10.356 18.6389ZM10 19.2056H8V19.716H10H12V19.2056H10ZM10 19.716H8C8 20.726 8.57851 21.6462 9.4878 22.0844L10.356 20.2826L11.2241 18.4809C11.6982 18.7093 12 19.1892 12 19.716H10ZM31.6293 29.4016L33.5316 28.7844L33.1365 27.5667L31.2341 28.1839L29.3318 28.8012L29.7269 30.0189L31.6293 29.4016ZM31.2341 28.1839L33.1461 28.7707L33.5676 27.3973L31.6556 26.8106L29.7436 26.2239L29.3221 27.5972L31.2341 28.1839ZM31.6556 26.8106L29.7371 27.3758L30.1625 28.82L32.081 28.2548L33.9995 27.6897L33.5741 26.2454L31.6556 26.8106ZM32.081 28.2548L30.2202 27.5218L29.7684 28.6686L31.6293 29.4016L33.4901 30.1347L33.9418 28.9879L32.081 28.2548ZM28.7943 24.4852L27.9263 22.6834L21.5592 25.7504L22.4271 27.5523L23.2951 29.3541L29.6622 26.287L28.7943 24.4852ZM22.4271 27.5523V25.5523H21.5628V27.5523V29.5523H22.4271V27.5523ZM21.5628 27.5523L22.4308 25.7504L16.0637 22.6834L15.1957 24.4852L14.3278 26.287L20.6948 29.3541L21.5628 27.5523ZM15.1957 24.4852H17.1957V22.614H15.1957H13.1957V24.4852H15.1957ZM15.1957 22.614L14.3278 24.4159L20.8541 27.5596L21.722 25.7578L22.59 23.9559L16.0637 20.8122L15.1957 22.614ZM21.722 25.7578L20.8538 27.5595C21.2149 27.7335 21.6055 27.8201 21.995 27.8201V25.8201V23.8201C22.1977 23.8201 22.4016 23.8652 22.5903 23.9561L21.722 25.7578ZM21.995 25.8201V27.8201C22.3847 27.8201 22.7751 27.7334 23.1358 27.5597L22.2679 25.7578L21.4001 23.9559C21.5882 23.8653 21.792 23.8201 21.995 23.8201V25.8201ZM22.2679 25.7578L23.1359 27.5596L29.6623 24.4159L28.7943 22.6141L27.9264 20.8122L21.4 23.9559L22.2679 25.7578ZM28.7943 22.6141L26.7943 22.614L26.7943 24.4852L28.7943 24.4852L30.7943 24.4853L30.7943 22.6141L28.7943 22.6141ZM21.9949 14.4286L21.127 16.2304L31.5738 21.2627L32.4417 19.4608L33.3097 17.659L22.8629 12.6267L21.9949 14.4286ZM32.4417 19.4608L31.5738 17.659L28.3656 19.2044L29.2336 21.0062L30.1015 22.808L33.3097 21.2626L32.4417 19.4608ZM29.2336 21.0062L28.6297 19.0995C28.5331 19.1301 28.4148 19.1733 28.2853 19.2354L29.1502 21.0387L30.0152 22.842C29.94 22.878 29.8774 22.9002 29.8374 22.9128L29.2336 21.0062ZM29.1502 21.0387L28.2823 19.2369L21.127 22.6837L21.9949 24.4855L22.8629 26.2873L30.0182 22.8405L29.1502 21.0387ZM21.9949 24.4855L22.8629 22.6837L15.7077 19.2369L14.8397 21.0387L13.9717 22.8405L21.127 26.2873L21.9949 24.4855ZM14.8397 21.0387L15.7059 19.236C15.5758 19.1735 15.4571 19.1302 15.3613 19.0999L14.7565 21.0062L14.1516 22.9125C14.1123 22.9001 14.0494 22.8779 13.9735 22.8414L14.8397 21.0387ZM14.7565 21.0062L15.6244 19.2044L12.4162 17.6589L11.5483 19.4608L10.6803 21.2626L13.8885 22.808L14.7565 21.0062ZM11.5483 19.4608L12.4162 21.2626L22.8629 16.2304L21.9949 14.4286L21.127 12.6267L10.6803 17.6589L11.5483 19.4608Z"
                          fill="#696969"
                          mask="url(#path-3-inside-1_55420_172364)"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-subtitle font-semibold text-grey-700">
                        Education
                      </h4>
                      <span className="type-detail text-muted-foreground">
                        University, major, skills, resume/CV
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSelectiveField("education")}
                      className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 cursor-pointer${
                        selectiveConfig.education
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
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
                      className="p-1 text-muted-foreground hover:text-secondary rounded cursor-pointer"
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
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 44 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="44"
                          height="44"
                          rx="22"
                          fill="#FF9F2E"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M22 32C27.5228 32 32 27.5228 32 22C32 16.4772 27.5228 12 22 12C16.4772 12 12 16.4772 12 22C12 27.5228 16.4772 32 22 32Z"
                          stroke="#FF9F2E"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.0016 13H19.0016C17.0516 18.84 17.0516 25.16 19.0016 31H18.0016"
                          stroke="#FF9F2E"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M25 13C26.95 18.84 26.95 25.16 25 31"
                          stroke="#FF9F2E"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 26V25C18.84 26.95 25.16 26.95 31 25V26"
                          stroke="#FF9F2E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 19.0016C18.84 17.0516 25.16 17.0516 31 19.0016"
                          stroke="#FF9F2E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="type-subtitle font-semibold text-grey-700">
                        Social Accounts
                      </h4>
                      <span className="type-detail text-muted-foreground">
                        LinkedIn, GitHub, Facebook, Telegram
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSelectiveField("socialAccounts")}
                      className={`px-3 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 cursor-pointer ${
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
                      className="p-1 text-muted-foreground hover:text-secondary rounded cursor-pointer"
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
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-2xl type-desc-semibold hover:opacity-90 shadow-sm transition cursor-pointer">
          Save changes
        </button>
      </div>
    </div>
  );
}
