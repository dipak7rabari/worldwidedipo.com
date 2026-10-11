# Contributing to Worldwide DIPO

Thank you for your interest in contributing to Worldwide DIPO.

Worldwide DIPO is a proprietary product. Contributions are accepted only
within the scope authorized by the project maintainers.

This document explains the expected development and review standards.

---

## Before You Start

Before making a change:

1. Understand the existing architecture.
2. Search for existing implementations.
3. Avoid introducing duplicate systems.
4. Preserve existing functionality unless the change explicitly requires it.
5. Consider authentication, authorization, privacy, security, and abuse
   implications.
6. Keep changes focused.

Do not replace an existing security mechanism simply because another
implementation appears simpler.

---

## Development Principles

Worldwide DIPO follows these principles:

- Server-side security enforcement.
- Least privilege.
- Explicit ownership checks.
- Database-level protection where appropriate.
- Secure-by-default APIs.
- Strict input validation.
- Bounded request sizes.
- Rate limiting for abuse-sensitive operations.
- Minimal exposure of private data.
- Accessible and responsive UI.
- Progressive enhancement where practical.
- Small, focused changes.
- No unnecessary dependency additions.

---

## Architecture

The application uses:

- Next.js App Router.
- React.
- Supabase.
- PostgreSQL.
- Server-side API routes.
- Server-side authorization.
- Database-level access controls.

Do not introduce a new framework or replace the existing application
architecture without explicit approval.

---

## Security Requirements

Security-sensitive functionality must never rely only on client-side checks.

For protected operations, consider:

- Authentication.
- Authorization.
- Resource ownership.
- Origin validation.
- Rate limiting.
- Request-size limits.
- Input validation.
- Output minimization.
- Database/RLS enforcement.
- Abuse protection.

A hidden button is not an authorization mechanism.

A client-provided `user_id`, `owner_id`, `profile_id`, payment status,
plan, verification status, or administrative role must not be trusted
without server-side validation.

---

## User Ownership

Profile management is owner-only.

The authenticated owner of a DIPO profile may manage that profile.

Public visitors and other authenticated users may view public information
when the profile is publicly available, but they must not receive:

- Owner dashboard access.
- Private profile management controls.
- Payment information.
- Administrative data.
- Private account information.

Ownership must be enforced server-side.

---

## API Changes

When modifying an API route:

- Validate the HTTP method.
- Validate the request origin where appropriate.
- Validate content type.
- Bound request size.
- Validate the request body.
- Authenticate when required.
- Authorize the requested operation.
- Avoid trusting client-controlled ownership fields.
- Return minimal response data.
- Avoid leaking internal errors.
- Apply appropriate security headers.
- Consider rate limiting and abuse controls.

Do not return database rows directly when a smaller public response is
sufficient.

---

## Database Changes

Database changes must be:

- Explicit.
- Reproducible.
- Reviewed.
- Safe to deploy.
- Compatible with existing application code.

Migrations should not silently weaken existing access controls.

For sensitive tables, verify:

- RLS policies.
- Grants.
- Ownership rules.
- RPC security.
- Search-path behavior.
- Function execution privileges.
- Public exposure.

---

## Public Profile Data

Public DIPO pages must expose only intentionally public profile data.

Never expose through a public projection:

- `owner_id`.
- Authentication data.
- Payment data.
- Administrative information.
- Private notes.
- Internal moderation information.
- Security metadata.
- Secrets.

When possible, use a dedicated public projection or secure RPC rather than
directly exposing a private table.

---

## UI / UX

UI contributions should preserve the Worldwide DIPO design direction:

- Premium.
- Clean.
- Responsive.
- Accessible.
- Fast.
- Mobile-first.
- Minimal visual noise.
- Consistent spacing and typography.

Do not introduce unnecessary UI libraries for a small component.

Avoid horizontal overflow.

Respect:

```css
prefers-reduced-motion
Interactive controls must remain usable with keyboard navigation.

⸻

Accessibility

New UI should include:

* Semantic HTML.
* Keyboard support.
* Visible focus states.
* Appropriate labels.
* Useful accessible names.
* Correct button/link semantics.
* Appropriate ARIA only when necessary.
* Sufficient text contrast.
* Reduced-motion support.

Do not use a <div> as a button when a native <button> is appropriate.

⸻

Dependencies

Before adding a dependency:

1. Check whether the existing project already provides the required
    functionality.
2. Check bundle/runtime implications.
3. Check maintenance status.
4. Check license compatibility.
5. Consider whether the dependency creates a new security or supply-chain
    risk.

Small functionality should generally remain dependency-free.

⸻

Code Style

Prefer:

* Clear names.
* Small focused functions.
* Explicit validation.
* Early returns.
* Defensive handling of unexpected input.
* Comments only where they explain important reasoning.

Avoid:

* Dead code.
* Duplicate utilities.
* Magic security assumptions.
* Unbounded collections.
* Silent security failures.
* Large unrelated refactors.

⸻

Pull Requests

A pull request should explain:

What changed?

Describe the actual implementation.

Why?

Explain the problem being solved.

Security impact

Mention whether the change affects:

* Authentication.
* Authorization.
* Profile ownership.
* Payments.
* File uploads.
* Public data.
* Rate limiting.
* Abuse protection.
* Security headers.

Testing

Include relevant checks such as:

npm run lint
npm run build

Also test the affected flow manually when appropriate.

⸻

Security Vulnerabilities

Do not submit sensitive security vulnerabilities through a public pull
request.

Report them privately according to:

SECURITY.md

Security reports:

dipolabs123@gmail.com

⸻

Commit Guidelines

Prefer small, descriptive commits.

Examples:
feat: improve public profile metadata
fix: prevent unauthorized profile updates
security: harden payment submission
refactor: simplify profile projection
docs: update security policy

Avoid commits such as:
update
changes
final
new
test
fix stuff

Review Standards

A change may be rejected if it:

* Weakens existing security controls.
* Introduces unnecessary dependencies.
* Breaks ownership boundaries.
* Exposes private data.
* Adds unbounded resource usage.
* Creates avoidable accessibility problems.
* Introduces horizontal mobile overflow.
* Duplicates an existing utility.
* Changes unrelated functionality without justification.

⸻

License

Worldwide DIPO is proprietary software.

See LICENSE for the applicable terms.

Contributing code does not automatically grant permission to redistribute
Worldwide DIPO or its proprietary source code.

⸻

Contact

For contribution or project questions:

dipolabs123@gmail.com