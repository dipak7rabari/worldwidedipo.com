# Worldwide DIPO

Worldwide DIPO is a next-level digital identity platform by DIPO LABS.

> Har insaan ki apni digital pehchaan.

## Product

Worldwide DIPO helps students, workers, professionals, freelancers, shop owners,
creators and businesses create a public digital identity page.

## Production

Website:

https://worldwidedipo.com

Public profile:

https://worldwidedipo.com/p/{slug}

## Stack

- Next.js
- React
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Vercel
- Cloudflare Turnstile

## Subscription Plans

| Plan | Price | Duration |
|---|---:|---:|
| Starter Index | ₹149 | 6 months |
| Pro Creator | ₹349 | 6 months |
| Authority Elite | ₹499 | 6 months |

## Authentication

Supported authentication:

- Google OAuth
- Email OTP / Magic Link

Public profile visitors do not need an account.

## Profile Lifecycle

draft → pending → active → expired

Renewal of an active profile does not make the profile private while payment
verification is pending.

## Payment

Payments are manually verified.

Users submit:

- selected plan
- payment reference / UTR
- payment claim

A payment reference does not automatically activate a profile.

Never request or store:

- UPI PIN
- bank password
- authentication OTP
- card PIN
- banking credentials

## Security

The application uses:

- Supabase Row Level Security
- Server-side authorization
- Origin checks
- Request-size limits
- Input validation
- Turnstile
- Payment database constraints
- Admin AAL2 protection
- Storage policies
- Audit logging

## Development

Install dependencies:

```bash
npm install