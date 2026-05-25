const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function fetchGuestInfo(token: string) {
  const res = await fetch(`${BASE_URL}/guest/${token}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Failed to load payment info");
  return json.data as {
    splitName: string;
    hostName: string;
    memberName: string;
    shareGbp: number;
    currency: string;
    contactType: "PHONE" | "EMAIL";
    alreadyPaid: boolean;
  };
}

export async function createPaymentIntent(token: string): Promise<{ clientSecret: string; publishableKey: string }> {
  const res = await fetch(`${BASE_URL}/payments/intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Failed to create payment");
  return json.data;
}

export async function confirmGuestPayment(
  token: string,
  paymentIntentId: string,
  contactInfo: string
) {
  const res = await fetch(`${BASE_URL}/guest/${token}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentIntentId, contactInfo }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Failed to confirm payment");
  return json.data;
}
