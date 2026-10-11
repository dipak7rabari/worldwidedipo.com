"use client";

import { useMemo } from "react";
import { PAYMENT_PLANS } from "@/lib/payments/payment-config";

export default function PlanSelector({
  value,
  onChange,
  disabled = false,
}) {
  const plans = useMemo(() => {
    return Object.entries(PAYMENT_PLANS || {}).map(
      ([key, plan]) => ({
        key,
        ...plan,
      })
    );
  }, []);

  if (!plans.length) {
    return (
      <div className="dipo-plans-empty">
        Payment plans are currently unavailable.
      </div>
    );
  }

  return (
    <section
      className="dipo-plan-selector"
      aria-labelledby="dipo-plan-title"
    >
      <style jsx>{`
        .dipo-plan-selector {
          width: 100%;
          margin: 0;
        }

        .dipo-plan-header {
          margin-bottom: 20px;
        }

        .dipo-plan-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 8px;
          color: #059669;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .dipo-plan-kicker-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow:
            0 0 0 5px rgba(16, 185, 129, 0.1);
          animation: dipoPulse 2s ease-in-out infinite;
        }

        .dipo-plan-title {
          margin: 0;
          color: #111827;
          font-size: clamp(26px, 6vw, 38px);
          line-height: 1.03;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .dipo-plan-description {
          max-width: 600px;
          margin: 9px 0 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }

        .dipo-plans-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 14px;
          align-items: stretch;
        }

        .dipo-plan-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          padding: 22px;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          background: #ffffff;
          box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.045);
          cursor: pointer;
          text-align: left;
          transform: translateY(0);
          transition:
            transform 220ms cubic-bezier(
              0.2,
              0.8,
              0.2,
              1
            ),
            border-color 220ms ease,
            box-shadow 220ms ease,
            background 220ms ease;
          animation: dipoCardIn 500ms
            cubic-bezier(0.2, 0.8, 0.2, 1)
            both;
          animation-delay:
            calc(var(--plan-index) * 80ms);
        }

        .dipo-plan-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(16, 185, 129, 0.09),
              transparent 42%
            );
          opacity: 0;
          transition: opacity 220ms ease;
        }

        .dipo-plan-card:hover {
          transform: translateY(-5px);
          border-color: #d1d5db;
          box-shadow:
            0 20px 45px rgba(0, 0, 0, 0.09);
        }

        .dipo-plan-card:hover::before {
          opacity: 1;
        }

        .dipo-plan-card:focus-visible {
          outline: 3px solid
            rgba(16, 185, 129, 0.25);
          outline-offset: 3px;
        }

        .dipo-plan-card.is-selected {
          border-color: #10b981;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f7fffb 100%
            );
          box-shadow:
            0 0 0 1px #10b981,
            0 20px 50px
              rgba(16, 185, 129, 0.12);
        }

        .dipo-plan-card.is-selected::after {
          content: "";
          position: absolute;
          top: 0;
          left: 16%;
          right: 16%;
          height: 2px;
          border-radius: 999px;
          background: #10b981;
          box-shadow:
            0 0 18px
              rgba(16, 185, 129, 0.55);
        }

        .dipo-plan-card.is-disabled {
          cursor: not-allowed;
          opacity: 0.58;
          transform: none;
        }

        .dipo-plan-badge-row {
          position: relative;
          z-index: 1;
          min-height: 24px;
          margin-bottom: 12px;
        }

        .dipo-plan-badge {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 5px 9px;
          border-radius: 999px;
          background: #111827;
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dipo-plan-badge.popular {
          background: #10b981;
        }

        .dipo-plan-badge.premium {
          background: #111827;
        }

        .dipo-plan-check {
          position: absolute;
          top: 19px;
          right: 19px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          height: 25px;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          background: #ffffff;
          color: transparent;
          font-size: 12px;
          font-weight: 950;
          transition:
            background 180ms ease,
            border-color 180ms ease,
            color 180ms ease,
            transform 180ms ease;
        }

        .is-selected .dipo-plan-check {
          border-color: #10b981;
          background: #10b981;
          color: #ffffff;
          transform: scale(1.05);
        }

        .dipo-plan-name {
          position: relative;
          z-index: 1;
          margin: 0;
          padding-right: 32px;
          color: #111827;
          font-size: 18px;
          line-height: 1.2;
          font-weight: 900;
          letter-spacing: -0.025em;
        }

        .dipo-plan-tagline {
          position: relative;
          z-index: 1;
          min-height: 38px;
          margin: 7px 0 0;
          color: #6b7280;
          font-size: 12px;
          line-height: 1.5;
        }

        .dipo-plan-price {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-end;
          gap: 3px;
          margin: 19px 0 4px;
        }

        .dipo-plan-currency {
          margin-bottom: 6px;
          color: #374151;
          font-size: 15px;
          font-weight: 800;
        }

        .dipo-plan-amount {
          color: #111827;
          font-size: 38px;
          line-height: 0.95;
          font-weight: 950;
          letter-spacing: -0.065em;
        }

        .dipo-plan-duration {
          margin: 7px 0 0;
          color: #9ca3af;
          font-size: 11px;
          font-weight: 700;
        }

        .dipo-plan-divider {
          height: 1px;
          margin: 18px 0;
          background: #f0f0f1;
        }

        .dipo-plan-features {
          position: relative;
          z-index: 1;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .dipo-plan-feature {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #4b5563;
          font-size: 12px;
          line-height: 1.45;
        }

        .dipo-feature-icon {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          margin-top: -1px;
          border-radius: 50%;
          background: #ecfdf5;
          color: #059669;
          font-size: 10px;
          font-weight: 950;
        }

        .dipo-plan-select {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          min-height: 46px;
          margin-top: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          background: #ffffff;
          color: #111827;
          font-size: 12px;
          font-weight: 900;
          transition:
            background 180ms ease,
            color 180ms ease,
            border-color 180ms ease;
        }

        .is-selected .dipo-plan-select {
          border-color: #111827;
          background: #111827;
          color: #ffffff;
        }

        .dipo-plan-select-arrow {
          font-size: 15px;
          transition:
            transform 180ms ease;
        }

        .dipo-plan-card:hover
          .dipo-plan-select-arrow {
          transform: translateX(3px);
        }

        .dipo-plan-note {
          margin: 18px 0 0;
          color: #9ca3af;
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
        }

        .dipo-plans-empty {
          padding: 18px;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          background: #ffffff;
          color: #6b7280;
          font-size: 13px;
        }

        @keyframes dipoCardIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dipoPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(0.75);
            opacity: 0.65;
          }
        }

        @media (max-width: 900px) {
          .dipo-plans-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .dipo-plan-card {
            min-height: 0;
          }

          .dipo-plan-tagline {
            min-height: 0;
          }

          .dipo-plan-features {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .dipo-plan-title {
            font-size: 29px;
          }

          .dipo-plan-description {
            font-size: 13px;
          }

          .dipo-plan-card {
            padding: 19px;
            border-radius: 21px;
          }

          .dipo-plan-amount {
            font-size: 35px;
          }

          .dipo-plan-features {
            display: flex;
          }

          .dipo-plan-select {
            min-height: 50px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-plan-card,
          .dipo-plan-check,
          .dipo-plan-select-arrow {
            animation: none;
            transition: none;
          }

          .dipo-plan-kicker-dot {
            animation: none;
          }
        }
      `}</style>

      <header className="dipo-plan-header">
        <p className="dipo-plan-kicker">
          <span className="dipo-plan-kicker-dot" />
          Choose your DIPO
        </p>

        <h2
          id="dipo-plan-title"
          className="dipo-plan-title"
        >
          Pick the plan that fits you.
        </h2>

        <p className="dipo-plan-description">
          Every plan gives you a public Worldwide DIPO
          identity. Choose according to the level of
          presence and features you need.
        </p>
      </header>

      <div className="dipo-plans-grid">
        {plans.map((plan, index) => {
          const selected =
            String(value || "").toLowerCase() ===
            String(plan.key || "").toLowerCase();

          const badge =
            plan.badge ||
            plan.label ||
            null;

          const features = Array.isArray(
            plan.features
          )
            ? plan.features.slice(0, 5)
            : [];

          const isPopular =
            String(badge || "")
              .toLowerCase()
              .includes("popular");

          const isPremium =
            String(badge || "")
              .toLowerCase()
              .includes("premium");

          return (
            <button
              key={plan.key}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-label={`Select ${plan.name} plan for ₹${plan.amount}`}
              onClick={() => {
                if (!disabled) {
                  onChange?.(plan.key);
                }
              }}
              className={[
                "dipo-plan-card",
                selected
                  ? "is-selected"
                  : "",
                disabled
                  ? "is-disabled"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                "--plan-index": index,
              }}
            >
              <span className="dipo-plan-badge-row">
                {badge && (
                  <span
                    className={[
                      "dipo-plan-badge",
                      isPopular
                        ? "popular"
                        : "",
                      isPremium
                        ? "premium"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {badge}
                  </span>
                )}
              </span>

              <span className="dipo-plan-check">
                ✓
              </span>

              <span className="dipo-plan-name">
                {plan.name}
              </span>

              <span className="dipo-plan-tagline">
                {plan.description ||
                  "Build your public digital identity."}
              </span>

              <span className="dipo-plan-price">
                <span className="dipo-plan-currency">
                  ₹
                </span>

                <span className="dipo-plan-amount">
                  {plan.amount}
                </span>
              </span>

              <span className="dipo-plan-duration">
                {plan.durationMonths || 6} months
                access
              </span>

              <span className="dipo-plan-divider" />

              {features.length > 0 && (
                <ul
                  className="dipo-plan-features"
                  aria-label={`${plan.name} features`}
                >
                  {features.map(
                    (feature, featureIndex) => (
                      <li
                        key={`${plan.key}-${featureIndex}`}
                        className="dipo-plan-feature"
                      >
                        <span
                          className="dipo-feature-icon"
                          aria-hidden="true"
                        >
                          ✓
                        </span>

                        <span>
                          {feature}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              )}

              <span className="dipo-plan-select">
                {selected
                  ? "Selected plan"
                  : "Choose this plan"}

                <span
                  className="dipo-plan-select-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="dipo-plan-note">
        Secure payment • 6-month access •
        Manual verification before activation
      </p>
    </section>
  );
}