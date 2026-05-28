"use client";
import React from "react";
import { useState } from "react";
import { Mail, Calendar, Users, Code, Phone, GraduationCap } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/data/mock-user";
import { MOCK_CURRENT_USER } from "@/data/mock-user";
import EndorseStudentModal from "../pop-up/EndorseStep";

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 w-full">
    <span className="text-primary shrink-0">{icon}</span>
    <span className="type-detail text-grey-900 truncate">{text}</span>
  </div>
);

const FemaleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.6875 16.125C10.8977 16.125 13.5 13.5227 13.5 10.3125C13.5 7.10234 10.8977 4.5 7.6875 4.5C4.47734 4.5 1.875 7.10234 1.875 10.3125C1.875 13.5227 4.47734 16.125 7.6875 16.125Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.125 1.875L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.25 1.875H16.125V6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const socials = [
  {
    name: "Facebook",
    svg: (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <rect width="30" height="30" fill="url(#pattern0_55249_171323)" />
        <defs>
          <pattern id="pattern0_55249_171323" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_55249_171323" transform="scale(0.0018797)" />
          </pattern>
          <image id="image0_55249_171323" width="532" height="532" preserveAspectRatio="none" />
        </defs>
      </svg>
    ),
  },
  {
    name: "Telegram",
    svg: (
      <svg width="30" height="30" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <rect width="30" height="30" fill="url(#pattern0_55249_171325)" />
        <defs>
          <pattern id="pattern0_55249_171325" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_55249_171325" transform="scale(0.0018797)" />
          </pattern>
          <image id="image0_55249_171325" width="532" height="532" preserveAspectRatio="none" />
        </defs>
      </svg>
    ),
  },
  {
    name: "GitHub",
    svg: (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <rect width="30" height="30" fill="url(#pattern0_55249_171327)" />
        <defs>
          <pattern id="pattern0_55249_171327" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_55249_171327" transform="scale(0.0018797)" />
          </pattern>
          <image id="image0_55249_171327" width="532" height="532" preserveAspectRatio="none" />
        </defs>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    svg: (
      <svg width="35" height="36" viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <rect width="35" height="36" fill="url(#pattern0_55249_171329)" />
        <defs>
          <pattern id="pattern0_55249_171329" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_55249_171329" transform="matrix(0.0019334 0 0 0.0018797 -0.0142857 0)" />
          </pattern>
          <image id="image0_55249_171329" width="532" height="532" preserveAspectRatio="none" />
        </defs>
      </svg>
    ),
  },
];

export default function ProfileCard({ userRole }: { userRole: UserRole }) {
  const [isEndorseOpen, setIsEndorseOpen] = useState(false);
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-full w-full overflow-hidden">
      <div className="h-32 bg-primary w-full rounded-xl shrink-0" />
      <div className="px-6 pb-6 flex flex-col items-center -mt-16 w-full grow justify-between">
        <div className="w-full flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-card overflow-hidden bg-grey-100 shadow-sm mb-4 shrink-0 relative z-10">
            <img src="/images/profile.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-center w-full px-2">
            <h2 className="type-title text-primary font-bold text-xl">Chham Kaknika</h2>
            <p className="text-[20px] text-secondary mb-4 border-b pb-2.5 border-border">@kaknika</p>
            <p className="type-desc text-secondary mb-2 leading-relaxed">
              &quot;Dedicated Fullstack web Development student with a passion for building scalable HR solutions and strategic talent acquisition platforms&quot;
            </p>
          </div>
          <div className="w-full space-y-3 pt-6 text-left">
            <h3 className="type-subtitle-24 text-secondary font-semibold mb-4">Personal Information</h3>
            <InfoRow icon={<Mail size={16} />} text="kaknika@gmail.com" />
            <InfoRow icon={<Calendar size={16} />} text="12 July 2007" />
            <InfoRow icon={<Users size={16} />} text="14th Generation" />
            <InfoRow
              icon={<Code size={16} />}
              text="Fullstack web development"
            />
            <InfoRow icon={<Phone size={16} />} text="015849376" />
            <InfoRow icon={<GraduationCap size={16} />} text="Studying" />
            <InfoRow icon={<FemaleIcon />} text="Female" />
          </div>
        </div>
        <div className="w-full">
          <div className="mt-6 flex gap-3 w-full">
            {socials.map((social, i) => (
              <button key={i} aria-label={social.name} className="text-primary-foreground rounded-full transition-colors duration-150 cursor-pointer">
                {social.svg}
              </button>
            ))}
          </div>
          <div className="mt-6 w-full">
            {userRole === "admin" && (
               <Link href={`/profile/${MOCK_CURRENT_USER.id}/edit-profile`} className="block w-full">
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-md type-desc-semibold hover:opacity-90 transition-opacity font-medium cursor-pointer text-center">
                  Edit Profile
                </button>
              </Link>
            )}
            {userRole === "student" && (
              <Link href={`/profile/${MOCK_CURRENT_USER.id}/edit-profile`} className="block w-full">
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-md type-desc-semibold hover:opacity-90 transition-opacity font-medium cursor-pointer text-center">
                  Edit Profile
                </button>
              </Link>
            )}
            {userRole === "alumni" && (
              <button
              onClick={() => setIsEndorseOpen(true)}
               className="w-full bg-primary text-primary-foreground py-3 rounded-md type-desc-semibold hover:opacity-90 transition-opacity font-medium cursor-pointer">
                Endorse
              </button>
            )}
          </div>
        </div>
      </div>
      <EndorseStudentModal
        isOpen={isEndorseOpen}
        onClose={() => setIsEndorseOpen(false)}
        studentName="Elena Vance"
        studentAvatar="https://i.pravatar.cc/150?u=elena"
      />
    </div>
  );
}
