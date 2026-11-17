import { getServerSession } from "next-auth";
import { DEMO_MODE, demoSession } from "./demo/config";

export async function getAppSession(...args: Parameters<typeof getServerSession>) {
  return DEMO_MODE ? demoSession : getServerSession(...args);
}
