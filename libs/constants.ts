export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const WS_URL = (() => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return "";
  try {
    const url = new URL(base.startsWith("http") ? base : `https://${base}`);
    return `${url.origin}/ws`;
  } catch {
    return "";
  }
})();