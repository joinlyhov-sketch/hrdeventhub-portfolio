import { DEMO_MODE } from "./demo/config";
export const API_BASE =
  DEMO_MODE ? "/api/v5" : process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

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