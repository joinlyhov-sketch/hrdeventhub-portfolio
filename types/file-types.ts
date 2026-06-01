export interface FileUploadPayload {
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  status: string;
  payload: FileUploadPayload;
  timestamp: string;
}
