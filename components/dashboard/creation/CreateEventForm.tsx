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
  Building2,
} from "lucide-react";

import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import MediaUpload from "../MediaUpload";

import { Button } from "../../ui/button";
import { CreationTabs } from "../CreationTab";
import { FormTextarea } from "../FormTextarea";
import {
  createPostAction,
  publishDraftPostAction,
} from "@/actions/post.action";
import { eventPostSchema, EventPostFormValues } from "@/schemas/event-schema";
import { CreatePostPayload, CreatePostResponse } from "@/types/post-types";
import { getAllWorkspacesAction } from "@/actions/workspace.action";
import SearchableSelect, {
  SearchableSelectOption,
} from "@/components/site/event/SearchableSelect";

export default function CreateEventForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [select, setSelect] = useState(false);
  const [isFlexible, setIsFlexible] = useState(false);

  const urlWorkspaceId = params.get("groupId") || "";
  const isAdmin = params.get("admin") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workspaces, setWorkspaces] = useState<SearchableSelectOption[]>([]);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false);

  const {
    register,
    handleSubmit,
    control,
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
      workspaceId: "",
    },
  });

  const watchedWorkspaceId = useWatch({ control, name: "workspaceId" });

  const activeWorkspaceId: string = (urlWorkspaceId ||
    watchedWorkspaceId) as string;

  useEffect(() => {
    async function loadWorkspaces() {
      if (urlWorkspaceId) return;

      setIsLoadingWorkspaces(true);
      try {
        const res = await getAllWorkspacesAction();
        if (Array.isArray(res)) {
          const formatted: SearchableSelectOption[] = res.map((ws: any) => ({
            id: ws.id || ws.workspaceId,
            label: ws.label || ws.name || ws.title || "Unnamed Workspace",
          }));

          formatted.sort((a, b) =>
            a.label.localeCompare(b.label, undefined, {
              numeric: true,
              sensitivity: "base",
            }),
          );

          setWorkspaces(formatted);
        }
      } catch (err) {
        console.error("Failed to load user operational workspaces:", err);
        toast.error("Could not load your workspace parameters.");
      } finally {
        setIsLoadingWorkspaces(false);
      }
    }

    loadWorkspaces();
  }, [urlWorkspaceId]);

  const watchedStatus = useWatch({
    control,
    name: "status",
    defaultValue: "draft",
  });

  const onSubmit = async (data: EventPostFormValues) => {
    if (data.paymentType === "flexible" && !Number(data.targetGoal)) {
      setIsFlexible(true);
      return;
    } else {
      setIsFlexible(false);
    }

    if (!urlWorkspaceId && !data.workspaceId) {
      toast.error("Please select a target workspace destination group!");
      setSelect(true);
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

    const payload: CreatePostPayload = {
      title: data.title.trim(),
      content: data.description.trim(),
      purpose: data.purpose.trim() || "Community Event",
      eventStart: startIso,
      eventEnd: endIso,
      scheduledAt: data.status === "active" ? null : scheduledIso,
      expiresAt: endIso,
      isPublished: data.status === "active",
      status: data.status,
      isPinned: false,
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

    try {
      const result = await createPostAction(activeWorkspaceId, payload);
      if (result.ok) {
        const generatedPostId = result.payload?.payload?.postId;

        if (data.status === "active" && generatedPostId) {
          await publishDraftPostAction(activeWorkspaceId, generatedPostId);
        }

        toast.success(
          data.status === "active"
            ? "Event created and published successfully!"
            : "Event draft saved successfully!",
        );
        if (isAdmin) {
          router.push(`/event-management`);
        } else {
          router.push(`/group/${activeWorkspaceId}`);
        }
      } else {
        toast.error(`Creation failed: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected runtime error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <Breadcrumb
        label="Event Creation"
        backHref={`/group/${activeWorkspaceId || ""}`}
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
          <CreationTabs groupid={activeWorkspaceId || ""} />
        </div>

        <div className="p-5 md:px-1 lg:px-10 space-y-6 md:space-y-8 grow">
          {!urlWorkspaceId && (
            <div className="border-slate-200/60 rounded-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-300 ">
              <label className="flex items-center gap-2 mb-2 tracking-wide text-subtitle font-bold text-sm text-secondary md:text-base lg:text-lg">
                Target Workspace Destination
                <span className="text-red-500">*</span>
              </label>
              {isLoadingWorkspaces ? (
                <div className="text-xs text-slate-500 font-medium animate-pulse py-2">
                  Querying workspace directories...
                </div>
              ) : (
                <Controller
                  control={control}
                  name="workspaceId"
                  rules={{
                    required: "Workspace target group selection is required",
                  }}
                  render={({ field }) => (
                    <SearchableSelect
                      options={workspaces}
                      value={field.value}
                      placeholder="Choose your workspace target..."
                      icon={<Building2 size={18} />}
                      error={select}
                      onChange={(value) => {
                        field.onChange(value);
                        if (value) setSelect(false);
                      }}
                    />
                  )}
                />
              )}
              {select === true && (
                <p className="text-red-500 text-xs mt-1">
                  Please select a target workspace destination group!
                </p>
              )}
            </div>
          )}

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
                placeholder="e.g. Community Seminar, Networking Conference"
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

            <div className="flex flex-col gap-1.5 w-full">
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
                  Target goal is require with Flexible paymentType
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-subtitle font-bold text-sm text-secondary md:text-base lg:text-lg">
              Payment Type
            </label>
            <select
              {...register("paymentType")}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all text-gray-700 h-11"
            >
              <option value="fixed">Fixed</option>
              <option value="flexible">Flexible</option>
            </select>
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
          onClick={() => router.push(`/group/${activeWorkspaceId}`)}
          className="order-2 sm:order-1 w-full hover:bg-transparent sm:w-auto px-10 py-5 border-primary text-primary font-bold rounded-xl md:rounded-2xl active:scale-95 text-sm shadow-sm"
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
