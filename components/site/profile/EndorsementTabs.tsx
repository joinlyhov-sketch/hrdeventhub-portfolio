"use client";

import { useEffect, useState } from "react";
import { endorsementService } from "@/service/endorse.service";
import { EndorsementItem } from "@/types/endorsement";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface EndorsementTabsProps {
  studentId?: string;
}

export default function EndorsementTabs({ studentId }: EndorsementTabsProps) {
  const { data: session } = useSession();
  const [endorsements, setEndorsements] = useState<EndorsementItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;

    async function loadEndorsements() {
      try {
        setLoading(true);
        setError(null);
        
        const data = studentId
          ? await endorsementService.getStudentEndorsementsAsGuest(studentId, token!)
          : await endorsementService.getReceivedEndorsements(token!);
        
        setEndorsements(data || []);
      } catch (err) {
        console.error("Error fetching endorsements:", err);
        setError("Failed to load endorsements.");
      } finally {
        setLoading(false);
      }
    }

    loadEndorsements();
  }, [studentId, session?.accessToken]);

  if (!session?.accessToken) {
    return <div className="p-4 text-muted-foreground">Please sign in to view endorsements.</div>;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
        <p className="text-muted-foreground">Loading endorsements...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-destructive">{error}</div>;
  }

  if (endorsements.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No endorsements received yet.</div>;
  }

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-grey-200 scrollbar-track-transparent">
      {endorsements.map((item) => (
        <div
          key={item.endorsementId}
          className="pb-6 last:border-0 last:pb-0"
        >
          <div className="flex justify-between items-start mb-3 gap-4">
            <div className="flex gap-3 items-center min-w-0 w-full ">
              <Link href={`${item.alumni.appUserId}`}>
                <div className="w-14 h-14 rounded-full bg-grey-100 border border-border flex items-center justify-center shrink-0 overflow-hidden relative">
                  {item.alumni?.profilePicture ? (
                    <Image 
                      src={item.alumni.profilePicture} 
                      alt={item.alumni?.firstName || "Alumni"} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      {item.alumni?.firstName?.charAt(0) || ""}{item.alumni?.lastName?.charAt(0) || "A"}
                    </span>
                  )}
                </div>
              </Link>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">
                  {item.alumni.generation}th
                </p>
                <p className="type-desc-semibold text-primary truncate">
                  {item.alumni ? `${item.alumni.firstName} ${item.alumni.lastName}` : "Unknown Alumni"}
                </p>
              </div>
            </div>
            <span className="bg-blue-500/15 text-primary px-3 py-1 rounded-full text-detail-semibold font-semibold shrink-0">
              {item.skill}
            </span>
          </div>
          <hr className="text-border mb-2"/>
          <p className="text-desc text-secondary wrap-break-word">{`“${item.comment || "No feedback comment provided."}”`}</p>
          
          {item.post?.title && item.post.title !== "string" && (
            <p className="mt-2 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              Verified via: {item.post.title}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}