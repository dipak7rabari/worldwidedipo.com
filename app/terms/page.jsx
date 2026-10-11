import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "Agreement & acceptance",
    intro:
      "These Terms govern your access to and use of Worldwide DIPO, including account creation, public identity profiles, subscriptions, payment verification, and related services.",
    points: [
      {
        title: "What Worldwide DIPO is",
        text:
          "Worldwide DIPO is a web-native digital identity platform at worldwidedipo.com that allows individuals, creators, professionals, organizations, and businesses to create, manage, publish, and share a public DIPO identity.",
      },
      {
        title: "When these Terms apply",
        text:
          "These Terms apply when you visit or use the website, create an account, create or publish a profile, submit a payment claim, purchase a subscription, or otherwise use a Worldwide DIPO service.",
      },
      {
        title: "Your acceptance",
        text:
          "By using the platform, you acknowledge that you have read and understood these Terms and agree to comply with them and with applicable law.",
      },
      {
        title: "If you do not agree",
        text:
          "If you do not agree with these Terms, you should not create an account, publish a profile, submit a payment claim, or use the platform.",
      },
    ],
  },
  {
    number: "02",
    title: "Eligibility & accounts",
    intro:
      "Accounts must represent real users or entities and must be created and used responsibly.",
    points: [
      {
        title: "Accurate information",
        text:
          "You agree to provide information that is accurate, current, and not intentionally misleading when creating or maintaining your account or public profile.",
      },
      {
        title: "One identity, one owner",
        text:
          "You must not use the platform to impersonate another person, business, organization, brand, or other entity without appropriate authorization.",
      },
      {
        title: "Account security",
        text:
          "You are responsible for protecting access to your account, authentication links, recovery methods, and other credentials associated with your account.",
      },
      {
        title: "Unauthorized access",
        text:
          "You must promptly notify Worldwide DIPO through an official support channel if you reasonably believe your account has been compromised or used without authorization.",
      },
    ],
  },
  {
    number: "03",
    title: "Your DIPO profile",
    intro:
      "A DIPO profile is a public identity surface. You control what you choose to publish, subject to these Terms.",
    points: [
      {
        title: "Profile ownership",
        text:
          "You remain responsible for the information, text, links, images, portfolio material, services, descriptions, and other content that you submit or publish through your profile.",
      },
      {
        title: "Public visibility",
        text:
          "An active public profile may be accessible to anyone on the internet and may be copied, linked, cached, or indexed by third-party search engines and services.",
      },
      {
        title: "Search indexing",
        text:
          "Worldwide DIPO may use structured web metadata, semantic markup, and other technical mechanisms to make eligible public profiles understandable to search engines. Indexing or ranking is not guaranteed.",
      },
      {
        title: "Profile accuracy",
        text:
          "You should keep your public identity information reasonably accurate and should not intentionally publish false claims about qualifications, ownership, services, businesses, or affiliations.",
      },
    ],
  },
  {
    number: "04",
    title: "Content rules",
    intro:
      "Worldwide DIPO is intended for legitimate identity and professional discovery. Content must respect the rights and safety of others.",
    points: [
      {
        title: "You own your content",
        text:
          "Subject to any rights of third parties, you retain ownership of content you submit. You are responsible for ensuring that you have the rights, permissions, licenses, or other lawful basis necessary to publish it.",
      },
      {
        title: "Limited platform license",
        text:
          "To operate the service, you grant Worldwide DIPO a limited, non-exclusive, worldwide, royalty-free license to host, reproduce, process, format, display, transmit, and technically modify your submitted content as reasonably necessary to provide and secure the service.",
      },
      {
        title: "No unlawful content",
        text:
          "You must not upload, publish, transmit, or link to content that violates applicable law or infringes another person's intellectual property, privacy, publicity, or other legal rights.",
      },
      {
        title: "No deceptive identity",
        text:
          "You must not create or maintain a profile intended to falsely represent another person, company, institution, professional qualification, brand, or organization.",
      },
    ],
  },
  {
    number: "05",
    title: "Prohibited activities",
    intro:
      "The following activities are prohibited because they can compromise users, the platform, or the integrity of public identity information.",
    points: [
      {
        title: "Fraud & scams",
        text:
          "Do not use Worldwide DIPO to facilitate scams, fraudulent transactions, deceptive schemes, financial fraud, phishing, or other unlawful activity.",
      },
      {
        title: "Malware & abuse",
        text:
          "Do not distribute malware, ransomware, malicious scripts, credential-stealing software, harmful payloads, or links designed to compromise another person's device or account.",
      },
      {
        title: "Unauthorized access",
        text:
          "Do not attempt to bypass authentication, database protections, rate limits, access controls, security mechanisms, or administrative restrictions.",
      },
      {
        title: "Platform interference",
        text:
          "Do not overload, scrape, probe, reverse engineer, disrupt, or otherwise interfere with the platform except where such activity is expressly permitted by law and does not circumvent technical protections.",
      },
      {
        title: "Abusive content",
        text:
          "Do not use the platform for unlawful threats, targeted harassment, hate-based abuse, sexually exploitative content, content harmful to children, or other prohibited material.",
      },
      {
        title: "Spam",
        text:
          "Do not use DIPO profiles or platform infrastructure for bulk unsolicited messaging, deceptive promotion, automated abuse, or activity designed primarily to manipulate traffic or rankings.",
      },
    ],
  },
  {
    number: "06",
    title: "Verification & trust",
    intro:
      "Verification is a platform process and should not be interpreted as a guarantee of every statement made by a profile owner.",
    points: [
      {
        title: "Payment verification",
        text:
          "Submitting a UPI transaction reference or payment claim does not automatically activate a profile. A payment claim may require review and verification before an eligible subscription becomes active.",
      },
      {
        title: "Verification is limited",
        text:
          "A verified or active DIPO profile represents the status of the platform's applicable verification process. It is not a universal guarantee of a user's character, performance, financial standing, qualifications, or future conduct.",
      },
      {
        title: "False verification claims",
        text:
          "Users must not falsely state that Worldwide DIPO has verified information, qualifications, transactions, ownership, or affiliations that the platform has not actually verified.",
      },
      {
        title: "Security reviews",
        text:
          "Worldwide DIPO may review accounts, payment claims, profile changes, or technical activity where reasonably necessary for fraud prevention, security, compliance, or platform integrity.",
      },
    ],
  },
  {
    number: "07",
    title: "Subscriptions & plans",
    intro:
      "Paid DIPO plans provide access to defined platform features for the applicable subscription period.",
    points: [
      {
        title: "Starter Index",
        text:
          "Starter Index is offered as a six-month plan at the published price of ₹149, subject to the applicable checkout and pricing information displayed by Worldwide DIPO.",
      },
      {
        title: "Pro Creator",
        text:
          "Pro Creator is offered as a six-month plan at the published price of ₹349, subject to the applicable checkout and pricing information displayed by Worldwide DIPO.",
      },
      {
        title: "Authority Elite",
        text:
          "Authority Elite is offered as a six-month plan at the published price of ₹499, subject to the applicable checkout and pricing information displayed by Worldwide DIPO.",
      },
      {
        title: "Feature availability",
        text:
          "Plan features may differ by subscription tier. Worldwide DIPO may improve, modify, replace, or retire features over time, subject to applicable law and reasonable notice where required.",
      },
    ],
  },
  {
    number: "08",
    title: "Payments & UPI verification",
    intro:
      "Worldwide DIPO uses a payment-claim workflow designed to verify subscription payments without asking users for sensitive banking credentials.",
    points: [
      {
        title: "Payment reference",
        text:
          "When you submit a UPI transaction reference (UTR), you confirm that the information belongs to a payment you are authorized to submit for verification.",
      },
      {
        title: "No UPI PIN or bank password",
        text:
          "Worldwide DIPO does not require your UPI PIN, bank login password, card PIN, or similar banking authentication secret for payment verification.",
      },
      {
        title: "Unique transaction references",
        text:
          "Payment references may be stored with uniqueness protection and retained for fraud prevention, verification, reconciliation, and audit purposes. A rejected reference may remain in internal records and may not be reusable.",
      },
      {
        title: "No guaranteed instant activation",
        text:
          "Payment submission is a request for verification, not a guarantee of instant approval or profile activation.",
      },
    ],
  },
  {
    number: "09",
    title: "Pricing, taxes & changes",
    intro:
      "Prices and commercial terms are presented as part of the purchase experience and may change for future purchases.",
    points: [
      {
        title: "Displayed pricing",
        text:
          "The price applicable to a purchase is the price presented by Worldwide DIPO at the relevant point of purchase, subject to applicable taxes, disclosures, and corrections.",
      },
      {
        title: "Future price changes",
        text:
          "Worldwide DIPO may change prices or introduce new plans for future transactions. A price change does not retroactively change a completed purchase unless required by law.",
      },
      {
        title: "Payment provider",
        text:
          "Payments may be processed or initiated through third-party payment infrastructure. Their technical terms may also apply to the payment transaction.",
      },
      {
        title: "Transaction accuracy",
        text:
          "You must not manipulate payment references, submit fabricated transaction information, or intentionally attempt to obtain paid access without a valid corresponding payment.",
      },
    ],
  },
  {
    number: "10",
    title: "Refunds, cancellations & chargebacks",
    intro:
      "Digital identity subscriptions involve allocation of platform resources and access. Commercial remedies remain subject to applicable law.",
    points: [
      {
        title: "Refund policy",
        text:
          "Subscription payments are generally treated as final after successful purchase or verified allocation, except where a refund is required by applicable law, an applicable written refund policy, or a specific commitment made by Worldwide DIPO.",
      },
      {
        title: "Duplicate or erroneous payments",
        text:
          "If you believe you made a duplicate payment, submitted the wrong payment reference, or experienced a payment-processing error, contact official support with the relevant transaction information so the matter can be reviewed.",
      },
      {
        title: "Fraudulent claims",
        text:
          "Fraudulent refund requests, fabricated payment evidence, manipulated transaction references, or abusive chargeback activity may result in account restrictions and further review.",
      },
      {
        title: "Chargebacks",
        text:
          "If you believe a payment dispute exists, you should first contact Worldwide DIPO through an official support channel where appropriate. Nothing in these Terms limits rights that cannot lawfully be waived.",
      },
    ],
  },
  {
    number: "11",
    title: "Subscription duration & expiry",
    intro:
      "DIPO subscriptions operate on defined validity periods.",
    points: [
      {
        title: "Six-month validity",
        text:
          "The published subscription plans described above have a standard validity period of six calendar months from the applicable activation or renewal date.",
      },
      {
        title: "Activation",
        text:
          "A profile becomes eligible for the paid active state only after the applicable payment claim has been successfully verified and approved through the platform's verification process.",
      },
      {
        title: "Expiry",
        text:
          "When the applicable subscription period ends, the profile or associated paid features may expire or become unavailable according to the platform's lifecycle rules.",
      },
      {
        title: "Renewal",
        text:
          "Where renewal is offered, a successful renewal can extend the applicable validity period according to the platform's renewal rules displayed at the time of renewal.",
      },
    ],
  },
  {
    number: "12",
    title: "Public profiles & search engines",
    intro:
      "Worldwide DIPO is designed for open-web identity discovery.",
    points: [
      {
        title: "Public means accessible",
        text:
          "An active public profile may be accessible without signing in and may be viewed by people, automated crawlers, search engines, and other internet services.",
      },
      {
        title: "Search engines decide indexing",
        text:
          "Worldwide DIPO may provide structured metadata for public pages, but Google, Bing, and other search engines independently determine whether and how pages are crawled, indexed, cached, ranked, or displayed.",
      },
      {
        title: "External copies",
        text:
          "Removing or unpublishing a profile from Worldwide DIPO does not necessarily remove copies, screenshots, search-engine caches, archives, social shares, or third-party references that may already exist elsewhere.",
      },
      {
        title: "Sensitive information",
        text:
          "You should not publish passwords, financial credentials, private keys, confidential documents, government identifiers, or other information that should not be publicly accessible.",
      },
    ],
  },
  {
    number: "13",
    title: "Intellectual property",
    intro:
      "Worldwide DIPO and its users may own different parts of the platform and its content.",
    points: [
      {
        title: "Platform rights",
        text:
          "The Worldwide DIPO name, branding, software, interface, visual design, source code, platform architecture, graphics, and original platform content may be protected by intellectual property laws and remain the property of their respective owners.",
      },
      {
        title: "No brand impersonation",
        text:
          "You may not use Worldwide DIPO branding in a manner that falsely suggests sponsorship, partnership, employment, endorsement, or official authorization.",
      },
      {
        title: "User content",
        text:
          "You retain rights in your own lawful content, subject to the operational license needed for Worldwide DIPO to host, display, secure, and provide the service.",
      },
      {
        title: "Third-party material",
        text:
          "You are responsible for obtaining necessary permission before uploading or publishing third-party photographs, logos, trademarks, artwork, text, or other protected material.",
      },
    ],
  },
  {
    number: "14",
    title: "Privacy & data",
    intro:
      "Use of Worldwide DIPO is also governed by the Worldwide DIPO Privacy Policy.",
    points: [
      {
        title: "Privacy Policy",
        text:
          "Our Privacy Policy explains how account information, public profile information, payment references, technical information, and other data may be processed.",
      },
      {
        title: "No data selling",
        text:
          "Worldwide DIPO is not designed to sell personal profile information, contact details, or profile activity to advertising networks or data brokers.",
      },
      {
        title: "Public versus private",
        text:
          "Information intentionally published as part of a public DIPO profile may be visible to the public. Internal authentication, payment, and security information is handled separately from the public profile surface.",
      },
      {
        title: "Legal retention",
        text:
          "Some information may need to be retained for security, fraud prevention, dispute resolution, accounting, legal compliance, or other legitimate purposes even after an account or profile is removed.",
      },
    ],
  },
  {
    number: "15",
    title: "Third-party links & services",
    intro:
      "DIPO may connect to services that are operated independently from Worldwide DIPO.",
    points: [
      {
        title: "External websites",
        text:
          "Public profiles may contain links to websites, social networks, portfolios, stores, maps, or other external services. Worldwide DIPO does not control those external websites.",
      },
      {
        title: "Third-party terms",
        text:
          "Your use of an external service is subject to that service's own terms, privacy policy, security practices, and applicable rules.",
      },
      {
        title: "Payment infrastructure",
        text:
          "Payment processing or payment initiation may involve third-party infrastructure. Users should review the applicable provider's terms when interacting with an external payment flow.",
      },
    ],
  },
  {
    number: "16",
    title: "Availability & changes",
    intro:
      "A global web platform cannot promise that every feature will always be available without interruption.",
    points: [
      {
        title: "Service availability",
        text:
          "Worldwide DIPO aims to provide reliable service but does not guarantee uninterrupted, error-free, secure, or continuously available access.",
      },
      {
        title: "Maintenance",
        text:
          "The platform may temporarily become unavailable because of maintenance, upgrades, infrastructure issues, security incidents, network failures, or events outside reasonable control.",
      },
      {
        title: "Feature changes",
        text:
          "Worldwide DIPO may add, remove, modify, suspend, or replace features as the platform evolves, subject to applicable law and any rights that cannot lawfully be excluded.",
      },
      {
        title: "Security action",
        text:
          "Temporary restrictions may be applied when necessary to protect users, investigate abuse, respond to security incidents, or maintain platform integrity.",
      },
    ],
  },
  {
    number: "17",
    title: "Suspension & termination",
    intro:
      "Worldwide DIPO may restrict access where necessary to protect the platform, users, or legal compliance.",
    points: [
      {
        title: "User-initiated closure",
        text:
          "You may request account closure, profile unpublishing, or applicable data deletion through the available platform controls or official support channels.",
      },
      {
        title: "Policy violations",
        text:
          "Accounts may be restricted, suspended, unpublished, or terminated where there is a reasonable basis to believe the account violates these Terms, applicable law, security requirements, or platform integrity rules.",
      },
      {
        title: "Serious abuse",
        text:
          "Fraud, impersonation, payment manipulation, malware distribution, unauthorized access attempts, or other serious abuse may result in immediate protective action where appropriate.",
      },
      {
        title: "Legal or security requirements",
        text:
          "Worldwide DIPO may preserve or restrict information where reasonably necessary for legal obligations, security investigations, fraud prevention, dispute resolution, or protection of rights.",
      },
    ],
  },
  {
    number: "18",
    title: "Disclaimers",
    intro:
      "The platform provides digital identity infrastructure; it does not replace your own due diligence.",
    points: [
      {
        title: "Identity is not a guarantee",
        text:
          "A DIPO profile or verification status should not be treated as a guarantee of a person's future conduct, financial performance, service quality, professional competence, or business outcome.",
      },
      {
        title: "User-provided information",
        text:
          "Worldwide DIPO generally relies on information supplied by users and applicable verification processes. Users remain responsible for the truthfulness and legality of their own submissions.",
      },
      {
        title: "No guaranteed search ranking",
        text:
          "Worldwide DIPO does not guarantee a particular Google, Bing, social-media, or other search ranking, traffic level, visibility level, or business result.",
      },
      {
        title: "No guaranteed uninterrupted operation",
        text:
          "To the extent permitted by applicable law, the service is provided subject to its technical availability and operational limitations.",
      },
    ],
  },
  {
    number: "19",
    title: "Limitation of liability",
    intro:
      "The following provisions are intended to allocate risk to the extent permitted by applicable law.",
    points: [
      {
        title: "Indirect losses",
        text:
          "To the maximum extent permitted by applicable law, Worldwide DIPO will not be responsible for indirect, incidental, special, consequential, exemplary, or punitive losses arising from use of the service.",
      },
      {
        title: "Third-party conduct",
        text:
          "Worldwide DIPO is not responsible for the independent conduct, content, availability, security, or policies of third-party websites, services, search engines, payment providers, or social platforms.",
      },
      {
        title: "User responsibility",
        text:
          "You are responsible for your decisions regarding transactions, professional relationships, business engagements, and interactions with other users or external services.",
      },
      {
        title: "Mandatory rights preserved",
        text:
          "Nothing in these Terms is intended to exclude or limit liability or consumer rights where such exclusion or limitation is prohibited by applicable law.",
      },
    ],
  },
  {
    number: "20",
    title: "Indemnity",
    intro:
      "Users are responsible for unlawful or unauthorized use of their accounts and submitted material.",
    points: [
      {
        title: "Your responsibility",
        text:
          "To the extent permitted by law, you agree to be responsible for claims, losses, liabilities, costs, or reasonable expenses arising from your unlawful use of the service, your violation of these Terms, or your infringement of another person's rights.",
      },
      {
        title: "No automatic expansion",
        text:
          "This provision does not remove or override rights, protections, or limitations that cannot legally be waived under applicable law.",
      },
    ],
  },
  {
    number: "21",
    title: "Grievances & support",
    intro:
      "Worldwide DIPO provides official channels for support, account issues, privacy questions, and other platform concerns.",
    points: [
      {
        title: "Official support",
        text:
          "Support and legal inquiries should be submitted through the official Worldwide DIPO support channels published on the website.",
      },
      {
        title: "Account issues",
        text:
          "When contacting support about an account, payment, or profile, provide enough information for the team to locate the relevant issue without sending passwords, UPI PINs, or other authentication secrets.",
      },
      {
        title: "Payment disputes",
        text:
          "Payment-related requests should include the relevant transaction reference or available transaction evidence, but never include your UPI PIN, bank password, card PIN, or recovery credentials.",
      },
      {
        title: "Privacy requests",
        text:
          "Privacy, correction, access, unpublishing, or deletion requests may be submitted through the applicable official support channel, subject to verification and legally required retention.",
      },
    ],
  },
  {
    number: "22",
    title: "Governing law",
    intro:
      "Worldwide DIPO operates from India and these Terms are intended to be interpreted within the applicable legal framework.",
    points: [
      {
        title: "Indian legal framework",
        text:
          "These Terms are intended to be governed by and interpreted in accordance with applicable laws of India, subject to mandatory consumer, privacy, data-protection, and other legal rights that may apply.",
      },
      {
        title: "Mandatory protections",
        text:
          "Nothing in these Terms is intended to deprive a user of mandatory legal protections that apply to them and cannot lawfully be excluded by contract.",
      },
      {
        title: "Dispute handling",
        text:
          "Where a dispute cannot be resolved through reasonable support or other applicable mechanisms, the parties may pursue remedies available under applicable law.",
      },
    ],
  },
  {
    number: "23",
    title: "Changes to these Terms",
    intro:
      "Worldwide DIPO may evolve as a global identity platform, and these Terms may need to evolve with it.",
    points: [
      {
        title: "Updates",
        text:
          "Worldwide DIPO may update these Terms to reflect product changes, security requirements, legal developments, or changes in platform operations.",
      },
      {
        title: "Effective date",
        text:
          "The version published on this page identifies the currently applicable version unless a later effective date is expressly stated.",
      },
      {
        title: "Material changes",
        text:
          "Where appropriate, significant changes may be highlighted through the website or other reasonable communication methods.",
      },
      {
        title: "Continued use",
        text:
          "Where permitted by applicable law, continued use of the platform after updated Terms become effective constitutes acceptance of the updated Terms.",
      },
    ],
  },
  {
    number: "24",
    title: "Entire agreement",
    intro:
      "These Terms work together with other documents that govern specific parts of the Worldwide DIPO service.",
    points: [
      {
        title: "Related policies",
        text:
          "These Terms should be read together with the Worldwide DIPO Privacy Policy, Refund Policy, and any specific terms or notices presented for a particular service.",
      },
      {
        title: "Severability",
        text:
          "If a provision is found to be unenforceable to the extent prohibited by law, the remaining provisions are intended to continue to the extent legally permissible.",
      },
      {
        title: "No waiver",
        text:
          "A failure to enforce a provision on one occasion does not necessarily waive the right to enforce that provision later.",
      },
      {
        title: "Language",
        text:
          "The platform may provide translations or localized versions for convenience. Where a legally controlling version is required, the applicable version identified by Worldwide DIPO will govern to the extent permitted by law.",
      },
    ],
  },
];

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="30"
      height="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M24 8v32" />
      <path d="M9 15h30" />
      <path d="M9 15 4 25a7 7 0 0 0 10 0L9 15Z" />
      <path d="M39 15 34 25a7 7 0 0 0 10 0l-5-10Z" />
      <path d="M15 40h18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="30"
      height="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M24 4 39 10v11c0 10-6.3 18.2-15 23C15.3 39.2 9 31 9 21V10l15-6Z" />
      <path d="m17 24 4.5 4.5L31.5 18" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="29"
      height="29"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="17" />
      <path d="M7 24h34M24 7c5 5 7 10.7 7 17s-2 12-7 17c-5-5-7-10.7-7-17s2-12 7-17Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default function TermsPage() {
  const lastUpdated = "September 19, 2026";

  return (
    <>
      <style>{`
        :root {
          --dipo-ink: #111113;
          --dipo-black: #0b0b0c;
          --dipo-muted: #6d6e73;
          --dipo-line: #e6e6e4;
          --dipo-soft: #f7f7f5;
          --dipo-green: #0b8f5b;
          --dipo-green-soft: #e9f8f1;
        }

        .dipo-terms-page {
          min-height: 100vh;
          overflow-x: clip;
          color: var(--dipo-ink);
          background:
            radial-gradient(
              circle at 84% 4%,
              rgba(16, 185, 129, .075),
              transparent 25rem
            ),
            radial-gradient(
              circle at 5% 23%,
              rgba(0, 0, 0, .035),
              transparent 27rem
            ),
            #fff;
        }

        .dipo-terms-page *,
        .dipo-terms-page *::before,
        .dipo-terms-page *::after {
          box-sizing: border-box;
        }

        .dipo-container {
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
        }

        .dipo-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid rgba(17,17,19,.08);
          background: rgba(255,255,255,.84);
          backdrop-filter: blur(22px) saturate(180%);
          -webkit-backdrop-filter: blur(22px) saturate(180%);
        }

        .dipo-nav {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .dipo-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: #111113;
          text-decoration: none;
          font-size: 15px;
          font-weight: 680;
          letter-spacing: -.025em;
        }

        .dipo-brand-mark {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: white;
          background: #0d0d0f;
          box-shadow:
            0 0 0 1px rgba(0,0,0,.08),
            0 8px 20px rgba(0,0,0,.08);
        }

        .dipo-nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dipo-nav-link {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0 14px;
          border-radius: 999px;
          color: #5e5f64;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition:
            color .18s ease,
            background .18s ease,
            transform .18s ease;
        }

        .dipo-nav-link:hover {
          color: #111113;
          background: #f2f2f0;
          transform: translateY(-1px);
        }

        .dipo-nav-link-dark {
          color: white;
          background: #101012;
        }

        .dipo-nav-link-dark:hover {
          color: white;
          background: #252527;
        }

        .dipo-hero {
          position: relative;
          padding:
            clamp(75px, 11vw, 150px)
            0
            clamp(75px, 10vw, 130px);
        }

        .dipo-hero-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.25fr)
            minmax(280px, .75fr);
          gap: clamp(45px, 9vw, 130px);
          align-items: end;
        }

        .dipo-eyebrow {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 7px 11px;
          border: 1px solid #e2e2e0;
          border-radius: 999px;
          background: rgba(255,255,255,.8);
          color: #66676c;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .1em;
          text-transform: uppercase;
          animation:
            dipoFadeUp .75s cubic-bezier(.2,.7,.2,1) both;
        }

        .dipo-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10a56b;
          box-shadow:
            0 0 0 5px rgba(16,165,107,.1);
          animation:
            dipoPulse 2.5s ease-in-out infinite;
        }

        .dipo-title {
          max-width: 920px;
          margin: 22px 0 0;
          font-size: clamp(3.15rem, 8.4vw, 8.3rem);
          line-height: .88;
          letter-spacing: -.078em;
          font-weight: 620;
          text-wrap: balance;
          animation:
            dipoFadeUp .9s .07s cubic-bezier(.2,.7,.2,1) both;
        }

        .dipo-title-gradient {
          background:
            linear-gradient(
              110deg,
              #111113 0%,
              #111113 42%,
              #0b8f5b 100%
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .dipo-hero-copy {
          max-width: 470px;
          margin: 0 0 5px auto;
          color: #68696e;
          font-size: clamp(15px, 1.4vw, 18px);
          line-height: 1.68;
          letter-spacing: -.015em;
          animation:
            dipoFadeUp .9s .15s cubic-bezier(.2,.7,.2,1) both;
        }

        .dipo-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .dipo-meta {
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 11px;
          border: 1px solid #e5e5e3;
          border-radius: 999px;
          color: #6a6b70;
          background: #fafafa;
          font-size: 11px;
          font-weight: 600;
        }

        .dipo-meta strong {
          color: #151517;
        }

        .dipo-feature-strip {
          border-top: 1px solid var(--dipo-line);
          border-bottom: 1px solid var(--dipo-line);
          background: #fbfbfa;
        }

        .dipo-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .dipo-feature {
          min-height: 185px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 24px;
          padding: 30px clamp(18px, 3vw, 42px);
          border-right: 1px solid var(--dipo-line);
          transition:
            background .25s ease,
            transform .25s ease;
        }

        .dipo-feature:first-child {
          border-left: 1px solid var(--dipo-line);
        }

        .dipo-feature:hover {
          background: #fff;
          transform: translateY(-2px);
        }

        .dipo-feature-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid #dededc;
          border-radius: 15px;
          color: #151517;
          background: white;
          box-shadow: 0 8px 24px rgba(0,0,0,.035);
        }

        .dipo-feature-title {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -.025em;
        }

        .dipo-feature-text {
          margin: 5px 0 0;
          color: #77787d;
          font-size: 13px;
          line-height: 1.55;
        }

        .dipo-content {
          padding: clamp(80px, 10vw, 140px) 0;
        }

        .dipo-content-grid {
          display: grid;
          grid-template-columns: 255px minmax(0, 1fr);
          gap: clamp(45px, 9vw, 125px);
          align-items: start;
        }

        .dipo-index {
          position: sticky;
          top: 105px;
        }

        .dipo-index-label {
          margin: 0 0 16px;
          color: #9a9b9e;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .dipo-index-list {
          margin: 0;
          padding: 0;
          list-style: none;
          border-left: 1px solid #dededc;
        }

        .dipo-index-item {
          display: block;
          padding: 6px 0 6px 16px;
          color: #96979b;
          text-decoration: none;
          font-size: 11px;
          line-height: 1.35;
          transition:
            color .18s ease,
            padding .18s ease;
        }

        .dipo-index-item:hover {
          padding-left: 20px;
          color: #111113;
        }

        .dipo-index-number {
          display: inline-block;
          width: 28px;
          color: #c1c2c4;
          font-variant-numeric: tabular-nums;
        }

        .dipo-section {
          scroll-margin-top: 105px;
          padding-bottom: clamp(70px, 8vw, 110px);
          margin-bottom: clamp(70px, 8vw, 110px);
          border-bottom: 1px solid var(--dipo-line);
          animation:
            dipoSectionIn .75s cubic-bezier(.2,.7,.2,1) both;
        }

        .dipo-section:last-child {
          margin-bottom: 0;
          border-bottom: 0;
        }

        .dipo-section-head {
          display: grid;
          grid-template-columns: 72px minmax(0,1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .dipo-section-number {
          padding-top: 8px;
          color: #aaa;
          font-size: 12px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .dipo-section-title {
          margin: 0;
          color: #111113;
          font-size: clamp(29px, 4vw, 51px);
          line-height: .98;
          letter-spacing: -.057em;
          font-weight: 620;
        }

        .dipo-section-intro {
          max-width: 690px;
          margin: 16px 0 0;
          color: #747579;
          font-size: 16px;
          line-height: 1.7;
          letter-spacing: -.012em;
        }

        .dipo-point-list {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 1px;
          overflow: hidden;
          border: 1px solid var(--dipo-line);
          border-radius: 20px;
          background: var(--dipo-line);
        }

        .dipo-point {
          min-height: 175px;
          padding: clamp(23px,3vw,34px);
          background: white;
          transition:
            background .22s ease,
            transform .22s ease;
        }

        .dipo-point:hover {
          background: #fcfcfb;
        }

        .dipo-point-top {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 14px;
        }

        .dipo-point-check {
          width: 25px;
          height: 25px;
          flex: 0 0 25px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          color: #08764b;
          background: var(--dipo-green-soft);
        }

        .dipo-point-title {
          margin: 0;
          color: #171719;
          font-size: 15px;
          line-height: 1.25;
          font-weight: 700;
          letter-spacing: -.02em;
        }

        .dipo-point-text {
          margin: 0;
          color: #727378;
          font-size: 14px;
          line-height: 1.7;
        }

        .dipo-final-card {
          position: relative;
          overflow: hidden;
          padding: clamp(32px,5vw,62px);
          border-radius: 28px;
          color: white;
          background:
            radial-gradient(
              circle at 82% 14%,
              rgba(52,211,153,.23),
              transparent 19rem
            ),
            linear-gradient(135deg,#0d0d0f,#171719);
          box-shadow:
            0 28px 85px rgba(0,0,0,.11),
            inset 0 1px 0 rgba(255,255,255,.07);
        }

        .dipo-final-card::before {
          content: "";
          position: absolute;
          width: 410px;
          height: 410px;
          right: -210px;
          top: -210px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 50%;
          box-shadow:
            0 0 0 55px rgba(255,255,255,.018),
            0 0 0 110px rgba(255,255,255,.012);
          pointer-events: none;
        }

        .dipo-final-kicker {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #8de8be;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .dipo-final-title {
          max-width: 720px;
          margin: 17px 0 0;
          font-size: clamp(31px,4.7vw,61px);
          line-height: .98;
          letter-spacing: -.058em;
          font-weight: 600;
        }

        .dipo-final-copy {
          max-width: 680px;
          margin: 18px 0 0;
          color: #aaaab0;
          font-size: 15px;
          line-height: 1.72;
        }

        .dipo-contact-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .dipo-contact {
          min-height: 43px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 0 15px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px;
          color: #f4f4f4;
          background: rgba(255,255,255,.055);
          text-decoration: none;
          font-size: 12px;
          font-weight: 620;
          transition:
            background .18s ease,
            border-color .18s ease,
            transform .18s ease;
        }

        .dipo-contact:hover {
          background: rgba(255,255,255,.1);
          border-color: rgba(255,255,255,.2);
          transform: translateY(-2px);
        }

        .dipo-footer {
          border-top: 1px solid var(--dipo-line);
          background: #fafaf9;
        }

        .dipo-footer-inner {
          min-height: 220px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .dipo-footer-brand {
          color: #171719;
          font-size: 14px;
          font-weight: 720;
          letter-spacing: -.025em;
        }

        .dipo-footer-copy {
          max-width: 430px;
          margin: 6px 0 0;
          color: #898a8e;
          font-size: 12px;
          line-height: 1.55;
        }

        .dipo-footer-made {
          margin-top: 16px;
          color: #707176;
          font-size: 12px;
          font-weight: 600;
        }

        .dipo-footer-product {
          margin-top: 6px;
          color: #171719;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
          letter-spacing: .04em;
        }

        .dipo-footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 6px;
        }

        .dipo-footer-link {
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          padding: 0 12px;
          border-radius: 9px;
          color: #696a6f;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          transition:
            color .18s ease,
            background .18s ease;
        }

        .dipo-footer-link:hover {
          color: #111113;
          background: #eeeeec;
        }

        @keyframes dipoFadeUp {
          from {
            opacity: 0;
            transform: translate3d(0,22px,0);
          }
          to {
            opacity: 1;
            transform: translate3d(0,0,0);
          }
        }

        @keyframes dipoSectionIn {
          from {
            opacity: 0;
            transform: translate3d(0,18px,0);
          }
          to {
            opacity: 1;
            transform: translate3d(0,0,0);
          }
        }

        @keyframes dipoPulse {
          0%,100% {
            opacity: .75;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.18);
          }
        }

        @media (max-width: 900px) {
          .dipo-hero-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .dipo-hero-copy {
            margin-left: 0;
          }

          .dipo-content-grid {
            grid-template-columns: 1fr;
          }

          .dipo-index {
            display: none;
          }
        }

        @media (max-width: 720px) {
          .dipo-container {
            width: min(100% - 28px, 1240px);
          }

          .dipo-nav {
            min-height: 64px;
          }

          .dipo-nav-link:not(.dipo-nav-link-dark) {
            display: none;
          }

          .dipo-hero {
            padding-top: 70px;
            padding-bottom: 70px;
          }

          .dipo-title {
            font-size: clamp(3rem,15vw,5rem);
          }

          .dipo-feature-grid {
            grid-template-columns: 1fr;
          }

          .dipo-feature,
          .dipo-feature:first-child {
            min-height: 155px;
            border-left: 1px solid var(--dipo-line);
            border-right: 1px solid var(--dipo-line);
            border-bottom: 1px solid var(--dipo-line);
          }

          .dipo-feature:last-child {
            border-bottom: 0;
          }

          .dipo-section-head {
            grid-template-columns: 42px minmax(0,1fr);
            gap: 12px;
          }

          .dipo-section-title {
            font-size: clamp(29px,9vw,43px);
          }

          .dipo-section-intro {
            font-size: 15px;
          }

          .dipo-point-list {
            grid-template-columns: 1fr;
            border-radius: 17px;
          }

          .dipo-point {
            min-height: auto;
          }

          .dipo-final-card {
            border-radius: 22px;
          }

          .dipo-footer-inner {
            min-height: 280px;
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
          }

          .dipo-footer-links {
            justify-content: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-terms-page *,
          .dipo-terms-page *::before,
          .dipo-terms-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <main className="dipo-terms-page">
        <header className="dipo-topbar">
          <div className="dipo-container dipo-nav">
            <Link
              href="/"
              className="dipo-brand"
              aria-label="Worldwide DIPO home"
            >
              <span className="dipo-brand-mark">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
                  <path d="m8 9.5 4-2 4 2-4 2-4-2Z" />
                  <path d="M8 14.5 12 17l4-2.5" />
                </svg>
              </span>

              Worldwide DIPO
            </Link>

            <nav
              className="dipo-nav-right"
              aria-label="Terms navigation"
            >
              <Link href="/privacy" className="dipo-nav-link">
                Privacy
              </Link>

              <Link href="/refund" className="dipo-nav-link">
                Refund
              </Link>

              <Link
                href="/contact"
                className="dipo-nav-link dipo-nav-link-dark"
              >
                Contact
                <ArrowUpRight />
              </Link>
            </nav>
          </div>
        </header>

        <section className="dipo-hero">
          <div className="dipo-container dipo-hero-grid">
            <div>
              <div className="dipo-eyebrow">
                <span className="dipo-eyebrow-dot" />
                Terms of service
              </div>

              <h1 className="dipo-title">
                Built for the
                <br />
                <span className="dipo-title-gradient">
                  open web.
                </span>
              </h1>
            </div>

            <div className="dipo-hero-copy">
              <p>
                These Terms explain how Worldwide DIPO works, what you can
                publish, how subscriptions and verification work, and the
                responsibilities that come with using a public digital
                identity platform.
              </p>

              <div className="dipo-meta-row">
                <span className="dipo-meta">
                  <strong>Updated</strong> {lastUpdated}
                </span>

                <span className="dipo-meta">
                  <strong>{sections.length}</strong> sections
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="dipo-feature-strip"
          aria-label="Terms highlights"
        >
          <div className="dipo-container dipo-feature-grid">
            <article className="dipo-feature">
              <div className="dipo-feature-icon">
                <ScaleIcon />
              </div>

              <div>
                <h2 className="dipo-feature-title">
                  Clear rules
                </h2>

                <p className="dipo-feature-text">
                  Simple rules for accounts, content, subscriptions,
                  verification and platform use.
                </p>
              </div>
            </article>

            <article className="dipo-feature">
              <div className="dipo-feature-icon">
                <ShieldIcon />
              </div>

              <div>
                <h2 className="dipo-feature-title">
                  Trust & security
                </h2>

                <p className="dipo-feature-text">
                  Fraud prevention, payment verification and responsible
                  identity publishing are built into the platform rules.
                </p>
              </div>
            </article>

            <article className="dipo-feature">
              <div className="dipo-feature-icon">
                <GlobeIcon />
              </div>

              <div>
                <h2 className="dipo-feature-title">
                  Open-web identity
                </h2>

                <p className="dipo-feature-text">
                  Public profiles can be discovered across the internet,
                  while internal platform information remains separated.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="dipo-content">
          <div className="dipo-container dipo-content-grid">
            <aside className="dipo-index">
              <p className="dipo-index-label">
                On this page
              </p>

              <ol className="dipo-index-list">
                {sections.map((section) => (
                  <li key={section.number}>
                    <a
                      href={`#terms-${section.number}`}
                      className="dipo-index-item"
                    >
                      <span className="dipo-index-number">
                        {section.number}
                      </span>

                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <div>
              {sections.map((section) => (
                <section
                  key={section.number}
                  id={`terms-${section.number}`}
                  className="dipo-section"
                >
                  <div className="dipo-section-head">
                    <div className="dipo-section-number">
                      {section.number}
                    </div>

                    <div>
                      <h2 className="dipo-section-title">
                        {section.title}
                      </h2>

                      <p className="dipo-section-intro">
                        {section.intro}
                      </p>
                    </div>
                  </div>

                  <div className="dipo-point-list">
                    {section.points.map((point) => (
                      <article
                        key={point.title}
                        className="dipo-point"
                      >
                        <div className="dipo-point-top">
                          <span className="dipo-point-check">
                            <CheckIcon />
                          </span>

                          <h3 className="dipo-point-title">
                            {point.title}
                          </h3>
                        </div>

                        <p className="dipo-point-text">
                          {point.text}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}

              <section className="dipo-final-card">
                <div className="dipo-final-kicker">
                  <ShieldIcon />
                  Worldwide DIPO
                </div>

                <h2 className="dipo-final-title">
                  Questions about these Terms?
                </h2>

                <p className="dipo-final-copy">
                  If something about your account, profile, subscription,
                  payment verification, privacy, or platform access is
                  unclear, contact Worldwide DIPO through an official
                  channel. Never send your password, UPI PIN, bank password,
                  card PIN, or recovery credentials to support.
                </p>

                <div className="dipo-contact-row">
                  <a
                    href="mailto:dipolabs123@gmail.com"
                    className="dipo-contact"
                  >
                    dipolabs123@gmail.com
                    <ArrowUpRight />
                  </a>

                  <a
                    href="https://instagram.com/dipolabs.io"
                    target="_blank"
                    rel="noreferrer"
                    className="dipo-contact"
                  >
                    @dipolabs.io
                    <ArrowUpRight />
                  </a>
                </div>
              </section>
            </div>
          </div>
        </section>

        <footer className="dipo-footer">
          <div className="dipo-container dipo-footer-inner">
            <div>
              <div className="dipo-footer-brand">
                Worldwide DIPO
              </div>

              <p className="dipo-footer-copy">
                A global identity layer for people, creators,
                professionals and businesses on the open web.
              </p>

              <div className="dipo-footer-made">
                Made With ❤️ in India
              </div>

              <div className="dipo-footer-product">
                𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
              </div>

              <p className="dipo-footer-copy">
                All copyrights reserved @ 𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
              </p>
            </div>

            <nav
              className="dipo-footer-links"
              aria-label="Footer navigation"
            >
              <Link
                href="/"
                className="dipo-footer-link"
              >
                Home
              </Link>

              <Link
                href="/privacy"
                className="dipo-footer-link"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="dipo-footer-link"
              >
                Terms
              </Link>

              <Link
                href="/refund"
                className="dipo-footer-link"
              >
                Refund
              </Link>

              <Link
                href="/contact"
                className="dipo-footer-link"
              >
                Contact
              </Link>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}