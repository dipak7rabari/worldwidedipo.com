import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://worldwidedipo.com"),

  title: {
    default: "Worldwide DIPO — Har insaan ki apni digital pehchaan.",
    template: "%s | Worldwide DIPO",
  },

  description:
    "Create your own digital identity with Worldwide DIPO. One name, one link, your work, your world.",

  applicationName: "Worldwide DIPO",

  generator: "Next.js",

  keywords: [
    "Worldwide DIPO",
    "DIPO",
    "digital identity",
    "personal profile",
    "professional profile",
    "digital presence",
    "online identity",
  ],

  authors: [
    {
      name: "DIPO LABS",
      url: "https://worldwidedipo.com",
    },
  ],

  creator: "DIPO LABS",
  publisher: "DIPO LABS",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/icons/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/icons/icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],

    apple: [
      {
        url: "/icons/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],

    shortcut: ["/favicon.ico"],
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://worldwidedipo.com/",
    siteName: "Worldwide DIPO",

    title:
      "Worldwide DIPO — Har insaan ki apni digital pehchaan.",

    description:
      "One identity. One URL. Your world. Create your own digital identity with Worldwide DIPO.",

    images: [
      {
        url: "/og-image/default-og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Worldwide DIPO — Your digital identity",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Worldwide DIPO — Har insaan ki apni digital pehchaan.",

    description:
      "One identity. One URL. Your world.",

    images: ["/og-image/default-og.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  category: "technology",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",

  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#ffffff",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}