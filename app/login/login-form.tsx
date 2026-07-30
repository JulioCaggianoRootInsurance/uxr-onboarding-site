"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { LoginToast } from "../login-toast";
import { type LoginActionState, unlockHandoff } from "./actions";

type LoginFormProps = {
  returnTo: string;
};

const initialLoginState: LoginActionState = {
  attempt: 0,
  message: null,
  status: "idle",
};

export function LoginForm({ returnTo }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(
    unlockHandoff,
    initialLoginState,
  );
  const passwordInput = useRef<HTMLInputElement>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const hasError = state.status === "error" && Boolean(state.message);

  useEffect(() => {
    if (!hasError || !passwordInput.current) return;

    passwordInput.current.value = "";
    passwordInput.current.focus();
  }, [hasError, state.attempt]);

  return (
    <>
      {hasError ? (
        <LoginToast
          key={state.attempt}
          message={state.message ?? "That password didn’t match. Try again."}
        />
      ) : null}

      <form className="login-form" action={formAction}>
        <input name="returnTo" type="hidden" value={returnTo} />
        <div className="login-field-row">
          <label className="login-label" htmlFor="handoff-password">
            Password
          </label>
          <div className="login-password-control">
            <input
              ref={passwordInput}
              className="login-input"
              id="handoff-password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter shared password"
              aria-invalid={hasError ? "true" : undefined}
              aria-describedby={
                hasError
                  ? "login-password-help login-error"
                  : "login-password-help"
              }
              autoFocus
            />
            <button
              className="login-password-toggle"
              type="button"
              aria-controls="handoff-password"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              aria-pressed={passwordVisible}
              onClick={() => setPasswordVisible((visible) => !visible)}
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
          <button
            className="login-submit"
            type="submit"
            disabled={pending}
            aria-disabled={pending}
          >
            <span>{pending ? "Checking" : "Continue"}</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <p className="login-help" id="login-password-help">
          Shared privately with Root collaborators.
        </p>
      </form>
    </>
  );
}
