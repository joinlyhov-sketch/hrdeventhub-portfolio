"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FileText, Pin } from "lucide-react";

import { Breadcrumb } from "../BreadCrumb";
import { FormInput } from "../FormInput";
import { Button } from "../../ui/button";
import { EditionTabs } from "../EditionTab";
import { FormTextarea } from "../FormTextarea";
import {
  articlePostSchema,
  ArticlePostFormValues,
} from "@/schemas/article-schema";
import { useWorkspacePosts } from "@/hooks/use-workspace-posts";
import { UpdateArticlePayload } from "@/types/post-types";
import {
  publishDraftPostAction,
  updateArticleAction,
} from "@/actions/post.action";

export default function EditArticleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("groupId") || "";
  const postId = searchParams.get("postId") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { posts, isLoading: postsLoading } = useWorkspacePosts(workspaceId);

  const article = posts?.find((p) => p.postId === postId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ArticlePostFormValues>({
    resolver: zodResolver(articlePostSchema) as Resolver<ArticlePostFormValues>,
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
      isPinned: false,
    },
  });

  const watchedIsPinned = useWatch({
    control,
    name: "isPinned",
    defaultValue: false,
  });

  useEffect(() => {
    if (article) {
      reset({
        title: article.title || "",
        description: article.content || "",
        status:
          article.status === "active" || article.status === "draft"
            ? article.status
            : "draft",
        isPinned: article.pinned ?? false,
      });
    }
  }, [article, reset]);

  const onSubmit = async (data: ArticlePostFormValues) => {
    if (!workspaceId || !postId) {
      toast.error("Error: Workspace or Article operational keys are missing.");
      return;
    }

    setIsSubmitting(true);

    const payload: UpdateArticlePayload = {
      title: data.title.trim(),
      content: data.description.trim(),
      isPublished: data.status === "active",
      status: data.status,
      isPinned: data.isPinned,
    };

    try {
      const result = await updateArticleAction(workspaceId, postId, payload);

      if (result.ok) {
        if (data.status === "active") {
          await publishDraftPostAction(workspaceId, postId);
        }
        toast.success(
          data.status === "active"
            ? "Article updated and published successfully!"
            : "Article changes saved as draft successfully!",
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
        "An unexpected error occurred during operation processing updates.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (postsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-medium">
        Loading targeted article contextual params...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <Breadcrumb label="Article Edition" backHref={`/group/${workspaceId}`} />

      <div className="mt-2 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col grow mb-4">
        <div className="p-5 md:px-1 lg:px-10 border-b border-slate-50">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-secondary">
            Edition Form
          </h1>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-1">
            Fill in the details below to update your workspace article instance
            information.
          </p>
          <EditionTabs
            category={article?.category}
            groupId={workspaceId}
            postId={postId}
          />
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
          </div>

          <div className="flex flex-col gap-1.5 w-full text-sm">
            <label className="text-subtitle font-bold text-sm text-secondary md:text-base lg:text-lg">
              Featured Display
            </label>
            <label
              className={`flex items-center justify-between p-4 bg-slate-50/60 rounded-xl border cursor-pointer transition-all duration-300 group select-none ${
                watchedIsPinned
                  ? "border-primary/40 bg-gradient-to-r from-blue-50/30 to-transparent ring-1 ring-primary/10 shadow-sm"
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
                    Pin this article
                  </span>
                  <span className="text-xs text-gray-500 font-medium mt-0.5 max-w-70 sm:max-w-md leading-relaxed">
                    Keep this article fixed at the very top of your workspace
                    community timeline dashboard.
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
