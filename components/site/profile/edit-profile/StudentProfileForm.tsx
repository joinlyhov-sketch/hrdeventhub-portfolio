"use client";

import React, { useEffect, useState, useTransition, useRef } from "react";
import { Camera, Trash2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { profileService } from "@/service/profile.service";
import { getIdentityMeAction, updateIdentityMeAction, updateProfileMeAction } from "@/actions/profile.action";
import { useRouter } from "next/navigation";

import { uploadFileAction } from "@/actions/file.action";

export default function StudentProfileForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
  const [profileSharingMode, setProfileSharingMode] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [skills, setSkills] = useState<string[]>([]);

  const [education, setEducation] = useState<any[]>([
    { institutionName: "", institutionAbbreviation: "", degree: "", startYear: 2026, endYear: null, isCurrent: true }
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
          getIdentityMeAction()
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
            if (rawGender === "M" || rawGender === "MALE") {
              setGender("Male");
            } else if (rawGender === "F" || rawGender === "FEMALE") {
              setGender("Female");
            } else {
              setGender(idData.gender);
            }
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

          let lUrl = "", gUrl = "", fUrl = "", tUrl = "";
          if (p.socialAccount && p.socialAccount.length > 0) {
            const linkedin = p.socialAccount.find((s: any) => s.platform === "linkedin");
            if (linkedin) { setLinkedinUrl(linkedin.url); lUrl = linkedin.url; }
            
            const github = p.socialAccount.find((s: any) => s.platform === "github");
            if (github) { setGithubUrl(github.url); gUrl = github.url; }

            const facebook = p.socialAccount.find((s: any) => s.platform === "facebook");
            if (facebook) { setFacebookUrl(facebook.url); fUrl = facebook.url; }

            const telegram = p.socialAccount.find((s: any) => s.platform === "telegram");
            if (telegram) { setTelegramUrl(telegram.url); tUrl = telegram.url; }
          }

          let parsedEdu = [{ institutionName: "", institutionAbbreviation: "", degree: "", startYear: 2026, endYear: null, isCurrent: true }];
          if (p.education && p.education.length > 0) {
            parsedEdu = p.education.map((edu: any) => ({
              institutionName: edu.institutionName || "",
              institutionAbbreviation: edu.institutionAbbreviation || "",
              degree: edu.degree || "",
              startYear: edu.startYear || 2026,
              endYear: edu.endYear || null,
              isCurrent: edu.isCurrent ?? false
            }));
            setEducation(parsedEdu);
          }

          setInitialProfile({
            bio: p.bio || "",
            currentStatus: (p.currentStatus || "studying").toLowerCase(),
            profilePicture: p.profilePicture || "",
            cvResumeUrl: p.cvResumeUrl || "",
            skills: parsedSkills,
            education: parsedEdu.filter(edu => edu.institutionName.trim() !== ""),
            socials: { linkedin: lUrl, github: gUrl, facebook: fUrl, telegram: tUrl }
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadAllUserData();
  }, [session]);

  const handleContainerClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const localBlobUrl = URL.createObjectURL(file);
    setProfilePicture(localBlobUrl);

    const dataPayload = new FormData();
    dataPayload.append("file", file);

    try {
      const result = await uploadFileAction(dataPayload);

      if (result.ok && result.payload?.fileUrl) {
        setProfilePicture(result.payload.fileUrl);
      } else {
        setError(result.error || "Profile image upload was rejected by the server.");
        setProfilePicture(initialProfile?.profilePicture || ""); 
      }
    } catch (err) {
      console.error("Network profile pipeline upload crash:", err);
      setError("A networking issue interrupted the asset transmission.");
      setProfilePicture(initialProfile?.profilePicture || "");
    } finally {
      setIsUploading(false);
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
    if (linkedinUrl.trim()) activeSocials.push({ platform: "linkedin", url: linkedinUrl.trim() });
    if (githubUrl.trim()) activeSocials.push({ platform: "github", url: githubUrl.trim() });
    if (facebookUrl.trim()) activeSocials.push({ platform: "facebook", url: facebookUrl.trim() });
    if (telegramUrl.trim()) activeSocials.push({ platform: "telegram", url: telegramUrl.trim() });

    const skillsPayload = skills.length > 0 ? [skills.join(", ")] : [];
    const validEducation = education.filter(edu => edu.institutionName.trim() !== "");

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

    const identityChanged = JSON.stringify(currentIdentityPayload) !== JSON.stringify(initialIdentity);
    
    const profileChanged = 
      initialProfile?.bio !== currentProfilePayload.bio ||
      initialProfile?.currentStatus !== currentProfilePayload.currentStatus ||
      initialProfile?.profilePicture !== currentProfilePayload.profilePicture ||
      initialProfile?.cvResumeUrl !== currentProfilePayload.cvResumeUrl ||
      initialProfile?.profileSharingMode !== currentProfilePayload.profileSharingMode ||
      JSON.stringify(initialProfile?.skills) !== JSON.stringify(skills) ||
      JSON.stringify(initialProfile?.education) !== JSON.stringify(validEducation) ||
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

        if (identityChanged) {
          updatePromises.push(updateIdentityMeAction(currentIdentityPayload));
        } else {
          updatePromises.push(Promise.resolve({ success: true, skipped: true }));
        }

        if (profileChanged) {
          updatePromises.push(updateProfileMeAction(currentProfilePayload));
        } else {
          updatePromises.push(Promise.resolve({ success: true, skipped: true }));
        }

        const [identityResult, profileResult] = await Promise.all(updatePromises);

        if (identityResult?.success && profileResult?.success) {
          router.refresh();
          router.back();
          return;
        }

        if (!identityResult?.success) {
          setError(identityResult?.message || identityResult?.error || "Identity validation failed.");
        }
        if (!profileResult?.success) {
          setError(profileResult?.message || profileResult?.error || "Profile validation failed.");
        }
      } catch (err: any) {
        setError(err?.message || "An exception blocked synchronization attempts.");
      }
    });
  };

  return (
    <div className="xl:col-span-8 border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      {error && <div className="p-4 text-sm bg-destructive/10 text-destructive rounded-lg font-mono whitespace-pre-wrap">{error}</div>}

      <div className="space-y-6">
        <h2 className="type-subtitle-24 text-secondary border-b border-border pb-2">
          Edit Information
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div 
            onClick={handleContainerClick}
            className="relative group w-36 h-36 bg-grey-900 rounded-full flex flex-col items-center justify-center cursor-pointer overflow-hidden border border-border shrink-0 select-none shadow-xs transition-all hover:scale-[1.01]"
          >
            {profilePicture ? (
              <img src={profilePicture} alt="Profile picture" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <Camera className="w-6 h-6 text-white mb-1" />
                <span className="type-detail text-grey-300 px-1 text-xs">Upload Profile</span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white">
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.8" 
                    stroke="currentColor" 
                    className="w-6 h-6 text-white/90"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v3m0 0l-1.5-1.5M12 15l1.5-1.5" />
                  </svg>
                  <span className="text-[11px] font-semibold text-white/90 tracking-wide text-center max-w-[80%] leading-tight">
                    Upload Profile
                  </span>
                </>
              )}
            </div>
          </div>

          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            disabled={isUploading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 type-desc text-primary gap-4 flex-1 w-full">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-grey-900">First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary" />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-grey-900">Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary" />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-grey-900">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary" />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-grey-900">Date of Birth</label>
              <input type="text" value={dob} placeholder="YYYY-MM-DD" onChange={(e) => setDob(e.target.value)} className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary" />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-grey-900">Current Status</label>
              <select 
                value={currentStatus.toLowerCase() === "studying" ? "studying" : "graduated"}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary"
              >
                <option value="studying">Studying</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-grey-900">Gender (Read Only)</label>
              <input type="text" value={gender} disabled className="w-full h-10 px-3 bg-grey-50 border border-border rounded-lg type-detail text-grey-400 focus:outline-hidden" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="type-detail-semibold text-grey-900">Phone Number</label>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary" />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="type-detail-semibold text-grey-900">Email (Read Only)</label>
            <input type="email" value={email} disabled className="w-full h-10 px-3 bg-grey-50 border border-border rounded-lg type-detail text-grey-400 focus:outline-hidden" />
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
        <div className="type-subtitle-24 text-primary">Social Account</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-2 border border-border rounded-xl bg-card shadow-sm w-full">
            <div className="shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="20" fill="#1C4D8D" />
                <path d="M22.9883 25.5H24.4983C27.5183 25.5 29.9983 23.03 29.9983 20C29.9983 16.98 27.5283 14.5 24.4983 14.5H22.9883" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 14.5H15.5C12.47 14.5 10 16.97 10 20C10 23.02 12.47 25.5 15.5 25.5H17" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 20H24" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <label className="block type-detail-small-medium text-accent uppercase tracking-wider mb-0.5">LinkedIn</label>
              <input type="text" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="type-detail w-full outline-none text-foreground bg-transparent font-medium truncate" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border border-border rounded-xl bg-card shadow-sm w-full">
            <div className="shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="20" fill="#0F172A" />
                <path d="M17 27.0034C12 28.5034 12 24.5034 10 24.0034M24 30.0034V26.1334C24.0375 25.6565 23.9731 25.1772 23.811 24.7271C23.6489 24.2771 23.3929 23.8668 23.06 23.5234C26.2 23.1734 29.5 21.9834 29.5 16.5234C29.4997 15.1272 28.9627 13.7846 28 12.7734C28.4559 11.5519 28.4236 10.2017 27.91 9.00336C27.91 9.00336 26.73 8.65336 24 10.4834C21.708 9.86218 19.292 9.86218 17 10.4834C14.27 8.65336 13.09 9.00336 13.09 9.00336C12.5764 10.2017 12.5441 11.5519 13 12.7734C12.0301 13.7921 11.4925 15.1468 11.5 16.5534C11.5 21.9734 14.8 23.1634 17.94 23.5534C17.611 23.8933 17.3573 24.2988 17.1953 24.7433C17.0334 25.1878 16.9668 25.6614 17 26.1334V30.0034" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <label className="block type-detail-small-medium text-accent uppercase tracking-wider mb-0.5">GitHub</label>
              <input type="text" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="type-detail w-full outline-none text-foreground bg-transparent font-medium truncate" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border border-border rounded-xl bg-card shadow-sm w-full">
            <div className="shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="20" fill="#1877F2" />
                <path d="M22.5 14H20.5C18.57 14 17 15.57 17 17.5V20H15V22.5H17V28H20.5V22.5H23L23.5 20H20.5V17.5C20.5 17.22 20.72 17 21 17H23.5V14Z" fill="white" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <label className="block type-detail-small-medium text-accent uppercase tracking-wider mb-0.5">Facebook</label>
              <input type="text" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} className="type-detail w-full outline-none text-foreground bg-transparent font-medium truncate" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border border-border rounded-xl bg-card shadow-sm w-full">
            <div className="shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="20" fill="#24A1DE" />
                <path d="M15.3997 14.3202L23.8897 11.4902C27.6997 10.2202 29.7697 12.3002 28.5097 16.1102L25.6797 24.6002C23.7797 30.3102 20.6597 30.3102 18.7597 24.6002L17.9197 22.0802L15.3997 21.2402C9.68969 19.3402 9.68969 16.2302 15.3997 14.3202Z" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.1094 21.6525L21.6894 18.0625" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <label className="block type-detail-small-medium text-accent uppercase tracking-wider mb-0.5">Telegram</label>
              <input type="text" value={telegramUrl} onChange={(e) => setTelegramUrl(e.target.value)} className="type-detail w-full outline-none text-foreground bg-transparent font-medium truncate" />
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-4 w-full">
        <div className="flex justify-between items-center gap-2">
          <h2 className="type-subtitle-24 text-primary">Education</h2>
          <button 
            type="button" 
            onClick={() => setEducation([...education, { institutionName: "", institutionAbbreviation: "", degree: "", startYear: 2026, endYear: null, isCurrent: true }])}
            className="text-subtle type-detail-semibold flex items-center gap-1 hover:underline bg-transparent border-0 cursor-pointer"
          >
            + add
          </button>
        </div>
        
        {education.map((edu, idx) => (
          <div key={idx} className="type-desc-semibold text-primary grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full border-b border-dashed border-border pb-4 last:border-0 relative">
            {idx > 0 && (
              <button 
                type="button" 
                onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                className="absolute -top-1 -right-1 text-destructive hover:opacity-80 cursor-pointer border-0 bg-transparent"
              >
                <Trash2 size={14} />
              </button>
            )}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-grey-900">University/Institute</label>
              <input type="text" value={edu.institutionName} placeholder="University Name" onChange={(e) => handleUpdateEducation(idx, { institutionName: e.target.value })} className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary" />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-grey-900">Abbreviation</label>
              <input type="text" value={edu.institutionAbbreviation} placeholder="e.g. UC" onChange={(e) => handleUpdateEducation(idx, { institutionAbbreviation: e.target.value })} className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary" />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-grey-900">Major/Degree</label>
              <input type="text" value={edu.degree} placeholder="Computer Science" onChange={(e) => handleUpdateEducation(idx, { degree: e.target.value })} className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary" />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="type-detail-semibold text-grey-900">Start year</label>
              <input type="number" value={edu.startYear || ""} placeholder="2026" onChange={(e) => handleUpdateEducation(idx, { startYear: parseInt(e.target.value) || 0 })} className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 w-full">
        <label className="type-desc-bold text-secondary block">Skills & Expertise</label>
        <div className="flex flex-wrap gap-2 items-center">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-1.5 bg-grey-100 text-primary px-3 py-1 rounded-full type-detail-medium border border-border">
              {skill}
              <X className="w-3 h-3 text-grey-500 cursor-pointer hover:text-destructive transition-colors" onClick={() => setSkills(skills.filter((_, i) => i !== index))} />
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => {
              const input = prompt("Enter new skill:");
              if (input?.trim()) setSkills([...skills, input.trim()]);
            }}
            className="flex items-center gap-1 px-3 py-1 border border-dashed border-border rounded-full text-grey-500 type-detail-medium bg-white hover:bg-grey-50 cursor-pointer"
          >
            + Add Skill
          </button>
        </div>
      </div>

      <div className="space-y-3 w-full">
        <label className="type-detail-semibold text-grey-900 block">Resume</label>
        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-white w-full">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 bg-grey-100 rounded text-grey-500 flex items-center justify-center shrink-0">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/xl">
                <path d="M30 12.375V27C30 31.5 27.315 33 24 33H12C8.685 33 6 31.5 6 27V12.375C6 7.5 8.685 6.375 12 6.375C12 7.305 12.375 8.14499 12.99 8.75999C13.605 9.37499 14.445 9.75 15.375 9.75H20.625C22.485 9.75 24 8.235 24 6.375C27.315 6.375 30 7.5 30 12.375Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 6.375C24 8.235 22.485 9.75 20.625 9.75H15.375C14.445 9.75 13.605 9.37499 12.99 8.75999C12.375 8.14499 12 7.305 12 6.375C12 4.515 13.515 3 15.375 3H20.625C21.555 3 22.395 3.37501 23.01 3.99001C23.625 4.60501 24 5.445 24 6.375Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 19.5H18" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 25.5H24" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="type-detail-medium text-grey-900 truncate">
              {cvResumeUrl ? cvResumeUrl : "No file uploaded"}
            </span>
          </div>
          <button type="button" onClick={() => setCvResumeUrl("")} className="p-2 hover:bg-grey-100 rounded text-destructive transition-colors border-0 bg-transparent cursor-pointer shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border w-full">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-5 py-2 border border-border rounded-lg type-detail-semibold text-grey-900 hover:bg-grey-50 bg-white cursor-pointer order-2 sm:order-1"
        >
          Discard Changes
        </button>
        <button
          type="button"
          disabled={isPending || isUploading}
          onClick={handleSaveChanges}
          className="w-full sm:w-auto px-5 py-2 bg-primary text-white rounded-lg type-detail-semibold hover:bg-primary-hover shadow-xs border-0 cursor-pointer order-1 sm:order-2 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}