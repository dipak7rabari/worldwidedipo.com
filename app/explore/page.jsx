import {
  getInitialExploreProfiles,
} from '@/lib/explore/get-explore-profiles';

import {
  getMyProfile,
} from '@/lib/profile/get-my-profile';

import ExplorePage from '@/components/explore/ExplorePage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Explore Worldwide DIPO',

  description:
    'Discover creators, businesses, shops, brands, professionals and digital identities on Worldwide DIPO.',

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Explore Worldwide DIPO',

    description:
      'Discover creators, businesses, shops, brands, professionals and digital identities on Worldwide DIPO.',

    type: 'website',
  },
};

export default async function ExploreRoute() {
  const {
    user,
    profile: ownProfile,
  } = await getMyProfile();

  const result = await getInitialExploreProfiles({
    query: null,
    category: null,
  });

  const initialProfiles = Array.isArray(
    result?.profiles,
  )
    ? result.profiles
    : [];

  const initialDemoProfiles = Array.isArray(
    result?.demoProfiles,
  )
    ? result.demoProfiles
    : [];

  const initialHasMore = Boolean(
    result?.pagination?.hasMore,
  );

  const initialError = result?.error
    ? 'Unable to load Explore profiles.'
    : null;

  return (
    <ExplorePage
      isSignedIn={Boolean(user)}
      ownSlug={ownProfile?.slug || null}
      initialProfiles={initialProfiles}
      initialDemoProfiles={initialDemoProfiles}
      initialHasMore={initialHasMore}
      initialError={initialError}
    />
  );
}