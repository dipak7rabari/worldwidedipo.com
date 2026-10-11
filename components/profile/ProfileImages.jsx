'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import MediaGallery from '@/components/identity/MediaGallery';

import PlanBadge, {
  planKey,
} from '@/components/identity/PlanBadge';

import {
  getPlanImageLimit,
} from '@/config/plans';

import styles from './ProfileImages.module.css';

const EMPTY_GALLERY = [];

export default function ProfileImages({
  profile,
  plan = profile?.plan,
  gallery = profile?.gallery || EMPTY_GALLERY,
  avatarUrl = profile?.avatar_url || '',
  onUploaded,
}) {
  const router = useRouter();

  const [media, setMedia] = useState({
    avatar_url: avatarUrl,
    gallery,
  });

  const [pending, setPending] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const busy = useRef(false);
  const pendingUrl = useRef(null);

  const limit = getPlanImageLimit(
    planKey(plan),
  );

  useEffect(() => {
    setMedia({
      avatar_url: avatarUrl,
      gallery: Array.isArray(gallery)
        ? gallery
        : [],
    });
  }, [avatarUrl, gallery]);

  useEffect(() => {
    return () => {
      if (pendingUrl.current) {
        URL.revokeObjectURL(pendingUrl.current);
      }
    };
  }, []);

  async function upload(file, type) {
    if (!file || busy.current) {
      return;
    }

    setError('');
    setSuccess('');

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Choose a JPG, PNG or WEBP image.',
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'Choose an image smaller than 5 MB.',
      );
      return;
    }

    if (
      type === 'gallery' &&
      media.gallery.length >= limit
    ) {
      setError(
        `Your plan allows ${limit} gallery images.`,
      );
      return;
    }

    busy.current = true;

    const preview = URL.createObjectURL(file);
    pendingUrl.current = preview;

    setPending({
      type,
      preview,
    });

    try {
      const body = new FormData();

      body.append('file', file);
      body.append('type', type);

      const response = await fetch(
        '/api/profile/upload',
        {
          method: 'POST',
          credentials: 'same-origin',
          body,
        },
      );

      const result = await response.json();

      if (
        !response.ok ||
        !result.media ||
        !Array.isArray(result.media.gallery)
      ) {
        throw new Error(
          result.error ||
            'Unable to save your photo. Please try again.',
        );
      }

      setMedia(result.media);

      setSuccess(
        type === 'avatar'
          ? 'Profile photo saved.'
          : 'Gallery image saved.',
      );

      onUploaded?.(
        result.image,
        type,
        result.media,
      );

      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError.message ||
          'Upload failed. Please try again.',
      );
    } finally {
      busy.current = false;
      setPending(null);

      URL.revokeObjectURL(preview);
      pendingUrl.current = null;
    }
  }

  const displayedAvatar =
    pending?.type === 'avatar'
      ? pending.preview
      : media.avatar_url;

  return (
    <div className={styles.media}>
      <div className={styles.heading}>
        <div>
          <h3>Your photos</h3>
          <p>
            JPG, PNG or WEBP · Up to 5 MB each
          </p>
        </div>

        <PlanBadge plan={plan} />
      </div>

      <div className={styles.avatarRow}>
        <div className={styles.avatar}>
          {displayedAvatar ? (
            <img
              src={displayedAvatar}
              alt="Your profile photo"
            />
          ) : (
            <span>
              {profile?.name
                ?.charAt(0)
                ?.toUpperCase() || 'D'}
            </span>
          )}
        </div>

        <div>
          <strong>Profile photo</strong>
          <p>Your identity across DIPO.</p>

          <label className={styles.upload}>
            {displayedAvatar
              ? 'Change photo'
              : 'Upload photo'}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={Boolean(pending)}
              onChange={(event) => {
                upload(
                  event.target.files?.[0],
                  'avatar',
                );

                event.target.value = '';
              }}
            />
          </label>
        </div>
      </div>

      <div className={styles.heading}>
        <div>
          <h3>Gallery</h3>

          <p aria-live="polite">
            {media.gallery.length}/{limit}
            {' '}images uploaded ·{' '}
            {Math.max(
              0,
              limit - media.gallery.length,
            )}
            {' '}remaining
          </p>
        </div>

        <label className={styles.upload}>
          ＋ Add image

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={
              Boolean(pending) ||
              media.gallery.length >= limit
            }
            onChange={(event) => {
              upload(
                event.target.files?.[0],
                'gallery',
              );

              event.target.value = '';
            }}
          />
        </label>
      </div>

      <progress
        className={styles.progress}
        value={media.gallery.length}
        max={limit}
        aria-label={`${media.gallery.length} of ${limit} gallery images used`}
      />

      <MediaGallery
        gallery={media.gallery}
        name={profile?.name}
      />

      {!media.gallery.length && !pending && (
        <div className={styles.empty}>
          Show your work, products or favourite moments.
          <br />
          Your uploaded images will appear here.
        </div>
      )}

      {pending && (
        <div
          className={styles.pending}
          role="status"
        >
          {pending.type === 'gallery' && (
            <img
              src={pending.preview}
              alt="Image being uploaded"
            />
          )}

          Uploading and saving…
        </div>
      )}

      {error && (
        <p
          className={styles.error}
          role="alert"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          className={styles.success}
          role="status"
        >
          ✓ {success}
        </p>
      )}
    </div>
  );
}