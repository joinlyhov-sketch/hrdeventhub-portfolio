"use client";

import React from "react";

interface SurveyHeaderProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
}

export default function SurveyHeader({
  title,
  setTitle,
  description,
  setDescription,
}: SurveyHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border-l-[6px] border-l-blue-900 border border-gray-100 p-8 shadow-sm mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled Survey"
        className="w-full text-3xl font-bold text-gray-800 outline-none placeholder-gray-300 mb-4 bg-transparent"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description for your survey participants..."
        className="w-full text-sm text-gray-600 outline-none placeholder-gray-300 border-b border-gray-100 pb-2 focus:border-blue-400 transition-colors bg-transparent"
      />
    </div>
  );
}
