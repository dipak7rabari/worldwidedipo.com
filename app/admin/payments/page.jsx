import '@/components/admin/AdminPayment.css';
import { redirect } from 'next/navigation';

import {
  requirePaymentAdmin,
} from '@/lib/auth/require-admin';

import {
  getPendingPayments,
} from '@/lib/admin/get-pending-payments';

import PaymentQueue from '@/components/admin/PaymentQueue';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  
  try {
    await requirePaymentAdmin();
  } catch {
    redirect(
      '/admin/login?next=/admin/payments'
    );
  }

  const result =
    await getPendingPayments();

  if (!result.authorized) {
    redirect(
      '/admin/login?next=/admin/payments'
    );
  }

  return (
    <main className="admin-payments-page">
      <div className="admin-payments-container">
        <header className="admin-payments-header">
          <div>
            <p className="dashboard-eyebrow">
              Worldwide DIPO Admin
            </p>

            <h1>
              Payment Verification
            </h1>

            <p>
              Actual payment verify karke hi
              profile activate karein.
            </p>
          </div>

          <div className="admin-security-badge">
            MFA Protected
          </div>
        </header>

        {result.error && (
          <div
            className="admin-payment-error"
            role="alert"
          >
            {result.error}
          </div>
        )}

        <PaymentQueue
          initialPayments={
            result.payments
          }
        />
      </div>
    </main>
  );
}