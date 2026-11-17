"use client";
import { DEMO_MODE } from "@/libs/demo/config";

type TelegramActionResponse = { ok: true; error?: never } | { ok?: never; error: string | object };

export async function connectTelegramAction(userId: string): Promise<TelegramActionResponse> {
  if (DEMO_MODE) return { error: "Telegram connections are unavailable in this demo." };
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
  } catch (error: unknown) {
    console.error("Telegram redirect routing failure:", error);
    const msg = error instanceof Error ? error.message : "Could not open Telegram application.";
    return { error: msg };
  }
}

export async function disconnectTelegramAction(): Promise<TelegramActionResponse> {
  return { ok: true };
}
