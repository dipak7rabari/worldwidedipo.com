export const securityConfig = {
  requestBodyLimitBytes: 50 * 1024,

  maxNameLength: 60,

  maxProfessionLength: 60,

  maxBioLength: 250,

  minSlugLength: 3,

  maxSlugLength: 30,

  maxPaymentReferenceLength: 100,

  maxSupportMessageLength: 5000,

  recaptcha: {
    minimumScore: 0.5
  },

  profile: {
    allowedStatuses: [
      "draft",
      "pending",
      "active",
      "expired"
    ],

    allowedPlans: [
      "starter",
      "pro",
      "elite"
    ]
  },

  payment: {
    allowedStatuses: [
      "pending",
      "verified",
      "rejected"
    ],

    allowedTypes: [
      "initial",
      "renewal"
    ]
  }
};

export const RESERVED_SLUGS = new Set([
  "admin",
  "administrator",
  "api",
  "auth",
  "dashboard",
  "login",
  "logout",
  "pricing",
  "about",
  "contact",
  "support",
  "faq",
  "terms",
  "privacy",
  "refund",
  "cookies",
  "p",
  "profile",
  "profiles",
  "user",
  "users",
  "settings",
  "payment",
  "payments",
  "subscription",
  "subscriptions",
  "analytics",
  "share",
  "help",
  "security",
  "sitemap",
  "robots",
  "favicon"
]);

export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",

  "X-Frame-Options": "DENY",

  "Referrer-Policy":
    "strict-origin-when-cross-origin",

  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=()"
};