"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import NextImage from "next/image";
import { Camera, Link2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { profileService } from "@/service/profile.service";

import {
  getIdentityMeAction,
  updateIdentityMeAction,
  updateProfileMeAction,
} from "@/actions/profile.action";

import { uploadFileAction } from "@/actions/file.action";
import ResetPasswordModal from "../../pop-up/reset-modal/ResetPasswordModal";
import ConnectBankModal from "@/components/site/pop-up/payment/WebillConnectModal";
import ImageAdjustModal from "@/components/site/profile/ImageAdjustModal";
import { NavigationGuard } from "@/components/dashboard/NavigationGuard";
import Loading from "@/app/loading";

import AdminBasicInfo from "./sections/admin/AdminBasicInfo";
import AdminBio from "./sections/admin/AdminBio";
import AdminSocialAccounts from "./sections/admin/AdminSocialAccounts";

interface CurrentUser {
  name: string;
  email: string;
  avatarInitials: string;
}

interface IdentitySnapshot {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  phoneNumber: string;
}

interface ProfileSnapshot {
  bio: string;
  avatar: string | null;
  socials: {
    linkedin: string;
    github: string;
    facebook: string;
    telegram: string;
  };
}

type SocialAccount = {
  platform: string;
  url: string;
};

export default function AdminProfileForm({ user }: { user: CurrentUser }) {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [appUserId, setAppUserId] = useState("");
  const profileRoute = appUserId ? `/profile/${appUserId}` : "/profile";

  const [initialIdentity, setInitialIdentity] =
    useState<IdentitySnapshot | null>(null);

  const [initialProfile, setInitialProfile] = useState<ProfileSnapshot | null>(
    null,
  );

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("Admin");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("Female");
  const [dob, setDob] = useState("2005-05-15");
  const [phoneNumber, setPhoneNumber] = useState("012345678");
  const [email, setEmail] = useState("admin@gmail.com");
  const [bio, setBio] = useState("");

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");



  const hasPendingImage = isAdjustOpen && selectedImageSrc !== null;

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2) {
          return "First name must be at least 2 characters";
        }
        return "";

      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2) {
          return "Last name must be at least 2 characters";
        }
        return "";

      case "username":
        if (!value.trim()) return "Username is required";
        if (!/^[a-z0-9_]+$/.test(value)) {
          return "Username can only contain lowercase letters, numbers and underscore";
        }
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

        if (!/^0\d{8,9}$/.test(value) && !/^[1-9]\d{7,8}$/.test(value)) {
          return "Enter a valid phone number";
        }

        return "";

      case "linkedinUrl":
        if (!value.trim()) return "";

        try {
          const url = new URL(value);
          if (!url.hostname.toLowerCase().includes("linkedin.com")) {
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
          if (!url.hostname.toLowerCase().includes("github.com")) {
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
          if (!url.hostname.toLowerCase().includes("facebook.com")) {
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
          const host = url.hostname.toLowerCase();

          const isValidTelegram =
            host.includes("t.me") ||
            host.includes("telegram.me") ||
            host.includes("telegram.org");

          if (!isValidTelegram) {
            return "Please enter a valid Telegram URL";
          }
        } catch {
          return "Invalid URL";
        }

        return "";

      case "dateOfBirth":
        if (!value.trim()) return "Date of birth is required";

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

    return !Object.values(newErrors).some(Boolean);
  };

  useEffect(() => {
    const loadAllUserData = async () => {
      const token = session?.accessToken;

      if (!token) return;

      try {
        const [profileRes, identityRes] = await Promise.allSettled([
          profileService.getProfileMe(token),
          getIdentityMeAction(),
        ]);

        let identityAvatarFallback: string | null = null;

        if (identityRes.status === "fulfilled" && identityRes.value) {
          const identityVal = identityRes.value as Record<string, unknown>;
          const idData =
            (identityVal.payload as Record<string, unknown>) || identityVal;

          setAppUserId((idData.appUserId as string) || "");

          const rawPhoneNumber = (idData.phoneNumber as string) || "";

          const cleanedPhoneNumber = rawPhoneNumber
            .replace("+855", "")
            .replace(/^855/, "")
            .trim();

          const identitySnapshot: IdentitySnapshot = {
            firstName: (idData.firstName as string) || "Admin",
            lastName: (idData.lastName as string) || "",
            username: (idData.username as string) || "",
            dateOfBirth: (idData.dateOfBirth as string) || "2005-05-15",
            phoneNumber: cleanedPhoneNumber,
          };

          setInitialIdentity(identitySnapshot);
          setFirstName(identitySnapshot.firstName);
          setLastName(identitySnapshot.lastName);
          setUsername(identitySnapshot.username);
          setDob(identitySnapshot.dateOfBirth);
          setPhoneNumber(identitySnapshot.phoneNumber);

          if (idData.email) {
            setEmail(idData.email as string);
          }

          if (idData.avatar || idData.profilePicture || idData.avatarUrl) {
            identityAvatarFallback = (idData.avatar ||
              idData.profilePicture ||
              idData.avatarUrl) as string;
          }

          if (idData.gender) {
            const rawGender = (idData.gender as string).toUpperCase();

            if (rawGender === "M" || rawGender === "MALE") {
              setGender("Male");
            } else if (rawGender === "F" || rawGender === "FEMALE") {
              setGender("Female");
            } else {
              setGender(idData.gender as string);
            }
          }
        }

        if (profileRes.status === "fulfilled" && profileRes.value?.success) {
          const p = profileRes.value.payload;

          let lUrl = "";
          let gUrl = "";
          let fUrl = "";
          let tUrl = "";

          const resolvedAvatar: string | null =
            p.profilePicture || identityAvatarFallback || null;

          if (resolvedAvatar) {
            setAvatarUrl(resolvedAvatar);
          }

          if (p.socialAccount && p.socialAccount.length > 0) {
            (p.socialAccount as SocialAccount[]).forEach((s) => {
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

          const profileSnapshot: ProfileSnapshot = {
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
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingData(false);
        const draftStr = sessionStorage.getItem(`draft-admin-profile-${session?.user?.email}`);
        if (draftStr) {
          try {
            const draft = JSON.parse(draftStr);
            if (draft.firstName) setFirstName(draft.firstName);
            if (draft.lastName) setLastName(draft.lastName);
            if (draft.username) setUsername(draft.username);
            if (draft.dob) setDob(draft.dob);
            if (draft.phoneNumber) setPhoneNumber(draft.phoneNumber);
            if (draft.email) setEmail(draft.email);
            if (draft.gender) setGender(draft.gender);
            if (draft.bio !== undefined) setBio(draft.bio);
            if (draft.linkedinUrl !== undefined) setLinkedinUrl(draft.linkedinUrl);
            if (draft.githubUrl !== undefined) setGithubUrl(draft.githubUrl);
            if (draft.facebookUrl !== undefined) setFacebookUrl(draft.facebookUrl);
            if (draft.telegramUrl !== undefined) setTelegramUrl(draft.telegramUrl);
          } catch {
          }
        }
      }
    };

    loadAllUserData();
  }, [session]);

  useEffect(() => {
    if (isLoadingData) return;
    const draft = {
      firstName, lastName, username, dob, phoneNumber, email, gender,
      bio, linkedinUrl, githubUrl, facebookUrl, telegramUrl
    };
    sessionStorage.setItem(`draft-admin-profile-${session?.user?.email}`, JSON.stringify(draft));
  }, [firstName, lastName, username, dob, phoneNumber, email, gender, bio, linkedinUrl, githubUrl, facebookUrl, telegramUrl, isLoadingData, session?.user?.email]);

  useEffect(() => {
    const pendingAvatar = sessionStorage.getItem("pending-avatar");

    if (pendingAvatar) {
      queueMicrotask(() => {
        setSelectedImageSrc(pendingAvatar);
        setIsAdjustOpen(true);
      });
    }
  }, []);

  const MAX_IMAGE_SIZE = 15 * 1024 * 1024;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be less than 10MB.");
      e.target.value = "";
      return;
    }

    setError(null);

    const objectUrl = URL.createObjectURL(file);

    sessionStorage.setItem("pending-avatar", objectUrl);

    setSelectedImageSrc(objectUrl);
    setIsAdjustOpen(true);

    e.target.value = "";
  };

  const handleSaveCroppedAvatar = async (croppedBlob: Blob) => {
    setIsAdjustOpen(false);
    setIsUploading(true);
    setError(null);
    if (croppedBlob.size > MAX_IMAGE_SIZE) {
      toast.error("Cropped image must be less than 10MB.");
      return;
    }

    const localBlobUrl = URL.createObjectURL(croppedBlob);
    setAvatarUrl(localBlobUrl);

    const dataPayload = new FormData();
    dataPayload.append("file", croppedBlob, "admin-avatar.jpg");

    try {
      const result = (await uploadFileAction(dataPayload)) as Record<
        string,
        unknown
      >;

      const resultPayload = result?.payload as
        | Record<string, unknown>
        | undefined;

      const fileUrl =
        resultPayload?.fileUrl ||
        resultPayload?.url ||
        result?.fileUrl ||
        result?.url;

      if (fileUrl) {
        setAvatarUrl(fileUrl as string);
      } else {
        setError(
          (resultPayload?.error ||
            result?.error ||
            result?.message ||
            "Upload failed.") as string,
        );

        setAvatarUrl(initialProfile?.avatar || null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setAvatarUrl(initialProfile?.avatar || null);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setIsUploading(false);
    }
  };

  const identityChanged =
    initialIdentity?.firstName !== firstName.trim() ||
    initialIdentity?.lastName !== lastName.trim() ||
    initialIdentity?.username !== username.trim() ||
    initialIdentity?.dateOfBirth !== dob.trim() ||
    initialIdentity?.phoneNumber !== phoneNumber.trim();

  const socialsChanged =
    initialProfile?.socials.linkedin !== linkedinUrl.trim() ||
    initialProfile?.socials.github !== githubUrl.trim() ||
    initialProfile?.socials.facebook !== facebookUrl.trim() ||
    initialProfile?.socials.telegram !== telegramUrl.trim();

  const profileChanged =
    initialProfile?.bio !== bio.trim() ||
    initialProfile?.avatar !== avatarUrl ||
    socialsChanged;

  // const isFormDirty = (identityChanged || profileChanged) && !isPending;
  const isFormDirty =
    (identityChanged || profileChanged || hasPendingImage) && !isPending;

  const handleDiscardClick = () => {
    if (isFormDirty) {
      const event = new CustomEvent("trigger-unsaved-guard", {
        detail: {
          route: profileRoute,
        },
      });

      window.dispatchEvent(event);
      return;
    }

    sessionStorage.removeItem("pending-avatar");
    router.replace(profileRoute);
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
      phoneNumber: `+855${phoneNumber.trim()}`,
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

    const currentProfilePayload: Record<string, unknown> = {
      bio: bio.trim(),
      avatar: avatarUrl,
      profilePicture: avatarUrl,
      avatarUrl,
      socialAccount: activeSocials,
    };

    if (!identityChanged && !profileChanged) {
      sessionStorage.removeItem(`draft-admin-profile-${session?.user?.email}`);
      router.replace(profileRoute);
      return;
    }

    startTransition(async () => {
      try {
        const updatePromises: Promise<unknown>[] = [];

        if (identityChanged) {
          updatePromises.push(updateIdentityMeAction(currentIdentityPayload));
        } else {
          updatePromises.push(Promise.resolve({ success: true }));
        }

        if (profileChanged) {
          updatePromises.push(
            updateProfileMeAction(
              currentProfilePayload as unknown as import("@/types/profile-edit-type").UpdateProfileRequest,
            ),
          );
        } else {
          updatePromises.push(Promise.resolve({ success: true }));
        }

        type ActionResult = {
          success?: boolean;
          message?: string;
          error?: string;
        };

        const [identityResult, profileResult] = (await Promise.all(
          updatePromises,
        )) as [ActionResult, ActionResult];

        if (identityResult?.success && profileResult?.success) {
          sessionStorage.removeItem(`draft-admin-profile-${session?.user?.email}`);
          sessionStorage.removeItem("pending-avatar");
          toast.success("Profile updated successfully.");
          router.replace(profileRoute);
          router.refresh();
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
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "An exception blocked synchronization attempts.",
        );
      }
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFormDirty) return;

      e.preventDefault();

      e.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty]);

  return (
    <div className="space-y-6 w-full text-left">
      {isLoadingData ? (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          <Loading />
        </div>
      ) : (
        <>
          <NavigationGuard isDirty={isFormDirty} />

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
                    <NextImage
                      src={avatarUrl}
                      alt="Profile Avatar"
                      width={80}
                      height={80}
                      unoptimized
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
                type="button"
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

              <AdminBasicInfo
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                username={username}
                setUsername={setUsername}
                gender={gender}
                dob={dob}
                setDob={setDob}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                email={email}
                errors={errors}
                setErrors={setErrors}
                validateField={validateField}
                isCalendarOpen={isCalendarOpen}
                setIsCalendarOpen={setIsCalendarOpen}
              />

              <AdminBio bio={bio} setBio={setBio} />

              <AdminSocialAccounts
                linkedinUrl={linkedinUrl}
                setLinkedinUrl={setLinkedinUrl}
                githubUrl={githubUrl}
                setGithubUrl={setGithubUrl}
                facebookUrl={facebookUrl}
                setFacebookUrl={setFacebookUrl}
                telegramUrl={telegramUrl}
                setTelegramUrl={setTelegramUrl}
                errors={errors}
                setErrors={setErrors}
                validateField={validateField}
              />
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={handleDiscardClick}
                className="w-full sm:w-auto px-5 py-2 border border-primary rounded-md type-detail-semibold text-primary hover:bg-grey-50 bg-white cursor-pointer order-2 sm:order-1"
              >
                Discard Changes
              </button>

              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isPending || isUploading}
                className="w-full sm:w-auto px-5 py-2 bg-primary text-primary-foreground rounded-md type-detail-semibold hover:opacity-90 shadow-xs border-0 cursor-pointer transition-opacity disabled:opacity-50 order-1 sm:order-2"
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
                    Your account is successfully connected for payment. You can
                    now receive monthly payments from renters.
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
        </>
      )}
    </div>
  );
}
