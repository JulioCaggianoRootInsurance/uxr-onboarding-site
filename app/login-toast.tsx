"use client";

import { useEffect, useState } from "react";

type LoginToastProps = {
  message: string;
};

function removeLoginErrorFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("error");
  url.searchParams.delete("code");
  window.history.replaceState(
    {},
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}

export function LoginToast({ message }: LoginToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setVisible(false);
      removeLoginErrorFromUrl();
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [message]);

  if (!visible) return null;

  return (
    <div
      className="login-toast"
      id="login-error"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          removeLoginErrorFromUrl();
        }}
      >
        Dismiss
      </button>
    </div>
  );
}
