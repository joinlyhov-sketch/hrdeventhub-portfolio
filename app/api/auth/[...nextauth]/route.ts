import { authHandler } from "@/libs/auth";
import { DEMO_MODE, demoSession } from "@/libs/demo/config";
import { NextRequest, NextResponse } from "next/server";

async function handle(request: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  if (!DEMO_MODE) return authHandler(request, context);
  const { nextauth } = await context.params;
  if (nextauth[0] === "session") return NextResponse.json(demoSession);
  if (nextauth[0] === "csrf") return NextResponse.json({ csrfToken: "demo-only" });
  return NextResponse.json({ url: new URL("/", request.url).toString() });
}

export { handle as GET, handle as POST };
