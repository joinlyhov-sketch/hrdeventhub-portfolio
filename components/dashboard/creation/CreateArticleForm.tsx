"use client";

import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { FileText } from "lucide-react";

import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import MediaUpload from "../MediaUpload";
import { CreationTabs } from "../CreationTab";
import { FormTextarea } from "../FormTextarea";
import { Button } from "../../ui/button";
import { createPostAction } from "@/actions/post.action";
import {
  articlePostSchema,
  ArticlePostFormValues,
} from "@/schemas/article-schema";
import { CreatePostPayload } from "@/types/post-types";

export default function CreateArticleForm() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { data: session } = useSession();

  const workspaceId =
    (params?.groupId as string) || "ce54713a-cb06-4efb-aa1a-3e583791fc7b";
  const [isSubmitting, setIsSubmitting] = useState(false);

  let computedCategory: "event" | "announcement" | "article" = "article";
  if (pathname?.endsWith("/event")) computedCategory = "event";
  if (pathname?.endsWith("/announcement")) computedCategory = "announcement";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ArticlePostFormValues>({
    resolver: zodResolver(articlePostSchema) as Resolver<ArticlePostFormValues>,
    defaultValues: {
      title: "",
      description: "",
      media: [],
    },
  });

  const onSubmit = async (data: ArticlePostFormValues) => {
    setIsSubmitting(true);

    const token = session?.accessToken;
    const currentIso = new Date().toISOString();

    const payload: CreatePostPayload = {
      category: computedCategory,
      title: data.title,
      content: data.description,
      purpose: "Community Content Sharing",
      isPublished: true,
      scheduledAt: currentIso,
      status: "draft",
      isPinned: false,
      expiresAt: currentIso,
      eventStart: currentIso,
      eventEnd: currentIso,
      location: {
        locationName: "Digital Article / Virtual",
        googleMapUrl: "https://maps.google.com",
        latitude: 0,
        longitude: 0,
      },
      media: data.media,
      payment: {
        paymentAmount: 0,
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <Breadcrumb label="Article Creation" backHref={`/group/${workspaceId}`} />

      <div className="mt-2 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col grow mb-4">
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

        <div className="p-5 md:px-1 lg:px-10 space-y-6 md:space-y-8 grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-5 md:gap-y-6">
            <div>
              <FormInput
                label="Article title"
                icon={FileText}
                placeholder="Please input the article title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <FormTextarea
              label="Description"
              placeholder="Describe the mission and scope of this article..."
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
            render={({ field }) => (
              <MediaUpload
                onAttachmentsChange={(mediaItems) => {
                  const mappedMedia = mediaItems.map((img, idx) => ({
                    fileName: img.fileName,
                    filePath: img.fileName,
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
