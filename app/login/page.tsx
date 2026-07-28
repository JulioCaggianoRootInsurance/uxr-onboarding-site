import type { Metadata } from "next";
import {
  getRootSession,
  isAuthDevBypassEnabled,
  safeReturnTo,
  signIn,
  signOut,
} from "@/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
    returnTo?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const returnTo = safeReturnTo(params.returnTo ?? params.callbackUrl);
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const session = await getRootSession();
  const developmentBypass = isAuthDevBypassEnabled();

  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "32px 20px",
        background: "#f4f0e8",
        color: "#1f1d19",
      }}
    >
      <section
        aria-labelledby="login-title"
        style={{
          width: "min(100%, 420px)",
          borderTop: "2px solid #FF672B",
          padding: "28px 0 0",
        }}
      >
        <p
          style={{
            margin: "0 0 28px",
            color: "#766f65",
            fontSize: "13px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Root UX Research
        </p>
        <h1
          id="login-title"
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(28px, 7vw, 42px)",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          Internship handoff
        </h1>
        <p
          style={{
            margin: "0 0 28px",
            color: "#5f5a52",
            fontSize: "15px",
            lineHeight: 1.55,
          }}
        >
          This internal site is available to Root employees. Use your{" "}
          <strong>@joinroot.com</strong> Google Workspace account to continue.
        </p>

        {error ? (
          <p
            role="alert"
            style={{
              margin: "0 0 20px",
              padding: "12px 14px",
              border: "1px solid #FF672B",
              color: "#8a3415",
              fontSize: "14px",
              lineHeight: 1.45,
            }}
          >
            Sign-in was not completed. Make sure you selected your Root Google
            Workspace account.
          </p>
        ) : null}

        {developmentBypass ? (
          <>
            <p
              style={{
                margin: "0 0 18px",
                padding: "12px 14px",
                background: "#ffe0d3",
                fontSize: "14px",
                lineHeight: 1.45,
              }}
            >
              Local development bypass is active. Google sign-in remains
              required in every production environment.
            </p>
            <a href={returnTo} style={primaryActionStyle}>
              Continue locally
            </a>
          </>
        ) : session ? (
          <>
            <p
              style={{
                margin: "0 0 18px",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              Signed in as <strong>{session.user.email}</strong>
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <a href={returnTo} style={primaryActionStyle}>
                Continue
              </a>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button type="submit" style={secondaryActionStyle}>
                  Sign out
                </button>
              </form>
            </div>
          </>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: returnTo });
            }}
          >
            <button type="submit" style={primaryButtonStyle}>
              Sign in with Root Google
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

const primaryActionStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "44px",
  padding: "0 18px",
  background: "#FF672B",
  color: "#1f1d19",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
};

const primaryButtonStyle = {
  ...primaryActionStyle,
  border: 0,
  cursor: "pointer",
};

const secondaryActionStyle = {
  minHeight: "44px",
  padding: 0,
  border: 0,
  borderBottom: "1px solid currentColor",
  background: "transparent",
  color: "#1f1d19",
  fontSize: "14px",
  cursor: "pointer",
};
