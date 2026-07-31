# Incident Report: Vercel 500 Errors on Auth Routes

**Date:** 2026-01-27
**Status:** Resolved (Pending Manual Action)
**Affected Routes:** `/checkauthgmail`, `/checkadmin`
**Environment:** Vercel Production

## Problem
API requests to `/checkauthgmail` and `/checkadmin` failed with HTTP 500 Internal Server Error, while the root route `/` returned 200. Local development environment worked correctly.

## Root Cause
**MongoDB Atlas IP Whitelist Blocking.**
The Vercel Serverless Functions were unable to connect to the MongoDB Atlas cluster. The error logs confirmed:
`MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster.`
`connection to ... closed`

This occurs because Vercel uses dynamic IP addresses which are not on the MongoDB Atlas whitelist.

## Resolution Steps (Manual Action Required)
To fix this, the MongoDB Atlas Network Access settings must be updated:
1.  Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2.  Navigate to **Network Access** under the Security tab.
3.  Click **Add IP Address**.
4.  Option A (Quick Fix): Select **Allow Access from Anywhere** (`0.0.0.0/0`).
5.  Option B (Secure): Whitelist the specific IP ranges used by Vercel (complex).
6.  Save changes.

## Code Changes
*   **Added Logging:** Enhanced `backend/routes/AdminLogin.js` to log specific error messages instead of generic "Server error".
*   **Startup Checks:** Added checks in `backend/server.js` to fail fast if `MONGO_URI` or `JWT_SECRET` are missing.
*   **Cleanup:** Removed deprecated Mongoose connection options (`useNewUrlParser`, `useUnifiedTopology`) from `backend/server.js` to clear log warnings.
