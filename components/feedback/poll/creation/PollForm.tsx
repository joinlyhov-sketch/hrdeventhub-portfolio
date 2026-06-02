"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Imported useSearchParams
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "../../../ui/button";
import PollHeader from "../../survey/PollHeader";
import PollOptionsList from "./PollOptionsList";
import PollSidebar, { PollSettings } from "./PollSidebar";
import WorkspaceSelector from "../../survey/WorkspaceSelector";
import { pollService } from "@/service/poll.service";

interface PollFormProps {
  workspaceId?: string; // Explicit contextual fallback prop
  onSuccess?: () => void;
}

export default function PollForm({ workspaceId, onSuccess }: PollFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // Read URL matrix values

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [workspaceIdState, setWorkspaceIdState] = useState("");
  const [settings, setSettings] = useState<PollSettings>({
    multipleSelect: false,
    anonymousVote: false,
    addOption: false,
    hiddenPoll: false,
    showResult: "afterVote",
    closingDate: "",
    closingTime: "",
  });

  // Syncing workspace contexts using exactly the same resolution chain as SurveyCreationForm
  useEffect(() => {
    const urlQueryId =
      searchParams.get("groupId") || searchParams.get("groupid");
    const resolvedId = urlQueryId || workspaceId;

    console.log("--- Syncing Poll Workspace Context ---");
    console.log("Final Resolved Workspace ID Target:", resolvedId);

    if (resolvedId) {
      setWorkspaceIdState(resolvedId);
    }
  }, [searchParams, workspaceId]);

  const handleOptionTextChange = (index: number, text: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = text;
    setOptions(updatedOptions);
    setError(null);
  };

  const handleAddOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
    setError(null);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
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
    if (!title || !title.trim()) {
      setError("Poll title is required");
      return false;
    }
    if (options.length < 2) {
      setError("Poll must have at least 2 options");
      return false;
    }
    if (options.some((opt) => !opt || !opt.trim())) {
      setError("All options must have text");
      return false;
    }
    if (!settings.closingDate || !settings.closingTime) {
      setError("Closing date and time are required");
      return false;
    }

    if (
      new Date(`${settings.closingDate}T${settings.closingTime}`) <= new Date()
    ) {
      setError("Closing date and time must be in the future");
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
      const request = {
        title: title.trim(),
        description: description.trim(),
        options: options.map((opt) => opt.trim()),
        closingTime: new Date(
          `${settings.closingDate}T${settings.closingTime}`,
        ).toISOString(),
        workspaceId: workspaceIdState,
        type: "text",
        multiSelect: settings.multipleSelect,
        anonymousVoting: settings.anonymousVote,
        allowAddOptions: settings.addOption,
        hiddenPoll: settings.hiddenPoll,
        showResult: settings.showResult,
      };

      await pollService.createPoll(request);

      const savedWorkspaceId = workspaceIdState;
      setSuccess(true);
      setTitle("");
      setDescription("");
      setOptions(["Option 1", "Option 2", "Option 3"]);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          // Dynamic router fallback tracking matched directly with Survey logic
          router.push(`/group/${savedWorkspaceId}`);
        }
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create poll");
      setIsSubmitting(false);
    }
  };

  // Condition toggle tracking exactly like Survey to toggle field locked presentation
  const isWorkspaceContextLocked =
    !!searchParams.get("groupId") ||
    !!searchParams.get("groupid") ||
    !!workspaceId;

  return (
    <form
      onSubmit={handleFormSubmission}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start"
    >
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
                ? "Poll Created!"
                : isSubmitting
                  ? "Posting..."
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
                Poll created successfully! Redirecting...
              </p>
            </div>
          )}

          <PollHeader
            title={title}
            setTitle={setTitle}
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

          <PollOptionsList
            options={options}
            onOptionChange={handleOptionTextChange}
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
          />
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
