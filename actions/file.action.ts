"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import { fileService } from "@/service/file.service";
import { ServerActionResponse2 } from "@/types/file-types";

export async function uploadFileAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    const response = await fileService.uploadFile(formData, token);

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

export async function deleteFileAction(
  fileKey: string,
): Promise<ServerActionResponse2<boolean>> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    const response = await fileService.deleteFile(fileKey, token);

    if (response.success) {
      return { ok: true, payload: true };
    }

    return {
      ok: false,
      error: response.message || "Deletion request rejected.",
    };
  } catch (error: unknown) {
    console.error("Server Action Deletion Error:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected service error occurred during file destruction.",
    };
  }
}
