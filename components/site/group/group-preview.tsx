"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import { LockKeyhole, Globe } from "lucide-react";
import Image from "next/image";
import { useCurrentUser } from "@/context/user-context";
import { joinInvitationAction } from "@/actions/invitation.action";
import { InvitationPreview } from "@/types/invitation";

interface GroupPreviewClientProps {
  preview: InvitationPreview;
  token: string;
}

export default function GroupPreviewClient({
  preview,
  token,
}: GroupPreviewClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const hasAttemptedJoin = useRef(false);

  const handleJoin = useCallback(async () => {
    if (!currentUser) {
      const returnUrl = encodeURIComponent(`/join/${token}?autoJoin=true`);
      router.push(`/sign-up?redirect=${returnUrl}`);
      return;
    }

    try {
      setJoinError("");
      setIsJoining(true);
      await joinInvitationAction(token);
      router.push("/group");
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Failed to join group.");
      setIsJoining(false); 
    }
  }, [currentUser, router, token]);

  useEffect(() => {
    const shouldAutoJoin = searchParams.get("autoJoin") === "true";

    if (!userLoading && currentUser && shouldAutoJoin && !hasAttemptedJoin.current) {
      hasAttemptedJoin.current = true;
      window.history.replaceState(null, "", `/join/${token}`);
      
      handleJoin();
    }
  }, [currentUser, userLoading, searchParams, handleJoin, token]);

  const visibleMembers = preview.members.slice(0, 2);
  const extraCount = Math.max(preview.memberCount - visibleMembers.length, 0);

  const PreviewCard = ({ mobile = false }: { mobile?: boolean }) => {
    return (
      <div
        className={
          mobile
            ? "rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            : "bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
        }
      >
        <div
          className={
            mobile
              ? "mb-6 flex items-center justify-between gap-4"
              : "flex items-center justify-between mb-6"
          }
        >
          <div className="flex items-center gap-1.5 bg-[#E7EEFA] text-secondary px-4 py-1.5 rounded-full type-desc-small-semibold">
            {preview.public ? (
              <Globe className="w-2.5 h-2.5" />
            ) : (
              <LockKeyhole className="w-2.5 h-2.5" />
            )}
            <span>{preview.public ? "Public" : "Private"}</span>
          </div>

          <div className="flex items-center -space-x-2">
            {visibleMembers.map((member, i) => (
              <div
                key={i}
                className={
                  mobile
                    ? "w-8 h-8 rounded-full border-2 border-white bg-primary/10 overflow-hidden flex items-center justify-center"
                    : "w-7 h-7 rounded-full border-2 border-white bg-primary/10 overflow-hidden flex items-center justify-center"
                }
                title={`${member.firstName} ${member.lastName}`}
              >
                {member.profileImage ? (
                  <Image
                    src={member.profileImage}
                    alt={`${member.firstName} ${member.lastName}`}
                    width={mobile ? 32 : 28}
                    height={mobile ? 32 : 28}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-[9px] font-bold text-primary uppercase">
                    {member.firstName?.[0]}
                    {member.lastName?.[0]}
                  </span>
                )}
              </div>
            ))}

            {extraCount > 0 && (
              <div
                className={
                  mobile
                    ? "p-2 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-[#dbeafe] text-primary type-desc-small-semibold"
                    : "p-2 flex items-center justify-center w-7 h-7 rounded-full border-2 border-white bg-[#dbeafe] text-primary type-desc-small-semibold"
                }
              >
                +{extraCount}
              </div>
            )}
          </div>
        </div>

        <div className={mobile ? "mb-7" : "mb-8"}>
          <h2 className="type-title sm:text-lg mb-3">
            <span className="bg-gradient-to-r from-[#1C4D8D] to-[#FFA02E] bg-clip-text type-subtitle-24 text-transparent">
              <b>{preview.workspaceName}</b>
            </span>
          </h2>

          <p className="text-base text-secondary max-w-md type-desc-small-semibold leading-relaxed">
            {preview.workspaceDescription}
          </p>

          {preview.generationName && (
            <p className="text-sm text-gray-400 mt-1">
              {preview.generationName}
            </p>
          )}
        </div>

        {joinError && <p className="text-red-500 text-sm mb-4">{joinError}</p>}

        <hr className="border-slate-200 my-6" />

        <div
          className={
            mobile
              ? "flex flex-col-reverse gap-2 mt-6"
              : "flex items-center justify-end gap-x-2 mt-6"
          }
        >
          <button
            onClick={() => router.push("/")}
            className={
              mobile
                ? "w-full px-8 py-2 rounded-lg border border-secondary text-primary font-desc-semibold text-base hover:bg-slate-50 transition-colors duration-200"
                : "w-36.5 px-8 py-1.5 rounded-lg border border-secondary text-primary font-desc-semibold text-base hover:bg-slate-50 transition-colors duration-200"
            }
          >
            Cancel
          </button>

          <button
            onClick={handleJoin}
            disabled={isJoining || userLoading}
            className={
              mobile
                ? "w-full px-8 py-2 rounded-lg text-white font-desc-semibold text-base transition-colors duration-200 disabled:opacity-50"
                : "w-fit px-8 py-1.5 rounded-lg text-white font-desc-semibold text-base transition-colors duration-200 disabled:opacity-50"
            }
            style={{
              background:
                "linear-gradient(to right, #1a7a8a 0%, #1a5a82 0%, #1C4D8D 70%, #152d6e 100%)",
            }}
          >
            {isJoining ? "Joining..." : "Join Group"}
          </button>
        </div>
      </div>
    );
  };

  const shouldAutoJoin = searchParams.get("autoJoin") === "true";
  const isProcessingAutoJoin = shouldAutoJoin && currentUser && !joinError;

  if (userLoading || isJoining || isProcessingAutoJoin) {
    return (
      <div className="flex w-full min-h-[calc(100vh-120px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1C4D8D] border-t-transparent" />
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-secondary">Setting up your workspace</h3>
            <p className="text-sm text-gray-500 animate-pulse">
              Securing your credentials and entering the group...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-[calc(100vh-120px)] items-center justify-center px-4 py-6 sm:px-6">
      <div className="hidden sm:block w-[660px] rounded-2xl border border-primary/30 bg-white p-8 sm:p-12">
        <div className="mb-8">
          <h1 className="text-sm sm:text-2xl font-bold text-secondary tracking-tight mb-3">
            Group Preview
          </h1>
          <p className="text-base sm:text-sm text-gray-700 type-detail leading-relaxed">
            You&apos;re invited to be a part of a growing network of HRD community.
            <br className="hidden sm:inline" />
            See who&apos;s already inside!
          </p>
        </div>

        <PreviewCard />
      </div>

      <div className="flex w-full max-w-[390px] flex-col gap-4 sm:hidden">
        <div className="rounded-2xl border border-primary/30 bg-white p-5">
          <h1 className="mb-2 text-xl font-bold tracking-tight text-secondary">
            Group Preview
          </h1>
          <p className="type-detail text-sm leading-relaxed text-gray-700">
            You&apos;re invited to be a part of a growing network of HRD community.
            See who&apos;s already inside!
          </p>
        </div>

        <PreviewCard mobile />
      </div>
    </div>
  );
}