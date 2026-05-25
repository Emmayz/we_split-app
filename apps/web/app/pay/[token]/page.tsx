"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DivisionLogo } from "../../../components/DivisionLogo";
import { PaymentForm } from "../../../components/PaymentForm";
import { fetchGuestInfo, createPaymentIntent } from "../../../lib/api";

interface GuestInfo {
  splitName: string;
  hostName: string;
  memberName: string;
  shareGbp: number;
  currency: string;
  contactType: "PHONE" | "EMAIL";
  alreadyPaid: boolean;
}

interface PaymentData {
  clientSecret: string;
  publishableKey: string;
}

export default function PayPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = params.token;

  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [contactInfo, setContactInfo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"contact" | "payment">("contact");

  useEffect(() => {
    async function load() {
      try {
        const info = await fetchGuestInfo(token);
        if (info.alreadyPaid) {
          router.replace(`/pay/${token}/success`);
          return;
        }
        setGuestInfo(info);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load";
        if (msg.includes("expired") || msg.includes("used")) {
          router.replace(`/pay/${token}/expired`);
        } else {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, router]);

  async function handleContinue() {
    if (!contactInfo.trim()) return;
    setLoading(true);
    try {
      const data = await createPaymentIntent(token);
      setPaymentData(data);
      setStep("payment");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start payment");
    } finally {
      setLoading(false);
    }
  }

  const container: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "#0B0B14",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  };

  const card: React.CSSProperties = {
    backgroundColor: "#14141F",
    border: "1px solid #1F1F2D",
    borderRadius: "24px",
    padding: "32px",
    width: "100%",
    maxWidth: "440px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  if (loading && !guestInfo) {
    return (
      <div style={container}>
        <DivisionLogo size={48} />
        <p style={{ color: "#8A8A9B", marginTop: "16px" }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={container}>
        <DivisionLogo size={48} color="#FF4D6D" />
        <p style={{ color: "#FF4D6D", marginTop: "16px", textAlign: "center" }}>{error}</p>
      </div>
    );
  }

  if (!guestInfo) return null;

  return (
    <div style={container}>
      <div style={card}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <DivisionLogo size={40} />
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#F0EEE7" }}>wesplit</span>
        </div>

        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "4px" }}>
          <p style={{ color: "#8A8A9B", margin: 0, fontSize: "14px" }}>
            {guestInfo.hostName} is requesting your share of
          </p>
          <p style={{ color: "#F0EEE7", margin: 0, fontWeight: 600 }}>{guestInfo.splitName}</p>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "48px", fontWeight: 700, color: "#F0EEE7", margin: 0, fontVariantNumeric: "tabular-nums" }}>
            £{guestInfo.shareGbp.toFixed(2)}
          </p>
          <p style={{ color: "#8A8A9B", margin: "4px 0 0", fontSize: "14px" }}>
            {guestInfo.memberName}&apos;s share
          </p>
        </div>

        {step === "contact" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ color: "#8A8A9B", fontSize: "13px", fontWeight: 500 }}>
                Where should we send your receipt?
              </span>
              <input
                type={guestInfo.contactType === "PHONE" ? "tel" : "email"}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder={guestInfo.contactType === "PHONE" ? "+44 7700 900000" : "you@email.com"}
                style={{
                  backgroundColor: "#14141F",
                  border: "1px solid #1F1F2D",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#F0EEE7",
                  fontSize: "16px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </label>
            <button
              onClick={handleContinue}
              disabled={!contactInfo.trim() || loading}
              style={{
                backgroundColor: contactInfo.trim() && !loading ? "#00E5FF" : "#1C1C2A",
                color: "#0B0B14",
                border: "none",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: !contactInfo.trim() || loading ? "not-allowed" : "pointer",
                width: "100%",
              }}
            >
              {loading ? "Loading..." : "Continue to Payment"}
            </button>
          </div>
        )}

        {step === "payment" && paymentData && (
          <PaymentForm
            clientSecret={paymentData.clientSecret}
            publishableKey={paymentData.publishableKey}
            token={token}
            contactInfo={contactInfo}
            shareGbp={guestInfo.shareGbp}
            onSuccess={() => router.push(`/pay/${token}/success?amount=${guestInfo.shareGbp.toFixed(2)}&contact=${encodeURIComponent(contactInfo)}`)}
          />
        )}
      </div>
    </div>
  );
}
