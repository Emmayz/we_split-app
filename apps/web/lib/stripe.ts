import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(publishableKey?: string): Promise<Stripe | null> {
  const key = publishableKey ?? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}
