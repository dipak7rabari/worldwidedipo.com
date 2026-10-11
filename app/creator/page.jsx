import { redirect } from 'next/navigation';
import { getCreatorOwner } from '@/lib/creator/server';
import CreatorEditor from '@/components/creator/CreatorEditor';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Creator Studio | Worldwide DIPO', robots: { index: false, follow: false } };
export default async function CreatorStudio() {
  const { user, profile, creator } = await getCreatorOwner();
  if (!user) redirect('/auth/sign-in?next=/creator');
  if (!profile) redirect('/onboarding');
  return <CreatorEditor profile={profile} initial={creator} />;
}
