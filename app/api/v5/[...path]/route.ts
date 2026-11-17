import { DEMO_MODE } from "@/libs/demo/config";
import { demoRequest } from "@/libs/demo/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function handle(request: NextRequest) {
  if (!DEMO_MODE) return NextResponse.json({ message: "Demo mode is disabled" }, { status: 404 });
  try {
    const path = request.nextUrl.pathname.replace(/^\/api\/v5/, "") + request.nextUrl.search;
    const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.json().catch(() => undefined);
    return NextResponse.json(await demoRequest(path, request.method, body));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Demo request failed" }, { status: 400 });
  }
}

export { handle as GET, handle as POST, handle as PATCH, handle as PUT, handle as DELETE };
