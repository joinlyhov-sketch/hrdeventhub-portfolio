"use client";

import React, { useEffect, useState, useTransition, useRef } from "react";
import { useSession } from "next-auth/react";
import { profileService, University } from "@/service/profile.service";
import {
  deleteResumeAction,
  getIdentityMeAction,
  updateIdentityMeAction,
  updateProfileMeAction,
} from "@/actions/profile.action";
import { useRouter } from "next/navigation";
import { uploadFileAction } from "@/actions/file.action";
import ImageAdjustModal from "../ImageAdjustModal";
import { toast } from "sonner";
import { AddSkillModal } from "@/components/dashboard/AddSkillModal";
import ResetPasswordModal from "../../pop-up/reset-modal/ResetPasswordModal";
import { DeleteResumeModal } from "@/components/dashboard/DeleteResumeModal";
import { NavigationGuard } from "@/components/dashboard/NavigationGuard";
import Loading from "@/app/loading";

import StudentBasicInfo from "./sections/student/StudentBasicInfo";
import StudentBio from "./sections/student/StudentBio";
import StudentSocialAccounts from "./sections/student/StudentSocialAccounts";
import StudentEducation, { EducationEntry } from "./sections/student/StudentEducation";
import StudentSkills from "./sections/student/StudentSkills";
import StudentResume from "./sections/student/StudentResume";

export default function StudentProfileForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [initialCvResumeUrl, setInitialCvResumeUrl] = useState("");

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [pendingCvFile, setPendingCvFile] = useState<File | null>(null);
  const [hasRole, setHasRole] = useState(false);

  const [initialIdentity, setInitialIdentity] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [initialProfile, setInitialProfile] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [educationErrors, setEducationErrors] = useState<
    {
      startYear?: string;
      endYear?: string;
    }[]
  >([]);
  const [appUserId, setAppUserId] = useState("");
  const profileRoute = appUserId ? `/profile/${appUserId}` : "/profile";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Female");


  const [bio, setBio] = useState("");
  const [currentStatus, setCurrentStatus] = useState("studying");
  const [profilePicture, setProfilePicture] = useState<string | null>("");
  const [cvResumeUrl, setCvResumeUrl] = useState<string | null>("");
  const [isDeleteResumeModalOpen, setIsDeleteResumeModalOpen] = useState(false);

  const [profileSharingMode] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [skills, setSkills] = useState<string[]>([]);



  const [education, setEducation] = useState<EducationEntry[]>([
    {
      institutionName: "",
      institutionAbbreviation: "",
      institutionLogo: "",
      degree: "",
      startYear: 2026,
      endYear: null,
      isCurrent: true,
    },
  ]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [openUniversityIndex, setOpenUniversityIndex] = useState<number | null>(
    null,
  );
  const [openAbbreviationIndex, setOpenAbbreviationIndex] = useState<
    number | null
  >(null);
  const [universitySearch, setUniversitySearch] = useState<
    Record<number, string>
  >({});
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({
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
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        return "";

      case "lastName":
        if (!value.trim()) return "Last name is required";
        return "";

      case "username":
        if (!value.trim()) return "Username is required";
        if (/\s/.test(value)) return "Username cannot contain spaces";
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return "Username can only contain letters, numbers and underscore";
        }
        return "";

      case "dob":
        if (!value.trim()) return "Date of birth is required";
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Format must be YYYY-MM-DD";
        const birthDate = new Date(value);
        if (isNaN(birthDate.getTime())) return "Invalid date";
        const [year, month, day] = value.split("-").map(Number);
        if (
          birthDate.getFullYear() !== year ||
          birthDate.getMonth() + 1 !== month ||
          birthDate.getDate() !== day
        ) {
          return "Invalid date";
        }
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 16) return "You must be at least 16 years old";
        return "";

      case "phoneNumber":
        if (!value.trim()) return "Phone number is required";
        if (value.includes("+")) return "Do not include country code";
        if (!/^\d+$/.test(value)) return "Phone number must contain digits only";
        if (!/^0\d{8,9}$/.test(value) && !/^[1-9]\d{7,8}$/.test(value)) {
          return "Enter a valid phone number";
        }
        return "";

      case "currentStatus":
        if (!value.trim()) return "Current status is required";
        return "";

      default:
        return "";
    }
  };

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
    if (bio.length > 500) {
      newErrors.bio = "Bio description cannot exceed 500 characters";
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

  const handleDiscardClick = () => {
    if (isFormDirty) {
      const event = new CustomEvent("trigger-unsaved-guard", {
        detail: { isBack: true },
      });
      window.dispatchEvent(event);
    } else {
      router.back();
      sessionStorage.removeItem("pending-avatar");
    }
  };
  const currentIdentityPayload = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    username: username.trim(),
    dateOfBirth: dob.trim(),
    phoneNumber: `+855${phoneNumber.trim()}`,
  };

  const validEducation = education.filter(
    (edu) => String(edu.institutionName).trim() !== "",
  );

  const identityChanged =
    JSON.stringify(currentIdentityPayload) !== JSON.stringify(initialIdentity);

  const profileChanged =
    initialProfile?.bio !== bio ||
    initialProfile?.currentStatus !== currentStatus.toLowerCase() ||
    initialProfile?.profilePicture !== profilePicture ||
    initialProfile?.cvResumeUrl !== cvResumeUrl ||
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

  const isFormDirty = (identityChanged || profileChanged) && !isPending;
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
      setSelectedImageSrc(pendingAvatar);
      setIsAdjustModalOpen(true);
    }
  }, []);
  useEffect(() => {
    const fetchUniversities = async () => {
      const token = session?.accessToken;
      if (!token) return;

      try {
        setIsLoadingUniversities(true);
        const result = await profileService.getUniversities(token);
        setUniversities(result);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
        setUniversities([]);
      } finally {
        setIsLoadingUniversities(false);
      }
    };

    fetchUniversities();
  }, [session?.accessToken]);

  useEffect(() => {
    const loadAllUserData = async () => {
      const token = session?.accessToken;
      if (!token) return;

      try {
        const [profileRes, identityRes] = await Promise.allSettled([
          profileService.getProfileMe(token),
          getIdentityMeAction(),
        ]);
        if (!profileRes) {
          setIsLoadingData(false);
          return;
        }

        if (identityRes.status === "fulfilled" && identityRes.value) {
          const idValue = identityRes.value as Record<string, unknown>;
          const idData =
            (idValue.payload as Record<string, unknown>) || idValue;
          setAppUserId((idData.appUserId as string) || "");
          const rawPhoneNumber =
            (idData.phoneNumber as string) ||
            (idData.phone_number as string) ||
            (idData.phone as string) ||
            "";

          const cleanedPhoneNumber = rawPhoneNumber
            .replace("+855", "")
            .replace(/^855/, "")
            .trim();

          const identitySnapshot = {
            firstName: (idData.firstName as string) || "",
            lastName: (idData.lastName as string) || "",
            username: (idData.username as string) || "",
            dateOfBirth: (idData.dateOfBirth as string) || "",
            phoneNumber: cleanedPhoneNumber,
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
          setHasRole(!!idData.role);
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
              institutionLogo: "",
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
              institutionLogo: edu.institutionLogo || "",
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
      } finally {
        setIsLoadingData(false);
        const draftStr = sessionStorage.getItem(`draft-student-profile-${session?.user?.email}`);
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
            if (draft.currentStatus) setCurrentStatus(draft.currentStatus);
            if (draft.linkedinUrl !== undefined) setLinkedinUrl(draft.linkedinUrl);
            if (draft.githubUrl !== undefined) setGithubUrl(draft.githubUrl);
            if (draft.facebookUrl !== undefined) setFacebookUrl(draft.facebookUrl);
            if (draft.telegramUrl !== undefined) setTelegramUrl(draft.telegramUrl);
            if (draft.skills) setSkills(draft.skills);
            if (draft.educationList) setEducation(draft.educationList);
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
      bio, currentStatus, linkedinUrl, githubUrl, facebookUrl, telegramUrl,
      skills, educationList: education
    };
    sessionStorage.setItem(`draft-student-profile-${session?.user?.email}`, JSON.stringify(draft));
  }, [firstName, lastName, username, dob, phoneNumber, email, gender, bio, currentStatus, linkedinUrl, githubUrl, facebookUrl, telegramUrl, skills, education, isLoadingData, session?.user?.email]);

  const confirmDeleteResume = async () => {
    setPendingCvFile(null);
    setCvResumeUrl("");
    setIsDeleteResumeModalOpen(false);
  };

  const handleContainerClick = () => {
    if (!isUploading) fileInputRef.current?.click();
  };
  const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be less than 15MB.");
      e.target.value = "";
      return;
    }
    setError(null);

    const objectUrl = URL.createObjectURL(file);
    setSelectedImageSrc(objectUrl);
    setIsAdjustModalOpen(true);

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
        setProfilePicture(
          (initialProfile?.profilePicture as string | null) || "",
        );
      }
    } catch {
      setError("A networking issue interrupted the asset transmission.");
      setProfilePicture((initialProfile?.profilePicture as string) || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleResumeFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingCvFile(file);
    setCvResumeUrl(file.name);
    e.target.value = "";
  };

  const handleUpdateEducation = (
    index: number,
    fields: Record<string, unknown>,
  ) => {
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
      phoneNumber: `+855${phoneNumber.trim()}`,
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
        institutionLogo: String(edu.institutionLogo || ""),
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

    if (!identityChanged && !profileChanged && !pendingCvFile) {
      sessionStorage.removeItem(`draft-student-profile-${session?.user?.email}`);
      router.push(profileRoute);
      return;
    }

    startTransition(async () => {
      try {
        let finalCvResumeUrl = cvResumeUrl || null;

        if (pendingCvFile) {
          setIsUploadingResume(true);
          const dataPayload = new FormData();
          dataPayload.append("file", pendingCvFile);
          const uploadResult = await uploadFileAction(dataPayload);
          setIsUploadingResume(false);

          if (uploadResult.ok && uploadResult.payload?.fileUrl) {
            finalCvResumeUrl = uploadResult.payload.fileUrl;
            setCvResumeUrl(finalCvResumeUrl);
            currentProfilePayload.cvResumeUrl = finalCvResumeUrl;
          } else {
            toast.error(uploadResult.error || "Failed to upload resume.");
            return;
          }
        }

        const updatePromises: Promise<unknown>[] = [];
        if (identityChanged)
          updatePromises.push(updateIdentityMeAction(currentIdentityPayload));
        else
          updatePromises.push(
            Promise.resolve({ success: true, skipped: true }),
          );

        if (profileChanged || pendingCvFile) {
          updatePromises.push(updateProfileMeAction(currentProfilePayload));
        } else
          updatePromises.push(
            Promise.resolve({ success: true, skipped: true }),
          );
        if (!finalCvResumeUrl && initialCvResumeUrl) {
          updatePromises.push(deleteResumeAction());
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
          sessionStorage.removeItem(`draft-student-profile-${session?.user?.email}`);
          toast.success("Profile updated successfully.");
          router.push(profileRoute);
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
          (err as { message?: string })?.message ||
          "An exception blocked synchronization attempts.",
        );
      }
    });
  };

  return (
    <div className="xl:col-span-8 border border-border rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full border-b border-border pb-4">
            <h2 className="type-subtitle-24 text-secondary pb-2">
              Edit Information
            </h2>
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
          <div className="space-y-4">
            <StudentBasicInfo
              profilePicture={profilePicture}
              isUploading={isUploading}
              handleContainerClick={handleContainerClick}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              username={username}
              setUsername={setUsername}
              dob={dob}
              setDob={setDob}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              email={email}
              gender={gender}
              currentStatus={currentStatus}
              setCurrentStatus={setCurrentStatus}
              errors={errors}
              setErrors={setErrors}
              validateField={validateField}
            />

            <StudentBio bio={bio} setBio={setBio} errors={errors} />
          </div>

          <StudentSocialAccounts
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
          />

          <StudentEducation
            education={education}
            setEducation={setEducation}
            openUniversityIndex={openUniversityIndex}
            setOpenUniversityIndex={setOpenUniversityIndex}
            openAbbreviationIndex={openAbbreviationIndex}
            setOpenAbbreviationIndex={setOpenAbbreviationIndex}
            universitySearch={universitySearch}
            setUniversitySearch={setUniversitySearch}
            universities={universities}
            isLoadingUniversities={isLoadingUniversities}
            educationErrors={educationErrors}
            setEducationErrors={setEducationErrors}
            handleUpdateEducation={handleUpdateEducation}
          />

          <StudentSkills
            skills={skills}
            setSkills={setSkills}
            setIsSkillModalOpen={setIsSkillModalOpen}
          />

          <StudentResume
            hasRole={hasRole}
            cvResumeUrl={cvResumeUrl}
            username={username}
            isUploadingResume={isUploadingResume}
            resumeInputRef={resumeInputRef}
            handleResumeFileChange={handleResumeFileChange}
            setIsDeleteResumeModalOpen={setIsDeleteResumeModalOpen}
          />
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 w-full">
            <button
              type="button"
              onClick={() => {
                handleDiscardClick();
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

          <ResetPasswordModal
            isOpen={isResetOpen}
            onClose={() => setIsResetOpen(false)}
          />
          <DeleteResumeModal
            isOpen={isDeleteResumeModalOpen}
            onClose={() => setIsDeleteResumeModalOpen(false)}
            fileName={
              cvResumeUrl
                ? `${username}.${cvResumeUrl.split(".").pop()}`
                : "No Resume Added"
            }
            onConfirm={confirmDeleteResume}
          />
        </>
      )}
    </div>
  );
}
