"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Target,
  Pin,
  Link as LinkIcon,
} from "lucide-react";

import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import MediaUpload from "../MediaUpload";
import { Button } from "../../ui/button";
import { EditionTabs } from "../EditionTab";
import { FormTextarea } from "../FormTextarea";
import {
  publishDraftPostAction,
  updateAnnouncementAction,
} from "@/actions/post.action";
import {
  announcementPostSchema,
  AnnouncementPostFormValues,
} from "@/schemas/announcement-schema";
import { UpdateEventPayload } from "@/types/post-types";
<<<<<<<<< Temporary merge branch 1
import { usePostDetail } from "@/hooks/use-post-detail";
import { useWorkspacePosts } from "@/hooks/use-workspace-posts";
import { InputDate } from "../InputDate";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
=========
import { usePostDetail } from "@/hooks/use-post-detail";
>>>>>>>>> Temporary merge branch 2

export default function EditAnnouncementForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("groupId") || "";
  const postId = searchParams.get("postId") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { post: posts, isLoading } = usePostDetail(workspaceId, postId);

  const announcement = posts;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AnnouncementPostFormValues>({
    resolver: zodResolver(
      announcementPostSchema,
    ) as Resolver<AnnouncementPostFormValues>,
    defaultValues: {
      title: "",
      purpose: "",
      date: "",
      startTime: "",
      endTime: "",
      locationName: "",
      googleMapUrl: "",
      status: "draft",
      scheduleDate: "",
      isPinned: false,
      description: "",
      media: [],
    },
  });

  const watchedStatus = useWatch({
    control,
    name: "status",
    defaultValue: "draft",
  });

  const watchedIsPinned = useWatch({
    control,
    name: "isPinned",
    defaultValue: false,
  });

  function formatDateForInput(dateString?: string): string {
    if (!dateString) return "";
    if (
      isNaN(Number(dateString)) &&
      typeof dateString === "string" &&
      !dateString.includes("T")
    ) {
      const parsedObj = new Date(dateString);
      if (!isNaN(parsedObj.getTime())) {
        const year = parsedObj.getFullYear();
        const month = String(parsedObj.getMonth() + 1).padStart(2, "0");
        const day = String(parsedObj.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    }
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return "";
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  }

  function formatTimeForInput(timeString?: string): string {
    if (!timeString) return "";
    if (timeString.includes("AM") || timeString.includes("PM")) {
      const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        const [_, hours, minutes, modifier] = match;
        let hoursNum = parseInt(hours, 10);
        if (modifier.toUpperCase() === "PM" && hoursNum < 12) hoursNum += 12;
        if (modifier.toUpperCase() === "AM" && hoursNum === 12) hoursNum = 0;
        return `${String(hoursNum).padStart(2, "0")}:${minutes}`;
      }
    }
    const dateObj = new Date(timeString);
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toTimeString().slice(0, 5);
  }

  useEffect(() => {
    if (announcement) {
      reset({
        title: announcement.title || "",
        purpose: announcement.purpose || "",
        date: formatDateForInput(
          announcement.expiresAt || announcement.createdAt,
        ),
        startTime: formatTimeForInput(announcement.eventStart),
        endTime: formatTimeForInput(announcement.eventEnd),
        locationName: announcement.location?.locationName || "",
        googleMapUrl: announcement.location?.googleMapUrl || "",
        status:
          announcement.status === "active" || announcement.status === "draft"
            ? announcement.status
            : "draft",
        scheduleDate: announcement.scheduledAt
          ? formatDateForInput(announcement.scheduledAt)
          : "",
        isPinned: announcement.pinned ?? false,
        description: announcement.content || "",
        media:
          announcement.media?.map(
            (m: { filePath: string; isCover: boolean }) => ({
              filePath: m.filePath,
              isCover: m.isCover || false,
            }),
          ) || [],
      });
    }
  }, [announcement, reset]);

  const onSubmit = async (data: AnnouncementPostFormValues) => {
    if (!workspaceId || !postId) {
      toast.error(
        "Error: Workspace or Announcement missing key identifier routes.",
      );
      return;
    }

    setIsSubmitting(true);

    const startIso = new Date(`${data.date}T${data.startTime}`).toISOString();
    const endIso = new Date(`${data.date}T${data.endTime}`).toISOString();

    let scheduledIso: string | null = null;
    if (data.status === "draft" && data.scheduleDate) {
      scheduledIso = new Date(`${data.scheduleDate}T00:00:00`).toISOString();
    } else {
      scheduledIso = new Date().toISOString();
    }

    const payload: UpdateEventPayload = {
      title: data.title.trim(),
      content: data.description.trim(),
      purpose: data.purpose?.trim() || "Community Announcement",
      eventStart: startIso,
      eventEnd: endIso,
      scheduledAt: data.status === "active" ? startIso : scheduledIso,
      expiresAt: endIso,
      isPublished: data.status === "active",
      status: data.status as "draft" | "active" | "closed",
      isPinned: data.isPinned,
      location: {
        locationName: data.locationName,
        googleMapUrl: data.googleMapUrl || "",
      },
      media: data.media,
      payment: {
        paymentAmount: 0,
        donationGoal: 0,
      },
    };

    try {
      const result = await updateAnnouncementAction(
        workspaceId,
        postId,
        payload,
      );
      if (result.ok) {
        if (data.status === "active") {
          await publishDraftPostAction(workspaceId, postId);
        }
        toast.success(
          data.status === "active"
            ? "Announcement updated and published successfully!"
            : "Announcement changes saved as draft successfully!",
        );
        router.push(`/group/${workspaceId}`);
      } else {
        if (result.errors) {
          result.errors.forEach((err) => {
            toast.error(err.message);
          });
        } else {
          toast.error(`Update failed: ${result.error}`);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "An unexpected error occurred during operation updating routines.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-medium">
        Loading target announcement parameters context...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <Breadcrumb
        label="Announcement Edition"
        backHref={`/group/${workspaceId}`}
      />

      <div className="mt-2 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col grow mb-4">
        <div className="p-5 md:px-1 lg:px-10 border-b border-slate-50">
          <h1 className="text-xl md:text-2xl lg:text-3xl text-secondary font-bold">
            Edition Form
          </h1>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-1">
            Modify the parameters below to update your announcement context
            details.
          </p>

          <EditionTabs
            category={announcement?.category}
            groupId={workspaceId}
            postId={postId}
          />
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
                label="Announcement Purpose"
                icon={Target}
                placeholder="e.g. Workshop Information"
                {...register("purpose")}
                isError={errors.purpose != null}
              />
              {errors.purpose && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.purpose.message}
                </p>
              )}
            </div>

            <div>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <>
                    <InputDate
                      label="Date"
                      value={field.value}
                      onChange={field.onChange}
                      isError={!!errors.date}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.date.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <FormInput
                label="Location"
                icon={MapPin}
                placeholder="Enter building address"
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
                label="Google Maps URL"
                icon={LinkIcon}
                placeholder="https://maps.google.com/..."
                type="text"
                {...register("googleMapUrl")}
                isError={errors.googleMapUrl != null}
              />
              {errors.googleMapUrl && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.googleMapUrl.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 w-full text-sm">
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5 w-full">
                    <Label className="text-subtitle font-bold text-sm text-secondary md:text-base lg:text-lg">
                      Visibility Status
                    </Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-11 px-4 py-5 bg-background border-input rounded-xl text-desc md:text-base focus:ring-1 focus:ring-primary focus:ring-offset-0">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        position="popper"
                        className="bg-white rounded-2xl shadow-xl border border-gray-100 px-2 py-2 z-50 text-left max-h-50 overflow-y-auto w-[var(--radix-select-trigger-width)] -mt-1"
                      >
                        <SelectItem
                          value="draft"
                          className="px-3 py-3 text-sm font-semibold rounded-md text-slate-800 hover:bg-grey-200 transition-colors cursor-pointer focus:bg-slate-50 "
                        >
                          Draft
                        </SelectItem>
                        <SelectItem
                          value="active"
                          className="px-3 py-3 text-sm font-semibold rounded-md text-slate-800 hover:bg-grey-200 transition-colors cursor-pointer focus:bg-slate-50 focus:text-slate-800"
                        >
                          Active
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </div>

            {watchedStatus === "draft" && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <Controller
                  control={control}
                  name="scheduleDate"
                  render={({ field }) => (
                    <>
                      <InputDate
                        label="Schedule Date"
                        value={field.value}
                        onChange={field.onChange}
                        isError={!!errors.date}
                      />
                      {errors.date && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.date.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 w-full text-sm">
            <label className="text-subtitle font-bold text-sm text-secondary md:text-base lg:text-lg">
              Featured Display
            </label>
            <label
              className={`flex items-center justify-between p-4 bg-slate-50/60 rounded-xl border cursor-pointer transition-all duration-300 group select-none ${
                watchedIsPinned
                  ? "border-primary/40 bg-linear-to-r from-blue-50/30 to-transparent ring-1 ring-primary/10 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                {...register("isPinned")}
                className="sr-only"
              />

              <div className="flex items-center gap-4">
                <div
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    watchedIsPinned
                      ? "bg-primary text-white shadow-sm shadow-primary/20 scale-105"
                      : "bg-slate-100 text-slate-400 group-hover:text-slate-500 group-hover:bg-slate-200"
                  }`}
                >
                  <Pin
                    size={18}
                    className={`transition-transform duration-300 ${
                      watchedIsPinned ? "rotate-45" : "group-hover:-rotate-12"
                    }`}
                  />
                </div>

                <div className="flex flex-col pr-2">
                  <span className="font-bold text-gray-800 text-sm tracking-tight transition-colors group-hover:text-gray-900">
                    Pin this announcement
                  </span>
                  <span className="text-xs text-gray-500 font-medium mt-0.5 max-w-70 sm:max-w-md leading-relaxed">
                    Keep this announcement fixed at the very top of your
                    workspace community board.
                  </span>
                </div>
              </div>

              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out shrink-0 ${
                  watchedIsPinned
                    ? "bg-primary"
                    : "bg-slate-200 group-hover:bg-slate-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                    watchedIsPinned ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
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

          <Controller
            control={control}
            name="media"
            render={({ field }) => (
              <MediaUpload
                value={field.value}
                onChange={field.onChange}
                isCover={false}
              />
            )}
          />
          {errors.media && (
            <p className="text-red-500 text-xs mt-1">{errors.media.message}</p>
          )}
        </div>
      </div>

      <div className="p-2 flex flex-col sm:flex-row justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push(`/group/${workspaceId}`)}
          className="order-2 sm:order-1 w-full hover:bg-transparent hover:text-primary sm:w-auto px-10 py-5 border-primary text-primary font-bold rounded-xl md:rounded-2xl active:scale-95 text-sm shadow-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="order-1 sm:order-2 w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-blue-900 transition-all shadow-md active:scale-95 text-sm"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
