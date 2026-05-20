"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

export const Breadcrumb = ({ label }: { label: string }) => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  const backHref = `/group/${groupId}`;

  return (
    <nav className="flex items-center gap-2 text-detail font-bold py-3">
      <Link href={backHref} className="text-primary hover:text-blue-900">
        Events
      </Link>
      <ChevronRight size={14} className="text-slate-400" />
      <span className="text-action">{label}</span>
    </nav>
  );
};