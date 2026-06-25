"use client";

import React from "react";

interface AdminBioProps {
  bio: string;
  setBio: (val: string) => void;
}

export default function AdminBio({ bio, setBio }: AdminBioProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="type-detail-semibold text-secondary">
        Profile Bio
      </label>
      <textarea
        rows={6}
        value={bio}
        maxLength={500}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-3 bg-background border border-border rounded-md type-detail text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
        placeholder="Tell us about yourself..."
      />
    </div>
  );
}
