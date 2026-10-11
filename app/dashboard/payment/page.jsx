import { redirect } from 'next/navigation';

import PaymentForm from '@/components/payment/PaymentForm';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Payment | Worldwide DIPO',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPaymentPage({
  searchParams,
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const params = await searchParams;

  const requestedPlan =
    typeof params?.plan === 'string'
      ? params.plan
      : 'Starter';

  const requestedType =
    params?.type === 'renewal'
      ? 'renewal'
      : 'initial';

  const allowedPlans = [
    'Starter',
    'Pro',
    'Elite',
  ];

  const plan = allowedPlans.includes(
    requestedPlan,
  )
    ? requestedPlan
    : 'Starter';

  const { data: profile, error } =
    await supabase
      .from('profiles')
      .select(
        'id,name,slug,status,plan,expires_at',
      )
      .eq('owner_id', user.id)
      .maybeSingle();

  if (error) {
    throw new Error(
      'Unable to load your profile.',
    );
  }

  if (!profile) {
    redirect('/dashboard/profile');
  }

  if (
    requestedType === 'renewal' &&
    profile.status !== 'active'
  ) {
    redirect('/dashboard');
  }

  if (
    requestedType === 'initial' &&
    profile.status !== 'draft'
  ) {
    redirect('/dashboard');
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-500">
          Worldwide DIPO
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Complete Payment
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Pay using the official UPI ID or QR code,
          then submit your UTR / Payment Reference for
          manual verification.
        </p>
      </div>

      <PaymentForm
        profileId={profile.id}
        plan={plan}
        paymentType={requestedType}
      />
    </main>
  );
}