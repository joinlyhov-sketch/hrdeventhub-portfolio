import { DEMO_MODE } from "./demo/config";
import { z } from "zod";

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1),
 NEXTAUTH_URL: z.string().regex(/^(http|https):\/\//, "Invalid URL format"),
  NEXT_PUBLIC_API_BASE_URL: z.string().regex(/^(http|https):\/\//, "Invalid URL format"),
});
const isServer = typeof window === "undefined";
const envParse = envSchema.safeParse({
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

if (!DEMO_MODE && !envParse.success && isServer) {
  console.error("Environment Validation Failed:", JSON.stringify(envParse.error.issues, null, 2));
  throw new Error("Fix .env variables before running.");
}
export const env = isServer 
  ? envParse.data! 
  : { 
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL!,
      NEXTAUTH_SECRET: "CLIENT_PROTECTED", 
      NEXTAUTH_URL: "CLIENT_PROTECTED" 
    } as typeof envParse.data;