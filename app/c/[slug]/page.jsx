import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CreatorPublic from '@/components/creator/CreatorPublic';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
async function lookup(slug) {
  const supabase = await createClient();
  const { data } = await supabase.from('creator_pages').select('theme,instagram,images,links,profiles!inner(name,slug,avatar_url,bio,status,expires_at)').eq('profiles.slug', slug).eq('profiles.status', 'active').maybeSingle();
  if (!data || (data.profiles.expires_at && new Date(data.profiles.expires_at) <= new Date())) return null;
  return data;
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await lookup(slug);
  return data ? { title: `${data.profiles.name} | Worldwide DIPO Creator`, description: data.profiles.bio || `Links from ${data.profiles.name}`, alternates: { canonical: `/c/${slug}` } } : { title: 'Creator not found', robots: { index: false } };
}
export default async function CreatorPage({ params }) {
  const { slug } = await params;
  const data = await lookup(slug);
  if (!data) notFound();
  return <CreatorPublic creator={data} profile={data.profiles} />;
}
