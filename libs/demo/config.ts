/** The public showcase is the default. Set NEXT_PUBLIC_DEMO_MODE=false for live API use. */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
export const DEMO_USER_ID = "demo-admin";
// Display-only claims for the existing chat UI. This is never a real credential.
export const DEMO_TOKEN = `demo.${btoa(JSON.stringify({ userId: DEMO_USER_ID, sub: "demo@eventhub.example", firstName: "Sok", lastName: "Dara" }))}.demo`;
export const demoSession = {
  user: { id: DEMO_USER_ID, name: "Sok Dara", email: "demo@eventhub.example", role: "admin", image: "/images/profile.png" },
  appUserId: DEMO_USER_ID,
  accessToken: DEMO_TOKEN,
  refreshToken: "demo-refresh",
  accessTokenExpiry: 4102444800000,
  expires: "2100-01-01T00:00:00.000Z",
};
