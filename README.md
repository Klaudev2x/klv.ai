# klv.ai - AI Creative Studio

Premium black and white AI creative studio frontend with:

- Home, Create, Explore, Pricing, and Dashboard routes
- Prompt enhancement and unsafe prompt refusal
- Image and video generation mock flow with saved history
- Free to Max pricing plans, queue labels, and watermark behavior
- Account sign-in mock with Firebase/Supabase-ready hooks
- Paystack subscription checkout for paid plans
- Cartoon, anime, cinematic, realistic, render, horror, and video artwork assets

## Run locally

```bash
npm start
```

Open:

```text
http://localhost:4173
```

## Paystack checkout

Paid pricing buttons open Paystack InlineJS checkout.

1. Open [app.js](</C:/Users/kliff/Documents/Codex/2026-05-30/project-name-klv-ai-ai-creative/app.js:3>).
2. Replace `pk_test_REPLACE_WITH_YOUR_PAYSTACK_PUBLIC_KEY` with your Paystack public key.
3. Set `PAYSTACK_CONFIG.currency` to the currency enabled on your Paystack account.
4. Update `planCheckout` amounts if you want different prices. Amounts are in the smallest currency unit, so `$19` is `1900`.
5. If you create recurring plans in the Paystack dashboard, paste each plan code into the matching `planCode` field.

Keep your Paystack secret key on a backend only. In production, verify the Paystack reference server-side and use Paystack webhooks before permanently activating a subscription.

## Production backend map

Recommended stack:

- Auth: Supabase Auth or Firebase Auth
- Database: `users`, `creations`, `subscriptions`, `usage_events`
- Storage: Supabase Storage or S3
- AI generation: OpenAI, Replicate, Stability, or a model router
- Payments: Paystack for subscriptions
- Safety: server-side moderation before generation

Environment variables to add when the backend exists:

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
OPENAI_API_KEY=
REPLICATE_API_TOKEN=
STABILITY_API_KEY=
STRIPE_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
```
