"use client";

import { useState } from "react";

export function CopyablePrompt({
  title,
  introduction,
  prompt,
}: {
  title: string;
  introduction: string;
  prompt: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="copyable-prompt" aria-labelledby="copyable-prompt-title">
      <div className="copyable-prompt-heading">
        <div>
          <h3 id="copyable-prompt-title">{title}</h3>
          <p>{introduction}</p>
        </div>
        <button onClick={copyPrompt} type="button">
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </div>
      <pre aria-label={`${title}. Select the text to copy manually if needed.`}>
        <code>{prompt}</code>
      </pre>
    </section>
  );
}
