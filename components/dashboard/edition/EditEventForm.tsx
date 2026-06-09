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
  BadgeDollarSign,
  Link as LinkIcon,
  Target,
  Pin,
} from "lucide-react";

import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import MediaUpload from "../MediaUpload";
import { Button } from "../../ui/button";
import { EditionTabs } from "../EditionTab";
import { FormTextarea } from "../FormTextarea";
import {
  publishDraftPostAction,
  updatePostAction,
} from "@/actions/post.action";
import { eventPostSchema, EventPostFormValues } from "@/schemas/event-schema";
import { UpdateEventPayload } from "@/types/post-types";
import { useWorkspacePosts } from "@/hooks/use-workspace-posts";

export default function EditEventForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("groupId") || "";
  const postId = searchParams.get("postId") || "";
  const isAdmin = searchParams.get("admin");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFlexible, setIsFlexible] = useState(false);
  const { posts, isLoading: postsLoading } = useWorkspacePosts(workspaceId);

  const event = posts?.find((e) => e.postId === postId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EventPostFormValues>({
    resolver: zodResolver(eventPostSchema) as Resolver<EventPostFormValues>,
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
      paymentType: "fixed",
      price: 0,
      targetGoal: 0,
      description: "",
      media: [],
    },
  });

  const watchedStatus = useWatch({
    control,
    name: "status",
    defaultValue: "draft",
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
    if (event) {
      reset({
        title: event.title || "",
        purpose: event.purpose || "",
        date: formatDateForInput(event.expiresAt || event.createdAt),
        startTime: formatTimeForInput(event.eventStart),
        endTime: formatTimeForInput(event.eventEnd),
        locationName: event.location?.locationName || "",
        googleMapUrl: event.location?.googleMapUrl || "",
        status:
          event.status === "active" || event.status === "draft"
            ? event.status
            : "draft",
        scheduleDate: event.scheduledAt
          ? formatDateForInput(event.scheduledAt)
          : "",
        isPinned: event.pinned ?? false,
        paymentType: event.payment?.paymentType || "fixed",
        price: event.payment?.paymentAmount || 0,
        targetGoal: event.payment?.donationGoal || 0,
        description: event.content || "",
        media:
          event.media?.map((m: { filePath: string; isCover: boolean }) => ({
            filePath: m.filePath,
            isCover: m.isCover || false,
          })) || [],
      } as EventPostFormValues);
    }
  }, [event, reset]);

  const onSubmit = async (data: EventPostFormValues) => {
    if (data.paymentType === "flexible" && !Number(data.targetGoal)) {
      setIsFlexible(true);
      return;
    } else {
      setIsFlexible(false);
    }

    if (!workspaceId || !postId) {
      toast.error("Error: Workspace or Event missing identifier paths.");
      return;
    }

    const startIso = new Date(`${data.date}T${data.startTime}`).toISOString();
    const endIso = new Date(`${data.date}T${data.endTime}`).toISOString();

    let scheduledIso: string | null = null;
    if (data.status === "draft" && data.scheduleDate) {
      scheduledIso = new Date(`${data.scheduleDate}T00:00:00`).toISOString();
    } else {
      scheduledIso = new Date().toISOString();
    }

    setIsSubmitting(true);

    const payload: UpdateEventPayload = {
      title: data.title.trim(),
      content: data.description.trim(),
      purpose: data.purpose.trim() || "Community Event",
      eventStart: startIso,
      eventEnd: endIso,
      scheduledAt: data.status === "active" ? null : scheduledIso,
      expiresAt: endIso,
      isPublished: data.status === "active",
      status: data.status as "draft" | "active" | "closed",
      isPinned: data.isPinned,
      location: {
        locationName: data.locationName,
        googleMapUrl: data.googleMapUrl,
      },
      media: data.media,
      payment: {
        paymentType: data.paymentType,
        paymentAmount: Number(data.price),
        donationGoal: Number(data.targetGoal) || 0,
      },
    };
    console.log(
      "MATCHED SWAGGER ARTICLE PAYLOAD:",
      JSON.stringify(payload, null, 2),
    );
    try {
      const result = await updatePostAction(workspaceId, postId, payload);

      if (result.ok) {
        if (data.status === "active") {
          await publishDraftPostAction(workspaceId, postId);
        }

        toast.success(
          data.status === "active"
            ? "Event updated and published successfully!"
            : "Event changes saved as draft successfully!",
        );
        if (isAdmin) {
          router.push(`/event-management`);
        } else {
          router.push(`/group/${workspaceId}`);
        }
      } else {
        if (result.errors) {
          result.errors.forEach((err) => toast.error(err.message));
        } else {
          toast.error(`Update failed: ${result.error}`);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred during execution routines.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedIsPinned = useWatch({
    control,
    name: "isPinned",
    defaultValue: false,
  });

  if (postsLoading) {
    return (
      <div className="flex items-center justify-center min-h-100 text-slate-500 font-medium">
        Loading target event parameters context...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <Breadcrumb label="Event Edition" backHref={`/group/${workspaceId}`} />

      <div className="mt-2 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col grow mb-4">
        <div className="p-5 md:px-1 lg:px-10 border-b border-slate-50">
          <h1 className="text-xl md:text-2xl lg:text-3xl text-secondary font-bold">
            Edition Form
          </h1>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-1">
            Modify the parameters below to update your conference or workshop.
          </p>
          <EditionTabs
            category={event?.category}
            groupId={workspaceId}
            postId={postId}
          />
        </div>

        <div className="p-5 md:px-1 lg:px-10 space-y-6 md:space-y-8 grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-5 md:gap-y-6">
            <div>
              <FormInput
                label="Event title"
                icon={FileText}
                placeholder="Please input the event title"
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
                label="Event Purpose"
                icon={Target}
                placeholder="e.g. Community Seminar"
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
                label="Location Name"
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
              <label className="text-subtitle font-bold text-sm text-secondary md:text-base lg:text-lg">
                Visibility Status
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all text-gray-700 h-11"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>

            {watchedStatus === "draft" && (
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-5">
            <div>
              <FormInput
                label="Price"
                icon={BadgeDollarSign}
                placeholder="0.00"
                type="number"
                step="0.01"
                min={0}
                {...register("price")}
                isError={errors.price != null}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="Target goal ( Optional )"
                icon={BadgeDollarSign}
                placeholder="0.00"
                type="number"
                min={0}
                step="0.01"
                {...register("targetGoal")}
                isError={isFlexible}
              />
              {isFlexible && (
                <p className="text-red-500 text-xs mt-1">
                  Target goal is required with Flexible paymentType
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full text-sm">
            <label className="text-subtitle font-bold text-sm text-secondary md:text-base lg:text-lg">
              Payment Type
            </label>
            <select
              {...register("paymentType")}
              onChange={() => setIsFlexible(false)}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all text-gray-700 h-11"
            >
              <option value="fixed">Fixed</option>
              <option value="flexible">Flexible</option>
            </select>
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
                    Pin this event
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
              placeholder="Describe the mission and scope of this event..."
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
                isCover={true}
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
          className="order-2 sm:order-1 w-full sm:w-auto px-10 py-5 border-primary text-primary font-bold rounded-xl md:rounded-2xl active:scale-95 text-sm shadow-sm"
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
