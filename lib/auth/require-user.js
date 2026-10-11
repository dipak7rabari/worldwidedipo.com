import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/get-user';

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  return user;
}