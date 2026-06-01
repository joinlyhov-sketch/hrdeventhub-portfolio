"use server";

import { fileService } from "@/service/file.service";

export async function uploadFileAction(formData: FormData) {
  try {
    const response = await fileService.uploadFile(formData);
    if (!response.success) {
      return { error: response.message || "Failed to upload file." };
    }
    return { ok: true, payload: response.payload };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected upload failure occurred.",
    };
  }
}
