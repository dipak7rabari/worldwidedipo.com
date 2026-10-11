# Security Policy

## Worldwide DIPO

Worldwide DIPO takes the security and privacy of its users seriously.

If you believe you have discovered a security vulnerability in Worldwide DIPO, please report it responsibly so that it can be investigated and addressed.

---

## Supported Versions

Security fixes are applied to the actively maintained production version of Worldwide DIPO.

| Version | Supported |
| ------- | --------- |
| Current production release | Yes |
| Older releases | Best effort |
| Unreleased / development builds | No guarantee |

Because Worldwide DIPO is continuously developed, the current production deployment should always be treated as the authoritative supported version.

---

## Reporting a Vulnerability

Please report security vulnerabilities privately.

### Security contact

**Email:** dipolabs123@gmail.com

Please do not publicly disclose a vulnerability before Worldwide DIPO has had a reasonable opportunity to investigate and address it.

---

## What to Include

A useful security report should contain as much of the following information as possible:

- A clear description of the vulnerability.
- The affected URL, API endpoint, component, or feature.
- The security impact.
- Reproduction steps.
- A minimal proof of concept where appropriate.
- Relevant request/response information with secrets removed.
- Screenshots or recordings when they help explain the issue.
- Any suggested mitigation, if you have one.

Please remove or redact:

- Passwords.
- Authentication tokens.
- Session cookies.
- API keys.
- Payment credentials.
- Personal information.
- Supabase credentials.
- Environment variables containing secrets.

---

## Examples of Security Issues

Examples include:

- Authentication bypass.
- Authorization or ownership bypass.
- Cross-account data access.
- SQL or database injection.
- Cross-site scripting.
- CSRF vulnerabilities.
- Server-side request forgery.
- Sensitive information disclosure.
- Payment manipulation.
- Admin privilege escalation.
- Insecure direct object references.
- File upload vulnerabilities.
- Rate-limit bypasses.
- Abuse of public APIs.
- Account takeover vulnerabilities.
- Security-sensitive misconfiguration.

This list is not exhaustive.

---

## Out of Scope

The following generally do not qualify as security vulnerabilities unless they demonstrate a meaningful security impact:

- Spam or automated traffic without a security consequence.
- Self-XSS that requires the victim to execute attacker-provided code manually.
- Missing security headers when they do not create an exploitable vulnerability.
- Informational technology fingerprinting without additional impact.
- Automated scanner output without a demonstrated vulnerability.
- Issues affecting only obsolete or unsupported browsers.
- Social engineering attacks against Worldwide DIPO staff or users.
- Physical attacks against user devices or infrastructure outside Worldwide DIPO's control.
- Denial-of-service testing against production infrastructure.
- Attempts to access, modify, or delete data belonging to other users.

If you are unsure whether an issue is in scope, report it privately.

---

## Responsible Testing

Security researchers must avoid actions that could harm users or disrupt production services.

Please do not:

- Perform destructive testing.
- Delete or modify another user's data.
- Access more information than necessary to demonstrate the issue.
- Attempt to take over accounts that do not belong to you.
- Perform sustained denial-of-service testing.
- Send large volumes of automated traffic to production.
- Publish private user information.
- Publish authentication credentials or secrets.
- Use a vulnerability to perform unrelated activity.

When demonstrating an authorization issue, use the minimum amount of data and access necessary to establish the vulnerability.

---

## Payment Security

Worldwide DIPO may use manual payment verification and payment references depending on the active payment flow.

Do not attempt to:

- Forge payment confirmations.
- Reuse payment references to obtain unauthorized access.
- Modify payment status through client-side requests.
- Bypass payment verification.
- Manipulate plan or subscription state.
- Access another user's payment records.

Payment and subscription state must be treated as server-controlled data.

---

## Account and Profile Security

Worldwide DIPO profiles are associated with authenticated ownership.

A public profile being accessible does not grant permission to:

- Edit the profile.
- Modify profile data.
- Access private dashboard information.
- Access payment information.
- Access administrative information.
- Upload or delete another user's assets.

Security reports involving ownership or authorization bypasses should be reported immediately.

---

## Disclosure Process

After receiving a report, Worldwide DIPO may:

1. Acknowledge the report.
2. Reproduce the issue.
3. Assess its security impact.
4. Identify affected components.
5. Develop and deploy a fix.
6. Verify the remediation.
7. Communicate relevant status updates when appropriate.

Response and remediation timelines may vary depending on severity, complexity, affected infrastructure, and operational constraints.

---

## Security Improvements

Worldwide DIPO may use multiple layers of protection, including:

- Authentication.
- Authorization and ownership checks.
- Database-level access controls.
- Rate limiting.
- Origin validation.
- Request-size limits.
- Input validation.
- Secure response headers.
- File validation.
- Abuse detection.
- Security logging.
- Payment verification controls.
- Server-side enforcement.

No individual security control should be considered a guarantee of complete protection.

---

## Secrets

Never commit secrets to the repository.

This includes:

- Supabase service-role keys.
- Database credentials.
- API keys.
- OAuth client secrets.
- Turnstile secrets.
- Payment credentials.
- Access tokens.
- Session secrets.
- Private signing keys.

Use environment variables or an appropriate secret-management system.

If a secret is accidentally committed, revoke and rotate it immediately.

---

## Security Contact

For security vulnerabilities:

**dipolabs123@gmail.com**

For general product support, please use the appropriate Worldwide DIPO support channel rather than this security-reporting process.

---

## Last Updated

2026-09-30