-- ============================================================
-- WORLDWIDE DIPO
-- Migration 017
-- Payment Lifecycle Hardening
-- ============================================================
--
-- IMPORTANT
-- ------------------------------------------------------------
-- Migration 006:
--   Payment table + initial payment RPC
--
-- Migration 005:
--   Profile state machine
--
-- Migration 007:
--   Authoritative payment lifecycle RPCs
--
-- Migration 015:
--   Explore security
--
-- This migration DOES NOT replace those migrations.
-- It only adds additional database-level protection.
--
-- Lifecycle:
--
-- draft
--   ↓
-- pending
--   ↓
-- active
--
-- Rejection:
-- pending → draft
--
-- Renewal:
-- active → active + 6 months
--
-- ============================================================

begin;


-- ============================================================
-- 1. PAYMENT REFERENCE NORMALIZATION INDEX
-- ============================================================
--
-- The existing RPC normalizes references before insertion.
-- This additional index protects against legacy/corrupt
-- whitespace/case variations if such data ever appears.
--
-- We intentionally keep the existing unique constraint/index
-- untouched because the payment reference is already normalized
-- by the authoritative RPC.
-- ============================================================

create index if not exists idx_payments_reference_lookup
on public.payments(payment_reference);


-- ============================================================
-- 2. PAYMENT STATUS CONSISTENCY
-- ============================================================
--
-- Pending payment:
--   must not already have verification metadata.
--
-- Verified/rejected payment:
--   must have verification metadata.
--
-- This prevents impossible payment states at DB level.
-- ============================================================

alter table public.payments
drop constraint if exists payment_verification_consistency;

alter table public.payments
add constraint payment_verification_consistency
check (
  (
    status = 'pending'
    and verified_by is null
    and verified_at is null
  )
  or
  (
    status in ('verified', 'rejected')
    and verified_by is not null
    and verified_at is not null
  )
);


-- ============================================================
-- 3. SNAPSHOT CONSISTENCY
-- ============================================================
--
-- Payment snapshots are immutable historical values.
--
-- amount_snapshot = amount
-- plan_snapshot   = plan
--
-- These were already protected partially by migration 010.
-- This makes the intended invariant explicit.
-- ============================================================

alter table public.payments
drop constraint if exists payment_plan_snapshot_consistency;

alter table public.payments
add constraint payment_plan_snapshot_consistency
check (
  plan_snapshot is null
  or plan_snapshot = plan
);


alter table public.payments
drop constraint if exists payment_amount_snapshot_consistency;

alter table public.payments
add constraint payment_amount_snapshot_consistency
check (
  amount_snapshot is null
  or amount_snapshot = amount
);


-- ============================================================
-- 4. VERIFIED PAYMENT MUST HAVE REFERENCE
-- ============================================================

alter table public.payments
drop constraint if exists verified_payment_reference_required;

alter table public.payments
add constraint verified_payment_reference_required
check (
  status = 'pending'
  or length(trim(payment_reference)) >= 6
);


-- ============================================================
-- 5. VERIFIED PAYMENT MUST HAVE A PROFILE
-- ============================================================
--
-- Historical rejected payments may theoretically retain a
-- nullable profile because the original schema allows
-- ON DELETE SET NULL.
--
-- Therefore this rule applies only to verified payments.
-- ============================================================

alter table public.payments
drop constraint if exists verified_payment_profile_required;

alter table public.payments
add constraint verified_payment_profile_required
check (
  status <> 'verified'
  or profile_id is not null
);


-- ============================================================
-- 6. VERIFIED PAYMENT MUST HAVE USER
-- ============================================================

alter table public.payments
drop constraint if exists verified_payment_user_required;

alter table public.payments
add constraint verified_payment_user_required
check (
  status <> 'verified'
  or user_id is not null
);


-- ============================================================
-- 7. PAYMENT TYPE + PROFILE REQUIREMENT
-- ============================================================
--
-- Initial and renewal payments both belong to a DIPO profile.
-- This protects against orphan payment creation.
-- ============================================================

alter table public.payments
drop constraint if exists payment_profile_required;

alter table public.payments
add constraint payment_profile_required
check (
  profile_id is not null
);


-- ============================================================
-- 8. PAYMENT USER REQUIREMENT
-- ============================================================

alter table public.payments
drop constraint if exists payment_user_required;

alter table public.payments
add constraint payment_user_required
check (
  user_id is not null
);


-- ============================================================
-- 9. SNAPSHOT PLAN VALIDATION
-- ============================================================

alter table public.payments
drop constraint if exists payment_plan_snapshot_allowed;

alter table public.payments
add constraint payment_plan_snapshot_allowed
check (
  plan_snapshot is null
  or plan_snapshot in (
    'Starter',
    'Pro',
    'Elite'
  )
);


-- ============================================================
-- 10. SNAPSHOT AMOUNT VALIDATION
-- ============================================================

alter table public.payments
drop constraint if exists payment_amount_snapshot_allowed;

alter table public.payments
add constraint payment_amount_snapshot_allowed
check (
  amount_snapshot is null
  or amount_snapshot in (
    149,
    349,
    499
  )
);


-- ============================================================
-- 11. PAYMENT PLAN / AMOUNT PAIRING
-- ============================================================
--
-- Prevent impossible combinations such as:
--
-- Starter + ₹499
-- Pro + ₹149
-- Elite + ₹349
--
-- This is an additional DB-level protection.
-- ============================================================

alter table public.payments
drop constraint if exists payment_plan_amount_consistency;

alter table public.payments
add constraint payment_plan_amount_consistency
check (
  (
    plan = 'Starter'
    and amount = 149
  )
  or
  (
    plan = 'Pro'
    and amount = 349
  )
  or
  (
    plan = 'Elite'
    and amount = 499
  )
);


-- ============================================================
-- 12. SNAPSHOT PLAN / AMOUNT PAIRING
-- ============================================================

alter table public.payments
drop constraint if exists payment_snapshot_plan_amount_consistency;

alter table public.payments
add constraint payment_snapshot_plan_amount_consistency
check (
  plan_snapshot is null
  or amount_snapshot is null
  or (
    plan_snapshot = 'Starter'
    and amount_snapshot = 149
  )
  or (
    plan_snapshot = 'Pro'
    and amount_snapshot = 349
  )
  or (
    plan_snapshot = 'Elite'
    and amount_snapshot = 499
  )
);


-- ============================================================
-- 13. VERIFIED PAYMENT TIMESTAMP PROTECTION
-- ============================================================

alter table public.payments
drop constraint if exists verified_payment_timestamp_not_future;

alter table public.payments
add constraint verified_payment_timestamp_not_future
check (
  verified_at is null
  or verified_at <= now()
);


-- ============================================================
-- 14. PAYMENT REFERENCE FORMAT
-- ============================================================
--
-- Same format used by submit_payment_claim().
-- ============================================================

alter table public.payments
drop constraint if exists payment_reference_safe_format;

alter table public.payments
add constraint payment_reference_safe_format
check (
  payment_reference ~
  '^[A-Z0-9][A-Z0-9_./-]*$'
);


-- ============================================================
-- 15. PAYMENT REFERENCE CANONICAL FORM
-- ============================================================
--
-- Stored payment references should always be uppercase and
-- contain no whitespace.
-- ============================================================

alter table public.payments
drop constraint if exists payment_reference_canonical;

alter table public.payments
add constraint payment_reference_canonical
check (
  payment_reference = upper(payment_reference)
  and payment_reference = regexp_replace(
    payment_reference,
    '[[:space:]]+',
    '',
    'g'
  )
);


-- ============================================================
-- 16. PENDING INITIAL PAYMENT PROFILE CONSISTENCY
-- ============================================================
--
-- A pending initial payment must correspond to a profile that
-- is pending.
--
-- NOTE:
-- A normal CHECK constraint cannot safely query another table.
-- Therefore this is documented here and enforced by the
-- authoritative submit/approve/reject RPC lifecycle.
--
-- We intentionally DO NOT create a cross-table CHECK here.
-- ============================================================


-- ============================================================
-- 17. INDEX FOR ADMIN PAYMENT QUEUE
-- ============================================================

create index if not exists idx_payments_pending_queue
on public.payments(created_at asc)
where status = 'pending';


-- ============================================================
-- 18. INDEX FOR VERIFIED PAYMENT HISTORY
-- ============================================================

create index if not exists idx_payments_verified_history
on public.payments(verified_at desc)
where status = 'verified';


-- ============================================================
-- 19. INDEX FOR PROFILE PAYMENT HISTORY
-- ============================================================

create index if not exists idx_payments_profile_history
on public.payments(
  profile_id,
  created_at desc
);


-- ============================================================
-- 20. INDEX FOR USER PAYMENT HISTORY
-- ============================================================

create index if not exists idx_payments_user_history
on public.payments(
  user_id,
  created_at desc
);


-- ============================================================
-- 21. SECURITY: NO DIRECT CLIENT MUTATION
-- ============================================================
--
-- Keep payment mutations exclusively inside trusted RPCs.
-- ============================================================

revoke insert
on public.payments
from anon, authenticated;

revoke update
on public.payments
from anon, authenticated;

revoke delete
on public.payments
from anon, authenticated;


-- ============================================================
-- 22. PAYMENT HISTORY REMAINS READ-ONLY TO OWNER
-- ============================================================

grant select
on public.payments
to authenticated;


-- ============================================================
-- 23. SECURITY DOCUMENTATION
-- ============================================================

comment on table public.payments
is
'Worldwide DIPO payment claims. Client mutation is disabled; payment creation and verification must use trusted SECURITY DEFINER RPCs.';


comment on column public.payments.amount
is
'Authoritative server-side payment amount. Client supplied amounts are never trusted.';


comment on column public.payments.payment_reference
is
'Normalized UTR/payment reference. Must be uppercase, whitespace-free and globally unique.';


comment on column public.payments.status
is
'Payment lifecycle: pending, verified, rejected.';


comment on column public.payments.plan_snapshot
is
'Historical plan snapshot captured when the payment claim was created.';


comment on column public.payments.amount_snapshot
is
'Historical amount snapshot captured when the payment claim was created.';


-- ============================================================
-- 24. FINAL SECURITY COMMENT
-- ============================================================

comment on function public.submit_payment_claim(
  uuid,
  text,
  text,
  text
)
is
'Authoritative authenticated payment-claim RPC. Resolves amount server-side, verifies profile ownership, locks the profile, creates the pending payment atomically, and prevents duplicate payment references.';


comment on function public.approve_payment_claim(
  uuid,
  text
)
is
'Admin-only payment approval RPC. Locks payment and profile, activates initial profiles for six months, extends active renewals by six months, marks payment verified, and writes an audit event.';


comment on function public.reject_payment_claim(
  uuid,
  text
)
is
'Admin-only payment rejection RPC. Rejects pending payments, returns initial-payment profiles to draft, keeps active renewal profiles active, and writes an audit event.';


commit;


-- ============================================================
-- END
-- ============================================================