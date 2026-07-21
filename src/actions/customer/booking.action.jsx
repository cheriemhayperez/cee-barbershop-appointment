import { getBarberLabel } from '@/static/customer/barbers';
import { invokeSendBookingEmails } from '@/api/customer/booking.api';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

function emailErrorMessage(raw) {
  if (!raw) return 'Could not send confirmation emails.';

  if (raw.includes('only send testing emails')) {
    return 'Resend test mode: book with the email you used on Resend, or verify a domain at resend.com/domains.';
  }

  if (raw.includes('gmail.com domain is not verified')) {
    return 'Sender email is wrong on the server. FROM must be onboarding@resend.dev until you verify a domain.';
  }

  return raw;
}

async function getFunctionError(data, error) {
  if (data?.error) return data.error;

  if (error?.context) {
    const body = await error.context.json().catch(() => null);
    if (body?.error) return body.error;
  }

  return error?.message;
}

async function sendBookingEmails(payload) {
  const { data, error } = await invokeSendBookingEmails(payload);

  if (data?.success) {
    return data;
  }

  throw new Error(emailErrorMessage(await getFunctionError(data, error)));
}

function bookingMessage(payload, { customerSent, ownerSent }) {
  if (customerSent && ownerSent) {
    return `Confirmation sent to ${payload.email}. The shop owner has been notified.`;
  }

  if (ownerSent) {
    return 'Booking confirmed. Shop owner notified. Customer email skipped (Resend test mode).';
  }

  if (customerSent) {
    return `Confirmation sent to ${payload.email}.`;
  }

  return `You're booked for ${payload.date} at ${payload.time}.`;
}

export async function doSubmitBooking(form) {
  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    service: form.service,
    barber: form.barber,
    barberLabel: getBarberLabel(form.barber),
    date: form.date,
    time: form.time,
  };

  if (!isSupabaseConfigured || !supabase) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      mock: true,
      emailsSent: false,
      message: 'Supabase not configured. Add keys to .env.local to send emails.',
    };
  }

  const result = await sendBookingEmails(payload);

  return {
    success: true,
    mock: false,
    emailsSent: Boolean(result.customerSent || result.ownerSent),
    message: bookingMessage(payload, result),
  };
}
