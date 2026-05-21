# thumbnailAI

AI thumbnail generator for YouTube creators.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your private OpenAI API key to `.env`:

   ```bash
   OPENAI_API_KEY=sk-your-real-openai-api-key
   NUXT_PUBLIC_SITE_URL=https://thumbcraftai.com
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

The OpenAI key is read only on the server through `/api/generate-thumbnail`; it is not exposed to the browser.
