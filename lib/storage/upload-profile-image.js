import {
  getProfileMediaPath,
} from './storage-policy';

import {
  getSafeImageExtension,
} from './image-validation';

export async function uploadProfileImage({
  supabase,
  userId,
  file,
  type,
}) {
  const extension =
    getSafeImageExtension(
      file,
    );

  const randomPart =
    crypto.randomUUID();

  const fileName =
    `${randomPart}.${extension}`;

  const path =
    getProfileMediaPath({
      userId,
      type,
      fileName,
    });

  const {
    data,
    error,
  } =
    await supabase.storage
      .from('profile-media')
      .upload(
        path,
        file,
        {
          cacheControl:
            '31536000',
          contentType:
            file.type,
          upsert: false,
        },
      );

  if (error) {
    throw error;
  }

  const {
    data: publicUrlData,
  } =
    supabase.storage
      .from('profile-media')
      .getPublicUrl(
        data.path,
      );

  return {
    path: data.path,
    url:
      publicUrlData.publicUrl,
  };
}