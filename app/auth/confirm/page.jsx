import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Confirming Sign In | Worldwide DIPO',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ConfirmPage({
  searchParams,
}) {
  const params = await searchParams;

  if (params?.error) {
    redirect(
      `/auth/error?reason=${encodeURIComponent(
        params.error,
      )}`,
    );
  }

  redirect('/dashboard');
}