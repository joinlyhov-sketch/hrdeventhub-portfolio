"use client";

import React from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { User, Mails, Cake } from "lucide-react";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface AdminBasicInfoProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  gender: string;
  dob: string;
  setDob: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  email: string;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  validateField: (name: string, value: string) => string;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (val: boolean) => void;
}

export default function AdminBasicInfo({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  username,
  setUsername,
  gender,
  dob,
  setDob,
  phoneNumber,
  setPhoneNumber,
  email,
  errors,
  setErrors,
  validateField,
  isCalendarOpen,
  setIsCalendarOpen,
}: AdminBasicInfoProps) {
  const selectedDate = dob && !isNaN(new Date(dob).getTime()) ? new Date(dob) : undefined;
  const currentYear = new Date().getFullYear();
  const maxBirthYear = currentYear - 16;
  const minBirthYear = currentYear - 100;
  const startMonth = new Date(minBirthYear, 0);
  const endMonth = new Date(maxBirthYear, 11);

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-1.5 w-full">
          <label className="type-detail-semibold text-secondary">
            First Name
          </label>
          <div className="relative flex items-center w-full">
            <div className="absolute left-3.5 text-[#93A3CA] pointer-events-none">
              <User className="w-4 h-4" />
            </div>
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
              className={`w-full h-10 pl-11 pr-10 bg-background border rounded-md ${
                errors.firstName
                  ? "border-red-500"
                  : "border-border focus:border-primary"
              }`}
            />
          </div>
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-1">
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="type-detail-semibold text-secondary">
            Last Name
          </label>
          <div className="relative flex items-center w-full">
            <div className="absolute left-3.5 text-[#93A3CA] pointer-events-none">
              <User className="w-4 h-4" />
            </div>
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
              className={`w-full h-10 pl-11 pr-10 bg-background border rounded-md ${
                errors.lastName
                  ? "border-red-500"
                  : "border-border focus:border-primary"
              }`}
            />
          </div>
          {errors.lastName && (
            <p className="text-xs text-red-500 mt-1">
              {errors.lastName}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="type-detail-semibold text-secondary">
            Username
          </label>
          <div className="relative flex items-center w-full">
            <div className="absolute left-3.5 text-[#93A3CA] pointer-events-none">
              <User className="w-4 h-4" />
            </div>
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
              className={`w-full h-10 pl-11 pr-10 bg-background border rounded-md ${
                errors.username
                  ? "border-red-500"
                  : "border-border focus:border-primary"
              }`}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-500 mt-1">
              {errors.username}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="type-detail-semibold text-secondary">
            Gender
          </label>
          <div className="relative flex items-center w-full">
            <div className="absolute left-3.5 text-[#93A3CA] pointer-events-none">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={gender}
              disabled
              className="w-full h-10 pl-11 pr-10 bg-background border border-border rounded-md type-detail text-muted-foreground opacity-70 focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="type-detail-semibold text-secondary">
            Date of Birth
          </label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`flex items-center gap-3 w-full h-10 px-3 rounded-md border bg-background text-left ${
                  errors.dateOfBirth ? "border-red-500" : "border-border"
                }`}
              >
                <Cake className="w-4 h-4 text-[#93A3CA] shrink-0" />
                <span className={`text-sm ${dob ? "text-foreground" : "text-muted-foreground"}`}>
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "DD/MM/YYYY"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (!date) return;
                  setDob(format(date, "yyyy-MM-dd"));
                  setIsCalendarOpen(false);
                  setErrors((prev: Record<string, string>) => ({
                    ...prev,
                    dateOfBirth: "",
                  }));
                }}
                disabled={(date) => {
                  const today = new Date();
                  const maxBirthDate = new Date(
                    today.getFullYear() - 16,
                    today.getMonth(),
                    today.getDate(),
                  );
                  return date > maxBirthDate;
                }}
                captionLayout="dropdown"
                startMonth={startMonth}
                endMonth={endMonth}
              />
            </PopoverContent>
          </Popover>
          {errors.dateOfBirth && (
            <p className="text-xs text-red-500 mt-1">
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="type-desc text-secondary">
            Phone Number
          </label>
          <div
            className={`flex items-center h-10 rounded-lg border bg-white overflow-hidden transition-all ${
              errors.phoneNumber
                ? "border-red-500"
                : "border-border focus-within:border-primary"
            }`}
          >
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
              value={phoneNumber.replace(
                /(\d{2})(\d{3})(\d{0,4})/,
                (_, a, b, c) => [a, b, c].filter(Boolean).join(" "),
              )}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                if (/^\d{0,9}$/.test(rawValue)) {
                  setPhoneNumber(rawValue);
                  setErrors((prev: Record<string, string>) => ({
                    ...prev,
                    phoneNumber: "",
                  }));
                }
              }}
              className="w-full h-full border-0 bg-transparent px-3 text-primary outline-none focus-visible:ring-0 shadow-none placeholder:text-gray-400"
              placeholder="89 124 5768"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phoneNumber}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2 w-full">
          <label className="type-detail-semibold text-secondary">
            Email
          </label>
          <div className="relative flex items-center w-full">
            <div className="absolute left-3.5 text-[#93A3CA] pointer-events-none">
              <Mails className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              disabled
              className="w-full h-10 pl-11 pr-10 bg-background border border-border rounded-md type-detail text-muted-foreground focus:outline-none opacity-70 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
