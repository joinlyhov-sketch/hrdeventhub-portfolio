import { env } from "./env";

export const getMediaUrl = (filePath: string | undefined | null): string | null => {
  if (!filePath) return null;

  const baseUrl = env?.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) return null;

  // already a full URL — return as-is
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  // looks like a UUID filename (no slashes, ends with image extension)
  const isUuidFile = /^[0-9a-f-]{36}\.(png|jpg|jpeg|gif|webp)$/i.test(filePath);
  if (isUuidFile) {
    return `${baseUrl}/files/preview-file/${filePath}`;
  }

  // relative path like "uploads/gen14-kickoff-banner.jpg"
  // strip leading slash to avoid double slashes
  const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  return `${baseUrl}/files/preview-file/${cleanPath}`;
};