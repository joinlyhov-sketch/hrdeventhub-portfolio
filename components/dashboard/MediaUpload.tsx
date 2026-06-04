"use client";

import { useState, ChangeEvent } from "react";
import { Trash2, Plus, Loader2, Check } from "lucide-react";
import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { uploadFileAction, deleteFileAction } from "@/actions/file.action";
import { PostMediaItem } from "@/types/post-types";
import { toast } from "sonner";

interface MediaUploadProps {
  value: PostMediaItem[];
  onChange: (media: PostMediaItem[]) => void;
  isCover: boolean | null;
}

const MediaUpload = ({
  value = [],
  onChange,
  isCover = false,
}: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [deletingKeys, setDeletingKeys] = useState<Record<string, boolean>>({});

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const filesArray = Array.from(e.target.files);
    let updatedMediaList: PostMediaItem[] = [...value];

    for (const file of filesArray) {
      const dataPayload = new FormData();
      dataPayload.append("file", file);

      try {
        const result = await uploadFileAction(dataPayload);

        if (result.ok && result.payload) {
          const isFirstFile = updatedMediaList.length === 0;

          const newMediaItem: PostMediaItem = {
            filePath: result.payload.fileUrl,
            isCover: isFirstFile,
          };
          console.log(newMediaItem);

          updatedMediaList = [...updatedMediaList, newMediaItem];
        } else {
          toast.error(
            "Upload failed: File size exceeds the 5 MB limit. Please upload a file smaller than 5 MB.",
          );
        }
      } catch (err) {
        console.error("Network upload error:", err);

        toast.error(err instanceof Error ? err.message : "Upload failed");
      }
    }

    onChange(updatedMediaList);
    setIsUploading(false);
    e.target.value = "";
  };

  const handleSelectCover = (selectedPath: string): void => {
    const updatedMedia = value.map((item) => ({
      ...item,
      isCover: item.filePath === selectedPath,
    }));
    onChange(updatedMedia);
  };

  const removeImage = async (filePathToRemove: string): Promise<void> => {
    let storageKey = filePathToRemove;

    try {
      if (filePathToRemove.includes("?")) {
        const queryString = filePathToRemove.split("?")[1];
        const urlParams = new URLSearchParams(queryString);
        const keyFromParam = urlParams.get("key");

        if (keyFromParam) {
          storageKey = keyFromParam;
        }
      } else if (filePathToRemove.includes("/preview-file/")) {
        storageKey = filePathToRemove.split("/preview-file/")[1];
      } else if (filePathToRemove.includes("/file/")) {
        storageKey = filePathToRemove.split("/file/")[1];
      }
    } catch (parseError) {
      console.error(
        "Failed to parse storage key path out of URL string:",
        parseError,
      );
    }

    setDeletingKeys((prev) => ({ ...prev, [filePathToRemove]: true }));

    try {
      console.log("Sending delete request with precise query key:", storageKey);
      const response = await deleteFileAction(storageKey);
      if (!response.ok) {
        console.warn("Storage deletion warning from backend:", response.error);
      }
      console.log("result :", response);
    } catch (err) {
      console.error("Network file destruction pipeline failure:", err);
    } finally {
      setDeletingKeys((prev) => ({ ...prev, [filePathToRemove]: false }));
    }

    const remainingMedia = value.filter(
      (img) => img.filePath !== filePathToRemove,
    );

    if (
      remainingMedia.length > 0 &&
      !remainingMedia.some((img) => img.isCover)
    ) {
      remainingMedia[0].isCover = true;
    }

    onChange(remainingMedia);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Label className="text-secondary font-bold text-md cursor-default flex items-center gap-2">
        Media Attachments
        {isUploading && (
          <Loader2 className="animate-spin text-primary h-4 w-4" />
        )}
      </Label>

      <div className="flex flex-row gap-4 overflow-x-auto w-full pb-2 no-scrollbar items-start">
        <div className="border-2 border-solid border-slate-200 rounded-2xl p-2 inline-block shrink-0">
          <label className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors cursor-pointer w-[320px] h-55">
            <Input
              type="file"
              multiple
              accept="image/jpeg, image/png"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileChange}
            />
            <div className="w-10 h-10 rounded-full border border-secondary flex items-center justify-center mb-4 bg-white shadow-sm">
              <Plus className="text-secondary" size={20} />
            </div>
            <p className="text-xs font-bold text-[#27445D] text-center leading-tight">
              {isUploading
                ? "Uploading file structures..."
                : "Choose a file or drag & drop it here"}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              JPEG and PNG formats, up to 20MB
            </p>
            <span className="mt-4 px-6 py-1.5 border border-slate-200 rounded-full text-[11px] font-bold text-slate-500 hover:bg-slate-100 transition-all bg-white shadow-sm">
              Browse File
            </span>
          </label>
        </div>

        {value.map((image: PostMediaItem) => {
          const dynamicPreviewUrl = `${image.filePath}`;
          const isTargetDeleting = deletingKeys[image.filePath];

          return (
            <div
              key={image.filePath}
              className={`relative w-[320px] h-55 rounded-2xl overflow-hidden border p-2 bg-white shrink-0 group transition-all duration-200 ${
                image.isCover
                  ? "border-primary ring-4 ring-primary/10 shadow-md"
                  : "border-slate-200 hover:border-slate-300"
              } ${isTargetDeleting ? "opacity-40 pointer-events-none" : ""}`}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={dynamicPreviewUrl}
                  alt="Uploaded Asset Preview"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-102"
                  unoptimized
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                  {isCover && (
                    <div>
                      {image.isCover ? (
                        <div className="bg-primary text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Check size={12} strokeWidth={3} /> ACTIVE COVER
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isTargetDeleting}
                    onClick={() => removeImage(image.filePath)}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-red-500 hover:text-white text-slate-600 flex items-center justify-center active:scale-90 transition-all shadow-md disabled:opacity-50"
                    aria-label="Remove image"
                  >
                    {isTargetDeleting ? (
                      <Loader2
                        size={14}
                        className="animate-spin text-slate-400"
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>

                {isCover && (
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
                    <p className="text-[10px] text-white/90 font-medium truncate max-w-35 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                      {image.filePath.split("/").pop()}
                    </p>

                    {!image.isCover && !isTargetDeleting && (
                      <button
                        type="button"
                        onClick={() => handleSelectCover(image.filePath)}
                        className="bg-white text-secondary hover:bg-primary hover:text-white transition-all text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md active:scale-95"
                      >
                        Set As Cover
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MediaUpload;
