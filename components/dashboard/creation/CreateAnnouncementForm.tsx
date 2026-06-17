"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Clock,
  MapPin,
  FileText,
  Link as LinkIcon,
  HelpCircle,
} from "lucide-react";

import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import MediaUpload from "../MediaUpload";
import { CreationTabs } from "../CreationTab";
import { FormTextarea } from "../FormTextarea";
import { Button } from "../../ui/button";
import {
  createAnnouncementAction,
  publishDraftPostAction,
} from "@/actions/post.action";
import {
  announcementPostSchema,
  AnnouncementPostFormValues,
} from "@/schemas/announcement-schema";
import { CreateAnnouncementPayload, PostMediaItem } from "@/types/post-types";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputDate } from "../InputDate";
import { NavigationGuard } from "../NavigationGuard";

export default function CreateAnnouncementForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("groupId") || "";
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
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

  const currentStatus = useWatch({ control, name: "status" });

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

    const payload: CreateAnnouncementPayload = {
      title: data.title,
      content: data.description,
      purpose: data.purpose,
      eventStart: startIso,
      eventEnd: endIso,
      scheduledAt: scheduledIso,
      expiresAt: endIso,
      isPublished: data.status === "active",
      status: "draft",
      isPinned: false,
      location: {
        locationName: data.locationName,
        googleMapUrl: data.googleMapUrl || "https://maps.google.com",
      },
      media: data.media.map((item) => ({
        filePath: item.filePath,
        isCover: item.isCover,
      })),
    };

    try {
      const result = await createAnnouncementAction(workspaceId, payload);

      if (result.ok) {
        const generatedPostId = result.payload?.payload.postId;

        if (data.status === "active" && generatedPostId) {
          const publishRes = await publishDraftPostAction(
            workspaceId,
            generatedPostId,
          );
          if (!publishRes.ok) {
            console.error("Failed to set active:", publishRes);
            toast.error(
              `Draft saved, but failed to change status to active: ${publishRes.error}`,
            );
            setIsSubmitting(false);
            return;
          }
        }

        toast.success(
          data.status === "active"
            ? "Announcement created and published successfully!"
            : "Announcement draft saved successfully!",
        );
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
  const handleCancel = () => {
    const fallbackUrl = `/group/${workspaceId}`;
    if (isDirty) {
      const customEvent = new CustomEvent("trigger-unsaved-guard", {
        detail: { fallbackUrl },
      });
      window.dispatchEvent(customEvent);
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col min-w-full"
    >
      <NavigationGuard isDirty={isDirty} />
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

            <div>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <>
                    <InputDate
                      label="Scheduled Event Date"
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
                {...register("googleMapUrl", {
                  onChange: (e) => {
                    const sanitized = e.target.value
                      .replace(/\\/g, "/")
                      .replace(/^(https?):\/+/, "$1://");
                    setValue("googleMapUrl", sanitized);
                  },
                })}
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
                <Controller
                  control={control}
                  name="scheduleDate"
                  render={({ field }) => (
                    <>
                      <InputDate
                        label="Post Publish Date"
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

          <div>
            <FormTextarea
              label="Description (Optional)"
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
          onClick={handleCancel}
          className="order-2 sm:order-1 w-full hover:bg-transparent sm:w-auto px-10 py-5 border-primary text-primary font-bold rounded-xl md:rounded-2xl hover:text-primary hover:border-primary transition-all active:scale-95 text-sm shadow-sm"
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
