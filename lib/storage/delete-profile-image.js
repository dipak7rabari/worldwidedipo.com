export async function deleteProfileImage({
  supabase,
  path,
}) {
  if (
    typeof path !== 'string' ||
    !path.trim()
  ) {
    throw new Error(
      'Storage path is required.',
    );
  }

  if (
    path.includes('..') ||
    path.startsWith('/') ||
    path.includes('\\')
  ) {
    throw new Error(
      'Invalid storage path.',
    );
  }

  const {
    error,
  } =
    await supabase.storage
      .from('profile-media')
      .remove([
        path,
      ]);

  if (error) {
    throw error;
  }

  return {
    success: true,
  };
}