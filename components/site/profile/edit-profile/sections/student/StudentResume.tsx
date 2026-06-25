"use client";

import React from "react";
import { Trash2 } from "lucide-react";

interface StudentResumeProps {
  hasRole: boolean;
  cvResumeUrl: string | null;
  username: string;
  isUploadingResume: boolean;
  resumeInputRef: React.RefObject<HTMLInputElement | null>;
  handleResumeFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsDeleteResumeModalOpen: (val: boolean) => void;
}

export default function StudentResume({
  hasRole,
  cvResumeUrl,
  username,
  isUploadingResume,
  resumeInputRef,
  handleResumeFileChange,
  setIsDeleteResumeModalOpen,
}: StudentResumeProps) {
  if (!hasRole) return null;

  return (
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
      {!cvResumeUrl ? (
        <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-200 rounded-xl">
          <div className="p-3 bg-[#E5EEFF] text-primary rounded-full mb-2 flex items-center justify-center">
            {isUploadingResume ? (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17V11L7 13" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 11L11 13" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 10H18C15 10 14 9 14 6V2L22 10Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
      ) : (
        <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-white w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg text-gray-500 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
                <path d="M30 12.375V27C30 31.5 27.315 33 24 33H12C8.685 33 6 31.5 6 27V12.375C6 7.5 8.685 6.375 12 6.375C12 7.305 12.375 8.14499 12.99 8.75999C13.605 9.37499 14.445 9.75 15.375 9.75H20.625C22.485 9.75 24 8.235 24 6.375C27.315 6.375 30 7.5 30 12.375Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 6.375C24 8.235 22.485 9.75 20.625 9.75H15.375C14.445 9.75 13.605 9.37499 12.99 8.75999C12.375 8.14499 12 7.305 12 6.375C12 4.515 13.515 3 15.375 3H20.625C21.555 3 22.395 3.37501 23.01 3.99001C23.625 4.60501 24 5.445 24 6.375Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 19.5H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 25.5H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className={`text-sm truncate font-medium ${cvResumeUrl ? "text-[#1C4E8D] type-subtitle" : "text-secondary"}`}>
              {cvResumeUrl ? `${username}.` + cvResumeUrl.split(".").pop() : "Example.pdf"}
            </span>
          </div>
          {cvResumeUrl && (
            <button type="button" onClick={() => setIsDeleteResumeModalOpen(true)}>
              <Trash2 color="red" className="w-5 h-5 cursor-pointer" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
