"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import useSWR from "swr";
import type { UserRole } from "@/context/user-context";
import EditPostDropDown from "@/components/site/pop-up/action-button/action-edit-post";
import { Poll } from "@/types/poll";
import { useSession } from "next-auth/react";
import { pollService } from "@/service/poll.service";
import { deletePollAction } from "@/actions/poll.action";

interface PollCardProps {
  role: UserRole;
  polls: Poll[];
  searchQuery: string;
  onDeletePoll: (pollId: string) => void;
}

function PollItem({
  initialPoll,
  role,
  onDelete,
}: {
  initialPoll: Poll;
  role: UserRole;
  onDelete: () => void;
}) {
  const { data: session } = useSession();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: livePoll, mutate } = useSWR<Poll>(
    session?.accessToken ? ["poll", initialPoll.pollId, session.accessToken] : null,
    () => pollService.getById(initialPoll.pollId),
    { fallbackData: initialPoll, refreshInterval: 5000, revalidateOnFocus: true }
  );

  const poll = livePoll!;
  const options = poll.options ?? [];
  const totalVotes = options.reduce((acc, opt) => acc + (opt.voteCount ?? 0), 0);
  const isExpired = new Date(poll.closingTime) < new Date();

  const handleSelect = (optionId: string) => {
    if (hasVoted || isExpired || isSubmitting) return;
    if (poll.multiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOptions.length === 0 || !session?.accessToken) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await pollService.vote(poll.pollId, { optionIds: selectedOptions }, session.accessToken);
      setHasVoted(true);
      mutate();
    } catch (err: any) {
      const message = err?.message?.toLowerCase() ?? "";
      const isCacheError = message.includes("null") || message.includes("cache") || message.includes("redis");
      if (isCacheError) { setHasVoted(true); mutate(); }
      else setError("Failed to submit vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${poll.title}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await deletePollAction(poll.pollId, poll.workspaceId);
      onDelete();
    } catch {
      setError("Failed to delete poll. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <article className={`w-full bg-card rounded-xl p-5 border border-subtle shadow-sm text-foreground transition-opacity ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center p-2 rounded-lg border border-subtle/30 bg-subtle/10 text-subtle">
            <BarChart3 size={20} />
          </div>
          <h2 className="type-subtitle font-bold text-subtle tracking-tight">{poll.title}</h2>
        </div>
        {(role === "admin" || role === "organizer") && (
          <EditPostDropDown
            title={poll.title}
            editUrl={`/event-management/edition/poll?pollId=${poll.pollId}`}
            onDelete={handleDelete}
          />
        )}
      </div>

      <p className="type-detail-small-medium text-grey-400 mb-4">
        {isExpired
          ? "Poll closed"
          : `Closes: ${new Date(poll.closingTime).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
            })}`}
      </p>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={hasVoted || isExpired || isSubmitting} className="w-full">
          <legend className="type-desc text-foreground mb-6 block">{poll.description ?? poll.title}</legend>
          <div className="space-y-3 mb-6">
            {options.map((option) => {
              const isChecked = selectedOptions.includes(option.id);
              const currentVotes = option.voteCount ?? 0;
              const percentage = totalVotes > 0 ? Math.round((currentVotes / totalVotes) * 100) : 0;
              const showResult =
                poll.showResult === "always" ||
                (poll.showResult === "after_vote" && hasVoted) ||
                isExpired;

              return (
                <label
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`relative flex items-center justify-between p-4 rounded-xl border transition-all select-none overflow-hidden ${
                    hasVoted || isExpired
                      ? "border-grey-100 bg-grey-50"
                      : "border-grey-100 bg-grey-50 hover:bg-grey-100 hover:border-subtle/30 cursor-pointer"
                  }`}
                >
                  {showResult && (
                    <div
                      className="absolute inset-y-0 left-0 bg-subtle/10 transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-4">
                    <input
                      type={poll.multiSelect ? "checkbox" : "radio"}
                      name={`poll-${poll.pollId}`}
                      value={option.id}
                      checked={isChecked}
                      onChange={() => handleSelect(option.id)}
                      className="sr-only"
                    />
                    <div className={`${poll.multiSelect ? "w-5 h-5 rounded-md" : "w-5 h-5 rounded-full"} border flex items-center justify-center transition-all ${isChecked ? "border-subtle bg-white" : "border-grey-300 bg-white"}`}>
                      {isChecked && <div className={`${poll.multiSelect ? "w-2.5 h-2.5 rounded-sm" : "w-2.5 h-2.5 rounded-full"} bg-subtle`} />}
                    </div>
                    <span className="type-detail-medium text-foreground">{option.text}</span>
                  </div>
                  {showResult && (
                    <div className="relative z-10 flex items-center gap-2">
                      <span className="type-detail-small-medium text-grey-500">({currentVotes})</span>
                      <span className="type-detail-semibold text-subtle">{percentage}%</span>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        {error && <p className="text-destructive type-detail-small-medium mb-3 text-center">{error}</p>}

        {!hasVoted && !isExpired ? (
          <button
            type="submit"
            disabled={selectedOptions.length === 0 || isSubmitting}
            className={`w-full py-3.5 rounded-xl type-desc-semibold transition-all ${
              selectedOptions.length > 0 && !isSubmitting
                ? "bg-subtle text-white hover:opacity-90 active:scale-[0.99]"
                : "bg-grey-200 text-grey-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Vote Now"}
          </button>
        ) : (
          <div className="text-center type-detail-medium text-grey-500">
            {isExpired ? `Poll closed · ${totalVotes} votes` : `Thank you for voting! Total participants: ${totalVotes}`}
          </div>
        )}
      </form>
    </article>
  );
}

export function PollCard({ role, polls, onDeletePoll }: PollCardProps) {
  return (
    <>
      {polls.map((poll) => (
        <PollItem key={poll.pollId} initialPoll={poll} role={role} onDelete={() => onDeletePoll(poll.pollId)} />
      ))}
    </>
  );
}