"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { safeReturnTo, signIn } from "@/auth";

export type LoginActionState = {
  attempt: number;
  message: string | null;
  status: "idle" | "error";
};

function failedAttempt(
  previousState: LoginActionState,
  message = "That password didn’t match. Try again.",
): LoginActionState {
  return {
    attempt: previousState.attempt + 1,
    message,
    status: "error",
  };
}

export async function unlockHandoff(
  previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const returnToValue = formData.get("returnTo");
  const passwordValue = formData.get("password");
  const returnTo = safeReturnTo(
    typeof returnToValue === "string" ? returnToValue : undefined,
  );

  try {
    const responseUrl = await signIn("credentials", {
      password: typeof passwordValue === "string" ? passwordValue : "",
      redirect: false,
      redirectTo: returnTo,
    });
    const result =
      typeof responseUrl === "string"
        ? new URL(responseUrl, "https://local.invalid")
        : null;

    if (!result || result.searchParams.has("error")) {
      return failedAttempt(previousState);
    }
  } catch (cause) {
    if (cause instanceof AuthError) {
      return failedAttempt(
        previousState,
        cause.type === "CredentialsSignin"
          ? undefined
          : "The handoff couldn’t be unlocked. Try again.",
      );
    }

    return failedAttempt(
      previousState,
      "The handoff couldn’t be unlocked. Try again.",
    );
  }

  redirect(returnTo);
}
