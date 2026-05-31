import { getSession } from "next-auth/react";
import { apiGet } from "@/libs/api";
import { GenerationResponse } from "@/types/generation-type";

const getToken = async () => {
  const session = await getSession();
  return session?.accessToken;
};

export const generationService = {
  async getAll() {
    const token = await getToken();
    const response = await apiGet<GenerationResponse>(
      "/generations?page=1&size=100",
      { authToken: token }
    );
    return response.payload;
  },
};