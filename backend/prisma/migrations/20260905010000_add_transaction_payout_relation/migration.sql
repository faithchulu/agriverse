-- Link released transactions to the payout that claims them.
ALTER TABLE "transactions"
ADD COLUMN "payoutId" TEXT;

CREATE INDEX "transactions_payoutId_idx" ON "transactions"("payoutId");

ALTER TABLE "transactions"
ADD CONSTRAINT "transactions_payoutId_fkey"
FOREIGN KEY ("payoutId") REFERENCES "payouts"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
