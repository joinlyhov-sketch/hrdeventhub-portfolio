"use client";

import React from "react";

interface StudentBioProps {
  bio: string;
  setBio: (val: string) => void;
  errors: Record<string, string>;
}

export default function StudentBio({ bio, setBio, errors }: StudentBioProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5 w-full">
        <label className="type-desc text-secondary">Profile Bio</label>
        <textarea
          rows={6}
          value={bio}
          maxLength={500}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 bg-white border border-border rounded-lg type-detail text-primary focus:outline-hidden focus:border-primary resize-none"
        />
      </div>
      {errors.bio && <p className="text-xs text-red-500">{errors.bio}</p>}
    </>
  );
}
