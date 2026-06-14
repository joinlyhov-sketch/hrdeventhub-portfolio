import { apiGet } from "../libs/api";

export const telegramService = {
  getConnectionLink: async (userId: string): Promise<string> => {
    return apiGet<string>(`/telegram-bot/connect-link/${userId}`, {
      responseType: "text",
    });
  },
};