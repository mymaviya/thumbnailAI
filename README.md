# AI Thumbnail Maker

Nuxt 3 app for Google-authenticated AI thumbnail generation, Razorpay payments, secure HD downloads, and admin reporting.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill the values:

   ```bash
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
   AUTH_SESSION_SECRET="generate-a-long-random-secret"
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   OPENAI_API_KEY=
   RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   RAZORPAY_WEBHOOK_SECRET=
   NUXT_PUBLIC_SITE_URL="https://your-domain.com"
   ```

3. Generate Prisma Client and run migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. Configure Google OAuth:

   - Authorized redirect URI: `https://your-domain.com/api/auth/google/callback`
   - Local redirect URI: `http://localhost:3000/api/auth/google/callback`

5. Configure Razorpay:

   - Checkout uses `RAZORPAY_KEY_ID` publicly and verifies signatures server-side with `RAZORPAY_KEY_SECRET`.
   - Webhook URL: `https://your-domain.com/api/webhooks/razorpay`
   - Webhook event: `payment.captured`
   - Webhook secret must match `RAZORPAY_WEBHOOK_SECRET`.

6. Start the app:

   ```bash
   npm run dev
   ```

## Admin Access

New Google users are created with `role = user`. Promote an admin in your database after the first login:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

Admin pages:

- `/admin`
- `/admin/users`
- `/admin/downloads`

## Security Notes

- OpenAI, Google, Razorpay secret, and webhook secret keys are server-only.
- Generated HD images are stored under `.storage/thumbnails` and are not publicly served.
- Watermarked previews are stored under `public/uploads/thumbnails`.
- HD downloads are served only through `/api/downloads/:thumbnailId`.
- Download authorization checks login, ownership, and `paymentStatus = paid`.
- Razorpay checkout and webhook signatures are verified server-side.
- Webhook download creation is idempotent with a unique user/thumbnail download record.

## Database Provider

The Prisma schema is currently set to MySQL:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

For PostgreSQL, change `provider = "postgresql"` and use a PostgreSQL `DATABASE_URL`, then run `npm run db:migrate`.
