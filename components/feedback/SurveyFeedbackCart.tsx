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
import { surveyService } from "../../service/survey.service";
import { format, isAfter } from "date-fns";

export default function SurveyFeedbackFeature() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
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

  // Fetch real surveys from backend
  useEffect(() => {
    const fetchLiveFeedbackData = async () => {
      setLoading(true);
      try {
        const data = await surveyService.getAllSurveys(1, 100); 
        setSurveys(data);

        const counts: Record<string, number> = {};
        await Promise.all(
          data.map(async (survey) => {
            try {
              counts[survey.surveyId] = await surveyService.countResponses(survey.surveyId);
            } catch {
              counts[survey.surveyId] = 0;
            }
          })
        );
        setResponseCounts(counts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load surveys from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveFeedbackData();
  }, []);

  // Filter dynamic live items based on search query and actual runtime status
  const filteredFeedbacks = useMemo(() => {
    return surveys.filter((item) => {
      const searchLower = (search || "").toLowerCase().trim();
      const titleMatch = item.title ? item.title.toLowerCase().includes(searchLower) : false;
      
      // Real-time status calculation (Matches backend SurveyServiceImpl check)
      const hasExpired = item.closingTime ? isAfter(new Date(), new Date(item.closingTime)) : false;
      // Safeguard: Read both backend variations of the active flag property
      const dbIsActive = (item as any).active ?? item.isActive ?? false;
      const trulyActive = dbIsActive && !hasExpired;
      
      const statusText = trulyActive ? "active" : "closed";
      const statusMatch = statusText.includes(searchLower);

      return titleMatch || statusMatch;
    });
  }, [surveys, search]);

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
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Fetching latest surveys...</p>
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
            placeholder="Search for feedback..."
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
              <div key={item.surveyId} className="w-full block box-border min-w-0">
                <FeedbackCard item={item} totalResponses={responseCounts[item.surveyId] || 0} />
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
                  We couldn&apos;t find any match for your current feedback.
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

function FeedbackCard({ item, totalResponses }: { item: Survey; totalResponses: number }) {
  const formattedDate = item.closingTime 
    ? format(new Date(item.closingTime), "MMM dd, yyyy") 
    : "No Deadline";

  // Real-time status logic evaluation
  const hasExpired = item.closingTime ? isAfter(new Date(), new Date(item.closingTime)) : false;
  const dbIsActive = (item as any).active ?? item.isActive ?? false;
  const trulyActive = dbIsActive && !hasExpired;

  return (
    <article className="rounded-2xl border border-accent/30 bg-card p-6 h-full w-full box-border flex flex-col justify-between min-w-0 overflow-hidden">
      <div className="w-full block">
        <div className="flex items-center justify-between w-full gap-2">
          <StatusBadge isActive={trulyActive} />
          <div className="inline-flex size-12 items-center justify-center rounded-lg bg-accent/20 text-accent shrink-0">
            <Image src="/chart.svg" alt="chart" width={22} height={22} />
          </div>
        </div>
        <h3 className="type-subtitle text-primary mt-4 break-words line-clamp-2 w-full font-semibold text-lg">
          {item.title || "Untitled Survey"}
        </h3>
        <p className="type-desc mt-2 mb-4 text-sm text-muted-foreground">
          Closes: {formattedDate}
        </p>
      </div>

      <div className="w-full block mt-auto">
        <div className="text-center mb-4 w-full">
          <h1 className="text-3xl font-bold text-primary">{totalResponses}</h1>
          <p className="type-desc-semibold text-secondary text-sm">Total Response</p>
        </div>

        <Link href={`/dashboard/feedback/survey/${item.surveyId}/responses`} className="w-full block">
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