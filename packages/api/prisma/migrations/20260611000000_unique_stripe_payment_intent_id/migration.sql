-- Add unique constraint on stripePaymentIntentId to prevent payment replay attacks.
-- NULL values are excluded from uniqueness checks in PostgreSQL so existing unset rows are unaffected.
CREATE UNIQUE INDEX "split_members_stripePaymentIntentId_key" ON "split_members"("stripePaymentIntentId");
