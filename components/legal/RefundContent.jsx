import Link from 'next/link';

const sections = [
  {
    number: '01',
    title: 'Subscription model',
    text: [
      'Worldwide DIPO provides subscription-based digital identity profiles. Available plans are sold for a defined subscription period, currently six months.',
      'The price displayed during checkout is the applicable price for the selected plan and subscription period.',
    ],
  },
  {
    number: '02',
    title: 'Payment verification',
    text: [
      'For supported payment methods, Worldwide DIPO may require a UTR or payment reference after payment is made.',
      'Submitting a payment reference does not itself confirm payment. A subscription becomes active only after the payment has been successfully verified through our internal process.',
    ],
  },
  {
    number: '03',
    title: 'When a refund may be considered',
    text: [
      'A refund request may be considered where payment was successfully received but the corresponding service cannot reasonably be delivered because of an issue attributable to Worldwide DIPO.',
      'Duplicate payments and clear payment-processing mistakes may also be reviewed on a case-by-case basis.',
    ],
  },
  {
    number: '04',
    title: 'Non-refundable situations',
    text: [
      'A subscription payment is generally non-refundable once the requested profile service has been activated or materially delivered.',
      'Refunds are not automatically available simply because a user changes their mind, does not use the profile, or does not receive an expected external result.',
    ],
    bullets: [
      'Search-engine visibility or indexing',
      'Search ranking or position',
      'Knowledge Panels or search features',
      'Third-party verification',
      'Social-platform outcomes',
      'Business, traffic or opportunity outcomes',
    ],
  },
  {
    number: '05',
    title: 'Profile rejection or moderation',
    text: [
      'Worldwide DIPO may reject, suspend or restrict a profile when information, content or activity violates our Terms, creates security concerns, involves impersonation, fraud, abuse or other prohibited activity.',
      'A rejected, suspended or restricted profile does not automatically create a right to a refund. Any refund consideration depends on the circumstances and applicable terms.',
    ],
  },
  {
    number: '06',
    title: 'Renewals',
    text: [
      'Renewal payments are separate subscription transactions. A renewal does not automatically guarantee a refund after approval or activation.',
      'If a renewal payment has been submitted but has not yet been verified and you believe it was made in error, contact support as soon as reasonably possible.',
    ],
  },
  {
    number: '07',
    title: 'Duplicate or mistaken payment',
    text: [
      'If you accidentally make multiple payments for the same subscription, contact support with the relevant payment references.',
      'We may request reasonable information required to identify the transaction and determine the appropriate resolution.',
    ],
  },
  {
    number: '08',
    title: 'How to request a refund review',
    text: [
      'Refund and payment-resolution requests should be submitted through the official Worldwide DIPO support channels.',
      'To help us review the request efficiently, include the account email, relevant profile information and payment reference where applicable.',
    ],
  },
  {
    number: '09',
    title: 'Review process',
    text: [
      'Each request may be reviewed against the relevant payment record, subscription status, profile status and service history.',
      'Additional transaction information may be requested when necessary to identify or verify a payment.',
      'Never send your UPI PIN, banking password, authentication OTP, card PIN or other banking secrets to Worldwide DIPO support.',
    ],
  },
  {
    number: '10',
    title: 'Policy updates',
    text: [
      'This Refund Policy may be updated when our pricing, payment process, service structure or legal requirements change.',
      'The current version published on this page applies to relevant transactions subject to applicable law and the terms accepted during purchase.',
    ],
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        width: 17,
        height: 17,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        width: 15,
        height: 15,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2.4,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        width: 20,
        height: 20,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
    >
      <path d="M12 3 20 6v5c0 5-3.2 8.6-8 10-4.8-1.4-8-5-8-10V6l8-3Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        width: 18,
        height: 18,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        width: 18,
        height: 18,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SectionCard({ section }) {
  return (
    <section
      style={{
        position: 'relative',
        padding: 'clamp(24px, 4vw, 38px) 0',
        borderBottom: '1px solid #e8ece9',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr)',
          gap: 'clamp(16px, 3vw, 28px)',
          alignItems: 'start',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            background: '#101312',
            color: '#fff',
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: '.06em',
            boxShadow: '0 8px 22px rgba(16,19,18,.10)',
          }}
        >
          {section.number}
        </div>

        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              color: '#101312',
              fontSize: 'clamp(20px, 3vw, 28px)',
              lineHeight: 1.12,
              letterSpacing: '-.045em',
              fontWeight: 900,
            }}
          >
            {section.title}
          </h2>

          <div
            style={{
              marginTop: 15,
              display: 'grid',
              gap: 12,
              color: '#59625e',
              fontSize: 'clamp(14px, 1.5vw, 15px)',
              lineHeight: 1.82,
            }}
          >
            {section.text.map((paragraph) => (
              <p
                key={paragraph}
                style={{
                  margin: 0,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {section.bullets?.length ? (
            <ul
              style={{
                listStyle: 'none',
                margin: '18px 0 0',
                padding: 0,
                display: 'grid',
                gap: 9,
              }}
            >
              {section.bullets.map((item) => (
                <li
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 9,
                    color: '#353d39',
                    fontSize: 13.5,
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      marginTop: 1,
                      borderRadius: 8,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      background: '#ecfdf5',
                      color: '#059669',
                    }}
                  >
                    <CheckIcon />
                  </span>

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function RefundContent() {
  return (
    <article
      className="dipo-refund-document"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'clamp(22px, 4vw, 34px)',
        border: '1px solid #e5eae7',
        background: '#fff',
        boxShadow:
          '0 24px 80px rgba(16,24,20,.055), 0 4px 18px rgba(16,24,20,.025)',
      }}
    >
      <style>{`
        .dipo-refund-document a {
          transition:
            transform 180ms ease,
            background-color 180ms ease,
            border-color 180ms ease,
            color 180ms ease,
            box-shadow 180ms ease;
        }

        .dipo-refund-document a:focus-visible {
          outline: 3px solid rgba(16,185,129,.28);
          outline-offset: 3px;
        }

        .dipo-refund-contact-link:hover {
          transform: translateY(-2px);
          border-color: #cfd8d3 !important;
          background: #fbfdfc !important;
          box-shadow: 0 10px 28px rgba(16,24,20,.06);
        }

        .dipo-refund-primary:hover {
          transform: translateY(-2px);
          background: #059669 !important;
          box-shadow: 0 14px 30px rgba(5,150,105,.20);
        }

        @media (max-width: 560px) {
          .dipo-refund-grid {
            grid-template-columns: 1fr !important;
          }

          .dipo-refund-hero-actions {
            grid-template-columns: 1fr !important;
          }

          .dipo-refund-section-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-refund-document a {
            transition: none !important;
          }
        }
      `}</style>

      {/* Premium document hero */}
      <header
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(30px, 6vw, 62px)',
          background:
            'radial-gradient(circle at 92% 8%, rgba(16,185,129,.13), transparent 28%), linear-gradient(135deg, #fbfefc 0%, #f7faf8 52%, #ffffff 100%)',
          borderBottom: '1px solid #e7ece9',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 260,
            height: 260,
            right: -120,
            top: -150,
            borderRadius: '50%',
            border: '1px solid rgba(16,185,129,.14)',
            boxShadow:
              '0 0 0 36px rgba(16,185,129,.035), 0 0 0 72px rgba(16,185,129,.018)',
          }}
        />

        <div
          style={{
            position: 'relative',
            maxWidth: 820,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 11px',
              borderRadius: 999,
              background: '#ecfdf5',
              border: '1px solid #d1fae5',
              color: '#047857',
              fontSize: 10,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: '.105em',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 0 4px rgba(16,185,129,.10)',
              }}
            />

            PAYMENTS · SUBSCRIPTIONS · RESOLUTION
          </div>

          <h1
            style={{
              margin: '20px 0 15px',
              maxWidth: 780,
              color: '#101312',
              fontSize: 'clamp(38px, 8vw, 76px)',
              lineHeight: '.94',
              letterSpacing: '-.075em',
              fontWeight: 950,
            }}
          >
            Refund Policy.
            <br />
            <span style={{ color: '#059669' }}>
              Clear from day one.
            </span>
          </h1>

          <p
            style={{
              maxWidth: 700,
              margin: 0,
              color: '#626c67',
              fontSize: 'clamp(14px, 2vw, 17px)',
              lineHeight: 1.75,
            }}
          >
            Our payment and refund rules are designed to keep subscription
            transactions clear, verifiable and easy to understand.
          </p>

          <div
            className="dipo-refund-hero-actions"
            style={{
              marginTop: 26,
              display: 'grid',
              gridTemplateColumns: 'auto auto',
              justifyContent: 'start',
              gap: 10,
            }}
          >
            <Link
              href="/contact"
              className="dipo-refund-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 9,
                minHeight: 46,
                padding: '0 17px',
                borderRadius: 13,
                background: '#101312',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 850,
                letterSpacing: '-.01em',
              }}
            >
              Contact support
              <ArrowIcon />
            </Link>

            <Link
              href="/terms"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                minHeight: 46,
                padding: '0 16px',
                borderRadius: 13,
                background: '#fff',
                color: '#303833',
                border: '1px solid #dfe6e2',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              Read Terms
            </Link>
          </div>
        </div>
      </header>

      {/* Policy snapshot */}
      <section
        aria-label="Refund policy summary"
        style={{
          padding: 'clamp(20px, 4vw, 30px)',
          borderBottom: '1px solid #e8ece9',
          background: '#fcfdfc',
        }}
      >
        <div
          className="dipo-refund-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 12,
          }}
        >
          {[
            {
              label: 'Subscription',
              value: 'Currently 6 months',
            },
            {
              label: 'Payment review',
              value: 'Verification may be required',
            },
            {
              label: 'Refund basis',
              value: 'Case-by-case review',
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                minWidth: 0,
                padding: 17,
                borderRadius: 16,
                background: '#fff',
                border: '1px solid #e4eae6',
              }}
            >
              <div
                style={{
                  color: '#7a847f',
                  fontSize: 10,
                  lineHeight: 1.2,
                  fontWeight: 900,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                }}
              >
                {item.label}
              </div>

              <div
                style={{
                  marginTop: 7,
                  color: '#171c19',
                  fontSize: 14,
                  lineHeight: 1.45,
                  fontWeight: 850,
                  letterSpacing: '-.015em',
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important notice */}
      <section
        style={{
          padding: 'clamp(22px, 4vw, 32px)',
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: 'clamp(20px, 4vw, 28px)',
            borderRadius: 20,
            background:
              'linear-gradient(135deg, #f0fdf8 0%, #f7fffb 55%, #ffffff 100%)',
            border: '1px solid #d8f3e7',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 13,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                background: '#101312',
                color: '#fff',
              }}
            >
              <ShieldIcon />
            </span>

            <div>
              <div
                style={{
                  color: '#047857',
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: '.1em',
                }}
              >
                IMPORTANT
              </div>

              <p
                style={{
                  margin: '8px 0 0',
                  color: '#46514c',
                  fontSize: 'clamp(13px, 1.7vw, 14px)',
                  lineHeight: 1.75,
                }}
              >
                Worldwide DIPO does not guarantee search-engine indexing,
                rankings, Knowledge Panels, external-platform verification or
                any particular business outcome. These outcomes are controlled
                by third parties and are not grounds for an automatic refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main policy */}
      <div
        style={{
          padding: '0 clamp(22px, 5vw, 56px)',
        }}
      >
        {sections.map((section) => (
          <SectionCard key={section.number} section={section} />
        ))}
      </div>

      {/* Support CTA */}
      <section
        style={{
          padding: 'clamp(28px, 5vw, 56px)',
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: 'clamp(24px, 5vw, 38px)',
            borderRadius: 24,
            background: '#101312',
            color: '#fff',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: 230,
              height: 230,
              right: -100,
              top: -110,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,.09)',
              boxShadow:
                '0 0 0 35px rgba(255,255,255,.025), 0 0 0 70px rgba(255,255,255,.015)',
            }}
          />

          <div
            style={{
              position: 'relative',
              maxWidth: 760,
            }}
          >
            <div
              style={{
                color: '#6ee7b7',
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: '.11em',
              }}
            >
              NEED A REVIEW?
            </div>

            <h2
              style={{
                margin: '10px 0 10px',
                fontSize: 'clamp(25px, 5vw, 42px)',
                lineHeight: 1,
                letterSpacing: '-.055em',
                fontWeight: 900,
              }}
            >
              Let&apos;s look at your payment.
            </h2>

            <p
              style={{
                maxWidth: 650,
                margin: 0,
                color: '#b8c2bd',
                fontSize: 14,
                lineHeight: 1.75,
              }}
            >
              If you believe a payment needs review, contact the official
              Worldwide DIPO support team with the relevant payment reference.
            </p>

            <div
              className="dipo-refund-grid"
              style={{
                marginTop: 22,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 10,
                maxWidth: 700,
              }}
            >
              <a
                href="mailto:dipolabs123@gmail.com"
                className="dipo-refund-contact-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  minWidth: 0,
                  padding: 14,
                  borderRadius: 15,
                  background: 'rgba(255,255,255,.055)',
                  border: '1px solid rgba(255,255,255,.10)',
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    background: 'rgba(16,185,129,.14)',
                    color: '#6ee7b7',
                  }}
                >
                  <MailIcon />
                </span>

                <span style={{ minWidth: 0 }}>
                  <small
                    style={{
                      display: 'block',
                      color: '#8f9a95',
                      fontSize: 9,
                      fontWeight: 850,
                      letterSpacing: '.08em',
                    }}
                  >
                    EMAIL
                  </small>

                  <strong
                    style={{
                      display: 'block',
                      marginTop: 3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    dipolabs123@gmail.com
                  </strong>
                </span>
              </a>

              <a
                href="https://instagram.com/dipolabs.io"
                target="_blank"
                rel="noopener noreferrer"
                className="dipo-refund-contact-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  minWidth: 0,
                  padding: 14,
                  borderRadius: 15,
                  background: 'rgba(255,255,255,.055)',
                  border: '1px solid rgba(255,255,255,.10)',
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    background: 'rgba(16,185,129,.14)',
                    color: '#6ee7b7',
                  }}
                >
                  <InstagramIcon />
                </span>

                <span style={{ minWidth: 0 }}>
                  <small
                    style={{
                      display: 'block',
                      color: '#8f9a95',
                      fontSize: 9,
                      fontWeight: 850,
                      letterSpacing: '.08em',
                    }}
                  >
                    INSTAGRAM
                  </small>

                  <strong
                    style={{
                      display: 'block',
                      marginTop: 3,
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    @dipolabs.io
                  </strong>
                </span>
              </a>
            </div>

            <p
              style={{
                margin: '18px 0 0',
                color: '#7f8b85',
                fontSize: 11.5,
                lineHeight: 1.7,
              }}
            >
              Security note: never send your UPI PIN, banking password, OTP,
              card PIN or other banking credentials to support.
            </p>
          </div>
        </div>
      </section>

      {/* Document footer */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          padding: '20px clamp(22px, 5vw, 56px) 26px',
          borderTop: '1px solid #e8ece9',
          color: '#7b8580',
          fontSize: 11.5,
          lineHeight: 1.6,
        }}
      >
        <span>Last updated: September 9, 2026</span>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/privacy"
            style={{
              color: '#59625e',
              textDecoration: 'none',
              fontWeight: 750,
            }}
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            style={{
              color: '#59625e',
              textDecoration: 'none',
              fontWeight: 750,
            }}
          >
            Terms
          </Link>

          <Link
            href="/contact"
            style={{
              color: '#059669',
              textDecoration: 'none',
              fontWeight: 850,
            }}
          >
            Contact
          </Link>
        </div>
      </footer>
    </article>
  );
}