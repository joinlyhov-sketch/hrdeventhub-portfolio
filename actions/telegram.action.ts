"use client";

export async function connectTelegramAction(userId: string) {
  if (!userId) {
    return { error: "User session ID is required to connect to Telegram." };
  }

  try {
    const botUsername = "HrdEventHubBot"; 
    
    const telegramBotUrl = `https://t.me/${botUsername}?start=${userId}`;

    if (typeof window !== "undefined") {
      window.open(telegramBotUrl, "_blank", "noopener,noreferrer");
    }

    return { ok: true };
  } catch (error) {
    console.error("Telegram redirect routing failure:", error);
    return { error: "Could not open Telegram application." };
  }
}