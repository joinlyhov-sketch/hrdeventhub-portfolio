"use client";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  BadgeDollarSign,
} from "lucide-react";
import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import MediaUpload from "../MediaUpload";
import { Button } from "../../ui/button";
import { FormTextarea } from "../FormTextarea";
import { EditionTabs } from "../EditionTab";

export default function CreateEventForm() {
  return (
    <div className="flex flex-col">
      <Breadcrumb label="Event Creation" backHref="/group/${groupId}" />
      <div className="mt-2 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-grow mb-4">
        <div className="p-5 md:px-1 lg:px-10 border-b border-slate-50">
          <h1 className="text-xl md:text-2xl lg:text-3xl text-secondary font-bold">
            Edition Form
          </h1>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-1">
            Fill in the details below to publish your next conference or
            workshop.
          </p>
          <EditionTabs />
        </div>
        <div className="p-5 md:px-1 lg:px-10 space-y-6 md:space-y-8 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-5 md:gap-y-6">
            <FormInput
              label="Event title"
              icon={FileText}
              placeholder="Please input the event title"
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
          <FormInput
            label="Price"
            icon={BadgeDollarSign}
            placeholder="0.00"
            type="number"
          />
          <FormInput
            label="Target goal ( Optional )"
            icon={BadgeDollarSign}
            placeholder="0.00"
            type="number"
          />
          <FormTextarea
            label="Description"
            placeholder="Describe the mission and scope of this event..."
          />
          <MediaUpload />
        </div>
      </div>
      <div className="p-2 flex flex-col sm:flex-row justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="order-2 sm:order-1 w-full sm:w-auto px-10 py-5 border-primary text-primary font-bold rounded-xl md:rounded-2xl hover:text-primary hover:border-primary transition-all active:scale-95 text-sm shadow-sm"
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="order-1 sm:order-2 w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-blue-900 transition-all shadow-md active:scale-95 text-sm"
        >
          Create
        </Button>
      </div>
    </div>
  );
}
