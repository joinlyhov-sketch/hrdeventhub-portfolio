"use client";

import React, { useEffect, useState, useTransition, useRef } from "react";
import { User, Mails, Cake, Link2, Camera } from "lucide-react";

import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useSession } from "next-auth/react";
import { profileService } from "@/service/profile.service";
import {
  getIdentityMeAction,
  updateIdentityMeAction,
  updateProfileMeAction,
} from "@/actions/profile.action";
import { uploadFileAction } from "@/actions/file.action";
import { useRouter } from "next/navigation";
import ResetPasswordModal from "../../pop-up/reset-modal/ResetPasswordModal";
import ConnectBankModal from "@/components/site/pop-up/payment/WebillConnectModal";
import ImageAdjustModal from "@/components/site/profile/ImageAdjustModal";
import * as Flags from "country-flag-icons/react/3x2";
import { toast } from "sonner";

interface CurrentUser {
  name: string;
  email: string;
  avatarInitials: string;
}

export default function AdminProfileForm({ user }: { user: CurrentUser }) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [initialIdentity, setInitialIdentity] = useState<any>(null);
  const [initialProfile, setInitialProfile] = useState<any>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("Admin");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("Female");
  const [dob, setDob] = useState("2005-05-15");
  const [phoneNumber, setPhoneNumber] = useState("012345678");
  const [email, setEmail] = useState("admin@gmail.com");
  const [bio, setBio] = useState("");
  const selectedDate = dob ? new Date(dob) : undefined;

  const maxDate = new Date();

  const startMonth = new Date(1950, 0);
  const endMonth = new Date();

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");

  useEffect(() => {
    const loadAllUserData = async () => {
      const token = session?.accessToken;
      if (!token) return;

      try {
        const [profileRes, identityRes] = await Promise.allSettled([
          profileService.getProfileMe(token),
          getIdentityMeAction(),
        ]);

        let identityAvatarFallback = null;
        if (identityRes.status === "fulfilled" && identityRes.value) {
          const idData =
            (identityRes.value as any).payload || identityRes.value;
          const identitySnapshot = {
            firstName: idData.firstName || "Admin",
            lastName: idData.lastName || "",
            username: idData.username || "",
            dateOfBirth: idData.dateOfBirth || "2005-05-15",
            phoneNumber: idData.phoneNumber || "012345678",
          };

          setInitialIdentity(identitySnapshot);
          setFirstName(identitySnapshot.firstName);
          setLastName(identitySnapshot.lastName);
          setUsername(identitySnapshot.username);
          setDob(identitySnapshot.dateOfBirth);
          setPhoneNumber(identitySnapshot.phoneNumber);

          if (idData.email) setEmail(idData.email);

          if (idData.avatar || idData.profilePicture || idData.avatarUrl) {
            identityAvatarFallback =
              idData.avatar || idData.profilePicture || idData.avatarUrl;
          }

          if (idData.gender) {
            const rawGender = idData.gender.toUpperCase();
            if (rawGender === "M" || rawGender === "MALE") {
              setGender("Male");
            } else if (rawGender === "F" || rawGender === "FEMALE") {
              setGender("Female");
            } else {
              setGender(idData.gender);
            }
          }
        }

        if (
          profileRes.status === "fulfilled" &&
          (profileRes.value as any)?.success
        ) {
          const p = (profileRes.value as any).payload as any;
          let lUrl = "",
            gUrl = "",
            fUrl = "",
            tUrl = "";

          const resolvedAvatar =
            p.avatar ||
            p.profilePicture ||
            p.avatarUrl ||
            identityAvatarFallback;
          if (resolvedAvatar) {
            setAvatarUrl(resolvedAvatar);
          }

          if (p.socialAccount && p.socialAccount.length > 0) {
            p.socialAccount.forEach((s: any) => {
              if (s.platform === "linkedin") lUrl = s.url;
              else if (s.platform === "github") gUrl = s.url;
              else if (s.platform === "facebook") fUrl = s.url;
              else if (s.platform === "telegram") tUrl = s.url;
            });

            setLinkedinUrl(lUrl);
            setGithubUrl(gUrl);
            setFacebookUrl(fUrl);
            setTelegramUrl(tUrl);
          }

          const profileSnapshot = {
            bio: p.bio || "",
            avatar: resolvedAvatar || null,
            socials: {
              linkedin: lUrl,
              github: gUrl,
              facebook: fUrl,
              telegram: tUrl,
            },
          };

          setInitialProfile(profileSnapshot);
          setBio(profileSnapshot.bio);
        } else if (identityAvatarFallback) {
          setAvatarUrl(identityAvatarFallback);
        }
      } catch (err) {}
    };
    loadAllUserData();
  }, [session]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      sessionStorage.setItem("pending-avatar", base64);

      setSelectedImageSrc(base64);
      setIsAdjustOpen(true);
    };

    reader.readAsDataURL(file);
  };
  useEffect(() => {
    const pendingAvatar = sessionStorage.getItem("pending-avatar");

    if (pendingAvatar) {
      setSelectedImageSrc(pendingAvatar);
      setIsAdjustOpen(true);
    }
  }, []);
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2)
          return "First name must be at least 2 characters";
        return "";

      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2)
          return "Last name must be at least 2 characters";
        return "";

      case "username":
        if (!value.trim()) return "Username is required";
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return "Username can only contain letters, numbers and underscore";
        if (value.length < 3) return "Username must be at least 3 characters";
        return "";

      case "phoneNumber":
        if (!value.trim()) return "Phone number is required";

        if (value.includes("+")) {
          return "Do not include country code";
        }
        if (!/^\d+$/.test(value)) {
          return "Phone number must contain digits only";
        }

        const isValid =
          /^0\d{8,9}$/.test(value) || /^[1-9]\d{7,8}$/.test(value);

        if (!isValid) {
          return "Enter a valid phone number";
        }

        return "";

      case "linkedinUrl":
        if (!value.trim()) return "";

        try {
          const url = new URL(value);
          if (!url.hostname.includes("linkedin.com")) {
            return "Please enter a valid LinkedIn URL";
          }
        } catch {
          return "Invalid URL";
        }

        return "";

      case "githubUrl":
        if (!value.trim()) return "";

        try {
          const url = new URL(value);
          if (!url.hostname.includes("github.com")) {
            return "Please enter a valid GitHub URL";
          }
        } catch {
          return "Invalid URL";
        }

        return "";

      case "facebookUrl":
        if (!value.trim()) return "";

        try {
          const url = new URL(value);
          if (!url.hostname.includes("facebook.com")) {
            return "Please enter a valid Facebook URL";
          }
        } catch {
          return "Invalid URL";
        }

        return "";

      case "telegramUrl":
        if (!value.trim()) return "";

        try {
          const url = new URL(value);

          const isValidTelegram =
            url.hostname.includes("t.me") ||
            url.hostname.includes("telegram.me") ||
            url.hostname.includes("telegram.org");

          if (!isValidTelegram) {
            return "Please enter a valid Telegram URL";
          }
        } catch {
          return "Invalid URL";
        }

        return "";

      case "dateOfBirth":
        if (!value.trim()) {
          return "Date of birth is required";
        }

        const birthDate = new Date(value);

        if (isNaN(birthDate.getTime())) {
          return "Invalid date of birth";
        }

        const today = new Date();

        if (birthDate > today) {
          return "Date of birth cannot be in the future";
        }

        const age =
          today.getFullYear() -
          birthDate.getFullYear() -
          (today <
          new Date(
            today.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate(),
          )
            ? 1
            : 0);

        if (age < 16) {
          return "You must be at least 16 years old";
        }

        if (age > 120) {
          return "Please enter a valid date of birth";
        }

        return "";

      default:
        return "";
    }
  };

  const handleSaveCroppedAvatar = async (croppedBlob: Blob) => {
    setIsAdjustOpen(false);
    setIsUploading(true);
    setError(null);
    sessionStorage.removeItem("pending-avatar");

    const localBlobUrl = URL.createObjectURL(croppedBlob);
    setAvatarUrl(localBlobUrl);

    const dataPayload = new FormData();
    dataPayload.append("file", croppedBlob, "admin-avatar.jpg");

    try {
      const result = (await uploadFileAction(dataPayload)) as any;
      const fileUrl =
        result?.payload?.fileUrl ||
        result?.payload?.url ||
        result?.fileUrl ||
        result?.url;

      if (fileUrl) {
        setAvatarUrl(fileUrl);
      } else {
        setError(
          result?.payload?.error ||
            result?.error ||
            result?.message ||
            "Upload failed.",
        );
        setAvatarUrl(initialProfile?.avatar || null);
      }
    } catch (err: any) {
      setError(err?.message || "Upload failed.");
      setAvatarUrl(initialProfile?.avatar || null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsUploading(false);
  };
  const validateForm = () => {
    const newErrors = {
      firstName: validateField("firstName", firstName),
      lastName: validateField("lastName", lastName),
      username: validateField("username", username),
      dateOfBirth: validateField("dateOfBirth", dob),
      phoneNumber: validateField("phoneNumber", phoneNumber),
      linkedinUrl: validateField("linkedinUrl", linkedinUrl),
      githubUrl: validateField("githubUrl", githubUrl),
      facebookUrl: validateField("facebookUrl", facebookUrl),
      telegramUrl: validateField("telegramUrl", telegramUrl),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSaveChanges = () => {
    setError(null);

    if (!validateForm()) {
      toast.error("Please fix the validation errors.");
      return;
    }

    const currentIdentityPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      dateOfBirth: dob.trim(),
      phoneNumber: phoneNumber.trim(),
    };

    const activeSocials = [
      {
        platform: "linkedin",
        url: linkedinUrl.trim(),
      },
      {
        platform: "github",
        url: githubUrl.trim(),
      },
      {
        platform: "facebook",
        url: facebookUrl.trim(),
      },
      {
        platform: "telegram",
        url: telegramUrl.trim(),
      },
    ];

    const currentProfilePayload: any = {
      bio: bio.trim(),
      avatar: avatarUrl,
      profilePicture: avatarUrl,
      avatarUrl: avatarUrl,
      socialAccount: activeSocials,
    };

    const identityChanged =
      initialIdentity?.firstName !== firstName.trim() ||
      initialIdentity?.lastName !== lastName.trim() ||
      initialIdentity?.username !== username.trim() ||
      initialIdentity?.dateOfBirth !== dob.trim() ||
      initialIdentity?.phoneNumber !== phoneNumber.trim();

    const socialsMatch =
      initialProfile?.socials.linkedin === linkedinUrl.trim() &&
      initialProfile?.socials.github === githubUrl.trim() &&
      initialProfile?.socials.facebook === facebookUrl.trim() &&
      initialProfile?.socials.telegram === telegramUrl.trim();

    const profileChanged =
      initialProfile?.bio !== bio.trim() ||
      initialProfile?.avatar !== avatarUrl ||
      !socialsMatch;

    if (!identityChanged && !profileChanged) {
      router.back();
      return;
    }

    startTransition(async () => {
      try {
        const updatePromises: Promise<any>[] = [];

        if (identityChanged) {
          updatePromises.push(updateIdentityMeAction(currentIdentityPayload));
        } else {
          updatePromises.push(Promise.resolve({ success: true }));
        }

        if (profileChanged) {
          updatePromises.push(updateProfileMeAction(currentProfilePayload));
        } else {
          updatePromises.push(Promise.resolve({ success: true }));
        }

        const [identityResult, profileResult] =
          await Promise.all(updatePromises);

        if (identityResult?.success && profileResult?.success) {
          router.refresh();
          router.back();
          toast.success("Profile updated successfully.");
          return;
        }

        if (!identityResult?.success) {
          setError(
            identityResult?.message ||
              identityResult?.error ||
              "Identity validation failed.",
          );
        }
        if (!profileResult?.success) {
          setError(
            profileResult?.message ||
              profileResult?.error ||
              "Profile validation failed.",
          );
        }
      } catch (err: any) {
        setError(
          err?.message || "An exception blocked synchronization attempts.",
        );
      }
    });
  };

  return (
    <div className="space-y-6 w-full text-left">
      {error && (
        <div className="p-4 text-sm bg-destructive/10 text-destructive rounded-lg font-mono whitespace-pre-wrap">
          {error}
        </div>
      )}
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-5">
          <div className="relative group w-20 h-20 shrink-0">
            {avatarUrl ? (
              <div className="w-full h-full relative rounded-full overflow-hidden">
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover border border-border"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center border border-border text-primary-foreground type-subtitle-24 uppercase">
                {user.avatarInitials || "A"}
              </div>
            )}

            <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-5 h-5" />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>

          <div className="space-y-1">
            <h3 className="type-title text-secondary">Admin Profile</h3>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <button
            onClick={() => setIsResetOpen(true)}
            className="w-full sm:w-auto bg-primary text-primary-foreground px-4 py-2 rounded-md type-detail-semibold flex items-center justify-center gap-2 hover:opacity-90 shadow-xs border-0 cursor-pointer transition-opacity"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-xs space-y-6 w-full">
        <h2 className="type-subtitle text-secondary border-b border-border pb-2">
          Personal Information
        </h2>

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
                  onChange={(e) => {
                    const value = e.target.value;
                    setFirstName(value);

                    setErrors((prev) => ({
                      ...prev,
                      firstName: validateField("firstName", value),
                    }));
                  }}
                  className={`w-full h-10 pl-11 pr-10 bg-background border rounded-md
                ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-border focus:border-primary"
                }`}
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
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
                  onChange={(e) => {
                    const value = e.target.value;
                    setLastName(value);

                    setErrors((prev) => ({
                      ...prev,
                      lastName: validateField("lastName", value),
                    }));
                  }}
                  className={`w-full h-10 pl-11 pr-10 bg-background border rounded-md
                ${
                  errors.lastName
                    ? "border-red-500"
                    : "border-border focus:border-primary"
                }`}
                />
              </div>
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
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
                  onChange={(e) => {
                    const value = e.target.value;
                    setUsername(value);

                    setErrors((prev) => ({
                      ...prev,
                      username: validateField("username", value),
                    }));
                  }}
                  className={`w-full h-10 pl-11 pr-10 bg-background border rounded-md
                ${
                  errors.username
                    ? "border-red-500"
                    : "border-border focus:border-primary"
                }`}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
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
                    className={`flex items-center gap-3 w-full h-10 px-3 rounded-md border border-border bg-background text-left ${errors.dateOfBirth ? "border-red-500" : ""}`}
                  >
                    <Cake className="w-4 h-4 text-[#93A3CA] shrink-0" />

                    <span
                      className={`text-sm ${
                        dob ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {selectedDate
                        ? format(selectedDate, "dd/MM/yyyy")
                        : "DD/MM/YYYY"}
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
                    }}
                    disabled={(date) => date > maxDate || date < startMonth}
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
              <label className="type-desc text-secondary">Phone Number</label>

              <div
                className={`flex items-center h-10 rounded-lg border bg-white overflow-hidden transition-all focus-within:border-primary `}
              >
                <div className="flex items-center gap-2 bg-gray-50 border-r border-border h-full px-3 shrink-0 text-sm font-medium text-gray-500">
                  <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/10 items-center justify-center">
                    <Flags.KH className="w-full object-cover" />
                  </span>

                  <span className="text-primary">+855</span>
                </div>

                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  className="w-full h-full border-0 bg-transparent px-3 text-primary outline-none focus-visible:ring-0 shadow-none placeholder:text-gray-400"
                  placeholder="123 456 789"
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

          <div className="flex flex-col gap-1.5 w-full">
            <label className="type-detail-semibold text-secondary">
              Profile Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 bg-background border border-border rounded-md type-detail text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="border-t border-border pt-5 space-y-4">
            <h3 className="type-detail-semibold text-secondary text-base">
              Connected Networks
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-1">
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl bg-background shadow-xs transition-colors
                    ${
                      errors.linkedinUrl
                        ? "border border-red-500"
                        : "border border-border focus-within:border-primary"
                    }`}
                >
                  <div className="shrink-0">
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

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-accent uppercase tracking-wider mb-1">
                      LinkedIn URL
                    </label>

                    <input
                      type="text"
                      value={linkedinUrl}
                      onChange={(e) => {
                        const value = e.target.value;
                        setLinkedinUrl(value);

                        setErrors((prev) => ({
                          ...prev,
                          linkedinUrl: validateField("linkedinUrl", value),
                        }));
                      }}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {errors.linkedinUrl && (
                  <p className="text-xs text-red-500 px-1">
                    {errors.linkedinUrl}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl bg-background shadow-xs transition-colors
                  ${
                    errors.githubUrl
                      ? "border border-red-500"
                      : "border border-border focus-within:border-primary"
                  }`}
                >
                  <div className="shrink-0">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="40" height="40" rx="20" fill="#0F172A" />
                      <path
                        d="M17 27.0034C12 28.5034 12 24.5034 10 24.0034M24 30.0034V26.1334C24.0375 25.6565 23.9731 25.1772 23.811 24.7271C23.6489 24.2771 23.3929 23.8668 23.06 23.5234C26.2 23.1734 29.5 21.9834 29.5 16.5234C29.4997 15.1272 28.9627 13.7846 28 12.7734C28.4559 11.5519 28.4236 10.2017 27.91 9.00336C27.91 9.00336 26.73 8.65336 24 10.4834C21.708 9.86218 19.292 9.86218 17 10.4834C14.27 8.65336 13.09 9.00336 13.09 9.00336C12.5764 10.2017 12.5441 11.5519 13 12.7734C12.0301 13.7921 11.4925 15.1468 11.5 16.5534C11.5 21.9734 14.8 23.1634 17.94 23.5534C17.611 23.8933 17.3573 24.2988 17.1953 24.7433C17.0334 25.1878 16.9668 25.6614 17 26.1334V30.0034"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-accent uppercase tracking-wider mb-1">
                      GitHub URL
                    </label>

                    <input
                      type="text"
                      value={githubUrl}
                      onChange={(e) => {
                        const value = e.target.value;
                        setGithubUrl(value);

                        setErrors((prev) => ({
                          ...prev,
                          githubUrl: validateField("githubUrl", value),
                        }));
                      }}
                      placeholder="https://github.com/..."
                      className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {errors.githubUrl && (
                  <p className="text-xs text-red-500 px-1">
                    {errors.githubUrl}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl bg-background shadow-xs transition-colors
                ${
                  errors.facebookUrl
                    ? "border border-red-500"
                    : "border border-border focus-within:border-primary"
                }`}
                >
                  <div className="shrink-0">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="40" height="40" rx="20" fill="#1877F2" />
                      <path
                        d="M22.5 14H20.5C18.57 14 17 15.57 17 17.5V20H15V22.5H17V28H20.5V22.5H23L23.5 20H20.5V17.5C20.5 17.22 20.72 17 21 17H23.5V14Z"
                        fill="white"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-accent uppercase tracking-wider mb-1">
                      Facebook URL
                    </label>

                    <input
                      type="text"
                      value={facebookUrl}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFacebookUrl(value);

                        setErrors((prev) => ({
                          ...prev,
                          facebookUrl: validateField("facebookUrl", value),
                        }));
                      }}
                      placeholder="https://facebook.com/username"
                      className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {errors.facebookUrl && (
                  <p className="text-xs text-red-500 px-1">
                    {errors.facebookUrl}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl bg-background shadow-xs transition-colors
                  ${
                    errors.telegramUrl
                      ? "border border-red-500"
                      : "border border-border focus-within:border-primary"
                  }`}
                >
                  <div className="shrink-0">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="40" height="40" rx="20" fill="#24A1DE" />
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

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-accent uppercase tracking-wider mb-1">
                      Telegram URL
                    </label>

                    <input
                      type="text"
                      value={telegramUrl}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTelegramUrl(value);

                        setErrors((prev) => ({
                          ...prev,
                          telegramUrl: validateField("telegramUrl", value),
                        }));
                      }}
                      placeholder="https://t.me/..."
                      className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {errors.telegramUrl && (
                  <p className="text-xs text-red-500 px-1">
                    {errors.telegramUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isPending || isUploading}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-md type-detail-semibold hover:opacity-90 shadow-xs border-0 cursor-pointer transition-opacity disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Change"}
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-xs space-y-4 w-full">
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
                  d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22C6.26 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
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
          <button
            type="button"
            onClick={() => setIsBankOpen(true)}
            className="bg-action text-white px-4 py-2 rounded-md type-detail-semibold flex items-center gap-2 hover:opacity-90 shadow-xs border-0 cursor-pointer transition-opacity"
          >
            <Link2 className="w-4 h-4" />
            Connect WeBill365
          </button>
        </div>

        <div className="flex items-start gap-3 p-4 bg-grey-50 border border-border rounded-2xl w-full">
          <div className="shrink-0 mt-0.5">
            <svg
              width="45"
              height="45"
              viewBox="0 0 45 45"
              fill="none"
              xmlns="http://www.w3.org/2000/xl"
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
              <span className="type-detail text-grey-500 flex mt-0.5 leading-relaxed">
                Your account is successfully connected for payment. You can now
                receive monthly payments from renters.
              </span>
            </div>
          </div>
        </div>
      </div>

      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
      />
      <ConnectBankModal
        isOpen={isBankOpen}
        onClose={() => setIsBankOpen(false)}
      />

      {selectedImageSrc && (
        <ImageAdjustModal
          imageSrc={selectedImageSrc}
          isOpen={isAdjustOpen}
          onClose={() => {
            sessionStorage.removeItem("pending-avatar");
            setSelectedImageSrc(null);
            setIsAdjustOpen(false);
          }}
          onSave={handleSaveCroppedAvatar}
        />
      )}
    </div>
  );
}
