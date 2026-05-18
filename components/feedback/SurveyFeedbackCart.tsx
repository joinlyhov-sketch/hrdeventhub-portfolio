"use client";

import {
  ArrowRight,
  BarChart3,
  Circle,
  Plus,
  Search,
  User,
} from "lucide-react";

import { surveyFeedbacks } from "../../data/surveyFeedback";
import Link from "next/link";
import { PaginationDemo } from "./Pagination";

export default function SurveyFeedbackFeature() {
  return (
    <section className="rounded-xl border border-border bg-card p-8">
      <SectionTitle />
      <SearchAction />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {surveyFeedbacks.map((item) => (
          <FeedbackCard key={item.id} item={item} />
        ))}
      </div>

      <PaginationDemo />
    </section>
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

function SearchAction() {
  return (
    <div className="flex items-center gap-2 mb-6 w-full">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search for group..."
          className="w-full pl-6 pr-14 py-3 border border-gray-200 rounded-full text-base focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-gray-400 shadow-sm"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <button
            title="Search"
            className="bg-primary p-2 rounded-full text-white hover:bg-[#25437a]"
          >
            <Search size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <button
        type="button"
        title="Add Feedback"
        className="inline-flex size-7 w-[60px] py-6 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-full"
      >
        <Plus size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function FeedbackCard({ item }: { item: (typeof surveyFeedbacks)[number] }) {
  return (
    <article className="rounded-xl border border-accent/30 bg-card p-8">
      <div className="mb-8 flex items-center justify-between">
        <StatusBadge status={item.status} />
        <div className="inline-flex size-12 items-center justify-center rounded-lg bg-accent/20 text-accent">
          <BarChart3 size={22} />
        </div>
      </div>
      <h3 className="type-subtitle text-primary">{item.title}</h3>
      <p className="type-desc mt-2 text-muted-foreground">{item.date}</p>
      <div className="my-8 text-center">
        <h1 className="type-h1 text-primary">{item.totalResponse}</h1>
        <p className="type-desc-semibold text-secondary">Total Response</p>
      </div>

      <Link href={`/feedback/${item.id}`}>
        <button className="type-dec inline-flex w-full items-center justify-center gap-2 bg-primary text-white px-7 py-3 rounded-xl text-sm font-bold hover:bg-[#C5A358] transition-all shadow-sm">
          <span>Open Result</span>
          <ArrowRight size={20} strokeWidth={1.5} />
        </button>
      </Link>
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <>
      <div
        className={`type-desc-semibold inline-flex items-center rounded-full px-4 py-2 ${
          isActive
            ? "bg-accent/10 text-accent"
            : "bg-destructive/10 text-destructive"
        }`}
      >
        <Circle size={10} className="mr-1 fill-current" />
        {status}
      </div>
    </>
  );
}
