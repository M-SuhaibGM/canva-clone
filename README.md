# Canva Clone

A Canva-style design editor built with Next.js 15, NextAuth, Prisma (MongoDB) and Fabric.js.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill it in. **`NEXTAUTH_SECRET` and `NEXTAUTH_URL` are required** –
   without them the session cookie can't be read and logins bounce back to the login page.
3. `npx prisma generate` (runs automatically on `npm install`)
4. `npm run dev` and open <http://localhost:3000>

## Notes

- `/` and `/register` redirect signed-in users to `/home`; `/home`, `/editor/*` and `/subscription/*`
  redirect signed-out users to `/?callbackUrl=...` (see `middleware.js`).
- Designs autosave while editing. Free accounts can create 5 designs; premium is bought through PayPal
  (`/api/subscription` creates the order, `/subscription/success` captures it).
