import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import { api } from "./api";

export function usePayment() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay(token: string): Promise<boolean> {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/payments/intent", { token });
      const { clientSecret } = data.data;

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "wesplit",
        merchantCountryCode: "GB",
        style: "alwaysDark",
      });

      if (initError) {
        setError(initError.message);
        return false;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        setError(presentError.message);
        return false;
      }

      return true;
    } catch (err: any) {
      setError(err.message ?? "Payment failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { pay, isLoading, error };
}
