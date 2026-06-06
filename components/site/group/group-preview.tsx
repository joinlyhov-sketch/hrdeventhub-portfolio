"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Globe } from "lucide-react";
import Image from "next/image";
import { useCurrentUser } from "@/context/user-context";
import { joinInvitationAction } from "@/actions/invitation.action";
import { InvitationPreview } from "@/types/invitation";

interface GroupPreviewClientProps {
  preview: InvitationPreview;
  token: string;
}

export default function GroupPreviewClient({ preview, token }: GroupPreviewClientProps) {
  const router = useRouter();
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    if (!userLoading && currentUser) {
      const pendingToken = sessionStorage.getItem("pendingJoinToken");
      if (pendingToken === token) {
        sessionStorage.removeItem("pendingJoinToken");
        handleJoin();
      }
    }
  }, [currentUser, userLoading]);

  const handleJoin = async () => {
    if (!currentUser) {
      sessionStorage.setItem("pendingJoinToken", token);
      router.push(`/login?redirect=/join/${token}`);
      return;
    }

    try {
      setIsJoining(true);
      await joinInvitationAction(token);
      router.push("/group");
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Failed to join group.");
    } finally {
      setIsJoining(false);
    }
  };

  const visibleMembers = preview.members.slice(0, 2);
  const extraCount = preview.memberCount - visibleMembers.length;

  return (
    <div className="flex items-center justify-center p-4">
      <div className="min-w-165 rounded-2xl border border-primary/30 bg-white p-8 sm:p-12">
        <div className="mb-8">
          <h1 className="text-sm sm:text-2xl font-bold text-secondary tracking-tight mb-3">
            Group Preview
          </h1>
          <p className="text-base sm:text-sm text-gray-700 type-detail leading-relaxed">
            You're invited to be a part of a growing network of HRD community.
            <br className="hidden sm:inline" />
            See who's already inside!
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
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
                  className="w-7 h-7 rounded-full border-2 border-white bg-primary/10 overflow-hidden flex items-center justify-center"
                  title={`${member.firstName} ${member.lastName}`}
                >
                  {member.profileImage ? (
                    <Image
                      src={member.profileImage}
                      alt={`${member.firstName} ${member.lastName}`}
                      width={28}
                      height={28}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-[9px] font-bold text-primary uppercase">
                      {member.firstName[0]}{member.lastName[0]}
                    </span>
                  )}
                </div>
              ))}
              {extraCount > 0 && (
                <div className="p-2 flex items-center justify-center w-7 h-7 rounded-full border-2 border-white bg-[#dbeafe] text-primary type-desc-small-semibold">
                  +{extraCount}
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="type-title sm:text-lg mb-3">
              <span className="bg-gradient-to-r from-[#1C4D8D] to-[#FFA02E] bg-clip-text type-subtitle-24 text-transparent">
                <b>{preview.workspaceName}</b>
              </span>
            </h2>
            <p className="text-base text-secondary max-w-md type-desc-small-semibold leading-relaxed">
              {preview.workspaceDescription}
            </p>
            {preview.generationName && (
              <p className="text-sm text-gray-400 mt-1">{preview.generationName}</p>
            )}
          </div>

          {joinError && (
            <p className="text-red-500 text-sm mb-4">{joinError}</p>
          )}

          <hr className="border-slate-200 my-6" />

          <div className="flex items-center justify-end gap-x-2 mt-6">
            <button
              onClick={() => router.push("/")}
              className="w-36.5 px-8 py-1.5 rounded-lg border border-secondary text-primary font-desc-semibold text-base hover:bg-slate-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleJoin}
              disabled={isJoining || userLoading}
              className="w-fit px-8 py-1.5 rounded-lg text-white font-desc-semibold text-base transition-colors duration-200 disabled:opacity-50"
              style={{
                background: "linear-gradient(to right, #1a7a8a 0%, #1a5a82 0%, #1C4D8D 70%, #152d6e 100%)",
              }}
            >
              {isJoining ? "Joining..." : "Join Group"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}