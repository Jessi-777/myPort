# Copilot Instructions for Tica Home

## Project Overview
- **Architecture:** Full-stack MERN (MongoDB, Express, React, Node.js) with TailwindCSS for styling. Two main folders: `frontend/` (React + Tailwind) and `backend/` (Express API).
- **Frontend:** Located in `frontend/`. Uses Vite for build, React for UI, TailwindCSS for styling. Components are in `src/components/`, pages in `src/pages/`.
- **Backend:** Located in `backend/`. Express server with routes in `routes/`, models in `models/`, controllers in `controllers/`, and utility functions in `utils/`. MongoDB Atlas is used for database.

## Developer Workflows
- **Install dependencies:**
  - Backend: `cd backend && npm install`
  - Frontend: `cd frontend && npm install`
- **Run locally:**
  - Backend: `cd backend && npm start`
  - Frontend: `cd frontend && npm run dev`
- **Environment variables:**
  - Backend requires `.env` with `MONGO_URI` and `PORT`.

## Key Patterns & Conventions
- **API routes:** All backend routes are defined in `backend/routes/`. Route files are grouped by feature (e.g., `adminProducts.js`, `stripeRoutes.js`).
- **Controllers:** Business logic is separated into controller files (e.g., `adminProductController.js`).
- **Middleware:** Auth and admin checks are in `backend/middleware/`.
- **Models:** Mongoose schemas are in `backend/models/`.
- **Frontend structure:**
  - Components: `frontend/src/components/`
  - Pages: `frontend/src/pages/`
  - Assets: `frontend/src/assets/`
- **Styling:** TailwindCSS is configured in `frontend/src/tailwind.config.js`.
- **Shop/Stripe integration:** Stripe logic is in `backend/routes/stripeRoutes.js` and `backend/webhook/stripeWebhook.js`. Printify integration is in `backend/utils/printify.js` and `backend/webhook/printifyFulfillment.js`.

## Integration Points
- **MongoDB Atlas:** Used for persistent storage. Connection string in backend `.env`.
- **Stripe:** Payment processing via Stripe API. Webhooks handled in `backend/webhook/stripeWebhook.js`.
- **Printify:** Product fulfillment via Printify API. Webhooks handled in `backend/webhook/printifyFulfillment.js`.

## Project-Specific Notes
- **Admin portal:** Admin authentication and product management are handled via dedicated routes and middleware.
- **Investor info:** Special pages and sections for investor information in frontend.
- **Error boundaries:** Custom error handling in `frontend/src/components/ErrorBoundary.jsx`.
- **Build tools:** Vite for frontend, Node/Express for backend. No monorepo tooling; treat frontend and backend as separate npm projects.

## Examples
- To add a new API route: create a file in `backend/routes/`, add logic in a controller, and register the route in `index.js`.
- To add a new frontend page: create a file in `frontend/src/pages/`, add a route in the main router (usually in `App.jsx`).

---
For more details, see `frontend/README.md` and backend route/controller files.
