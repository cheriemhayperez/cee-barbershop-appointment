import { EMAIL_BRAND } from "../../../../src/constants/email.brand.js";
import { barberText } from "../../../../src/utils/bookingUtils.js";
import { formatDisplayDate } from "../../../../src/utils/dateUtils.js";
import { escapeHtml } from "../../../../src/utils/htmlUtils.js";
import { formatTime12 } from "../../../../src/utils/scheduleUtils.js";
import { SHOP } from "../config.ts";

type SummaryRow = { label: string; value: string };

function summaryTable(rows: SummaryRow[]) {
  const rowHtml = rows
    .map(
      (row, index) => `
        <tr>
          <td style="padding:${index === 0 ? "0" : "10px"} 0 10px;border-bottom:${
        index === rows.length - 1 ? "none" : `1px solid ${EMAIL_BRAND.border}`
      };">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-size:13px;line-height:1.4;color:${EMAIL_BRAND.muted};padding:0;vertical-align:top;">${row.label}</td>
                <td align="right" style="font-size:15px;line-height:1.4;color:${EMAIL_BRAND.text};font-weight:600;padding:0 0 0 16px;vertical-align:top;">${row.value}</td>
              </tr>
            </table>
          </td>
        </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${EMAIL_BRAND.bg};border:1px solid ${EMAIL_BRAND.border};border-radius:12px;">
      <tr>
        <td style="padding:16px 18px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${rowHtml}
          </table>
        </td>
      </tr>
    </table>`;
}

function emailShell(options: {
  title: string;
  lead: string;
  icon: "check" | "bell";
  rows: SummaryRow[];
  note?: string;
  footer?: string;
}) {
  const iconChar = options.icon === "check" ? "✓" : "!";

  const noteBlock = options.note
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;">
        <tr>
          <td style="padding:14px 16px;border-radius:8px;background:${EMAIL_BRAND.goldSoft};border:1px solid ${EMAIL_BRAND.goldBorder};font-size:15px;line-height:1.6;color:${EMAIL_BRAND.text};">
            ${options.note}
          </td>
        </tr>
      </table>`
    : "";

  const footerBlock = options.footer
    ? `
      <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:${EMAIL_BRAND.muted};text-align:center;">
        ${options.footer}
      </p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(options.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${EMAIL_BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${EMAIL_BRAND.bg};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${EMAIL_BRAND.surface};border:1px solid ${EMAIL_BRAND.border};border-radius:12px;box-shadow:0 1px 3px rgba(20,20,20,0.06);">
            <tr>
              <td style="padding:32px 28px;text-align:center;">
                <div style="width:56px;height:56px;margin:0 auto 16px;border-radius:999px;background:${EMAIL_BRAND.goldSoft};border:1px solid ${EMAIL_BRAND.goldBorder};line-height:56px;text-align:center;color:${EMAIL_BRAND.gold};font-size:28px;font-weight:700;">
                  ${iconChar}
                </div>
                <h1 style="margin:0 0 8px;font-size:26px;line-height:1.3;color:${EMAIL_BRAND.gold};font-weight:700;">${escapeHtml(options.title)}</h1>
                <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:${EMAIL_BRAND.muted};">${options.lead}</p>
                ${summaryTable(options.rows)}
                ${noteBlock}
                ${footerBlock}
                <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:${EMAIL_BRAND.muted};">
                  <strong style="color:${EMAIL_BRAND.text};">${escapeHtml(SHOP.name)}</strong><br />
                  ${escapeHtml(SHOP.address)}<br />
                  ${escapeHtml(SHOP.phone)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function customerEmailHtml(booking: Record<string, string>) {
  const name = escapeHtml(booking.name);
  const service = escapeHtml(booking.service);
  const barber = escapeHtml(barberText(booking.barber, booking.barberLabel));
  const date = escapeHtml(formatDisplayDate(booking.date));
  const time = escapeHtml(formatTime12(booking.time));

  return emailShell({
    title: "You're booked!",
    lead: `Hi ${name}, see you at ${SHOP.name}. Your appointment details are below.`,
    icon: "check",
    rows: [
      { label: "Date", value: date },
      { label: "Time", value: time },
      { label: "Service", value: service },
      { label: "Barber", value: barber },
    ],
    note: "Need to make a change? Call us or reply to this email and we'll help.",
    footer: `Questions? Call ${escapeHtml(SHOP.phone)}.`,
  });
}

export function ownerEmailHtml(booking: Record<string, string>) {
  const name = escapeHtml(booking.name);
  const email = escapeHtml(booking.email);
  const service = escapeHtml(booking.service);
  const barber = escapeHtml(barberText(booking.barber, booking.barberLabel, true));
  const date = escapeHtml(formatDisplayDate(booking.date));
  const time = escapeHtml(formatTime12(booking.time));

  return emailShell({
    title: "New booking",
    lead: "Someone just booked online. Here are the details.",
    icon: "bell",
    rows: [
      { label: "Customer", value: name },
      {
        label: "Email",
        value: `<a href="mailto:${email}" style="color:${EMAIL_BRAND.gold};text-decoration:none;">${email}</a>`,
      },
      { label: "Date", value: date },
      { label: "Time", value: time },
      { label: "Service", value: service },
      { label: "Barber", value: barber },
    ],
    note: "Open your admin dashboard to review or manage this appointment.",
  });
}
