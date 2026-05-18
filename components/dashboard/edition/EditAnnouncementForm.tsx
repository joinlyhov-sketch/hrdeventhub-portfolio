"use client";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Megaphone,
  BookOpenTextIcon,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import MediaUpload from "../MediaUpload";

export default function EditAnnouncementForm() {
  return (
    <div className="flex flex-col">
      <Breadcrumb label="Announcement Creation" />
      <div className="mt-2 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-grow mb-4">
        <div className="p-5 md:p-8 lg:p-10 border-b border-slate-50">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1E3A8A]">
            Edition Form
          </h1>
          <p className="text-slate-400 text-xs md:text-sm lg:text-base mt-1">
            Fill in the details below to publish your next conference or
            workshop.
          </p>
          <div className="mt-6 md:mt-8 grid grid-cols-3 bg-slate-50 p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-slate-200">
            <Link
              href="/event-management/edition/event"
              className="flex items-center justify-center gap-2 py-2.5 md:py-3.5 text-slate-500 text-[10px] sm:text-xs md:text-sm font-semibold hover:bg-slate-100 rounded-lg md:rounded-xl transition-colors"
            >
              <CalendarDays size={16} className="md:w-[18px]" />
              <span>Event</span>
            </Link>
            <Link
              href="/event-management/edition/announcement"
              className="flex items-center justify-center gap-2 py-2.5 md:py-3.5 bg-[#1E3A8A] text-white rounded-lg md:rounded-xl text-[10px] sm:text-xs md:text-sm font-semibold shadow-md transition-all active:scale-95"
            >
              <Megaphone size={16} className="md:w-[18px]" />
              <span className="truncate">Announcement</span>
            </Link>
            <Link
              href="/event-management/edition/article"
              className="flex items-center justify-center gap-2 py-2.5 md:py-3.5 text-slate-500 text-[10px] sm:text-xs md:text-sm font-semibold hover:bg-slate-100 rounded-lg md:rounded-xl transition-colors"
            >
              <BookOpenTextIcon size={16} className="md:w-[18px]" />
              <span className="truncate">Article</span>
            </Link>
          </div>
        </div>
        <div className="p-5 md:p-8 lg:p-10 space-y-6 md:space-y-8 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-5 md:gap-y-6">
            <FormInput
              label="Event title"
              icon={FileText}
              placeholder="Please input the event announcement"
            />
            <FormInput
              label="Date"
              icon={Calendar}
              placeholder="Date"
              type="date"
            />
            <FormInput
              label="Start Time"
              icon={Clock}
              placeholder="--:-- --"
              type="time"
            />
            <FormInput
              label="End Time"
              icon={Clock}
              placeholder="--:-- --"
              type="time"
            />
            <FormInput
              label="Location"
              icon={MapPin}
              placeholder="Enter address"
            />
            <FormInput
              label="Schedule"
              icon={Calendar}
              placeholder="yyyy/mm/dd"
              type="date"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#1E3A8A] font-bold text-sm md:text-base lg:text-lg">
              Description
            </label>
            <textarea
              placeholder="Describe the mission and scope of this event..."
              className="w-full min-h-[120px] md:min-h-[160px] p-4 bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm md:text-base resize-none"
            />
          </div>
          <MediaUpload />
        </div>
      </div>
      <div className="p-3 bg-slate-50 flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          className="order-2 sm:order-1 w-full sm:w-auto px-12 py-3 border border-slate-200 bg-white text-slate-600 font-bold rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all active:scale-95 text-sm shadow-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          className="order-1 sm:order-2 w-full sm:w-auto px-12 py-3 bg-[#1E3A8A] text-white font-bold rounded-xl md:rounded-2xl hover:bg-blue-900 transition-all shadow-md active:scale-95 text-sm"
        >
          Create
        </button>
      </div>
    </div>
  );
}
