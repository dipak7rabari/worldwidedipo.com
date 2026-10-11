import Link from 'next/link';

export const metadata = {
  title: 'Support | Worldwide DIPO',
  description:
    'Get help with Worldwide DIPO profiles, accounts, subscriptions, payments and other product questions.',
};

const supportTopics = [
  {
    number: '01',
    icon: '👤',
    title: 'Profile & Account',
    text:
      'Profile setup, editing, public profile, username, account access ya profile information se related help.',
    href: '/faq',
    action: 'Open FAQ',
  },
  {
    number: '02',
    icon: '💳',
    title: 'Plans & Payment',
    text:
      'Plan selection, UPI payment, UTR / Payment Reference submission, verification ya renewal ke questions.',
    href: '/pricing',
    action: 'View plans',
  },
  {
    number: '03',
    icon: '🔎',
    title: 'Search & Visibility',
    text:
      'Public profile, search-ready information, metadata aur search-engine discovery ko samajhna hai?',
    href: '/faq',
    action: 'Learn more',
  },
];

const quickLinks = [
  {
    label: 'Pricing',
    href: '/pricing',
    description: 'Plans & features',
  },
  {
    label: 'FAQ',
    href: '/faq',
    description: 'Common questions',
  },
  {
    label: 'Privacy',
    href: '/privacy',
    description: 'How data is handled',
  },
  {
    label: 'Terms',
    href: '/terms',
    description: 'Platform rules',
  },
];

export default function SupportPage() {
  return (
    <main className="dipo-support-page">
      <div className="dipo-support-container">
        {/* TOP */}
        <header className="dipo-support-top">
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

          <span className="dipo-support-brand">
            WORLDWIDE DIPO
          </span>
        </header>

        {/* HERO */}
        <section className="dipo-support-hero">
          <div className="dipo-support-hero-copy">
            <span className="dipo-support-kicker">
              WORLDWIDE DIPO SUPPORT
            </span>

            <h1>
              Need help?
              <br />
              <span>Start here.</span>
            </h1>

            <p>
              DIPO ko simple banaya gaya hai. Agar phir bhi koi question,
              problem ya confusion hai, yahan se right place par jao.
            </p>

            <div className="dipo-support-actions">
              <Link
                href="/faq"
                className="dipo-support-primary"
              >
                Browse FAQ
                <span aria-hidden="true">↗</span>
              </Link>

              <a
                href="mailto:dipolabs123@gmail.com?subject=Worldwide%20DIPO%20Support"
                className="dipo-support-secondary"
              >
                Contact support
              </a>
            </div>
          </div>

          {/* SUPPORT VISUAL */}
          <div className="dipo-support-visual" aria-hidden="true">
            <div className="dipo-support-orb" />

            <div className="dipo-support-panel">
              <div className="dipo-support-panel-top">
                <div className="dipo-support-panel-brand">
                  <span>D</span>
                  <div>
                    <strong>Worldwide DIPO</strong>
                    <small>Support Center</small>
                  </div>
                </div>

                <div className="dipo-support-status">
                  <i />
                  HELP
                </div>
              </div>

              <div className="dipo-support-panel-question">
                <small>WHAT DO YOU NEED?</small>

                <strong>
                  Find the right
                  <br />
                  answer.
                </strong>
              </div>

              <div className="dipo-support-panel-options">
                <div>
                  <span>👤</span>
                  <b>Profile</b>
                  <em>→</em>
                </div>

                <div>
                  <span>💳</span>
                  <b>Payment</b>
                  <em>→</em>
                </div>

                <div>
                  <span>🔎</span>
                  <b>Search</b>
                  <em>→</em>
                </div>
              </div>

              <div className="dipo-support-panel-footer">
                <span>Still need help?</span>
                <b>Email support ↗</b>
              </div>
            </div>

            <div className="dipo-support-floating dipo-support-floating-one">
              <span>HELP</span>
              <strong>MADE SIMPLE</strong>
            </div>

            <div className="dipo-support-floating dipo-support-floating-two">
              <span>SUPPORT</span>
              <strong>HUMAN FIRST</strong>
            </div>
          </div>
        </section>

        {/* TOPICS */}
        <section className="dipo-support-topics">
          <div className="dipo-support-section-heading">
            <div>
              <span className="dipo-support-mini-label">
                FIND YOUR ANSWER
              </span>

              <h2>
                What can we
                <br />
                <span>help with?</span>
              </h2>
            </div>

            <p>
              Apni problem ke closest topic ko choose karo. Most common
              questions ka answer FAQ mein already available hai.
            </p>
          </div>

          <div className="dipo-support-topic-grid">
            {supportTopics.map((topic) => (
              <article
                className="dipo-support-topic-card"
                key={topic.number}
              >
                <div className="dipo-support-topic-top">
                  <span>{topic.number}</span>
                  <span>{topic.icon}</span>
                </div>

                <h3>{topic.title}</h3>

                <p>{topic.text}</p>

                <Link href={topic.href}>
                  {topic.action}
                  <span aria-hidden="true">↗</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* EMAIL CTA */}
        <section className="dipo-support-email-section">
          <div className="dipo-support-email-copy">
            <span className="dipo-support-mini-label">
              CAN&apos;T FIND WHAT YOU NEED?
            </span>

            <h2>
              Talk to us
              <br />
              <span>directly.</span>
            </h2>

            <p>
              Agar FAQ aur help options se answer nahi mila, support team ko
              email karo. Message mein issue ko clearly explain karna best
              rahega.
            </p>
          </div>

          <a
            href="mailto:dipolabs123@gmail.com?subject=Worldwide%20DIPO%20Support"
            className="dipo-support-email-card"
          >
            <span>dipolabs123@gmail.com</span>
            <b aria-hidden="true">↗</b>
          </a>
        </section>

        {/* SECURITY NOTE */}
        <section className="dipo-support-security">
          <div className="dipo-support-security-icon">
            ✓
          </div>

          <div>
            <span className="dipo-support-mini-label">
              SECURITY FIRST
            </span>

            <h3>
              Support ko contact karte waqt sensitive information share
              mat karo.
            </h3>

            <p>
              Passwords, OTPs, UPI PIN, bank passwords, card details ya
              other authentication secrets kabhi email ya support message
              mein mat bhejo. Payment issue ke liye required payment
              reference/UTR ke alawa unnecessary financial credentials
              share karne ki zarurat nahi hai.
            </p>
          </div>
        </section>

        {/* QUICK LINKS */}
        <section className="dipo-support-quick">
          <div>
            <span className="dipo-support-mini-label">
              EXPLORE DIPO
            </span>

            <h2>
              Useful places,
              <br />
              <span>one click away.</span>
            </h2>
          </div>

          <div className="dipo-support-quick-grid">
            {quickLinks.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className="dipo-support-quick-link"
              >
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </div>

                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </section>

        {/* FINAL */}
        <section className="dipo-support-final">
          <span className="dipo-support-kicker">
            WORLDWIDE DIPO
          </span>

          <h2>
            Your identity.
            <br />
            <span>Your questions matter.</span>
          </h2>

          <p>
            Har insaan ki apni digital pehchaan.
          </p>

          <div className="dipo-support-final-actions">
            <Link
              href="/auth/signup"
              className="dipo-support-primary"
            >
              Create your DIPO
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              href="/"
              className="dipo-support-secondary"
            >
              Back to DIPO
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="dipo-support-footer">
          <div className="dipo-support-footer-main">
            <div>
              <strong>Worldwide DIPO</strong>
              <span>Made with ❤️ in India</span>
            </div>

            <nav aria-label="Footer navigation">
              <Link href="/about">About</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </nav>
          </div>

          <div className="dipo-support-footer-bottom">
            <span>𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱</span>
            <span>
              © 2026 𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱. All rights reserved.
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}