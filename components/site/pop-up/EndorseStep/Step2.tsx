// components/site/endorsement/step2.tsx
"use client";

import React from "react";
import { Lightbulb, BadgeCheck } from "lucide-react";

interface Step2Props {
  studentName: string;
  selectedSkill: string | null;
  commentText: string;
  setCommentText: (text: string) => void;
}

export default function Step2({
  studentName,
  selectedSkill,
  commentText,
  setCommentText,
}: Step2Props) {
  return (
    <div className="space-y-5">
      <div className="bg-grey-100 rounded-xl p-4 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg text-white">
          <BadgeCheck size={20} />
        </div>
        <div>
          <p className="type-detail-small-medium text-grey-400">Endorsing {studentName} for</p>
          <p className="type-desc-semibold text-secondary">{selectedSkill || "Selected Skill"}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center type-detail-semibold text-secondary">
          <label htmlFor="endorsement-comment">Your Comment</label>
          <span className="text-grey-400 type-detail font-normal">{commentText.length}/500 characters</span>
        </div>
        <textarea
          id="endorsement-comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value.slice(0, 500))}
          placeholder={`${studentName} is an exceptional developer who...`}
          rows={5}
          className="w-full bg-grey-100 border-none rounded-xl p-4 type-detail-medium text-grey-900 placeholder:text-grey-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none leading-relaxed"
        />
      </div>

      <div className="flex items-start gap-2.5 bg-action/5 border border-action/20 p-4 rounded-xl text-grey-500">
        <Lightbulb size={18} className="text-action shrink-0 mt-0.5" />
        <p className="type-detail-medium leading-normal">
          <span className="type-detail-semibold text-grey-900">Pro Tip:</span> Focus on specific projects or technical achievements. Genuine, detailed endorsements help peers stand out to recruiters and technical leads.
        </p>
      </div>
    </div>
  );
}