import Link from 'next/link';

export const metadata = {
  title: 'Pricing — Worldwide DIPO',
  description:
    'Choose a Worldwide DIPO plan and build your personal, professional or business digital identity.',
};

const plans = [
  {
    id: 'starter',
    eyebrow: 'FOR STARTING OUT',
    name: 'Starter Index',
    audience: 'Students & Beginners',
    price: '₹149',
    description:
      'Everything you need to put your name, skills and work on the web.',
    featured: false,
    features: [
      'Personal digital identity profile',
      'Your own Worldwide DIPO URL',
      'Name, profession & headline',
      'Education & skills',
      'Projects & experience',
      'Social & contact information',
      'Search-ready profile metadata',
      'Up to 4 profile images',
    ],
    note: 'A simple first step toward your digital presence.',
  },
  {
    id: 'pro',
    eyebrow: 'FOR PEOPLE BUILDING',
    name: 'Pro Creator',
    audience: 'Shop Owners & Creators',
    price: '₹349',
    description:
      'A stronger identity for people whose work, audience or business is growing.',
    featured: true,
    features: [
      'Everything in Starter',
      'Professional profile presentation',
      'Custom profile URL',
      'Worldwide DIPO Verified badge',
      'Profile owner photo',
      'Category & professional identity',
      'About & services section',
      'WhatsApp & call contact options',
      'External Maps link',
      'Social media links',
      'Project & catalogue links',
      'Enhanced search-ready metadata',
      'Up to 12 profile images',
    ],
    note: 'The best fit for active creators, businesses and professionals.',
  },
  {
    id: 'elite',
    eyebrow: 'FOR ESTABLISHED IDENTITIES',
    name: 'Authority Elite',
    audience: 'Businesses & Professional Creators',
    price: '₹499',
    description:
      'The most complete Worldwide DIPO presentation for established identities.',
    featured: false,
    features: [
      'Everything in Pro Creator',
      'Premium profile presentation',
      'Worldwide DIPO branding removal',
      'Enhanced profile configuration',
      'Business + professional identity',
      'Multiple external links',
      'Expanded professional information',
      'Priority Worldwide DIPO support',
      'Up to 12 profile images',
    ],
    note: 'For identities that want a more complete professional presence.',
  },
];

const comparison = [
  ['Digital identity profile', true, true, true],
  ['Worldwide DIPO URL', true, true, true],
  ['Education & skills', true, true, true],
  ['Projects & experience', true, true, true],
  ['Search-ready metadata', true, true, true],
  ['Profile images', '4', '12', '12'],
  ['Custom URL', false, true, true],
  ['Verified badge', false, true, true],
  ['Owner photo', false, true, true],
  ['About & services', false, true, true],
  ['WhatsApp & call', false, true, true],
  ['External Maps link', false, true, true],
  ['Catalogue / project links', false, true, true],
  ['Premium presentation', false, false, true],
  ['DIPO branding removal', false, false, true],
  ['Priority support', false, false, true],
];

function Check({ value }) {
  if (value === false) {
    return (
      <span
        className="pricing-table-dash"
        aria-label="Not included"
      >
        —
      </span>
    );
  }

  if (typeof value === 'string') {
    return (
      <span className="pricing-table-value">
        {value}
      </span>
    );
  }

  return (
    <span
      className="pricing-check"
      aria-label="Included"
    >
      ✓
    </span>
  );
}

function PlanVisual({ plan }) {
  return (
    <div className={`pricing-plan-visual pricing-plan-${plan.id}`}>
      <div className="pricing-visual-glow" />

      <div className="pricing-mini-window">
        <div className="pricing-mini-top">
          <span className="pricing-mini-dot" />
          <span className="pricing-mini-line" />
          <span className="pricing-mini-dot" />
        </div>

        <div className="pricing-mini-avatar">
          {plan.id === 'starter'
            ? 'D'
            : plan.id === 'pro'
              ? 'P'
              : 'A'}
        </div>

        <div className="pricing-mini-name">
          {plan.id === 'starter'
            ? 'Your Identity'
            : plan.id === 'pro'
              ? 'Your Brand'
              : 'Your Authority'}
        </div>

        <div className="pricing-mini-role">
          {plan.id === 'starter'
            ? 'Student / Beginner'
            : plan.id === 'pro'
              ? 'Creator / Business'
              : 'Professional / Business'}
        </div>

        <div className="pricing-mini-bars">
          <span />
          <span />
          <span />
        </div>

        <div className="pricing-mini-actions">
          <span>Profile</span>
          <span>Links</span>
        </div>
      </div>

      <div className="pricing-floating-label">
        <span>
          {plan.id === 'starter'
            ? 'START'
            : plan.id === 'pro'
              ? 'GROW'
              : 'LEAD'}
        </span>
      </div>
    </div>
  );
}

function PlanCard({ plan }) {
  return (
    <article
      className={`pricing-card ${
        plan.featured ? 'pricing-card-featured' : ''
      }`}
    >
      {plan.featured && (
        <div className="pricing-popular-ribbon">
          <span>✦</span>
          MOST POPULAR
        </div>
      )}

      <PlanVisual plan={plan} />

      <div className="pricing-card-content">
        <div className="pricing-card-eyebrow">
          {plan.eyebrow}
        </div>

        <h2>{plan.name}</h2>

        <div className="pricing-audience">
          {plan.audience}
        </div>

        <p className="pricing-card-description">
          {plan.description}
        </p>

        <div className="pricing-price-row">
          <span className="pricing-price">{plan.price}</span>
          <span className="pricing-period">/ 6 months</span>
        </div>

        <div className="pricing-price-note">
          One-time 6-month subscription
        </div>

        <Link
          href={`/auth/signup?plan=${plan.id}`}
          className={
            plan.featured
              ? 'pricing-card-button pricing-card-button-primary'
              : 'pricing-card-button'
          }
        >
          Create with {plan.name}
          <span aria-hidden="true">↗</span>
        </Link>

        <div className="pricing-included-heading">
          <span>WHAT YOU GET</span>
          <span>{plan.features.length} features</span>
        </div>

        <ul className="pricing-feature-list">
          {plan.features.map((feature) => (
            <li key={feature}>
              <span className="pricing-feature-check">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="pricing-card-note">
          <span className="pricing-note-icon">i</span>
          <span>{plan.note}</span>
        </div>
      </div>
    </article>
  );
}

export default function PricingPage() {
  return (
    <div className="pricing-page">
      <div className="pricing-background-grid" />

      <section className="pricing-hero">
        <div className="pricing-container">
          <div className="pricing-back-row">
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
          </div>

          <div className="pricing-hero-content">
            <div className="pricing-eyebrow">
              <span className="pricing-eyebrow-dot" />
              WORLDWIDE DIPO · PLANS
            </div>

            <h1>
              Your digital identity.
              <br />
              <span>Choose how far you want to take it.</span>
            </h1>

            <p>
              Har kisi ko expensive website ki zarurat nahi hoti.
              Lekin har person, creator, professional aur business ko
              ek professional online presence milni chahiye.
            </p>

            <div className="pricing-hero-pills">
              <span>Personal identity</span>
              <span>Professional presence</span>
              <span>Business identity</span>
            </div>
          </div>

          <div className="pricing-hero-visual">
            <div className="pricing-hero-orbit orbit-a" />
            <div className="pricing-hero-orbit orbit-b" />

            <div className="pricing-hero-profile">
              <div className="pricing-profile-header">
                <span>Worldwide DIPO</span>
                <span>•••</span>
              </div>

              <div className="pricing-profile-cover">
                <div />
              </div>

              <div className="pricing-profile-avatar">
                DK
              </div>

              <div className="pricing-profile-body">
                <div className="pricing-profile-name">
                  Your Name
                  <span>✓</span>
                </div>

                <div className="pricing-profile-role">
                  Creator · Professional · Business
                </div>

                <div className="pricing-profile-url">
                  worldwidedipo.com/p/yourname
                </div>

                <div className="pricing-profile-lines">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="pricing-profile-buttons">
                  <span>About</span>
                  <span>Work</span>
                  <span>Contact</span>
                </div>
              </div>
            </div>

            <div className="pricing-hero-floating pricing-float-one">
              <span className="pricing-floating-icon">✦</span>
              <div>
                <strong>One identity</strong>
                <small>Everything important in one place</small>
              </div>
            </div>

            <div className="pricing-hero-floating pricing-float-two">
              <span className="pricing-floating-icon blue">
                ✓
              </span>
              <div>
                <strong>Search-ready</strong>
                <small>Built for your public presence</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-plans-section">
        <div className="pricing-container">
          <div className="pricing-section-heading">
            <div>
              <span className="pricing-section-number">
                01 / PLANS
              </span>

              <h2>
                Start small.
                <br />
                <span>Build bigger.</span>
              </h2>
            </div>

            <p>
              Choose a plan based on where you are today. You can
              build a simple identity, create a stronger professional
              presence, or establish a more complete business identity.
            </p>
          </div>

          <div className="pricing-cards-grid">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-practical-section">
        <div className="pricing-container">
          <div className="pricing-practical-grid">
            <div>
              <span className="pricing-section-number">
                02 / WHY THIS MATTERS
              </span>

              <h2>
                Tumhare paas
                <br />
                <span>already kaam hai.</span>
              </h2>

              <p>
                Tum student ho, creator ho, freelancer ho, worker ho,
                professional ho ya shop owner — tumhare paas already
                kuch aisa hai jo duniya ko dikhaya ja sakta hai.
              </p>

              <p>
                DIPO us information ko ek clean, professional digital
                identity mein organise karta hai.
              </p>

              <div className="pricing-practical-quote">
                <span />
                <strong>
                  “Aapka kaam chhota ho sakta hai,
                  par aapki digital pehchaan chhoti nahi honi chahiye.”
                </strong>
              </div>
            </div>

            <div className="pricing-practical-stack">
              <div className="pricing-stack-card stack-card-back">
                <span>01</span>
                <strong>Social profiles</strong>
                <small>Where people discover you</small>
              </div>

              <div className="pricing-stack-card stack-card-middle">
                <span>02</span>
                <strong>Your work</strong>
                <small>Skills · Projects · Services</small>
              </div>

              <div className="pricing-stack-card stack-card-front">
                <div className="stack-d-logo">D</div>
                <div>
                  <strong>Worldwide DIPO</strong>
                  <small>Your digital identity</small>
                </div>
                <span className="stack-arrow">↗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-comparison-section">
        <div className="pricing-container">
          <div className="pricing-section-heading pricing-comparison-heading">
            <div>
              <span className="pricing-section-number">
                03 / COMPARE
              </span>

              <h2>
                See what fits
                <br />
                <span>your journey.</span>
              </h2>
            </div>

            <p>
              No confusing tiers. The difference is simple:
              how complete and professional you want your digital
              identity to be.
            </p>
          </div>

          <div className="pricing-table-wrap">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Feature</th>

                  {plans.map((plan) => (
                    <th key={plan.id}>
                      <span>{plan.name}</span>
                      <small>{plan.price}</small>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {comparison.map(
                  ([feature, starter, pro, elite]) => (
                    <tr key={feature}>
                      <td>{feature}</td>
                      <td>
                        <Check value={starter} />
                      </td>
                      <td className="pricing-table-pro">
                        <Check value={pro} />
                      </td>
                      <td>
                        <Check value={elite} />
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="pricing-trust-section">
        <div className="pricing-container">
          <div className="pricing-trust-grid">
            <div className="pricing-trust-icon">✓</div>

            <div>
              <span className="pricing-trust-label">
                IMPORTANT
              </span>

              <h2>
                Search-ready does not mean
                <br />
                <span>search-ranking guaranteed.</span>
              </h2>

              <p>
                Worldwide DIPO provides a search-ready public digital
                identity page with structured information and metadata.
                Search-engine crawling, indexing, ranking, Knowledge
                Panels and search appearance are controlled by
                independent search engines and are not guaranteed by
                Worldwide DIPO.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-final-section">
        <div className="pricing-final-orb" />

        <div className="pricing-container">
          <div className="pricing-final-content">
            <span className="pricing-final-eyebrow">
              04 / YOUR NEXT STEP
            </span>

            <h2>
              You already have
              <br />
              <span>a name.</span>
            </h2>

            <p>
              Ab us naam ko internet par ek proper place do.
            </p>

            <Link
              href="/auth/signup"
              className="pricing-final-button"
            >
              Create your Worldwide DIPO
              <span>↗</span>
            </Link>

            <div className="pricing-final-meta">
              <span>₹149 se start</span>
              <span>•</span>
              <span>6 months</span>
              <span>•</span>
              <span>Personal to Business</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}