export default function manifest() {
  return {
    name: "Worldwide DIPO",
    short_name: "DIPO",

    description:
      "Create your professional digital identity page with Worldwide DIPO. Share one simple link for your personal, professional, creator, or business identity.",

    start_url: "/",
    scope: "/",

    display: "standalone",
    orientation: "portrait",

    background_color: "#ffffff",
    theme_color: "#ffffff",

    lang: "en-IN",
    dir: "ltr",

    categories: [
      "business",
      "productivity",
      "social",
    ],

    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}