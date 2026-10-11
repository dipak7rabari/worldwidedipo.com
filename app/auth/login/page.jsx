import { redirect } from 'next/navigation';

export default async function LoginRedirect({ searchParams }) {
  const params = await searchParams;
  const next = params?.next;

  redirect(
    next
      ? `/auth/sign-in?next=${encodeURIComponent(next)}`
      : '/auth/sign-in'
  );
}
