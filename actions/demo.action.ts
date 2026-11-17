"use server";

import { DEMO_MODE } from "@/libs/demo/config";
import { demoRequest } from "@/libs/demo/server";

export async function demoApiAction(path: string, method?: string, body?: unknown) {
  if (!DEMO_MODE) throw new Error("Demo mode is disabled");
  return demoRequest(path, method, body);
}
