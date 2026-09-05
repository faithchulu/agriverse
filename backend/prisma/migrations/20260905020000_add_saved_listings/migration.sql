-- Persist buyer marketplace bookmarks.
CREATE TABLE "saved_listings" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_listings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "saved_listings_buyerId_datasetId_key"
ON "saved_listings"("buyerId", "datasetId");

CREATE INDEX "saved_listings_buyerId_idx" ON "saved_listings"("buyerId");
CREATE INDEX "saved_listings_datasetId_idx" ON "saved_listings"("datasetId");

ALTER TABLE "saved_listings"
ADD CONSTRAINT "saved_listings_buyerId_fkey"
FOREIGN KEY ("buyerId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "saved_listings"
ADD CONSTRAINT "saved_listings_datasetId_fkey"
FOREIGN KEY ("datasetId") REFERENCES "datasets"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
