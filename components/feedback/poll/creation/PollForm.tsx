"use client";

import React, { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { FeedbackBreadcrumb } from "../../../dashboard/FeedbackBreadcrumb";

export default function PollForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionTextChange = (index: number, text: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = text;
    setOptions(updatedOptions);
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title,
      description,
      choices: options,
    };

    console.log("Posting payload:", payload);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert("Poll Posted Successfully!");
  };

  return (
    <form onSubmit={handleFormSubmission} className="space-y-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <FeedbackBreadcrumb label="Create Poll" />
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div></div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto p-2.5 px-6 rounded-xl bg-primary text-white text-xs font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 min-w-[120px]"
        >
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {isSubmitting ? "Posting..." : "Post Poll"}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 border-l-[6px] border-l-blue-900">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Poll"
          required
          className="w-full text-3xl font-bold text-gray-800 placeholder-gray-400 outline-none mb-4 bg-transparent"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description for your Poll..."
          className="w-full text-base text-gray-600 placeholder-gray-400 outline-none pb-2 border-b border-gray-200 focus:border-gray-300 bg-transparent"
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
              value={option}
              onChange={(e) => handleOptionTextChange(index, e.target.value)}
              className="w-full bg-transparent text-[#64748B] font-medium outline-none"
              required
            />
            {options.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setOptions(options.filter((_, i) => i !== index))
                }
                className="text-gray-400 hover:text-red-500 ml-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setOptions([...options, `Option ${options.length + 1}`])
          }
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 text-slate-500 font-medium py-4 rounded-2xl hover:bg-slate-50 transition bg-white/50"
        >
          <Plus className="w-4 h-4" />
          Add Option
        </button>
      </div>
    </form>
  );
}
