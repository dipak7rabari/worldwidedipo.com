import Link from 'next/link';

export const metadata = {
  title: 'Contact | Worldwide DIPO',
  description:
    'Contact Worldwide DIPO and DIPO LABS for product support, account questions and general enquiries.',
  robots: {
    index: true,
    follow: true,
  },
};

const contactCards = [
  {
    number: '01',
    eyebrow: 'PRODUCT SUPPORT',
    title: 'Need help with DIPO?',
    text:
      'Profile setup, subscription, payment status, public profile ya kisi feature ke regarding help chahiye to support team se contact karo.',
    action: 'Email support',
    href: 'mailto:dipolabs123@gmail.com?subject=Worldwide%20DIPO%20Support',
  },
  {
    number: '02',
    eyebrow: 'GENERAL ENQUIRY',
    title: 'Have a question?',
    text:
      'Worldwide DIPO ke product, features, plans ya platform ke baare mein general question hai to humein message bhejo.',
    action: 'Send enquiry',
    href: 'mailto:dipolabs123@gmail.com?subject=Worldwide%20DIPO%20Enquiry',
  },
  {
    number: '03',
    eyebrow: 'SOCIAL',
    title: 'Follow DIPO LABS',
    text:
      'Product updates, announcements aur future projects ke liye DIPO LABS ko Instagram par follow kar sakte ho.',
    action: '@dipolabs.io',
    href: 'https://www.instagram.com/dipolabs.io/',
  },
];

export default function ContactPage() {
  return (
    <main className="dipo-contact-page">
      <div className="dipo-contact-container">
        {/* TOP */}
        <div className="dipo-contact-top">
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

          <span className="dipo-contact-brand">
            WORLDWIDE DIPO
          </span>
        </div>

        {/* HERO */}
        <section className="dipo-contact-hero">
          <div className="dipo-contact-hero-copy">
            <span className="dipo-contact-kicker">
              WE ARE HERE TO HELP
            </span>

            <h1>
              Let&apos;s talk.
              <br />
              <span>We&apos;re listening.</span>
            </h1>

            <p>
              Koi problem hai, question hai ya bas Worldwide DIPO ke baare
              mein kuch poochna hai? Reach out. Clear answer dena humara
              kaam hai.
            </p>

            <div className="dipo-contact-hero-actions">
              <a
                href="mailto:dipolabs123@gmail.com?subject=Worldwide%20DIPO%20Support"
                className="dipo-contact-primary"
              >
                Email us
                <span aria-hidden="true">↗</span>
              </a>

              <a
                href="https://www.instagram.com/dipolabs.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="dipo-contact-secondary"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* VISUAL */}
          <div className="dipo-contact-visual" aria-hidden="true">
            <div className="dipo-contact-visual-glow" />

            <div className="dipo-contact-message-card">
              <div className="dipo-contact-message-top">
                <div className="dipo-contact-avatar">
                  D
                </div>

                <div>
                  <strong>Worldwide DIPO</strong>
                  <span>Support</span>
                </div>

                <b className="dipo-contact-online">
                  <i />
                  ONLINE
                </b>
              </div>

              <div className="dipo-contact-message-body">
                <div className="dipo-contact-bubble dipo-contact-bubble-left">
                  Hi 👋
                  <br />
                  How can we help?
                </div>

                <div className="dipo-contact-bubble dipo-contact-bubble-right">
                  I have a question about my DIPO profile.
                </div>

                <div className="dipo-contact-bubble dipo-contact-bubble-left small">
                  Sure. Send us the details and we&apos;ll take a look.
                </div>
              </div>

              <div className="dipo-contact-message-input">
                <span>Write a message...</span>
                <b>→</b>
              </div>
            </div>

            <div className="dipo-contact-floating dipo-contact-floating-one">
              <span>RESPONSE</span>
              <strong>HUMAN</strong>
            </div>

            <div className="dipo-contact-floating dipo-contact-floating-two">
              <span>DIPO LABS</span>
              <strong>SUPPORT</strong>
            </div>
          </div>
        </section>

        {/* EMAIL STRIP */}
        <section className="dipo-contact-direct">
          <div>
            <span className="dipo-contact-mini-label">
              DIRECT CONTACT
            </span>

            <h2>
              One email.
              <br />
              <span>One simple way to reach us.</span>
            </h2>
          </div>

          <a
            href="mailto:dipolabs123@gmail.com"
            className="dipo-contact-email"
          >
            <span>dipolabs123@gmail.com</span>
            <b aria-hidden="true">↗</b>
          </a>
        </section>

        {/* CONTACT CARDS */}
        <section className="dipo-contact-options">
          <div className="dipo-contact-section-heading">
            <div>
              <span className="dipo-contact-mini-label">
                HOW CAN WE HELP?
              </span>

              <h2>
                Choose what
                <br />
                <span>you need.</span>
              </h2>
            </div>

            <p>
              Hum support ko simple rakhna chahte hain. Apni requirement
              ke closest option se start karo.
            </p>
          </div>

          <div className="dipo-contact-grid">
            {contactCards.map((card) => (
              <article
                className="dipo-contact-card"
                key={card.number}
              >
                <div className="dipo-contact-card-top">
                  <span>{card.number}</span>
                  <span>{card.eyebrow}</span>
                </div>

                <h3>{card.title}</h3>

                <p>{card.text}</p>

                <a
                  href={card.href}
                  target={
                    card.href.startsWith('https://')
                      ? '_blank'
                      : undefined
                  }
                  rel={
                    card.href.startsWith('https://')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                >
                  {card.action}
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* BEFORE CONTACT */}
        <section className="dipo-contact-note">
          <div className="dipo-contact-note-icon">
            i
          </div>

          <div>
            <span className="dipo-contact-mini-label">
              BEFORE YOU MESSAGE
            </span>

            <h3>
              Thoda context doge, answer aur better milega.
            </h3>

            <p>
              Agar aap profile, payment, subscription ya account issue ke
              liye contact kar rahe ho, to problem ko clearly describe
              karo. Public message mein password, OTP, UPI PIN, bank
              password ya other sensitive credentials kabhi share mat karo.
            </p>
          </div>
        </section>

        {/* BRAND STATEMENT */}
        <section className="dipo-contact-statement">
          <span className="dipo-contact-kicker">
            WORLDWIDE DIPO × DIPO LABS
          </span>

          <h2>
            Your digital identity
            <br />
            <span>deserves support too.</span>
          </h2>

          <p>
            Har insaan ki apni digital pehchaan.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="dipo-contact-footer">
          <div>
            <strong>Worldwide DIPO</strong>
            <span>Made with ❤️ in India</span>
          </div>

          <nav aria-label="Footer navigation">
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>

          <div className="dipo-contact-footer-bottom">
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