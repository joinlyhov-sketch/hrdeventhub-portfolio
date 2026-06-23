"use client";

import { useEffect, useRef, useState } from "react";
import { queryPresence, PresenceRecord } from "@/service/presence.service";

export function usePresence(
  userId: string | null | undefined,
  token: string,
  intervalMs = 30_000,
) {
  const [presence, setPresence] = useState<PresenceRecord | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId || !token) return;

    let cancelled = false;

    async function fetch() {
      try {
        const map = await queryPresence([userId!], token);
        if (!cancelled) setPresence(map[userId!] ?? null);
      } catch (err) {
        console.error("[usePresence] Failed to query presence:", err);
      }
    }

    fetch();
    timerRef.current = setInterval(fetch, intervalMs);

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userId, token, intervalMs]);

  return presence;
}