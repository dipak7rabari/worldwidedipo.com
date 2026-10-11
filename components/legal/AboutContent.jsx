'use client';

import { useEffect, useRef, useState } from 'react';

export default function AboutContent() {
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef(null);

  const audiences = [
    {
      icon: '🎓',
      title: 'Students',
      text:
        'Education, skills, projects aur future goals ko ek professional digital identity mein present karo.',
      tag: 'START',
    },
    {
      icon: '🏪',
      title: 'Shop Owners',
      text:
        'Apni shop, services, location aur contact information ko ek shareable digital home do.',
      tag: 'BUSINESS',
    },
    {
      icon: '📸',
      title: 'Creators',
      text:
        'Content platforms par ho sakta hai. Lekin tumhari complete identity tumhari apni ho.',
      tag: 'CREATE',
    },
    {
      icon: '💻',
      title: 'Professionals',
      text:
        'Skills, experience, services, projects aur important links ko ek clean profile mein rakho.',
      tag: 'WORK',
    },
    {
      icon: '🧑‍🔧',
      title: 'Workers',
      text:
        'Hunar tumhara. Kaam tumhara. Ab digital pehchaan bhi tumhari.',
      tag: 'SKILL',
    },
    {
      icon: '🚀',
      title: 'Freelancers',
      text:
        'Apne work, services aur portfolio links ko ek simple public identity se connect karo.',
      tag: 'BUILD',
    },
  ];

  const journey = [
    {
      number: '01',
      title: 'Your name',
      text:
        'Sabse pehle duniya ko pata hona chahiye ki aap kaun ho.',
      icon: '✦',
    },
    {
      number: '02',
      title: 'Your work',
      text:
        'Skills, education, experience, services aur projects ko ek jagah lao.',
      icon: '◌',
    },
    {
      number: '03',
      title: 'Your identity',
      text:
        'Ek dedicated Worldwide DIPO page ke through apni digital presence build karo.',
      icon: '◇',
    },
    {
      number: '04',
      title: 'Your world',
      text:
        'Apni DIPO link ko social media, WhatsApp, resume, business card aur conversations mein share karo.',
      icon: '↗',
    },
  ];

  const storySections = [
    'WHY DIPO',
    'IDENTITY',
    'PEOPLE',
    'MORE THAN A LINK',
    'PHILOSOPHY',
    'DIPO LABS',
  ];

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const revealItems = root.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('dipo-revealed');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const sections = root.querySelectorAll('[data-story-section]');

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number(
            entry.target.getAttribute('data-story-section')
          );

          if (!Number.isNaN(index)) {
            setActiveSection(index);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '-20% 0px -55% 0px',
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const openInstagram = () => {
    if (typeof window === 'undefined') return;

    const username = 'dipolabs.io';
    const appUrl = `instagram://user?username=${username}`;
    const webUrl = `https://www.instagram.com/${username}/`;

    const start = Date.now();

    window.location.href = appUrl;

    window.setTimeout(() => {
      if (Date.now() - start < 1800) {
        window.location.href = webUrl;
      }
    }, 900);
  };

  const scrollToStory = (index) => {
    const target = document.querySelector(
      `[data-story-section="${index}"]`
    );

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <article
      ref={contentRef}
      className="dipo-about-content dipo-about-upgraded"
    >
      {/* =====================================================
          STORY PROGRESS
      ====================================================== */}

      <div className="dipo-about-story-progress">
        <div className="dipo-about-story-progress-track">
          <span
            style={{
              transform: `scaleY(${Math.max(
                0.12,
                (activeSection + 1) / storySections.length
              )})`,
            }}
          />
        </div>

        <div className="dipo-about-story-progress-label">
          <span>
            0{Math.min(activeSection + 1, storySections.length)}
          </span>

          <small>
            {storySections[
              Math.min(activeSection, storySections.length - 1)
            ]}
          </small>
        </div>
      </div>

      {/* =====================================================
          HERO STORY
      ====================================================== */}

      <section className="dipo-about-hero dipo-about-hero-upgraded">
        <div
          className="dipo-about-hero-copy"
          data-reveal
        >
          <div className="dipo-about-live-pill">
            <span className="dipo-about-live-dot" />
            WORLDWIDE DIPO
            <span>01</span>
          </div>

          <span className="dipo-about-kicker">
            A DIGITAL HOME FOR REAL PEOPLE
          </span>

          <h2>
            Internet sabke liye hai.
            <br />
            <span>Digital identity bhi sabki honi chahiye.</span>
          </h2>

          <p className="dipo-about-lead">
            Aaj internet par bade businesses ke paas websites hain,
            creators ke paas platforms hain aur professionals ke paas
            portfolios hain. Lekin har normal insaan ke paas apni
            professional digital jagah nahi hoti.
          </p>

          <p>
            <strong>Worldwide DIPO</strong> isi gap ko solve karne ke
            idea se bana hai — ek simple, public aur shareable digital
            identity jahan aap bata sakte ho ki aap kaun ho, kya karte ho
            aur duniya aapse kaise connect kar sakti hai.
          </p>

          <div className="dipo-about-hero-actions">
            <a
              href="/auth/signup"
              className="dipo-about-primary-btn dipo-magnetic-btn"
            >
              <span>Build your identity</span>
              <span aria-hidden="true">↗</span>
            </a>

            <a
              href="/pricing"
              className="dipo-about-secondary-btn"
            >
              Explore plans
            </a>
          </div>

          <div className="dipo-about-scroll-hint">
            <span className="dipo-about-scroll-line" />
            <span>Scroll to explore the story</span>
          </div>
        </div>

        <div
          className="dipo-about-identity-visual"
          aria-hidden="true"
          data-reveal
        >
          <div className="dipo-about-visual-grid" />

          <div className="dipo-about-glow dipo-about-glow-one" />
          <div className="dipo-about-glow dipo-about-glow-two" />

          <div className="dipo-about-orbit-hero orbit-a" />
          <div className="dipo-about-orbit-hero orbit-b" />

          <div className="dipo-about-profile-window dipo-about-profile-window-premium">
            <div className="dipo-about-window-top">
              <div className="dipo-about-window-dots">
                <i />
                <i />
                <i />
              </div>

              <span>worldwidedipo.com</span>

              <b>● LIVE</b>
            </div>

            <div className="dipo-about-profile-body">
              <div className="dipo-about-avatar dipo-about-avatar-premium">
                D
              </div>

              <div className="dipo-about-profile-name">
                <strong>Your Name</strong>

                <span>
                  Digital Identity
                  <b>✓</b>
                </span>
              </div>

              <div className="dipo-about-profile-line large" />
              <div className="dipo-about-profile-line" />
              <div className="dipo-about-profile-line short" />

              <div className="dipo-about-profile-pills">
                <span>Identity</span>
                <span>Skills</span>
                <span>Work</span>
                <span>Contact</span>
              </div>

              <div className="dipo-about-profile-link">
                <span>
                  worldwidedipo.com/p/your-name
                </span>

                <b>↗</b>
              </div>

              <div className="dipo-about-profile-status">
                <span />
                Verified digital identity
              </div>
            </div>
          </div>

          <div className="dipo-about-floating-card dipo-about-floating-top">
            <span>IDENTITY</span>
            <strong>YOURS.</strong>
          </div>

          <div className="dipo-about-floating-card dipo-about-floating-bottom">
            <span>ONE LINK</span>
            <strong>YOUR WORLD</strong>
          </div>

          <div className="dipo-about-floating-mini mini-one">
            <span>✓</span>
            Verified
          </div>

          <div className="dipo-about-floating-mini mini-two">
            <span>↗</span>
            Shareable
          </div>
        </div>
      </section>

      {/* =====================================================
          CORE IDEA
      ====================================================== */}

      <section
        className="dipo-about-manifesto dipo-about-story-section"
        data-story-section="0"
      >
        <div
          className="dipo-about-section-label"
          data-reveal
        >
          <span>01</span>
          WHY DIPO EXISTS
        </div>

        <div className="dipo-about-manifesto-grid">
          <h2 data-reveal>
            Aapka kaam chhota ho sakta hai.
            <br />
            <span>
              Aapki digital pehchaan chhoti nahi honi chahiye.
            </span>
          </h2>

          <div data-reveal>
            <p>
              Bahut saare log internet use karte hain, lekin unki
              online identity scattered hoti hai.
            </p>

            <p>
              Instagram yahan. WhatsApp wahan. Resume kisi file mein.
              Portfolio kisi aur link par. Business information kisi
              social profile mein.
            </p>

            <p>
              Worldwide DIPO ka idea simple hai:
              <strong>
                {' '}
                important information ko ek dedicated digital identity
                mein organize karna.
              </strong>
            </p>

            <div className="dipo-about-highlight-box">
              <span>THE IDEA</span>
              <strong>
                One identity.
                <br />
                One link.
                <br />
                Your world.
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          IDENTITY JOURNEY
      ====================================================== */}

      <section
        className="dipo-about-journey dipo-about-story-section"
        data-story-section="1"
      >
        <div
          className="dipo-about-section-label"
          data-reveal
        >
          <span>02</span>
          FROM NAME TO IDENTITY
        </div>

        <div className="dipo-about-journey-heading">
          <h2 data-reveal>
            Sirf naam nahi.
            <br />
            <span>Complete digital identity.</span>
          </h2>

          <p data-reveal>
            Worldwide DIPO ko aise design kiya gaya hai ki aap
            apni journey ko gradually build kar sako.
          </p>
        </div>

        <div className="dipo-about-journey-grid">
          {journey.map((item, index) => (
            <div
              className="dipo-about-journey-card dipo-about-journey-card-premium"
              key={item.number}
              data-reveal
              style={{
                '--dipo-delay': `${index * 90}ms`,
              }}
            >
              <div className="dipo-about-journey-card-glow" />

              <span className="dipo-about-journey-number">
                {item.number}
              </span>

              <div className="dipo-about-journey-icon">
                {item.icon}
              </div>

              <div className="dipo-about-journey-arrow">
                ↗
              </div>

              <h3>{item.title}</h3>

              <p>{item.text}</p>

              <div className="dipo-about-card-progress">
                <span />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          PEOPLE
      ====================================================== */}

      <section
        className="dipo-about-people dipo-about-story-section"
        data-story-section="2"
      >
        <div
          className="dipo-about-section-label"
          data-reveal
        >
          <span>03</span>
          BUILT FOR REAL PEOPLE
        </div>

        <div className="dipo-about-people-heading">
          <div data-reveal>
            <h2>
              One platform.
              <br />
              <span>Many kinds of people.</span>
            </h2>
          </div>

          <p data-reveal>
            DIPO kisi ek profession ke liye nahi hai. Jahan kisi
            insaan ke paas identity, skill, work ya business hai,
            wahan ek useful digital presence ki jagah ho sakti hai.
          </p>
        </div>

        <div className="dipo-about-audience-grid">
          {audiences.map((item, index) => (
            <div
              className="dipo-about-audience-card dipo-about-audience-card-premium"
              key={item.title}
              data-reveal
              style={{
                '--dipo-delay': `${index * 70}ms`,
              }}
            >
              <div className="dipo-about-audience-top">
                <span className="dipo-about-audience-icon">
                  {item.icon}
                </span>

                <span className="dipo-about-audience-tag">
                  {item.tag}
                </span>
              </div>

              <div className="dipo-about-audience-number">
                0{index + 1}
              </div>

              <h3>{item.title}</h3>

              <p>{item.text}</p>

              <div className="dipo-about-audience-line" />

              <span className="dipo-about-audience-arrow">
                ↗
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          DIFFERENCE
      ====================================================== */}

      <section
        className="dipo-about-difference dipo-about-story-section"
        data-story-section="3"
      >
        <div
          className="dipo-about-difference-visual dipo-about-difference-visual-premium"
          aria-hidden="true"
          data-reveal
        >
          <div className="dipo-about-orbit orbit-one" />
          <div className="dipo-about-orbit orbit-two" />
          <div className="dipo-about-orbit orbit-three" />

          <div className="dipo-about-orbit-pulse" />

          <div className="dipo-about-core">
            <img
              src="/logo/logo-mark.svg"
              alt=""
            />
          </div>

          <div className="dipo-about-orbit-node node-one">
            NAME
          </div>

          <div className="dipo-about-orbit-node node-two">
            WORK
          </div>

          <div className="dipo-about-orbit-node node-three">
            SKILLS
          </div>

          <div className="dipo-about-orbit-node node-four">
            CONTACT
          </div>

          <div className="dipo-about-orbit-node node-five">
            WORLD
          </div>
        </div>

        <div
          className="dipo-about-difference-copy"
          data-reveal
        >
          <div className="dipo-about-section-label">
            <span>04</span>
            MORE THAN A LINK
          </div>

          <h2>
            Link share karna easy hai.
            <br />
            <span>Identity build karna bigger hai.</span>
          </h2>

          <p>
            Worldwide DIPO ka purpose sirf multiple links ko ek
            jagah rakhna nahi hai.
          </p>

          <p>
            Aapke profile mein aapki identity, professional
            information, services, skills, experience, projects,
            social links aur contact information ko structured way
            mein present kiya ja sakta hai.
          </p>

          <div className="dipo-about-feature-stack">
            <div>
              <span>01</span>
              <strong>Identity</strong>
              <p>Aap kaun ho.</p>
            </div>

            <div>
              <span>02</span>
              <strong>Work</strong>
              <p>Aap kya karte ho.</p>
            </div>

            <div>
              <span>03</span>
              <strong>Connection</strong>
              <p>Log aapse kaise connect karein.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTERACTIVE IDENTITY MOMENT
      ====================================================== */}

      <section className="dipo-about-identity-moment">
        <div className="dipo-about-identity-moment-bg" />

        <div
          className="dipo-about-identity-moment-inner"
          data-reveal
        >
          <span className="dipo-about-kicker">
            YOUR DIGITAL SPACE
          </span>

          <h2>
            Aapka naam.
            <br />
            Aapka kaam.
            <br />
            <span>Aapki identity.</span>
          </h2>

          <p>
            Ek simple DIPO link ke through apni online presence ko
            ek meaningful digital home mein convert karo.
          </p>

          <div className="dipo-about-identity-url">
            <span>worldwidedipo.com/p/</span>
            <strong>your-name</strong>
            <b>↗</b>
          </div>

          <div className="dipo-about-identity-stats">
            <div>
              <strong>01</strong>
              <span>Identity</span>
            </div>

            <div>
              <strong>∞</strong>
              <span>Your world</span>
            </div>

            <div>
              <strong>↗</strong>
              <span>Share</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PHILOSOPHY
      ====================================================== */}

      <section
        className="dipo-about-philosophy dipo-about-story-section"
        data-story-section="4"
      >
        <div className="dipo-about-philosophy-noise" />

        <div
          className="dipo-about-philosophy-inner"
          data-reveal
        >
          <span className="dipo-about-kicker">
            THE DIPO PHILOSOPHY
          </span>

          <div className="dipo-about-philosophy-orb">
            <span />
          </div>

          <h2>
            Simple.
            <br />
            Useful.
            <br />
            Safe.
            <br />
            <span>Human.</span>
          </h2>

          <p>
            Hum ek aisa product banana chahte hain jo unnecessary
            complexity ko remove kare aur everyday internet users
            ko apni digital identity create karne ka simple way de.
          </p>

          <div className="dipo-about-philosophy-line">
            <span />
          </div>
        </div>
      </section>

      {/* =====================================================
          DIPO LABS
      ====================================================== */}

      <section
        className="dipo-about-labs dipo-about-story-section"
        data-story-section="5"
      >
        <div
          className="dipo-about-labs-mark dipo-about-labs-mark-premium"
          aria-hidden="true"
          data-reveal
        >
          <div className="dipo-about-labs-mark-ring ring-one" />
          <div className="dipo-about-labs-mark-ring ring-two" />

          <span>DIPO</span>
          <small>LABS</small>

          <div className="dipo-about-labs-mark-dot">
            ●
          </div>
        </div>

        <div
          className="dipo-about-labs-copy"
          data-reveal
        >
          <div className="dipo-about-section-label">
            <span>06</span>
            BUILT BY DIPO LABS
          </div>

          <h2>
            Worldwide DIPO is a
            <br />
            <span>DIPO LABS product.</span>
          </h2>

          <p>
            DIPO LABS ka focus digital products create karna hai
            jo modern internet ko everyday users ke liye zyada
            useful, accessible aur practical banayein.
          </p>

          <p>
            Worldwide DIPO isi vision ka ek part hai — ek public
            digital identity platform jahan har insaan apni online
            presence ko apne naam aur apne kaam ke saath build kar
            sake.
          </p>

          <div className="dipo-about-labs-principles">
            <span>ACCESSIBLE</span>
            <span>USEFUL</span>
            <span>MODERN</span>
            <span>HUMAN</span>
          </div>

          <a
            href="/"
            className="dipo-about-text-link dipo-magnetic-btn"
          >
            Explore Worldwide DIPO
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      {/* =====================================================
          CONTACT / SUPPORT
      ====================================================== */}

      <section className="dipo-about-contact">
        <div
          className="dipo-about-contact-card"
          data-reveal
        >
          <div className="dipo-about-contact-copy">
            <span className="dipo-about-kicker">
              NEED HELP?
            </span>

            <h2>
              Talk to
              <br />
              <span>DIPO LABS.</span>
            </h2>

            <p>
              Account, profile, payment ya identity se related
              question hai? Official support channels se connect
              karo.
            </p>
          </div>

          <div className="dipo-about-contact-actions">
            <button
              type="button"
              className="dipo-about-contact-action"
              onClick={openInstagram}
            >
              <span className="dipo-about-contact-action-icon">
                ◎
              </span>

              <span>
                <small>INSTAGRAM</small>
                <strong>@dipolabs.io</strong>
              </span>

              <b>↗</b>
            </button>

            <a
              href="mailto:dipolabs123@gmail.com?subject=Worldwide%20DIPO%20Support"
              className="dipo-about-contact-action"
            >
              <span className="dipo-about-contact-action-icon">
                @
              </span>

              <span>
                <small>EMAIL</small>
                <strong>dipolabs123@gmail.com</strong>
              </span>

              <b>↗</b>
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL STATEMENT
      ====================================================== */}

      <section className="dipo-about-final dipo-about-final-premium">
        <div className="dipo-about-final-grid" />

        <div className="dipo-about-final-glow" />

        <span
          className="dipo-about-kicker"
          data-reveal
        >
          WORLDWIDE DIPO
        </span>

        <h2 data-reveal>
          Naam se pehchaan hoti hai.
          <br />
          <span>
            Digital identity se duniya tak pahunch hoti hai.
          </span>
        </h2>

        <p data-reveal>
          Har insaan ki apni digital pehchaan.
        </p>

        <a
          href="/auth/signup"
          className="dipo-about-final-btn dipo-magnetic-btn"
          data-reveal
        >
          Build your identity
          <span aria-hidden="true">→</span>
        </a>

        <div className="dipo-about-final-signature">
          WORLDWIDE DIPO · DIPO LABS
        </div>
      </section>

      {/* =====================================================
          MOBILE STORY NAV
      ====================================================== */}

      <div className="dipo-about-mobile-story-nav">
        {storySections.map((label, index) => (
          <button
            key={label}
            type="button"
            className={
              activeSection === index
                ? 'is-active'
                : ''
            }
            onClick={() => scrollToStory(index)}
            aria-label={`Go to ${label}`}
          >
            <span />
          </button>
        ))}
      </div>
    </article>
  );
}