"use client";

import React, { useState } from "react";
import { AlignLeft, FileText, CheckCircle, ListChecks, ArrowDownCircle, Star, ToggleLeft, Grid, BarChart4, } from "lucide-react";
import SurveyHeader from "./SurveyHeader";
import SurveyQuestionsList, { Question } from "./SurveyQuestionsList";
import SidebarItemButton from "./SidebarItemButton";

export default function SurveyCreationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", type: "rating", text: "How would you rate today's event overall?", maxScale: 5, ratingValue: 0 },
    { id: "2", type: "linear", text: "On a scale of 1 to 5, how satisfied were you with today's event?", minLabel: "Not satisfied", maxLabel: "Very satisfied" },
    { id: "3", type: "choice", text: "Did the event start and end on time according to the announcement?", options: ["No, it was delayed", "Mostly on time", "I didn't notice", "Yes, perfectly on time"] },
  ]);

  const addQuestionByType = (type: "rating" | "linear" | "choice") => {
    const templates: Record<string, Partial<Question>> = {
      rating: { text: "Untitled Rating Question", maxScale: 5, ratingValue: 0 },
      linear: { text: "Untitled Scale Question", minLabel: "Low", maxLabel: "High" },
      choice: { text: "Untitled Choice Question", options: ["Option 1"] },
    };
    
    setQuestions([...questions, { id: `${Date.now()}`, type, ...templates[type] } as Question]);
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const completePayload = { title, description, questions };
    console.log("Submitting API Payload:", completePayload);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert("Survey created successfully!");
  };

  return (
    <form onSubmit={handleFormSubmission} className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screent ">
      
      <div className="lg:col-span-3 p-6 lg:p-8 max-w-4xl w-full mx-auto flex flex-col justify-between">
        <div>
          <SurveyHeader title={title} setTitle={setTitle} description={description} setDescription={setDescription} />
          <SurveyQuestionsList questions={questions} setQuestions={setQuestions} />
        </div>

        {/* <div className="flex justify-end gap-4 mt-12 pb-4">
          <button type="button" className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 rounded-xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2 disabled:opacity-60">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div> */}
      </div>

      <div className="bg-white border-l border-gray-100 p-6 space-y-6 h-screen">
        <div>
          <h3 className="text-sm font-bold text-gray-400 tracking-wider mb-4 uppercase">Question Types</h3>
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-gray-300 block mb-2 tracking-widest">BASIC</span>
              <div className="space-y-2">
                <SidebarItemButton label="Short Text" icon={<AlignLeft size={16} />} />
                <SidebarItemButton label="Long Text" icon={<FileText size={16} />} />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-300 block mb-2 tracking-widest">CHOICE</span>
              <div className="space-y-2">
                <SidebarItemButton label="Single Choice" icon={<CheckCircle size={16} />} onClick={() => addQuestionByType("choice")} />
                <SidebarItemButton label="Multiple Choice" icon={<ListChecks size={16} />} onClick={() => addQuestionByType("choice")} />
                <SidebarItemButton label="Dropdown" icon={<ArrowDownCircle size={16} />} />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-300 block mb-2 tracking-widest">ADVANCED</span>
              <div className="space-y-2">
                <SidebarItemButton label="Rating" icon={<Star size={16} />} onClick={() => addQuestionByType("rating")} />
                <SidebarItemButton label="Yes/No Toggle" icon={<ToggleLeft size={16} />} />
                <SidebarItemButton label="Matrix" icon={<Grid size={16} />} />
                <SidebarItemButton label="Linear Scale" icon={<BarChart4 size={16} />} onClick={() => addQuestionByType("linear")} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </form>
  );
}