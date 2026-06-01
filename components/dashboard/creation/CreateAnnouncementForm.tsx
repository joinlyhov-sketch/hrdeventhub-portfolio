// "use client";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   FileText,
// } from "lucide-react";
// import { Breadcrumb } from "../BreadCrumb";
// import { FormInput } from "../FormInput";
// import MediaUpload from "../MediaUpload";
// import { CreationTabs } from "../CreationTab";
// import { FormTextarea } from "../FormTextarea";
// import { Button } from "../../ui/button";

// export default function CreateAnnouncementForm() {
//   return (
//     <div className="flex flex-col min-w-full">
//       <Breadcrumb label="Announcement Creation" backHref="/group/${groupId}" />
//       <div className="mt-2 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-grow mb-4">
//         <div className="p-5 md:px-1 lg:px-10 border-b border-slate-50">
//           <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-secondary">
//             Creation Form
//           </h1>
//           <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-1">
//             Fill in the details below to publish your next conference or
//             workshop.
//           </p>

//           <CreationTabs />
//         </div>
//         <div className="p-5 md:px-1 lg:px-10 space-y-6 md:space-y-8 flex-grow">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-5 md:gap-y-6">
//             <FormInput
//               label="Announcement title"
//               icon={FileText}
//               placeholder="Please input the announcement title"
//             />
//             <FormInput
//               label="Date"
//               icon={Calendar}
//               placeholder="Date"
//               type="date"
//             />
//             <FormInput
//               label="Start Time"
//               icon={Clock}
//               placeholder="--:-- --"
//               type="time"
//             />
//             <FormInput
//               label="End Time"
//               icon={Clock}
//               placeholder="--:-- --"
//               type="time"
//             />
//             <FormInput
//               label="Location"
//               icon={MapPin}
//               placeholder="Enter address"
//             />
//             <FormInput
//               label="Schedule"
//               icon={Calendar}
//               placeholder="yyyy/mm/dd"
//               type="date"
//             />
//           </div>
//           <FormTextarea
//             label="Description"
//             placeholder="Describe the mission and scope of this announcement..."
//           />
//           <MediaUpload />
//         </div>
//       </div>
//       <div className="p-2 flex flex-col sm:flex-row justify-end gap-3">
//         <Button
//           type="button"
//           variant="outline"
//           className="order-2 sm:order-1 w-full sm:w-auto px-10 py-5 border-primary text-primary font-bold rounded-xl md:rounded-2xl hover:text-primary hover:border-primary transition-all active:scale-95 text-sm shadow-sm"
//         >
//           Cancel
//         </Button>
//         <Button
//           type="button"
//           className="order-1 sm:order-2 w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-blue-900 transition-all shadow-md active:scale-95 text-sm"
//         >
//           Create
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import MediaUpload from "../MediaUpload";
import { CreationTabs } from "../CreationTab";
import { FormTextarea } from "../FormTextarea";
import { Button } from "../../ui/button";
import { createPostAction } from "@/actions/post.action";
import {
  announcementPostSchema,
  AnnouncementPostFormValues,
} from "@/schemas/announcement-schema";
import { CreatePostPayload } from "@/types/post-types";

export default function CreateAnnouncementForm() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Dynamically pull dynamic workspace grouping elements
  const workspaceId =
    (params?.groupId as string) || "c2b71064-bb4d-409d-a94b-0fc731067426";
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatically determine category based on active path
  let computedCategory: "event" | "announcement" | "article" = "announcement";
  if (pathname?.endsWith("/event")) computedCategory = "event";
  if (pathname?.endsWith("/article")) computedCategory = "article";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AnnouncementPostFormValues>({
    resolver: zodResolver(announcementPostSchema),
    defaultValues: {
      title: "",
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

  const onSubmit = async (data: AnnouncementPostFormValues) => {
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
      purpose: "General Announcement",
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
        paymentAmount: 0, // Announcements carry zero financial overhead structures
        donationGoal: 0,
      },
    };

    try {
      const result = await createPostAction(workspaceId, payload, token);

      if (result.ok) {
        alert(`${computedCategory.toUpperCase()} created successfully!`);
        router.push(`/group/${workspaceId}`);
      } else {
        alert(`Creation failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Submission failed:", err);
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

      <div className="mt-2 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-grow mb-4">
        <div className="p-5 md:px-1 lg:px-10 border-b border-slate-50">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-secondary">
            Creation Form
          </h1>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-1">
            Fill in the details below to publish your next conference or
            workshop.
          </p>

          <CreationTabs />
        </div>

        <div className="p-5 md:px-1 lg:px-10 space-y-6 md:space-y-8 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-5 md:gap-y-6">
            <div>
              <FormInput
                label="Announcement title"
                icon={FileText}
                placeholder="Please input the announcement title"
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
                label="Location"
                icon={MapPin}
                placeholder="Enter address"
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
                label="Google Maps URL ( Optional )"
                icon={LinkIcon}
                placeholder="http://maps.google.com/..."
                type="url"
                {...register("googleMapUrl")}
              />
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
            <FormTextarea
              label="Description"
              placeholder="Describe the mission and scope of this announcement..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Connected working Media Controller Tracking */}
          <Controller
            control={control}
            name="media"
            render={({ field }) => (
              <MediaUpload
                onAttachmentsChange={(mediaItems) => {
                  const mappedMedia = mediaItems.map((img, idx) => ({
                    fileName: img.fileName,
                    filePath: img.fileName, // Working configuration value mapped to fileName string
                    fileType: "image",
                    isCover: idx === 0,
                  }));
                  field.onChange(mappedMedia);
                }}
              />
            )}
          />
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
