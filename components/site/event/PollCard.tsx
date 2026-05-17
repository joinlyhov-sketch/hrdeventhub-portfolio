"use client";

import { useState } from "react";
import { MoreVertical, BarChart3 } from "lucide-react";

const data = {
  id: "poll-123",
  title: "Quarterly Polls",
  question: "Should we have a Football Tournament this week?",
  options: [
    { id: "yes", label: "Yes", votes: 94 },
    { id: "no", label: "No", votes: 29 },
    { id: "considering", label: "Considering", votes: 22 },
    { id: "idk", label: "Considering", votes: 22 },
    { id: "why not", label: "Considering", votes: 22 }
  ]
};

export function PollCard() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const totalVotes = data.options.reduce((acc, curr) => acc + curr.votes, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption) {
      setHasVoted(true);
    }
  };

  return (
    <article className="w-full bg-card rounded-xl p-6 border border-subtle shadow-sm text-foreground">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center p-2 rounded-lg border border-subtle/30 bg-subtle/10 text-subtle">
            <BarChart3 size={20} />
          </div>
          <h2 className="type-subtitle font-bold text-subtle tracking-tight">
            {data.title}
          </h2>
        </div>
        <button
          type="button"
          className="text-grey-400 hover:text-grey-500 p-1 rounded transition-colors cursor-pointer"
          aria-label="Poll options"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={hasVoted} className="w-full">
          <legend className="type-desc text-foreground mb-6 block">
            {data.question}
          </legend>

          <div className="space-y-3 mb-6">
            {data.options.map((option) => {
              const isChecked = selectedOption === option.id;
              const currentVotes = hasVoted && isChecked ? option.votes + 1 : option.votes;
              const currentTotal = hasVoted ? totalVotes + 1 : totalVotes;
              const percentage = currentTotal > 0 ? Math.round((currentVotes / currentTotal) * 100) : 0;

              return (
                <label
                  key={option.id}
                  className={`relative flex items-center justify-between p-4 rounded-xl border transition-all select-none overflow-hidden ${
                    hasVoted
                      ? "border-grey-100 bg-grey-50"
                      : "border-grey-100 bg-grey-50 hover:bg-grey-100 hover:border-subtle/30 cursor-pointer"
                  }`}
                >
                  {hasVoted && (
                    <div
                      className="absolute inset-y-0 left-0 bg-subtle/10 transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-4">
                    <input
                      type="radio"
                      name="poll-options"
                      value={option.id}
                      checked={isChecked}
                      onChange={() => setSelectedOption(option.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isChecked
                          ? "border-subtle bg-white"
                          : "border-grey-300 bg-white"
                      }`}
                    >
                      {isChecked && (
                        <div className="w-2.5 h-2.5 rounded-full bg-subtle" />
                      )}
                    </div>
                    <span className="type-detail-medium text-foreground">
                      {option.label}
                    </span>
                  </div>

                  {hasVoted && (
                    <div className="relative z-10 flex items-center gap-2">
                      <span className="type-detail-small-medium text-grey-500">
                        ({currentVotes})
                      </span>
                      <span className="type-detail-semibold text-subtle">
                        {percentage}%
                      </span>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        {!hasVoted ? (
          <button
            type="submit"
            disabled={!selectedOption}
            className={`w-full py-3.5 rounded-xl type-desc-semibold transition-all ${
              selectedOption
                ? "bg-subtle text-white hover:opacity-90 active:scale-[0.99]"
                : "bg-grey-200 text-grey-400 cursor-not-allowed"
            }`}
          >
            Vote Now
          </button>
        ) : (
          <div className="text-center type-detail-medium text-grey-500">
            Thank you for voting! Total participants: {totalVotes + 1}
          </div>
        )}
      </form>
    </article>
  );
}