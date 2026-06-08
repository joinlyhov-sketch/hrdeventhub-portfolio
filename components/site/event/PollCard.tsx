"use client";

import { useState, useEffect } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localVoted, setLocalVoted] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [previouslyVotedOptionIds, setPreviouslyVotedOptionIds] = useState<
    Set<string>
  >(new Set());
  const [votedTypeSnapshot, setVotedTypeSnapshot] = useState<string | null>(
    null,
  );
  const [votedOptionsCountSnapshot, setVotedOptionsCountSnapshot] =
    useState<number>(0);

  const userId =
    (session?.user as any)?.id ||
    (session?.user as any)?.userId ||
    (session?.user as any)?.sub ||
    (session?.user as any)?.uid;

  const { data: livePoll, mutate } = useSWR<Poll>(
    session?.accessToken
      ? ["poll", initialPoll.pollId, session.accessToken]
      : null,
    () => pollService.getById(initialPoll.pollId),
    {
      fallbackData: initialPoll,
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    },
  );

  useEffect(() => {
    mutate();
  }, [initialPoll.pollId]);

  useEffect(() => {
    if (!userId || !initialPoll?.pollId || typeof window === "undefined")
      return;

    const votedKey = `poll_voted_${initialPoll.pollId}_${userId}`;
    setLocalVoted(localStorage.getItem(votedKey) === "true");

    const votedIdsKey = `poll_voted_ids_${initialPoll.pollId}_${userId}`;
    const rawIds = localStorage.getItem(votedIdsKey);
    if (rawIds) {
      try {
        setPreviouslyVotedOptionIds(new Set(JSON.parse(rawIds)));
      } catch {}
    }

    const typeKey = `poll_type_snapshot_${initialPoll.pollId}_${userId}`;
    setVotedTypeSnapshot(localStorage.getItem(typeKey));

    const countKey = `poll_options_count_snapshot_${initialPoll.pollId}_${userId}`;
    const savedCount = localStorage.getItem(countKey);
    if (savedCount) {
      setVotedOptionsCountSnapshot(parseInt(savedCount, 10));
    }
  }, [initialPoll.pollId, userId]);

  const poll = livePoll!;
  const rawOptions = poll.options ?? [];
  const isExpired = new Date(poll.closingTime) < new Date();

  useEffect(() => {
    setSelectedOptions([]);
  }, [poll?.multiSelect]);

  const currentPollTypeStr = poll.multiSelect ? "multi" : "single";

  const pollTypeHasChangedToSingle =
    votedTypeSnapshot !== null &&
    votedTypeSnapshot === "multi" &&
    currentPollTypeStr === "single";

  const serverHasVotedFlag = (() => {
    if (!userId || !rawOptions.length) return false;
    if ((poll as any).hasVoted === true || (poll as any).voted === true)
      return true;
    if ((poll as any).votedOptionId || (poll as any).selectedOptionId)
      return true;
    return rawOptions.some(
      (opt: any) =>
        opt.voters?.includes(userId) ||
        opt.votedUserIds?.includes(userId) ||
        opt.userVotes?.includes(userId) ||
        opt.votedUsers?.some(
          (u: any) => u.id === userId || u === userId || u.userId === userId,
        ) ||
        (poll as any).votedUserIds?.includes(userId) ||
        (poll as any).voters?.includes(userId),
    );
  })();

  const hasVoted =
    (localVoted || serverHasVotedFlag) && !pollTypeHasChangedToSingle;
  const hasNewOptionsBeenAddedByAdmin =
    hasVoted && rawOptions.length > votedOptionsCountSnapshot;

  const canReVote =
    !justVoted &&
    (pollTypeHasChangedToSingle ||
      (hasVoted &&
        !isExpired &&
        !!poll.multiSelect &&
        hasNewOptionsBeenAddedByAdmin));

  const showResult = justVoted || (!canReVote && (hasVoted || isExpired));

  // Client Injection: Re-calculate options array locally if server drops or resets metrics to 0
  const options = rawOptions.map((opt) => {
    let currentCount = opt.voteCount ?? 0;

    // Check if the user voted for this item locally or just now via form
    const wasVotedJustNow = selectedOptions.includes(opt.id) && justVoted;
    const wasVotedInLocalStorage = previouslyVotedOptionIds.has(opt.id);

    if ((wasVotedJustNow || wasVotedInLocalStorage) && currentCount === 0) {
      currentCount = 1;
    }
    return { ...opt, voteCount: currentCount };
  });

  const totalVotesSum = options.reduce(
    (acc, opt) => acc + (opt.voteCount ?? 0),
    0,
  );

  const uniqueVotersCount =
    (poll as any).votersCount ||
    (poll as any).totalVoters ||
    (() => {
      const uniqueUsers = new Set();
      options.forEach((opt: any) => {
        (opt.voters || opt.votedUserIds || opt.userVotes || []).forEach(
          (id: any) => {
            if (id)
              uniqueUsers.add(typeof id === "object" ? id.id || id.userId : id);
          },
        );
      });
      return uniqueUsers.size > 0 ? uniqueUsers.size : null;
    })();

  const denominator = poll.multiSelect
    ? uniqueVotersCount || totalVotesSum
    : totalVotesSum;

  const handleSelect = (optionId: string) => {
    if (isExpired || isSubmitting) return;
    if (hasVoted && !canReVote) return;
    if (
      hasVoted &&
      previouslyVotedOptionIds.has(optionId) &&
      !pollTypeHasChangedToSingle
    )
      return;

    if (poll.multiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId],
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken || selectedOptions.length === 0) return;

    const idsToSubmit = pollTypeHasChangedToSingle
      ? selectedOptions
      : selectedOptions.filter((id) => !previouslyVotedOptionIds.has(id));

    if (idsToSubmit.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await pollService.vote(
        poll.pollId,
        { optionIds: idsToSubmit },
        session.accessToken,
      );

      if (userId) {
        const updatedVotedIds = new Set(idsToSubmit);
        const currentTotalOptionsSize = options.length;

        localStorage.setItem(`poll_voted_${poll.pollId}_${userId}`, "true");
        localStorage.setItem(
          `poll_voted_ids_${poll.pollId}_${userId}`,
          JSON.stringify([...updatedVotedIds]),
        );
        localStorage.setItem(
          `poll_options_count_snapshot_${poll.pollId}_${userId}`,
          currentTotalOptionsSize.toString(),
        );
        localStorage.setItem(
          `poll_type_snapshot_${poll.pollId}_${userId}`,
          currentPollTypeStr,
        );

        setLocalVoted(true);
        setPreviouslyVotedOptionIds(updatedVotedIds);
        setVotedOptionsCountSnapshot(currentTotalOptionsSize);
        setVotedTypeSnapshot(currentPollTypeStr);
      }

      setJustVoted(true);
      await mutate();
    } catch (err: any) {
      const message = err?.message?.toLowerCase() ?? "";
      const isAlreadyVoted =
        message.includes("already voted") || message.includes("already_voted");
      const isCacheError =
        message.includes("null") ||
        message.includes("cache") ||
        message.includes("redis");

      if (isAlreadyVoted || isCacheError) {
        if (userId) {
          localStorage.setItem(`poll_voted_${poll.pollId}_${userId}`, "true");
          localStorage.setItem(
            `poll_options_count_snapshot_${poll.pollId}_${userId}`,
            options.length.toString(),
          );
          localStorage.setItem(
            `poll_type_snapshot_${poll.pollId}_${userId}`,
            currentPollTypeStr,
          );
          setLocalVoted(true);
          setVotedOptionsCountSnapshot(options.length);
          setVotedTypeSnapshot(currentPollTypeStr);
        }
        setError(null);
        setJustVoted(true);
        mutate();
      } else {
        setError(err?.message || "Failed to submit vote. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);    
    try {
      await deletePollAction(poll.pollId, poll.workspaceId);
      if (userId) {
        localStorage.removeItem(`poll_voted_${poll.pollId}_${userId}`);
        localStorage.removeItem(`poll_voted_ids_${poll.pollId}_${userId}`);
        localStorage.removeItem(`poll_options_count_snapshot_${poll.pollId}_${userId}`);
        localStorage.removeItem(`poll_type_snapshot_${poll.pollId}_${userId}`);
      }
      
      onDelete();
    } catch {
      setError("Failed to delete poll. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <article
      className={`w-full bg-card rounded-xl p-5 border border-subtle shadow-sm text-foreground transition-opacity ${
        isDeleting ? "opacity-0 pointer-events-none hidden" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center p-2 rounded-lg border border-subtle/30 bg-subtle/10 text-subtle">
            <BarChart3 size={20} />
          </div>
          <h2 className="type-subtitle font-bold text-subtle tracking-tight">
            {poll.title}
          </h2>
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
          : `Closes: ${new Date(poll.closingTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}`}
      </p>

      <legend className="type-desc text-foreground mb-6 block">
        {poll.description ?? poll.title}
      </legend>

      {canReVote ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 mb-4">
            {options.map((option) => {
              const isChecked = selectedOptions.includes(option.id);

              return (
                <label
                  key={option.id}
                  className="relative flex items-center justify-between p-4 rounded-xl border border-grey-100 bg-grey-50 hover:bg-grey-100 hover:border-subtle/30 cursor-pointer transition-all select-none overflow-hidden"
                >
                  <div className="relative z-10 flex items-center gap-4 flex-1 w-full">
                    <input
                      type="radio"
                      name={`poll-${poll.pollId}`}
                      value={option.id}
                      checked={isChecked}
                      onChange={() => handleSelect(option.id)}
                      className="sr-only"
                    />
                    <div className="w-5 h-5 border flex items-center justify-center shrink-0 transition-all bg-white border-grey-300 rounded-full">
                      {isChecked && (
                        <div className="bg-subtle w-2.5 h-2.5 rounded-full" />
                      )}
                    </div>
                    <span className="type-detail-medium text-foreground">
                      {option.text}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          {/* <p className="text-xs text-subtle font-medium mb-4 text-center ">
            . Please recast your vote.
          </p> */}

          {error && (
            <p className="text-destructive type-detail-small-medium mb-3 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={selectedOptions.length === 0 || isSubmitting}
            className={`w-full py-3.5 rounded-xl type-desc-semibold transition-all ${
              selectedOptions.length > 0 && !isSubmitting
                ? "bg-subtle text-white hover:opacity-90 active:scale-[0.99]"
                : "bg-subtle text-white cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Vote Now"}
          </button>
        </form>
      ) : showResult ? (
        <div className="w-full space-y-6">
          <div className="space-y-5">
            {options.map((option) => {
              const currentVotes = option.voteCount;
              const adjustedDenominator = denominator === 0 ? 1 : denominator;
              const percentage = Math.min(
                Math.round((currentVotes / adjustedDenominator) * 100),
                100,
              );

              return (
                <div key={option.id} className="w-full select-none">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="type-detail-medium text-foreground font-medium">
                      {option.text}
                    </span>
                    <span className="type-detail-semibold text-subtle font-bold">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#e8fbf4] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-subtle rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center type-detail-medium text-grey-400 mt-3">
            {isExpired ? "Poll closed" : `Total participants: ${denominator}`}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 mb-6">
            {options.map((option) => {
              const isChecked = selectedOptions.includes(option.id);
              return (
                <label
                  key={option.id}
                  className="relative flex items-center justify-between p-4 rounded-xl border border-grey-100 bg-grey-50 hover:bg-grey-100 hover:border-subtle/30 cursor-pointer transition-all select-none overflow-hidden"
                >
                  <div className="relative z-10 flex items-center gap-4 w-full">
                    <input
                      type={poll.multiSelect ? "checkbox" : "radio"}
                      name={`poll-${poll.pollId}`}
                      value={option.id}
                      checked={isChecked}
                      onChange={() => handleSelect(option.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border flex items-center justify-center transition-all bg-white border-grey-300 shrink-0 ${poll.multiSelect ? "rounded-md" : "rounded-full"}`}
                    >
                      {isChecked && (
                        <div
                          className={`bg-subtle ${poll.multiSelect ? "w-2.5 h-2.5 rounded-sm" : "w-2.5 h-2.5 rounded-full"}`}
                        />
                      )}
                    </div>
                    <span className="type-detail-medium text-foreground">
                      {option.text}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          {error && (
            <p className="text-destructive type-detail-small-medium mb-3 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={selectedOptions.length === 0 || isSubmitting}
            className={`w-full py-3.5 rounded-xl type-desc-semibold transition-all ${
              selectedOptions.length > 0 && !isSubmitting
                ? "bg-subtle text-white hover:opacity-90 active:scale-[0.99]"
                : "bg-subtle/50 text-white cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Vote Now"}
          </button>
        </form>
      )}
    </article>
  );
}

export function PollCard({ role, polls, onDeletePoll }: PollCardProps) {
  return (
    <>
      {polls.map((poll) => (
        <PollItem
          key={poll.pollId}
          initialPoll={poll}
          role={role}
          onDelete={() => onDeletePoll(poll.pollId)}
        />
      ))}
    </>
  );
}
