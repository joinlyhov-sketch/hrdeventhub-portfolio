import React from "react";
import {
  Eye,
  Mail,
  Code,
  Phone,
  GraduationCap,
  Cake,
  Users,
} from "lucide-react";
import Image from "next/image";

interface SelectiveVisibilityConfig {
  profile: boolean;
  contactInfo: boolean;
  education: boolean;
  socialAccounts: boolean;
}

interface ProfileCardProps {
  viewMode: "ADMIN" | "STUDENT_SELF" | "ALUMNI_VIEWING_STUDENT";
  visibilityMode: "share_all" | "private" | "selective";
  selectiveConfig: SelectiveVisibilityConfig;
}

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 w-full">
    <span className="text-primary shrink-0">{icon}</span>
    <span className="type-detail text-grey-900 truncate">{text}</span>
  </div>
);

const FemaleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.6875 16.125C10.8977 16.125 13.5 13.5227 13.5 10.3125C13.5 7.10234 10.8977 4.5 7.6875 4.5C4.47734 4.5 1.875 7.10234 1.875 10.3125C1.875 13.5227 4.47734 16.125 7.6875 16.125Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.125 1.875L12 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.25 1.875H16.125V6.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ProfilePrivacy({
  visibilityMode,
  selectiveConfig,
}: ProfileCardProps) {
  const socials = [
    {
      name: "Facebook",
      svg: (
        <Image src={"/facebook.svg"} alt="facebook" width={30} height={30} />
      ),
    },
    {
      name: "Telegram",
      svg: (
        <Image src={"/telegram.svg"} alt="telegram" width={30} height={30} />
      ),
    },
    {
      name: "GitHub",
      svg: <Image src={"/github.svg"} alt="github" width={30} height={30} />,
    },
    {
      name: "LinkedIn",
      svg: <Image src={"/linkin.svg"} alt="linkin" width={30} height={30} />,
    },
  ];
  if (visibilityMode === "private") {
    return (
      <>
        <div className="card border border-border rounded-2xl p-6 shadow-sm  flex flex-col gap-6 min-h-[800px]">
          <div className="w-full border-slate-100 type-subtitle-24 font-bold text-[#0f2d59]">
            Preview As Public
          </div>
          <div className="bg-primary w-full rounded-2xl h-[350px] shrink-0" />
          <div className="px-6 pb-6 flex flex-col items-center -mt-16 w-full grow justify-between">
            <div className="w-full flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-4 border-card overflow-hidden bg-grey-100 shadow-sm mb-4 shrink-0 relative z-10">
                <img
                  src="/images/Profiles.png"
                  alt="Chham Kaknika"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center w-full mt-2">
              <h3 className="type-title text-primary text-base leading-tight mb-0.5 tracking-tight">
                Chham Kaknika
              </h3>
              <p className="type-subtitle text-secondary font-medium mb-4">
                @kaknika
              </p>
            </div>

            <div className="w-full px-4 mb-4">
              <div className="border  py-2.5 rounded-2xl text-center flex items-center justify-center">
                <span className="text-grey-400 type-subtitle tracking-wide">
                  Chham Kaknika&apos;s profile is Locked
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 type-detail flex items-center justify-center gap-1.5 text-[10px] text-[0F2854]">
          <Eye className="w-3.5 h-3.5" />
          <span>Only visible information is shown to others</span>
        </div>
      </>
    );
  }

  const showProfile = visibilityMode === "share_all" || selectiveConfig.profile;
  const showContact =
    visibilityMode === "share_all" || selectiveConfig.contactInfo;
  const showEducation =
    visibilityMode === "share_all" || selectiveConfig.education;

  return (
    <>
      <div
        className={`xl:col-span-8 w-full h-full bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6 min-h-[00px]`}
      >
        <div
          className={`w-full border-slate-100 type-subtitle-24 font-bold text-[#0f2d59]`}
        >
          Preview As Public
        </div>
        {showProfile && (
          <>
            <div className="h-36 bg-[#1e4e8c]  border border-border rounded-2xl p-6 shadow-sm shrink-0 relative" />

            <div className="px-6 flex flex-col items-center -mt-16 w-full relative z-10">
              <div className="w-32 h-32 rounded-full mb-4">
                <img
                  src="/images/Profiles.png"
                  alt="Chham Kaknika"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center w-full mt-2">
                <h3 className="type-title text-primary text-base leading-tight mb-0.5 tracking-tight">
                  Chham Kaknika
                </h3>
                <p className="text-[20px] text-secondary mb-3 pb-2.5 border-b border-border">
                  @kaknika
                </p>

                <p className="text-xs text-seconary text-center leading-relaxed font-medium px-4 max-w-md mx-auto">
                  &quot;Dedicated FullStack web Development student with a
                  passion for building scalable HR solutions and strategic
                  talent acquisition platforms&quot;
                </p>
              </div>
            </div>
          </>
        )}
        {!showProfile && !showContact && !showEducation ? (
          <div className="h-[700px] flex justify-center items-center">
            No Content ...
          </div>
        ) : (
          <></>
        )}

        <div className="px-6 flex-1 flex flex-col justify-between">
          {(showProfile || showContact || showEducation) && (
            <div className="w-full space-y-4 pt-2">
              <h4 className="type-subtitle-24 text-primary mb-3">
                Personal Information
              </h4>

              {showContact && (
                <div className="space-y-3.5">
                  <InfoRow icon={<Mail size={16} />} text="kaknika@gmail.com" />
                  <InfoRow icon={<Cake size={16} />} text="12 July 2007" />
                  <InfoRow icon={<Users size={16} />} text="14th Generation" />
                  <InfoRow
                    icon={<Code size={16} />}
                    text="Fullstack web development"
                  />
                  <InfoRow icon={<Phone size={16} />} text="015849376" />
                  <InfoRow icon={<GraduationCap size={16} />} text="Studying" />
                  <InfoRow icon={<FemaleIcon />} text="Female" />
                </div>
              )}
            </div>
          )}
          {/* <div className="mt-6 flex gap-3 w-full">
            {socials.map((social, i) => (
              <button
                key={i}
                aria-label={social.name}
                className="text-primary-foreground rounded-full transition-colors duration-150 cursor-pointer"
              >
                {social.svg}
              </button>
            ))}
          </div> */}
        </div>
      </div>
      <div className="p-3 type-detail flex items-center justify-center gap-1.5 text-[10px] text-[0F2854]">
        <Eye className="w-3.5 h-3.5" />
        <span>Only visible information is shown to others</span>
      </div>
    </>
  );
}
