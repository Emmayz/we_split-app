import twilio from "twilio";
import { Resend } from "resend";
import { ContactType } from "@wesplit/shared";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSMS(to: string, message: string): Promise<void> {
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  await resend.emails.send({
    from: "wesplit <noreply@wesplit.co>",
    to,
    subject,
    html,
  });
}

export async function sendGuestInvite(
  contact: string,
  contactType: ContactType,
  guestName: string,
  hostName: string,
  splitName: string,
  shareGbp: number,
  token: string
): Promise<void> {
  const webUrl = process.env.WEB_URL ?? "http://localhost:3001";
  const payLink = `${webUrl}/pay/${token}`;
  const share = `£${shareGbp.toFixed(2)}`;

  if (contactType === "PHONE") {
    await sendSMS(
      contact,
      `Hi ${guestName}! ${hostName} is requesting your share of "${splitName}": ${share}. Pay here: ${payLink}`
    );
  } else {
    await sendEmail(
      contact,
      `Your share of "${splitName}" – ${share}`,
      `<p>Hi ${guestName},</p><p>${hostName} has requested your share of <strong>${splitName}</strong>: <strong>${share}</strong>.</p><p><a href="${payLink}">Pay now</a></p>`
    );
  }
}

export async function sendReminder(
  contact: string,
  contactType: ContactType,
  guestName: string,
  splitName: string,
  shareGbp: number,
  token: string
): Promise<void> {
  const webUrl = process.env.WEB_URL ?? "http://localhost:3001";
  const payLink = `${webUrl}/pay/${token}`;
  const share = `£${shareGbp.toFixed(2)}`;

  if (contactType === "PHONE") {
    await sendSMS(
      contact,
      `Reminder: ${guestName}, your share of "${splitName}" is ${share}. Pay here: ${payLink}`
    );
  } else {
    await sendEmail(
      contact,
      `Reminder: your share of "${splitName}" – ${share}`,
      `<p>Hi ${guestName},</p><p>Just a reminder that your share of <strong>${splitName}</strong> is <strong>${share}</strong>.</p><p><a href="${payLink}">Pay now</a></p>`
    );
  }
}

export async function sendPaymentConfirmation(
  contact: string,
  contactType: ContactType,
  guestName: string,
  amountGbp: number
): Promise<void> {
  const amount = `£${amountGbp.toFixed(2)}`;
  if (contactType === "PHONE") {
    await sendSMS(contact, `Payment confirmed! ${guestName}, you paid ${amount}. Thanks for using wesplit.`);
  } else {
    await sendEmail(
      contact,
      `Payment confirmed – ${amount}`,
      `<p>Hi ${guestName},</p><p>Your payment of <strong>${amount}</strong> has been received. Thanks for using wesplit!</p>`
    );
  }
}

export async function notifyHostPaymentReceived(
  _userId: string,
  guestName: string,
  amountGbp: number
): Promise<void> {
  // Push notifications would require Expo push tokens stored per user.
  // Logged here; implement when push token storage is added.
  console.log(`[Push] Host notified: ${guestName} paid £${amountGbp.toFixed(2)}`);
}
