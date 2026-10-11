import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  validateImageFile,
  getSafeImageExtension,
  IMAGE_UPLOAD_LIMITS,
} from '@/lib/storage/image-validation';

function makeFile(
  name,
  type,
  size = 1024
) {
  return new File(
    [
      new Uint8Array(
        Math.max(1, size)
      ),
    ],
    name,
    {
      type,
    }
  );
}

describe('security: storage and image uploads', () => {
  describe('upload limits', () => {
    it('uses the expected maximum file size', () => {
      expect(
        IMAGE_UPLOAD_LIMITS.maxBytes
      ).toBe(5 * 1024 * 1024);
    });

    it('allows only approved image MIME types', () => {
      expect(
        IMAGE_UPLOAD_LIMITS.allowedMimeTypes
      ).toEqual([
        'image/jpeg',
        'image/png',
        'image/webp',
      ]);
    });

    it('allows only approved extensions', () => {
      expect(
        IMAGE_UPLOAD_LIMITS.allowedExtensions
      ).toEqual([
        'jpg',
        'jpeg',
        'png',
        'webp',
      ]);
    });
  });

  describe('file validation', () => {
    it('accepts JPEG uploads', () => {
      expect(
        validateImageFile(
          makeFile(
            'avatar.jpg',
            'image/jpeg'
          )
        ).valid
      ).toBe(true);
    });

    it('accepts PNG uploads', () => {
      expect(
        validateImageFile(
          makeFile(
            'avatar.png',
            'image/png'
          )
        ).valid
      ).toBe(true);
    });

    it('accepts WEBP uploads', () => {
      expect(
        validateImageFile(
          makeFile(
            'avatar.webp',
            'image/webp'
          )
        ).valid
      ).toBe(true);
    });

    it('rejects missing files', () => {
      expect(
        validateImageFile(null).valid
      ).toBe(false);

      expect(
        validateImageFile(undefined).valid
      ).toBe(false);
    });

    it('rejects non-File values', () => {
      expect(
        validateImageFile({
          name: 'avatar.png',
          type: 'image/png',
          size: 100,
        }).valid
      ).toBe(false);
    });

    it('rejects empty files', () => {
      const file = makeFile(
        'empty.png',
        'image/png',
        0
      );

      expect(
        validateImageFile(file).valid
      ).toBe(false);
    });

    it('rejects files above the 5 MB limit', () => {
      const file = makeFile(
        'large.png',
        'image/png',
        5 * 1024 * 1024 + 1
      );

      const result =
        validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain(
        '5 MB'
      );
    });

    it('accepts a file exactly at the size limit', () => {
      const file = makeFile(
        'limit.png',
        'image/png',
        5 * 1024 * 1024
      );

      expect(
        validateImageFile(file).valid
      ).toBe(true);
    });

    it('rejects SVG uploads', () => {
      const result =
        validateImageFile(
          makeFile(
            'avatar.svg',
            'image/svg+xml'
          )
        );

      expect(result.valid).toBe(false);
    });

    it('rejects GIF uploads', () => {
      const result =
        validateImageFile(
          makeFile(
            'avatar.gif',
            'image/gif'
          )
        );

      expect(result.valid).toBe(false);
    });

    it('rejects executable MIME types', () => {
      const result =
        validateImageFile(
          makeFile(
            'avatar.exe',
            'application/octet-stream'
          )
        );

      expect(result.valid).toBe(false);
    });

    it('rejects mismatched MIME and extension', () => {
      const result =
        validateImageFile(
          makeFile(
            'avatar.jpg',
            'image/png'
          )
        );

      expect(result.valid).toBe(false);
    });

    it('rejects unsupported extensions', () => {
      const extensions = [
        'svg',
        'gif',
        'bmp',
        'exe',
        'html',
        'js',
        'php',
      ];

      for (const extension of extensions) {
        const result =
          validateImageFile(
            makeFile(
              `avatar.${extension}`,
              'image/png'
            )
          );

        expect(result.valid).toBe(false);
      }
    });

    it('handles uppercase allowed extensions safely', () => {
      expect(
        validateImageFile(
          makeFile(
            'avatar.PNG',
            'image/png'
          )
        ).valid
      ).toBe(true);

      expect(
        validateImageFile(
          makeFile(
            'avatar.WEBP',
            'image/webp'
          )
        ).valid
      ).toBe(true);
    });
  });

  describe('safe image extension mapping', () => {
    it('maps JPEG to jpg', () => {
      expect(
        getSafeImageExtension(
          makeFile(
            'anything.jpg',
            'image/jpeg'
          )
        )
      ).toBe('jpg');
    });

    it('maps PNG to png', () => {
      expect(
        getSafeImageExtension(
          makeFile(
            'anything.png',
            'image/png'
          )
        )
      ).toBe('png');
    });

    it('maps WEBP to webp', () => {
      expect(
        getSafeImageExtension(
          makeFile(
            'anything.webp',
            'image/webp'
          )
        )
      ).toBe('webp');
    });

    it('rejects unsupported MIME types', () => {
      expect(() =>
        getSafeImageExtension(
          makeFile(
            'anything.svg',
            'image/svg+xml'
          )
        )
      ).toThrow(
        'Unsupported image type.'
      );
    });

    it('does not derive extension from an attacker-controlled filename', () => {
      expect(
        getSafeImageExtension(
          makeFile(
            'malicious.php',
            'image/png'
          )
        )
      ).toBe('png');
    });
  });
});