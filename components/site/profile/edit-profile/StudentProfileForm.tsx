"use client";

import React, { useEffect, useState, useTransition, useRef } from "react";
import { Trash2, CircleX } from "lucide-react";
import { useSession } from "next-auth/react";
import { profileService } from "@/service/profile.service";
import {
  deleteMe,
  getIdentityMeAction,
  updateIdentityMeAction,
  updateProfileMeAction,
} from "@/actions/profile.action";
import { useRouter } from "next/navigation";
import { uploadFileAction } from "@/actions/file.action";
import ImageAdjustModal from "../ImageAdjustModal";
import { toast } from "sonner";
import * as Flags from "country-flag-icons/react/3x2";
import { AddSkillModal } from "@/components/dashboard/AddSkillModal";
import { DeleteResumeModal } from "@/components/dashboard/DeleteResumeModal";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

function UploadSVG() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.9974 6.66667C6.73378 6.66667 7.33073 6.06971 7.33073 5.33333C7.33073 4.59695 6.73378 4 5.9974 4C5.26102 4 4.66406 4.59695 4.66406 5.33333C4.66406 6.06971 5.26102 6.66667 5.9974 6.66667Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.66927 1.33594H6.0026C2.66927 1.33594 1.33594 2.66927 1.33594 6.0026V10.0026C1.33594 13.3359 2.66927 14.6693 6.0026 14.6693H10.0026C13.3359 14.6693 14.6693 13.3359 14.6693 10.0026V6.66927"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 1.33594V5.33594L13.3333 4.0026"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9974 5.33333L10.6641 4"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.78125 12.635L5.06792 10.4283C5.59458 10.075 6.35458 10.115 6.82792 10.5217L7.04792 10.715C7.56792 11.1617 8.40792 11.1617 8.92792 10.715L11.7012 8.335C12.2212 7.88833 13.0613 7.88833 13.5813 8.335L14.6679 9.26833"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StudentProfileForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [initialCvResumeUrl, setInitialCvResumeUrl] = useState("");

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const [initialIdentity, setInitialIdentity] = useState<Record<string, unknown> | null>(null);
  const [initialProfile, setInitialProfile] = useState<Record<string, unknown> | null>(null);
  const [educationErrors, setEducationErrors] = useState<
    {
      startYear?: string;
      endYear?: string;
    }[]
  >([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Female");
  const selectedDate =
    dob && !isNaN(new Date(dob).getTime()) ? new Date(dob) : undefined;

  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 16);

  const startMonth = new Date(1950, 0);
  const endMonth = new Date();

  const [bio, setBio] = useState("");
  const [currentStatus, setCurrentStatus] = useState("studying");
  const [profilePicture, setProfilePicture] = useState<string | null>("");
  const [cvResumeUrl, setCvResumeUrl] = useState<string | null>("");
  const [isDeleteResumeModalOpen, setIsDeleteResumeModalOpen] = useState(false);

  const [profileSharingMode] = useState<
    "PUBLIC" | "PRIVATE"
  >("PUBLIC");
  const [skills, setSkills] = useState<string[]>([]);

  type EducationEntry = {
    institutionName: string;
    institutionAbbreviation: string;
    degree: string;
    startYear: number | string;
    endYear: number | null;
    isCurrent: boolean;
  };

  const [education, setEducation] = useState<EducationEntry[]>([
    {
      institutionName: "",
      institutionAbbreviation: "",
      degree: "",
      startYear: 2026,
      endYear: null,
      isCurrent: true,
    },
  ]);

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    dob: "",
    phoneNumber: "",
    bio: "",
    linkedinUrl: "",
    githubUrl: "",
    facebookUrl: "",
    telegramUrl: "",
  });
  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      username: "",
      dob: "",
      phoneNumber: "",
      bio: "",
      linkedinUrl: "",
      githubUrl: "",
      facebookUrl: "",
      telegramUrl: "",
    };

    let isValid = true;

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (/\s/.test(username)) {
      newErrors.username = "Username cannot contain spaces";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username =
        "Username can only contain letters, numbers and underscore";
      isValid = false;
    }

    if (!dob.trim()) {
      newErrors.dob = "Date of birth is required";
      isValid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      newErrors.dob = "Format must be YYYY-MM-DD";
      isValid = false;
    } else {
      const birthDate = new Date(dob);

      if (isNaN(birthDate.getTime())) {
        newErrors.dob = "Invalid date";
        isValid = false;
      } else {
        const [year, month, day] = dob.split("-").map(Number);

        if (
          birthDate.getFullYear() !== year ||
          birthDate.getMonth() + 1 !== month ||
          birthDate.getDate() !== day
        ) {
          newErrors.dob = "Invalid date";
          isValid = false;
        } else {
          const today = new Date();

          let age = today.getFullYear() - birthDate.getFullYear();

          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          if (age < 16) {
            newErrors.dob = "You must be at least 16 years old";
            isValid = false;
          }
        }
      }
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (phoneNumber.includes("+")) {
      newErrors.phoneNumber = "Do not include country code";
      isValid = false;
    } else if (!/^\d+$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must contain digits only";
      isValid = false;
    } else {
      const isValidPhone =
        /^0\d{8,9}$/.test(phoneNumber) || /^[1-9]\d{7,8}$/.test(phoneNumber);

      if (!isValidPhone) {
        newErrors.phoneNumber = "Enter a valid phone number";
        isValid = false;
      }
    }

    if (
      linkedinUrl.trim() &&
      !/^https?:\/\/(www\.)?linkedin\.com/i.test(linkedinUrl)
    ) {
      newErrors.linkedinUrl = "Invalid LinkedIn URL";
      isValid = false;
    }

    if (
      githubUrl.trim() &&
      !/^https?:\/\/(www\.)?github\.com/i.test(githubUrl)
    ) {
      newErrors.githubUrl = "Invalid GitHub URL";
      isValid = false;
    }

    if (
      facebookUrl.trim() &&
      !/^https?:\/\/(www\.)?facebook\.com/i.test(facebookUrl)
    ) {
      newErrors.facebookUrl = "Invalid Facebook URL";
      isValid = false;
    }

    if (
      telegramUrl.trim() &&
      !/^https:\/\/t\.me\/[a-zA-Z0-9_]{5,32}$/.test(telegramUrl.trim())
    ) {
      newErrors.telegramUrl =
        "Telegram URL must be in the format https://t.me/username";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };
  const validateEducation = () => {
    const currentYear = new Date().getFullYear();
    let isValid = true;

    const newErrors = education.map((edu) => {
      const error: {
        startYear?: string;
        endYear?: string;
      } = {};

      const startYear = Number(edu.startYear);
      const endYear =
        edu.endYear !== null && edu.endYear !== undefined
          ? Number(edu.endYear)
          : null;

      if (edu.institutionName.trim()) {
        if (!/^\d{4}$/.test(String(startYear))) {
          error.startYear = "Year must be 4 digits";
          isValid = false;
        } else if (startYear < 1900) {
          error.startYear = "Year cannot be before 1900";
          isValid = false;
        } else if (startYear > currentYear + 10) {
          error.startYear = "Invalid year";
          isValid = false;
        }
      }

      if (endYear !== null) {
        if (!/^\d{4}$/.test(String(endYear))) {
          error.endYear = "Year must be 4 digits";
          isValid = false;
        } else if (endYear < 1900) {
          error.endYear = "Year cannot be before 1900";
          isValid = false;
        } else if (endYear > currentYear + 10) {
          error.endYear = "Invalid year";
          isValid = false;
        } else if (endYear < startYear) {
          error.endYear = "End year must be after start year";
          isValid = false;
        }
      }

      return error;
    });

    setEducationErrors(newErrors);

    return isValid;
  };

  useEffect(() => {
    const pendingAvatar = sessionStorage.getItem("pending-avatar");
    if (pendingAvatar) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedImageSrc(pendingAvatar);
      setIsAdjustModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const loadAllUserData = async () => {
      const token = session?.accessToken;
      if (!token) return;

      try {
        const [profileRes, identityRes] = await Promise.allSettled([
          profileService.getProfileMe(token),
          getIdentityMeAction(),
        ]);

        if (identityRes.status === "fulfilled" && identityRes.value) {
          const idValue = identityRes.value as Record<string, unknown>;
          const idData = (idValue.payload as Record<string, unknown>) || idValue;
          const identitySnapshot = {
            firstName: (idData.firstName as string) || "",
            lastName: (idData.lastName as string) || "",
            username: (idData.username as string) || "",
            dateOfBirth: (idData.dateOfBirth as string) || "",
            phoneNumber: (idData.phoneNumber as string) || "",
          };
          setInitialIdentity(identitySnapshot);
          setFirstName(identitySnapshot.firstName);
          setLastName(identitySnapshot.lastName);
          setUsername(identitySnapshot.username);
          setDob(identitySnapshot.dateOfBirth);
          setPhoneNumber(identitySnapshot.phoneNumber);
          if (idData.email) setEmail(idData.email as string);
          if (idData.gender) {
            const rawGender = (idData.gender as string).toUpperCase();
            if (rawGender === "M" || rawGender === "MALE") setGender("Male");
            else if (rawGender === "F" || rawGender === "FEMALE")
              setGender("Female");
            else setGender(idData.gender as string);
          }
        }

        if (profileRes.status === "fulfilled" && profileRes.value?.success) {
          const p = profileRes.value.payload;
          setBio(p.bio || "");
          setCurrentStatus(p.currentStatus || "studying");
          setProfilePicture(p.profilePicture || "");
          setCvResumeUrl(p.cvResumeUrl || "");
          setInitialCvResumeUrl(p.cvResumeUrl || "");

          let parsedSkills: string[] = [];
          if (p.skills && p.skills[0]) {
            parsedSkills = p.skills[0]
              .split(",")
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0);
            setSkills(parsedSkills);
          }

          let lUrl = "",
            gUrl = "",
            fUrl = "",
            tUrl = "";
          if (p.socialAccount && p.socialAccount.length > 0) {
            type SocialAccount = { platform: string; url: string };
            const linkedin = (p.socialAccount as SocialAccount[]).find(
              (s) => s.platform === "linkedin",
            );
            if (linkedin) {
              setLinkedinUrl(linkedin.url);
              lUrl = linkedin.url;
            }
            const github = (p.socialAccount as SocialAccount[]).find(
              (s) => s.platform === "github",
            );
            if (github) {
              setGithubUrl(github.url);
              gUrl = github.url;
            }
            const facebook = (p.socialAccount as SocialAccount[]).find(
              (s) => s.platform === "facebook",
            );
            if (facebook) {
              setFacebookUrl(facebook.url);
              fUrl = facebook.url;
            }
            const telegram = (p.socialAccount as SocialAccount[]).find(
              (s) => s.platform === "telegram",
            );
            if (telegram) {
              setTelegramUrl(telegram.url);
              tUrl = telegram.url;
            }
          }

          let parsedEdu: EducationEntry[] = [
            {
              institutionName: "",
              institutionAbbreviation: "",
              degree: "",
              startYear: 2026,
              endYear: null,
              isCurrent: true,
            },
          ];
          if (p.education && p.education.length > 0) {
            parsedEdu = p.education.map((edu) => ({
              institutionName: edu.institutionName || "",
              institutionAbbreviation: edu.institutionAbbreviation || "",
              degree: edu.degree || "",
              startYear: edu.startYear || 2026,
              endYear: edu.endYear || null,
              isCurrent: edu.isCurrent ?? false,
            }));
            setEducation(parsedEdu);
          }

          setInitialProfile({
            bio: p.bio || "",
            currentStatus: (p.currentStatus || "studying").toLowerCase(),
            profilePicture: p.profilePicture || "",
            cvResumeUrl: p.cvResumeUrl || "",
            skills: parsedSkills,
            education: parsedEdu.filter(
              (edu) => edu.institutionName.trim() !== "",
            ),
            socials: {
              linkedin: lUrl,
              github: gUrl,
              facebook: fUrl,
              telegram: tUrl,
            },
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadAllUserData();
  }, [session]);

  const confirmDeleteResume = async () => {
    if (cvResumeUrl && cvResumeUrl !== initialCvResumeUrl) {
      setCvResumeUrl("");
      toast.success("Resume removed.");
      return;
    }

    const result = await deleteMe() as { success?: boolean };
    console.log(result);
    if (result.success) {
      setCvResumeUrl("");
      toast.success("Resume deleted successfully.");
    } else {
      toast.error("Failed to delete resume.");
    }
  };

  const handleContainerClick = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      sessionStorage.setItem("pending-avatar", base64String);
      setSelectedImageSrc(base64String);
      setIsAdjustModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCroppedImageSave = async (croppedBlob: Blob) => {
    setIsAdjustModalOpen(false);
    setIsUploading(true);
    setError(null);

    sessionStorage.removeItem("pending-avatar");

    const localBlobUrl = URL.createObjectURL(croppedBlob);
    setProfilePicture(localBlobUrl);

    const dataPayload = new FormData();
    dataPayload.append("file", croppedBlob, "profile-avatar.jpg");

    try {
      const result = await uploadFileAction(dataPayload);
      if (result.ok && result.payload?.fileUrl) {
        setProfilePicture(result.payload.fileUrl);
      } else {
        setError(
          result.error || "Profile image upload was rejected by the server.",
        );
        setProfilePicture((initialProfile?.profilePicture as string | null) || "");
      }
    } catch {
      setError("A networking issue interrupted the asset transmission.");
      setProfilePicture(initialProfile?.profilePicture as string || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleResumeFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingResume(true);
    setError(null);
    setCvResumeUrl(file.name);
    const dataPayload = new FormData();
    dataPayload.append("file", file);
    try {
      const result = await uploadFileAction(dataPayload);
      if (result.ok && result.payload?.fileUrl) {
        setCvResumeUrl(result.payload.fileUrl);
        toast.success("Resume uploaded successfully.");
      } else {
        toast.error(result.error || "Failed to upload resume.");
        setCvResumeUrl((initialProfile?.cvResumeUrl as string | null) || "");
      }
    } catch {
      setError(
        "A networking issue interrupted the document asset transmission.",
      );
      setCvResumeUrl(initialProfile?.cvResumeUrl as string || "");
    } finally {
      setIsUploadingResume(false);
      e.target.value = "";
    }
  };

  const handleUpdateEducation = (index: number, fields: Record<string, unknown>) => {
    const updated = [...education];
    updated[index] = { ...updated[index], ...fields };
    setEducation(updated);
  };

  const handleSaveChanges = () => {
    setError(null);

    const isFormValid = validateForm();
    const isEducationValid = validateEducation();

    if (!isFormValid || !isEducationValid) {
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
    const socialAccount = [
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

    const skillsPayload = skills.length > 0 ? [skills.join(", ")] : [];
    const validEducation = education.filter(
      (edu) => String(edu.institutionName).trim() !== "",
    );
    const currentProfilePayload = {
      bio: bio || "",
      profilePicture: profilePicture || null,
      major: String(validEducation[0]?.degree || "Computer Science"),
      currentStatus: currentStatus.toLowerCase(),
      cvResumeUrl: cvResumeUrl || null,
      socialAccount,
      education: validEducation.map((edu) => ({
        institutionName: String(edu.institutionName),
        institutionAbbreviation: String(edu.institutionAbbreviation),
        degree: String(edu.degree),
        startYear: Number(edu.startYear),
        endYear: edu.endYear,
        isCurrent: Boolean(edu.isCurrent),
      })),
      skills: skillsPayload,
      profileSharingMode,
      preferences: null,
    };

    const identityChanged =
      JSON.stringify(currentIdentityPayload) !==
      JSON.stringify(initialIdentity);
    const profileChanged =
      initialProfile?.bio !== currentProfilePayload.bio ||
      initialProfile?.currentStatus !== currentProfilePayload.currentStatus ||
      initialProfile?.profilePicture !== currentProfilePayload.profilePicture ||
      initialProfile?.cvResumeUrl !== currentProfilePayload.cvResumeUrl ||
      initialProfile?.profileSharingMode !==
        currentProfilePayload.profileSharingMode ||
      JSON.stringify(initialProfile?.skills) !== JSON.stringify(skills) ||
      JSON.stringify(initialProfile?.education) !==
        JSON.stringify(validEducation) ||
      JSON.stringify(initialProfile?.socials) !==
        JSON.stringify({
          linkedin: linkedinUrl.trim(),
          github: githubUrl.trim(),
          facebook: facebookUrl.trim(),
          telegram: telegramUrl.trim(),
        });

    if (!identityChanged && !profileChanged) {
      router.back();
      return;
    }

    startTransition(async () => {
      try {
        const updatePromises: Promise<unknown>[] = [];
        if (identityChanged)
          updatePromises.push(updateIdentityMeAction(currentIdentityPayload));
        else
          updatePromises.push(
            Promise.resolve({ success: true, skipped: true }),
          );
        if (profileChanged) {
          console.log("result: ", JSON.stringify(currentProfilePayload));
          updatePromises.push(updateProfileMeAction(currentProfilePayload));
        } else
          updatePromises.push(
            Promise.resolve({ success: true, skipped: true }),
          );

        type ActionResult = { success?: boolean; message?: string; error?: string };
        const [identityResult, profileResult] =
          await Promise.all(updatePromises) as [ActionResult, ActionResult];
        if (identityResult?.success && profileResult?.success) {
          router.refresh();
          router.back();
          toast.success("Profile updated successfully.");
          return;
        }
        if (!identityResult?.success)
          setError(
            identityResult?.message ||
              identityResult?.error ||
              "Identity validation failed.",
          );
        if (!profileResult?.success)
          setError(
            profileResult?.message ||
              profileResult?.error ||
              "Profile validation failed.",
          );
      } catch (err: unknown) {
        setError(
          (err as { message?: string })?.message || "An exception blocked synchronization attempts.",
        );
      }
    });
  };

  return (
    <div className="xl:col-span-8 border border-border rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
      {error && (
        <div className="p-4 text-sm bg-destructive/10 text-destructive rounded-lg font-mono whitespace-pre-wrap">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="type-subtitle-24 text-secondary pb-2">
          Edit Information
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div
            onClick={handleContainerClick}
            className="relative w-[80px] h-[80px] rounded-full overflow-hidden cursor-pointer shrink-0 border-[3px] border-[#444] mt-1"
          >
            {profilePicture ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute opacity-0 hover:opacity-100 duration-300 ease-in-out inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white  rounded-full animate-spin" />
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
                  <div className="w-5 h-5 border-2 border-white  rounded-full animate-spin" />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full min-w-0">
            <div className="flex flex-col gap-1.5">
              <label className="type-desc text-secondary">First Name</label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    firstName: "",
                  }));
                }}
                className={`w-full h-10 px-3 bg-white border rounded-lg ${
                  errors.firstName ? "border-red-500" : "border-border"
                }`}
              />

              {errors.firstName && (
                <p className="text-red-500 text-xs">{errors.firstName}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="type-desc text-secondary">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    lastName: "",
                  }));
                }}
                className={`w-full h-10 px-3 bg-white border rounded-lg ${
                  errors.lastName ? "border-red-500" : "border-border"
                }`}
              />

              {errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="type-desc text-secondary">Username</label>

              <input
                type="text"
                value={username}
                onChange={(e) => {
                  const value = e.target.value;

                  setUsername(value);

                  setErrors((prev) => ({
                    ...prev,
                    username: /\s/.test(value)
                      ? "Username cannot contain spaces"
                      : "",
                  }));
                }}
                className={`w-full h-10 px-3 bg-white border rounded-lg type-detail-medium text-primary ${
                  errors.username ? "border-red-500" : "border-border"
                }`}
              />

              {errors.username && (
                <p className="text-red-500 text-xs">{errors.username}</p>
              )}
            </div>
          </div>
        </div>
        <div
          className="grid grid-cols-1 sm:[grid-template-columns:calc(96px_+_((100%_-_96px_-_32px)/3))_1fr_1fr] gap-4 w-full"
        >
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
                  <CalendarIcon
                    size={16}
                    className="text-muted-foreground shrink-0"
                  />

                  <span
                    className={
                      dob
                        ? "text-primary type-detail-medium"
                        : "text-muted-foreground type-detail-medium"
                    }
                  >
                    {selectedDate
                      ? format(selectedDate, "dd/MM/yyyy")
                      : "DD/MM/YYYY"}
                  </span>
                </button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-0 rounded-xl"
                align="start"
                sideOffset={6}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  captionLayout="dropdown"
                  startMonth={startMonth}
                  endMonth={endMonth}
                  disabled={(date) => {
                    const today = new Date();

                    const maxBirthDate = new Date(
                      today.getFullYear() - 16,
                      today.getMonth(),
                      today.getDate(),
                    );

                    return date > maxBirthDate;
                  }}
                  onSelect={(date) => {
                    if (!date) return;

                    setDob(format(date, "yyyy-MM-dd"));

                    setErrors((prev) => ({
                      ...prev,
                      dob: "",
                    }));
                  }}
                />
              </PopoverContent>
            </Popover>

            {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="type-desc text-secondary">Current Status</label>
            <select
              value={currentStatus.toLowerCase()}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail-medium text-primary focus:outline-hidden focus:border-primary"
            >
              <option value="studying">Studying</option>
              <option value="working">Working</option>
              <option value="job_seeking">Job Seeking</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="type-desc text-secondary">
              Gender (Read Only)
            </label>
            <input
              type="text"
              value={gender}
              disabled
              className="w-full h-10 px-3 border border-border rounded-lg type-detail text-primary focus:outline-hidden bg-white"
            />
          </div>
        </div>
        <div
          className="grid grid-cols-1 sm:[grid-template-columns:calc(96px_+_((100%_-_96px_-_32px)/3))_1fr] gap-4 w-full"
        >
          <div className="flex flex-col gap-1.5">
            <label className="type-desc text-secondary">Phone Number</label>

            <div
              className={`flex items-center h-10 rounded-lg border bg-white overflow-hidden transition-all focus-within:border-primary ${
                errors.phoneNumber ? "border-red-500" : "border-border"
              }`}
            >
              <div className="flex items-center gap-2 bg-gray-50 border-r border-border h-full px-3 shrink-0 text-sm font-medium text-gray-500">
                <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/10 items-center justify-center">
                  <Flags.KH className="w-full object-cover" />
                </span>

                <span className="text-primary">+855</span>
              </div>

              <input
                type="number"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    phoneNumber: "",
                  }));
                }}
                className="w-full h-full border-0 bg-transparent px-3 text-primary outline-none focus-visible:ring-0 shadow-none placeholder:text-gray-400"
                placeholder="123 456 789"
              />
            </div>

            {errors.phoneNumber && (
              <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="type-desc text-secondary">
              Email (Read Only)
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full h-10 px-3 border border-border rounded-lg type-detail text-primary focus:outline-hidden bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="type-desc text-secondary">Profile Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 bg-white border border-border rounded-lg type-detail text-primary focus:outline-hidden focus:border-primary resize-none"
          />
        </div>
      </div>
      <section className="space-y-4">
        <h2 className="type-subtitle-24 text-primary">Social Accounts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex items-end gap-3 w-full">
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
                className={`flex items-center h-12 px-3 border rounded-xl bg-white transition-all focus-within:border-primary ${
                  errors.linkedinUrl ? "border-red-500" : "border-border"
                }`}
              >
                <input
                  type="text"
                  value={linkedinUrl}
                  placeholder="https://linkedin.com/in/username"
                  onChange={(e) => {
                    setLinkedinUrl(e.target.value);

                    setErrors((prev) => ({
                      ...prev,
                      linkedinUrl: "",
                    }));
                  }}
                  className="w-full bg-transparent outline-none type-detail text-foreground font-medium placeholder:text-gray-400"
                />
              </div>

              {errors.linkedinUrl && (
                <p className="text-xs text-red-500">{errors.linkedinUrl}</p>
              )}
            </div>
          </div>

          <div className="flex items-end gap-3 w-full">
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
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="type-detail-small-medium text-accent uppercase tracking-wider text-xs font-semibold">
                GitHub
              </label>
              <div className="flex items-center h-12 px-3 border border-border bg-white rounded-xl focus-within:border-primary transition-all">
                <input
                  type="text"
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="type-detail w-full outline-hidden text-foreground bg-transparent font-medium"
                />
              </div>

              {errors.githubUrl && (
                <p className="text-xs text-red-500">{errors.githubUrl}</p>
              )}
            </div>
          </div>

          <div className="flex items-end gap-3 w-full">
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
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="type-detail-small-medium text-accent uppercase tracking-wider text-xs font-semibold">
                Facebook
              </label>
              <div className="flex items-center h-12 px-3 border border-border bg-white rounded-xl focus-within:border-primary transition-all">
                <input
                  type="text"
                  placeholder="https://facebook.com/username"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="type-detail w-full outline-hidden text-foreground bg-transparent font-medium"
                />
              </div>

              {errors.facebookUrl && (
                <p className="text-xs text-red-500">{errors.facebookUrl}</p>
              )}
            </div>
          </div>

          <div className="flex items-end gap-3 w-full">
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
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="type-detail-small-medium text-accent uppercase tracking-wider text-xs font-semibold">
                Telegram
              </label>
              <div className="flex items-center h-12 px-3 border border-border bg-white rounded-xl focus-within:border-primary transition-all">
                <input
                  type="text"
                  placeholder="https://t.me/username"
                  value={telegramUrl}
                  onChange={(e) => setTelegramUrl(e.target.value)}
                  className="type-detail w-full outline-hidden text-foreground bg-transparent font-medium"
                />
              </div>

              {errors.telegramUrl && (
                <p className="text-xs text-red-500">{errors.telegramUrl}</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="space-y-4 w-full mt-4">
        <div className="flex justify-between items-center gap-2">
          <h2 className="type-subtitle-24 text-primary">Education</h2>
          <button
            type="button"
            onClick={() =>
              setEducation([
                ...education,
                {
                  institutionName: "",
                  institutionAbbreviation: "",
                  degree: "",
                  startYear: 2026,
                  endYear: null,
                  isCurrent: true,
                },
              ])
            }
            className="text-subtle type-detail-semibold flex items-center gap-1 hover:underline bg-transparent border-0 cursor-pointer"
          >
            + add
          </button>
        </div>
        {education.map((edu, idx) => (
          <div
            key={idx}
            className="type-desc-semibold text-primary grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full border-b border-dashed border-border pb-4 last:border-0 relative"
          >
            {idx > 0 && (
              <button
                type="button"
                onClick={() =>
                  setEducation(education.filter((_, i) => i !== idx))
                }
                className="absolute -top-1 -right-1 text-destructive hover:opacity-80 cursor-pointer border-0 bg-transparent"
              >
                <Trash2 size={14} />
              </button>
            )}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-secondary">
                University/Institute/Center
              </label>
              <input
                type="text"
                value={edu.institutionName}
                placeholder="University Name"
                onChange={(e) =>
                  handleUpdateEducation(idx, {
                    institutionName: e.target.value,
                  })
                }
                className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-[#1C4E8D] focus:outline-hidden focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-secondary">
                Major/Course
              </label>
              <input
                type="text"
                value={edu.degree}
                placeholder="Computer Science"
                onChange={(e) =>
                  handleUpdateEducation(idx, { degree: e.target.value })
                }
                className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-[#1C4E8D] focus:outline-hidden focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-secondary">
                Start year
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={edu.startYear || ""}
                placeholder="2023"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  handleUpdateEducation(idx, {
                    startYear: value ? Number(value) : "",
                  });

                  setEducationErrors((prev) => {
                    const copy = [...prev];
                    copy[idx] = {
                      ...copy[idx],
                      startYear: "",
                    };
                    return copy;
                  });
                }}
                className={`w-full h-10 px-3 bg-white border rounded-lg type-detail text-[#1C4E8D]
      ${educationErrors[idx]?.startYear ? "border-red-500" : "border-border"}`}
              />

              {educationErrors[idx]?.startYear && (
                <p className="text-red-500 text-xs">
                  {educationErrors[idx].startYear}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-secondary">
                End year
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={edu.endYear ?? ""}
                placeholder="2026"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  handleUpdateEducation(idx, {
                    endYear: value ? Number(value) : null,
                  });

                  setEducationErrors((prev) => {
                    const copy = [...prev];
                    copy[idx] = {
                      ...copy[idx],
                      endYear: "",
                    };
                    return copy;
                  });
                }}
                className={`w-full h-10 px-3 bg-white border rounded-lg type-detail text-[#1C4E8D]
      ${educationErrors[idx]?.endYear ? "border-red-500" : "border-border"}`}
              />

              {educationErrors[idx]?.endYear && (
                <p className="text-red-500 text-xs font-light">
                  {educationErrors[idx].endYear}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3 w-full">
        <label className="type-desc text-secondary block">
          Skills & Expertise
        </label>
        <div className="flex flex-wrap gap-2 items-center">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 bg-[#E1F1FD] text-primary px-2.5 py-3 rounded-xl type-detail-medium"
            >
              {skill}
              <CircleX
                className="w-3 h-3 text-primary cursor-pointer hover:text-destructive transition-colors"
                onClick={() => setSkills(skills.filter((_, i) => i !== index))}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setIsSkillModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-3 border border-[#C1D8F0] rounded-xl text-secondary type-detail-medium bg-white hover:bg-grey-50 cursor-pointer"
          >
            + Add Skill
          </button>
        </div>
      </div>

      <div className="space-y-4 w-full">
        <label className="type-subtitle text-primary block">Resume</label>
        <input
          type="file"
          ref={resumeInputRef}
          onChange={handleResumeFileChange}
          accept=".pdf,.docx"
          className="hidden"
          disabled={isUploadingResume}
        />
        <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-200 rounded-xl">
          <div className="p-3 bg-[#E5EEFF] text-primary rounded-full mb-2 flex items-center justify-center">
            {isUploadingResume ? (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 17V11L7 13"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11L11 13"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 10H18C15 10 14 9 14 6V2L22 10Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-gray-900 type-desc">Upload New CV</span>
          <span className="text-gray-500 type-desc-small-semibold mt-0.5 mb-4">
            PDF, DOCX up to 10MB
          </span>
          <button
            type="button"
            disabled={isUploadingResume}
            onClick={() => resumeInputRef.current?.click()}
            className="px-6 py-2.5 bg-[#4663AC] primary-hover disabled:opacity-50 text-white type-desc-medium rounded-2xl transition-colors cursor-pointer border-0 shadow-xs"
          >
            Select file
          </button>
        </div>

        <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-white w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg text-gray-500 flex items-center justify-center shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-600"
              >
                <path
                  d="M30 12.375V27C30 31.5 27.315 33 24 33H12C8.685 33 6 31.5 6 27V12.375C6 7.5 8.685 6.375 12 6.375C12 7.305 12.375 8.14499 12.99 8.75999C13.605 9.37499 14.445 9.75 15.375 9.75H20.625C22.485 9.75 24 8.235 24 6.375C27.315 6.375 30 7.5 30 12.375Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 6.375C24 8.235 22.485 9.75 20.625 9.75H15.375C14.445 9.75 13.605 9.37499 12.99 8.75999C12.375 8.14499 12 7.305 12 6.375C12 4.515 13.515 3 15.375 3H20.625C21.555 3 22.395 3.37501 23.01 3.99001C23.625 4.60501 24 5.445 24 6.375Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 19.5H18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 25.5H24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className={`text-sm truncate font-medium ${cvResumeUrl ? "text-[#1C4E8D] type-subtitle" : "text-secondary"}`}
            >
              {cvResumeUrl
                ? `CV_${username}.` + cvResumeUrl.split(".").pop()
                : "CV_Example.pdf"}
            </span>
          </div>
          {cvResumeUrl && (
            <button
              type="button"
              onClick={() => setIsDeleteResumeModalOpen(true)}
            >
              <Trash2 color="red" className="w-5 h-5 cursor-pointer" />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 w-full">
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem("pending-avatar");
            router.back();
          }}
          className="w-full sm:w-auto px-5 py-2 border border-primary rounded-lg type-detail-semibold text-primary hover:bg-grey-50 bg-white cursor-pointer order-2 sm:order-1"
        >
          Discard Changes
        </button>
        <button
          type="button"
          disabled={isPending || isUploading || isUploadingResume}
          onClick={handleSaveChanges}
          className="w-full sm:w-auto px-5 py-2 bg-primary text-white rounded-lg type-detail-semibold hover:bg-primary-hover shadow-xs border-0 cursor-pointer order-1 sm:order-2 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
      {selectedImageSrc && (
        <ImageAdjustModal
          imageSrc={selectedImageSrc}
          isOpen={isAdjustModalOpen}
          onClose={() => {
            sessionStorage.removeItem("pending-avatar");
            setSelectedImageSrc(null);
            setIsAdjustModalOpen(false);
          }}
          onSave={handleCroppedImageSave}
        />
      )}

      <AddSkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onAddSkill={(skill) => {
          if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
            toast.error("This skill already exists.");
            return;
          }

          setSkills((prev) => [...prev, skill]);
          toast.success("Skill added successfully.");
        }}
      />
      <DeleteResumeModal
        isOpen={isDeleteResumeModalOpen}
        onClose={() => setIsDeleteResumeModalOpen(false)}
        fileName={
          cvResumeUrl
            ? `CV_${username}.${cvResumeUrl.split(".").pop()}`
            : undefined
        }
        onConfirm={confirmDeleteResume}
      />
    </div>
  );
}
