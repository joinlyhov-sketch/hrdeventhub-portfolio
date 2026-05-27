"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Circle,
  User,
  Plus,
  FileExclamationPoint,
} from "lucide-react";
import Search from "../site/search/Search";

import { surveyFeedbacks } from "../../data/surveyFeedback";
import Link from "next/link";
import { PaginationDemo } from "./Pagination";

export default function SurveyFeedbackFeature() {
  const [search, setSearch] = useState("");

  const filteredFeedbacks = surveyFeedbacks.filter((item) => {
    const searchLower = (search || "").toLowerCase().trim();

    const titleMatch = item.title
      ? item.title.toLowerCase().includes(searchLower)
      : false;
    const statusMatch = item.status
      ? item.status.toLowerCase().includes(searchLower)
      : false;
    const dateMatch = item.date
      ? item.date.toLowerCase().includes(searchLower)
      : false;

    return titleMatch || statusMatch || dateMatch;
  });

  const hasResults = filteredFeedbacks.length > 0;

  return (
    <div className="w-full max-w-full block box-border clear-both">
      <section className="w-full max-w-full rounded-2xl border border-border bg-card p-4 box-border block overflow-hidden">
        <SectionTitle />

        <div className="flex items-center justify-end mb-6 gap-2 w-full box-border">
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for feedback..."
          />
          <button className="bg-primary p-2 text-white rounded-full hover:bg-primary-hover transition-all cursor-pointer shadow-sm flex items-center justify-center overflow-hidden w-11.5 h-11.5 shrink-0 relative z-10">
            <div className="transform transition-transform duration-300 flex items-center justify-center">
              <Plus size={30} />
            </div>
          </button>
        </div>

        <div className="relative w-full block box-border min-h-110">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full auto-rows-fr box-border transition-opacity duration-150 ${
              hasResults ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {(hasResults ? filteredFeedbacks : surveyFeedbacks).map((item) => (
              <div key={item.id} className="w-full block box-border min-w-0">
                <FeedbackCard item={item} />
              </div>
            ))}
          </div>

          {!hasResults && (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-2xl border border-gray-100 box-border p-6 left-0 top-0">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <FileExclamationPoint size={30} className="text-red-500" />
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
            <PaginationDemo />
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

function FeedbackCard({ item }: { item: (typeof surveyFeedbacks)[number] }) {
  return (
    <article className="rounded-2xl border border-accent/30 bg-card p-6 h-full w-full box-border flex flex-col justify-between min-w-0 overflow-hidden">
      <div className="w-full block">
        <div className="flex items-center justify-between w-full gap-2">
          <StatusBadge status={item.status} />
          <div className="inline-flex size-12 items-center justify-center rounded-lg bg-accent/20 text-accent shrink-0">
            <BarChart3 size={22} />
          </div>
        </div>
        <h3 className="type-subtitle text-primary mt-4 break-words line-clamp-2 w-full">
          {item.title}
        </h3>
        <p className="type-desc mt-2 mb-4 text-muted-foreground">{item.date}</p>
      </div>

      <div className="w-full block mt-auto">
        <div className="text-center mb-4 w-full">
          <h1 className="type-h1 text-primary">{item.totalResponse}</h1>
          <p className="type-desc-semibold text-secondary">Total Response</p>
        </div>

        <Link href={`/feedback/${item.id}`} className="w-full block">
          <button className="type-dec inline-flex w-full items-center justify-center gap-2 bg-primary text-white px-7 py-3 rounded-2xl text-sm font-bold hover:bg-[#C5A358] transition-all shadow-sm cursor-pointer">
            <span>Open Result</span>
            <ArrowRight size={20} strokeWidth={1.5} />
          </button>
        </Link>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <div
      className={`type-desc-semibold inline-flex items-center rounded-full px-4 py-2 shrink-0 ${
        isActive
          ? "bg-accent/10 text-accent"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      <Circle size={10} className="mr-1 fill-current" />
      {status}
    </div>
  );
}
