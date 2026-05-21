"use client";

import {
  ArrowRight,
  BarChart3,
  Circle,
  User,
  Plus,
} from "lucide-react";
import Search from "../../components/site/Search";

import { surveyFeedbacks } from "../../data/surveyFeedback";
import Link from "next/link";
import { PaginationDemo } from "./Pagination";

export default function SurveyFeedbackFeature() {
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <SectionTitle />
      <div className="flex items-center justify-end mb-6 gap-2">
        <Search/>
        <button 
            className="bg-primary p-2 text-white rounded-full hover:bg-primary-hover transition-all cursor-pointer shadow-sm flex items-center justify-center overflow-hidden w-[46px] h-[46px] relative z-50"
          >
            <div className={`transform transition-transform duration-300 flex items-center justify-center`}>
              <Plus size={30} />
            </div>
          </button>
      </div>
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


function FeedbackCard({ item }: { item: (typeof surveyFeedbacks)[number] }) {
  return (
    <article className="rounded-2xl border border-accent/30 bg-card p-6">
      <div className=" flex items-center justify-between">
        <StatusBadge status={item.status} />
        <div className="inline-flex size-12 items-center justify-center rounded-lg bg-accent/20 text-accent">
          <BarChart3 size={22} />
        </div>
      </div>
      <h3 className="type-subtitle text-primary">{item.title}</h3>
      <p className="type-desc mt-2 mb-4 text-muted-foreground">{item.date}</p>
      <div className=" text-center mb-4">
        <h1 className="type-h1 text-primary">{item.totalResponse}</h1>
        <p className="type-desc-semibold text-secondary">Total Response</p>
      </div>

      <Link href={`/feedback/${item.id}`}>
        <button className="type-dec inline-flex w-full items-center justify-center gap-2 bg-primary text-white px-7 py-3 rounded-2xl text-sm font-bold hover:bg-[#C5A358] transition-all shadow-sm">
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
