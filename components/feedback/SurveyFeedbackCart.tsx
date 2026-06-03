"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Circle,
  User,
  FileText,
} from "lucide-react";
import Search from "../site/search/Search";
import { PopoverItem } from "../site/pop-up/contents/pop-over-content";
import Link from "next/link";
import { PaginationDemo } from "./Pagination";
import ContentTypePopover from "../site/pop-up/contents/pop-over-content";
import Image from "next/image";
import { Survey } from "../../types/survey";
import { Poll } from "@/types/poll";
import { surveyService } from "../../service/survey.service";
import { getAllPollsAction } from "../../actions/poll.action";
import { format, isAfter } from "date-fns";

export type FeedbackItem = {
  id: string;
  type: "survey" | "poll";
  title: string;
  closingTime: string | null;
  isActive: boolean;
  totalResponses: number;
  targetUrl: string;
};

export default function SurveyFeedbackFeature() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const contentMenuOptions: PopoverItem[] = [
    {
      label: "Survey",
      icon: CheckCircle2,
      href: "/event-management/creation/survey",
    },
    { label: "Poll", icon: BarChart3, href: "/event-management/creation/poll" },
  ];

  useEffect(() => {
    const fetchLiveFeedbackData = async () => {
      setLoading(true);
      try {
        const [surveysData, pollsData] = await Promise.all([
          surveyService.getAllSurveys(1, 100).catch(() => [] as Survey[]),
          getAllPollsAction(1, 100).catch(() => [] as Poll[]),
        ]);

        const mappedSurveys: FeedbackItem[] = await Promise.all(
          surveysData.map(async (survey) => {
            let responseCount = 0;
            try {
              responseCount = await surveyService.countResponses(
                survey.surveyId,
              );
            } catch {
              responseCount = 0;
            }

            const dbIsActive =
              (survey as any).active ?? survey.isActive ?? false;

            return {
              id: survey.surveyId,
              type: "survey",
              title: survey.title || "Untitled Survey",
              closingTime: survey.closingTime || null,
              isActive: dbIsActive,
              totalResponses: responseCount,
              targetUrl: `/dashboard/feedback/survey/${survey.surveyId}/responses`,
            };
          }),
        );

        const mappedPolls: FeedbackItem[] = pollsData.map((poll) => {
          const voteCount =
            poll.options?.reduce(
              (sum, opt: any) => sum + (opt.votes || 0),
              0,
            ) || 0;
          const dbIsActive =
            (poll as any).active ?? (poll as any).isActive ?? true;

          return {
            id: poll.pollId,
            type: "poll",
            title: poll.title || "Untitled Poll",
            closingTime: poll.closingTime || null,
            isActive: dbIsActive,
            totalResponses: voteCount,
            targetUrl: `/polls/${poll.pollId}`,
          };
        });

        const combined = [...mappedSurveys, ...mappedPolls];
        setFeedbacks(combined);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load interactive feedback modules.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLiveFeedbackData();
  }, []);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      const searchLower = (search || "").toLowerCase().trim();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const typeMatch = item.type.toLowerCase().includes(searchLower);

      const hasExpired = item.closingTime
        ? isAfter(new Date(), new Date(item.closingTime))
        : false;
      const trulyActive = item.isActive && !hasExpired;

      const statusText = trulyActive ? "active" : "closed";
      const statusMatch = statusText.includes(searchLower);

      return titleMatch || statusMatch || typeMatch;
    });
  }, [feedbacks, search]);

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const paginatedFeedbacks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFeedbacks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFeedbacks, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="w-full p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          Fetching latest records...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 border border-red-200 bg-red-50 rounded-2xl text-center text-red-700 font-medium">
        {error}
      </div>
    );
  }

  const hasResults = filteredFeedbacks.length > 0;

  return (
    <div className="w-full max-w-full block box-border clear-both">
      <section className="w-full max-w-full rounded-2xl border border-border bg-card p-4 box-border block overflow-hidden">
        <SectionTitle />

        <div className="flex items-center justify-end mb-6 gap-2 w-full box-border">
          <Search
            value={search}
            onChange={handleSearchChange}
            placeholder="Search for surveys, polls, or status..."
          />
          <ContentTypePopover items={contentMenuOptions} />
        </div>

        <div className="relative w-full block box-border min-h-110">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full auto-rows-fr box-border transition-opacity duration-150 ${
              hasResults ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {paginatedFeedbacks.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="w-full block box-border min-w-0"
              >
                <FeedbackCard item={item} />
              </div>
            ))}
          </div>

          {!hasResults && (
            <div className="w-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-2xl border border-gray-100 box-border p-6">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <FileText size={30} className="text-red-500" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-700">
                  Feedback data doesn&apos;t exist
                </p>
                <p className="text-sm text-slate-400 font-medium">
                  We couldn&apos;t find any match for your current feedback
                  search query.
                </p>
              </div>
            </div>
          )}
        </div>

        {hasResults && (
          <div className="mt-6 w-full block box-border clear-both">
            <PaginationDemo
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function SectionTitle() {
  return (
    <div className="mb-5 flex items-center gap-3">
      <User className="text-primary" size={24} />
      <h2 className="type-subtitle text-primary">Results</h2>
    </div>
  );
}

function FeedbackCard({ item }: { item: FeedbackItem }) {
  const formattedDate = item.closingTime
    ? format(new Date(item.closingTime), "MMM dd, yyyy")
    : "No Deadline";

  const hasExpired = item.closingTime
    ? isAfter(new Date(), new Date(item.closingTime))
    : false;
  const trulyActive = item.isActive && !hasExpired;

  return (
    <article className="rounded-2xl border border-accent/30 bg-card p-6 h-full w-full box-border flex flex-col justify-between min-w-0 overflow-hidden relative">
      <span className="absolute top-3 left-0 translate-y-[-50%] bg-slate-100 border border-slate-200 text-primary rounded-r-sm px-2 py-0.5 text-[12px] uppercase font-bold tracking-wider shadow-sm">
        {item.type}
      </span>

      <div className="w-full block">
        <div className="flex items-center justify-between w-full gap-2">
          <StatusBadge isActive={trulyActive} />
          <div className="inline-flex size-12 items-center justify-center rounded-lg bg-accent/20 text-accent shrink-0">
            <Image src="/chart.svg" alt="chart" width={22} height={22} />
          </div>
        </div>
        <h3 className="type-subtitle text-primary mt-4 break-words line-clamp-2 w-full font-semibold text-lg">
          {item.title}
        </h3>
        <p className="type-desc mt-2 mb-4 text-sm text-muted-foreground">
          Closes: {formattedDate}
        </p>
      </div>

      <div className="w-full block mt-auto">
        <div className="text-center mb-4 w-full">
          <h1 className="text-3xl font-bold text-primary">
            {item.totalResponses}
          </h1>
          <p className="type-desc-semibold text-secondary text-sm">
            {item.type === "poll" ? "Total Votes" : "Total Responses"}
          </p>
        </div>

        <Link href={item.targetUrl} className="w-full block">
          <button className="type-dec inline-flex w-full items-center justify-center gap-2 bg-primary text-white px-7 py-3 rounded-2xl text-sm font-bold hover:bg-[#C5A358] transition-all shadow-sm cursor-pointer">
            <span>Open Result</span>
            <ArrowRight size={20} strokeWidth={1.5} />
          </button>
        </Link>
      </div>
    </article>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`type-desc-semibold inline-flex items-center rounded-full px-4 py-2 shrink-0 text-xs font-semibold ${
        isActive
          ? "bg-green-50 text-green-600 border border-green-200"
          : "bg-red-50 text-red-600 border border-red-200"
      }`}
    >
      <Circle size={8} className="mr-1.5 fill-current" />
      {isActive ? "Active" : "Closed"}
    </div>
  );
}
