import type { Metadata } from "next";
import {
  getHandoffSession,
  isPasswordAccessConfigured,
  safeReturnTo,
  signOut,
} from "@/auth";
import { getSiteUpdated } from "../site-updated";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private access",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    returnTo?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const siteUpdated = getSiteUpdated();
  const params = await searchParams;
  const returnTo = safeReturnTo(params.returnTo ?? params.callbackUrl);
  const session = await getHandoffSession();
  const passwordConfigured = isPasswordAccessConfigured();

  return (
    <div className="page-shell login-page">
      <main className="article login-article" aria-labelledby="login-title">
        <header className="article-header stagger-item">
          <h1 id="login-title">UXR Internship Handoff</h1>
          <time dateTime={siteUpdated.dateTime}>{siteUpdated.label}</time>
        </header>

        <section
          className="login-access stagger-item login-delay-one"
          aria-label="Private access"
        >
          {session ? (
            <div className="login-session">
              <p>Access is unlocked on this browser.</p>
              <div className="login-actions">
                <a className="basic-link login-action" href={returnTo}>
                  Continue
                </a>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                >
                  <button
                    className="basic-link login-action"
                    type="submit"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          ) : !passwordConfigured ? (
            <p className="login-notice login-notice-error" role="alert">
              Password access has not been configured yet. The site owner needs
              to add the protected environment variables before anyone can
              enter.
            </p>
          ) : (
            <LoginForm returnTo={returnTo} />
          )}
        </section>
      </main>

      <footer
        className="site-footer login-footer stagger-item login-delay-two"
      >
        <div className="footer-rule" />
        <div className="login-footer-row">
          <span>Root UX Research</span>
          <span>Internal Handoff</span>
          <span>Password protected</span>
        </div>
      </footer>
    </div>
  );
}
