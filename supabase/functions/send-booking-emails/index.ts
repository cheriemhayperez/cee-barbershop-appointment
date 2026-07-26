/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { cors, FROM_EMAIL, RESEND_API_KEY, SHOP, SHOP_OWNER_EMAIL } from "./config.ts";
import { trySend } from "./resend.client.ts";
import { customerEmailHtml, ownerEmailHtml } from "./templates/emails.ts";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function isValidBooking(booking: Record<string, string>) {
  return Boolean(
    booking.name && booking.email && booking.service && booking.date && booking.time,
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (!RESEND_API_KEY || !SHOP_OWNER_EMAIL || !FROM_EMAIL) {
    return json(
      { success: false, error: "Missing RESEND_API_KEY, SHOP_OWNER_EMAIL, or FROM_EMAIL" },
      500,
    );
  }

  try {
    const booking = await req.json();

    if (!isValidBooking(booking)) {
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
