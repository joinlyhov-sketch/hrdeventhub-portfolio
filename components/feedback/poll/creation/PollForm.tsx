"use client";

import React, { useState } from "react";
import { Plus, Delete } from "lucide-react";
import { FeedbackBreadcrumb } from "../../../dashboard/FeedbackBreadcrumb";

export default function PollForm() {
  const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]);

  return (
    <div className="space-y-6">
      <FeedbackBreadcrumb label="Create Poll" />
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 border-l-[6px] border-l-[#1E3A8A]">
        <input
          type="text"
          placeholder="Untitled Poll"
          className="w-full text-3xl font-bold text-slate-500 placeholder-slate-400 outline-none mb-4"
        />
        <input
          type="text"
          placeholder="Add a description for your Poll..."
          className="w-full text-base text-slate-500 placeholder-slate-300 outline-none pb-2 border-b border-slate-100 focus:border-slate-300"
        />
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm hover:border-slate-300 transition"
          >
            <input
              type="text"
              defaultValue={option}
              className="w-full bg-transparent text-slate-600 font-medium outline-none"
            />
            <button
              onClick={() => setOptions(options.filter((_, i) => i !== index))}
              className="text-slate-400 hover:text-red-500 ml-2"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            setOptions([...options, `Option ${options.length + 1}`])
          }
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 text-slate-500 font-medium py-4 rounded-2xl hover:bg-slate-50 transition bg-white/50"
        >
          <Plus className="w-4 h-4" />
          Add Option
        </button>
      </div>
    </div>
  );
}
