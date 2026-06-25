"use client";

import React from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function UploadSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.9974 6.66667C6.73378 6.66667 7.33073 6.06971 7.33073 5.33333C7.33073 4.59695 6.73378 4 5.9974 4C5.26102 4 4.66406 4.59695 4.66406 5.33333C4.66406 6.06971 5.26102 6.66667 5.9974 6.66667Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.66927 1.33594H6.0026C2.66927 1.33594 1.33594 2.66927 1.33594 6.0026V10.0026C1.33594 13.3359 2.66927 14.6693 6.0026 14.6693H10.0026C13.3359 14.6693 14.6693 13.3359 14.6693 10.0026V6.66927" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 1.33594V5.33594L13.3333 4.0026" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9974 5.33333L10.6641 4" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.78125 12.635L5.06792 10.4283C5.59458 10.075 6.35458 10.115 6.82792 10.5217L7.04792 10.715C7.56792 11.1617 8.40792 11.1617 8.92792 10.715L11.7012 8.335C12.2212 7.88833 13.0613 7.88833 13.5813 8.335L14.6679 9.26833" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface StudentBasicInfoProps {
  profilePicture: string | null;
  isUploading: boolean;
  handleContainerClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  dob: string;
  setDob: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  email: string;
  gender: string;
  currentStatus: string;
  setCurrentStatus: (val: string) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  validateField: (name: string, value: string) => string;
}

export default function StudentBasicInfo({
  profilePicture,
  isUploading,
  handleContainerClick,
  fileInputRef,
  handleFileChange,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  username,
  setUsername,
  dob,
  setDob,
  phoneNumber,
  setPhoneNumber,
  email,
  gender,
  currentStatus,
  setCurrentStatus,
  errors,
  setErrors,
  validateField,
}: StudentBasicInfoProps) {
  const selectedDate = dob && !isNaN(new Date(dob).getTime()) ? new Date(dob) : undefined;
  const currentYear = new Date().getFullYear();
  const maxBirthYear = currentYear - 18;
  const minBirthYear = currentYear - 100;
  const startMonth = new Date(minBirthYear, 0);
  const endMonth = new Date(maxBirthYear, 11);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div
          onClick={handleContainerClick}
          className="relative w-[80px] h-[80px] rounded-full overflow-hidden cursor-pointer shrink-0 border-[3px] border-[#444] mt-1"
        >
          {profilePicture ? (
            <>
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              <div className="absolute opacity-0 hover:opacity-100 duration-300 ease-in-out inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UploadSVG />
                    <span className="text-white text-[9px] text-center leading-tight px-1">
                      Upload Profile
                    </span>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-[#2f2f2f] flex flex-col items-center justify-center gap-1">
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full animate-spin" />
              ) : (
                <>
                  <UploadSVG />
                  <span className="text-white text-[9px] text-center leading-tight px-1">
                    Upload Profile
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          disabled={isUploading}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 w-full min-w-0">
          <div className="flex flex-col gap-1.5">
            <label className="type-desc text-secondary">First Name</label>
            <input
              type="text"
              value={firstName}
              maxLength={50}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setFirstName(value);
                setErrors((prev: Record<string, string>) => ({
                  ...prev,
                  firstName: validateField("firstName", value),
                }));
              }}
              className={`w-full h-10 px-3 text-primary bg-white border rounded-lg ${
                errors.firstName ? "border-red-500" : "border-border"
              }`}
            />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="type-desc text-secondary">Last Name</label>
            <input
              type="text"
              value={lastName}
              maxLength={50}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setLastName(value);
                setErrors((prev: Record<string, string>) => ({
                  ...prev,
                  lastName: validateField("lastName", value),
                }));
              }}
              className={`w-full h-10 px-3 bg-white border rounded-lg text-primary ${
                errors.lastName ? "border-red-500" : "border-border"
              }`}
            />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="type-desc text-secondary">Username</label>
            <input
              type="text"
              value={username}
              maxLength={20}
              onChange={(e) => {
                const value = e.target.value.toLowerCase().replace(/\s/g, "");
                setUsername(value);
                const error = validateField("username", value);
                setErrors((prev: Record<string, string>) => ({
                  ...prev,
                  username: error,
                }));
              }}
              className={`w-full h-10 px-3 bg-white border rounded-lg type-detail-medium text-primary ${
                errors.username ? "border-red-500" : "border-border"
              }`}
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="flex flex-col gap-1.5">
          <label className="type-desc text-secondary">Date of Birth</label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`flex items-center gap-3 w-full h-10 px-3 border rounded-lg bg-white text-left transition-all ${
                  errors.dob ? "border-red-500" : "border-border"
                }`}
              >
                <CalendarIcon size={16} className="text-muted-foreground shrink-0" />
                <span className={dob ? "text-primary type-detail-medium" : "text-muted-foreground type-detail-medium"}>
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "DD/MM/YYYY"}
                </span>
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0 rounded-xl" align="start" sideOffset={6}>
              <Calendar
                mode="single"
                selected={selectedDate}
                captionLayout="dropdown"
                startMonth={startMonth}
                endMonth={endMonth}
                disabled={(date) => {
                  const today = new Date();
                  const maxBirthDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
                  return date > maxBirthDate;
                }}
                onSelect={(date) => {
                  if (!date) return;
                  const value = format(date, "yyyy-MM-dd");
                  setDob(value);
                  setErrors((prev: Record<string, string>) => ({
                    ...prev,
                    dob: validateField("dob", value),
                  }));
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="type-desc text-secondary">Current Status</label>
          <Select value={currentStatus.toLowerCase()} onValueChange={(value) => {
            setCurrentStatus(value);
            setErrors((prev: Record<string, string>) => ({
              ...prev,
              currentStatus: validateField("currentStatus", value),
            }));
          }}>
            <SelectTrigger className="w-full h-10 px-4 py-5 bg-white border-border rounded-xl text-primary type-detail-medium focus:ring-1 focus:ring-primary focus:ring-offset-0">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent side="bottom" position="popper" className="bg-white rounded-2xl shadow-xl border border-gray-100 px-2 py-2 z-50 text-left max-h-50 overflow-y-auto w-[var(--radix-select-trigger-width)]">
              <SelectItem value="studying" className="px-3 py-3 text-sm font-semibold rounded-md text-slate-800 hover:bg-grey-200 transition-colors cursor-pointer focus:bg-slate-50">
                Studying
              </SelectItem>
              <SelectItem value="working" className="px-3 py-3 text-sm font-semibold rounded-md text-slate-800 hover:bg-grey-200 transition-colors cursor-pointer focus:bg-slate-50">
                Working
              </SelectItem>
              <SelectItem value="job_seeking" className="px-3 py-3 text-sm font-semibold rounded-md text-slate-800 hover:bg-grey-200 transition-colors cursor-pointer focus:bg-slate-50">
                Job Seeking
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="type-desc text-secondary">Gender</label>
          <input
            type="text"
            value={gender}
            disabled
            className="w-full h-10 px-3 border border-border rounded-lg type-detail text-gray-400 focus:outline-hidden bg-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:[grid-template-columns:calc(96px_+_((100%_-_96px_-_32px)/3))_1fr] gap-4 w-full">
        <div className="flex flex-col gap-1.5">
          <label className="type-desc text-secondary">Phone Number</label>
          <div className={`flex items-center h-10 rounded-lg border bg-white overflow-hidden transition-all focus-within:border-primary ${
            errors.phoneNumber ? "border-red-500" : "border-border"
          }`}>
            <div className="flex items-center gap-2 bg-gray-50 border-r border-border h-full px-3 shrink-0 text-sm font-medium text-gray-500">
              <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/10 items-center justify-center">
                <Flags.KH className="w-full object-cover" />
              </span>
              <span className="text-primary">+855</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={11}
              value={phoneNumber.replace(/(\d{2})(\d{3})(\d{0,4})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "))}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                if (/^\d{0,9}$/.test(rawValue)) {
                  setPhoneNumber(rawValue);
                  setErrors((prev: Record<string, string>) => ({
                    ...prev,
                    phoneNumber: validateField("phoneNumber", rawValue),
                  }));
                }
              }}
              className="w-full h-full border-0 bg-transparent px-3 text-primary outline-none focus-visible:ring-0 shadow-none placeholder:text-gray-400"
              placeholder="89 124 5768"
            />
          </div>
          {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="type-desc text-secondary">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full h-10 px-3 bg-background border border-border rounded-md type-detail text-muted-foreground opacity-70 focus:outline-none cursor-not-allowed"
          />
        </div>
      </div>
    </>
  );
}
