"use client";

import {
  Lock,
  Eye,
  Link2,
  UserCircle,
  Phone,
  Cake,
  Code2,
  Mails,
  User,
  GraduationCap
} from "lucide-react";

interface SelectiveVisibility {
  profile: boolean;
  contactInfo: boolean;
  education: boolean;
  socialAccounts: boolean;
}

interface ProfilePrivacyProps {
  visibilityMode: "share_all" | "private" | "selective";
  selectiveConfig: SelectiveVisibility;
}

export default function ProfilePrivacy({ visibilityMode, selectiveConfig }: ProfilePrivacyProps) {
  return (
    <div className="lg:col-span-5 lg:sticky lg:top-6 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-fit w-full">
      <div className="p-4 border-b border-slate-100">
        <h2 className="font-bold text-slate-800 text-sm">Preview As Public</h2>
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

            <h3 className="font-bold text-slate-800 text-base leading-tight mb-0.5 tracking-tight">
              Chham Kaknika
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-12">@kaknika</p>

            <div className="w-full px-4 mb-4">
              <div className="bg-[#f9fafb] border border-slate-100 py-2.5 rounded-xl text-center flex items-center justify-center">
                <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                  Chham Kaknika's profile is locked
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {(visibilityMode === "share_all" || selectiveConfig.profile) && (
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

            {(visibilityMode === "share_all" || selectiveConfig.profile) && (
              <div className="text-center w-full">
                <h3 className="font-bold text-slate-800 text-base leading-tight mb-0.5 tracking-tight">
                  Chham Kaknika
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-4">
                  @kaknika
                </p>
              </div>
            )}

            {(visibilityMode === "share_all" || selectiveConfig.profile) && (
              <p className="text-xs text-slate-600 text-center leading-relaxed px-2 mb-6">
                Dedicated FullStack web Development student with a passion for
                building scalable HR solutions and strategic talent acquisition
                platforms.
              </p>
            )}

            {(visibilityMode === "share_all" ||
              selectiveConfig.profile ||
              selectiveConfig.contactInfo ||
              selectiveConfig.education) && (
              <div className="w-full space-y-3.5 border-t border-slate-100 pt-5">
                <h4 className="text-slate-800 font-semibold text-xs tracking-wide">
                  Personal Information
                </h4>

                <div className="space-y-3">
                  {(visibilityMode === "share_all" ||
                    selectiveConfig.contactInfo) && (
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <Mails className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">kaknika@gmail.com</span>
                      {visibilityMode === "selective" && (
                        <Lock className="w-3 h-3 text-slate-300 ml-auto" />
                      )}
                    </div>
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
                        <span>Fullstack web development</span>
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
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-7 h-7 bg-[#24A1DE] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
                  aria-label="Telegram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M11.944 0C5.344 0 0 5.344 0 11.944c0 6.6 5.344 11.944 11.944 11.944 6.6 0 11.944-5.344 11.944-11.944C23.888 5.344 18.544 0 11.944 0zm5.512 8.16l-1.896 8.928c-.144.648-.528.808-1.072.504l-2.888-2.128-1.392 1.344c-.152.152-.28.28-.576.28l.208-2.928 5.336-4.824c.232-.208-.048-.32-.36-.112L8.08 13.16l-2.84-.888c-.616-.192-.632-.616.128-.912l11.104-4.28c.512-.184.96.12.784.912z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-7 h-7 bg-[#24292E] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
                  aria-label="GitHub"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-7 h-7 bg-[#0077B5] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
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
  );
}