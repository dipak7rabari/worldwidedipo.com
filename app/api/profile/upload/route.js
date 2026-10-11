import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

import {
  validateImageFile,
  validateImageSignature,
} from '@/lib/storage/image-validation';

import {
  getImageLimitForPlan,
} from '@/lib/storage/storage-policy';

import {
  uploadProfileImage,
} from '@/lib/storage/upload-profile-image';

import { checkOrigin } from '@/lib/security/origin-check';

import {
  applyApiSecurityHeaders,
  applyNoStore,
} from '@/lib/security/security-headers';

import {
  checkRateLimitAsync,
  getRequestRateLimitKey,
} from '@/lib/security/rate-limit';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

const MAX_MULTIPART_BODY_SIZE =
  6 * 1024 * 1024;

const RATE_LIMIT_MAX = 10;

const RATE_LIMIT_WINDOW_MS =
  60 * 1000;

const ALLOWED_TYPES = new Set([
  'avatar',
  'gallery',
]);

function jsonResponse(
  data,
  status = 200,
) {
  const response =
    NextResponse.json(
      data,
      { status },
    );

  applyApiSecurityHeaders(
    response,
  );

  applyNoStore(response);

  return response;
}

function hasValidContentLength(
  request,
) {
  const raw =
    request.headers.get(
      'content-length',
    );

  if (!raw) {
    return true;
  }

  const length =
    Number(raw);

  if (
    !Number.isFinite(length) ||
    length < 0
  ) {
    return false;
  }

  return (
    length <=
    MAX_MULTIPART_BODY_SIZE
  );
}

export async function POST(
  request,
) {
  try {
    /*
     * --------------------------------------------------
     * 1. Origin protection
     * --------------------------------------------------
     */

    const originResult =
      checkOrigin(request);

    if (
      !originResult.valid
    ) {
      return jsonResponse(
        {
          error:
            'Invalid request origin.',
        },
        403,
      );
    }

    /*
     * --------------------------------------------------
     * 2. Request-size protection
     * --------------------------------------------------
     */

    if (
      !hasValidContentLength(
        request,
      )
    ) {
      return jsonResponse(
        {
          error:
            'Upload request is too large.',
        },
        413,
      );
    }

    /*
     * --------------------------------------------------
     * 3. Rate limiting
     * --------------------------------------------------
     */

    const rateLimit =
      await checkRateLimitAsync(
        getRequestRateLimitKey(
          request,
          'profile-upload',
        ),
        {
          maxRequests:
            RATE_LIMIT_MAX,
          windowMs:
            RATE_LIMIT_WINDOW_MS,
        },
      );

    if (
      !rateLimit.allowed
    ) {
      const response =
        jsonResponse(
          {
            error:
              'Too many upload attempts. Please try again later.',
          },
          429,
        );

      if (
        Number.isFinite(
          rateLimit.retryAfter,
        )
      ) {
        response.headers.set(
          'Retry-After',
          String(
            rateLimit.retryAfter,
          ),
        );
      }

      return response;
    }

    /*
     * --------------------------------------------------
     * 4. Authentication
     * --------------------------------------------------
     */

    const supabase =
      await createClient();

    const {
      data: {
        user,
      },
      error:
        userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      return jsonResponse(
        {
          error:
            'Authentication required.',
        },
        401,
      );
    }

    /*
     * --------------------------------------------------
     * 5. Multipart form validation
     * --------------------------------------------------
     */

    let formData;

    try {
      formData =
        await request.formData();
    } catch {
      return jsonResponse(
        {
          error:
            'Invalid upload request.',
        },
        400,
      );
    }

    const file =
      formData.get('file');

    const type =
      formData.get('type');

    if (
      typeof type !==
        'string' ||
      !ALLOWED_TYPES.has(
        type,
      )
    ) {
      return jsonResponse(
        {
          error:
            'Invalid image type.',
        },
        400,
      );
    }

    /*
     * --------------------------------------------------
     * 6. Image validation
     * --------------------------------------------------
     *
     * Existing validator enforces:
     * - File object
     * - non-empty file
     * - max 5 MB
     * - JPG / PNG / WEBP MIME
     * - valid extension
     */

    const validation =
      validateImageFile(
        file,
      );

    if (
      !validation.valid
    ) {
      return jsonResponse(
        {
          error:
            validation.error,
        },
        400,
      );
    }

    /*
     * FIX: Asli bytes check (declared MIME par bharosa nahi).
     */
    const signature =
      await validateImageSignature(
        file,
      );

    if (
      !signature.valid
    ) {
      return jsonResponse(
        {
          error:
            signature.error,
        },
        400,
      );
    }

    /*
     * --------------------------------------------------
     * 7. Owner profile lookup
     * --------------------------------------------------
     *
     * IMPORTANT:
     *
     * The client never supplies profile_id.
     * The profile is resolved exclusively from the
     * authenticated Supabase user.
     *
     * This prevents:
     *
     * POST /upload
     * profileId = someone-elses-profile
     *
     * attacks.
     */

    const {
      data: profile,
      error:
        profileError,
    } =
      await supabase
        .from('profiles')
        .select(
          'id, plan, status, gallery',
        )
        .eq(
          'owner_id',
          user.id,
        )
        .maybeSingle();

    if (
      profileError
    ) {
      console.error(
        'Profile lookup failed:',
        profileError,
      );

      return jsonResponse(
        {
          error:
            'Unable to load your profile.',
        },
        500,
      );
    }

    if (
      !profile
    ) {
      return jsonResponse(
        {
          error:
            'Profile not found.',
        },
        404,
      );
    }

    /*
     * --------------------------------------------------
     * 8. Profile-state protection
     * --------------------------------------------------
     */

    if (
      profile.status ===
      'pending'
    ) {
      return jsonResponse(
        {
          error:
            'Profile editing is limited while payment verification is pending.',
        },
        409,
      );
    }

    if (
      profile.status !==
        'active' &&
      profile.status !==
        'draft'
    ) {
      return jsonResponse(
        {
          error:
            'This profile cannot accept new images right now.',
        },
        409,
      );
    }

    /*
     * --------------------------------------------------
     * 9. Gallery plan-limit enforcement
     * --------------------------------------------------
     */

    if (
      type === 'gallery'
    ) {
      const gallery =
        Array.isArray(
          profile.gallery,
        )
          ? profile.gallery
          : [];

      let imageLimit;

      try {
        imageLimit =
          getImageLimitForPlan(
            profile.plan,
          );
      } catch (error) {
        console.error(
          'Image plan limit lookup failed:',
          error,
        );

        return jsonResponse(
          {
            error:
              'Unable to validate your image allowance.',
          },
          500,
        );
      }

      if (
        gallery.length >=
        imageLimit
      ) {
        return jsonResponse(
          {
            error:
              `Your ${profile.plan} plan allows up to ${imageLimit} images.`,
          },
          409,
        );
      }
    }

    /*
     * --------------------------------------------------
     * 10. Secure storage upload
     * --------------------------------------------------
     *
     * Existing upload helper:
     * - generates crypto.randomUUID()
     * - derives path from authenticated userId
     * - uses validated extension
     * - disables upsert
     */

    const uploaded =
      await uploadProfileImage(
        {
          supabase,
          userId:
            user.id,
          file,
          type,
        },
      );

    /*
     * --------------------------------------------------
     * 11. Validate storage result before responding
     * --------------------------------------------------
     */

    if (
      !uploaded ||
      typeof uploaded !==
        'object' ||
      typeof uploaded.path !==
        'string' ||
      typeof uploaded.url !==
        'string'
    ) {
      console.error(
        'Invalid upload result.',
      );

      return jsonResponse(
        {
          error:
            'Image upload could not be completed.',
        },
        500,
      );
    }

    /*
     * --------------------------------------------------
     * 12. Safe response
     * --------------------------------------------------
     */
// Save the uploaded object to the authenticated owner's profile.
// The RPC locks the profile row before appending gallery images.
const {
  data: savedMedia,
  error: saveError,
} = await supabase.rpc(
  'save_my_profile_media',
  {
    p_type: type,
    p_path: uploaded.path,
    p_url: uploaded.url,
  },
);

if (saveError || !savedMedia) {
  await supabase.storage
    .from('profile-media')
    .remove([uploaded.path]);

  console.error(
    'Profile media save failed:',
    saveError?.message,
  );

  return jsonResponse(
    {
      error:
        'Photo could not be saved to your profile. Please refresh and try again.',
    },
    409,
  );
}

// Remove the previous owned avatar only after the new one is saved.
const publicPrefix = supabase.storage
  .from('profile-media')
  .getPublicUrl('')
  .data.publicUrl;

const oldUrl = savedMedia.previous_avatar_url;

if (
  type === 'avatar' &&
  typeof oldUrl === 'string' &&
  oldUrl.startsWith(publicPrefix)
) {
  const oldPath = oldUrl.slice(publicPrefix.length);

  if (
    oldPath.startsWith(`${user.id}/avatar/`) &&
    oldPath !== uploaded.path
  ) {
    await supabase.storage
      .from('profile-media')
      .remove([oldPath]);
  }
}

return jsonResponse(
  {
    success: true,

    media: {
      avatar_url: savedMedia.avatar_url,
      gallery: savedMedia.gallery,
    },

    image: {
      path: uploaded.path,
      url: uploaded.url,
    },
  },
  201,
);
    
  } catch (error) {
    /*
     * Never expose storage/Supabase internals
     * to the client.
     */

    console.error(
      'Profile image upload failed:',
      error,
    );

    return jsonResponse(
      {
        error:
          'Image upload failed. Please try again.',
      },
      500,
    );
  }
}