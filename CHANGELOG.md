---

# 4. `CHANGELOG.md`

```md
# Changelog

All notable changes to Worldwide DIPO are documented in this file.

The format is based on the principles of Keep a Changelog.

---

## [Unreleased]

### Security

- Continued hardening of API endpoints.
- Improved request validation and bounded request handling.
- Improved origin validation for sensitive API operations.
- Improved rate limiting for abuse-sensitive endpoints.
- Continued protection of authenticated profile ownership.
- Continued hardening of administrative and payment operations.
- Added centralized abuse-protection utilities.

### Documentation

- Added security reporting guidance.
- Added contribution guidelines.
- Added proprietary software license information.

---

## [1.0.0] - 2026-09-30

### Added

- Worldwide DIPO public digital identity profiles.
- Public DIPO URLs using the `/p/[slug]` route.
- Authenticated profile management.
- Supabase authentication.
- Google OAuth support.
- Email authentication flow.
- Profile information management.
- Professional identity sections.
- Projects and services support.
- Social links.
- Gallery support.
- Public profile projection through secure server-side access.
- Profile ownership enforcement.
- Payment claim and manual verification flows.
- Administrative payment review.
- Security headers.
- Origin validation.
- API rate limiting.
- Request-size protection.
- Image upload validation.
- Support request protection.
- Production SEO configuration.
- Sitemap generation for public profiles.
- Production robots configuration.
- Responsive Worldwide DIPO UI system.
- Reusable dialog, modal, form, loader, skeleton, toast, and state
  components.

### Security

- Protected private profile data from anonymous direct table access.
- Added server-side ownership enforcement.
- Added protected administrative authorization.
- Added payment verification controls.
- Added API request validation.
- Added security response headers.
- Added authentication checks to protected operations.
- Added rate limits to abuse-sensitive API routes.
- Added request body limits.
- Added upload size and image validation.
- Added production security documentation.

---

## Versioning

Future releases may use semantic versioning where practical.

### Major

Breaking architecture, API, data, or behavioral changes.

### Minor

Backward-compatible features or substantial improvements.

### Patch

Backward-compatible bug fixes, security fixes, and maintenance changes.

---

## Security Releases

Security-sensitive changes may be released outside the normal feature
schedule when necessary.

Security reports should be sent privately to:

**dipolabs123@gmail.com**