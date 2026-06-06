"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Link as LinkIcon,
  HelpCircle,
  Eye,
} from "lucide-react";

import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import MediaUpload from "../MediaUpload";
import { CreationTabs } from "../CreationTab";
import { FormTextarea } from "../FormTextarea";
import { Button } from "../../ui/button";
import { createAnnouncementAction } from "@/actions/post.action";
import {
  announcementPostSchema,
  AnnouncementPostFormValues,
} from "@/schemas/announcement-schema";
import { CreateAnnouncementPayload, PostMediaItem } from "@/types/post-types";
import { toast } from "sonner";

export default function CreateAnnouncementForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("groupId") || "";
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AnnouncementPostFormValues>({
    resolver: zodResolver(
      announcementPostSchema,
    ) as Resolver<AnnouncementPostFormValues>,
    defaultValues: {
      title: "",
      purpose: "",
      status: "draft",
      date: "",
      startTime: "",
      endTime: "",
      locationName: "",
      googleMapUrl: "",
      scheduleDate: "",
      description: "",
      media: [],
    },
  });

  const currentStatus = watch("status");

  function getCoordinatesFromGoogleMapsUrl(url: string) {
    const placeMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);

    if (placeMatch) {
      return {
        latitude: Number(placeMatch[1]),
        longitude: Number(placeMatch[2]),
      };
    }

    const viewportMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);

    if (viewportMatch) {
      return {
        latitude: Number(viewportMatch[1]),
        longitude: Number(viewportMatch[2]),
      };
    }

    return {
      latitude: 0,
      longitude: 0,
    };
  }

  const onSubmit = async (data: AnnouncementPostFormValues) => {
    setIsSubmitting(true);

    const startIso = new Date(`${data.date}T${data.startTime}`).toISOString();
    const endIso = new Date(`${data.date}T${data.endTime}`).toISOString();

    let scheduledIso: string | null = null;

    if (data.status === "draft") {
      scheduledIso = data.scheduleDate
        ? new Date(`${data.scheduleDate}T00:00:00`).toISOString()
        : new Date().toISOString();
    } else if (data.status === "active") {
      scheduledIso = null;
    }
    const coordinates = getCoordinatesFromGoogleMapsUrl(
      data.googleMapUrl || "",
    );

    const payload: CreateAnnouncementPayload = {
      title: data.title,
      content: data.description,
      purpose: data.purpose,
      eventStart: startIso,
      eventEnd: endIso,
      scheduledAt: scheduledIso,
      expiresAt: endIso,
      isPublished: data.status === "active",
      status: data.status,
      isPinned: false,
      location: {
        locationName: data.locationName,
        googleMapUrl: data.googleMapUrl || "https://maps.google.com",
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
      media: data.media.map((item) => ({
        filePath: item.filePath,
        isCover: item.isCover,
      })),
    };

    console.log(
      "DISPATCHING ANNOUNCEMENT PAYLOAD PRE-FLIGHT VERIFICATION:",
      JSON.stringify(payload, null, 2),
    );

    try {
      const result = await createAnnouncementAction(workspaceId, payload);

      if (result.ok) {
        toast.success("Announcement created successfully!");
        router.push(`/group/${workspaceId}`);
      } else {
        toast.error(`Creation failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert(
        "An unexpected processing failure occurred during operational post dispatching steps.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col min-w-full"
    >
      <Breadcrumb
        label="Announcement Creation"
        backHref={`/group/${workspaceId}`}
      />

      <div className="mt-2 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col grow mb-4">
        <div className="p-5 md:px-1 lg:px-10 border-b border-slate-50">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-secondary">
            Creation Form
          </h1>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-1">
            Fill in the details below to publish your next structural workspace
            announcement resource update.
          </p>

          <CreationTabs groupid={workspaceId} />
        </div>

        <div className="p-5 md:px-1 lg:px-10 space-y-6 md:space-y-8 grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-5 md:gap-y-6">
            <div>
              <FormInput
                label="Announcement title"
                icon={FileText}
                placeholder="Please input the announcement title"
                {...register("title")}
                isError={errors.title != null}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="Purpose"
                icon={HelpCircle}
                placeholder="E.g., General Announcement, Emergency, Notice"
                {...register("purpose")}
                isError={errors.purpose != null}
              />
              {errors.purpose && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.purpose.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[#27445D] font-bold text-xs md:text-sm flex items-center gap-2">
                <Eye size={16} className="text-[#497D74]" /> Status
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all text-gray-700 h-11"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>

            <div>
              <FormInput
                label="Scheduled Event Date"
                icon={Calendar}
                type="date"
                {...register("date")}
                isError={errors.date != null}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="Start Time"
                icon={Clock}
                type="time"
                {...register("startTime")}
                isError={errors.startTime != null}
              />
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="End Time"
                icon={Clock}
                type="time"
                {...register("endTime")}
                isError={errors.endTime != null}
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.endTime.message}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="Location"
                icon={MapPin}
                placeholder="Enter building name or physical address"
                {...register("locationName")}
                isError={errors.locationName != null}
              />
              {errors.locationName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.locationName.message}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="Google Maps URL ( Optional )"
                icon={LinkIcon}
                placeholder="http://maps.google.com/..."
                type="url"
                {...register("googleMapUrl")}
                isError={errors.googleMapUrl != null}
              />
              {errors.googleMapUrl && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.googleMapUrl.message}
                </p>
              )}
            </div>

            {currentStatus === "draft" && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <FormInput
                  label="Post Publish Date"
                  icon={Calendar}
                  type="date"
                  {...register("scheduleDate")}
                  isError={errors.scheduleDate != null}
                />
                {errors.scheduleDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.scheduleDate.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <FormTextarea
              label="Description"
              placeholder="Describe the mission and scope of this announcement..."
              {...register("description")}
              isError={errors.description != null}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              control={control}
              name="media"
              render={({ field }) => (
                <MediaUpload
                  value={field.value}
                  onChange={(mediaItems: PostMediaItem[]) => {
                    field.onChange(mediaItems);
                  }}
                  isCover={false}
                />
              )}
            />
            {errors.media && (
              <p className="text-red-500 text-xs mt-1">
                {errors.media.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-2 flex flex-col sm:flex-row justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push(`/group/${workspaceId}`)}
          className="order-2 sm:order-1 w-full sm:w-auto px-10 py-5 border-primary text-primary font-bold rounded-xl md:rounded-2xl hover:text-primary hover:border-primary transition-all active:scale-95 text-sm shadow-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="order-1 sm:order-2 w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-blue-900 transition-all shadow-md active:scale-95 text-sm"
        >
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
