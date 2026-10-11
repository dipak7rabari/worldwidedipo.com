# Worldwide DIPO - Security fixes

Sirf badli hui files hain. Apne project mein **same path par replace** karo.
Purani migration files (001-019) ko mat chhedo.

## Order
1. `supabase/migrations/020_security_fixes.sql` -> Supabase SQL editor mein run karo
   (ya `supabase db push`). Ye NAYI file hai.
2. Baaki files same path par replace karo.
3. Vercel env mein add karo:
   - `ADMIN_EMAILS=email1,email2`
   - `UPSTASH_REDIS_REST_URL` aur `UPSTASH_REDIS_REST_TOKEN` (free Upstash account)
4. Deploy.

## Files
| # | File | Fix |
|---|------|-----|
| 1 | supabase/migrations/020_security_fixes.sql | plan/status/expiry bypass, storage cap, support fields, UTR constraint |
| 2 | lib/security/admin-authorization.js | AAL2 getClaims() se, admin emails env se |
| 3 | lib/admin/admin-auth.js | AAL2 getClaims() se |
| 4 | lib/security/rate-limit.js | Upstash wala checkRateLimitAsync (purana function waisa hi) |
| 5 | app/api/payment/{submit,create,renewal,status}/route.js | await checkRateLimitAsync |
| 6 | app/api/profile/{create,update,upload}/route.js | await checkRateLimitAsync (+ upload mein image bytes check) |
| 7 | app/api/support/route.js | await checkRateLimitAsync |
| 8 | lib/security/origin-check.js | Origin/Referer dono na ho to mutation reject |
| 9 | lib/storage/image-validation.js | validateImageSignature() add |
| 10 | lib/analytics/record-profile-view.js | service client + expiry check |
| 11 | app/api/analytics/view/profile-view/route.js | rate limit |
| 12 | lib/payments/payment-validation.js | 12 digit UTR |
| 13 | .env.example | ADMIN_EMAILS |

## Deploy ke baad TEST karo (zaroori)
1. Normal user token se `PATCH /rest/v1/profiles` -> `{"plan":"Elite"}` ya
   `{"expires_at":"2030-01-01"}` -> **403 aana chahiye**.
2. Naya profile banao -> payment submit karo -> admin approve karo -> profile active
   hona chahiye (ye flow tootna nahi chahiye).
3. Admin MFA se login karke payment approve/reject chalao.
4. Profile page kholo -> dashboard mein view count badhna chahiye.
5. Image upload (jpg) chalna chahiye; .txt ko .png naam dekar upload -> reject.

## Live DB mein migrations check
Duplicate numbers (004, 005, 008, 014/015) ke liye SQL editor mein:
`select version, name from supabase_migrations.schema_migrations order by version;`