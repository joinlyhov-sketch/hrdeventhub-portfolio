"use client";

import React from "react";
import {
  User,
  Code,
  Phone,
  MapPin,
  Mails,
  Cake,
  Link2,
} from "lucide-react";

interface CurrentUser {
  name: string;
  email: string;
  avatarInitials: string;
}

export default function AdminProfileForm({ user }: { user: CurrentUser }) {
  return (
    <div className="space-y-6 w-full text-left">
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center border border-border text-primary-foreground type-subtitle-24 uppercase">
            {user.avatarInitials || "A"}
          </div>
          <div>
            <h3 className="type-title text-secondary">Admin</h3>
          </div>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md type-detail-semibold flex items-center gap-2 hover:opacity-90 shadow-xs border-0 cursor-pointer transition-opacity">
          Change Password
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-6 w-full">
        <h2 className="type-subtitle text-secondary border-b border-border pb-2">
          Personal Information
        </h2>

        <div className="space-y-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-seconary">
                Full Name
              </label>
              <div className="relative flex items-center w-full">
                <div className="absolute left-3.5 text-[#93A3CA] pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full h-10 pl-11 pr-10 bg-background border border-border rounded-md type-detail text-[#93A3CA] focus:outline-hidden focus:border-primary transition-colors"
                />
                <div className="absolute right-3.5 text-[#93A3CA] pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V9.75"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.0284 2.26592L6.11844 8.17592C5.89344 8.40092 5.66844 8.84342 5.62344 9.16592L5.30094 11.4234C5.18094 12.2409 5.75844 12.8109 6.57594 12.6984L8.83344 12.3759C9.14844 12.3309 9.59094 12.1059 9.82344 11.8809L15.7334 5.97092C16.7534 4.95092 17.2334 3.76592 15.7334 2.26592C14.2334 0.765922 13.0484 1.24592 12.0284 2.26592Z"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.1836 3.10938C11.6861 4.90188 13.0886 6.30438 14.8886 6.81438"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
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
                  defaultValue="Female"
                  className="w-full h-10 pl-11 pr-10 bg-background border border-border rounded-md type-detail text-[#93A3CA] focus:outline-hidden focus:border-primary transition-colors"
                />
                <div className="absolute right-3.5 text-[#93A3CA] pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V9.75"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.0284 2.26592L6.11844 8.17592C5.89344 8.40092 5.66844 8.84342 5.62344 9.16592L5.30094 11.4234C5.18094 12.2409 5.75844 12.8109 6.57594 12.6984L8.83344 12.3759C9.14844 12.3309 9.59094 12.1059 9.82344 11.8809L15.7334 5.97092C16.7534 4.95092 17.2334 3.76592 15.7334 2.26592C14.2334 0.765922 13.0484 1.24592 12.0284 2.26592Z"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.1836 3.10938C11.6861 4.90188 13.0886 6.30438 14.8886 6.81438"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-secondary">
                Date of Birth
              </label>
              <div className="relative flex items-center w-full">
                <div className="absolute left-3.5 text-[#93A3CA] pointer-events-none">
                  <Cake className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  defaultValue="2005-05-15"
                  className="w-full h-10 pl-11 pr-10 bg-background border border-border rounded-md type-detail text-[#93A3CA]focus:outline-hidden focus:border-primary transition-colors"
                />
                <div className="absolute right-3.5 text-[#93A3CA] pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V9.75"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.0284 2.26592L6.11844 8.17592C5.89344 8.40092 5.66844 8.84342 5.62344 9.16592L5.30094 11.4234C5.18094 12.2409 5.75844 12.8109 6.57594 12.6984L8.83344 12.3759C9.14844 12.3309 9.59094 12.1059 9.82344 11.8809L15.7334 5.97092C16.7534 4.95092 17.2334 3.76592 15.7334 2.26592C14.2334 0.765922 13.0484 1.24592 12.0284 2.26592Z"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.1836 3.10938C11.6861 4.90188 13.0886 6.30438 14.8886 6.81438"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-secondary">
                Skills
              </label>
              <div className="relative flex items-center w-full">
                <div className="absolute left-3.5 text-[#93A3CA] pointer-events-none">
                  <Code className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full h-10 pl-11 pr-10 bg-background border border-border rounded-md type-detail text-[#93A3CA] focus:outline-hidden focus:border-primary transition-colors"
                />
                <div className="absolute right-3.5 text-[#93A3CA] pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V9.75"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.0284 2.26592L6.11844 8.17592C5.89344 8.40092 5.66844 8.84342 5.62344 9.16592L5.30094 11.4234C5.18094 12.2409 5.75844 12.8109 6.57594 12.6984L8.83344 12.3759C9.14844 12.3309 9.59094 12.1059 9.82344 11.8809L15.7334 5.97092C16.7534 4.95092 17.2334 3.76592 15.7334 2.26592C14.2334 0.765922 13.0484 1.24592 12.0284 2.26592Z"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.1836 3.10938C11.6861 4.90188 13.0886 6.30438 14.8886 6.81438"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-secondary">
                Phone Number
              </label>
              <div className="relative flex items-center w-full">
                <div className="absolute left-3.5 text-[#93A3CA] pointer-events-none">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  defaultValue="012345678"
                  className="w-full h-10 pl-11 pr-10 bg-background border border-border rounded-md type-detail text-[#93A3CA] focus:outline-hidden focus:border-primary transition-colors"
                />
                <div className="absolute right-3.5 text-[#93A3CA] pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V9.75"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.0284 2.26592L6.11844 8.17592C5.89344 8.40092 5.66844 8.84342 5.62344 9.16592L5.30094 11.4234C5.18094 12.2409 5.75844 12.8109 6.57594 12.6984L8.83344 12.3759C9.14844 12.3309 9.59094 12.1059 9.82344 11.8809L15.7334 5.97092C16.7534 4.95092 17.2334 3.76592 15.7334 2.26592C14.2334 0.765922 13.0484 1.24592 12.0284 2.26592Z"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.1836 3.10938C11.6861 4.90188 13.0886 6.30438 14.8886 6.81438"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-secondary">
                Email
              </label>
              <div className="relative flex items-center w-full">
                <div className="absolute left-3.5 text-[#93A3CA] pointer-events-none">
                  <Mails className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  defaultValue="admin@gmail.com"
                  className="w-full h-10 pl-11 pr-10 bg-background border border-border rounded-md type-detail text-[#93A3CA] focus:outline-hidden focus:border-primary transition-colors"
                />
                <div className="absolute right-3.5 text-[#93A3CA] pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V9.75"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.0284 2.26592L6.11844 8.17592C5.89344 8.40092 5.66844 8.84342 5.62344 9.16592L5.30094 11.4234C5.18094 12.2409 5.75844 12.8109 6.57594 12.6984L8.83344 12.3759C9.14844 12.3309 9.59094 12.1059 9.82344 11.8809L15.7334 5.97092C16.7534 4.95092 17.2334 3.76592 15.7334 2.26592C14.2334 0.765922 13.0484 1.24592 12.0284 2.26592Z"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.1836 3.10938C11.6861 4.90188 13.0886 6.30438 14.8886 6.81438"
                      stroke="#93A3CA"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full pt-1">
            <label className="type-detail-semibold text-secondary">
              Address
            </label>
            <div className="relative flex items-center w-full">
              <div className="absolute left-3.5 text-[#93A3CA] pointer-events-none">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                defaultValue="Phnom Penh, Cambodia"
                className="w-full h-10 pl-11 pr-10 bg-background border border-border rounded-md type-detail text-[#93A3CA] focus:outline-hidden focus:border-primary transition-colors"
              />
              <div className="absolute right-3.5 text-[#93A3CA] pointer-events-none">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V9.75"
                    stroke="#93A3CA"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.0284 2.26592L6.11844 8.17592C5.89344 8.40092 5.66844 8.84342 5.62344 9.16592L5.30094 11.4234C5.18094 12.2409 5.75844 12.8109 6.57594 12.6984L8.83344 12.3759C9.14844 12.3309 9.59094 12.1059 9.82344 11.8809L15.7334 5.97092C16.7534 4.95092 17.2334 3.76592 15.7334 2.26592C14.2334 0.765922 13.0484 1.24592 12.0284 2.26592Z"
                    stroke="#93A3CA"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.1836 3.10938C11.6861 4.90188 13.0886 6.30438 14.8886 6.81438"
                    stroke="#93A3CA"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            className="px-5 py-2 bg-primary text-primary-foreground rounded-md type-detail-semibold hover:opacity-90 shadow-xs border-0 cursor-pointer transition-opacity"
          >
            Save Change
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <h3 className="type-subtitle text-secondary flex items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                  stroke="#0F2854"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 12.4113V7.84132C2.5 6.65132 3.23 5.59128 4.34 5.17128L12.28 2.17128C13.52 1.70128 14.85 2.62131 14.85 3.95131V7.7513"
                  stroke="#0F2854"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.5588 13.9731V16.0331C22.5588 16.5831 22.1188 17.0331 21.5588 17.0531H19.5988C18.5188 17.0531 17.5288 16.2631 17.4388 15.1831C17.3788 14.5531 17.6188 13.9631 18.0388 13.5531C18.4088 13.1731 18.9188 12.9531 19.4788 12.9531H21.5588C22.1188 12.9731 22.5588 13.4231 22.5588 13.9731Z"
                  stroke="#0F2854"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 12H14"
                  stroke="#0F2854"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              WeBill365 Information
            </h3>
            <p className="type-detail text-muted-foreground mt-0.5">
              Manage WeBill Information for room payment
            </p>
          </div>
          <button className="bg-action text-white px-4 py-2 rounded-md type-detail-semiboldpx-4 type-detail-semibold flex items-center gap-2 hover:opacity-90 shadow-xs border-0 cursor-pointer transition-opacity">
            <Link2 className="w-4 h-4" />
            Disconnect WeBill365
          </button>
        </div>

        <div className="flex items-start gap-3 p-4 bg-grey-50 border border-border rounded-2xl w-full">
          <div className="rounded-full bg-subtle/10 flex items-center justify-center text-subtle shrink-0 mt-0.5">
            <svg
              width="45"
              height="45"
              viewBox="0 0 45 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.5 41.25C32.8125 41.25 41.25 32.8125 41.25 22.5C41.25 12.1875 32.8125 3.75 22.5 3.75C12.1875 3.75 3.75 12.1875 3.75 22.5C3.75 32.8125 12.1875 41.25 22.5 41.25Z"
                stroke="#2A9D8F"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.5312 22.5016L19.8375 27.8078L30.4688 17.1953"
                stroke="#2A9D8F"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="type-detail-semibold text-grey-900">
              Account Connected
              <span className="type-detail text-grey-50 mt-0.5 leading-relaxed">
                Your account is successfully connected for payment. You can now
                receive monthly payments from renters.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
