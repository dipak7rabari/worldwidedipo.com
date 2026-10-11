/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
   * ============================================================
   * CORE
   * ============================================================
   */

  reactStrictMode: true,

  // Do not expose that the app is running on Next.js.
  poweredByHeader: false,

  /*
   * ============================================================
   * PERFORMANCE
   * ============================================================
   */

  compress: true,

  /*
   * ============================================================
   * IMAGE OPTIMIZATION
   * ============================================================
   *
   * Current project uses:
   * - local /public assets
   * - Supabase-hosted profile/gallery images
   *
   * Keep remote image access tightly scoped.
   */

  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],

    /*
     * Prevent accidental oversized responsive image generation.
     * These cover the actual responsive breakpoints used throughout
     * the application without creating an unnecessarily large set.
     */
    deviceSizes: [320, 375, 414, 640, 768, 1024, 1280, 1440, 1920],

    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384, 512],
  },

  /*
   * ============================================================
   * SECURITY / BUILD HARDENING
   * ============================================================
   *
   * Security headers are handled by the project's dedicated
   * security layer/proxy. They are intentionally NOT duplicated
   * here to avoid conflicting header policies.
   */

  productionBrowserSourceMaps: false,

  /*
   * ============================================================
   * TRAILING SLASH / URL CONSISTENCY
   * ============================================================
   */

  trailingSlash: false,

  /*
   * ============================================================
   * OUTPUT
   * ============================================================
   *
   * Standard Next.js deployment output is preserved.
   * No standalone migration is forced here because the existing
   * deployment architecture should remain unchanged.
   */

  /*
   * ============================================================
   * TYPESCRIPT / ESLINT
   * ============================================================
   *
   * We intentionally do NOT bypass TypeScript or ESLint errors.
   * Production builds should fail on real code-quality issues.
   */

  /*
   * ============================================================
   * REDIRECTS
   * ============================================================
   *
   * No application redirects are hard-coded here.
   * Auth, profile, payment and security redirects belong to their
   * existing route/service layers.
   */

  async redirects() {
    return [];
  },
};

export default nextConfig;