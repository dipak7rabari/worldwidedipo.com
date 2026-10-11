'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import AuthLoading from '@/components/auth/AuthLoading';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      if (!user) {
        router.replace('/auth/sign-in');
        return;
      }

      setAuthenticated(true);
      setChecking(false);
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking || !authenticated) {
    return <AuthLoading />;
  }

  return children;
}