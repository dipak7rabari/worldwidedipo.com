import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy | Worldwide DIPO',
  description:
    'Worldwide DIPO subscription payment, refund and cancellation policy.',
  alternates: {
    canonical: 'https://worldwidedipo.com/refund',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const refundSections = [
  {
    number: '01',
    title: 'Subscription model',
    content: (
      <>
        <p>
          Worldwide DIPO provides subscription-based digital
          identity profiles. The available plans are sold for
          a defined subscription period, currently six months.
        </p>

        <p>
          Prices shown during checkout are the applicable
          subscription prices for the selected plan.
        </p>
      </>
    ),
  },
  {
    number: '02',
    title: 'Payment verification',
    content: (
      <>
        <p>
          Worldwide DIPO uses a payment verification process
          for supported UPI payments. After completing a
          payment, the user may be required to submit the
          UTR or payment reference.
        </p>

        <p>
          A submitted payment reference does not by itself
          confirm payment. A subscription becomes active only
          after the payment has been successfully verified
          through our internal process.
        </p>
      </>
    ),
  },
  {
    number: '03',
    title: 'When a refund may be considered',
    content: (
      <>
        <p>
          Refund requests may be considered where a payment
          was successfully received but the corresponding
          service cannot reasonably be delivered because of
          an issue attributable to Worldwide DIPO.
        </p>

        <p>
          We may also review duplicate payments or clear
          payment-processing mistakes on a case-by-case basis.
        </p>
      </>
    ),
  },
  {
    number: '04',
    title: 'Non-refundable situations',
    content: (
      <>
        <p>
          A subscription payment is generally non-refundable
          once the requested profile service has been
          activated or materially delivered.
        </p>

        <p>
          Refunds are not automatically available simply
          because a user changes their mind, does not use the
          profile, does not receive expected search-engine
          visibility, or does not obtain a particular ranking,
          indexing result, Knowledge Panel, verification
          result or external-platform outcome.
        </p>
      </>
    ),
  },
  {
    number: '05',
    title: 'Profile rejection or moderation',
    content: (
      <>
        <p>
          Worldwide DIPO may reject, suspend or restrict a
          profile where information, content or activity
          violates our Terms, creates security concerns,
          involves impersonation, fraud, abuse or other
          prohibited activity.
        </p>

        <p>
          A rejected profile does not automatically create a
          right to a refund. Any refund consideration depends
          on the circumstances of the case and the applicable
          terms.
        </p>
      </>
    ),
  },
  {
    number: '06',
    title: 'Renewals',
    content: (
      <>
        <p>
          Renewal payments are separate subscription
          transactions. A renewal does not automatically
          guarantee a refund after approval or activation.
        </p>

        <p>
          If a renewal payment has been submitted but not yet
          verified, contact support as soon as possible if you
          believe it was made in error.
        </p>
      </>
    ),
  },
  {
    number: '07',
    title: 'Duplicate or mistaken payment',
    content: (
      <>
        <p>
          If you accidentally make multiple payments for the
          same subscription, contact support with the relevant
          payment references.
        </p>

        <p>
          We may request reasonable information required to
          identify the transaction and determine the correct
          resolution.
        </p>
      </>
    ),
  },
  {
    number: '08',
    title: 'How to request a review',
    content: (
      <>
        <p>
          Send a refund or payment-resolution request through
          our official support channels.
        </p>

        <div
          style={{
            marginTop: 15,
            padding: 17,
            borderRadius: 15,
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: '#111827',
            }}
          >
            Support
          </div>

          <div
            style={{
              marginTop: 8,
              display: 'grid',
              gap: 5,
              color: '#4b5563',
              fontSize: 13,
            }}
          >
            <div>
              Email:{' '}
              <a
                href="mailto:dipolabs123@gmail.com"
                style={{
                  color: '#2563eb',
                  fontWeight: 800,
                }}
              >
                dipolabs123@gmail.com
              </a>
            </div>

            <div>
              Instagram:{' '}
              <a
                href="https://instagram.com/dipolabs.io"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#2563eb',
                  fontWeight: 800,
                }}
              >
                @dipolabs.io
              </a>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    number: '09',
    title: 'Review process',
    content: (
      <>
        <p>
          Each request may be reviewed against the relevant
          payment record, subscription status and service
          history.
        </p>

        <p>
          We may ask for additional transaction information
          when necessary to identify a payment. Never send
          your UPI PIN, banking password, OTP or card PIN to
          Worldwide DIPO support.
        </p>
      </>
    ),
  },
  {
    number: '10',
    title: 'Policy updates',
    content: (
      <>
        <p>
          This Refund Policy may be updated when our pricing,
          payment process, service structure or legal
          requirements change.
        </p>

        <p>
          The current version published on this page applies
          to relevant transactions subject to applicable law
          and the terms accepted during purchase.
        </p>
      </>
    ),
  },
];

function Section({ number, title, content }) {
  return (
    <section
      style={{
        padding: '30px 0',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 18,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: 13,
            display: 'grid',
            placeItems: 'center',
            background: '#111827',
            color: '#fff',
            fontSize: 10,
            fontWeight: 950,
          }}
        >
          {number}
        </div>

        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(19px, 3vw, 25px)',
              lineHeight: 1.15,
              fontWeight: 950,
              letterSpacing: '-.04em',
            }}
          >
            {title}
          </h2>

          <div
            style={{
              marginTop: 14,
              color: '#4b5563',
              fontSize: 14,
              lineHeight: 1.85,
            }}
          >
            {content}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RefundPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 90% 0%, rgba(37,99,235,.08), transparent 30%), #f8fafc',
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          padding: '28px 20px 80px',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            paddingBottom: 24,
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              color: '#111827',
              textDecoration: 'none',
              fontWeight: 950,
              letterSpacing: '-.035em',
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 12,
                background: '#111827',
                color: '#fff',
                fontSize: 14,
              }}
            >
              D
            </span>

            WORLDWIDE DIPO
          </Link>

          <nav
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/pricing"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Pricing
            </Link>

            <Link
              href="/terms"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Terms
            </Link>

            <Link
              href="/contact"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Contact
            </Link>
          </nav>
        </header>

        <section
          style={{
            padding: '72px 0 42px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '7px 11px',
              borderRadius: 999,
              background: '#ecfdf5',
              color: '#047857',
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: '.1em',
            }}
          >
            PAYMENTS · SUBSCRIPTIONS · RESOLUTION
          </div>

          <h1
            style={{
              maxWidth: 820,
              margin: '18px 0 14px',
              fontSize: 'clamp(42px, 8vw, 76px)',
              lineHeight: '.94',
              letterSpacing: '-.07em',
              fontWeight: 950,
            }}
          >
            Refund Policy.
            <br />
            <span style={{ color: '#2563eb' }}>
              Clear from day one.
            </span>
          </h1>

          <p
            style={{
              maxWidth: 720,
              margin: 0,
              color: '#6b7280',
              fontSize: 16,
              lineHeight: 1.8,
            }}
          >
            Our payment and refund rules are designed to keep
            subscription transactions clear, verifiable and
            fair.
          </p>
        </section>

        <section
          style={{
            padding: 24,
            borderRadius: 22,
            background: '#fff',
            border: '1px solid #e5e7eb',
            boxShadow:
              '0 16px 50px rgba(17,24,39,.05)',
          }}
        >
          <div
            style={{
              color: '#2563eb',
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: '.1em',
            }}
          >
            IMPORTANT
          </div>

          <p
            style={{
              margin: '10px 0 0',
              color: '#4b5563',
              fontSize: 13,
              lineHeight: 1.75,
            }}
          >
            Worldwide DIPO does not guarantee search-engine
            indexing, rankings, Knowledge Panels, external
            platform verification or any particular business
            outcome. Such outcomes are controlled by third
            parties and are not grounds for an automatic
            refund.
          </p>
        </section>

        <div style={{ marginTop: 10 }}>
          {refundSections.map((section) => (
            <Section
              key={section.number}
              {...section}
            />
          ))}
        </div>

        <footer
          style={{
            marginTop: 50,
            paddingTop: 24,
            borderTop: '1px solid #e5e7eb',
            color: '#9ca3af',
            fontSize: 11,
            lineHeight: 1.7,
          }}
        >
          <div
            style={{
              color: '#374151',
              fontWeight: 900,
              marginBottom: 5,
            }}
          >
            Worldwide DIPO · DIPO LABS
          </div>

          <div>
            Made with ❤️ in India
          </div>

          <div style={{ marginTop: 5 }}>
            © 2026 𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱. All rights reserved.
          </div>
        </footer>
      </div>
    </main>
  );
}