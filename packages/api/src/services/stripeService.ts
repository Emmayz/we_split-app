import Stripe from "stripe";
import { gbpToPence } from "../utils/money";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
  typescript: true,
});

export async function createPaymentIntent(
  amountGbp: number,
  metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: gbpToPence(amountGbp),
    currency: "gbp",
    payment_method_types: ["card"],
    payment_method_options: {
      card: {
        request_three_d_secure: "automatic",
      },
    },
    metadata,
    confirm: false,
  });
}

export async function retrievePaymentIntent(
  id: string
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(id);
}

export async function createConnectAccount(
  userId: string,
  email: string,
  webUrl: string
): Promise<string> {
  const account = await stripe.accounts.create({
    type: "express",
    country: "GB",
    email,
    capabilities: {
      transfers: { requested: true },
    },
    metadata: { userId },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${webUrl}/kyc/refresh`,
    return_url: `${webUrl}/kyc/return`,
    type: "account_onboarding",
  });

  return accountLink.url;
}

export async function getOrCreateConnectAccount(
  userId: string,
  email: string,
  existingAccountId: string | null,
  webUrl: string
): Promise<{ accountId: string; onboardingUrl: string }> {
  let accountId = existingAccountId;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "GB",
      email,
      capabilities: {
        transfers: { requested: true },
      },
      metadata: { userId },
    });
    accountId = account.id;
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${webUrl}/kyc/refresh`,
    return_url: `${webUrl}/kyc/return`,
    type: "account_onboarding",
  });

  return { accountId, onboardingUrl: accountLink.url };
}

export async function createPayout(
  stripeAccountId: string,
  amountGbp: number
): Promise<Stripe.Payout> {
  return stripe.payouts.create(
    {
      amount: gbpToPence(amountGbp),
      currency: "gbp",
      method: "instant",
    },
    {
      stripeAccount: stripeAccountId,
    }
  );
}

export function constructWebhookEvent(
  body: Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET ?? ""
  );
}
