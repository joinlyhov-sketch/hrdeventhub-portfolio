import { apiGet, apiPatch } from "@/libs/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { ApiUser, ApiResponse } from "@/types/user-management-type/user";

interface SingleUserApiResponse {
  success: boolean;
  message: string;
  payload: ApiUser;
}

export const userService = {
  getAll: async (): Promise<ApiUser[]> => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    const pageSize = 100;

    const firstPage = await apiGet<ApiResponse>(
      `/admin/users?page=1&size=${pageSize}`,
      { authToken: token },
    );

    const firstBatch = firstPage.payload || [];

    if (firstBatch.length < pageSize) {
      return firstBatch;
    }

    const remainingPages = await Promise.all(
      Array.from({ length: 9 }, (_, i) =>
        apiGet<ApiResponse>(`/admin/users?page=${i + 2}&size=${pageSize}`, {
          authToken: token,
        }).then((r) => r.payload || []),
      ),
    );

    return [firstBatch, ...remainingPages].flat();
  },

  suspend: async (
    userId: string,
    payload: { reason: string },
  ): Promise<SingleUserApiResponse> => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    return apiPatch<SingleUserApiResponse>(
      `/admin/users/${userId}/suspend`,
      payload,
      { authToken: token },
    );
  },

  reactivate: async (userId: string): Promise<SingleUserApiResponse> => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    return apiPatch<SingleUserApiResponse>(
      `/admin/users/${userId}/reactivate`,
      {},
      { authToken: token },
    );
  },

  updateRole: async (
    userId: string,
    payload: { role: "ADMIN" | "ORGANIZER" | "ALUMNI" | "STUDENT" },
  ): Promise<SingleUserApiResponse> => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    return apiPatch<SingleUserApiResponse>(
      `/admin/users/${userId}/role`,
      payload,
      { authToken: token },
    );
  },

  getUserById: async (userId: string): Promise<SingleUserApiResponse> => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    return apiGet<SingleUserApiResponse>(`/admin/users/${userId}`, {
      authToken: token,
    });
  },
};