/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import shop from "../../../src/static/shop.json" with { type: "json" };

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SHOP_OWNER_EMAIL = Deno.env.get("SHOP_OWNER_EMAIL");
const FROM_EMAIL = "onboarding@resend.dev";

const SHOP = {
  name: shop.name,
  phone: shop.phone,
  address: `${shop.address}, ${shop.city}`,
};

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time: string) {
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m), 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function barberText(barber: string, barberLabel: string, forOwner = false) {
  if (barber === "any") {
    return forOwner ? "No preference" : "Any available barber";
  }
  return barberLabel;
}

function customerEmailHtml(booking: Record<string, string>) {
  const when = `${formatDate(booking.date)} at ${formatTime(booking.time)}`;
  const barber = barberText(booking.barber, booking.barberLabel);

  return `
    <p>Hi ${booking.name},</p>
    <p>Your appointment at ${SHOP.name} is confirmed.</p>
    <p>
      <strong>Service:</strong> ${booking.service}<br>
      <strong>Barber:</strong> ${barber}<br>
      <strong>When:</strong> ${when}
    </p>
    <p>Questions? Call ${SHOP.phone} or reply to this email.</p>
    <p>${SHOP.name}<br>${SHOP.address}</p>
  `;
}

function ownerEmailHtml(booking: Record<string, string>) {
  const when = `${formatDate(booking.date)} at ${formatTime(booking.time)}`;
  const barber = barberText(booking.barber, booking.barberLabel, true);

  return `
    <p>New online booking.</p>
    <p>
      <strong>Customer:</strong> ${booking.name}<br>
      <strong>Email:</strong> ${booking.email}<br>
      <strong>Service:</strong> ${booking.service}<br>
      <strong>Barber:</strong> ${barber}<br>
      <strong>When:</strong> ${when}
    </p>
  `;
}

async function sendViaResend(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

async function trySend(to: string, subject: string, html: string) {
  try {
    await sendViaResend(to, subject, html);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (!RESEND_API_KEY || !SHOP_OWNER_EMAIL) {
    return json({ success: false, error: "Missing RESEND_API_KEY or SHOP_OWNER_EMAIL" }, 500);
  }

  try {
    const booking = await req.json();

    if (!booking.name || !booking.email || !booking.service || !booking.date || !booking.time) {
      return json({ success: false, error: "Missing booking fields" }, 400);
    }

    const customer = await trySend(
      booking.email,
      `Your ${SHOP.name} appointment is confirmed`,
      customerEmailHtml(booking),
    );

    const owner = await trySend(
      SHOP_OWNER_EMAIL,
      `New booking: ${booking.name} — ${booking.service}`,
      ownerEmailHtml(booking),
    );

    if (!customer.ok && !owner.ok) {
      const err = customer.message || owner.message || "Could not send email";
      return json({ success: false, error: err }, 500);
    }

    return json({
      success: true,
      customerSent: customer.ok,
      ownerSent: owner.ok,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return json({ success: false, error: message }, 500);
  }
});
