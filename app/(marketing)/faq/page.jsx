import Link from 'next/link';
import './faq.css';

const faqs = [
  {
    category: 'DIPO',
    question: 'What is Worldwide DIPO?',
    answer:
      'Worldwide DIPO is a Personal Digital Identity Page platform that helps students, workers, professionals, freelancers, creators and businesses build a public digital identity on the web.',
  },
  {
    category: 'DIPO',
    question: 'Do I need my own website?',
    answer:
      'No. Worldwide DIPO is designed for people who want a professional digital identity page without having to build and maintain a complete website.',
  },
  {
    category: 'DIPO',
    question: 'Who can create a DIPO profile?',
    answer:
      'Students, workers, professionals, freelancers, creators, shop owners, business owners and other eligible individuals can create a profile, subject to the platform rules.',
  },
  {
    category: 'PROFILE',
    question: 'How does Worldwide DIPO work?',
    answer:
      'You create your account, set up your profile, select a subscription plan, complete the payment process and submit your UTR or Payment Reference. After successful payment verification, your eligible profile can be activated and published.',
  },
  {
    category: 'PROFILE',
    question: 'Do visitors need an account to view my profile?',
    answer:
      'No. Public visitors do not need to log in to view an active public DIPO profile.',
  },
  {
    category: 'PROFILE',
    question: 'What is my DIPO URL?',
    answer:
      'An active profile is available through a public URL using the format worldwidedipo.com/p/your-slug.',
  },
  {
    category: 'PROFILE',
    question: 'Can I choose my profile URL?',
    answer:
      'You can select an available profile slug subject to Worldwide DIPO validation, reserved words and uniqueness rules.',
  },
  {
    category: 'PROFILE',
    question: 'Can I edit my profile after creating it?',
    answer:
      'Yes. Profile editing is available according to the current profile state and applicable platform rules. Some identity-critical fields may be temporarily locked during payment review.',
  },
  {
    category: 'PAYMENTS',
    question: 'What happens after I submit payment?',
    answer:
      'Your payment claim enters a pending verification state. The submitted payment reference is reviewed against the actual payment before the profile is activated.',
  },
  {
    category: 'PAYMENTS',
    question: 'What is a UTR / Payment Reference?',
    answer:
      'A UTR or Payment Reference is the transaction reference supplied by your UPI or payment provider after a payment. Worldwide DIPO uses it as part of payment verification.',
  },
  {
    category: 'PAYMENTS',
    question: 'Is entering a UTR enough to activate my profile?',
    answer:
      'No. A submitted reference does not automatically activate a profile. Activation depends on successful verification of the actual payment.',
  },
  {
    category: 'PAYMENTS',
    question: 'Can I submit a fake payment reference?',
    answer:
      'No. False, misleading or fraudulent payment information is prohibited and may result in rejection, suspension or other action under the platform rules.',
  },
  {
    category: 'PLANS',
    question: 'What subscription plans are available?',
    answer:
      'Worldwide DIPO offers Starter Index, Pro Creator and Authority Elite plans. Features and pricing depend on the selected plan.',
  },
  {
    category: 'PLANS',
    question: 'How long is a subscription valid?',
    answer:
      'Worldwide DIPO subscriptions are offered for a six-month period according to the selected plan.',
  },
  {
    category: 'PLANS',
    question: 'Can I renew my profile?',
    answer:
      'Yes. Eligible profiles can be renewed through the renewal payment flow. An active profile can remain active while its separate renewal payment is being reviewed.',
  },
  {
    category: 'PLANS',
    question: 'What happens when my profile expires?',
    answer:
      'An expired profile is no longer publicly active. A limited renewal grace period may apply according to the platform lifecycle rules. If it is not renewed within the applicable period, it may be permanently removed.',
  },
  {
    category: 'VERIFICATION',
    question: 'What does the Verified badge mean?',
    answer:
      'The Worldwide DIPO Verified badge is an internal platform indicator associated with the applicable verification process. It is not Google verification, government verification, social-media verification or third-party endorsement.',
  },
  {
    category: 'SEARCH',
    question: 'Will my profile definitely appear on Google?',
    answer:
      'No. Worldwide DIPO can provide search-ready metadata, structured data, canonical information and sitemap signals where applicable. Crawling, indexing, ranking and search appearance are controlled by search engines and cannot be guaranteed.',
  },
  {
    category: 'SEARCH',
    question: 'Will I automatically get a Google Knowledge Panel?',
    answer:
      'No. Worldwide DIPO does not guarantee a Google Knowledge Panel or any specific search-engine feature, ranking or placement.',
  },
  {
    category: 'PROFILE',
    question: 'Can I add social-media links?',
    answer:
      'Yes. Supported social and external links can be added subject to platform validation, security rules and acceptable-use requirements.',
  },
  {
    category: 'BUSINESS',
    question: 'Can I add my business information?',
    answer:
      'Eligible plans can include business information such as category, services, location and external business links.',
  },
  {
    category: 'PROFILE',
    question: 'Can I add projects and work samples?',
    answer:
      'Yes. Depending on the selected plan and profile configuration, you can showcase projects, services, experience, education, skills and external work links.',
  },
  {
    category: 'PROFILE',
    question: 'Can I upload profile images?',
    answer:
      'Eligible plans support profile media within the applicable image limits and supported file formats and sizes.',
  },
  {
    category: 'PRIVACY',
    question: 'Is my phone number automatically public?',
    answer:
      'Contact information should only be published when intended for public display. Public profile information is handled according to the profile configuration and platform privacy rules.',
  },
  {
    category: 'PRIVACY',
    question: 'Is my email address shown publicly?',
    answer:
      'Private account and authentication information is not intended to be exposed as public profile data. Only information specifically configured for public display should appear on a public profile.',
  },
  {
    category: 'ACCOUNT',
    question: 'Can I delete my profile?',
    answer:
      'Profile and account deletion requests are subject to the applicable platform process, retention requirements and legal obligations.',
  },
  {
    category: 'SAFETY',
    question: 'Can Worldwide DIPO reject my profile?',
    answer:
      'Yes. Profiles or content may be rejected, restricted, suspended or removed when they do not satisfy platform requirements or applicable terms.',
  },
  {
    category: 'PAYMENTS',
    question: 'Can Worldwide DIPO reject a payment claim?',
    answer:
      'Yes. A payment claim can be rejected when the actual payment cannot be verified or when the submitted information does not satisfy the payment verification requirements.',
  },
  {
    category: 'SAFETY',
    question: 'Can I use someone else’s identity or profile information?',
    answer:
      'No. Impersonation, identity misuse, fraudulent representation and misleading information are prohibited.',
  },
  {
    category: 'SAFETY',
    question: 'Can I use Worldwide DIPO for illegal content?',
    answer:
      'No. Illegal, fraudulent, abusive, harmful or otherwise prohibited content and activities are not allowed on the platform.',
  },
  {
    category: 'SEARCH',
    question: 'Does Worldwide DIPO guarantee search ranking?',
    answer:
      'No. Search ranking, indexing and visibility depend on external search-engine systems and many factors outside Worldwide DIPO’s control.',
  },
  {
    category: 'VERIFICATION',
    question: 'Does the Verified badge mean I am government verified?',
    answer:
      'No. The badge is a Worldwide DIPO platform indicator only and does not represent government, legal, Google or social-platform verification.',
  },
  {
    category: 'SUPPORT',
    question: 'How can I contact support?',
    answer:
      'For support regarding your account, profile, payment or renewal, use the official contact options provided on the Worldwide DIPO Contact page.',
  },
];

const categories = [
  ['ALL', 'Everything'],
  ['DIPO', 'About DIPO'],
  ['PROFILE', 'Profiles'],
  ['PLANS', 'Plans'],
  ['PAYMENTS', 'Payments'],
  ['SEARCH', 'Search'],
  ['PRIVACY', 'Privacy'],
  ['SAFETY', 'Safety'],
  ['SUPPORT', 'Support'],
];

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16 16l4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function FAQPage() {
  const grouped = categories
    .filter(([id]) => id !== 'ALL')
    .map(([id, label]) => ({
      id,
      label,
      items: faqs.filter((faq) => faq.category === id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <main className="faq-page">
      <div className="faq-ambient faq-ambient-one" />
      <div className="faq-ambient faq-ambient-two" />

      <section className="faq-hero">
        <div className="faq-container">
          <div className="faq-topbar">
            <Link
              href="/"
              className="dipo-page-back"
              aria-label="Go to Home"
            >
              <span
                className="dipo-page-back-arrow"
                aria-hidden="true"
              >
                ←
              </span>
              <span>Home</span>
            </Link>

            <div className="faq-top-brand">
              <span className="faq-brand-mark">D</span>
              <span>Worldwide DIPO</span>
            </div>
          </div>

          <div className="faq-hero-layout">
            <div className="faq-hero-copy">
              <div className="faq-badge">
                <span className="faq-badge-dot" />
                HELP CENTER
                <span className="faq-badge-divider" />
                WORLDWIDE DIPO
              </div>

              <h1>
                Everything you need
                <br />
                to know about
                <br />
                <span>DIPO.</span>
              </h1>

              <p>
                Digital identity, profiles, plans, payments,
                verification, privacy and everything in between.
                Simple answers without the technical headache.
              </p>

              <div className="faq-hero-actions">
                <a href="#faq-list" className="faq-primary-action">
                  Find your answer
                  <span>↓</span>
                </a>

                <Link href="/contact" className="faq-secondary-action">
                  Contact support
                  <span>↗</span>
                </Link>
              </div>

              <div className="faq-trust-row">
                <span>
                  <i>✓</i> Clear answers
                </span>
                <span>
                  <i>✓</i> No complicated language
                </span>
                <span>
                  <i>✓</i> Official DIPO information
                </span>
              </div>
            </div>

            <div className="faq-hero-visual" aria-hidden="true">
              <div className="faq-visual-orbit orbit-one" />
              <div className="faq-visual-orbit orbit-two" />

              <div className="faq-visual-card faq-main-card">
                <div className="faq-card-top">
                  <span className="faq-card-logo">D</span>
                  <div>
                    <strong>Worldwide DIPO</strong>
                    <small>Personal Digital Identity</small>
                  </div>
                  <span className="faq-card-check">✓</span>
                </div>

                <div className="faq-question-preview">
                  <small>YOU ASKED</small>
                  <strong>
                    How does my DIPO profile work?
                  </strong>
                </div>

                <div className="faq-answer-preview">
                  <span className="faq-answer-check">✓</span>
                  <div>
                    <strong>Simple.</strong>
                    <p>
                      Create your identity, choose a plan,
                      verify payment and go live.
                    </p>
                  </div>
                </div>

                <div className="faq-preview-lines">
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="faq-float-card faq-float-one">
                <span>✦</span>
                <div>
                  <strong>34+ answers</strong>
                  <small>One place to find them</small>
                </div>
              </div>

              <div className="faq-float-card faq-float-two">
                <span>✓</span>
                <div>
                  <strong>Official information</strong>
                  <small>Always start here</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-discovery">
        <div className="faq-container">
          <div className="faq-discovery-box">
            <div>
              <span className="faq-discovery-kicker">
                FIND IT FAST
              </span>
              <h2>What are you looking for?</h2>
            </div>

            <div className="faq-search-visual">
              <SearchIcon />
              <span>Search your question...</span>
            </div>
          </div>

          <div className="faq-category-row">
            {categories.map(([id, label], index) => (
              <a
                href={
                  id === 'ALL'
                    ? '#faq-list'
                    : `#faq-${id.toLowerCase()}`
                }
                className={
                  index === 0
                    ? 'faq-category active'
                    : 'faq-category'
                }
                key={id}
              >
                {label}
                {id !== 'ALL' && (
                  <span>
                    {
                      faqs.filter(
                        (faq) => faq.category === id,
                      ).length
                    }
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-main" id="faq-list">
        <div className="faq-container">
          <div className="faq-main-heading">
            <div>
              <span className="faq-section-kicker">
                THE ANSWERS
              </span>

              <h2>
                Questions people
                <br />
                <span>actually ask.</span>
              </h2>
            </div>

            <div className="faq-count-card">
              <strong>{faqs.length}</strong>
              <span>answered questions</span>
            </div>
          </div>

          <div className="faq-groups">
            {grouped.map((group) => (
              <section
                className="faq-group"
                id={`faq-${group.id.toLowerCase()}`}
                key={group.id}
              >
                <div className="faq-group-heading">
                  <span className="faq-group-number">
                    {group.id}
                  </span>
                  <span className="faq-group-title">
                    {group.label}
                  </span>
                  <span className="faq-group-line" />
                  <span className="faq-group-count">
                    {group.items.length}
                  </span>
                </div>

                <div className="faq-list">
                  {group.items.map((faq, index) => (
                    <details
                      className="faq-item"
                      key={faq.question}
                    >
                      <summary className="faq-summary">
                        <span className="faq-index">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="faq-question">
                          {faq.question}
                        </span>

                        <span className="faq-toggle">
                          <ArrowIcon />
                        </span>
                      </summary>

                      <div className="faq-answer-wrap">
                        <div className="faq-answer">
                          <span className="faq-answer-mark">
                            A
                          </span>
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="faq-support-card">
            <div className="faq-support-pattern" />

            <div className="faq-support-icon">
              <SparkIcon />
            </div>

            <div className="faq-support-content">
              <span>CAN'T FIND IT?</span>
              <h2>Ask the DIPO team.</h2>
              <p>
                Account, profile, payment or renewal related
                question? Reach out through the official support
                channel.
              </p>
            </div>

            <Link
              href="/contact"
              className="faq-support-button"
            >
              Contact Support
              <span>↗</span>
            </Link>
          </section>
        </div>
      </section>

      <footer className="faq-footer">
        <div className="faq-container">
          <div className="faq-footer-top">
            <Link href="/" className="faq-footer-brand">
              <span className="faq-brand-mark">D</span>
              <strong>Worldwide DIPO</strong>
            </Link>

            <div className="faq-footer-links">
              <Link href="/">Home</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          <div className="faq-footer-bottom">
            <span>
              Personal Digital Identity Page
            </span>
            <span>Made with ❤️ in India</span>
            <span>© 2026 Worldwide DIPO</span>
          </div>
        </div>
      </footer>
    </main>
  );
}