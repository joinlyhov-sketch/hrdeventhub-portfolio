import "server-only";
import { cookies } from "next/headers";
import { deflateSync, inflateSync } from "node:zlib";
import { handleDemoRequest, type DemoChanges } from "./handler";

const COOKIE = "eventhub-demo-v1";

/** Small, visitor-owned state survives Vercel function restarts without a database. */
export async function demoRequest(path: string, method = "GET", body?: unknown) {
  const jar = await cookies();
  let changes: DemoChanges = {};
  try {
    const value = jar.get(COOKIE)?.value;
    if (value) changes = JSON.parse(inflateSync(Buffer.from(value, "base64url"), { maxOutputLength: 100_000 }).toString());
  } catch { /* Invalid or outdated demo state starts fresh. */ }
  if (path === "/demo/reset") {
    jar.delete(COOKIE);
    return { success: true };
  }
  const before = JSON.stringify(changes);
  const response = handleDemoRequest(path, method, body, changes);
  if (JSON.stringify(changes) !== before) {
    const value = deflateSync(JSON.stringify(changes)).toString("base64url");
    if (value.length > 3600) throw new Error("Your demo storage is full. Use Reset demo to start fresh.");
    jar.set(COOKIE, value, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 86400 });
  }
  return response;
}
