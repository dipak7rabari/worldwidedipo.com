import Link from 'next/link';

/**
 * Worldwide DIPO
 * Admin User Table
 *
 * Purpose:
 * - Server-rendered private admin user registry
 * - Compatible with Supabase Auth user objects
 * - No client-side auth/session handling
 * - No mutation/action endpoints inside this presentation component
 * - Responsive desktop table + compact mobile cards
 * - Safe display normalization
 *
 * Expected props:
 * {
 *   users: Array,
 *   adminMap: Map,
 *   total: number,
 *   page: number,
 *   totalPages: number,
 *   query: string,
 *   role: string,
 *   status: string,
 *   provider: string
 * }
 */

// ============================================================
// CONSTANTS
// ============================================================

const ROLE_CONFIG = {
  super_admin: {
    label: 'SUPER ADMIN',
    background: '#f3e8ff',
    color: '#7e22ce',
    border: '#e9d5ff',
  },

  admin: {
    label: 'ADMIN',
    background: '#eff6ff',
    color: '#1d4ed8',
    border: '#bfdbfe',
  },

  support: {
    label: 'SUPPORT',
    background: '#fffbeb',
    color: '#b45309',
    border: '#fde68a',
  },

  user: {
    label: 'USER',
    background: '#f8fafc',
    color: '#475569',
    border: '#e2e8f0',
  },
};

const DEFAULT_ROLE = ROLE_CONFIG.user;

// ============================================================
// SAFE NORMALIZATION
// ============================================================

function normalizeText(value, maxLength = 200) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function safeEmail(value) {
  const email = normalizeText(value, 160);

  if (!email) {
    return 'No email';
  }

  return email;
}

function safeUserId(value) {
  const id = normalizeText(value, 80);

  if (!id) {
    return 'Unknown ID';
  }

  return id;
}

// ============================================================
// USER HELPERS
// ============================================================

function getDisplayName(user) {
  const metadata = user?.user_metadata || {};

  const name =
    metadata.full_name ||
    metadata.name ||
    metadata.display_name ||
    metadata.username ||
    '';

  return normalizeText(name, 80) || 'Unnamed user';
}

function getInitials(user) {
  const name = getDisplayName(user);

  if (!name || name === 'Unnamed user') {
    return 'U';
  }

  const parts = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2);

  const initials = parts
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return initials || 'U';
}

function getProvider(user) {
  const identities = Array.isArray(user?.identities)
    ? user.identities
    : [];

  const hasGoogle = identities.some(
    (identity) =>
      identity?.provider === 'google'
  );

  if (hasGoogle) {
    return 'Google';
  }

  const hasEmail = identities.some(
    (identity) =>
      identity?.provider === 'email'
  );

  if (hasEmail) {
    return 'Email';
  }

  const fallback =
    identities[0]?.provider;

  return fallback
    ? normalizeText(fallback, 30)
    : 'Auth';
}

function getRole(user, adminMap) {
  if (!user?.id) {
    return 'user';
  }

  if (
    adminMap &&
    typeof adminMap.get === 'function'
  ) {
    return (
      adminMap.get(user.id)?.role ||
      'user'
    );
  }

  return 'user';
}

function isBanned(user) {
  if (!user?.banned_until) {
    return false;
  }

  const timestamp =
    new Date(
      user.banned_until
    ).getTime();

  return (
    Number.isFinite(timestamp) &&
    timestamp > Date.now()
  );
}

function getAccountStatus(user) {
  if (isBanned(user)) {
    return {
      label: 'BANNED',
      background: '#fef2f2',
      color: '#b91c1c',
      border: '#fecaca',
    };
  }

  if (user?.deleted_at) {
    return {
      label: 'DELETED',
      background: '#f8fafc',
      color: '#64748b',
      border: '#e2e8f0',
    };
  }

  if (user?.email_confirmed_at) {
    return {
      label: 'VERIFIED',
      background: '#ecfdf5',
      color: '#047857',
      border: '#a7f3d0',
    };
  }

  return {
    label: 'UNVERIFIED',
    background: '#fffbeb',
    color: '#b45309',
    border: '#fde68a',
  };
}

function getRoleConfig(role) {
  return (
    ROLE_CONFIG[role] ||
    DEFAULT_ROLE
  );
}

// ============================================================
// DATE HELPERS
// ============================================================

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  ).format(date);
}

function formatDateTime(value) {
  if (!value) {
    return 'Never';
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Never';
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  ).format(date);
}

// ============================================================
// URL / PAGINATION
// ============================================================

function buildUrl({
  page = 1,
  query = '',
  role = '',
  status = '',
  provider = '',
}) {
  const params =
    new URLSearchParams();

  if (query) {
    params.set(
      'query',
      normalizeText(query, 80)
    );
  }

  if (role) {
    params.set(
      'role',
      normalizeText(role, 30)
    );
  }

  if (status) {
    params.set(
      'status',
      normalizeText(status, 30)
    );
  }

  if (provider) {
    params.set(
      'provider',
      normalizeText(provider, 30)
    );
  }

  if (
    Number.isFinite(page) &&
    page > 1
  ) {
    params.set(
      'page',
      String(Math.floor(page))
    );
  }

  const queryString =
    params.toString();

  return queryString
    ? `/admin/users?${queryString}`
    : '/admin/users';
}

// ============================================================
// ICONS
// ============================================================

function ChevronIcon({
  direction = 'right',
}) {
  const rotation =
    direction === 'left'
      ? 'rotate(180deg)'
      : 'none';

  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        transform: rotation,
      }}
    >
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 21a8 8 0 0 0-16 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 3 20 6v5c0 5.2-3.3 8.7-8 10-4.7-1.3-8-4.8-8-10V6l8-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m20 20-4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ============================================================
// BADGES
// ============================================================

function RoleBadge({
  role,
}) {
  const config =
    getRoleConfig(role);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minHeight: 27,
        padding: '0 9px',
        borderRadius: 999,
        background:
          config.background,
        color: config.color,
        border:
          `1px solid ${config.border}`,
        fontSize: 9,
        fontWeight: 950,
        letterSpacing: '.07em',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background:
            config.color,
        }}
      />

      {config.label}
    </span>
  );
}

function AccountBadge({
  user,
}) {
  const config =
    getAccountStatus(user);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minHeight: 27,
        padding: '0 9px',
        borderRadius: 999,
        background:
          config.background,
        color: config.color,
        border:
          `1px solid ${config.border}`,
        fontSize: 9,
        fontWeight: 950,
        letterSpacing: '.06em',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background:
            config.color,
        }}
      />

      {config.label}
    </span>
  );
}

// ============================================================
// USER ID
// ============================================================

function UserIdDisplay({
  userId,
}) {
  const value =
    safeUserId(userId);

  return (
    <code
      title={value}
      style={{
        display: 'inline-block',
        maxWidth: 170,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        padding: '5px 7px',
        borderRadius: 7,
        background: '#f8fafc',
        border:
          '1px solid #e2e8f0',
        color: '#64748b',
        fontSize: 9,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
    >
      {value}
    </code>
  );
}

// ============================================================
// DESKTOP ROW
// ============================================================

function UserRow({
  user,
  adminMap,
}) {
  const name =
    getDisplayName(user);

  const email =
    safeEmail(user?.email);

  const initials =
    getInitials(user);

  const provider =
    getProvider(user);

  const role =
    getRole(
      user,
      adminMap
    );

  return (
    <tr
      style={{
        transition:
          'background .18s ease',
      }}
    >
      {/* USER */}
      <td style={cellStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            minWidth: 240,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: 13,
              display: 'grid',
              placeItems: 'center',
              background:
                'linear-gradient(135deg, #111827, #334155)',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: '-.02em',
              boxShadow:
                '0 8px 20px rgba(15,23,42,.13)',
            }}
          >
            {initials}
          </div>

          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                maxWidth: 230,
                overflow: 'hidden',
                textOverflow:
                  'ellipsis',
                whiteSpace:
                  'nowrap',
                color: '#111827',
                fontSize: 12,
                fontWeight: 900,
                letterSpacing:
                  '-.01em',
              }}
            >
              {name}
            </div>

            <div
              style={{
                maxWidth: 230,
                marginTop: 4,
                overflow: 'hidden',
                textOverflow:
                  'ellipsis',
                whiteSpace:
                  'nowrap',
                color: '#64748b',
                fontSize: 10,
              }}
            >
              {email}
            </div>
          </div>
        </div>
      </td>

      {/* AUTH */}
      <td style={cellStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 27,
              height: 27,
              borderRadius: 9,
              background:
                provider === 'Google'
                  ? '#f1f5f9'
                  : '#ecfdf5',
              color:
                provider === 'Google'
                  ? '#475569'
                  : '#047857',
              fontSize: 9,
              fontWeight: 950,
            }}
          >
            {provider === 'Google'
              ? 'G'
              : 'E'}
          </span>

          <div>
            <div
              style={{
                color: '#374151',
                fontSize: 11,
                fontWeight: 850,
              }}
            >
              {provider}
            </div>

            <div
              style={{
                marginTop: 2,
                color: '#94a3b8',
                fontSize: 9,
              }}
            >
              {user?.email_confirmed_at
                ? 'Email confirmed'
                : 'Email pending'}
            </div>
          </div>
        </div>
      </td>

      {/* ROLE */}
      <td style={cellStyle}>
        <RoleBadge role={role} />
      </td>

      {/* ACCOUNT */}
      <td style={cellStyle}>
        <AccountBadge user={user} />
      </td>

      {/* CREATED */}
      <td style={cellStyle}>
        <span
          style={{
            color: '#475569',
            fontSize: 11,
            fontWeight: 700,
            whiteSpace:
              'nowrap',
          }}
        >
          {formatDate(
            user?.created_at
          )}
        </span>
      </td>

      {/* LAST SIGN IN */}
      <td style={cellStyle}>
        <span
          style={{
            color: '#64748b',
            fontSize: 10,
            fontWeight: 650,
            whiteSpace:
              'nowrap',
          }}
        >
          {formatDateTime(
            user?.last_sign_in_at
          )}
        </span>
      </td>

      {/* USER ID */}
      <td style={cellStyle}>
        <UserIdDisplay
          userId={user?.id}
        />
      </td>
    </tr>
  );
}

// ============================================================
// MOBILE CARD
// ============================================================

function MobileUserCard({
  user,
  adminMap,
}) {
  const name =
    getDisplayName(user);

  const email =
    safeEmail(user?.email);

  const initials =
    getInitials(user);

  const provider =
    getProvider(user);

  const role =
    getRole(
      user,
      adminMap
    );

  return (
    <article
      style={{
        padding: 16,
        borderBottom:
          '1px solid #eef2f7',
        background: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent:
            'space-between',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            minWidth: 0,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: 42,
              height: 42,
              borderRadius: 14,
              display: 'grid',
              placeItems: 'center',
              background:
                'linear-gradient(135deg, #111827, #334155)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 950,
            }}
          >
            {initials}
          </div>

          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow:
                  'ellipsis',
                whiteSpace:
                  'nowrap',
                color: '#111827',
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              {name}
            </div>

            <div
              style={{
                marginTop: 3,
                overflow: 'hidden',
                textOverflow:
                  'ellipsis',
                whiteSpace:
                  'nowrap',
                color: '#64748b',
                fontSize: 10,
              }}
            >
              {email}
            </div>
          </div>
        </div>

        <AccountBadge user={user} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(2, minmax(0, 1fr))',
          gap: 9,
          marginTop: 15,
        }}
      >
        <div style={mobileInfoBox}>
          <span style={mobileLabel}>
            LOGIN
          </span>

          <strong style={mobileValue}>
            {provider}
          </strong>
        </div>

        <div style={mobileInfoBox}>
          <span style={mobileLabel}>
            ROLE
          </span>

          <div
            style={{
              marginTop: 4,
            }}
          >
            <RoleBadge role={role} />
          </div>
        </div>

        <div style={mobileInfoBox}>
          <span style={mobileLabel}>
            CREATED
          </span>

          <strong style={mobileValue}>
            {formatDate(
              user?.created_at
            )}
          </strong>
        </div>

        <div style={mobileInfoBox}>
          <span style={mobileLabel}>
            LAST SIGN-IN
          </span>

          <strong style={mobileValue}>
            {formatDateTime(
              user?.last_sign_in_at
            )}
          </strong>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          padding: '9px 10px',
          borderRadius: 10,
          background: '#f8fafc',
          border:
            '1px solid #eef2f7',
        }}
      >
        <span style={mobileLabel}>
          USER ID
        </span>

        <div
          style={{
            marginTop: 5,
          }}
        >
          <UserIdDisplay
            userId={user?.id}
          />
        </div>
      </div>
    </article>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({
  hasFilters,
}) {
  return (
    <div
      style={{
        padding:
          '72px 24px',
        textAlign: 'center',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 64,
          height: 64,
          margin:
            '0 auto 18px',
          borderRadius: 20,
          display: 'grid',
          placeItems: 'center',
          background:
            'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
          color: '#64748b',
        }}
      >
        <UserIcon />
      </div>

      <h3
        style={{
          margin: 0,
          color: '#111827',
          fontSize: 21,
          fontWeight: 950,
          letterSpacing:
            '-.04em',
        }}
      >
        {hasFilters
          ? 'No matching users'
          : 'No users found'}
      </h3>

      <p
        style={{
          maxWidth: 480,
          margin:
            '10px auto 0',
          color: '#64748b',
          fontSize: 12,
          lineHeight: 1.7,
        }}
      >
        {hasFilters
          ? 'Try changing your search or filters. The private user directory is queried from the server-side authentication layer.'
          : 'There are currently no user records available in the private authentication directory.'}
      </p>

      {hasFilters ? (
        <Link
          href="/admin/users"
          style={{
            display:
              'inline-flex',
            alignItems:
              'center',
            justifyContent:
              'center',
            minHeight: 40,
            marginTop: 18,
            padding:
              '0 15px',
            borderRadius: 12,
            background:
              '#111827',
            color: '#ffffff',
            textDecoration:
              'none',
            fontSize: 11,
            fontWeight: 900,
            boxShadow:
              '0 8px 24px rgba(17,24,39,.15)',
          }}
        >
          Clear filters
        </Link>
      ) : null}
    </div>
  );
}

// ============================================================
// FILTER SUMMARY
// ============================================================

function FilterSummary({
  query,
  role,
  status,
  provider,
}) {
  const filters = [];

  if (query) {
    filters.push(
      `Search: ${normalizeText(
        query,
        40
      )}`
    );
  }

  if (role) {
    filters.push(
      `Role: ${normalizeText(
        role,
        25
      )}`
    );
  }

  if (status) {
    filters.push(
      `Status: ${normalizeText(
        status,
        25
      )}`
    );
  }

  if (provider) {
    filters.push(
      `Login: ${normalizeText(
        provider,
        25
      )}`
    );
  }

  if (!filters.length) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        flexWrap: 'wrap',
        padding:
          '10px 14px',
        borderTop:
          '1px solid #eef2f7',
        background:
          '#fbfcfe',
      }}
    >
      <span
        style={{
          color: '#94a3b8',
          fontSize: 9,
          fontWeight: 900,
          letterSpacing:
            '.08em',
          textTransform:
            'uppercase',
        }}
      >
        Filters
      </span>

      {filters.map(
        (filter) => (
          <span
            key={filter}
            style={{
              minHeight: 25,
              display:
                'inline-flex',
              alignItems:
                'center',
              padding:
                '0 8px',
              borderRadius: 999,
              background:
                '#f1f5f9',
              color: '#475569',
              fontSize: 9,
              fontWeight: 800,
            }}
          >
            {filter}
          </span>
        )
      )}

      <Link
        href="/admin/users"
        style={{
          marginLeft:
            'auto',
          color: '#2563eb',
          textDecoration:
            'none',
          fontSize: 9,
          fontWeight: 900,
        }}
      >
        Clear all
      </Link>
    </div>
  );
}

// ============================================================
// PAGINATION
// ============================================================

function Pagination({
  page,
  totalPages,
  query,
  role,
  status,
  provider,
}) {
  if (
    totalPages <= 1
  ) {
    return null;
  }

  const currentPage =
    Math.max(
      1,
      Math.min(
        page || 1,
        totalPages
      )
    );

  const previousPage =
    Math.max(
      1,
      currentPage - 1
    );

  const nextPage =
    Math.min(
      totalPages,
      currentPage + 1
    );

  const start =
    Math.max(
      1,
      currentPage - 2
    );

  const end =
    Math.min(
      totalPages,
      currentPage + 2
    );

  const pages = [];

  for (
    let index = start;
    index <= end;
    index += 1
  ) {
    pages.push(index);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent:
          'space-between',
        gap: 14,
        flexWrap: 'wrap',
        padding:
          '15px 18px',
        borderTop:
          '1px solid #eef2f7',
        background:
          '#fbfcfe',
      }}
    >
      <div
        style={{
          color: '#64748b',
          fontSize: 10,
          fontWeight: 750,
        }}
      >
        Page{' '}
        <strong
          style={{
            color: '#111827',
          }}
        >
          {currentPage}
        </strong>{' '}
        of{' '}
        <strong
          style={{
            color: '#111827',
          }}
        >
          {totalPages}
        </strong>
      </div>

      <nav
        aria-label="User directory pagination"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <Link
          aria-label="Previous page"
          aria-disabled={
            currentPage === 1
          }
          href={buildUrl({
            page: previousPage,
            query,
            role,
            status,
            provider,
          })}
          style={{
            ...pageButtonStyle,
            opacity:
              currentPage === 1
                ? 0.4
                : 1,
            pointerEvents:
              currentPage === 1
                ? 'none'
                : 'auto',
          }}
        >
          <ChevronIcon
            direction="left"
          />
        </Link>

        {start > 1 ? (
          <>
            <Link
              href={buildUrl({
                page: 1,
                query,
                role,
                status,
                provider,
              })}
              style={pageNumberStyle}
            >
              1
            </Link>

            {start > 2 ? (
              <span
                style={{
                  padding:
                    '0 3px',
                  color:
                    '#94a3b8',
                  fontSize: 11,
                }}
              >
                …
              </span>
            ) : null}
          </>
        ) : null}

        {pages.map(
          (pageNumber) => (
            <Link
              key={pageNumber}
              href={buildUrl({
                page:
                  pageNumber,
                query,
                role,
                status,
                provider,
              })}
              aria-current={
                pageNumber ===
                currentPage
                  ? 'page'
                  : undefined
              }
              style={{
                ...pageNumberStyle,
                background:
                  pageNumber ===
                  currentPage
                    ? '#111827'
                    : '#ffffff',
                color:
                  pageNumber ===
                  currentPage
                    ? '#ffffff'
                    : '#475569',
                borderColor:
                  pageNumber ===
                  currentPage
                    ? '#111827'
                    : '#e2e8f0',
              }}
            >
              {pageNumber}
            </Link>
          )
        )}

        {end < totalPages ? (
          <>
            {end <
            totalPages - 1 ? (
              <span
                style={{
                  padding:
                    '0 3px',
                  color:
                    '#94a3b8',
                  fontSize: 11,
                }}
              >
                …
              </span>
            ) : null}

            <Link
              href={buildUrl({
                page:
                  totalPages,
                query,
                role,
                status,
                provider,
              })}
              style={pageNumberStyle}
            >
              {totalPages}
            </Link>
          </>
        ) : null}

        <Link
          aria-label="Next page"
          aria-disabled={
            currentPage ===
            totalPages
          }
          href={buildUrl({
            page: nextPage,
            query,
            role,
            status,
            provider,
          })}
          style={{
            ...pageButtonStyle,
            opacity:
              currentPage ===
              totalPages
                ? 0.4
                : 1,
            pointerEvents:
              currentPage ===
              totalPages
                ? 'none'
                : 'auto',
          }}
        >
          <ChevronIcon />
        </Link>
      </nav>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function UserTable({
  users = [],
  adminMap = new Map(),
  total = 0,
  page = 1,
  totalPages = 1,
  query = '',
  role = '',
  status = '',
  provider = '',
}) {
  const safeUsers =
    Array.isArray(users)
      ? users
      : [];

  const safeTotal =
    Number.isFinite(
      Number(total)
    )
      ? Number(total)
      : safeUsers.length;

  const safePage =
    Number.isFinite(
      Number(page)
    )
      ? Math.max(
          1,
          Number(page)
        )
      : 1;

  const safeTotalPages =
    Number.isFinite(
      Number(totalPages)
    )
      ? Math.max(
          1,
          Number(totalPages)
        )
      : 1;

  const hasFilters =
    Boolean(
      query ||
      role ||
      status ||
      provider
    );

  return (
    <>
      <style>{`
        .dipo-user-table-desktop {
          display: block;
        }

        .dipo-user-table-mobile {
          display: none;
        }

        .dipo-user-table-row:hover {
          background: #fafcff;
        }

        .dipo-user-table-focus:focus-visible {
          outline: 3px solid rgba(37, 99, 235, .22);
          outline-offset: 2px;
        }

        @media (max-width: 760px) {
          .dipo-user-table-desktop {
            display: none;
          }

          .dipo-user-table-mobile {
            display: block;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-user-table-row {
            transition: none !important;
          }
        }
      `}</style>

      <section
        aria-label="User registry"
        style={{
          overflow: 'hidden',
          border:
            '1px solid #e5e7eb',
          borderRadius: 26,
          background:
            '#ffffff',
          boxShadow:
            '0 18px 55px rgba(15,23,42,.055)',
        }}
      >
        {/* ==================================================
            HEADER
        =================================================== */}

        <header
          style={{
            display: 'flex',
            alignItems:
              'center',
            justifyContent:
              'space-between',
            gap: 14,
            flexWrap:
              'wrap',
            padding:
              '19px 20px',
            borderBottom:
              '1px solid #eef2f7',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems:
                'center',
              gap: 11,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                display: 'grid',
                placeItems:
                  'center',
                background:
                  '#f1f5f9',
                color: '#334155',
              }}
            >
              <UserIcon />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  color:
                    '#111827',
                  fontSize: 17,
                  fontWeight:
                    950,
                  letterSpacing:
                    '-.035em',
                }}
              >
                User registry
              </h2>

              <p
                style={{
                  margin:
                    '4px 0 0',
                  color:
                    '#94a3b8',
                  fontSize: 10,
                }}
              >
                Private authentication directory
              </p>
            </div>
          </div>

          <div
            style={{
              display:
                'inline-flex',
              alignItems:
                'center',
              gap: 7,
              minHeight: 31,
              padding:
                '0 10px',
              borderRadius: 999,
              background:
                '#f8fafc',
              border:
                '1px solid #e2e8f0',
              color:
                '#475569',
              fontSize: 10,
              fontWeight:
                850,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius:
                  '50%',
                background:
                  '#10b981',
              }}
            />

            {safeTotal}{' '}
            {safeTotal === 1
              ? 'user'
              : 'users'}
          </div>
        </header>

        {/* ==================================================
            FILTER SUMMARY
        =================================================== */}

        <FilterSummary
          query={query}
          role={role}
          status={status}
          provider={provider}
        />

        {/* ==================================================
            EMPTY STATE
        =================================================== */}

        {safeUsers.length ===
        0 ? (
          <EmptyState
            hasFilters={
              hasFilters
            }
          />
        ) : (
          <>
            {/* ==============================================
                DESKTOP
            =============================================== */}

            <div className="dipo-user-table-desktop">
              <div
                style={{
                  overflowX:
                    'auto',
                  WebkitOverflowScrolling:
                    'touch',
                }}
              >
                <table
                  style={{
                    width:
                      '100%',
                    minWidth:
                      1060,
                    borderCollapse:
                      'collapse',
                  }}
                >
                  <caption
                    style={{
                      position:
                        'absolute',
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin:
                        '-1px',
                      overflow:
                        'hidden',
                      clip:
                        'rect(0, 0, 0, 0)',
                      whiteSpace:
                        'nowrap',
                      border: 0,
                    }}
                  >
                    Worldwide DIPO private user
                    registry
                  </caption>

                  <thead>
                    <tr
                      style={{
                        background:
                          '#f8fafc',
                      }}
                    >
                      {[
                        'User',
                        'Authentication',
                        'Role',
                        'Account',
                        'Created',
                        'Last sign-in',
                        'User ID',
                      ].map(
                        (
                          heading
                        ) => (
                          <th
                            key={
                              heading
                            }
                            scope="col"
                            style={{
                              padding:
                                '12px 16px',
                              textAlign:
                                'left',
                              borderBottom:
                                '1px solid #eef2f7',
                              color:
                                '#64748b',
                              fontSize: 9,
                              fontWeight:
                                950,
                              letterSpacing:
                                '.09em',
                              textTransform:
                                'uppercase',
                              whiteSpace:
                                'nowrap',
                            }}
                          >
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {safeUsers.map(
                      (
                        user
                      ) => (
                        <tr
                          key={
                            user?.id ||
                            Math.random()
                          }
                          className="dipo-user-table-row"
                          style={{
                            transition:
                              'background .18s ease',
                          }}
                        >
                          <UserRow
                            user={user}
                            adminMap={
                              adminMap
                            }
                          />
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ==============================================
                MOBILE
            =============================================== */}

            <div className="dipo-user-table-mobile">
              {safeUsers.map(
                (user) => (
                  <MobileUserCard
                    key={
                      user?.id ||
                      `user-${safeUsers.indexOf(
                        user
                      )}`
                    }
                    user={user}
                    adminMap={
                      adminMap
                    }
                  />
                )
              )}
            </div>
          </>
        )}

        {/* ==================================================
            PAGINATION
        =================================================== */}

        {safeUsers.length >
        0 ? (
          <Pagination
            page={
              safePage
            }
            totalPages={
              safeTotalPages
            }
            query={query}
            role={role}
            status={status}
            provider={
              provider
            }
          />
        ) : null}
      </section>
    </>
  );
}

// ============================================================
// SHARED STYLE OBJECTS
// ============================================================

const cellStyle = {
  padding:
    '16px 16px',
  borderBottom:
    '1px solid #f0f2f5',
  verticalAlign:
    'middle',
};

const mobileInfoBox = {
  minWidth: 0,
  padding:
    '10px 11px',
  borderRadius: 11,
  background:
    '#f8fafc',
  border:
    '1px solid #eef2f7',
};

const mobileLabel = {
  display: 'block',
  color: '#94a3b8',
  fontSize: 8,
  fontWeight: 950,
  letterSpacing: '.09em',
  textTransform: 'uppercase',
};

const mobileValue = {
  display: 'block',
  marginTop: 4,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: '#334155',
  fontSize: 10,
  fontWeight: 850,
};

const pageButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  background: '#ffffff',
  color: '#475569',
  textDecoration: 'none',
};

const pageNumberStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 34,
  height: 34,
  padding: '0 8px',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  background: '#ffffff',
  color: '#475569',
  textDecoration: 'none',
  fontSize: 10,
  fontWeight: 900,
};