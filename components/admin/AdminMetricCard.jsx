// components/admin/AdminMetricCard.jsx

export default function AdminMetricCard({
  label,
  value,
  description,
  icon,
  href,
}) {
  const content = (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value ?? '—'}
          </p>

          {description ? (
            <p className="mt-2 text-sm leading-5 text-gray-500">
              {description}
            </p>
          ) : null}
        </div>

        {icon ? (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700"
            aria-hidden="true"
          >
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a
      href={href}
      className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
    >
      {content}
    </a>
  );
}