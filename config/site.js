const siteConfig = {
  name: "Worldwide DIPO",

  shortName: "DIPO",

  description:
    "A personal digital identity page for people, professionals, creators, shop owners, and businesses.",

  url:
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://worldwidedipo.com",

  locale: "en-IN",

  language: "en",

  timezone: "Asia/Kolkata",

  supportEmail:
    "dipolabs123@gmail.com",

  instagram:
    "https://www.instagram.com/dipolabs.io/",

  parentBrand: "DIPO WORLD",

  footer: {
    madeInIndia: "Made with ❤️ in India",
    productMark: "𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱",
    copyright:
      "© 2026 𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱. All rights reserved."
  },

  routes: {
    home: "/",
    pricing: "/pricing",
    about: "/about",
    faq: "/faq",
    contact: "/contact",
    support: "/support",
    signIn: "/auth/sign-in",
    dashboard: "/dashboard"
  }
};

export default siteConfig;