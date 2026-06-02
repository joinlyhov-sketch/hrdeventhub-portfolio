import { env } from "./env";

export const getMediaUrl = (filePath: string | undefined | null): string | null => {
  if (!filePath) return null;

  const baseUrl = env?.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) return null;
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  const isUuidFile = /^[0-9a-f-]{36}\.(png|jpg|jpeg|gif|webp)$/i.test(filePath);
  if (isUuidFile) {
    return `${baseUrl}/files/preview-file/${filePath}`;
  }
  const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  return `${baseUrl}/files/preview-file/${cleanPath}`;
};