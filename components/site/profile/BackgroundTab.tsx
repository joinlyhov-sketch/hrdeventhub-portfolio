import { Download, ClipboardList } from "lucide-react";
import { UserProfilePayload } from "@/types/profile-types";

interface BackgroundTabProps {
  profile: UserProfilePayload | null;
  loading: boolean;
  viewMode: string | null;
  isPublicView?: boolean;
}

const handleDownloadResume = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);

    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    link.remove();

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Failed to download resume:", error);
  }
};

export default function BackgroundTab({
  profile,
  loading,
  viewMode,
  isPublicView = false,
}: BackgroundTabProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center h-48 w-full">
        <p className="text-muted-foreground animate-pulse">
          Loading background details...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center h-48 w-full">
        <p className="text-destructive">Failed to load background metadata.</p>
      </div>
    );
  }

  const sharingMode = profile.profileSharingMode;
  const prefs = profile.preferences;
  const showEdit = viewMode === "self";

  const isVisible = (field: keyof NonNullable<typeof prefs>): boolean => {
    if (showEdit && !isPublicView) return true;
    if (sharingMode === "PUBLIC") return true;
    if (sharingMode === "PRIVATE") return false;
    return prefs?.[field] ?? true;
  };

  const isProfileLocked =
    (showEdit && isPublicView && sharingMode === "PRIVATE") ||
    (!showEdit && sharingMode === "PRIVATE");

  if (isProfileLocked) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground type-desc">
        This profile is private.
      </div>
    );
  }

  const parsedSkills = profile.skills?.[0]
    ? profile.skills[0].split(",").map((s) => s.trim())
    : [];

  const hasResume = !!(
    profile.cvResumeUrl &&
    profile.cvResumeUrl !== "null" &&
    profile.cvResumeUrl.trim() !== ""
  );

  const hasAnyVisibleSection =
    isVisible("showEducation") ||
    isVisible("showSkills") ||
    isVisible("showCv");

  if (!hasAnyVisibleSection) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground type-desc">
        No background information visible.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isVisible("showEducation") && (
        <section>
          <h3 className="type-subtitle-24 text-primary mb-6">Education</h3>
          {profile.education && profile.education.length > 0 ? (
            <div className="space-y-6">
              {profile.education.map((edu, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start pb-6 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="w-12 h-12 rounded-lg border border-border bg-grey-50 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {edu.institutionLogo ? (
                      <img
                        src={edu.institutionLogo}
                        alt={edu.institutionName || "Institution logo"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase">
                        {edu.institutionName?.slice(0, 2) || "ED"}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="type-detail-semibold text-secondary">
                      {edu.degree} -{" "}
                      <span className="text-primary">
                        {edu.institutionAbbreviation}
                      </span>
                    </h4>
                    <p className="type-desc-semibold text-primary">
                      {edu.institutionName}
                    </p>
                    <p className="type-detail-small-medium text-muted-foreground mt-1">
                      {edu.startYear} –{" "}
                      {edu.isCurrent ? "Present" : (edu.endYear ?? "")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="type-desc text-muted-foreground">
              No education listed yet.
            </p>
          )}
        </section>
      )}

      {isVisible("showSkills") && (
        <section>
          <h3 className="type-subtitle text-primary mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {parsedSkills.length > 0 ? (
              parsedSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-[#E1F1FD] text-primary px-3 py-1.5 rounded-full type-desc-small-semibold transition-colors duration-150 hover:bg-[#b3d7f2]"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="type-desc text-muted-foreground">
                No skills listed yet.
              </p>
            )}
          </div>
        </section>
      )}

      {isVisible("showCv") && (
        <section>
          <h3 className="type-subtitle-24 text-primary mb-4">Resume</h3>
          {hasResume ? (
            <button
              type="button"
              onClick={async () =>
                handleDownloadResume(
                  profile.cvResumeUrl!,
                  `CV_${profile.appUser?.firstName || "User"}_Resume.pdf`,
                )
              }
              className="w-full flex items-center justify-between gap-3 p-4 border border-border rounded-lg bg-grey-50 group cursor-pointer hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <ClipboardList
                  size={20}
                  className="text-secondary group-hover:text-primary transition-colors shrink-0"
                />
                <span className="type-desc-medium text-secondary truncate">
                  CV_{profile.appUser?.firstName || "User"}_Resume.pdf
                </span>
              </div>
              <Download
                size={20}
                className="text-secondary group-hover:text-primary transition-colors shrink-0"
              />
            </button>
          ) : (
            <div className="p-4 border border-dashed border-border rounded-lg bg-grey-25/50 text-center type-desc text-muted-foreground">
              No resume file uploaded yet.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
