"use server";

import { getAppSession as getServerSession } from "@/libs/server-session";
import { authOptions } from "@/libs/auth";
import { fileService } from "@/service/file.service";
import { ServerActionResponse2 } from "@/types/file-types";
import { DEMO_MODE } from "@/libs/demo/config";

export async function uploadFileAction(formData: FormData) {
  try {
    if (DEMO_MODE) {
      const file = Array.from(formData.values()).find(value => value instanceof File);
      if (!(file instanceof File) || !file.type.startsWith("image/")) {
        return { error: "Demo uploads support image previews only. Resume and document uploads are unavailable." };
      }
      return { ok: true, payload: { fileName: "Workshop.webp", fileType: "image/webp", fileUrl: "/images/Workshop.webp", fileSize: 0 } };
    }
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
    if (DEMO_MODE) return { ok: true, payload: true };
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
