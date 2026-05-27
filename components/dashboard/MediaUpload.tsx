"use client";

import { useState, ChangeEvent } from "react";
import { Delete, Plus } from "lucide-react";
import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface UploadedImage {
  id: string;
  url: string;
}

const MediaUpload = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        url: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Label className="text-secondary font-bold text-md cursor-default">
        Media Attachments
      </Label>
      <div className="flex flex-row gap-4 overflow-x-auto w-full no-scrollbar items-start">
        <div className="border-2 border-solid border-slate-200 rounded-2xl p-2 inline-block">
          <label className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors cursor-pointer w-[320px] h-[220px]">
            <Input
              type="file"
              multiple
              accept="image/jpeg, image/png"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-10 h-10 rounded-full border border-secondary flex items-center justify-center mb-4 bg-white shadow-sm">
              <Plus className="text-secondary" size={20} />
            </div>
            <p className="text-xs font-bold text-[#27445D] text-center leading-tight">
              Choose a file or drag & drop it here
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              JPEG and PNG formats, up to 20MB
            </p>
            <span className="mt-4 px-6 py-1.5 border border-slate-200 rounded-full text-[11px] font-bold text-slate-500 hover:bg-slate-100 transition-all bg-white shadow-sm">
              Browse File
            </span>
          </label>
        </div>

        {images.map((image) => (
          <div
            key={image.id}
            className="relative w-full max-w-[280px] sm:max-w-[320px] h-[240px] rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 group"
          >
            <Image
              src={image.url}
              alt="Uploaded Preview"
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <button
              type="button"
              onClick={() => removeImage(image.id)}
              className="absolute top-1 right-1 text-red-500 flex items-center justify-center hover:text-red-700 active:scale-90 transition-all z-10"
              aria-label="Remove image"
            >
              <Delete size={36} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaUpload;
