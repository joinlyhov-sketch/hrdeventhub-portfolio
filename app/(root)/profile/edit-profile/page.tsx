"use client";

import React, { useState } from "react";
import {
  Camera,
  Trash2,
  X,
  Lock,
  Check,
  Globe,
} from "lucide-react";

type Role = "admin" | "organizer" | "student";

type CurrentUser = {
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
};

const MOCK_CURRENT_USER: CurrentUser = {
  name: "Dita Rector",
  email: "RectorDita@gmail.com",
  role: "student",
  avatarInitials: "DR",
};

export default function ProfilePage() {
  const [currentUser] = useState<CurrentUser | null>(MOCK_CURRENT_USER);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-grey-50 flex items-center justify-center">
        <p className="type-desc text-grey-500 animate-pulse">
          Loading profile records...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-50 md:p-10 transition-all duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="type-title text-secondary">
            {currentUser.role === "student"
              ? "Student Profile"
              : "Edit Profile"}
          </h1>
          <p className="type-detail text-grey-500 mt-1">
            {currentUser.role === "student"
              ? "View and update your personal portfolio records"
              : "Manage and organize system core fields and parameters"}
          </p>
        </div>

        {currentUser.role === "student" ? (
          <StudentProfileForm />
        ) : (
          <AdminProfileForm user={currentUser} />
        )}
      </div>
    </div>
  );
}

function StudentProfileForm() {
  const [skills, setSkills] = useState([
    "React.js",
    "TailwindCSS",
    "Next.js",
    "Laravel",
    "MySQL",
  ]);

  return (
    <div className="bg-white rounded-lg border border-border shadow-xs p-6 space-y-8">
      <div className="space-y-6">
        <h2 className="type-subtitle text-secondary border-b border-border pb-2">
          Edit Information
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="relative group w-24 h-24 bg-grey-900 rounded-full flex flex-col items-center justify-center cursor-pointer overflow-hidden border border-border shrink-0">
            <Camera className="w-6 h-6 text-white mb-1" />
            <span className="text-[10px] text-grey-300 font-medium text-center px-1">
              Upload Profile
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
            <InputField label="First Name" defaultValue="Kaknika" />
            <InputField label="Last Name" defaultValue="Chham" />
            <InputField label="Username" defaultValue="Kaknika" />
            <InputField label="Date of Birth" defaultValue="2007/07/12" />

            <div className="flex flex-col gap-1.5">
              <label className="type-detail-semibold text-grey-900">
                Current Status
              </label>
              <select className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary">
                <option>Studying</option>
                <option>Graduated</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="type-detail-semibold text-grey-900">
                Gender
              </label>
              <select className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary">
                <option>Female</option>
                <option>Male</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Phone Number" defaultValue="+(855) 15 849 678" />
          <InputField
            label="Email"
            type="email"
            defaultValue="kaknika@gmail.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="type-detail-semibold text-grey-900">
            Profile Bio
          </label>
          <textarea
            rows={3}
            className="w-full p-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary resize-none"
            defaultValue="Dedicated Computer Science student at RUPP with a focus on building web structures using Next.js and secure APIs."
          />
        </div>
      </div>

      <section>
        <h2>Social Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-2 border border-border rounded-xl bg-card shadow-sm">
            <div className="flex-shrink-0">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="20" fill="#1C4D8D" />
                <path
                  d="M22.9883 25.5H24.4983C27.5183 25.5 29.9983 23.03 29.9983 20C29.9983 16.98 27.5283 14.5 24.4983 14.5H22.9883"
                  stroke="#F9F9F9"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17 14.5H15.5C12.47 14.5 10 16.97 10 20C10 23.02 12.47 25.5 15.5 25.5H17"
                  stroke="#F9F9F9"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16 20H24"
                  stroke="#F9F9F9"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div className="w-full">
              <label className="block type-detail-small-medium text-accent uppercase tracking-wider mb-0.5">
                LinkedIn
              </label>
              <input
                type="text"
                className="type-detail w-full outline-none text-foreground bg-transparent font-medium"
                defaultValue="linkedin.com/in/alexrichardson"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border border-border rounded-xl bg-card shadow-sm">
            <div className="flex-shrink-0">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="20" fill="var(--primary)" />
                <path
                  d="M17 27.0034C12 28.5034 12 24.5034 10 24.0034M24 30.0034V26.1334C24.0375 25.6565 23.9731 25.1772 23.811 24.7271C23.6489 24.2771 23.3929 23.8668 23.06 23.5234C26.2 23.1734 29.5 21.9834 29.5 16.5234C29.4997 15.1272 28.9627 13.7846 28 12.7734C28.4559 11.5519 28.4236 10.2017 27.91 9.00336C27.91 9.00336 26.73 8.65336 24 10.4834C21.708 9.86218 19.292 9.86218 17 10.4834C14.27 8.65336 13.09 9.00336 13.09 9.00336C12.5764 10.2017 12.5441 11.5519 13 12.7734C12.0301 13.7921 11.4925 15.1468 11.5 16.5534C11.5 21.9734 14.8 23.1634 17.94 23.5534C17.611 23.8933 17.3573 24.2988 17.1953 24.7433C17.0334 25.1878 16.9668 25.6614 17 26.1334V30.0034"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="w-full">
              <label className="block type-detail-small-medium text-accent uppercase tracking-wider mb-0.5">
                GitHub
              </label>
              <input
                type="text"
                className="type-detail w-full outline-none text-foreground bg-transparent font-medium"
                defaultValue="github.com/richardson"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border border-border rounded-xl bg-card shadow-sm">
            <div className="flex-shrink-0">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="20" fill="var(--primary)" />
                <path
                  d="M22.5 14H20.5C18.57 14 17 15.57 17 17.5V20H15V22.5H17V28H20.5V22.5H23L23.5 20H20.5V17.5C20.5 17.22 20.72 17 21 17H23.5V14Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="w-full">
              <label className="block type-detail-small-medium text-accent uppercase tracking-wider mb-0.5">
                Facebook
              </label>
              <input
                type="text"
                className="type-detail w-full outline-none text-foreground bg-transparent font-medium"
                defaultValue="Sophal Boy Loy"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border border-border rounded-xl bg-card shadow-sm">
            <div className="flex-shrink-0">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="20" fill="var(--primary)" />
                <path
                  d="M15.3997 14.3202L23.8897 11.4902C27.6997 10.2202 29.7697 12.3002 28.5097 16.1102L25.6797 24.6002C23.7797 30.3102 20.6597 30.3102 18.7597 24.6002L17.9197 22.0802L15.3997 21.2402C9.68969 19.3402 9.68969 16.2302 15.3997 14.3202Z"
                  stroke="#F9F9F9"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.1094 21.6525L21.6894 18.0625"
                  stroke="#F9F9F9"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="w-full">
              <label className="block type-detail-small-medium text-accent uppercase tracking-wider mb-0.5">
                Telegram
              </label>
              <input
                type="text"
                className="type-detail w-full outline-none text-foreground bg-transparent font-medium"
                defaultValue="@SophalZin2"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full mt-4 py-3 border border-dashed border-border rounded-xl flex items-center justify-center gap-2 text-muted-foreground type-detail-semibold hover:bg-muted/50 transition-colors"
        >
          <span>+ Add your social media</span>
        </button>
      </section>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="type-subtitle text-secondary">Education</h2>
          <button className="text-subtle type-detail-semibold flex items-center gap-1 hover:underline bg-transparent border-0 cursor-pointer">
            + add
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField
            label="University/Institute/Center"
            defaultValue="The Royal University of Phnom Penh"
          />
          <InputField label="Major/Course" defaultValue="Computer Science" />
          <InputField label="Start year" defaultValue="2023" />
          <InputField label="End year" defaultValue="2026" />
        </div>
      </div>

      <div className="space-y-3">
        <label className="type-detail-semibold text-grey-900 block">
          Skills & Expertise
        </label>
        <div className="flex flex-wrap gap-2 items-center">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 bg-grey-100 text-primary px-3 py-1 rounded-full type-detail-medium border border-border"
            >
              {skill}
              <X
                className="w-3 h-3 text-grey-500 cursor-pointer hover:text-destructive transition-colors"
                onClick={() => setSkills(skills.filter((_, i) => i !== index))}
              />
            </div>
          ))}
          <button className="flex items-center gap-1 px-3 py-1 border border-dashed border-border rounded-full text-grey-500 type-detail-medium bg-white hover:bg-grey-50 cursor-pointer">
            + Add Skill
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="type-detail-semibold text-grey-900 block">
          Resume
        </label>
        <div className="border border-dashed border-border rounded-lg p-6 bg-grey-50 flex flex-col items-center justify-center text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="48" height="48" rx="24" fill="#E5EEFF" />
            <path
              d="M21 29V23L19 25"
              stroke="#292D32"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 23L23 25"
              stroke="#292D32"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M34 22V27C34 32 32 34 27 34H21C16 34 14 32 14 27V21C14 16 16 14 21 14H26"
              stroke="#292D32"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M34 22H30C27 22 26 21 26 18V14L34 22Z"
              stroke="#292D32"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span className="type-detail-semibold text-grey-900">
            Upload New CV
          </span>
          <span className="type-detail-small-medium text-grey-400 mt-0.5 mb-3">
            PDF, DOCX up to 10MB
          </span>
          <button
            type="button"
            className="bg-primary text-white px-4 py-1.5 rounded-lg type-detail-medium hover:bg-primary-hover transition-colors border-0 cursor-pointer"
          >
            Select file
          </button>
        </div>

        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-grey-100 rounded text-grey-500 flex items-center justify-center">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30 12.375V27C30 31.5 27.315 33 24 33H12C8.685 33 6 31.5 6 27V12.375C6 7.5 8.685 6.375 12 6.375C12 7.305 12.375 8.14499 12.99 8.75999C13.605 9.37499 14.445 9.75 15.375 9.75H20.625C22.485 9.75 24 8.235 24 6.375C27.315 6.375 30 7.5 30 12.375Z"
                  stroke="#292D32"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 6.375C24 8.235 22.485 9.75 20.625 9.75H15.375C14.445 9.75 13.605 9.37499 12.99 8.75999C12.375 8.14499 12 7.305 12 6.375C12 4.515 13.515 3 15.375 3H20.625C21.555 3 22.395 3.37501 23.01 3.99001C23.625 4.60501 24 5.445 24 6.375Z"
                  stroke="#292D32"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 19.5H18"
                  stroke="#292D32"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 25.5H24"
                  stroke="#292D32"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span className="type-detail-medium text-grey-900">
              CV_Chham_Kaknika.pdf
            </span>
          </div>
          <button className="p-2 hover:bg-grey-100 rounded text-destructive transition-colors border-0 bg-transparent cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          className="px-5 py-2 border border-border rounded-lg type-detail-semibold text-grey-900 hover:bg-grey-50 bg-white cursor-pointer"
        >
          Discard Changes
        </button>
        <button
          type="button"
          className="px-5 py-2 bg-primary text-white rounded-lg type-detail-semibold hover:bg-primary-hover shadow-xs border-0 cursor-pointer"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

function AdminProfileForm({ user }: { user: CurrentUser }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-border p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center border border-border text-white type-subtitle-24 uppercase font-bold">
            {user.avatarInitials}
          </div>
          <div>
            <h3 className="type-subtitle text-secondary">{user.name}</h3>
            <p className="type-detail-small-medium text-subtle font-bold uppercase tracking-wider mt-0.5">
              Access Tier: {user.role}
            </p>
          </div>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg type-detail-semibold flex items-center gap-2 hover:bg-primary-hover shadow-xs border-0 cursor-pointer">
          <Lock className="w-4 h-4" /> Change Password
        </button>
      </div>

      <div className="bg-white rounded-lg border border-border p-6 shadow-xs space-y-6">
        <h2 className="type-subtitle text-secondary border-b border-border pb-2">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Full Name" defaultValue={user.name} />
          <InputField label="Gender" defaultValue="Female" />
          <InputField label="Date of Birth" defaultValue="1998-11-24" />
          <InputField
            label="Skills"
            defaultValue="System Infrastructure, Global Operations"
          />
          <InputField label="Phone Number" defaultValue="+(855) 12 345 678" />
          <InputField label="Email" type="email" defaultValue={user.email} />
        </div>

        <InputField label="Address" defaultValue="Phnom Penh, Cambodia" />

        <div className="flex justify-end pt-2">
          <button
            type="button"
            className="px-5 py-2 bg-primary text-white rounded-lg type-detail-semibold hover:bg-primary-hover shadow-xs border-0 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border p-6 shadow-xs space-y-4">
        <div>
          <h3 className="type-detail-semibold text-secondary flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> WeBill365 Information
          </h3>
          <p className="type-detail-small-medium text-grey-400 mt-0.5">
            Manage synchronized billing integrations for real-time room tracking
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-grey-50 border border-border rounded-lg gap-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-subtle/10 border border-subtle flex items-center justify-center text-subtle shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <div>
              <p className="type-detail-semibold text-grey-900">
                Account Synchronized
              </p>
              <p className="type-detail-small-medium text-grey-500">
                System parameters are verified. Live transactions are actively
                passing validation gates.
              </p>
            </div>
          </div>
          <button className="bg-action hover:bg-amber-600 text-grey-900 font-semibold px-4 py-2 rounded-lg type-detail-semibold whitespace-nowrap shadow-xs border-0 cursor-pointer transition-colors">
            Disconnect WeBill365
          </button>
        </div>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
}

function InputField({
  label,
  placeholder,
  type = "text",
  defaultValue = "",
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="type-detail-semibold text-grey-900">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full h-10 px-4 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary transition-colors"
      />
    </div>
  );
}

interface SocialInputFieldProps {
  label: string;
  defaultValue: string;
  icon: React.ReactNode;
}

function SocialInputField({
  label,
  defaultValue,
  icon,
}: SocialInputFieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-[10px] tracking-wider text-subtle font-bold uppercase">
        {label}
      </span>
      <div className="flex items-center gap-3 w-full">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border shadow-xs">
          {icon}
        </div>
        <input
          type="text"
          defaultValue={defaultValue}
          className="w-full h-10 px-4 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
}
