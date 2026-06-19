"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog-payments/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/comment-modal/textarea";
import { Button } from "@/components/ui/button";
import {
  X,
  PenLine,
  Link2,
  Settings2,
  Users2,
  ChevronDown,
} from "lucide-react";
import { useGenerations } from "@/hooks/use-generation";
import { createWorkspaceAction } from "@/actions/workspace.action";
import { mutate } from "swr";
import { z } from "zod";

const createGroupSchema = z
  .object({
    groupName: z.string().min(1, "Group name is required."),
    description: z.string().min(1, "Description is required."),
    groupType: z.enum(["internal", "external"]),
    selectedGenerationId: z.string(),
  })
  .refine(
    (data) => data.groupType === "external" || data.selectedGenerationId !== "",
    { message: "Please select a generation.", path: ["selectedGenerationId"] },
  );

type FormErrors = Partial<
  Record<"groupName" | "description" | "selectedGenerationId", string>
>;

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({
  isOpen,
  onClose,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = React.useState("");
  const [groupType, setGroupType] = React.useState<"internal" | "external">(
    "external",
  );
  const [selectedGenerationId, setSelectedGenerationId] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [telegramChannelUrl, setTelegramChannelUrl] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isOpenType, setIsOpenType] = React.useState(false);
  const [isOpenGen, setIsOpenGen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [errors, setErrors] = React.useState<FormErrors>({});

  const typeContainerRef = React.useRef<HTMLDivElement>(null);
  const genContainerRef = React.useRef<HTMLDivElement>(null);

  const { generations } = useGenerations();

  const filteredGenerations = React.useMemo(() => {
    const sorted = [...generations].sort((a, b) =>
      b.name.localeCompare(a.name, undefined, { numeric: true }),
    );
    if (!searchQuery.trim()) return sorted;
    return sorted.filter((g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [generations, searchQuery]);

  const selectedGeneration = generations.find(
    (g) => g.generationId === selectedGenerationId,
  );

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        typeContainerRef.current &&
        !typeContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpenType(false);
      }
      if (
        genContainerRef.current &&
        !genContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpenGen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetForm = () => {
    setGroupName("");
    setDescription("");
    setTelegramChannelUrl("");
    setGroupType("external");
    setSelectedGenerationId("");
    setSearchQuery("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    const result = createGroupSchema.safeParse({
      groupName,
      description,
      groupType,
      selectedGenerationId,
    });
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      setIsSubmitting(true);
      const payload = {
        name: groupName,
        description,
        isPublic: groupType === "external",
        generationId: groupType === "internal" ? selectedGenerationId : "",
        telegramChannelUrl,
      };
      await createWorkspaceAction(payload);
      await mutate((key) => Array.isArray(key) && key[0] === "workspaces");
      resetForm();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.toLowerCase().includes("already exists")) {
        setErrors((p) => ({
          ...p,
          groupName: "A group with this name already exists.",
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[720px]
      rounded-2xl border-none bg-white p-0 shadow-2xl
      overflow-hidden [&>button]:hidden gap-0
      max-h-[90dvh] flex flex-col">
        <div className="relative border-b border-gray-100 bg-white px-5 sm:px-8 pt-5 sm:pt-7 pb-4 sm:pb-6 shrink-0">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl sm:text-[26px] font-bold text-[#1e3a8a]">
              Create Group
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-[15px] text-gray-500 font-normal">
              Fill in details below to initialize a new group.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={handleClose}
            className="absolute right-4 sm:right-7 top-4 sm:top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-5 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 bg-white overflow-y-auto flex-1">
          <div className="space-y-2.5">
            <label className="text-[17px] font-bold text-[#1e3a8a] block">
              Group Name
            </label>
            <div className="relative flex items-center">
              <PenLine
                className="absolute left-4 text-gray-400 pointer-events-none"
                size={18}
              />
              <Input
                type="text"
                placeholder="Enter Group Name"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  if (errors.groupName)
                    setErrors((p) => ({ ...p, groupName: undefined }));
                }}
                className={`h-11 sm:h-[52px] pl-9 sm:pl-11 pr-4 rounded-xl border bg-white text-[15px] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all ${errors.groupName ? "border-red-400" : "border-blue-100"}`}
              />
            </div>
            {errors.groupName && (
              <p className="text-red-500 text-[13px]">{errors.groupName}</p>
            )}
          </div>

          <div className="space-y-2.5">
            <label className="text-sm sm:text-[17px] font-bold text-[#1e3a8a] block">
              Group Type
            </label>
            <div ref={typeContainerRef} className="relative">
              <div className="relative flex items-center">
                <Users2
                  className="absolute left-4 text-gray-400 pointer-events-none z-10"
                  size={18}
                />
                <div
                  onClick={() => setIsOpenType(!isOpenType)}
                  className="w-full h-[52px] pl-11 pr-10 rounded-xl border border-blue-100 bg-white text-[15px] text-gray-900 flex items-center cursor-pointer select-none transition-all"
                >
                  {groupType === "external"
                    ? "External Group"
                    : "Internal Group"}
                </div>
                <ChevronDown
                  onClick={() => setIsOpenType(!isOpenType)}
                  className={`absolute right-4 text-gray-400 cursor-pointer select-none transition-transform duration-200 ${isOpenType ? "rotate-180" : ""}`}
                  size={18}
                />
              </div>
              {isOpenType && (
                <div className="absolute left-0 right-0 mt-1.5 z-50 bg-white border border-blue-100 rounded-xl shadow-xl overflow-hidden p-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div
                    onClick={() => {
                      setGroupType("external");
                      setSelectedGenerationId("");
                      setSearchQuery("");
                      setErrors((p) => ({
                        ...p,
                        selectedGenerationId: undefined,
                      }));
                      setIsOpenType(false);
                    }}
                    className={`text-[15px] px-4 py-3 rounded-lg cursor-pointer transition-colors ${groupType === "external" ? "bg-blue-50 text-[#1e3a8a] font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    External Group
                  </div>
                  <div
                    onClick={() => {
                      setGroupType("internal");
                      setIsOpenType(false);
                    }}
                    className={`text-[15px] px-4 py-3 rounded-lg cursor-pointer transition-colors ${groupType === "internal" ? "bg-blue-50 text-[#1e3a8a] font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    Internal Group
                  </div>
                </div>
              )}
            </div>
          </div>

          {groupType === "internal" && (
            <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-sm sm:text-[17px] font-bold text-[#1e3a8a] block">
                Generation
              </label>
              <div ref={genContainerRef} className="relative">
                <div className="relative flex items-center">
                  <Settings2
                    className="absolute left-4 text-gray-400 pointer-events-none z-10"
                    size={18}
                  />
                  <Input
                    type="text"
                    placeholder={
                      selectedGeneration
                        ? selectedGeneration.name
                        : "Search generation..."
                    }
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsOpenGen(true);
                      if (errors.selectedGenerationId)
                        setErrors((p) => ({
                          ...p,
                          selectedGenerationId: undefined,
                        }));
                    }}
                    onFocus={() => setIsOpenGen(true)}
                    className={`h-11 sm:h-[52px] pl-9 sm:pl-11 pr-10 rounded-xl border bg-white text-[15px] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all ${errors.selectedGenerationId ? "border-red-400" : "border-blue-100"}`}
                  />
                  <ChevronDown
                    onClick={() => setIsOpenGen(!isOpenGen)}
                    className={`absolute right-4 text-gray-400 cursor-pointer select-none transition-transform duration-200 ${isOpenGen ? "rotate-180" : ""}`}
                    size={18}
                  />
                </div>
                {isOpenGen && (
                  <div className="absolute left-0 right-0 mt-1.5 z-50 bg-white border border-blue-100 rounded-xl shadow-xl max-h-[200px] overflow-y-auto unique-scrollbar p-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {filteredGenerations.length === 0 ? (
                      <div className="text-[14px] text-gray-400 px-4 py-3 text-center">
                        No generations found.
                      </div>
                    ) : (
                      filteredGenerations.map((generation) => (
                        <div
                          key={generation.generationId}
                          onClick={() => {
                            setSelectedGenerationId(generation.generationId);
                            setSearchQuery("");
                            setIsOpenGen(false);
                            setErrors((p) => ({
                              ...p,
                              selectedGenerationId: undefined,
                            }));
                          }}
                          className={`text-[15px] px-4 py-3 rounded-lg cursor-pointer transition-colors ${selectedGenerationId === generation.generationId ? "bg-blue-50 text-[#1e3a8a] font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          {generation.name}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {errors.selectedGenerationId && (
                <p className="text-red-500 text-[13px]">
                  {errors.selectedGenerationId}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2.5">
            <label className="text-sm sm:text-[17px] font-bold text-[#1e3a8a] block">
              Description
            </label>
            <Textarea
              placeholder="Describe your group's details..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((p) => ({ ...p, description: undefined }));
              }}
              className={`min-h-[120px] resize-none p-4 rounded-xl border bg-white text-[15px] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all ${errors.description ? "border-red-400" : "border-blue-100"}`}
            />
            {errors.description && (
              <p className="text-red-500 text-[13px]">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 px-8 py-5 border-t border-gray-50">
          <Button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="h-10 sm:h-[48px] px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-[15px] bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white shadow-md shadow-blue-900/10 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create Group"}
          </Button>
        </div> 
      </DialogContent>
    </Dialog>
  );
}
