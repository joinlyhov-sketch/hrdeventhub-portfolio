"use client";

import React, { useEffect, useState, useTransition, useRef } from "react";
import { Trash2, CircleX } from "lucide-react";
import { useSession } from "next-auth/react";
import { profileService } from "@/service/profile.service";
import {
  getIdentityMeAction,
  updateIdentityMeAction,
  updateProfileMeAction,
} from "@/actions/profile.action";
import { useRouter } from "next/navigation";
import { uploadFileAction } from "@/actions/file.action";
import ImageAdjustModal from "../ImageAdjustModal";

export default function StudentProfileForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const [initialIdentity, setInitialIdentity] = useState<any>(null);
  const [initialProfile, setInitialProfile] = useState<any>(null);

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
  const [profileSharingMode, setProfileSharingMode] = useState<
    "PUBLIC" | "PRIVATE"
  >("PUBLIC");
  const [skills, setSkills] = useState<string[]>([]);

  const [education, setEducation] = useState<any[]>([
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
          const idData = identityRes.value.payload || identityRes.value;
          const identitySnapshot = {
            firstName: idData.firstName || "",
            lastName: idData.lastName || "",
            username: idData.username || "",
            dateOfBirth: idData.dateOfBirth || "",
            phoneNumber: idData.phoneNumber || "",
          };
          setInitialIdentity(identitySnapshot);
          setFirstName(identitySnapshot.firstName);
          setLastName(identitySnapshot.lastName);
          setUsername(identitySnapshot.username);
          setDob(identitySnapshot.dateOfBirth);
          setPhoneNumber(identitySnapshot.phoneNumber);
          if (idData.email) setEmail(idData.email);
          if (idData.gender) {
            const rawGender = idData.gender.toUpperCase();
            if (rawGender === "M" || rawGender === "MALE") setGender("Male");
            else if (rawGender === "F" || rawGender === "FEMALE")
              setGender("Female");
            else setGender(idData.gender);
          }
        }

        if (profileRes.status === "fulfilled" && profileRes.value?.success) {
          const p = profileRes.value.payload;
          setBio(p.bio || "");
          setCurrentStatus(p.currentStatus || "studying");
          setProfilePicture(p.profilePicture || "");
          setCvResumeUrl(p.cvResumeUrl || "");

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
            const linkedin = p.socialAccount.find(
              (s: any) => s.platform === "linkedin",
            );
            if (linkedin) {
              setLinkedinUrl(linkedin.url);
              lUrl = linkedin.url;
            }
            const github = p.socialAccount.find(
              (s: any) => s.platform === "github",
            );
            if (github) {
              setGithubUrl(github.url);
              gUrl = github.url;
            }
            const facebook = p.socialAccount.find(
              (s: any) => s.platform === "facebook",
            );
            if (facebook) {
              setFacebookUrl(facebook.url);
              fUrl = facebook.url;
            }
            const telegram = p.socialAccount.find(
              (s: any) => s.platform === "telegram",
            );
            if (telegram) {
              setTelegramUrl(telegram.url);
              tUrl = telegram.url;
            }
          }

          let parsedEdu = [
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
            parsedEdu = p.education.map((edu: any) => ({
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

  const handleContainerClick = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const localBlobUrl = URL.createObjectURL(file);
    setSelectedImageSrc(localBlobUrl);
    setIsAdjustModalOpen(true);
    e.target.value = "";
  };

  const handleCroppedImageSave = async (croppedBlob: Blob) => {
    setIsAdjustModalOpen(false);
    setIsUploading(true);
    setError(null);

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
        setProfilePicture(initialProfile?.profilePicture || "");
      }
    } catch (err) {
      setError("A networking issue interrupted the asset transmission.");
      setProfilePicture(initialProfile?.profilePicture || "");
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
      } else {
        setError(result.error || "Resume upload was rejected by the server.");
        setCvResumeUrl(initialProfile?.cvResumeUrl || "");
      }
    } catch (err) {
      setError(
        "A networking issue interrupted the document asset transmission.",
      );
      setCvResumeUrl(initialProfile?.cvResumeUrl || "");
    } finally {
      setIsUploadingResume(false);
      e.target.value = "";
    }
  };

  const handleUpdateEducation = (index: number, fields: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], ...fields };
    setEducation(updated);
  };

  const handleSaveChanges = () => {
    setError(null);
    const currentIdentityPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      dateOfBirth: dob.trim(),
      phoneNumber: phoneNumber.trim(),
    };
    const activeSocials: any[] = [];
    if (linkedinUrl.trim())
      activeSocials.push({ platform: "linkedin", url: linkedinUrl.trim() });
    if (githubUrl.trim())
      activeSocials.push({ platform: "github", url: githubUrl.trim() });
    if (facebookUrl.trim())
      activeSocials.push({ platform: "facebook", url: facebookUrl.trim() });
    if (telegramUrl.trim())
      activeSocials.push({ platform: "telegram", url: telegramUrl.trim() });

    const skillsPayload = skills.length > 0 ? [skills.join(", ")] : [];
    const validEducation = education.filter(
      (edu) => edu.institutionName.trim() !== "",
    );
    const currentProfilePayload = {
      bio: bio || "",
      profilePicture: profilePicture || null,
      major: validEducation[0]?.degree || "Computer Science",
      currentStatus: currentStatus.toLowerCase(),
      cvResumeUrl: cvResumeUrl || null,
      socialAccount: activeSocials,
      education: validEducation,
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
      initialProfile?.socials.linkedin !== linkedinUrl.trim() ||
      initialProfile?.socials.github !== githubUrl.trim() ||
      initialProfile?.socials.facebook !== facebookUrl.trim() ||
      initialProfile?.socials.telegram !== telegramUrl.trim();

    if (!identityChanged && !profileChanged) {
      router.back();
      return;
    }

    startTransition(async () => {
      try {
        const updatePromises: Promise<any>[] = [];
        if (identityChanged)
          updatePromises.push(updateIdentityMeAction(currentIdentityPayload));
        else
          updatePromises.push(
            Promise.resolve({ success: true, skipped: true }),
          );
        if (profileChanged)
          updatePromises.push(updateProfileMeAction(currentProfilePayload));
        else
          updatePromises.push(
            Promise.resolve({ success: true, skipped: true }),
          );

        const [identityResult, profileResult] =
          await Promise.all(updatePromises);
        if (identityResult?.success && profileResult?.success) {
          router.refresh();
          router.back();
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
      } catch (err: any) {
        setError(
          err?.message || "An exception blocked synchronization attempts.",
        );
      }
    });
  };

  const UploadSVG = () => (
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

  return (
    <div className="xl:col-span-8 border border-border rounded-2xl p-6 flex flex-col gap-6">
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
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
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
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail-medium text-primary focus:outline-hidden focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="type-desc text-secondary">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail-medium text-primary focus:outline-hidden focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="type-desc text-secondary">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail-medium text-primary focus:outline-hidden focus:border-primary"
              />
            </div>
          </div>
        </div>
        <div
          className="grid gap-4 w-full"
          style={{
            gridTemplateColumns:
              "calc(96px + ((100% - 96px - 32px) / 3)) 1fr 1fr",
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="type-desc text-secondary">Date of Birth</label>
            <input
              type="text"
              value={dob}
              placeholder="YYYY-MM-DD"
              onChange={(e) => setDob(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-primary focus:outline-hidden focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="type-desc text-secondary">Current Status</label>
            <select
              value={
                currentStatus.toLowerCase() === "studying"
                  ? "studying"
                  : "graduated"
              }
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail-medium text-primary focus:outline-hidden focus:border-primary"
            >
              <option value="studying">Studying</option>
              <option value="graduated">Graduated</option>
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
          className="grid gap-4 w-full"
          style={{
            gridTemplateColumns: "calc(96px + ((100% - 96px - 32px) / 3)) 1fr",
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="type-desc text-secondary">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-primary focus:outline-hidden focus:border-primary"
            />
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
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="type-detail-small-medium text-accent uppercase tracking-wider text-xs font-semibold">
                LinkedIn
              </label>
              <div className="flex items-center h-12 px-3 border border-border bg-white rounded-xl focus-within:border-primary transition-all">
                <input
                  type="text"
                  placeholder="linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="type-detail w-full outline-hidden text-foreground bg-transparent font-medium"
                />
              </div>
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
                  placeholder="github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="type-detail w-full outline-hidden text-foreground bg-transparent font-medium"
                />
              </div>
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
                  placeholder="Facebook Profile Link or Name"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="type-detail w-full outline-hidden text-foreground bg-transparent font-medium"
                />
              </div>
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
                  placeholder="@username"
                  value={telegramUrl}
                  onChange={(e) => setTelegramUrl(e.target.value)}
                  className="type-detail w-full outline-hidden text-foreground bg-transparent font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full py-3 mt-2 border border-border rounded-xl text-center type-desc-medium text-secondary hover:bg-grey-50 transition-colors"
        >
          + Add your social media
        </button>
      </section>
      <div className="space-y-4 w-full">
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
                type="number"
                value={edu.startYear || ""}
                placeholder="2023"
                onChange={(e) =>
                  handleUpdateEducation(idx, {
                    startYear: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-[#1C4E8D] focus:outline-hidden focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-secondary">
                End year
              </label>
              <input
                type="number"
                value={edu.endYear || ""}
                placeholder="2026"
                onChange={(e) =>
                  handleUpdateEducation(idx, {
                    endYear: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-[#1C4E8D] focus:outline-hidden focus:border-primary"
              />
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
            onClick={() => {
              const input = prompt("Enter new skill:");
              if (input?.trim()) setSkills([...skills, input.trim()]);
            }}
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
                ? cvResumeUrl.split("/").pop()
                : "CV_Kaknika_shii.pdf"}
            </span>
          </div>
          {cvResumeUrl && (
            <button
              type="button"
              onClick={() => setCvResumeUrl("")}
              className="p-2 hover:bg-gray-100 rounded text-destructive transition-colors border-0 bg-transparent cursor-pointer shrink-0"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 w-full">
        <button
          type="button"
          onClick={() => router.back()}
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
          onClose={() => setIsAdjustModalOpen(false)}
          onSave={handleCroppedImageSave}
        />
      )}
    </div>
  );
}
