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
  payload: {
    fileName: string;
    fileType: string;
    fileUrl: string;
    fileSize: number;
  };
  timestamp: string;
}

export interface ServerActionResponse<T> {
  ok: boolean;
  payload?: T;
  error?: string;
}

export interface PostMediaItem {
  filePath: string;
  isCover: boolean;
}
