// components/pop-up/ImageAdjustModal.tsx
"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog-payments/dialog";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus } from "lucide-react";
import { getCroppedImg } from "./CropImage";

interface ImageAdjustModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedBlob: Blob) => void;
}

export default function ImageAdjustModal({
  imageSrc,
  isOpen,
  onClose,
  onSave,
}: ImageAdjustModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = useCallback((_croppedArea: unknown, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsCropping(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedBlob) {
        onSave(croppedBlob);
      }
    } catch (err) {
      console.error("Failed to crop image context:", err);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0">
        <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-[22px] font-bold text-[#1e3a8a]">
              Adjust Profile Picture
            </DialogTitle>
            <DialogDescription className="text-[14px] text-gray-500 font-normal">
              Drag to freely position. Zoom out past borders to fit the full photo.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={onClose}
            className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-none"
            aria-label="Close"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-8 py-6 space-y-6 bg-white">
          <div className="relative w-full h-72 bg-zinc-900 rounded-xl overflow-hidden border border-gray-100 shadow-inner">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={true}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              restrictPosition={false} 
              minZoom={0.5}            
              maxZoom={4}             
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[15px] font-bold text-[#1e3a8a]">
                Scale & Spacing
              </label>
              <span className="text-xs text-gray-400 font-mono font-medium">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
              <button 
                type="button"
                onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.2))}
                className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-lg transition"
              >
                <Minus size={16} strokeWidth={2.5} />
              </button>
              
              <input
                type="range"
                min={0.5}
                max={4}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#1e3a8a] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              
              <button 
                type="button"
                onClick={() => setZoom((prev) => Math.min(4, prev + 0.2))}
                className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-lg transition"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-11 px-5 text-gray-500 hover:bg-gray-50 font-semibold rounded-xl text-sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isCropping}
              onClick={handleSave}
              className="h-11 px-6 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-semibold rounded-xl text-sm shadow-sm disabled:opacity-50"
            >
              {isCropping ? "Processing..." : "Apply Layout"}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}