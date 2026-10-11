import { redirect } from 'next/navigation';

import { getMyProfile } from '@/lib/profile/get-my-profile';
import PaymentClaimForm from '@/components/payment/PaymentClaimForm';

export const dynamic = 'force-dynamic';

export default async function PaymentPage() {
  const {
    user,
    profile,
  } = await getMyProfile();

  if (!user) {
    redirect(
      '/auth/login?next=/dashboard/subscription/payment'
    );
  }

  if (!profile) {
    redirect('/onboarding');
  }

  /*
   * Initial activation is allowed only for
   * a draft profile.
   *
   * The database remains the final authority
   * for payment/profile state.
   */
  if (profile.status !== 'draft') {
    redirect('/dashboard/subscription');
  }

  return (
    <main className="dipo-checkout-page">

      <div className="dipo-checkout-container">

        {/* =====================================================
            TOP BAR
        ====================================================== */}

        <header className="dipo-checkout-topbar">

          <a
            href="/dashboard/profile"
            className="dipo-back-link"
          >
            <span aria-hidden="true">
              ←
            </span>

            <span>
              My DIPO
            </span>
          </a>

          <div className="dipo-secure-badge">
            <span
              className="dipo-secure-dot"
              aria-hidden="true"
            />

            Secure Checkout
          </div>

        </header>


        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="dipo-checkout-hero">

          <div className="dipo-brand-mark">
            D
          </div>

          <p className="dipo-checkout-eyebrow">
            WORLDWIDE DIPO
          </p>

          <h1>
            Activate your DIPO
          </h1>

          <p className="dipo-checkout-subtitle">
            Choose your plan, complete the UPI payment,
            then submit your UTR / payment reference.
            Our team will verify the transaction before
            your DIPO goes live.
          </p>

        </section>


        {/* =====================================================
            CHECKOUT STEPS
        ====================================================== */}

        <nav
          className="dipo-checkout-steps"
          aria-label="Payment steps"
        >

          <div className="dipo-step is-complete">
            <span className="dipo-step-number">
              ✓
            </span>

            <div>
              <strong>
                Profile
              </strong>

              <small>
                Created
              </small>
            </div>
          </div>


          <div
            className="dipo-step-line is-complete"
            aria-hidden="true"
          />


          <div className="dipo-step is-active">
            <span className="dipo-step-number">
              2
            </span>

            <div>
              <strong>
                Payment
              </strong>

              <small>
                Pay & submit UTR
              </small>
            </div>
          </div>


          <div
            className="dipo-step-line"
            aria-hidden="true"
          />


          <div className="dipo-step">
            <span className="dipo-step-number">
              3
            </span>

            <div>
              <strong>
                Verification
              </strong>

              <small>
                Manual review
              </small>
            </div>
          </div>


          <div
            className="dipo-step-line"
            aria-hidden="true"
          />


          <div className="dipo-step">
            <span className="dipo-step-number">
              4
            </span>

            <div>
              <strong>
                Go Live
              </strong>

              <small>
                DIPO activated
              </small>
            </div>
          </div>

        </nav>


        {/* =====================================================
            PROFILE SUMMARY
        ====================================================== */}

        <section className="dipo-profile-strip">

          <div className="dipo-profile-avatar">

            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
              />
            ) : (
              profile.name
                ?.charAt(0)
                ?.toUpperCase() || 'D'
            )}

          </div>

          <div className="dipo-profile-info">

            <span>
              Activating DIPO for
            </span>

            <strong>
              {profile.name}
            </strong>

            <small>
              worldwidedipo.com/p/{profile.slug}
            </small>

          </div>

          <div className="dipo-draft-badge">
            Draft
          </div>

        </section>


        {/* =====================================================
            PAYMENT FORM
        ====================================================== */}

        <section className="dipo-payment-shell">

          <PaymentClaimForm
            profile={profile}
          />

        </section>


        {/* =====================================================
            WHAT IS UTR?
        ====================================================== */}

        <section className="dipo-help-section">

          <div className="dipo-section-kicker">
            NEED HELP?
          </div>

          <h2>
            What is a UTR / Payment Reference?
          </h2>

          <p className="dipo-help-intro">
            UTR means <strong>Unique Transaction Reference</strong>.
            It is a transaction/reference number generated
            by your bank or UPI app after a successful payment.
            Worldwide DIPO uses it to match your submitted
            payment with the actual transaction.
          </p>


          <div className="dipo-utr-guide">

            <div className="dipo-guide-step">

              <span className="dipo-guide-number">
                01
              </span>

              <div>
                <h3>
                  First, choose your plan
                </h3>

                <p>
                  Select the Worldwide DIPO plan you want.
                  The amount shown on this page is the amount
                  you should pay.
                </p>
              </div>

            </div>


            <div className="dipo-guide-step">

              <span className="dipo-guide-number">
                02
              </span>

              <div>
                <h3>
                  Complete the UPI payment
                </h3>

                <p>
                  Scan the QR code or use the official UPI
                  details shown on the payment section.
                  Complete the payment inside your UPI app.
                </p>
              </div>

            </div>


            <div className="dipo-guide-step">

              <span className="dipo-guide-number">
                03
              </span>

              <div>
                <h3>
                  Open your UPI payment details
                </h3>

                <p>
                  After the payment succeeds, open the
                  transaction details in your UPI app.
                  Look for a field such as
                  <strong> UTR</strong>,
                  <strong> Transaction ID</strong>,
                  <strong> UPI Reference</strong> or
                  <strong> Reference Number</strong>.
                </p>
              </div>

            </div>


            <div className="dipo-guide-step">

              <span className="dipo-guide-number">
                04
              </span>

              <div>
                <h3>
                  Copy that reference number
                </h3>

                <p>
                  Copy the transaction reference exactly
                  as shown by your payment app and paste it
                  into the UTR / Payment Reference field.
                </p>
              </div>

            </div>


            <div className="dipo-guide-step">

              <span className="dipo-guide-number">
                05
              </span>

              <div>
                <h3>
                  Submit for verification
                </h3>

                <p>
                  After you submit it, your payment becomes
                  <strong> Pending Verification</strong>.
                  Worldwide DIPO will manually verify the
                  transaction before activation.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            VERY IMPORTANT — SECURITY
        ====================================================== */}

        <section className="dipo-security-card">

          <div className="dipo-security-icon">
            !
          </div>

          <div>

            <span className="dipo-security-label">
              IMPORTANT SECURITY NOTICE
            </span>

            <h2>
              Never share your banking secrets
            </h2>

            <p>
              Worldwide DIPO will never ask you to enter
              your UPI PIN, ATM PIN, card PIN, OTP,
              CVV, internet-banking password or account
              password in this payment form.
            </p>

            <div className="dipo-never-list">

              <span>
                ✕ UPI PIN
              </span>

              <span>
                ✕ OTP
              </span>

              <span>
                ✕ CVV
              </span>

              <span>
                ✕ Card PIN
              </span>

              <span>
                ✕ Banking Password
              </span>

            </div>

            <p className="dipo-security-note">
              You only need to submit the payment
              reference/UTR generated after your payment.
            </p>

          </div>

        </section>


        {/* =====================================================
            VERIFICATION EXPLANATION
        ====================================================== */}

        <section className="dipo-verification-card">

          <div className="dipo-verification-header">

            <div className="dipo-verification-icon">
              ✓
            </div>

            <div>
              <span>
                AFTER SUBMISSION
              </span>

              <h2>
                What happens next?
              </h2>
            </div>

          </div>


          <div className="dipo-verification-flow">

            <div>
              <strong>
                01
              </strong>

              <p>
                UTR received
              </p>
            </div>

            <span aria-hidden="true">
              →
            </span>

            <div>
              <strong>
                02
              </strong>

              <p>
                Payment checked
              </p>
            </div>

            <span aria-hidden="true">
              →
            </span>

            <div>
              <strong>
                03
              </strong>

              <p>
                Admin verifies
              </p>
            </div>

            <span aria-hidden="true">
              →
            </span>

            <div>
              <strong>
                04
              </strong>

              <p>
                DIPO goes live
              </p>
            </div>

          </div>


          <p className="dipo-verification-description">
            Submitting a UTR does not automatically activate
            your DIPO. The payment is manually verified.
            If the transaction is verified, your profile is
            activated according to the selected plan.
          </p>

        </section>


        {/* =====================================================
            SUPPORT
        ====================================================== */}

        <section className="dipo-support-card">

          <div>

            <span className="dipo-section-kicker">
              NEED ASSISTANCE?
            </span>

            <h2>
              We’re here to help.
            </h2>

            <p>
              Payment issue, UTR samajh nahi aa raha,
              ya verification ke baare mein help chahiye?
              Support team se contact karein.
            </p>

          </div>


          <div className="dipo-support-actions">

            <a
              href="mailto:dipolabs@gmail.com?subject=Worldwide%20DIPO%20Payment%20Support"
              className="dipo-support-button primary"
            >
              <span>
                ✉
              </span>

              Email Support
            </a>

            <a
              href="https://www.instagram.com/dipolabs.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="dipo-support-button secondary"
            >
              <span>
                ◎
              </span>

              Instagram Support
            </a>

          </div>

        </section>


        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="dipo-checkout-footer">

          <p>
            Made With ❤️ in India
          </p>

          <strong>
            𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
          </strong>

          <small>
            All copyrights reserved @
            {' '}
            𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
          </small>

        </footer>

      </div>


      {/* =====================================================
          PAGE STYLES
      ====================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .dipo-checkout-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 85% -10%,
              rgba(37, 99, 235, 0.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 5% 35%,
              rgba(14, 165, 233, 0.06),
              transparent 25%
            ),
            #f8fafc;

          color: #0f172a;
        }


        .dipo-checkout-container {
          width: min(
            calc(100% - 28px),
            900px
          );

          margin-inline: auto;

          padding:
            18px
            0
            70px;
        }


        /* =====================================================
           TOP BAR
        ====================================================== */

        .dipo-checkout-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;

          padding:
            4px
            0
            22px;
        }


        .dipo-back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          color: #334155;

          font-size: 12px;
          font-weight: 800;

          text-decoration: none;
        }


        .dipo-back-link:hover {
          color: #2563eb;
        }


        .dipo-secure-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          padding:
            7px
            10px;

          border:
            1px solid
            #e2e8f0;

          border-radius: 999px;

          background: rgba(
            255,
            255,
            255,
            0.8
          );

          color: #64748b;

          font-size: 10px;
          font-weight: 800;
        }


        .dipo-secure-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 0 4px
            rgba(
              34,
              197,
              94,
              0.10
            );
        }


        /* =====================================================
           HERO
        ====================================================== */

        .dipo-checkout-hero {
          max-width: 720px;

          margin:
            24px
            auto
            30px;

          text-align: center;
        }


        .dipo-brand-mark {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          margin:
            0
            auto
            14px;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #0f172a,
              #334155
            );

          color: #ffffff;

          font-size: 20px;
          font-weight: 900;

          box-shadow:
            0 10px 25px
            rgba(
              15,
              23,
              42,
              0.16
            );
        }


        .dipo-checkout-eyebrow,
        .dipo-section-kicker {
          margin: 0;

          color: #2563eb;

          font-size: 10px;
          font-weight: 900;

          letter-spacing:
            0.12em;

          text-transform:
            uppercase;
        }


        .dipo-checkout-hero h1 {
          margin:
            7px
            0
            0;

          font-size:
            clamp(
              32px,
              7vw,
              48px
            );

          line-height: 1.04;

          letter-spacing:
            -0.055em;
        }


        .dipo-checkout-subtitle {
          max-width: 650px;

          margin:
            13px
            auto
            0;

          color: #64748b;

          font-size: 14px;

          line-height: 1.7;
        }


        /* =====================================================
           STEPS
        ====================================================== */

        .dipo-checkout-steps {
          display: flex;
          align-items: center;

          width: 100%;

          margin-bottom: 18px;

          padding:
            12px;

          overflow-x: auto;

          border:
            1px solid
            #e2e8f0;

          border-radius: 15px;

          background:
            rgba(
              255,
              255,
              255,
              0.9
            );

          box-shadow:
            0 5px 20px
            rgba(
              15,
              23,
              42,
              0.03
            );
        }


        .dipo-step {
          display: flex;
          align-items: center;

          gap: 8px;

          flex: 1 1 auto;

          min-width: max-content;
        }


        .dipo-step-number {
          width: 28px;
          height: 28px;

          flex: 0 0 28px;

          display: grid;
          place-items: center;

          border:
            1px solid
            #e2e8f0;

          border-radius: 9px;

          background: #ffffff;

          color: #94a3b8;

          font-size: 10px;
          font-weight: 900;
        }


        .dipo-step strong {
          display: block;

          color: #64748b;

          font-size: 10px;
        }


        .dipo-step small {
          display: block;

          margin-top: 2px;

          color: #94a3b8;

          font-size: 8px;
        }


        .dipo-step.is-complete
          .dipo-step-number {
          border-color: #bbf7d0;
          background: #f0fdf4;
          color: #16a34a;
        }


        .dipo-step.is-complete strong {
          color: #166534;
        }


        .dipo-step.is-active
          .dipo-step-number {
          border-color: #bfdbfe;
          background: #eff6ff;
          color: #2563eb;
        }


        .dipo-step.is-active strong {
          color: #1d4ed8;
        }


        .dipo-step-line {
          width: 30px;
          height: 1px;

          flex: 0 0 30px;

          margin:
            0
            8px;

          background: #e2e8f0;
        }


        .dipo-step-line.is-complete {
          background: #bbf7d0;
        }


        /* =====================================================
           PROFILE STRIP
        ====================================================== */

        .dipo-profile-strip {
          display: flex;
          align-items: center;

          gap: 12px;

          margin-bottom: 18px;

          padding: 12px 14px;

          border:
            1px solid
            #e2e8f0;

          border-radius: 14px;

          background: #ffffff;
        }


        .dipo-profile-avatar {
          width: 42px;
          height: 42px;

          flex: 0 0 42px;

          display: grid;
          place-items: center;

          overflow: hidden;

          border-radius: 12px;

          background: #eff6ff;

          color: #2563eb;

          font-size: 15px;
          font-weight: 900;
        }


        .dipo-profile-avatar img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }


        .dipo-profile-info {
          min-width: 0;
          flex: 1;
        }


        .dipo-profile-info span {
          display: block;

          color: #94a3b8;

          font-size: 9px;
          font-weight: 800;
        }


        .dipo-profile-info strong {
          display: block;

          margin-top: 2px;

          color: #0f172a;

          font-size: 13px;
        }


        .dipo-profile-info small {
          display: block;

          margin-top: 2px;

          overflow: hidden;

          color: #64748b;

          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;

          font-size: 9px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }


        .dipo-draft-badge {
          padding:
            5px
            8px;

          border:
            1px solid
            #dbeafe;

          border-radius: 999px;

          background: #eff6ff;

          color: #1d4ed8;

          font-size: 9px;
          font-weight: 900;
        }


        /* =====================================================
           PAYMENT SHELL
        ====================================================== */

        .dipo-payment-shell {
          position: relative;

          padding:
            2px;

          border-radius: 20px;

          background:
            linear-gradient(
              135deg,
              rgba(
                37,
                99,
                235,
                0.13
              ),
              rgba(
                255,
                255,
                255,
                0
              )
            );
        }


        .dipo-payment-shell
          :global(.payment-claim-form) {
          position: relative;
        }


        /* =====================================================
           UTR HELP
        ====================================================== */

        .dipo-help-section {
          margin-top: 42px;
          padding-top: 4px;
        }


        .dipo-help-section h2 {
          margin:
            6px
            0
            0;

          font-size:
            clamp(
              23px,
              4vw,
              31px
            );

          letter-spacing:
            -0.035em;
        }


        .dipo-help-intro {
          max-width: 760px;

          margin:
            9px
            0
            0;

          color: #64748b;

          font-size: 13px;

          line-height: 1.7;
        }


        .dipo-utr-guide {
          display: grid;

          margin-top: 18px;

          overflow: hidden;

          border:
            1px solid
            #e2e8f0;

          border-radius: 17px;

          background: #ffffff;
        }


        .dipo-guide-step {
          display: grid;

          grid-template-columns:
            45px
            minmax(0, 1fr);

          gap: 13px;

          padding:
            19px;

          border-bottom:
            1px solid
            #f1f5f9;
        }


        .dipo-guide-step:last-child {
          border-bottom: 0;
        }


        .dipo-guide-number {
          color: #2563eb;

          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;

          font-size: 11px;
          font-weight: 900;
        }


        .dipo-guide-step h3 {
          margin: 0;

          font-size: 14px;
        }


        .dipo-guide-step p {
          margin:
            5px
            0
            0;

          color: #64748b;

          font-size: 12px;

          line-height: 1.65;
        }


        .dipo-guide-step strong {
          color: #334155;
        }


        /* =====================================================
           SECURITY
        ====================================================== */

        .dipo-security-card {
          display: flex;
          align-items: flex-start;

          gap: 15px;

          margin-top: 18px;

          padding: 20px;

          border:
            1px solid
            #fed7aa;

          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              #fff7ed,
              #fffbeb
            );
        }


        .dipo-security-icon {
          width: 38px;
          height: 38px;

          flex: 0 0 38px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #ffffff;

          color: #ea580c;

          font-size: 18px;
          font-weight: 900;

          box-shadow:
            0 4px 12px
            rgba(
              234,
              88,
              12,
              0.08
            );
        }


        .dipo-security-label {
          color: #c2410c;

          font-size: 9px;
          font-weight: 900;

          letter-spacing:
            0.1em;
        }


        .dipo-security-card h2 {
          margin:
            4px
            0
            0;

          font-size: 17px;
        }


        .dipo-security-card p {
          max-width: 700px;

          margin:
            6px
            0
            0;

          color: #7c2d12;

          font-size: 12px;

          line-height: 1.6;
        }


        .dipo-never-list {
          display: flex;
          flex-wrap: wrap;

          gap: 6px;

          margin-top: 12px;
        }


        .dipo-never-list span {
          padding:
            6px
            8px;

          border:
            1px solid
            #fed7aa;

          border-radius: 999px;

          background:
            rgba(
              255,
              255,
              255,
              0.75
            );

          color: #9a3412;

          font-size: 9px;
          font-weight: 800;
        }


        .dipo-security-note {
          opacity: 0.8;
        }


        /* =====================================================
           VERIFICATION
        ====================================================== */

        .dipo-verification-card {
          margin-top: 18px;

          padding: 21px;

          border:
            1px solid
            #dbeafe;

          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #ffffff
            );
        }


        .dipo-verification-header {
          display: flex;
          align-items: center;

          gap: 11px;
        }


        .dipo-verification-icon {
          width: 36px;
          height: 36px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #ffffff;

          color: #2563eb;

          font-weight: 900;
        }


        .dipo-verification-header span {
          color: #64748b;

          font-size: 9px;
          font-weight: 900;

          letter-spacing:
            0.1em;
        }


        .dipo-verification-header h2 {
          margin:
            3px
            0
            0;

          font-size: 17px;
        }


        .dipo-verification-flow {
          display: flex;
          align-items: center;

          gap: 8px;

          margin-top: 20px;

          overflow-x: auto;
        }


        .dipo-verification-flow > div {
          min-width: 105px;

          padding:
            11px;

          border:
            1px solid
            #dbeafe;

          border-radius: 11px;

          background: #ffffff;
        }


        .dipo-verification-flow strong {
          color: #2563eb;

          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;

          font-size: 9px;
        }


        .dipo-verification-flow p {
          margin:
            4px
            0
            0;

          color: #334155;

          font-size: 10px;
          font-weight: 800;
        }


        .dipo-verification-flow > span {
          color: #94a3b8;
          font-size: 13px;
        }


        .dipo-verification-description {
          margin:
            17px
            0
            0;

          color: #64748b;

          font-size: 11px;

          line-height: 1.65;
        }


        /* =====================================================
           SUPPORT
        ====================================================== */

        .dipo-support-card {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 24px;

          margin-top: 18px;

          padding: 21px;

          border:
            1px solid
            #e2e8f0;

          border-radius: 16px;

          background: #ffffff;
        }


        .dipo-support-card h2 {
          margin:
            5px
            0
            0;

          font-size: 20px;

          letter-spacing:
            -0.025em;
        }


        .dipo-support-card p {
          max-width: 560px;

          margin:
            6px
            0
            0;

          color: #64748b;

          font-size: 12px;

          line-height: 1.6;
        }


        .dipo-support-actions {
          display: flex;
          flex-wrap: wrap;

          gap: 8px;

          flex: 0 0 auto;
        }


        .dipo-support-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          min-height: 40px;

          padding:
            9px
            13px;

          border-radius: 9px;

          font-size: 11px;
          font-weight: 800;

          text-decoration: none;

          transition:
            transform 150ms ease,
            box-shadow 150ms ease;
        }


        .dipo-support-button:hover {
          transform: translateY(-1px);
        }


        .dipo-support-button.primary {
          border:
            1px solid
            #2563eb;

          background: #2563eb;

          color: #ffffff;

          box-shadow:
            0 5px 14px
            rgba(
              37,
              99,
              235,
              0.16
            );
        }


        .dipo-support-button.secondary {
          border:
            1px solid
            #e2e8f0;

          background: #ffffff;

          color: #334155;
        }


        /* =====================================================
           FOOTER
        ====================================================== */

        .dipo-checkout-footer {
          padding:
            45px
            0
            20px;

          text-align: center;

          color: #94a3b8;
        }


        .dipo-checkout-footer p {
          margin:
            0
            0
            5px;

          font-size: 10px;
        }


        .dipo-checkout-footer strong {
          display: block;

          color: #64748b;

          font-size: 11px;
        }


        .dipo-checkout-footer small {
          display: block;

          margin-top: 4px;

          font-size: 8px;
        }


        /* =====================================================
           RESPONSIVE
        ====================================================== */

        @media (max-width: 760px) {

          .dipo-checkout-container {
            width:
              min(
                calc(100% - 20px),
                900px
              );

            padding-top: 10px;
          }


          .dipo-checkout-topbar {
            padding-bottom: 15px;
          }


          .dipo-checkout-hero {
            margin-top: 18px;
          }


          .dipo-checkout-steps {
            gap: 0;

            padding:
              10px;

            scrollbar-width: none;
          }


          .dipo-checkout-steps::-webkit-scrollbar {
            display: none;
          }


          .dipo-step {
            flex: 0 0 auto;
          }


          .dipo-step-line {
            flex: 0 0 18px;
            width: 18px;

            margin:
              0
              5px;
          }


          .dipo-step small {
            display: none;
          }


          .dipo-profile-strip {
            padding:
              11px;
          }


          .dipo-help-section {
            margin-top: 32px;
          }


          .dipo-support-card {
            align-items: flex-start;
            flex-direction: column;
          }


          .dipo-support-actions {
            width: 100%;
          }


          .dipo-support-button {
            flex: 1;
          }

        }


        @media (max-width: 480px) {

          .dipo-checkout-hero h1 {
            font-size: 32px;
          }


          .dipo-checkout-subtitle {
            font-size: 12px;
          }


          .dipo-profile-info small {
            max-width: 170px;
          }


          .dipo-draft-badge {
            display: none;
          }


          .dipo-guide-step {
            grid-template-columns:
              35px
              minmax(0, 1fr);

            padding:
              16px;
          }


          .dipo-guide-step p,
          .dipo-help-intro {
            font-size: 11px;
          }


          .dipo-security-card,
          .dipo-verification-card,
          .dipo-support-card {
            padding: 17px;
          }


          .dipo-security-card {
            gap: 10px;
          }


          .dipo-security-icon {
            width: 32px;
            height: 32px;
            flex-basis: 32px;

            border-radius: 9px;
          }


          .dipo-verification-flow {
            align-items: stretch;
            flex-direction: column;
          }


          .dipo-verification-flow > div {
            width: 100%;
          }


          .dipo-verification-flow > span {
            display: none;
          }


          .dipo-support-actions {
            flex-direction: column;
          }


          .dipo-support-button {
            width: 100%;
          }

        }


        @media (prefers-reduced-motion: reduce) {

          .dipo-support-button {
            transition: none;
          }

        }

      `}</style>

    </main>
  );
}