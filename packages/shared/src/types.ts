export type KycStatus = "NONE" | "PENDING" | "VERIFIED" | "REJECTED";
export type SplitStatus = "ACTIVE" | "SETTLED" | "CANCELLED";
export type ContactType = "PHONE" | "EMAIL";
export type PaymentMethod = "APPLE_PAY" | "GOOGLE_PAY" | "CARD";
export type TransactionType = "CREDIT" | "DEBIT" | "WITHDRAWAL";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  walletBalanceGbp: number;
  stripeConnectAccountId: string | null;
  kycStatus: KycStatus;
  createdAt: Date;
}

export interface Split {
  id: string;
  name: string;
  totalGbp: number;
  hostId: string;
  members: SplitMember[];
  lineItems: LineItem[];
  status: SplitStatus;
  createdAt: Date;
  settledAt: Date | null;
}

export interface SplitMember {
  id: string;
  splitId: string;
  guestName: string;
  guestContact: string;
  contactType: ContactType;
  shareGbp: number;
  paid: boolean;
  paidAt: Date | null;
  paymentMethod: PaymentMethod | null;
  stripePaymentIntentId: string | null;
}

export interface LineItem {
  id: string;
  splitId: string;
  name: string;
  priceGbp: number;
  assignedToMemberId: string | null;
}

export interface GuestToken {
  token: string;
  splitId: string;
  memberId: string;
  expiresAt: Date;
  used: boolean;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amountGbp: number;
  description: string;
  splitId: string | null;
  stripePayoutId: string | null;
  status: TransactionStatus;
  createdAt: Date;
}

export interface ParsedReceipt {
  items: { name: string; priceGbp: number }[];
  subtotalGbp: number;
  serviceChargeGbp: number;
  vatGbp: number;
  tipGbp: number;
  totalGbp: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}
