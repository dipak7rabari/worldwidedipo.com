import Link from 'next/link';
import { notFound } from 'next/navigation';

import PaymentReview from '@/components/admin/PaymentReview';
import { requirePaymentAdmin } from '@/lib/auth/require-admin';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Review Payment',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function PaymentReviewPage({
  params,
}) {
  const { id } = await params;

  await requirePaymentAdmin({
    nextPath: `/admin/payments/${id}`,
  });

  const supabase = await createClient();

  const { data: payment, error } =
    await supabase
      .from('payments')
      .select(
        `
          id,
          profile_id,
          user_id,
          payment_type,
          plan,
          amount,
          payment_reference,
          status,
          payer_name,
          slug_snapshot,
          created_at,
          notes
        `,
      )
      .eq('id', id)
      .maybeSingle();

  if (error) {
    throw new Error(
      'Unable to load payment.',
    );
  }

  if (!payment) {
    notFound();
  }

  if (payment.status !== 'pending') {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href="/admin/payments"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to payments
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Already Processed
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            This payment is already{' '}
            <strong>
              {payment.status}
            </strong>
            .
          </p>

          <div className="mt-5">
            <Link
              href="/admin/payments"
              className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              Back to Payment Queue
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/admin/payments"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to payments
      </Link>

      <div className="mb-8 mt-5">
        <p className="text-sm font-medium text-gray-500">
          Admin
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Review Payment
        </h1>
      </div>

      <PaymentReview
        payment={payment}
      />
    </main>
  );
}