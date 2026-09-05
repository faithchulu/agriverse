-- Purchases no longer change a dataset's marketplace status.
-- Restore datasets marked SOLD by the previous one-purchase-only behavior.
UPDATE "datasets"
SET "status" = 'LIVE'
WHERE "status" = 'SOLD';
