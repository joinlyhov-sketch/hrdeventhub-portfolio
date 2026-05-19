import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination() {
  return (
    <div className="flex items-center justify-end gap-1 mt-4">
      <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50">
        <ChevronLeft size={18} />
      </button>
      
      <button className="px-3 py-1 text-sm font-bold rounded-lg bg-blue-50 text-blue-900">
        1
      </button>
      <button className="px-3 py-1 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50">
        2
      </button>
      <button className="px-3 py-1 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50">
        3
      </button>
      <span className="px-2 text-sm text-slate-400 font-medium">...</span>
      <button className="px-3 py-1 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50">
        13
      </button>

      <button className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}