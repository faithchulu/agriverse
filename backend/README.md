# AgriVerse Backend

The backend is the Express API for authentication, users, datasets, marketplace listings, payments, licenses, and analytics. Dataset files are stored in Cloudflare R2 and metadata is stored in PostgreSQL through Prisma.

## Prerequisites

Install the following before starting:

- Node.js 18 or newer and npm.
- A PostgreSQL database, either local or hosted such as Neon or Supabase.
- A Cloudflare R2 bucket named `agriverse-storage`.
- R2 S3 API credentials with permission to read, write, and delete objects in that bucket.

## Install

From the project root:

```powershell
cd backend
npm install
```

## Configure Environment

Create `backend/.env`. Do not commit this file or place real credentials in a README.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
PORT=5000
CORS_ORIGIN="http://localhost:3000"

R2_ENDPOINT="your-storage-endpoint"
R2_BUCKET="agriverse-storage"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
```

`R2_ENDPOINT` may include the bucket path shown above. Uploaded datasets are stored under the `datasets/` prefix. Authorized license downloads are streamed from R2.

## Prepare the Database

Generate the Prisma client and apply existing migrations:

```powershell
npm run build
npx prisma migrate deploy
```

For local schema development, use `npm run prisma:migrate` instead of `npx prisma migrate deploy` when creating a new migration.

## Run the Backend

For development with automatic restarts:

```powershell
npm run dev
```

For production-style execution:

```powershell
npm start
```

The API is available at `http://localhost:5000`. Check the application and database with:

```powershell
Invoke-WebRequest http://localhost:5000/
Invoke-WebRequest http://localhost:5000/health/db
```

Useful commands:

- `npm run build` - generate the Prisma client.
- `npm run prisma:studio` - open Prisma Studio.
- `npm run prisma:migrate` - create/apply a development migration.
