"use client";

import React from "react";

interface AdminSocialAccountsProps {
  linkedinUrl: string;
  setLinkedinUrl: (val: string) => void;
  githubUrl: string;
  setGithubUrl: (val: string) => void;
  facebookUrl: string;
  setFacebookUrl: (val: string) => void;
  telegramUrl: string;
  setTelegramUrl: (val: string) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  validateField: (name: string, value: string) => string;
}

export default function AdminSocialAccounts({
  linkedinUrl,
  setLinkedinUrl,
  githubUrl,
  setGithubUrl,
  facebookUrl,
  setFacebookUrl,
  telegramUrl,
  setTelegramUrl,
  errors,
  setErrors,
  validateField,
}: AdminSocialAccountsProps) {
  return (
    <section className="space-y-4">
      <h2 className="type-subtitle-24 text-primary">
        Social Accounts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="flex items-end gap-3 w-full min-w-0">
          <div className="shrink-0 mb-1">
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
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 14.5H15.5C12.47 14.5 10 16.97 10 20C10 23.02 12.47 25.5 15.5 25.5H17"
                stroke="#F9F9F9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 20H24"
                stroke="#F9F9F9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <label className="type-detail-small-medium text-accent uppercase tracking-wider text-xs font-semibold">
              LinkedIn
            </label>

            <div
              className={`flex items-center h-12 px-3 border rounded-xl bg-white transition-all ${
                errors.linkedinUrl
                  ? "border-red-500"
                  : "border-border focus-within:border-primary"
              }`}
            >
              <input
                type="text"
                value={linkedinUrl}
                maxLength={256}
                placeholder="https://linkedin.com/in/username"
                onChange={(e) => {
                  const value = e.target.value;
                  setLinkedinUrl(value);

                  setErrors((prev: Record<string, string>) => ({
                    ...prev,
                    linkedinUrl: validateField("linkedinUrl", value),
                  }));
                }}
                className="w-full bg-transparent outline-none type-detail text-foreground font-medium placeholder:text-gray-400"
              />
            </div>

            {errors.linkedinUrl && (
              <p className="text-xs text-red-500">
                {errors.linkedinUrl}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-end gap-3 w-full min-w-0">
          <div className="shrink-0 mb-1">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="20" fill="#1C4D8D" />
              <path
                d="M17 27.0034C12 28.5034 12 24.5034 10 24.0034M24 30.0034V26.1334C24.0375 25.6565 23.9731 25.1772 23.811 24.7271C23.6489 24.2771 23.3929 23.8668 23.06 23.5234C26.2 23.1734 29.5 21.9834 29.5 16.5234C29.4997 15.1272 28.9627 13.7846 28 12.7734C28.4559 11.5519 28.4236 10.2017 27.91 9.00336C27.91 9.00336 26.73 8.65336 24 10.4834C21.708 9.86218 19.292 9.86218 17 10.4834C14.27 8.65336 13.09 9.00336 13.09 9.00336C12.5764 10.2017 12.5441 11.5519 13 12.7734C12.0301 13.7921 11.4925 15.1468 11.5 16.5534C11.5 21.9734 14.8 23.1634 17.94 23.5534C17.611 23.8933 17.3573 24.2988 17.1953 24.7433C17.0334 25.1878 16.9668 25.6614 17 26.1334V30.0034"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <label className="type-detail-small-medium text-accent uppercase tracking-wider text-xs font-semibold">
              GitHub
            </label>

            <div
              className={`flex items-center h-12 px-3 border rounded-xl bg-white transition-all ${
                errors.githubUrl
                  ? "border-red-500"
                  : "border-border focus-within:border-primary"
              }`}
            >
              <input
                type="text"
                placeholder="https://github.com/username"
                maxLength={256}
                value={githubUrl}
                onChange={(e) => {
                  const value = e.target.value;
                  setGithubUrl(value);

                  setErrors((prev: Record<string, string>) => ({
                    ...prev,
                    githubUrl: validateField("githubUrl", value),
                  }));
                }}
                className="type-detail w-full outline-hidden text-foreground bg-transparent font-medium"
              />
            </div>

            {errors.githubUrl && (
              <p className="text-xs text-red-500">
                {errors.githubUrl}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-end gap-3 w-full min-w-0">
          <div className="shrink-0 mb-1">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="20" fill="#1C4D8D" />
              <path
                d="M22 17.3V20.2H24.6C24.8 20.2 24.9 20.4 24.9 20.6L24.5 22.5C24.5 22.6 24.3 22.7 24.2 22.7H22V30H19V22.8H17.3C17.1 22.8 17 22.7 17 22.5V20.6C17 20.4 17.1 20.3 17.3 20.3H19V17C19 15.3 20.3 14 22 14H24.7C24.9 14 25 14.1 25 14.3V16.7C25 16.9 24.9 17 24.7 17H22.3C22.1 17 22 17.1 22 17.3Z"
                stroke="#F9F9F9"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                d="M23 30H17C12 30 10 28 10 23V17C10 12 12 10 17 10H23C28 10 30 12 30 17V23C30 28 28 30 23 30Z"
                stroke="#F9F9F9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <label className="type-detail-small-medium text-accent uppercase tracking-wider text-xs font-semibold">
              Facebook
            </label>

            <div
              className={`flex items-center h-12 px-3 border rounded-xl bg-white transition-all ${
                errors.facebookUrl
                  ? "border-red-500"
                  : "border-border focus-within:border-primary"
              }`}
            >
              <input
                type="text"
                maxLength={256}
                placeholder="https://facebook.com/username"
                value={facebookUrl}
                onChange={(e) => {
                  const value = e.target.value;
                  setFacebookUrl(value);

                  setErrors((prev: Record<string, string>) => ({
                    ...prev,
                    facebookUrl: validateField("facebookUrl", value),
                  }));
                }}
                className="type-detail w-full outline-hidden text-foreground bg-transparent font-medium"
              />
            </div>

            {errors.facebookUrl && (
              <p className="text-xs text-red-500">
                {errors.facebookUrl}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-end gap-3 w-full min-w-0">
          <div className="shrink-0 mb-1">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="20" fill="#1C4D8D" />
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

          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <label className="type-detail-small-medium text-accent uppercase tracking-wider text-xs font-semibold">
              Telegram
            </label>

            <div
              className={`flex items-center h-12 px-3 border rounded-xl bg-white transition-all ${
                errors.telegramUrl
                  ? "border-red-500"
                  : "border-border focus-within:border-primary"
              }`}
            >
              <input
                type="text"
                maxLength={256}
                placeholder="https://t.me/username"
                value={telegramUrl}
                onChange={(e) => {
                  const value = e.target.value;
                  setTelegramUrl(value);

                  setErrors((prev: Record<string, string>) => ({
                    ...prev,
                    telegramUrl: validateField("telegramUrl", value),
                  }));
                }}
                className="type-detail w-full outline-hidden text-foreground bg-transparent font-medium"
              />
            </div>

            {errors.telegramUrl && (
              <p className="text-xs text-red-500">
                {errors.telegramUrl}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
