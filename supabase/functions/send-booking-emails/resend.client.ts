import { FROM_EMAIL, FROM_NAME, RESEND_API_KEY } from "./config.ts";

function fromAddress() {
  return `${FROM_NAME} <${FROM_EMAIL}>`;
}

async function sendViaResend(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: fromAddress(), to, subject, html }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export async function trySend(to: string, subject: string, html: string) {
  try {
    await sendViaResend(to, subject, html);
    return { ok: true as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false as const, message };
  }
}
