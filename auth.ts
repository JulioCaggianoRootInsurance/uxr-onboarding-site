import NextAuth, {
  type DefaultSession,
  type Profile,
  type Session,
} from "next-auth";
import Google, { type GoogleProfile } from "next-auth/providers/google";
import { redirect } from "next/navigation";

export const ROOT_WORKSPACE_DOMAIN = "joinroot.com";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      rootAuthorized: boolean;
      workspaceDomain?: string;
    };
  }
}

export function isAuthDevBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.AUTH_DEV_BYPASS === "true"
  );
}

export function isAuthorizedRootGoogleProfile(
  profile: Profile | undefined,
): boolean {
  const googleProfile = profile as Partial<GoogleProfile> | undefined;
  const email =
    typeof googleProfile?.email === "string"
      ? googleProfile.email.trim().toLowerCase()
      : "";
  const workspaceDomain =
    typeof googleProfile?.hd === "string"
      ? googleProfile.hd.trim().toLowerCase()
      : "";

  return (
    googleProfile?.email_verified === true &&
    workspaceDomain === ROOT_WORKSPACE_DOMAIN &&
    email.endsWith(`@${ROOT_WORKSPACE_DOMAIN}`)
  );
}

const developmentSecret = isAuthDevBypassEnabled()
  ? "root-uxr-local-development-auth-bypass-only"
  : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? developmentSecret,
  providers: [
    Google({
      authorization: {
        params: {
          hd: ROOT_WORKSPACE_DOMAIN,
          prompt: "select_account",
        },
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
    signIn({ account, profile }) {
      return (
        account?.provider === "google" &&
        isAuthorizedRootGoogleProfile(profile)
      );
    },
    jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        const rootAuthorized = isAuthorizedRootGoogleProfile(profile);
        token.rootAuthorized = rootAuthorized;
        token.workspaceDomain = rootAuthorized
          ? ROOT_WORKSPACE_DOMAIN
          : undefined;
      }

      return token;
    },
    session({ session, token }) {
      session.user.rootAuthorized = token.rootAuthorized === true;
      session.user.workspaceDomain =
        typeof token.workspaceDomain === "string"
          ? token.workspaceDomain
          : undefined;
      return session;
    },
    authorized({ auth: session, request }) {
      if (request.nextUrl.pathname === "/login") {
        return true;
      }

      if (isAuthDevBypassEnabled()) {
        return true;
      }

      return isRootSession(session);
    },
  },
});

export function isRootSession(session: Session | null): session is Session {
  const email = session?.user?.email?.trim().toLowerCase() ?? "";
  const workspaceDomain =
    session?.user?.workspaceDomain?.trim().toLowerCase() ?? "";

  return (
    session?.user?.rootAuthorized === true &&
    workspaceDomain === ROOT_WORKSPACE_DOMAIN &&
    email.endsWith(`@${ROOT_WORKSPACE_DOMAIN}`)
  );
}

function localDevelopmentSession(): Session {
  return {
    user: {
      name: "Local development",
      email: `local-development@${ROOT_WORKSPACE_DOMAIN}`,
      image: null,
      rootAuthorized: true,
      workspaceDomain: ROOT_WORKSPACE_DOMAIN,
    },
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}

export async function getRootSession(): Promise<Session | null> {
  if (isAuthDevBypassEnabled()) {
    return localDevelopmentSession();
  }

  const session = await auth();
  return isRootSession(session) ? session : null;
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

export async function requireRootSession(
  returnTo = "/",
): Promise<Session> {
  const session = await getRootSession();

  if (!session) {
    redirect(
      `/login?returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`,
    );
  }

  return session;
}
