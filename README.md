# AgriVerse

AgriVerse is a data marketplace for agricultural datasets. Farmers can upload and list datasets, while buyers can discover listings, purchase access, and download licensed data. The platform is designed to support secure data ownership, marketplace transactions, and future blockchain-based payment and access-right enforcement.

## Project Structure

- `frontend/` - Next.js web application for farmer and buyer workflows.
- `backend/` - Express API, authentication, marketplace logic, payments, analytics, and dataset storage.
- `backend/prisma/` - Prisma schema and PostgreSQL migrations.
- `backend/smart-contracts/` - Solidity contracts and Hardhat tests for the blockchain layer.

## High-Level Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, ApexCharts, Axios.
- **Backend:** Node.js, Express 5, JavaScript, Zod validation, JWT authentication, Multer uploads.
- **Database:** PostgreSQL managed through Prisma ORM.
- **Object storage:** Cloudflare R2 through the S3-compatible AWS SDK client.
- **Blockchain:** Solidity contracts with Hardhat tooling.
- **Development tooling:** npm, Nodemon, ESLint, Prettier, and Prisma CLI.

## Local Development

Use two terminals from the project root:

```powershell
cd backend
npm install
npm run dev
```

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` and the backend runs at `http://localhost:5000`.

See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for complete setup instructions and environment variables.
