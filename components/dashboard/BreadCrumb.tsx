"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const Breadcrumb = ({ label }: { label: string }) => (
  <nav className="flex items-center gap-2 text-lg font-bold py-3">
    <Link href="/event" className="text-blue-700 hover:text-blue-900">
      Events
    </Link>
    <ChevronRight size={14} className="text-slate-400" />
    <span className="text-orange-400">{label}</span>
  </nav>
);