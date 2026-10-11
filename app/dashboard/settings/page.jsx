'use client';

import Link from 'next/link';
import { useState } from 'react';

const settingsGroups = [
  {
    title: 'Profile',
    eyebrow: 'IDENTITY',
    items: [
      {
        title: 'Edit your profile',
        description: 'Update your name, headline, bio, skills and professional information.',
        href: '/dashboard/profile',
        icon: '✦',
      },
      {
        title: 'Public profile',
        description: 'Preview the digital identity people see on Worldwide DIPO.',
        href: '/dashboard/share',
        icon: '↗',
      },
    ],
  },
  {
    title: 'Subscription',
    eyebrow: 'PLAN',
    items: [
      {
        title: 'Manage subscription',
        description: 'View your current plan, validity, renewal status and payment history.',
        href: '/dashboard/subscription',
        icon: '◈',
      },
    ],
  },
  {
    title: 'Support',
    eyebrow: 'HELP',
    items: [
      {
        title: 'DIPO Support',
        description: 'Need help? Contact the official Worldwide DIPO support team.',
        href: '/dashboard/support',
        icon: '?',
      },
    ],
  },
];

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      style={{
        width: 48,
        height: 28,
        padding: 3,
        border: '0',
        borderRadius: 999,
        cursor: 'pointer',
        background: enabled ? '#111827' : '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: enabled ? 'flex-end' : 'flex-start',
        transition: 'all .2s ease',
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 2px 7px rgba(0,0,0,.16)',
        }}
      />
    </button>
  );
}

function SettingRow({
  title,
  description,
  children,
}) {
  return (
    <div
      style={{
        padding: '20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 900,
            color: '#111827',
            letterSpacing: '-.02em',
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 5,
            maxWidth: 620,
            fontSize: 12,
            lineHeight: 1.65,
            color: '#64748b',
          }}
        >
          {description}
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

export default function DashboardSettingsPage() {
  const [publicDiscoverability, setPublicDiscoverability] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [motion, setMotion] = useState(true);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1120,
        margin: '0 auto',
        padding: '8px 0 80px',
      }}
    >
      {/* HERO */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '34px 30px',
          background:
            'linear-gradient(135deg, #111827 0%, #1f2937 52%, #0f172a 100%)',
          color: '#fff',
          boxShadow: '0 22px 55px rgba(15,23,42,.16)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 260,
            height: 260,
            right: -100,
            top: -120,
            borderRadius: '50%',
            background: 'rgba(59,130,246,.16)',
            filter: 'blur(8px)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 720,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14,
              padding: '7px 10px',
              borderRadius: 999,
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.1)',
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: '.12em',
            }}
          >
            <span>⚙</span>
            ACCOUNT CONTROL CENTER
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(30px, 5vw, 48px)',
              lineHeight: 1.02,
              fontWeight: 950,
              letterSpacing: '-.055em',
            }}
          >
            Your settings.
            <br />
            Your identity.
          </h1>

          <p
            style={{
              margin: '16px 0 0',
              maxWidth: 620,
              fontSize: 14,
              lineHeight: 1.7,
              color: '#cbd5e1',
            }}
          >
            Control how your Worldwide DIPO profile works, how people
            discover it, and where you manage your account.
          </p>
        </div>
      </section>

      {/* PREFERENCES */}
      <section style={{ marginTop: 24 }}>
        <div
          style={{
            marginBottom: 12,
            fontSize: 10,
            fontWeight: 950,
            letterSpacing: '.14em',
            color: '#94a3b8',
          }}
        >
          PREFERENCES
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 22,
            padding: '0 22px',
          }}
        >
          <SettingRow
            title="Public discoverability"
            description="Allow your active profile to be publicly accessible through your DIPO URL."
          >
            <Toggle
              enabled={publicDiscoverability}
              onChange={setPublicDiscoverability}
            />
          </SettingRow>

          <SettingRow
            title="Profile analytics"
            description="Allow Worldwide DIPO to record privacy-conscious profile view analytics."
          >
            <Toggle
              enabled={analytics}
              onChange={setAnalytics}
            />
          </SettingRow>

          <SettingRow
            title="Motion effects"
            description="Use the enhanced micro-interactions and smooth motion across the dashboard."
          >
            <Toggle
              enabled={motion}
              onChange={setMotion}
            />
          </SettingRow>
        </div>
      </section>

      {/* MANAGEMENT */}
      <section style={{ marginTop: 30 }}>
        <div
          style={{
            marginBottom: 12,
            fontSize: 10,
            fontWeight: 950,
            letterSpacing: '.14em',
            color: '#94a3b8',
          }}
        >
          MANAGEMENT
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 14,
          }}
        >
          {settingsGroups.flatMap((group) =>
            group.items.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <article
                  style={{
                    height: '100%',
                    padding: 22,
                    borderRadius: 22,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    transition:
                      'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: 14,
                      background: '#f1f5f9',
                      color: '#111827',
                      fontSize: 16,
                      fontWeight: 950,
                    }}
                  >
                    {item.icon}
                  </div>

                  <div
                    style={{
                      marginTop: 18,
                      fontSize: 15,
                      fontWeight: 950,
                      letterSpacing: '-.025em',
                    }}
                  >
                    {item.title}
                  </div>

                  <p
                    style={{
                      margin: '7px 0 0',
                      fontSize: 12,
                      lineHeight: 1.65,
                      color: '#64748b',
                    }}
                  >
                    {item.description}
                  </p>

                  <div
                    style={{
                      marginTop: 18,
                      fontSize: 11,
                      fontWeight: 900,
                      color: '#2563eb',
                    }}
                  >
                    Open →
                  </div>
                </article>
              </Link>
            )),
          )}
        </div>
      </section>

      {/* SECURITY */}
      <section
        style={{
          marginTop: 30,
          padding: 22,
          borderRadius: 22,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 13,
              background: '#ecfdf5',
              color: '#047857',
              fontWeight: 950,
            }}
          >
            ✓
          </div>

          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 950,
                color: '#111827',
              }}
            >
              Account security stays server-side
            </div>

            <p
              style={{
                margin: '5px 0 0',
                fontSize: 11,
                lineHeight: 1.65,
                color: '#64748b',
              }}
            >
              Authentication, ownership checks and protected account
              operations are handled by the application security layer.
              Never share passwords, OTPs, UPI PINs or secret keys.
            </p>
          </div>
        </div>
      </section>

      {/* LEGAL */}
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/privacy"
          style={{
            color: '#64748b',
            fontSize: 11,
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          Privacy
        </Link>

        <Link
          href="/terms"
          style={{
            color: '#64748b',
            fontSize: 11,
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          Terms
        </Link>

        <Link
          href="/support"
          style={{
            color: '#64748b',
            fontSize: 11,
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          Support
        </Link>
      </div>
    </div>
  );
}