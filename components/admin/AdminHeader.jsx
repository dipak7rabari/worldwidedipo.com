'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

/*
 * ============================================================
 * WORLDWIDE DIPO
 * AdminHeader
 * ============================================================
 *
 * Premium responsive admin navigation.
 *
 * SECURITY:
 * - No admin authorization is performed client-side.
 * - No role is trusted from props/localStorage/query params.
 * - Sensitive authorization remains server-side.
 * - Logout goes through the existing server endpoint.
 *
 * UX:
 * - Desktop navigation
 * - Mobile navigation drawer
 * - Active route indicator
 * - Admin identity display
 * - Secure logout
 * - Keyboard accessible
 * - No external icon dependency
 * - No styled-jsx
 * ============================================================
 */

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Overview',
    short: 'OV',
  },
  {
    href: '/admin/profiles',
    label: 'Profiles',
    short: 'PR',
  },
  {
    href: '/admin/payments',
    label: 'Payments',
    short: 'PY',
  },
  {
    href: '/admin/users',
    label: 'Users',
    short: 'US',
  },
  {
    href: '/admin/audit',
    label: 'Audit',
    short: 'AU',
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    short: 'SE',
  },
];


/*
 * ============================================================
 * INLINE SVG ICONS
 * ============================================================
 */

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />
    </svg>
  );
}


function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="8"
        r="3.25"
      />
      <path d="M5.5 20c.8-3.7 3-5.5 6.5-5.5s5.7 1.8 6.5 5.5" />
    </svg>
  );
}


function PaymentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
      />
      <path d="M3 9h18" />
      <path d="M7 14h4" />
    </svg>
  );
}


function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
      />
      <path d="M3.5 19c.7-3.5 2.5-5.2 5.5-5.2s4.8 1.7 5.5 5.2" />
      <path d="M16 5.5c1.8.2 3 1.4 3 3.2 0 1.5-.8 2.5-2.1 3" />
      <path d="M17 14c2 .6 3.1 2 3.6 4" />
    </svg>
  );
}


function AuditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 3.5h9l3 3V20.5H6z" />
      <path d="M15 3.5v4h4" />
      <path d="M9 11h6M9 14.5h6M9 18h4" />
    </svg>
  );
}


function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="3"
      />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.5h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.5v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.5H21a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}


function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  );
}


function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14 5h5v5" />
      <path d="M19 5l-8 8" />
      <path d="M18 13v5.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H11" />
    </svg>
  );
}


function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m7 9 5 5 5-5" />
    </svg>
  );
}


function MenuIcon({
  open,
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}


/*
 * ============================================================
 * NAV ICON
 * ============================================================
 */

function NavIcon({
  type,
}) {
  switch (type) {
    case 'Overview':
      return <GridIcon />;

    case 'Profiles':
      return <ProfileIcon />;

    case 'Payments':
      return <PaymentIcon />;

    case 'Users':
      return <UsersIcon />;

    case 'Audit':
      return <AuditIcon />;

    case 'Settings':
      return <SettingsIcon />;

    default:
      return <GridIcon />;
  }
}


/*
 * ============================================================
 * ADMIN HEADER
 * ============================================================
 */

export default function AdminHeader({
  admin = null,
  title = 'Admin Command Center',
  subtitle = 'PRIVATE ADMIN CONTROL',
}) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(false);

  const [
    accountOpen,
    setAccountOpen,
  ] =
    useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] =
    useState(false);


  /*
   * ----------------------------------------------------------
   * ACTIVE ROUTE
   * ----------------------------------------------------------
   *
   * /admin itself only matches exact /admin.
   * Other pages use startsWith.
   */
  function isActive(
    href,
  ) {
    if (
      href === '/admin'
    ) {
      return pathname ===
        '/admin';
    }

    return (
      pathname === href ||
      pathname?.startsWith(
        `${href}/`,
      )
    );
  }


  /*
   * ----------------------------------------------------------
   * CLOSE MENUS AFTER NAVIGATION
   * ----------------------------------------------------------
   */

  function closeMenus() {
    setMobileOpen(
      false,
    );

    setAccountOpen(
      false,
    );
  }


  /*
   * ----------------------------------------------------------
   * SECURE LOGOUT
   * ----------------------------------------------------------
   *
   * Authentication is invalidated server-side.
   * We intentionally do NOT clear random localStorage keys
   * because doing so could damage unrelated application state.
   */
  async function handleLogout() {
    if (
      loggingOut
    ) {
      return;
    }

    setLoggingOut(
      true,
    );

    try {
      const response =
        await fetch(
          '/api/auth/logout',
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            cache:
              'no-store',

            credentials:
              'same-origin',
          },
        );

      /*
       * Even if the endpoint responds unexpectedly, force
       * navigation to the login screen. The server remains
       * authoritative for the session.
       */
      if (
        response.ok
      ) {
        router.replace(
          '/auth/login?next=/admin',
        );
      } else {
        router.replace(
          '/auth/login?next=/admin',
        );
      }
    } catch {
      router.replace(
        '/auth/login?next=/admin',
      );
    } finally {
      setLoggingOut(
        false,
      );
    }
  }


  /*
   * ----------------------------------------------------------
   * DISPLAY IDENTITY
   * ----------------------------------------------------------
   *
   * Never invent authorization.
   *
   * If admin data is not passed, display generic admin identity.
   */
  const displayName =
    typeof admin?.displayName ===
      'string' &&
    admin.displayName.trim()
      ? admin.displayName.trim()
      : 'Administrator';

  const displayEmail =
    typeof admin?.email ===
      'string' &&
    admin.email.trim()
      ? admin.email.trim()
      : 'Protected admin account';

  const role =
    typeof admin?.role ===
      'string' &&
    admin.role.trim()
      ? admin.role
      : 'admin';

  const roleLabel =
    role ===
    'super_admin'
      ? 'SUPER ADMIN'
      : role ===
        'support'
        ? 'SUPPORT'
        : 'ADMIN';


  return (
    <>
      <header
        className="dipo-admin-header"
        data-mobile-open={
          mobileOpen
            ? 'true'
            : 'false'
        }
      >
        <div className="dipo-admin-header__inner">

          {/* ==================================================
              BRAND
          =================================================== */}

          <div className="dipo-admin-header__brand-wrap">

            <Link
              href="/admin"
              className="dipo-admin-header__brand"
              aria-label="Worldwide DIPO Admin home"
              onClick={
                closeMenus
              }
            >
              <span
                className="dipo-admin-header__logo"
                aria-hidden="true"
              >
                D
              </span>

              <span className="dipo-admin-header__brand-copy">
                <strong>
                  WORLDWIDE DIPO
                </strong>

                <small>
                  ADMIN CONTROL
                </small>
              </span>
            </Link>

            <span
              className="dipo-admin-header__divider"
              aria-hidden="true"
            />

            <div className="dipo-admin-header__page-context">
              <span>
                {subtitle}
              </span>

              <strong>
                {title}
              </strong>
            </div>
          </div>


          {/* ==================================================
              DESKTOP NAV
          =================================================== */}

          <nav
            className="dipo-admin-header__nav"
            aria-label="Admin navigation"
          >
            {NAV_ITEMS.map(
              (item) => {
                const active =
                  isActive(
                    item.href,
                  );

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className={[
                      'dipo-admin-header__nav-link',
                      active
                        ? 'is-active'
                        : '',
                    ]
                      .join(
                        ' ',
                      )
                      .trim()}
                    aria-current={
                      active
                        ? 'page'
                        : undefined
                    }
                    onClick={
                      closeMenus
                    }
                  >
                    <span
                      className="dipo-admin-header__nav-icon"
                      aria-hidden="true"
                    >
                      <NavIcon
                        type={
                          item.label
                        }
                      />
                    </span>

                    <span>
                      {
                        item.label
                      }
                    </span>
                  </Link>
                );
              },
            )}
          </nav>


          {/* ==================================================
              RIGHT ACTIONS
          =================================================== */}

          <div className="dipo-admin-header__actions">

            <Link
              href="/"
              className="dipo-admin-header__site-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Worldwide DIPO public website"
            >
              <ExternalIcon />

              <span>
                View site
              </span>
            </Link>


            {/* ================================================
                ACCOUNT
            ================================================= */}

            <div className="dipo-admin-header__account-wrap">

              <button
                type="button"
                className="dipo-admin-header__account"
                aria-expanded={
                  accountOpen
                }
                aria-haspopup="menu"
                onClick={() =>
                  setAccountOpen(
                    (value) =>
                      !value,
                  )
                }
              >
                <span
                  className="dipo-admin-header__avatar"
                  aria-hidden="true"
                >
                  {displayName
                    .charAt(
                      0,
                    )
                    .toUpperCase()}
                </span>

                <span className="dipo-admin-header__account-copy">
                  <strong>
                    {displayName}
                  </strong>

                  <small>
                    {roleLabel}
                  </small>
                </span>

                <span
                  className={[
                    'dipo-admin-header__chevron',
                    accountOpen
                      ? 'is-open'
                      : '',
                  ]
                    .join(
                      ' ',
                    )
                    .trim()}
                  aria-hidden="true"
                >
                  <ChevronIcon />
                </span>
              </button>


              {accountOpen && (
                <div
                  className="dipo-admin-header__account-menu"
                  role="menu"
                  aria-label="Admin account menu"
                >
                  <div className="dipo-admin-header__account-menu-head">
                    <span>
                      AUTHENTICATED ADMIN
                    </span>

                    <strong>
                      {displayName}
                    </strong>

                    <small>
                      {displayEmail}
                    </small>
                  </div>

                  <div className="dipo-admin-header__account-menu-divider" />

                  <Link
                    href="/admin/settings"
                    className="dipo-admin-header__account-menu-item"
                    role="menuitem"
                    onClick={
                      closeMenus
                    }
                  >
                    <span>
                      <SettingsIcon />
                    </span>

                    <span>
                      <strong>
                        Admin settings
                      </strong>

                      <small>
                        Security & controls
                      </small>
                    </span>
                  </Link>

                  <button
                    type="button"
                    className="dipo-admin-header__account-menu-item dipo-admin-header__logout"
                    role="menuitem"
                    onClick={
                      handleLogout
                    }
                    disabled={
                      loggingOut
                    }
                  >
                    <span>
                      <LogoutIcon />
                    </span>

                    <span>
                      <strong>
                        {loggingOut
                          ? 'Signing out…'
                          : 'Sign out'}
                      </strong>

                      <small>
                        End admin session
                      </small>
                    </span>
                  </button>
                </div>
              )}
            </div>


            {/* ================================================
                MOBILE MENU
            ================================================= */}

            <button
              type="button"
              className="dipo-admin-header__menu-button"
              aria-label={
                mobileOpen
                  ? 'Close admin navigation'
                  : 'Open admin navigation'
              }
              aria-expanded={
                mobileOpen
              }
              onClick={() =>
                setMobileOpen(
                  (value) =>
                    !value,
                )
              }
            >
              <MenuIcon
                open={
                  mobileOpen
                }
              />
            </button>
          </div>
        </div>


        {/* ====================================================
            MOBILE NAV
        ===================================================== */}

        {mobileOpen && (
          <div className="dipo-admin-header__mobile-panel">

            <div className="dipo-admin-header__mobile-head">
              <div>
                <span>
                  PRIVATE CONTROL
                </span>

                <strong>
                  Admin navigation
                </strong>
              </div>

              <span className="dipo-admin-header__secure-badge">
                <i />
                SECURE
              </span>
            </div>

            <nav
              className="dipo-admin-header__mobile-nav"
              aria-label="Mobile admin navigation"
            >
              {NAV_ITEMS.map(
                (item) => {
                  const active =
                    isActive(
                      item.href,
                    );

                  return (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      className={[
                        'dipo-admin-header__mobile-link',
                        active
                          ? 'is-active'
                          : '',
                      ]
                        .join(
                          ' ',
                        )
                        .trim()}
                      aria-current={
                        active
                          ? 'page'
                          : undefined
                      }
                      onClick={
                        closeMenus
                      }
                    >
                      <span className="dipo-admin-header__mobile-icon">
                        <NavIcon
                          type={
                            item.label
                          }
                        />
                      </span>

                      <span>
                        <strong>
                          {
                            item.label
                          }
                        </strong>

                        <small>
                          {
                            item.short
                          }
                        </small>
                      </span>

                      <span className="dipo-admin-header__mobile-arrow">
                        →
                      </span>
                    </Link>
                  );
                },
              )}
            </nav>

            <div className="dipo-admin-header__mobile-footer">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={
                  closeMenus
                }
              >
                <ExternalIcon />
                View public site
              </Link>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                disabled={
                  loggingOut
                }
              >
                <LogoutIcon />
                {loggingOut
                  ? 'Signing out…'
                  : 'Sign out'}
              </button>
            </div>
          </div>
        )}
      </header>


      {/* ======================================================
          LOCAL COMPONENT STYLES
          No styled-jsx.
      ======================================================= */}

      <style>{`
        .dipo-admin-header {
          --dipo-ink: #0b1220;
          --dipo-text: #172033;
          --dipo-muted: #64748b;
          --dipo-subtle: #94a3b8;
          --dipo-line: #e7ebf0;
          --dipo-line-strong: #dce2e9;
          --dipo-white: #ffffff;
          --dipo-canvas: #f8fafc;
          --dipo-green: #059669;
          --dipo-green-soft: #ecfdf5;

          position: sticky;
          top: 0;
          z-index: 80;
          width: 100%;
          background: rgba(255,255,255,.88);
          border-bottom: 1px solid rgba(226,232,240,.82);
          box-shadow: 0 8px 30px rgba(15,23,42,.035);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .dipo-admin-header *,
        .dipo-admin-header *::before,
        .dipo-admin-header *::after {
          box-sizing: border-box;
        }

        .dipo-admin-header button,
        .dipo-admin-header a {
          -webkit-tap-highlight-color: transparent;
        }

        .dipo-admin-header__inner {
          width: min(100%, 1540px);
          min-height: 76px;
          margin: 0 auto;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .dipo-admin-header__brand-wrap {
          min-width: max-content;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .dipo-admin-header__brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: var(--dipo-ink);
          text-decoration: none;
          border-radius: 14px;
          outline: none;
        }

        .dipo-admin-header__brand:focus-visible,
        .dipo-admin-header__nav-link:focus-visible,
        .dipo-admin-header__site-link:focus-visible,
        .dipo-admin-header__account:focus-visible,
        .dipo-admin-header__menu-button:focus-visible,
        .dipo-admin-header__mobile-link:focus-visible,
        .dipo-admin-header__mobile-footer a:focus-visible,
        .dipo-admin-header__mobile-footer button:focus-visible,
        .dipo-admin-header__account-menu-item:focus-visible {
          outline: 3px solid rgba(5,150,105,.22);
          outline-offset: 3px;
        }

        .dipo-admin-header__logo {
          width: 43px;
          height: 43px;
          flex: 0 0 43px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: #fff;
          background:
            linear-gradient(145deg,#0b1220 0%,#1c2940 100%);
          font-size: 16px;
          font-weight: 950;
          letter-spacing: -.06em;
          box-shadow:
            0 10px 25px rgba(11,18,32,.15);
        }

        .dipo-admin-header__brand-copy {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .dipo-admin-header__brand-copy strong {
          font-size: 12px;
          line-height: 1;
          letter-spacing: -.02em;
          font-weight: 950;
        }

        .dipo-admin-header__brand-copy small {
          color: var(--dipo-subtle);
          font-size: 8px;
          line-height: 1;
          letter-spacing: .14em;
          font-weight: 900;
        }

        .dipo-admin-header__divider {
          width: 1px;
          height: 30px;
          background: var(--dipo-line);
        }

        .dipo-admin-header__page-context {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 125px;
        }

        .dipo-admin-header__page-context span {
          color: var(--dipo-subtle);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .dipo-admin-header__page-context strong {
          color: var(--dipo-text);
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
        }

        .dipo-admin-header__nav {
          min-width: 0;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3px;
        }

        .dipo-admin-header__nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 39px;
          padding: 0 10px;
          border-radius: 11px;
          color: var(--dipo-muted);
          text-decoration: none;
          font-size: 10px;
          font-weight: 850;
          white-space: nowrap;
          transition:
            color 150ms ease,
            background 150ms ease,
            transform 150ms ease;
        }

        .dipo-admin-header__nav-link:hover {
          color: var(--dipo-text);
          background: #f7f9fb;
        }

        .dipo-admin-header__nav-link:active {
          transform: translateY(1px);
        }

        .dipo-admin-header__nav-link.is-active {
          color: var(--dipo-ink);
          background: #f1f5f9;
        }

        .dipo-admin-header__nav-link.is-active::after {
          content: "";
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 4px;
          height: 2px;
          border-radius: 99px;
          background: var(--dipo-green);
        }

        .dipo-admin-header__nav-icon,
        .dipo-admin-header__nav-icon svg {
          width: 15px;
          height: 15px;
        }

        .dipo-admin-header__nav-icon {
          display: grid;
          place-items: center;
          flex: 0 0 15px;
        }

        .dipo-admin-header__nav-icon svg,
        .dipo-admin-header__site-link svg,
        .dipo-admin-header__account-menu-item svg,
        .dipo-admin-header__mobile-footer svg,
        .dipo-admin-header__mobile-icon svg {
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .dipo-admin-header__actions {
          min-width: max-content;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .dipo-admin-header__site-link {
          min-height: 39px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0 10px;
          border: 1px solid var(--dipo-line);
          border-radius: 11px;
          color: var(--dipo-muted);
          background: #fff;
          text-decoration: none;
          font-size: 9px;
          font-weight: 850;
          transition:
            color 150ms ease,
            border-color 150ms ease,
            box-shadow 150ms ease;
        }

        .dipo-admin-header__site-link:hover {
          color: var(--dipo-text);
          border-color: var(--dipo-line-strong);
          box-shadow: 0 5px 18px rgba(15,23,42,.05);
        }

        .dipo-admin-header__site-link svg {
          width: 13px;
          height: 13px;
        }

        .dipo-admin-header__account-wrap {
          position: relative;
        }

        .dipo-admin-header__account {
          min-height: 43px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px 4px 4px;
          border: 1px solid var(--dipo-line);
          border-radius: 13px;
          background: #fff;
          color: var(--dipo-text);
          cursor: pointer;
          font: inherit;
          text-align: left;
          transition:
            border-color 150ms ease,
            box-shadow 150ms ease;
        }

        .dipo-admin-header__account:hover {
          border-color: var(--dipo-line-strong);
          box-shadow: 0 6px 20px rgba(15,23,42,.05);
        }

        .dipo-admin-header__avatar {
          width: 33px;
          height: 33px;
          display: grid;
          place-items: center;
          flex: 0 0 33px;
          border-radius: 10px;
          background: #0b1220;
          color: #fff;
          font-size: 11px;
          font-weight: 950;
        }

        .dipo-admin-header__account-copy {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 65px;
        }

        .dipo-admin-header__account-copy strong {
          color: var(--dipo-text);
          font-size: 9px;
          line-height: 1;
          font-weight: 900;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-admin-header__account-copy small {
          color: var(--dipo-subtle);
          font-size: 7px;
          line-height: 1;
          letter-spacing: .08em;
          font-weight: 900;
        }

        .dipo-admin-header__chevron {
          width: 13px;
          height: 13px;
          display: grid;
          place-items: center;
          color: var(--dipo-subtle);
          transition: transform 150ms ease;
        }

        .dipo-admin-header__chevron.is-open {
          transform: rotate(180deg);
        }

        .dipo-admin-header__chevron svg {
          width: 13px;
          height: 13px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .dipo-admin-header__account-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 9px);
          width: 260px;
          overflow: hidden;
          border: 1px solid var(--dipo-line);
          border-radius: 18px;
          background: #fff;
          box-shadow:
            0 24px 70px rgba(15,23,42,.13),
            0 5px 20px rgba(15,23,42,.05);
          animation: dipoAdminMenuIn 140ms ease both;
        }

        @keyframes dipoAdminMenuIn {
          from {
            opacity: 0;
            transform: translateY(-5px) scale(.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .dipo-admin-header__account-menu-head {
          padding: 15px 16px 13px;
        }

        .dipo-admin-header__account-menu-head span {
          display: block;
          margin-bottom: 6px;
          color: var(--dipo-green);
          font-size: 7px;
          font-weight: 950;
          letter-spacing: .13em;
        }

        .dipo-admin-header__account-menu-head strong {
          display: block;
          color: var(--dipo-text);
          font-size: 12px;
          font-weight: 950;
        }

        .dipo-admin-header__account-menu-head small {
          display: block;
          margin-top: 4px;
          color: var(--dipo-subtle);
          font-size: 9px;
          line-height: 1.4;
          word-break: break-word;
        }

        .dipo-admin-header__account-menu-divider {
          height: 1px;
          background: var(--dipo-line);
        }

        .dipo-admin-header__account-menu-item {
          width: 100%;
          min-height: 58px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 13px;
          border: 0;
          background: transparent;
          color: var(--dipo-text);
          text-decoration: none;
          cursor: pointer;
          font: inherit;
          text-align: left;
        }

        .dipo-admin-header__account-menu-item:hover {
          background: #f8fafc;
        }

        .dipo-admin-header__account-menu-item > span:first-child {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          flex: 0 0 31px;
          border-radius: 9px;
          background: #f1f5f9;
          color: var(--dipo-muted);
        }

        .dipo-admin-header__account-menu-item svg {
          width: 14px;
          height: 14px;
        }

        .dipo-admin-header__account-menu-item > span:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .dipo-admin-header__account-menu-item strong {
          color: var(--dipo-text);
          font-size: 10px;
          font-weight: 900;
        }

        .dipo-admin-header__account-menu-item small {
          color: var(--dipo-subtle);
          font-size: 8px;
        }

        .dipo-admin-header__logout {
          color: #b91c1c;
        }

        .dipo-admin-header__logout > span:first-child {
          color: #b91c1c;
          background: #fef2f2;
        }

        .dipo-admin-header__logout:hover {
          background: #fff7f7;
        }

        .dipo-admin-header__logout:disabled {
          opacity: .6;
          cursor: wait;
        }

        .dipo-admin-header__menu-button {
          display: none;
          width: 41px;
          height: 41px;
          place-items: center;
          border: 1px solid var(--dipo-line);
          border-radius: 12px;
          background: #fff;
          color: var(--dipo-text);
          cursor: pointer;
        }

        .dipo-admin-header__menu-button svg {
          width: 19px;
          height: 19px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
        }

        .dipo-admin-header__mobile-panel {
          display: none;
        }

        @media (max-width: 1180px) {
          .dipo-admin-header__page-context {
            display: none;
          }

          .dipo-admin-header__divider {
            display: none;
          }

          .dipo-admin-header__nav-link {
            padding-left: 8px;
            padding-right: 8px;
          }

          .dipo-admin-header__nav-link span:last-child {
            display: none;
          }

          .dipo-admin-header__nav-icon,
          .dipo-admin-header__nav-icon svg {
            width: 17px;
            height: 17px;
          }
        }

        @media (max-width: 820px) {
          .dipo-admin-header__inner {
            min-height: 67px;
            padding: 9px 13px;
            gap: 10px;
          }

          .dipo-admin-header__nav,
          .dipo-admin-header__site-link,
          .dipo-admin-header__account-copy,
          .dipo-admin-header__chevron {
            display: none;
          }

          .dipo-admin-header__actions {
            margin-left: auto;
          }

          .dipo-admin-header__account {
            padding: 3px;
            border: 0;
            background: transparent;
            box-shadow: none;
          }

          .dipo-admin-header__account:hover {
            border: 0;
            box-shadow: none;
          }

          .dipo-admin-header__avatar {
            width: 36px;
            height: 36px;
            flex-basis: 36px;
            border-radius: 11px;
          }

          .dipo-admin-header__menu-button {
            display: grid;
          }

          .dipo-admin-header__mobile-panel {
            display: block;
            padding: 10px 13px 15px;
            border-top: 1px solid var(--dipo-line);
            background: rgba(255,255,255,.97);
            animation: dipoAdminMobileIn 160ms ease both;
          }

          @keyframes dipoAdminMobileIn {
            from {
              opacity: 0;
              transform: translateY(-5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .dipo-admin-header__mobile-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 8px 3px 12px;
          }

          .dipo-admin-header__mobile-head > div {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .dipo-admin-header__mobile-head span:first-child {
            color: var(--dipo-subtle);
            font-size: 7px;
            font-weight: 950;
            letter-spacing: .14em;
          }

          .dipo-admin-header__mobile-head strong {
            color: var(--dipo-text);
            font-size: 13px;
            font-weight: 950;
          }

          .dipo-admin-header__secure-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            min-height: 25px;
            padding: 0 8px;
            border-radius: 99px;
            background: var(--dipo-green-soft);
            color: var(--dipo-green);
            font-size: 7px;
            font-weight: 950;
            letter-spacing: .08em;
          }

          .dipo-admin-header__secure-badge i {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--dipo-green);
            box-shadow: 0 0 0 3px rgba(5,150,105,.1);
          }

          .dipo-admin-header__mobile-nav {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px;
          }

          .dipo-admin-header__mobile-link {
            min-height: 62px;
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 9px;
            border: 1px solid var(--dipo-line);
            border-radius: 14px;
            background: #fff;
            color: var(--dipo-text);
            text-decoration: none;
            transition:
              border-color 150ms ease,
              background 150ms ease,
              transform 150ms ease;
          }

          .dipo-admin-header__mobile-link:active {
            transform: scale(.985);
          }

          .dipo-admin-header__mobile-link.is-active {
            border-color: rgba(5,150,105,.22);
            background: #f0fdf7;
          }

          .dipo-admin-header__mobile-icon {
            width: 33px;
            height: 33px;
            display: grid;
            place-items: center;
            flex: 0 0 33px;
            border-radius: 10px;
            background: #f4f6f8;
            color: var(--dipo-muted);
          }

          .dipo-admin-header__mobile-link.is-active
            .dipo-admin-header__mobile-icon {
            color: var(--dipo-green);
            background: #dcfce7;
          }

          .dipo-admin-header__mobile-icon svg {
            width: 15px;
            height: 15px;
          }

          .dipo-admin-header__mobile-link > span:nth-child(2) {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .dipo-admin-header__mobile-link strong {
            font-size: 10px;
            font-weight: 900;
          }

          .dipo-admin-header__mobile-link small {
            color: var(--dipo-subtle);
            font-size: 7px;
            font-weight: 900;
            letter-spacing: .08em;
          }

          .dipo-admin-header__mobile-arrow {
            margin-left: auto;
            color: var(--dipo-subtle);
            font-size: 14px;
          }

          .dipo-admin-header__mobile-footer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 7px;
            margin-top: 9px;
          }

          .dipo-admin-header__mobile-footer a,
          .dipo-admin-header__mobile-footer button {
            min-height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            border: 1px solid var(--dipo-line);
            border-radius: 12px;
            background: #fff;
            color: var(--dipo-muted);
            font: inherit;
            font-size: 9px;
            font-weight: 850;
            text-decoration: none;
            cursor: pointer;
          }

          .dipo-admin-header__mobile-footer svg {
            width: 14px;
            height: 14px;
          }

          .dipo-admin-header__mobile-footer button {
            color: #b91c1c;
          }

          .dipo-admin-header__mobile-footer button:disabled {
            opacity: .6;
            cursor: wait;
          }
        }

        @media (max-width: 420px) {
          .dipo-admin-header__inner {
            padding-left: 10px;
            padding-right: 10px;
          }

          .dipo-admin-header__brand-copy small {
            display: none;
          }

          .dipo-admin-header__mobile-nav {
            grid-template-columns: 1fr;
          }

          .dipo-admin-header__mobile-link {
            min-height: 56px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-admin-header *,
          .dipo-admin-header *::before,
          .dipo-admin-header *::after {
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </>
  );
}