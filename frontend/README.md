# AgriVerse Frontend

The frontend is the Next.js web application for AgriVerse. It provides the farmer dashboard, buyer marketplace, dataset management, purchases, licenses, transactions, analytics, and account workflows.

## Prerequisites

Install Node.js 18 or newer and npm.

## Install

From the project root:

```powershell
cd frontend
npm install
```

## Configure the API URL

For local development, no environment file is required. The frontend defaults to:

```text
http://localhost:5000/api
```

To use another backend, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Use the deployed backend URL when running against a hosted API. Restart the Next.js server after changing environment variables.

## Run the Frontend

Start the development server:

```powershell
npm run dev
```

Open `http://localhost:3000` in a browser. The backend should be running separately for authentication, API requests, dataset uploads, and downloads to work.

## Build and Run for Production

```powershell
npm run build
npm start
```

The production server runs at `http://localhost:3000` by default.

## Useful Commands

- `npm run dev` - start the development server.
- `npm run build` - create a production build.
- `npm start` - serve the production build.
- `npm run lint` - run the configured Next.js lint command.
