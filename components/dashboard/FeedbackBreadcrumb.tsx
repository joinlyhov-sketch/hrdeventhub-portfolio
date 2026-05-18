"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const FeedbackBreadcrumb = ({ label }: { label: string }) => (
  <nav className="flex items-center gap-2 text-detail font-bold py-3">
    <Link href="/feedback" className="text-primary hover:text-blue-900">
      Feedback
    </Link>
    <ChevronRight size={14} className="text-slate-400" />
    <span className="text-action">{label}</span>
  </nav>
);