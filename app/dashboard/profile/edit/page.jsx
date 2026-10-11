import { redirect } from 'next/navigation';

import ProfileEditor from '@/components/profile/ProfileEditor';
import { getMyProfile } from '@/lib/profile/get-my-profile';

export const dynamic = 'force-dynamic';

export default async function EditProfilePage() {
  const {
    user,
    profile,
  } = await getMyProfile();

  if (!user) {
    redirect(
      '/auth/login?next=/dashboard/profile/edit'
    );
  }

  if (!profile) {
    redirect('/onboarding');
  }

  return (
    <main className="profile-editor-page">
      <div className="profile-editor-container">
        <header className="profile-editor-header">
          <div>
            <p className="dashboard-eyebrow">
              Worldwide DIPO
            </p>

            <h1>Edit Your Profile</h1>

            <p>
              Apni public digital identity ko update
              aur manage karein.
            </p>
          </div>

          <a
            href="/dashboard/profile"
            className="dashboard-action-secondary"
          >
            Back to Profile
          </a>
        </header>

        <ProfileEditor profile={profile} />
      </div>
    </main>
  );
}