import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "What we collect",
    intro:
      "Worldwide DIPO is designed around data minimization. We collect only the information required to operate your account, publish the identity information you intentionally make public, process subscriptions, and maintain platform security.",
    points: [
      {
        title: "Account information",
        text:
          "When you sign in using Google Authentication or a passwordless email link, your authentication email is handled through our authentication infrastructure. Authentication credentials are not exposed on public profile pages.",
      },
      {
        title: "Public identity information",
        text:
          "You may choose to publish information such as your display name, username/slug, profession, biography, social links, services, portfolio content, and images. Information you intentionally publish on your DIPO profile may be visible to visitors and search engines.",
      },
      {
        title: "Payment verification information",
        text:
          "For subscription verification, we may receive the UPI transaction reference (UTR) that you submit. The submitted payment reference is stored as a unique record for fraud prevention, verification, and audit purposes.",
      },
    ],
  },
  {
    number: "02",
    title: "What we never sell",
    intro:
      "Worldwide DIPO does not operate as a personal-data marketplace.",
    points: [
      {
        title: "Zero data selling",
        text:
          "We do not sell your personal information, profile activity, contact information, or identity data to third-party advertising networks or data brokers.",
      },
      {
        title: "No advertising profile marketplace",
        text:
          "Your DIPO identity is intended to help people discover and verify you or your business. It is not intended to create a separate advertising profile about you for sale to advertisers.",
      },
      {
        title: "No unnecessary financial credentials",
        text:
          "Worldwide DIPO does not ask you to provide or store your bank password, UPI PIN, card PIN, or similar financial authentication credentials.",
      },
    ],
  },
  {
    number: "03",
    title: "Payment & fraud prevention",
    intro:
      "Payment references are treated as verification and security records, not as public profile information.",
    points: [
      {
        title: "Unique payment references",
        text:
          "Subscription payment references are stored with uniqueness protection so the same transaction reference cannot simply be reused across multiple claims.",
      },
      {
        title: "Rejected payments remain auditable",
        text:
          "If a payment claim is rejected, its transaction reference may remain in the internal audit record. This helps prevent repeated attempts using the same invalid or previously reviewed reference.",
      },
      {
        title: "Amounts are controlled by the platform",
        text:
          "Subscription amounts are determined by the selected plan on the server. The browser is not treated as the authority for the amount that should be verified.",
      },
      {
        title: "Never stored",
        text:
          "Worldwide DIPO does not store your UPI PIN, bank login password, card PIN, or banking authentication secrets.",
      },
    ],
  },
  {
    number: "04",
    title: "Public profile isolation",
    intro:
      "A public DIPO profile is deliberately separated from internal account and payment records.",
    points: [
      {
        title: "Safe public projection",
        text:
          "Public profile pages are designed to expose only information intended for public discovery. Internal account identifiers, payment references, receipts, private authentication information, and internal system metadata are not part of the public profile surface.",
      },
      {
        title: "Search-engine visibility",
        text:
          "Active public profiles can be structured for search-engine discovery using semantic metadata and Schema.org structured data where appropriate.",
      },
      {
        title: "Profile ownership",
        text:
          "The information displayed on a public profile originates from the profile owner and the platform's verification lifecycle. Internal moderation and payment records remain separate.",
      },
    ],
  },
  {
    number: "05",
    title: "Security by design",
    intro:
      "Security is implemented at multiple layers rather than relying only on the frontend.",
    points: [
      {
        title: "Database access controls",
        text:
          "Database access is protected through Row Level Security and controlled server-side operations where applicable.",
      },
      {
        title: "Protected server operations",
        text:
          "Sensitive operations such as payment verification and administrative actions are intended to execute through controlled server-side procedures rather than trusting browser-supplied state.",
      },
      {
        title: "Auditability",
        text:
          "Important administrative payment actions can be recorded in an audit trail containing the relevant action and state transition information.",
      },
      {
        title: "Separation of responsibilities",
        text:
          "Public profile rendering, authentication, payment verification, and administrative workflows are kept as separate system responsibilities to reduce unnecessary exposure.",
      },
    ],
  },
  {
    number: "06",
    title: "Your control",
    intro:
      "Your DIPO identity belongs to your account. You remain in control of the information you choose to publish.",
    points: [
      {
        title: "Edit",
        text:
          "You can update supported profile information from your dashboard.",
      },
      {
        title: "Unpublish",
        text:
          "Where the platform provides the relevant control, you can unpublish or disable your public profile.",
      },
      {
        title: "Deletion requests",
        text:
          "You may contact Worldwide DIPO to request account or data deletion. Certain records may need to be retained where required for security, fraud prevention, legal, accounting, or audit purposes.",
      },
      {
        title: "Public information",
        text:
          "Before publishing information, remember that public profile content may be copied, indexed, cached, or linked by third parties outside Worldwide DIPO.",
      },
    ],
  },
  {
    number: "07",
    title: "Cookies & technical data",
    intro:
      "We aim to keep technical tracking proportional to what the product actually needs.",
    points: [
      {
        title: "Essential operation",
        text:
          "Cookies or similar browser storage may be used when necessary for authentication, sessions, security, preferences, or core platform functionality.",
      },
      {
        title: "Security telemetry",
        text:
          "Technical information such as request metadata, timestamps, browser information, and security-related signals may be processed when needed to protect the service against abuse and unauthorized activity.",
      },
      {
        title: "No hidden data marketplace",
        text:
          "Technical data collected for operating or securing the platform is not intended to become a separately sold personal-data product.",
      },
    ],
  },
  {
    number: "08",
    title: "Search engines & public discovery",
    intro:
      "Worldwide DIPO is built to make verified identities discoverable on the open web.",
    points: [
      {
        title: "Public means public",
        text:
          "If you activate a public DIPO profile, information intentionally placed on that profile may be discovered by search engines and other web crawlers.",
      },
      {
        title: "Structured identity",
        text:
          "Eligible public pages may use semantic HTML and structured metadata to help search engines understand the identity represented by the page.",
      },
      {
        title: "Indexing is not guaranteed",
        text:
          "Using structured metadata does not guarantee that Google, Bing, or another search engine will index, rank, cache, or display a page in any particular way.",
      },
    ],
  },
  {
    number: "09",
    title: "Third-party services",
    intro:
      "Worldwide DIPO may rely on carefully selected infrastructure providers to operate parts of the platform.",
    points: [
      {
        title: "Authentication infrastructure",
        text:
          "Authentication may be provided through Supabase Auth and supported identity providers such as Google.",
      },
      {
        title: "Infrastructure providers",
        text:
          "Infrastructure, database, security, rate-limiting, analytics, or delivery providers may process limited technical information where required to provide their service to Worldwide DIPO.",
      },
      {
        title: "External links",
        text:
          "Your public profile may contain links to third-party websites or social platforms. Their privacy practices are governed by their own policies, not this policy.",
      },
    ],
  },
  {
    number: "10",
    title: "Data retention",
    intro:
      "Different categories of information can have different retention requirements.",
    points: [
      {
        title: "Account data",
        text:
          "Account information may be retained while your account is active or as necessary to provide the service.",
      },
      {
        title: "Payment records",
        text:
          "Payment verification and fraud-prevention records may be retained after a payment decision so that the platform can maintain a reliable audit history and prevent duplicate or fraudulent references.",
      },
      {
        title: "Security records",
        text:
          "Security and operational records may be retained for a reasonable period based on their purpose and applicable requirements.",
      },
    ],
  },
  {
    number: "11",
    title: "Children & responsible use",
    intro:
      "Worldwide DIPO is intended to be used responsibly and in accordance with applicable laws.",
    points: [
      {
        title: "Accurate information",
        text:
          "Do not submit information that belongs to another person without appropriate authorization.",
      },
      {
        title: "No credential sharing",
        text:
          "Never share your authentication credentials, payment PINs, recovery codes, or security secrets with another person or through your public profile.",
      },
    ],
  },
  {
    number: "12",
    title: "Policy updates",
    intro:
      "As Worldwide DIPO evolves globally, this policy may need to change.",
    points: [
      {
        title: "Continuous improvement",
        text:
          "We may update this policy when the product, infrastructure, security practices, or legal requirements change.",
      },
      {
        title: "Material changes",
        text:
          "When appropriate, important changes may be highlighted through the platform or other reasonable communication channels.",
      },
      {
        title: "Your responsibility",
        text:
          "We encourage users to review this page periodically so they understand the current privacy practices.",
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

function LockIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="27"
      height="27"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="21" width="30" height="22" rx="5" />
      <path d="M15 21v-6a9 9 0 0 1 18 0v6" />
      <path d="M24 29v6" />
    </svg>
  );
}

function PublicIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="28"
      height="28"
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
      width="17"
      height="17"
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

export default function PrivacyPage() {
  const lastUpdated = "September 19, 2026";

  return (
    <>
      <style>{`
        :root {
          --dipo-black: #0b0b0c;
          --dipo-ink: #111113;
          --dipo-muted: #6b6b70;
          --dipo-soft: #f6f6f4;
          --dipo-line: #e7e7e5;
          --dipo-green: #0b8f5b;
          --dipo-green-soft: #eaf8f1;
        }

        .dipo-privacy-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 82% 7%, rgba(16, 185, 129, 0.075), transparent 25rem),
            radial-gradient(circle at 8% 24%, rgba(0, 0, 0, 0.035), transparent 26rem),
            #ffffff;
          color: var(--dipo-ink);
          overflow-x: clip;
        }

        .dipo-privacy-page *,
        .dipo-privacy-page *::before,
        .dipo-privacy-page *::after {
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
          border-bottom: 1px solid rgba(17, 17, 19, 0.08);
          background: rgba(255, 255, 255, 0.82);
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
          font-weight: 650;
          letter-spacing: -0.02em;
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
          gap: 9px;
        }

        .dipo-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 999px;
          color: #55555b;
          text-decoration: none;
          font-size: 13px;
          font-weight: 560;
          transition:
            color 180ms ease,
            background 180ms ease,
            transform 180ms ease;
        }

        .dipo-nav-link:hover {
          color: #111113;
          background: #f4f4f3;
          transform: translateY(-1px);
        }

        .dipo-nav-link-dark {
          color: white;
          background: #101012;
        }

        .dipo-nav-link-dark:hover {
          color: white;
          background: #242426;
        }

        .dipo-hero {
          position: relative;
          padding: clamp(72px, 11vw, 150px) 0 clamp(76px, 10vw, 130px);
        }

        .dipo-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(280px, .75fr);
          gap: clamp(44px, 9vw, 130px);
          align-items: end;
        }

        .dipo-eyebrow {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 7px 11px;
          border: 1px solid #e4e4e2;
          border-radius: 999px;
          background: rgba(255,255,255,.75);
          color: #5f6065;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          animation: dipoFadeUp .8s cubic-bezier(.2,.7,.2,1) both;
        }

        .dipo-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #13a36a;
          box-shadow: 0 0 0 5px rgba(19,163,106,.10);
          animation: dipoPulse 2.4s ease-in-out infinite;
        }

        .dipo-title {
          max-width: 900px;
          margin: 22px 0 0;
          font-size: clamp(3.2rem, 8.2vw, 8.4rem);
          line-height: .88;
          letter-spacing: -.075em;
          font-weight: 620;
          text-wrap: balance;
          animation: dipoFadeUp .9s .08s cubic-bezier(.2,.7,.2,1) both;
        }

        .dipo-title-gradient {
          background: linear-gradient(110deg, #101012 0%, #101012 44%, #0b8f5b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .dipo-hero-copy {
          max-width: 470px;
          margin: 0 0 5px auto;
          color: #66676c;
          font-size: clamp(15px, 1.45vw, 18px);
          line-height: 1.65;
          letter-spacing: -.015em;
          animation: dipoFadeUp .9s .16s cubic-bezier(.2,.7,.2,1) both;
        }

        .dipo-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 25px;
        }

        .dipo-meta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 34px;
          padding: 0 11px;
          border: 1px solid #e7e7e5;
          border-radius: 999px;
          color: #626368;
          background: #fafafa;
          font-size: 11px;
          font-weight: 650;
        }

        .dipo-meta strong {
          color: #111113;
          font-weight: 700;
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
          min-height: 180px;
          padding: 30px clamp(18px, 3vw, 42px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 25px;
          border-right: 1px solid var(--dipo-line);
          transition:
            background 250ms ease,
            transform 250ms ease;
        }

        .dipo-feature:first-child {
          border-left: 1px solid var(--dipo-line);
        }

        .dipo-feature:hover {
          background: white;
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
          color: #151517;
          font-size: 16px;
          font-weight: 680;
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
          grid-template-columns: 260px minmax(0, 1fr);
          gap: clamp(45px, 9vw, 125px);
          align-items: start;
        }

        .dipo-index {
          position: sticky;
          top: 105px;
        }

        .dipo-index-label {
          margin: 0 0 16px;
          color: #999a9d;
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
          padding: 7px 0 7px 16px;
          color: #9a9b9f;
          font-size: 12px;
          line-height: 1.3;
          transition: color 180ms ease, padding 180ms ease;
        }

        .dipo-index-item:hover {
          color: #111113;
          padding-left: 20px;
        }

        .dipo-index-number {
          display: inline-block;
          width: 25px;
          color: #c0c1c3;
          font-variant-numeric: tabular-nums;
        }

        .dipo-section {
          scroll-margin-top: 110px;
          padding-bottom: clamp(70px, 8vw, 112px);
          margin-bottom: clamp(70px, 8vw, 112px);
          border-bottom: 1px solid var(--dipo-line);
          animation: dipoSectionIn .8s cubic-bezier(.2,.7,.2,1) both;
        }

        .dipo-section:last-child {
          margin-bottom: 0;
          border-bottom: 0;
        }

        .dipo-section-head {
          display: grid;
          grid-template-columns: 72px minmax(0, 1fr);
          gap: 20px;
          margin-bottom: 42px;
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
          font-size: clamp(30px, 4vw, 52px);
          line-height: .98;
          letter-spacing: -.055em;
          font-weight: 620;
        }

        .dipo-section-intro {
          max-width: 670px;
          margin: 16px 0 0;
          color: #747579;
          font-size: 16px;
          line-height: 1.7;
          letter-spacing: -.012em;
        }

        .dipo-point-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1px;
          overflow: hidden;
          border: 1px solid var(--dipo-line);
          border-radius: 20px;
          background: var(--dipo-line);
        }

        .dipo-point {
          min-height: 180px;
          padding: clamp(23px, 3vw, 34px);
          background: white;
          transition:
            background 220ms ease,
            transform 220ms ease;
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

        .dipo-privacy-card {
          position: relative;
          overflow: hidden;
          margin-top: 10px;
          padding: clamp(30px, 5vw, 60px);
          border-radius: 28px;
          color: white;
          background:
            radial-gradient(circle at 80% 15%, rgba(52,211,153,.22), transparent 18rem),
            linear-gradient(135deg, #0d0d0f 0%, #151518 100%);
          box-shadow:
            0 25px 80px rgba(0,0,0,.10),
            inset 0 1px 0 rgba(255,255,255,.07);
        }

        .dipo-privacy-card::after {
          content: "";
          position: absolute;
          width: 320px;
          height: 320px;
          right: -140px;
          bottom: -180px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.08);
          box-shadow:
            0 0 0 55px rgba(255,255,255,.018),
            0 0 0 110px rgba(255,255,255,.012);
          pointer-events: none;
        }

        .dipo-card-kicker {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #8ee7bf;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .dipo-card-title {
          max-width: 650px;
          margin: 17px 0 0;
          font-size: clamp(30px, 4.5vw, 58px);
          line-height: .98;
          letter-spacing: -.055em;
          font-weight: 600;
        }

        .dipo-card-copy {
          max-width: 650px;
          margin: 18px 0 0;
          color: #a9a9ae;
          font-size: 15px;
          line-height: 1.7;
        }

        .dipo-contact-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .dipo-contact {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 43px;
          padding: 0 15px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px;
          color: #f5f5f5;
          background: rgba(255,255,255,.055);
          text-decoration: none;
          font-size: 12px;
          font-weight: 620;
          transition:
            background 180ms ease,
            border-color 180ms ease,
            transform 180ms ease;
        }

        .dipo-contact:hover {
          background: rgba(255,255,255,.10);
          border-color: rgba(255,255,255,.2);
          transform: translateY(-2px);
        }

        .dipo-footer {
          border-top: 1px solid var(--dipo-line);
          background: #fafaf9;
        }

        .dipo-footer-inner {
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .dipo-footer-brand {
          color: #171719;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -.02em;
        }

        .dipo-footer-copy {
          margin: 5px 0 0;
          color: #8a8b8e;
          font-size: 12px;
        }

        .dipo-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .dipo-footer-link {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 0 12px;
          color: #696a6f;
          text-decoration: none;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 600;
          transition: color 180ms ease, background 180ms ease;
        }

        .dipo-footer-link:hover {
          color: #111113;
          background: #eeeeec;
        }

        .dipo-credits-strip {
          padding: 24px 0 34px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          border-top: 1px dashed var(--dipo-line);
        }

        .dipo-credits-made {
          font-size: 12px;
          color: #88898e;
          margin: 0;
        }

        .dipo-credits-product {
          font-size: 13px;
          color: #66676c;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .dipo-credits-copy {
          font-size: 11px;
          color: #9a9b9f;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .dipo-reveal {
          animation: dipoFadeUp .8s cubic-bezier(.2,.7,.2,1) both;
        }

        @keyframes dipoFadeUp {
          from {
            opacity: 0;
            transform: translate3d(0, 22px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes dipoSectionIn {
          from {
            opacity: 0;
            transform: translate3d(0, 18px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes dipoPulse {
          0%, 100% {
            transform: scale(1);
            opacity: .8;
          }
          50% {
            transform: scale(1.18);
            opacity: 1;
          }
        }

        @media (max-width: 900px) {
          .dipo-hero-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .dipo-hero-copy {
            margin-left: 0;
            max-width: 600px;
          }

          .dipo-content-grid {
            grid-template-columns: 1fr;
          }

          .dipo-index {
            position: static;
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
            padding-top: 72px;
            padding-bottom: 70px;
          }

          .dipo-title {
            font-size: clamp(3.05rem, 15vw, 5rem);
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
            grid-template-columns: 42px minmax(0, 1fr);
            gap: 12px;
          }

          .dipo-section-title {
            font-size: clamp(30px, 9vw, 43px);
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

          .dipo-privacy-card {
            border-radius: 22px;
          }

          .dipo-footer-inner {
            min-height: 190px;
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-privacy-page *,
          .dipo-privacy-page *::before,
          .dipo-privacy-page *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <main className="dipo-privacy-page">
        <header className="dipo-topbar">
          <div className="dipo-container dipo-nav">
            <Link href="/" className="dipo-brand" aria-label="Worldwide DIPO home">
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
              <span>Worldwide DIPO</span>
            </Link>

            <nav className="dipo-nav-right" aria-label="Privacy navigation">
              <Link href="/terms" className="dipo-nav-link">
                Terms
              </Link>

              <Link href="/contact" className="dipo-nav-link">
                Contact
              </Link>

              <Link href="/" className="dipo-nav-link dipo-nav-link-dark">
                Back home
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
                Privacy by design
              </div>

              <h1 className="dipo-title">
                Your identity.
                <br />
                <span className="dipo-title-gradient">Your control.</span>
              </h1>
            </div>

            <div className="dipo-hero-copy">
              <p>
                Worldwide DIPO is built to give people and businesses a
                trusted identity on the open web without turning personal
                information into an advertising product.
              </p>

              <div className="dipo-meta-row">
                <span className="dipo-meta">
                  <strong>Updated</strong> {lastUpdated}
                </span>
                <span className="dipo-meta">
                  <strong>12</strong> privacy areas
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="dipo-feature-strip" aria-label="Privacy principles">
          <div className="dipo-container dipo-feature-grid">
            <article className="dipo-feature">
              <div className="dipo-feature-icon">
                <ShieldIcon />
              </div>
              <div>
                <h2 className="dipo-feature-title">No data selling</h2>
                <p className="dipo-feature-text">
                  Your personal information is not sold to data brokers or ad
                  networks.
                </p>
              </div>
            </article>

            <article className="dipo-feature">
              <div className="dipo-feature-icon">
                <LockIcon />
              </div>
              <div>
                <h2 className="dipo-feature-title">Private by separation</h2>
                <p className="dipo-feature-text">
                  Public identity data stays separated from internal account
                  and payment records.
                </p>
              </div>
            </article>

            <article className="dipo-feature">
              <div className="dipo-feature-icon">
                <PublicIcon />
              </div>
              <div>
                <h2 className="dipo-feature-title">Open-web identity</h2>
                <p className="dipo-feature-text">
                  You choose what becomes part of your public DIPO identity.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="dipo-content">
          <div className="dipo-container dipo-content-grid">
            <aside className="dipo-index" aria-label="Privacy policy sections">
              <p className="dipo-index-label">On this page</p>

              <ol className="dipo-index-list">
                {sections.map((section) => (
                  <li key={section.number}>
                    <a
                      className="dipo-index-item"
                      href={`#privacy-${section.number}`}
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
                  id={`privacy-${section.number}`}
                  className="dipo-section"
                  key={section.number}
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
                      <article className="dipo-point" key={point.title}>
                        <div className="dipo-point-top">
                          <span className="dipo-point-check">
                            <CheckIcon />
                          </span>

                          <h3 className="dipo-point-title">
                            {point.title}
                          </h3>
                        </div>

                        <p className="dipo-point-text">{point.text}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}

              <section className="dipo-privacy-card">
                <div className="dipo-card-kicker">
                  <ShieldIcon />
                  Worldwide DIPO privacy
                </div>

                <h2 className="dipo-card-title">
                  Questions about your data?
                </h2>

                <p className="dipo-card-copy">
                  If you need help understanding your profile visibility,
                  account information, payment verification records, or a
                  deletion request, contact the official Worldwide DIPO
                  support team.
                </p>

                <div className="dipo-contact-row">
                  <a
                    className="dipo-contact"
                    href="mailto:dipolabs123@gmail.com"
                  >
                    dipolabs123@gmail.com
                    <ArrowUpRight />
                  </a>

                  <a
                    className="dipo-contact"
                    href="https://instagram.com/dipolabs.io"
                    target="_blank"
                    rel="noreferrer"
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
              <div className="dipo-footer-brand">Worldwide DIPO</div>
              <p className="dipo-footer-copy">
                A trusted identity layer for the open web.
              </p>
            </div>

            <nav className="dipo-footer-links" aria-label="Footer navigation">
              <Link href="/" className="dipo-footer-link">
                Home
              </Link>
              <Link href="/terms" className="dipo-footer-link">
                Terms
              </Link>
              <Link href="/refund" className="dipo-footer-link">
                Refund
              </Link>
              <Link href="/contact" className="dipo-footer-link">
                Contact
              </Link>
            </nav>
          </div>

          <div className="dipo-container dipo-credits-strip">
            <p className="dipo-credits-made">Made With ❤️ in India</p>
            <p className="dipo-credits-product">𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱</p>
            <p className="dipo-credits-copy">All copyrights reserved @ 𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱</p>
          </div>
        </footer>
      </main>
    </>
  );
}
