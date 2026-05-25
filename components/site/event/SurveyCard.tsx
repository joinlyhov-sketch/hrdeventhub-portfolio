"use client";

import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, MoreVertical } from "lucide-react";

const steps = 5;

interface SurveyData {
  favoriteSession: string;
  rating: number;
  suggestions: string;
}

// Added onVisibilityChange callback required by parent container matching logic
interface SurveyCardProps {
  searchQuery: string;
  onVisibilityChange: (hasItems: boolean) => void;
}

export function SurveyCard({ searchQuery, onVisibilityChange }: SurveyCardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SurveyData>({
    favoriteSession: "Cloud Infrastructure 2025",
    rating: 2,
    suggestions: "",
  });

  const title = "Event Feedback: Tech Innovation Summit";
  const description = "Help us improve the summit experience";

  // Checks if the typed input matches either the card title or subtitle description text
  const isMatch =
    title.toLowerCase().includes((searchQuery || "").toLowerCase().trim()) ||
    description
      .toLowerCase()
      .includes((searchQuery || "").toLowerCase().trim());

  // Notify parent container of visibility state changes when search updates
  useEffect(() => {
    onVisibilityChange(isMatch);
  }, [isMatch, onVisibilityChange]);

  // Hides the component entirely if it doesn't match the current search string
  if (!isMatch) {
    return null;
  }

  const sessionOptions = [
    "AI Ethics and Policy",
    "Cloud Infrastructure 2025",
    "Quantum Computing Deep Dive",
  ];

  const handleNext = () => {
    if (currentStep < steps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      alert(
        "Survey completed! Data submitted: " +
          JSON.stringify(formData, null, 2),
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm text-grey-900">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold text-secondary">{title}</h2>
          <span className="bg-[#EBF5FB] text-[#3FA6DC] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Survey
          </span>
        </div>
        <button className="text-grey-400 hover:text-grey-900 transition-colors cursor-pointer">
          <MoreVertical size={20} />
        </button>
      </div>

      <p className="text-sm text-grey-500 mb-8">{description}</p>

      {currentStep === 1 ? (
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-medium text-grey-900 mb-4">
              Which session was your favorite today?
            </h3>
            <div className="space-y-3">
              {sessionOptions.map((option) => {
                const isSelected = formData.favoriteSession === option;
                return (
                  <label
                    key={option}
                    className={`flex items-center gap-4 border p-4 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "border-secondary bg-secondary/[0.02]"
                        : "border-grey-200 hover:border-grey-300 bg-white"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="favoriteSession"
                        value={option}
                        checked={isSelected}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            favoriteSession: e.target.value,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? "border-secondary" : "border-grey-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-grey-700">
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Question 2: Star Ratings */}
          <div>
            <h3 className="text-sm font-medium text-grey-900 mb-4">
              How would you rate the overall keynote quality?
            </h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = starValue <= formData.rating;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, rating: starValue })
                    }
                    className="text-[#FFA02E] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      size={24}
                      fill={isFilled ? "#FFA02E" : "none"}
                      stroke={isFilled ? "#FFA02E" : "#D1D5DB"}
                      strokeWidth={1.5}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-grey-900 mb-4">
              Any specific suggestions for next year?
            </h3>
            <textarea
              rows={4}
              value={formData.suggestions}
              onChange={(e) =>
                setFormData({ ...formData, suggestions: e.target.value })
              }
              placeholder="Type your response here..."
              className="w-full border border-grey-200 rounded-xl p-4 text-sm text-grey-900 placeholder:text-grey-400 outline-none focus:border-grey-400 focus:ring-1 focus:ring-grey-400 transition-all resize-none"
            />
          </div>
        </div>
      ) : (
        /* Fallback View Mock Content for Step 2 through 5 */
        <div className="py-16 text-center space-y-2">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">
            Step {currentStep} of {steps}
          </p>
          <h3 className="text-lg font-bold text-secondary">
            Additional Survey Sections
          </h3>
          <p className="text-sm text-grey-400 max-w-sm mx-auto">
            This workspace dynamically keeps track of form entries as you route
            through modules.
          </p>
        </div>
      )}
      <div className="border-t border-grey-100 my-8" />
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 text-sm font-bold transition-colors select-none ${
            currentStep === 1
              ? "text-grey-300 cursor-not-allowed"
              : "text-secondary hover:text-primary cursor-pointer"
          }`}
        >
          <ChevronLeft size={18} />
          <span className="uppercase tracking-wider">
            Step {currentStep} of {steps}
          </span>
        </button>

        <button
          onClick={handleNext}
          className="bg-secondary hover:bg-secondary-hover text-white px-8 py-3 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer tracking-wider"
        >
          {currentStep === steps ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}