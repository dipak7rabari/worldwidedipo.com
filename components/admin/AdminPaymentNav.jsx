import Link from 'next/link';

export default function AdminPaymentNav() {
  return (
    <nav
      className="admin-payment-nav"
      aria-label="Admin navigation"
    >
      <Link href="/admin">
        Admin Dashboard
      </Link>

      <Link
        href="/admin/payments"
        aria-current="page"
      >
        Payments
      </Link>

      <Link href="/admin/security">
        Security / MFA
      </Link>

      <Link href="/admin/audit">
        Audit Logs
      </Link>
    </nav>
  );
}