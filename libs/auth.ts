import type { NextAuthOptions, Session, User } from "next-auth";
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
        identifier: { label: "Email",       type: "email"    },
        password:   { label: "Password",    type: "password" },
        rememberMe: { label: "Remember Me", type: "text"     },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;
        try {
          const authData = await authService.login({
            identifier:      credentials.identifier as string,
            password:   credentials.password   as string,
            rememberMe: credentials.rememberMe === "true",
          });

          const token        = authData.payload.token;
          const refreshToken = authData.payload.refreshToken;

          if (!token) {
            console.error("Auth payload missing access token", authData);
            return null;
          }
          let decoded: { userId?: string; sub?: string } = {};
          const parts = token.split(".");
          if (parts.length === 3) {
            try {
              decoded = JSON.parse(
                Buffer.from(parts[1], "base64").toString("utf-8"),
              ) as { userId?: string; sub?: string };
            } catch {
              console.error("Failed to decode JWT payload");
            }
          }

          const userId    = decoded.userId ?? "unknown";
          const userEmail = decoded.sub    ?? (credentials.identifier as string);
          const rememberMe = credentials.rememberMe === "true";

          return {
            id: userId,
            email: userEmail,
            accessToken: token,
            refreshToken,
            rememberMe,
            user: { id: userId, email: userEmail, role: "user" },
          };
        } catch (error) {
          console.error("Login failed", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id               = user.id as string;
        token.role             = user.user?.role;
        token.accessToken      = user.accessToken;
        token.refreshToken     = user.refreshToken;
        token.rememberMe       = user.rememberMe;
        token.accessTokenExpiry = Date.now() + 15 * 60 * 1000; 
        return token;
      }

      if (Date.now() < token.accessTokenExpiry) {
        return token;
      }
      try {
        const refreshed = await authService.refreshToken(token.refreshToken);
        return {
          ...token,
          accessToken:       refreshed.payload.token,
          refreshToken:      refreshed.payload.refreshToken,
          accessTokenExpiry: Date.now() + 15 * 60 * 1000,
          error:             undefined,
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
    session.user.id     = token.id   as string;
    session.user.role   = token.role as string;
    session.accessToken  = token.accessToken  as string;
    session.refreshToken = token.refreshToken as string;
    session.error        = token.error;
  }
  return session;
},
  },
};

const authHandler = NextAuth(authOptions);
export { authHandler };