export const telegramService = {
  getConnectionLink: async (userId: string): Promise<string> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${baseUrl}/telegram-bot/connect-link/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
        },
      });

      if (!response.ok) throw new Error("Failed to retrieve connection link");

      return await response.text();
    } catch (error) {
      console.error("Telegram link retrieval crashed:", error);
      throw error;
    }
  },
};