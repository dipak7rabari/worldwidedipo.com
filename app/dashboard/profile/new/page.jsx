import { redirect } from 'next/navigation';

import ProfileCreateForm from '@/components/profile/ProfileCreateForm';
import { getMyProfile } from '@/lib/profile/get-my-profile';

export const dynamic = 'force-dynamic';

export default async function NewProfilePage() {
  const {
    user,
    profile,
  } = await getMyProfile();

  if (!user) {
    redirect(
      '/auth/login?next=/dashboard/profile/new'
    );
  }

  if (profile) {
    redirect('/dashboard/profile');
  }

  return (
    <main className="profile-create-page">
      <div className="profile-create-container">
        <header className="profile-create-header">
          <p className="dashboard-eyebrow">
            Worldwide DIPO
          </p>

          <h1>Create Your Digital Identity</h1>

          <p>
            Apni basic professional information add
            karke apna Personal Digital Identity Page
            create karein.
          </p>
        </header>

        <ProfileCreateForm />
      </div>
    </main>
  );
}