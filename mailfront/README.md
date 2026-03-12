# mailfront

Frontend for the mail blasting service.

## Setup

1. Copy `.env.example` to `.env`.
2. Ensure `VITE_API_BASE_URL` points to backend (default: `http://localhost:5001`).
3. Install dependencies:
   - `npm install`
4. Start frontend:
   - `npm run dev`

Default local URL: `http://localhost:5175`.

## Features

- SMTP validation
- Compose campaign subject/body
- Recipients input (comma/newline separated)
- Batch size and delay controls
- Send summary with failed recipients details
