"use client";

import { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "../lib/stripe";

interface InnerProps {
  token: string;
  contactInfo: string;
  shareGbp: number;
  onSuccess: () => void;
}

function CheckoutForm({ token, contactInfo, shareGbp, onSuccess }: InnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Payment failed");
      setLoading(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${token}/success`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
        await fetch(`${apiUrl}/guest/${token}/pay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id, contactInfo }),
        });
      } catch (err) {
        console.error("Backend confirmation failed:", err);
      }
      onSuccess();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <PaymentElement />
      {error && <p style={{ color: "#FF4D6D", margin: 0, fontSize: "14px" }}>{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        style={{
          backgroundColor: loading || !stripe ? "#1C1C2A" : "#00E5FF",
          color: "#0B0B14",
          border: "none",
          borderRadius: "12px",
          padding: "16px 24px",
          fontSize: "16px",
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
          cursor: loading || !stripe ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          width: "100%",
        }}
      >
        {loading ? "Processing..." : `Pay £${shareGbp.toFixed(2)}`}
      </button>
    </form>
  );
}

interface Props {
  clientSecret: string;
  publishableKey: string;
  token: string;
  contactInfo: string;
  shareGbp: number;
  onSuccess: () => void;
}

export function PaymentForm({ clientSecret, publishableKey, token, contactInfo, shareGbp, onSuccess }: Props) {
  const appearance = {
    theme: "night" as const,
    variables: {
      colorPrimary: "#00E5FF",
      colorBackground: "#1C1C2A",
      colorText: "#F0EEE7",
      colorDanger: "#FF4D6D",
      fontFamily: "'Space Grotesk', sans-serif",
      borderRadius: "8px",
    },
    rules: {
      ".Input": { border: "1px solid #1F1F2D", backgroundColor: "#14141F" },
      ".Input:focus": { border: "1px solid #00E5FF" },
    },
  };

  return (
    <Elements stripe={getStripe(publishableKey)} options={{ clientSecret, appearance }}>
      <CheckoutForm token={token} contactInfo={contactInfo} shareGbp={shareGbp} onSuccess={onSuccess} />
    </Elements>
  );
}
