# Worldwide DIPO Admin Upgrade — installation

This ZIP contains repo-root relative paths. It **overwrites** admin layout, dashboard, users, payments page and AdminShell. Back up/commit first.

1. Put admin-final-upgrade.zip at project root and run `unzip -o admin-final-upgrade.zip`.
2. Supabase SQL Editor: run **supabase/migrations/023_admin_account_delete.sql** only after verifying creator migration 022 and existing schema. SQL is NOT automatically applied by unzip.
3. Run `npm run build:vinext` and check routes `/admin`, `/admin/users`, `/admin/payments`, `/admin/audit`, `/admin/security` on mobile.
4. Test with a throwaway NON-admin account. Block/unblock requires AAL2; deletion is Super Admin only. Payment data and admin authentication code were not changed.
5. Deploy only after test. Changes are not deployed automatically.

## Functional and safety notes
- Home page now shows a compact overview with an in-page Users management tab. Other secure admin functions are reached by labeled shortcuts, retaining their existing routes and authorizations.
- Deletion runs as one database transaction before attempting to delete files from user UUID / profile UUID folders in `profile-media` and `creator-media`. If cleanup fails, the API replies with `cleanup_pending` and logs a server error; review orphaned files manually. This intentionally avoids deleting files before database transaction completion. A separate storage cleanup verification is recommended.
- Global search with filters scans at most 4,000 Supabase users and returns `pagination.limited` to indicate truncation; it is not a full-text indexed search for arbitrarily large installations.
- `admin-upgrade.zip` was used as a starting point, not deployed directly.
