import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";

const HOME_IMAGES = {
  creator: "/images/home/dipo-creator.webp",
  team: "/images/home/dipo-team.webp",
  growth: "/images/home/dipo-growth.webp",
  collaboration: "/images/home/dipo-collaboration.webp",
  discovery: "/images/home/dipo-discovery.webp",
  opportunity: "/images/home/dipo-opportunities.webp",
  verified: "/images/home/dipo-verified.webp",
};

const audiences = [
  {
    title: "Students",
    text: "Aaj student. Kal professional. Digital pehchaan aaj se.",
    image: HOME_IMAGES.creator,
    label: "START EARLY",
    accent: "blue",
  },
  {
    title: "Shop Owners",
    text: "Dukaan local ho sakti hai. Pehchaan digital honi chahiye.",
    image: HOME_IMAGES.team,
    label: "GO DIGITAL",
    accent: "violet",
  },
  {
    title: "Creators",
    text: "Content platform par. Identity tumhari.",
    image: HOME_IMAGES.creator,
    label: "CREATOR IDENTITY",
    accent: "blue",
  },
  {
    title: "Professionals",
    text: "Resume se aage. Complete digital identity.",
    image: HOME_IMAGES.verified,
    label: "PROFESSIONAL",
    accent: "green",
  },
  {
    title: "Workers",
    text: "Hunar tumhara. Kaam tumhara. Digital pehchaan bhi tumhari.",
    image: HOME_IMAGES.collaboration,
    label: "SHOW YOUR SKILL",
    accent: "orange",
  },
  {
    title: "Freelancers",
    text: "Your work deserves a place of its own.",
    image: HOME_IMAGES.growth,
    label: "BUILD YOUR PRESENCE",
    accent: "blue",
  },
];

const identityItems = [
  "Name & Profession",
  "About & Skills",
  "Education & Experience",
  "Projects & Services",
  "Social Links",
  "Contact Information",
];

const steps = [
  {
    number: "01",
    title: "Create",
    text: "Apna naam, work, skills aur professional information add karo.",
  },
  {
    number: "02",
    title: "Build",
    text: "Worldwide DIPO tumhari information ko ek clean digital identity mein organize karta hai.",
  },
  {
    number: "03",
    title: "Share",
    text: "Apna personal DIPO URL clients, friends aur opportunities ke saath share karo.",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
      <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="18" />
      <path d="M6 24h36M24 6c5 5.2 7.5 11.2 7.5 18S29 36.8 24 42M24 6c-5 5.2-7.5 11.2-7.5 18S19 36.8 24 42M9.5 14h29M9.5 34h29" />
    </svg>
  );
}

/*
  Premium inline DIPO mark.
  This avoids the old empty logo-mark.svg and therefore removes
  the broken-image "?" from the homepage.
*/
function DipoMark({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Worldwide DIPO"
    >
      <defs>
        <linearGradient id="dipoLogoGradient" x1="15" y1="15" x2="105" y2="105">
          <stop offset="0%" stopColor="#071827" />
          <stop offset="100%" stopColor="#102d46" />
        </linearGradient>
      </defs>

      <path
        d="M19 18h49c17 0 28 7 37 21l-15 9c-5-9-11-13-22-13H36v31c5-6 11-10 19-12 17-5 30 5 31 20v7c10-8 18-16 24-25l11 8c-11 17-24 28-39 35-11 5-24 8-39 8H19V18Z"
        fill="url(#dipoLogoGradient)"
      />

      <circle cx="57" cy="49" r="7" fill="#ffffff" />

      <path
        d="M44 66c2-8 8-12 16-12s14 4 16 12H44Z"
        fill="#ffffff"
      />

      <path
        d="M22 77c8-10 18-15 31-15 8 0 14 2 19 6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M22 77c-2 3-2 7 1 10 4 4 9 5 16 5h18"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M46 86h21c15 0 28-5 38-15"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M92 69 105 58v17"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const metadata = {
  title: "Worldwide DIPO — Your Digital Identity",
  description:
    "Create your personal digital identity with Worldwide DIPO. Build a professional profile, showcase your work and share your identity with the world.",
  alternates: {
    canonical: "https://worldwidedipo.com/",
  },
  openGraph: {
    title: "Worldwide DIPO — Your Digital Identity",
    description: "Har insaan ki apni digital pehchaan.",
    url: "https://worldwidedipo.com/",
    siteName: "Worldwide DIPO",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main className={styles.home}>
      {/* =====================================================
          PREMIUM BACKGROUND SYSTEM
      ====================================================== */}

      <div className={styles.backgroundGrid} aria-hidden="true" />

      <div className={`${styles.backgroundOrb} ${styles.backgroundOrbOne}`} />
      <div className={`${styles.backgroundOrb} ${styles.backgroundOrbTwo}`} />

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>
              <DipoMark />
            </span>

            <span className={styles.brandText}>
              <strong>Worldwide DIPO</strong>
              <small>Your Digital Identity</small>
            </span>
          </Link>

          <nav className={styles.navLinks} aria-label="Main navigation">
            <Link href="/pricing">Pricing</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/about">About</Link>
            <Link href="/support">Support</Link>
          </nav>

          <div className={styles.navActions}>
            <Link href="/auth/login" className={styles.login}>
              Login
            </Link>

            <Link href="/auth/signup" className={styles.navCta}>
              Create DIPO
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={`${styles.heroCopy} ${styles.reveal}`}>
              <div className={styles.eyebrow}>
                <span className={styles.liveDot} />
                PERSONAL DIGITAL IDENTITY
              </div>

              <h1 className={styles.heroTitle}>
                Your name.
                <br />
                Your work.
                <br />
                <span>Your digital identity.</span>
              </h1>

              <p className={styles.heroText}>
                Har insaan ki apni digital pehchaan. Create one professional
                place for your work, skills, services, experience and story.
              </p>

              <div className={styles.heroActions}>
                <Link href="/explore" className={styles.primaryButton}>
                  <span>Explore Worldwide DIPO</span>
                  <ArrowIcon />
                </Link>

                <Link href="/pricing" className={styles.secondaryButton}>
                  See Plans
                </Link>
              </div>

              <div className={styles.heroNote}>
                <span>
                  <CheckIcon />
                </span>

                <span>No website required.</span>

                <strong>Start with your digital identity.</strong>
              </div>

              <div className={styles.heroMiniStats}>
                <div>
                  <strong>01</strong>
                  <span>Identity</span>
                </div>

                <div>
                  <strong>∞</strong>
                  <span>Possibilities</span>
                </div>

                <div>
                  <strong>24/7</strong>
                  <span>Shareable</span>
                </div>
              </div>
            </div>

            <div className={`${styles.heroVisual} ${styles.revealDelay}`}>
              <div className={styles.heroHalo} />

              <div className={styles.heroCard}>
                <div className={styles.heroCardTop}>
                  <span className={styles.heroPill}>
                    <span className={styles.liveDotSmall} />
                    DIPO PROFILE
                  </span>

                  <span className={styles.heroVerified}>✓ VERIFIED</span>
                </div>

                <div className={styles.heroProfile}>
                  <div className={styles.heroAvatar}>M</div>

                  <div>
                    <strong>Mahesh</strong>
                    <span>Digital Professional</span>
                  </div>

                  <span className={styles.heroCheck}>✓</span>
                </div>

                <div className={styles.heroProfileBio}>
                  <span />
                  <span />
                  <span />
                </div>

                <div className={styles.heroTags}>
                  <span>Skills</span>
                  <span>Projects</span>
                  <span>Work</span>
                  <span>Services</span>
                </div>

                <div className={styles.heroUrl}>
                  <span>worldwidedipo.com/p/</span>
                  <strong>mahesh</strong>
                  <ArrowIcon />
                </div>

                <div className={styles.heroCardFooter}>
                  <span>
                    <GlobeIcon />
                  </span>

                  <div>
                    <small>ONE DIGITAL HOME</small>
                    <strong>Ready to share worldwide</strong>
                  </div>
                </div>
              </div>

              <div className={`${styles.floatCard} ${styles.floatCardOne}`}>
                <span className={styles.floatIcon}>
                  <SparkIcon />
                </span>

                <span>
                  <small>IDENTITY</small>
                  <strong>Ready to share</strong>
                </span>
              </div>

              <div className={`${styles.floatCard} ${styles.floatCardTwo}`}>
                <span className={styles.floatAvatar}>M</span>

                <span>
                  <small>DIPO PROFILE</small>
                  <strong>mahesh.dipo</strong>
                </span>

                <span className={styles.floatCheck}>✓</span>
              </div>

              <div className={styles.heroOrbit} />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST STRIP
      ====================================================== */}

      <section className={styles.trustStrip}>
        <div className={styles.container}>
          <div className={styles.trustInner}>
            <span>ONE IDENTITY</span>
            <i />
            <span>ONE URL</span>
            <i />
            <span>YOUR WORK</span>
            <i />
            <span>YOUR STORY</span>
            <i />
            <span>WORLDWIDE</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          DISCOVERY
      ====================================================== */}

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeading} ${styles.reveal}`}>
            <span className={styles.kicker}>DISCOVERABILITY</span>

            <h2>
              Make your identity
              <br />
              <span>easy to discover.</span>
            </h2>

            <p>
              Aapke paas kaam hai. Skills hain. Experience hai. Worldwide DIPO
              un sabko ek professional digital identity mein present karne ke
              liye bana hai.
            </p>
          </div>

          <div className={styles.discoveryGrid}>
            <div className={`${styles.visualFrame} ${styles.reveal}`}>
              <div className={styles.frameBadge}>
                <span className={styles.liveDotSmall} />
                SEARCH READY
              </div>

              <Image
                src={HOME_IMAGES.discovery}
                alt="Worldwide DIPO discoverability and search experience"
                width={1080}
                height={1080}
                loading="lazy"
                className={styles.mainImage}
                sizes="(max-width: 900px) 100vw, 56vw"
              />

              <div className={styles.imageGlow} />
            </div>

            <div className={`${styles.sideCopy} ${styles.revealDelay}`}>
              <span className={styles.numberPill}>01</span>

              <h3>
                From invisible
                <br />
                to <span>discoverable.</span>
              </h3>

              <p>
                Apna profile public hone ke baad aap dedicated DIPO URL ke
                through apni identity share kar sakte ho.
              </p>

              <div className={styles.featureList}>
                {[
                  "Professional profile",
                  "Custom DIPO URL",
                  "Search-ready metadata",
                  "Projects & skills showcase",
                  "Social & external links",
                ].map((item) => (
                  <div key={item} className={styles.featureItem}>
                    <span>
                      <CheckIcon />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <p className={styles.disclaimer}>
                Search-engine crawling, indexing and search appearance are
                controlled by search engines and are not guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          VERIFIED
      ====================================================== */}

      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.container}>
          <div className={styles.splitGrid}>
            <div className={`${styles.sideCopy} ${styles.reveal}`}>
              <span className={styles.kicker}>TRUSTED IDENTITY</span>

              <h2>
                Be clear about
                <br />
                <span>who you are.</span>
              </h2>

              <p>
                Build a profile that puts your real information, work and
                professional identity in one place.
              </p>

              <div className={styles.verifiedBadge}>
                <span className={styles.verifiedIcon}>✓</span>

                <span>
                  <small>DIPO VERIFIED</small>
                  <strong>Identity indicator</strong>
                </span>
              </div>

              <p className={styles.disclaimer}>
                DIPO Verified is an internal Worldwide DIPO indicator. It is
                not Google, government or social-platform verification.
              </p>
            </div>

            <div className={`${styles.visualFrame} ${styles.revealDelay}`}>
              <Image
                src={HOME_IMAGES.verified}
                alt="Worldwide DIPO verified digital identity"
                width={1080}
                height={1080}
                loading="lazy"
                className={styles.mainImage}
                sizes="(max-width: 900px) 100vw, 56vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          GROWTH
      ====================================================== */}

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.splitGridReverse}>
            <div className={`${styles.visualFrame} ${styles.reveal}`}>
              <Image
                src={HOME_IMAGES.growth}
                alt="Professional growth with Worldwide DIPO"
                width={1080}
                height={1080}
                loading="lazy"
                className={styles.mainImage}
                sizes="(max-width: 900px) 100vw, 56vw"
              />

              <div className={styles.growthRing} />
            </div>

            <div className={`${styles.sideCopy} ${styles.revealDelay}`}>
              <span className={styles.kicker}>GROW YOUR PRESENCE</span>

              <h2>
                One identity.
                <br />
                <span>More opportunities.</span>
              </h2>

              <p>
                Clients ko apna work dikhana ho, professional connection banana
                ho, ya simply apni online identity share karni ho — ek clean
                DIPO profile kaam aa sakta hai.
              </p>

              <div className={styles.growthPoints}>
                <div>
                  <strong>01</strong>
                  <span>Show what you do.</span>
                </div>

                <div>
                  <strong>02</strong>
                  <span>Share what you have built.</span>
                </div>

                <div>
                  <strong>03</strong>
                  <span>Make your identity memorable.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          IDENTITY SYSTEM
      ====================================================== */}

      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeading} ${styles.reveal}`}>
            <span className={styles.kicker}>YOUR DIGITAL HOME</span>

            <h2>
              Everything important.
              <br />
              <span>One identity.</span>
            </h2>

            <p>
              Website nahi hai? Problem nahi. Aapke important professional
              information ko ek dedicated digital profile mein organize karo.
            </p>
          </div>

          <div className={styles.identityGrid}>
            <div className={`${styles.identityCard} ${styles.reveal}`}>
              <div className={styles.identityCardTop}>
                <span className={styles.numberPill}>PROFILE</span>
                <span className={styles.liveLabel}>LIVE READY</span>
              </div>

              <div className={styles.profileMockup}>
                <div className={styles.profileMockupHead}>
                  <span className={styles.mockAvatar}>M</span>

                  <div>
                    <strong>Mahesh</strong>
                    <small>Professional Identity</small>
                  </div>

                  <span className={styles.mockVerified}>✓</span>
                </div>

                <div className={styles.mockBio}>
                  <span />
                  <span />
                  <span />
                </div>

                <div className={styles.mockTags}>
                  <i>Skills</i>
                  <i>Work</i>
                  <i>Projects</i>
                  <i>Services</i>
                </div>

                <div className={styles.mockLink}>
                  worldwidedipo.com/p/mahesh
                  <ArrowIcon />
                </div>
              </div>
            </div>

            <div className={`${styles.identityContent} ${styles.revealDelay}`}>
              <h3>
                Your work,
                <br />
                your story,
                <br />
                <span>your place.</span>
              </h3>

              <div className={styles.identityList}>
                {identityItems.map((item) => (
                  <div key={item}>
                    <span>
                      <CheckIcon />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS — WHITE PREMIUM
      ====================================================== */}

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeading} ${styles.reveal}`}>
            <span className={styles.kicker}>SIMPLE BY DESIGN</span>

            <h2>
              Create once.
              <br />
              <span>Share everywhere.</span>
            </h2>
          </div>

          <div className={styles.steps}>
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`${styles.stepCard} ${styles.reveal}`}
                style={{ "--step-delay": `${index * 120}ms` }}
              >
                <div className={styles.stepVisual}>
                  <span>{step.number}</span>

                  <div className={styles.stepLine} />

                  <div className={styles.stepIcon}>
                    {index === 0 && "✦"}
                    {index === 1 && "◈"}
                    {index === 2 && "↗"}
                  </div>
                </div>

                <h3>{step.title}</h3>

                <p>{step.text}</p>

                <div className={styles.stepBottom}>
                  <span>WORLDWIDE DIPO</span>
                  <ArrowIcon />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PEOPLE / AUDIENCE — IMAGE CARDS
      ====================================================== */}

      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeading} ${styles.reveal}`}>
            <span className={styles.kicker}>BUILT FOR REAL PEOPLE</span>

            <h2>
              One platform.
              <br />
              <span>Many identities.</span>
            </h2>

            <p>
              Students se lekar shop owners, creators, professionals, workers
              aur freelancers tak — everyone deserves a professional digital
              place.
            </p>
          </div>

          <div className={styles.audienceGrid}>
            {audiences.map((audience, index) => (
              <article
                key={audience.title}
                className={`${styles.audienceCard} ${styles.reveal}`}
                style={{ "--card-delay": `${index * 90}ms` }}
              >
                <div className={styles.audienceImageWrap}>
                  <Image
                    src={audience.image}
                    alt={`${audience.title} using Worldwide DIPO`}
                    width={1080}
                    height={1080}
                    loading="lazy"
                    className={styles.audienceImage}
                    sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                  />

                  <span className={styles.audienceLabel}>
                    {audience.label}
                  </span>

                  <span className={styles.audienceNumber}>
                    0{index + 1}
                  </span>
                </div>

                <div className={styles.audienceContent}>
                  <div>
                    <h3>{audience.title}</h3>
                    <p>{audience.text}</p>
                  </div>

                  <span className={styles.audienceArrow}>
                    <ArrowIcon />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          OPPORTUNITY
      ====================================================== */}

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.opportunityCard} ${styles.reveal}`}>
            <div className={styles.opportunityCopy}>
              <span className={styles.kicker}>YOUR NEXT OPPORTUNITY</span>

              <h2>
                Don’t just tell people
                <br />
                <span>what you do.</span>
              </h2>

              <p>
                Give them one place where they can understand your work, your
                skills and your digital identity.
              </p>

              <Link href="/auth/signup" className={styles.primaryButton}>
                <span>Build My DIPO</span>
                <ArrowIcon />
              </Link>
            </div>

            <div className={styles.opportunityVisual}>
              <Image
                src={HOME_IMAGES.opportunity}
                alt="Digital opportunities with Worldwide DIPO"
                width={1080}
                height={1080}
                loading="lazy"
                className={styles.opportunityImage}
                sizes="(max-width: 900px) 100vw, 52vw"
              />

              <div className={styles.opportunityBadge}>
                <span>
                  <SparkIcon />
                </span>

                <div>
                  <small>DIPO PROFILE</small>
                  <strong>One place. Many possibilities.</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA — LIGHT PREMIUM
      ====================================================== */}

      <section className={styles.finalSection}>
        <div className={styles.finalOrbOne} />
        <div className={styles.finalOrbTwo} />

        <div className={styles.container}>
          <div className={`${styles.finalContent} ${styles.reveal}`}>
            <div className={styles.finalLogo}>
              <DipoMark />
            </div>

            <span className={styles.kicker}>WORLDWIDE DIPO</span>

            <h2>
              Your identity
              <br />
              <span>deserves a place.</span>
            </h2>

            <p>
              Aapka kaam chhota ho sakta hai, par aapki digital pehchaan chhoti
              nahi honi chahiye.
            </p>

            <div className={styles.finalActions}>
              <Link
                href="/explore"
                className={`${styles.primaryButton} ${styles.largeButton}`}
              >
                <span>Explore Worldwide DIPO</span>
                <ArrowIcon />
              </Link>

              <Link href="/pricing" className={styles.finalLink}>
                Explore plans
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrandColumn}>
              <Link href="/" className={styles.footerBrand}>
                <span className={styles.footerLogo}>
                  <DipoMark />
                </span>

                <span>
                  <strong>Worldwide DIPO</strong>
                  <small>Your Digital Identity</small>
                </span>
              </Link>

              <p>Har insaan ki apni digital pehchaan.</p>
            </div>

            <div className={styles.footerLinks}>
              <strong>Explore</strong>
              <Link href="/pricing">Pricing</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/about">About</Link>
              <Link href="/support">Support</Link>
            </div>

            <div className={styles.footerLinks}>
              <strong>Legal</strong>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/contact">Contact</Link>
            </div>

            <div className={styles.footerLinks}>
              <strong>Get started</strong>
              <Link href="/auth/signup">Create DIPO</Link>
              <Link href="/auth/login">Login</Link>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span>Made with ❤️ in India</span>
            <span>Worldwide DIPO</span>
            <span>© 2026 Worldwide DIPO. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}