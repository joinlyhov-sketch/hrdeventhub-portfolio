import { apiDelete, apiPost } from "@/libs/api";
import { FileUploadResponse } from "@/types/file-types";
import { FileUploadBackendResponse } from "@/types/post-types";

export const fileService = {
  uploadFile: async (
    formData: FormData,
    token?: string,
  ): Promise<FileUploadResponse> => {
    return apiPost<FileUploadResponse, FormData>(
      "/files/upload-file?folder=event",
      formData,
      { authToken: token },
    );
  },
  async deleteFile(
    fileKey: string,
    token?: string,
  ): Promise<FileUploadBackendResponse> {
    const path = `/files/delete?key=${encodeURIComponent(fileKey)}`;
    return apiDelete<FileUploadBackendResponse>(path, {
      authToken: token,
      accept: "*/*",
    });
  },
};
