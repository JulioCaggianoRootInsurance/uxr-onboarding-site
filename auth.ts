import NextAuth, { type DefaultSession, type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

const SHARED_ACCESS_USER_ID = "uxr-handoff-shared-access";
const MINIMUM_PASSWORD_LENGTH = 12;

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      handoffAuthorized: boolean;
    };
  }
}

function configuredPassword(): string | null {
  const password = process.env.HANDOFF_PASSWORD;

  if (
    typeof password !== "string" ||
    password.length < MINIMUM_PASSWORD_LENGTH
  ) {
    return null;
  }

  return password;
}

export function isPasswordAccessConfigured(): boolean {
  return configuredPassword() !== null;
}

async function digest(value: string): Promise<Uint8Array> {
  const encoded = new TextEncoder().encode(value);
  const result = await globalThis.crypto.subtle.digest("SHA-256", encoded);
  return new Uint8Array(result);
}

async function passwordsMatch(
  suppliedPassword: string,
  expectedPassword: string,
): Promise<boolean> {
  const [suppliedDigest, expectedDigest] = await Promise.all([
    digest(suppliedPassword),
    digest(expectedPassword),
  ]);

  let difference = 0;

  for (let index = 0; index < expectedDigest.length; index += 1) {
    difference |= suppliedDigest[index] ^ expectedDigest[index];
  }

  return difference === 0;
}

const developmentSecret =
  process.env.NODE_ENV === "development"
    ? "root-uxr-local-development-cookie-secret-only"
    : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? developmentSecret,
  trustHost:
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL === "1" ||
    process.env.AUTH_TRUST_HOST === "true",
  providers: [
    Credentials({
      name: "Shared password",
      credentials: {
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const expectedPassword = configuredPassword();
        const suppliedPassword =
          typeof credentials.password === "string"
            ? credentials.password
            : "";

        if (
          !expectedPassword ||
          suppliedPassword.length < MINIMUM_PASSWORD_LENGTH ||
          !(await passwordsMatch(suppliedPassword, expectedPassword))
        ) {
          return null;
        }

        return {
          id: SHARED_ACCESS_USER_ID,
          name: "Authorized handoff viewer",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id === SHARED_ACCESS_USER_ID) {
        token.handoffAuthorized = true;
      }

      return token;
    },
    session({ session, token }) {
      session.user.handoffAuthorized = token.handoffAuthorized === true;
      return session;
    },
    authorized({ auth: session, request }) {
      if (request.nextUrl.pathname === "/login") {
        return true;
      }

      return isHandoffSession(session);
    },
  },
});

export function isHandoffSession(session: Session | null): session is Session {
  return session?.user?.handoffAuthorized === true;
}

export async function getHandoffSession(): Promise<Session | null> {
  const session = await auth();
  return isHandoffSession(session) ? session : null;
}

export function safeReturnTo(
  value: string | string[] | undefined,
): string {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return "/";
  }

  try {
    const parsed = new URL(candidate, "https://local.invalid");
    const pathname = parsed.pathname;

    if (pathname === "/login" || pathname.startsWith("/api/auth")) {
      return "/";
    }

    return `${pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/";
  }
}

export async function requireHandoffSession(
  returnTo = "/",
): Promise<Session> {
  const session = await getHandoffSession();

  if (!session) {
    redirect(
      `/login?returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`,
    );
  }

  return session;
}
