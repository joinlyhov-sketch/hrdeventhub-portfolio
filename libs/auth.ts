import type { NextAuthOptions, Session, User } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authService } from "../service/auth.service";
import type { JWT } from "next-auth/jwt";
import type { AuthResponse } from "../types/auth-types";

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
      },

      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        try {
          const authData = await authService.login({
            email: credentials.identifier as string,
            password: credentials.password as string,
          });
          const payload =
            (authData as AuthResponse & { data?: AuthResponse; payload?: { token?: string } })
              .data ?? authData;

          const tokenFromPayload =
            (payload as { payload?: { token?: string } }).payload?.token ??
            (payload as { token?: string }).token;

          const accessToken = payload.accessToken ?? tokenFromPayload;

          if (!accessToken) {
            console.error("Auth payload missing access token", payload);
            return null;
          }

          const tokenParts = accessToken.split(".");
          let decodedPayload: { userId?: string; sub?: string } = {};
          if (tokenParts.length === 3) {
            try {
              decodedPayload = JSON.parse(
                Buffer.from(tokenParts[1], "base64").toString("utf-8")
              ) as { userId?: string; sub?: string };
            } catch (error) {
              console.error("Failed to decode JWT payload", error);
            }
          }

          const userId = decodedPayload.userId ?? "unknown";
          const userEmail = decodedPayload.sub ?? (credentials.identifier as string);

          return {
            id: userId,
            email: userEmail,
            accessToken,
            refreshToken: payload.refreshToken,
            user: {
              id: userId,
              email: userEmail,
              role: "user",
            },
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
        token.id = user.id as string;
        token.role = user.user?.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session(session: Session, token: JWT) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};

const authHandler = NextAuth(authOptions);

export { authHandler };