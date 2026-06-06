"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Eye } from "lucide-react";

import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import { CreationTabs } from "../CreationTab";
import { FormTextarea } from "../FormTextarea";
import { Button } from "../../ui/button";
import { createArticleAction } from "@/actions/post.action";
import {
  articlePostSchema,
  ArticlePostFormValues,
} from "@/schemas/article-schema";
import { CreateArticlePayload } from "@/types/post-types";
import { toast } from "sonner";

export default function CreateArticleForm() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const workspaceId = searchParam.get("groupId") || "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticlePostFormValues>({
    resolver: zodResolver(articlePostSchema) as Resolver<ArticlePostFormValues>,
    defaultValues: {
      title: "",
      description: "",
      status: "active",
    },
  });

  const onSubmit = async (data: ArticlePostFormValues) => {
    setIsSubmitting(true);

    const payload: CreateArticlePayload = {
      title: data.title,
      content: data.description,
      status: data.status,
      isPublished: data.status === "active",
      isPinned: false,
    };

    console.log(
      "MATCHED SWAGGER ARTICLE PAYLOAD:",
      JSON.stringify(payload, null, 2),
    );

    try {
      const result = await createArticleAction(workspaceId, payload);

      if (result.ok) {
        toast.success("ARTICLE created successfully!");
        router.push(`/group/${workspaceId}`);
      } else {
        toast.error(`Creation failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert(
        "An unexpected operational error occurred processing your article creation submission.",
      );
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
            Fill in the details below to publish your next knowledge base
            article structure.
          </p>
          <CreationTabs groupid={workspaceId} />
        </div>

        <div className="p-5 md:px-1 lg:px-10 space-y-6 md:space-y-8 grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-5 md:gap-y-6">
            <div>
              <FormInput
                label="Article title"
                icon={FileText}
                placeholder="Please input the article title"
                {...register("title")}
                isError={errors.title != null}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
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
          </div>

          <div>
            <FormTextarea
              label="Description"
              placeholder="Describe the mission and scope of this article..."
              {...register("description")}
              isError={errors.description != null}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
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
