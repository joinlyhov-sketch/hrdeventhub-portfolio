import { apiPost } from "@/libs/api";
import { FileUploadResponse } from "@/types/file-types";

export const fileService = {
  uploadFile: async (formData: FormData): Promise<FileUploadResponse> => {
    return apiPost<FileUploadResponse, FormData>(
      "/files/upload-file",
      formData,
    );
  },
};
