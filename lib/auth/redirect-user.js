import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/get-user';

export async function redirectAuthenticatedUser() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return null;
}