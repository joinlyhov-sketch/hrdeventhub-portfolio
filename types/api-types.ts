
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequestOptions = {
  method?: HttpMethod;
  path: string;
  body?: unknown;
  headers?: HeadersInit;
  authToken?: string;
  fetchOptions?: RequestInit;
  accept?: string;
  revalidate?: number | false;
  tags?: string[];
};

export type ApiErrorShape = {
  message: string;
  status: number;
  details?: unknown;
};