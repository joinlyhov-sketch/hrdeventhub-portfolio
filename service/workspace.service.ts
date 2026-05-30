import { env } from "../libs/env";
import { Workspace } from "../types/survey";
import { getSession } from "next-auth/react";

const apiBaseUrl = env?.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("API base URL is not configured.");
}

const handleResponseError = async (
  res: Response,
  defaultMessage: string
): Promise<never> => {
  let errorMessage = defaultMessage;

  try {
    const bodyText = await res.text();
    if (bodyText) {
      try {
        const errorJson = JSON.parse(bodyText) as {
          detail?: string;
          message?: string;
          data?: any;
        };
        errorMessage =
          errorJson?.detail || errorJson?.message || defaultMessage;
      } catch {
        errorMessage = bodyText;
      }
    }
  } catch {}

  throw new Error(errorMessage);
};

const getAuthHeaders = async () => {
  const session = await getSession();
  const token = session?.user?.token || session?.accessToken;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

interface ApiResponse<T> {
  success: boolean;
  message: string;
  payload?: T;
  data?: T;
  error?: string;
}

export const workspaceService = {
  // Get all workspaces with pagination
  getAll: async (page: number = 1, size: number = 100): Promise<Workspace[]> => {
    const headers = await getAuthHeaders();
    const url = new URL(`${apiBaseUrl}/workspaces`);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("size", size.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
    });
    if (!res.ok) await handleResponseError(res, "Failed to fetch workspaces.");
    const response = (await res.json()) as ApiResponse<Workspace[]>;
    return response.payload || response.data || [];
  },

  // Get workspace by ID
  getById: async (workspaceId: string): Promise<Workspace> => {
    const headers = await getAuthHeaders();
    const url = `${apiBaseUrl}/workspaces/${workspaceId}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    if (!res.ok) await handleResponseError(res, "Failed to fetch workspace.");
    const response = (await res.json()) as ApiResponse<Workspace>;
    return (response.payload || response.data)!;
  },

  // Get workspaces by generation
  getByGeneration: async (generationId: string): Promise<Workspace[]> => {
    const headers = await getAuthHeaders();
    const url = `${apiBaseUrl}/workspaces/generation/${generationId}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    if (!res.ok)
      await handleResponseError(res, "Failed to fetch generation workspaces.");
    const response = (await res.json()) as ApiResponse<Workspace[]>;
    return response.payload || response.data || [];
  },
};
