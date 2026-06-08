"use client";

import { useEffect, useState } from "react";
import { endorsementService } from "@/service/endorse.service";
import { EndorsementItem } from "@/types/endorsement";

interface EndorsementTabsProps {
  studentId?: string;
  authToken: string;
}

export default function EndorsementTabs({ studentId, authToken }: EndorsementTabsProps) {
  const [endorsements, setEndorsements] = useState<EndorsementItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEndorsements() {
      try {
        setLoading(true);
        setError(null);
        
        const data = studentId
          ? await endorsementService.getStudentEndorsementsAsGuest(studentId, authToken)
          : await endorsementService.getReceivedEndorsements(authToken);
        
        setEndorsements(data);
      } catch (err) {
        setError("Failed to load endorsements.");
      } finally {
        setLoading(false);
      }
    }

    if (authToken) {
      loadEndorsements();
    } else {
      setLoading(false);
    }
  }, [studentId, authToken]);

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
    <div className="h-full overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-grey-200 scrollbar-track-transparent">
      {endorsements.map((endorsement) => (
        <div
          key={endorsement.endorsementId}
          className="pb-6 border-b border-border last:border-0 last:pb-0"
        >
          <div className="flex justify-between items-start mb-3 gap-4">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-grey-100 border border-border flex items-center justify-center shrink-0 overflow-hidden relative">
                <span className="text-xs text-muted-foreground font-mono">ID</span>
              </div>
              <div>
                <p className="type-detail-small-medium text-muted-foreground">
                  Alumni ID
                </p>
                <p className="type-desc-semibold text-primary truncate max-w-[180px]" title={endorsement.alumniId}>
                  {endorsement.alumniId}
                </p>
              </div>
            </div>
            <span className="bg-primary text-grey-100 px-3 py-1 rounded-full type-detail-small-medium shrink-0">
              {endorsement.skill}
            </span>
          </div>
          <p className="type-detail text-grey-500 break-words">{`“${endorsement.comment || "No feedback comment provided."}”`}</p>
        </div>
      ))}
    </div>
  );
}