const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const ALLOWED_EXTENSIONS =
  new Set([
    'jpg',
    'jpeg',
    'png',
    'webp',
  ]);

export function validateImageFile(file) {
  if (!file) {
    return {
      valid: false,
      error: 'Image file is required.',
    };
  }

  if (!(file instanceof File)) {
    return {
      valid: false,
      error: 'Invalid file.',
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      error: 'The selected file is empty.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'Image must be 5 MB or smaller.',
    };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      valid: false,
      error:
        'Only JPG, PNG and WEBP images are supported.',
    };
  }

  const name =
    file.name || '';

  const extension =
    name
      .split('.')
      .pop()
      ?.toLowerCase();

  if (
    !extension ||
    !ALLOWED_EXTENSIONS.has(extension)
  ) {
    return {
      valid: false,
      error:
        'The file extension is not supported.',
    };
  }

  return {
    valid: true,
  };
}

export function getSafeImageExtension(
  file,
) {
  const type =
    file?.type;

  switch (type) {
    case 'image/jpeg':
      return 'jpg';

    case 'image/png':
      return 'png';

    case 'image/webp':
      return 'webp';

    default:
      throw new Error(
        'Unsupported image type.',
      );
  }
}

export const IMAGE_UPLOAD_LIMITS = {
  maxBytes: MAX_FILE_SIZE,

  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
  ],

  allowedExtensions: [
    'jpg',
    'jpeg',
    'png',
    'webp',
  ],
};


/**
 * FIX: Asli file bytes (magic bytes) check.
 *
 * validateImageFile() sirf browser ka bataya hua MIME/extension dekhta hai.
 * Ye function file ke pehle bytes padh ke confirm karta hai ki file sach mein
 * JPEG / PNG / WEBP hai aur declared type se match karti hai.
 */
export async function validateImageSignature(file) {
  try {
    const head = new Uint8Array(
      await file.slice(0, 12).arrayBuffer(),
    );

    const isJpeg =
      head[0] === 0xff &&
      head[1] === 0xd8 &&
      head[2] === 0xff;

    const isPng =
      head[0] === 0x89 &&
      head[1] === 0x50 &&
      head[2] === 0x4e &&
      head[3] === 0x47 &&
      head[4] === 0x0d &&
      head[5] === 0x0a &&
      head[6] === 0x1a &&
      head[7] === 0x0a;

    const isWebp =
      head[0] === 0x52 && // R
      head[1] === 0x49 && // I
      head[2] === 0x46 && // F
      head[3] === 0x46 && // F
      head[8] === 0x57 && // W
      head[9] === 0x45 && // E
      head[10] === 0x42 && // B
      head[11] === 0x50; // P

    const matches =
      (file.type === 'image/jpeg' && isJpeg) ||
      (file.type === 'image/png' && isPng) ||
      (file.type === 'image/webp' && isWebp);

    if (!matches) {
      return {
        valid: false,
        error:
          'The file content does not match a valid JPG, PNG or WEBP image.',
      };
    }

    return { valid: true };
  } catch {
    return {
      valid: false,
      error: 'Unable to read the uploaded image.',
    };
  }
}