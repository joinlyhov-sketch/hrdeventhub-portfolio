"use client";

import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  BadgeDollarSign,
  Link as LinkIcon,
} from "lucide-react";

import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import MediaUpload from "../MediaUpload";
import { Button } from "../../ui/button";
import { CreationTabs } from "../CreationTab";
import { FormTextarea } from "../FormTextarea";
import { createPostAction } from "@/actions/post.action";
import { eventPostSchema, EventPostFormValues } from "@/schemas/post-schema";
import { CreatePostPayload } from "@/types/post-types";
import { useSession } from "next-auth/react";

export default function CreateEventForm() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { data: session } = useSession();

  const workspaceId = "c2b71064-bb4d-409d-a94b-0fc731067426";
  const [isSubmitting, setIsSubmitting] = useState(false);

  let computedCategory: "event" | "announcement" | "article" = "event";
  if (pathname?.endsWith("/announcement")) computedCategory = "announcement";
  if (pathname?.endsWith("/article")) computedCategory = "article";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EventPostFormValues>({
    resolver: zodResolver(eventPostSchema) as Resolver<EventPostFormValues>,
    defaultValues: {
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      locationName: "",
      googleMapUrl: "",
      scheduleDate: "",
      price: 0,
      targetGoal: 0,
      description: "",
      media: [],
    },
  });

  const handleAttachmentsChange = (
    mediaItems: Array<{ fileName: string; fileUrl: string }>,
  ) => {
    const mappedMedia = mediaItems.map((img, idx) => ({
      fileName: img.fileName,
      filePath: img.fileUrl,
      fileType: "image",
      isCover: idx === 0,
    }));
    setValue("media", mappedMedia, { shouldValidate: true });
  };
  const onSubmit = async (data: EventPostFormValues) => {
    setIsSubmitting(true);

    const startIso = new Date(`${data.date}T${data.startTime}`).toISOString();
    const endIso = new Date(`${data.date}T${data.endTime}`).toISOString();
    const token = session?.accessToken;

    const scheduledIso = data.scheduleDate
      ? new Date(`${data.scheduleDate}T00:00:00`).toISOString()
      : new Date().toISOString();

    const payload: CreatePostPayload = {
      category: computedCategory,
      title: data.title,
      content: data.description,
      purpose: "Community Event",
      isPublished: true,
      scheduledAt: scheduledIso,
      status: "draft",
      isPinned: false,
      expiresAt: endIso,
      eventStart: startIso,
      eventEnd: endIso,
      location: {
        locationName: data.locationName,
        googleMapUrl: data.googleMapUrl || "https://maps.google.com",
        latitude: 0,
        longitude: 0,
      },
      media: data.media,
      payment: {
        paymentAmount: data.price,
        donationGoal: data.targetGoal || 0,
      },
    };

    console.log(
      "FINAL OUTGOING PAYLOAD SENDING TO BACKEND SERVER:",
      JSON.stringify(payload, null, 2),
    );

    try {
      const result = await createPostAction(workspaceId, payload, token);
      if (result.ok) {
        alert(`${computedCategory.toUpperCase()} created successfully!`);
        router.push(`/group/${workspaceId}`);
      } else {
        alert(`Creation failed: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <Breadcrumb
        label="Event Creation"
        backHref={`/group/${workspaceId || ""}`}
      />

      <div className="mt-2 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col grow mb-4">
        <div className="p-5 md:px-1 lg:px-10 border-b border-slate-50">
          <h1 className="text-xl md:text-2xl lg:text-3xl text-secondary font-bold">
            Creation Form
          </h1>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-1">
            Fill in the details below to publish your next conference or
            workshop.
          </p>
          <CreationTabs />
        </div>

        <div className="p-5 md:px-1 lg:px-10 space-y-6 md:space-y-8 grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-5 md:gap-y-6">
            <div>
              <FormInput
                label="Event title"
                icon={FileText}
                placeholder="Please input the event title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="Date"
                icon={Calendar}
                type="date"
                {...register("date")}
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
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.endTime.message}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="Location Name"
                icon={MapPin}
                placeholder="Enter building name or physical address"
                {...register("locationName")}
              />
              {errors.locationName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.locationName.message}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="Google Maps URL"
                icon={LinkIcon}
                placeholder="https://maps.google.com/..."
                type="url"
                {...register("googleMapUrl")}
              />
              {errors.googleMapUrl && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.googleMapUrl.message}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="Schedule"
                icon={Calendar}
                type="date"
                {...register("scheduleDate")}
              />
            </div>
          </div>

          <div>
            <FormInput
              label="Price"
              icon={BadgeDollarSign}
              placeholder="0.00"
              type="number"
              step="0.01"
              {...register("price")}
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
              step="0.01"
              {...register("targetGoal")}
            />
            {errors.targetGoal && (
              <p className="text-red-500 text-xs mt-1">
                {errors.targetGoal.message}
              </p>
            )}
          </div>

          <div>
            <FormTextarea
              label="Description"
              placeholder="Describe the mission and scope of this event..."
              {...register("description")}
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
            render={() => (
              <MediaUpload onAttachmentsChange={handleAttachmentsChange} />
            )}
          />
        </div>
      </div>

      <div className="p-2 flex flex-col sm:flex-row justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push(`/group/${workspaceId || ""}`)}
          className="order-2 sm:order-1 w-full sm:w-auto px-10 py-5 border-primary text-primary font-bold rounded-xl md:rounded-2xl active:scale-95 text-sm shadow-sm"
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
