import { env } from "./env";
import { ApiErrorShape, ApiRequestOptions } from "@/types/api-types";

const apiBaseUrl = env?.NEXT_PUBLIC_API_BASE_URL;
if (!apiBaseUrl) {
  throw new Error("API base URL is not configured.");
}

const buildHeaders = (options: ApiRequestOptions): HeadersInit => {
  const baseHeaders: HeadersInit = {
    Accept: options.accept ?? "application/json",
  };

  if (options.body !== undefined && !(options.body instanceof FormData)) {
    baseHeaders["Content-Type"] = "application/json";
  }

  // if (options.body !== undefined) {
  //   baseHeaders["Content-Type"] = "application/json";
  // }

  if (options.authToken) {
    baseHeaders.Authorization = `Bearer ${options.authToken}`;
  }

  return {
    ...baseHeaders,
    ...(options.headers ?? {}),
  };
};

const parseErrorMessage = async (
  response: Response,
  fallbackMessage: string,
): Promise<ApiErrorShape> => {
  let message = fallbackMessage;
  let details: unknown;

  try {
    const text = await response.text();
    if (text) {
      try {
        const parsed = JSON.parse(text) as {
          detail?: string;
          message?: string;
        };
        message = parsed.detail || parsed.message || fallbackMessage;
        details = parsed;
      } catch {
        message = text;
        details = text;
      }
    }
  } catch {
    message = fallbackMessage;
  }

  return { message, status: response.status, details };
};

export const apiRequest = async <T>(options: ApiRequestOptions): Promise<T> => {
  const url = `${apiBaseUrl}${options.path}`;
  const headers = buildHeaders(options);
  const requestInit: RequestInit = {
    method: options.method ?? "GET",
    headers,
    ...options.fetchOptions,
  };

  // 🔴 FIX: Handle FormData objects natively without stringifying them
  if (options.body !== undefined) {
    if (options.body instanceof FormData) {
      requestInit.body = options.body;
    } else {
      requestInit.body = JSON.stringify(options.body);
    }
  }

  // if (options.body !== undefined) {
  //   requestInit.body = JSON.stringify(options.body);
  // }

  if (options.revalidate !== undefined || options.tags) {
    requestInit.next = {
      revalidate: options.revalidate,
      tags: options.tags,
    };
  }

  const response = await fetch(url, requestInit);

  if (!response.ok) {
    const error = await parseErrorMessage(
      response,
      response.statusText || "Request failed.",
    );
    throw new Error(error.message);
  }

  return response.json() as Promise<T>;
};

export const apiGet = async <T>(
  path: string,
  options: Omit<ApiRequestOptions, "method" | "path" | "body"> = {},
): Promise<T> => apiRequest<T>({ ...options, path, method: "GET" });

export const apiPost = async <T, B = unknown>(
  path: string,
  body?: B,
  options: Omit<ApiRequestOptions, "method" | "path" | "body"> = {},
): Promise<T> => apiRequest<T>({ ...options, path, method: "POST", body });

export const apiPut = async <T, B = unknown>(
  path: string,
  body?: B,
  options: Omit<ApiRequestOptions, "method" | "path" | "body"> = {},
): Promise<T> => apiRequest<T>({ ...options, path, method: "PUT", body });

export const apiPatch = async <T, B = unknown>(
  path: string,
  body?: B,
  options: Omit<ApiRequestOptions, "method" | "path" | "body"> = {},
): Promise<T> => apiRequest<T>({ ...options, path, method: "PATCH", body });

export const apiDelete = async <T>(
  path: string,
  options: Omit<ApiRequestOptions, "method" | "path" | "body"> = {},
): Promise<T> => apiRequest<T>({ ...options, path, method: "DELETE" });
