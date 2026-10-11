'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAVIGATION = [
  {
    label: 'Overview',
    href: '/admin',
    icon: '⌂',
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: '♙',
  },
  {
    label: 'Profiles',
    href: '/admin/profiles',
    icon: '▣',
  },
  {
    label: 'Payments',
    href: '/admin/payments',
    icon: '₹',
  },
  {
    label: 'Audit Log',
    href: '/admin/audit',
    icon: '◷',
  },
  {
    label: 'Security',
    href: '/admin/security',
    icon: '◇',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: '⚙',
  },
];

function isActiveRoute(pathname, href) {
  if (href === '/admin') {
    return pathname === '/admin';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar({
  brand = 'Worldwide DIPO',
  subtitle = 'Admin Console',
  className = '',
}) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        'flex min-h-full w-full flex-col rounded-3xl border border-slate-200',
        'bg-white p-4 text-slate-900 shadow-sm',
        className,
      ].join(' ')}
      aria-label="Admin navigation"
    >
      <div className="mb-7 flex items-center gap-3 px-2 pt-2">
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-black tracking-tight text-white"
          aria-hidden="true"
        >
          WD
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold tracking-tight">
            {brand}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        Workspace
      </div>

      <nav className="flex flex-col gap-1">
        {NAVIGATION.map((item) => {
          const active = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={[
                'group flex min-h-11 items-center gap-3 rounded-xl px-3',
                'text-sm font-semibold transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                active
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
              ].join(' ')}
            >
              <span
                className={[
                  'grid h-8 w-8 shrink-0 place-items-center rounded-lg text-base',
                  active
                    ? 'bg-white/10 text-white'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-white',
                ].join(' ')}
                aria-hidden="true"
              >
                {item.icon}
              </span>

              <span className="min-w-0 flex-1 truncate">
                {item.label}
              </span>

              {active && (
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            <p className="text-xs font-bold text-emerald-900">
              Admin workspace
            </p>
          </div>

          <p className="mt-2 text-xs leading-5 text-emerald-800">
            Use the secure admin pages to review platform activity and
            manage authorized operations.
          </p>
        </div>

        <p className="px-2 pt-4 text-[10px] font-medium text-slate-400">
          Worldwide DIPO · Admin
        </p>
      </div>
    </aside>
  );
}

/**
 * AdminStats
 *
 * Usage:
 * <AdminStats
 *   stats={{
 *     users: 120,
 *     profiles: 85,
 *     pendingPayments: 4,
 *     revenue: 25000,
 *   }}
 * />
 *
 * Pass actual values from your secured server-side admin page.
 * This component does not fetch or calculate private admin data.
 */

const STAT_DEFINITIONS = [
  {
    key: 'users',
    label: 'Total users',
    description: 'Registered accounts',
    icon: '♙',
    accent: 'blue',
    format: 'number',
  },
  {
    key: 'profiles',
    label: 'DIPO profiles',
    description: 'Profiles on the platform',
    icon: '▣',
    accent: 'violet',
    format: 'number',
  },
  {
    key: 'pendingPayments',
    label: 'Pending payments',
    description: 'Awaiting manual review',
    icon: '₹',
    accent: 'amber',
    format: 'number',
  },
  {
    key: 'revenue',
    label: 'Verified revenue',
    description: 'Confirmed payment total',
    icon: '↗',
    accent: 'green',
    format: 'currency',
  },
];

const ACCENT_STYLES = {
  blue: {
    icon: 'bg-blue-50 text-blue-700 ring-blue-100',
    dot: 'bg-blue-500',
  },
  violet: {
    icon: 'bg-violet-50 text-violet-700 ring-violet-100',
    dot: 'bg-violet-500',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-700 ring-amber-100',
    dot: 'bg-amber-500',
  },
  green: {
    icon: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    dot: 'bg-emerald-500',
  },
};

function formatStatValue(value, format) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return '—';
  }

  if (format === 'currency') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(number);
  }

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(number);
}

export function AdminStats({
  stats = {},
  loading = false,
  className = '',
}) {
  return (
    <section
      className={className}
      aria-label="Admin statistics"
      aria-busy={loading}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_DEFINITIONS.map((definition) => {
          const accent =
            ACCENT_STYLES[definition.accent] ||
            ACCENT_STYLES.blue;

          const value = loading
            ? '…'
            : formatStatValue(
                stats[definition.key],
                definition.format,
              );

          return (
            <article
              key={definition.key}
              className={[
                'group relative overflow-hidden rounded-2xl border border-slate-200',
                'bg-white p-5 shadow-sm transition duration-200',
                'hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                    {definition.label}
                  </p>

                  <p
                    className={[
                      'mt-4 break-words text-2xl font-black tracking-tight text-slate-950',
                      loading ? 'animate-pulse' : '',
                    ].join(' ')}
                  >
                    {value}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {definition.description}
                  </p>
                </div>

                <div
                  className={[
                    'grid h-11 w-11 shrink-0 place-items-center rounded-xl',
                    'text-lg font-bold ring-1 ring-inset',
                    accent.icon,
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {definition.icon}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-3">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${accent.dot}`}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-medium text-slate-500">
                  {loading ? 'Loading latest data' : 'Current overview'}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}