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
    <div className="mb-6 flex gap-3">
      <div className="flex flex-1 items-center rounded-xl border border-border bg-background px-4 py-2">
        <input
          placeholder="Search for feedback..."
          className="type-detail w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />

        <button
          title="Search"
          className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary-hover"
        >
          <Search size={18} />
        </button>
      </div>

      <button
        title="Add Feedback"
        className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary-hover"
      >
        <Plus size={22} />
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

      <button className="type-subtitle inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-5 text-primary-foreground transition hover:bg-primary-hover">
        <span>Open Result</span>
        <ArrowRight size={22} strokeWidth={2.5} />
      </button>
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
        <Circle size={10} className="mr-2 fill-current" />
        {status}
      </div>
    </>
  );
}
