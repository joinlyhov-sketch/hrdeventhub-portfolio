import type { NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authService } from "../service/auth.service";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;
        try {
          const authData = await authService.login({
            identifier: credentials.identifier as string,
            password: credentials.password as string,
            rememberMe: credentials.rememberMe === "true",
          });

          const token = authData.payload.token;
          const refreshToken = authData.payload.refreshToken;

          if (!token) {
            console.error("Auth payload missing access token", authData);
            return null;
          }

          let decoded: { userId?: string; sub?: string; roles?: string } = {};
          const parts = token.split(".");
          if (parts.length === 3) {
            try {
              decoded = JSON.parse(
                Buffer.from(parts[1], "base64").toString("utf-8"),
              ) as { userId?: string; sub?: string; roles?: string };
            } catch {
              console.error("Failed to decode JWT payload");
            }
          }

          const userId = decoded.userId ?? "unknown";
          const userEmail = decoded.sub ?? (credentials.identifier as string);
          const rawRole = decoded.roles ?? "STUDENT";

          let resolvedRole = "student";
          if (rawRole === "ADMIN") resolvedRole = "admin";
          else if (rawRole === "ORGANIZER") resolvedRole = "organizer";
          else if (rawRole === "ALUMNI") resolvedRole = "alumni";

          const rememberMe = credentials.rememberMe === "true";

          return {
            id: userId,
            email: userEmail,
            role: resolvedRole,
            accessToken: token,
            refreshToken,
            rememberMe,
          };
        } catch (error: any) {
          console.error("Login failed", error);
          if (
            error?.message &&
            (error.message.toLowerCase().includes("verify") ||
             error.message.toLowerCase().includes("unverified") ||
             error.message.includes("ACCOUNT_UNVERIFIED"))
          ) {
            throw new Error(`NOT_VERIFIED:${credentials.identifier}`);
          }
          throw new Error("CredentialsSignin");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.rememberMe = user.rememberMe;
        token.appUserId = user.id;

        const parts = (user.accessToken as string)?.split(".");
        if (parts?.length === 3) {
          try {
            const decoded = JSON.parse(
              Buffer.from(parts[1], "base64").toString("utf-8"),
            ) as { exp?: number };
            token.accessTokenExpiry = decoded.exp
              ? decoded.exp * 1000
              : Date.now() + 24 * 60 * 60 * 1000;
          } catch {
            token.accessTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
          }
        } else {
          token.accessTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
        }

        return token;
      }

      if (Date.now() < (token.accessTokenExpiry as number)) {
        return token;
      }

      try {
        const refreshed = await authService.refreshToken(
          token.refreshToken as string,
        );

        const parts = refreshed.payload.token?.split(".");
        let newExpiry = Date.now() + 24 * 60 * 60 * 1000;
        if (parts?.length === 3) {
          try {
            const decoded = JSON.parse(
              Buffer.from(parts[1], "base64").toString("utf-8"),
            ) as { exp?: number };
            newExpiry = decoded.exp ? decoded.exp * 1000 : newExpiry;
          } catch {}
        }

        return {
          ...token,
          accessToken: refreshed.payload.token,
          refreshToken: refreshed.payload.refreshToken,
          accessTokenExpiry: newExpiry,
          error: undefined,
        };
      } catch {
        return {
          ...token,
          error: "RefreshTokenExpired" as const,
        };
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.appUserId = token.appUserId as string;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    },
  },
};

const authHandler = NextAuth(authOptions);
export { authHandler };
