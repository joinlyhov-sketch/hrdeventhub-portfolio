"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle, Lock } from "lucide-react";
import { Button } from "../../ui/button";
import PollHeader from "../survey/PollHeader";
import PollOptionsList from "./creation/PollOptionsList";
import PollSidebar, { PollSettings } from "./creation/PollSidebar";
import WorkspaceSelector from "../survey/WorkspaceSelector";
import {
  createPollAction,
  updatePollAction,
} from "../../../actions/poll.action";
import { Poll } from "@/types/poll";
import { NavigationGuard } from "@/components/dashboard/NavigationGuard";
import { mutate as globalMutate } from "swr";
import { toast } from "sonner";

interface PollFormProps {
  workspaceId?: string;
  onSuccess?: () => void;
  initialData?: Poll;
  pollId?: string;
}

export default function PollForm({
  workspaceId,
  onSuccess,
  initialData,
  pollId,
}: PollFormProps) {
  const isEditMode = !!pollId && !!initialData;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [lockedOptions] = useState<Array<{ id: string; text: string }>>(
    isEditMode
      ? (initialData?.options ?? []).map((o) => ({ id: o.id, text: o.text }))
      : [],
  );
  const [newOptions, setNewOptions] = useState<string[]>(
    isEditMode ? [] : ["Option 1", "Option 2", "Option 3"],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const safeTextRegex = /^[a-zA-Z0-9\s.,!?()\-–—']+$/;
  const SPECIAL_CHAR_ERROR = "Special characters are not allowed.";
  const [workspaceIdState, setWorkspaceIdState] = useState(
    initialData?.workspaceId ?? workspaceId ?? "",
  );
  const [settings, setSettings] = useState<PollSettings>(() => {
    if (initialData) {
      const dt = initialData.closingTime
        ? new Date(initialData.closingTime)
            .toISOString()
            .slice(0, 16)
            .split("T")
        : ["", ""];
      return {
        multipleSelect: initialData.multiSelect ?? false,
        anonymousVote: initialData.anonymousVoting ?? false,
        addOption: initialData.allowAddOptions ?? false,
        hiddenPoll: initialData.hiddenPoll ?? false,
        showResult: initialData.showResult ?? "after_vote",
        closingDate: dt[0],
        closingTime: dt[1] ?? "",
      };
    }
    return {
      multipleSelect: false,
      anonymousVote: false,
      addOption: false,
      hiddenPoll: false,
      showResult: "after_vote",
      closingDate: "",
      closingTime: "",
    };
  });
  const handleTitleChange = (value: string) => {
    if (value === "" || safeTextRegex.test(value)) {
      setTitle(value);
      setError(null);
    } else {
      setError(SPECIAL_CHAR_ERROR);
    }
  };

  useEffect(() => {
    if (isEditMode) return;
    const urlQueryId =
      searchParams.get("groupId") || searchParams.get("groupid");
    const resolvedId = urlQueryId || workspaceId;
    if (resolvedId) queueMicrotask(() => setWorkspaceIdState(resolvedId));
  }, [searchParams, workspaceId, isEditMode]);

  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    if (success) {
      setIsFormDirty(false);
      return;
    }

    if (isEditMode && initialData) {
      const dt = initialData.closingTime
        ? new Date(initialData.closingTime)
            .toISOString()
            .slice(0, 16)
            .split("T")
        : ["", ""];
      const isChanged =
        title !== (initialData.title ?? "") ||
        description !== (initialData.description ?? "") ||
        newOptions.length > 0 ||
        settings.multipleSelect !== (initialData.multiSelect ?? false) ||
        settings.anonymousVote !== (initialData.anonymousVoting ?? false) ||
        settings.addOption !== (initialData.allowAddOptions ?? false) ||
        settings.hiddenPoll !== (initialData.hiddenPoll ?? false) ||
        settings.showResult !== (initialData.showResult ?? "after_vote") ||
        settings.closingDate !== dt[0] ||
        settings.closingTime !== (dt[1] ?? "");

      setIsFormDirty(isChanged);
    } else {
      const isChanged =
        title !== "" ||
        description !== "" ||
        JSON.stringify(newOptions) !==
          JSON.stringify(["Option 1", "Option 2", "Option 3"]) ||
        settings.multipleSelect !== false ||
        settings.anonymousVote !== false ||
        settings.addOption !== false ||
        settings.hiddenPoll !== false ||
        settings.showResult !== "after_vote" ||
        settings.closingDate !== "" ||
        settings.closingTime !== "";

      setIsFormDirty(isChanged);
    }
  }, [
    title,
    description,
    newOptions,
    settings,
    isEditMode,
    initialData,
    success,
  ]);

  const handleNewOptionChange = (index: number, text: string) => {
    const updated = [...newOptions];
    updated[index] = text;
    setNewOptions(updated);
    setError(null);
  };

  const handleAddOption = () => {
    setNewOptions([
      ...newOptions,
      `Option ${lockedOptions.length + newOptions.length + 1}`,
    ]);
    setError(null);
  };

  const handleRemoveNewOption = (index: number) => {
    const minNewOptions = isEditMode ? 0 : 2;
    if (newOptions.length > minNewOptions) {
      setNewOptions(newOptions.filter((_, i) => i !== index));
      setError(null);
    }
  };

  const handleSettingsChange = (newSettings: PollSettings) => {
    setSettings(newSettings);
    setError(null);
  };

  const handleClosingDateTimeChange = (dateTimeString: string) => {
    if (!dateTimeString) {
      setSettings((prev) => ({ ...prev, closingDate: "", closingTime: "" }));
      return;
    }
    const [date, time] = dateTimeString.split("T");
    setSettings((prev) => ({
      ...prev,
      closingDate: date || "",
      closingTime: time || "",
    }));
    setError(null);
  };

  const combinedClosingDateTime =
    settings.closingDate && settings.closingTime
      ? `${settings.closingDate}T${settings.closingTime}`
      : "";

  const validateForm = (): boolean => {
    if (!title?.trim()) {
      setError("Poll title is required");
      return false;
    }
    if (!safeTextRegex.test(title)) {
      setError(SPECIAL_CHAR_ERROR);
      return false;
    }

    const totalOptions = lockedOptions.length + newOptions.length;
    if (totalOptions < 2) {
      setError("Poll must have at least 2 options");
      return false;
    }
    if (newOptions.some((opt) => !opt?.trim())) {
      setError("All new options must have text");
      return false;
    }

    if (!workspaceIdState) {
      setError("Workspace is required");
      return false;
    }
    return true;
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updatePollAction(pollId, {
          title: title.trim(),
          description: description.trim(),
          closingTime:
            settings.closingDate && settings.closingTime
              ? new Date(
                  `${settings.closingDate}T${settings.closingTime}`,
                ).toISOString()
              : (null as any),
          workspaceId: workspaceIdState,
          type: "text",
          multiSelect: settings.multipleSelect,
          anonymousVoting: settings.anonymousVote,
          allowAddOptions: settings.addOption,
          hiddenPoll: settings.hiddenPoll,
          showResult: settings.showResult,
          options: lockedOptions.map((o) => o.text),
          newOptionTexts: newOptions.map((o) => o.trim()).filter(Boolean),
        });
        toast.success("Updated poll successfully!");
      } else {
        await createPollAction({
          title: title.trim(),
          description: description.trim(),
          options: newOptions.map((o) => o.trim()),
          closingTime:
            settings.closingDate && settings.closingTime
              ? new Date(
                  `${settings.closingDate}T${settings.closingTime}`,
                ).toISOString()
              : (null as any),
          workspaceId: workspaceIdState,
          type: "text",
          multiSelect: settings.multipleSelect,
          anonymousVoting: settings.anonymousVote,
          allowAddOptions: settings.addOption,
          hiddenPoll: settings.hiddenPoll,
          showResult: settings.showResult,
        });
        toast.success("Created poll successfully!");
      }

      const savedWorkspaceId = workspaceIdState;
      setSuccess(true);

      if (!isEditMode) {
        setTitle("");
        setDescription("");
        setNewOptions(["Option 1", "Option 2", "Option 3"]);
      }

      setTimeout(() => {
        globalMutate(
          (key: string | string[]) =>
            typeof key === "string" &&
            key.startsWith(`/workspaces/${savedWorkspaceId}/feed`),
          undefined,
          { revalidate: true },
        );
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/group/${savedWorkspaceId}`);
        }
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${isEditMode ? "update" : "create"} poll`,
      );
      setIsSubmitting(false);
    }
  };

  const isWorkspaceContextLocked =
    isEditMode ||
    !!searchParams.get("groupId") ||
    !!searchParams.get("groupid") ||
    !!workspaceId;

  return (
    <form
      onSubmit={handleFormSubmission}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start"
    >
      <NavigationGuard isDirty={isFormDirty} />
      <div className="lg:col-span-9 p-4 sm:p-6 lg:p-8 w-full mx-auto flex flex-col justify-between order-1">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2">
            <div />
            <Button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full sm:w-auto px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 min-w-30"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {success
                ? isEditMode
                  ? "Poll Updated!"
                  : "Poll Created!"
                : isSubmitting
                  ? isEditMode
                    ? "Saving..."
                    : "Posting..."
                  : isEditMode
                    ? "Save Changes"
                    : "Post Poll"}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle size={18} className="text-green-600 shrink-0" />
              <p className="text-sm text-green-700">
                {isEditMode
                  ? "Poll updated successfully!"
                  : "Poll created successfully! Redirecting..."}
              </p>
            </div>
          )}

          <PollHeader
            title={title}
            setTitle={handleTitleChange}
            description={description}
            setDescription={setDescription}
            closingTime={combinedClosingDateTime}
            setClosingTime={handleClosingDateTimeChange}
          />

          <WorkspaceSelector
            selectedWorkspaceId={workspaceIdState}
            onSelectWorkspace={setWorkspaceIdState}
            required={true}
            disabled={isWorkspaceContextLocked}
          />

          <div className="space-y-3">
            {isEditMode && lockedOptions.length > 0 && (
              <div className="space-y-2">
                {lockedOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-grey-100 bg-grey-50 opacity-70 select-none"
                    title="Existing options cannot be edited"
                  >
                    <Lock size={14} className="text-grey-400 shrink-0" />
                    <span className="text-sm text-foreground flex-1">
                      {opt.text}
                    </span>
                    <span className="text-xs text-grey-400 italic">locked</span>
                  </div>
                ))}
              </div>
            )}

            <PollOptionsList
              options={newOptions}
              onOptionChange={handleNewOptionChange}
              onAddOption={handleAddOption}
              onRemoveOption={handleRemoveNewOption}
              allowAdd={!isEditMode || settings.addOption}
            />

            {isEditMode && (
              <p className="text-xs text-grey-400 mt-1">
                Existing options are locked. You can only add new options.
              </p>
            )}
          </div>
        </div>
      </div>

      <aside className="lg:col-span-3 order-2 lg:order-5 w-full lg:sticky lg:top-24 p-4 flex justify-end">
        <PollSidebar
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      </aside>
    </form>
  );
}
