"use client";

import Link from "next/link";
import PlanBadge, { planKey } from "@/components/identity/PlanBadge";
import "./ExplorePlans.css";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getAllDemoProfiles,
  getDemoProfilesByCategory,
  searchDemoProfiles,
} from "@/lib/explore/demo-profiles";

const PAGE_SIZE = 24;
const SEARCH_DELAY = 380;

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "creators", label: "Creators" },
  { id: "businesses", label: "Businesses" },
  { id: "online-businesses", label: "Online Business" },
  { id: "shops", label: "Shops" },
  { id: "brands", label: "Brands" },
  { id: "services", label: "Services" },
  { id: "professionals", label: "Professionals" },
  { id: "education", label: "Education" },
];

const TIPS = [
  {
    title: "Your DIPO, Your Identity",
    text: "Aapki profile, aapki story aur aapka work — sab ek hi digital place par.",
    icon: "✦",
  },
  {
    title: "Grow Worldwide",
    text: "Apni digital identity ko ek simple link ke through duniya tak le jao.",
    icon: "◎",
  },
  {
    title: "Be Ready to Be Found",
    text: "Apni online presence ko professional aur discoverable banane ke liye ready rakho.",
    icon: "⌕",
  },
  {
    title: "One Link. Your World.",
    text: "Bio, work, services, social links aur contact — ek simple DIPO link mein.",
    icon: "↗",
  },
  {
    title: "Show What You Do",
    text: "Creator, business, professional ya shop — apna work clean digital identity ke saath show karo.",
    icon: "◌",
  },
  {
    title: "Think Global. Start Simple.",
    text: "Shuruaat simple rakho, lekin apni digital journey ko worldwide socho.",
    icon: "∞",
  },
  {
    title: "Your Phone Can Build Your Presence",
    text: "Apne phone se hi apni professional digital presence ko ready karo.",
    icon: "▣",
  },
  {
    title: "Everything About You, In One Place",
    text: "Intro, skills, services, work aur important links — sab ek jagah.",
    icon: "◇",
  },
  {
    title: "Make Your Presence Count",
    text: "Jo aap karte ho, use duniya ke saamne ek clean digital identity ke saath dikhao.",
    icon: "★",
  },
  {
    title: "Your Next Opportunity Could Be Online",
    text: "Achi digital presence kisi naye connection ya opportunity ka starting point ban sakti hai.",
    icon: "↗",
  },
  {
    title: "Start Small. Grow Worldwide.",
    text: "Aaj ek simple DIPO se shuru karo aur apni online identity grow karo.",
    icon: "↑",
  },
  {
    title: "Make Your Name Discoverable",
    text: "Apne naam aur work ke liye ek dedicated digital home create karo.",
    icon: "⌖",
  },
  {
    title: "Your Story Deserves a Place Online",
    text: "Aapki journey unique hai — use apne DIPO par apne style mein share karo.",
    icon: "♡",
  },
];

function safeText(value, fallback = "") {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return fallback;
  }

  return String(value);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

function hashString(value) {
  let hash = 0;
  const input = String(value || "");

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getCategoryLabel(category) {
  const normalized = normalize(category);

  const aliases = {
    creator: "Creators",
    creators: "Creators",
    business: "Businesses",
    businesses: "Businesses",
    "online business": "Online Business",
    "online businesses": "Online Business",
    shop: "Shops",
    shops: "Shops",
    brand: "Brands",
    brands: "Brands",
    service: "Services",
    services: "Services",
    professional: "Professionals",
    professionals: "Professionals",
    education: "Education",
  };

  return aliases[normalized] || safeText(category, "Worldwide DIPO");
}

function categoryMatches(profileCategory, selectedCategory) {
  if (!selectedCategory || selectedCategory === "all") {
    return true;
  }

  const profile = normalize(profileCategory);
  const selected = normalize(selectedCategory);

  const groups = {
    creators: ["creator", "creators"],
    businesses: ["business", "businesses"],
    "online-businesses": ["online business", "online businesses"],
    shops: ["shop", "shops"],
    brands: ["brand", "brands"],
    services: ["service", "services"],
    professionals: ["professional", "professionals"],
    education: ["education", "educations"],
  };

  return (groups[selected] || [selected]).includes(profile);
}

function profileSearchMatch(profile, query) {
  const q = normalize(query);

  if (!q) {
    return true;
  }

  const searchable = [
    profile?.name,
    profile?.slug,
    profile?.profession,
    profile?.headline,
    profile?.bio,
    profile?.description,
    profile?.story,
    profile?.location,
    profile?.category,
    ...(profile?.tags || []),
  ]
    .map(normalize)
    .join(" ");

  return searchable.includes(q);
}

function getProfileType(profile) {
  const category = normalize(profile?.category);
  const profession = normalize(profile?.profession);
  const combined = `${category} ${profession}`;

  if (
    category.includes("creator") ||
    combined.includes("youtube") ||
    combined.includes("podcast") ||
    combined.includes("performer")
  ) {
    return "creator";
  }

  if (category.includes("brand")) {
    return "brand";
  }

  if (
    category.includes("shop") ||
    profession.includes("retail") ||
    profession.includes("store")
  ) {
    return "shop";
  }

  if (
    category.includes("online") ||
    combined.includes("commerce") ||
    combined.includes("platform")
  ) {
    return "online";
  }

  if (
    category.includes("education") ||
    profession.includes("education")
  ) {
    return "education";
  }

  if (
    category.includes("professional") ||
    profession.includes("entrepreneur") ||
    profession.includes("professional")
  ) {
    return "professional";
  }

  if (
    category.includes("business") ||
    profession.includes("company") ||
    profession.includes("business") ||
    profession.includes("financial")
  ) {
    return "company";
  }

  return "person";
}

function createAvatarSvg(profile) {
  const name = safeText(profile?.name, "DIPO");
  const slug = safeText(profile?.slug, name);
  const seed = hashString(slug);
  const type = getProfileType(profile);
  const category = normalize(profile?.category);

  const female =
    seed % 5 === 0 ||
    /falguni|kiran|nykaa|mamaearth/i.test(name);

  const glasses = seed % 4 === 0;

  const backgrounds = [
    "#EEF2F6",
    "#F4F0EA",
    "#EEF4F1",
    "#F3EEF4",
    "#F1F2EC",
    "#EEF1F7",
    "#F6EEE8",
    "#EDF3F5",
  ];

  const skinTones = [
    "#F3CBAE",
    "#E5B38F",
    "#D59A73",
    "#C78462",
    "#F0C4A4",
  ];

  const hairColors = [
    "#15171B",
    "#25272C",
    "#3B3029",
    "#17191D",
    "#504039",
  ];

  const shirts = [
    "#111318",
    "#272C34",
    "#424A55",
    "#5A616B",
    "#20252C",
  ];

  const bg = backgrounds[seed % backgrounds.length];
  const skin = skinTones[(seed >> 3) % skinTones.length];
  const hair = hairColors[(seed >> 5) % hairColors.length];
  const shirt = shirts[(seed >> 7) % shirts.length];

  const accentColors = [
    "#111318",
    "#2F6FED",
    "#6B5CFF",
    "#00A878",
    "#E48A32",
    "#D64D6D",
    "#7A5CFA",
    "#1C8B8B",
  ];

  const accent = accentColors[(seed >> 9) % accentColors.length];
  const firstLetter = name.trim().charAt(0).toUpperCase();

  if (type === "creator" || type === "person") {
    const play = type === "creator";

    const hairShape = female
      ? `
        <path d="M174 355 C132 250 164 142 300 140 C436 142 468 252 426 355 C420 287 392 222 300 215 C208 222 180 287 174 355 Z" fill="${hair}" />
        <path d="M174 330 C130 380 144 500 214 532 L216 370 Z" fill="${hair}" />
        <path d="M426 330 C470 380 456 500 386 532 L384 370 Z" fill="${hair}" />
      `
      : `
        <path d="M178 315 C164 190 230 130 315 140 C405 145 455 215 425 335 C390 275 350 250 285 255 C235 258 205 285 178 315 Z" fill="${hair}" />
      `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760">
        <defs>
          <linearGradient id="personBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bg}" />
            <stop offset="100%" stop-color="#FFFFFF" />
          </linearGradient>
        </defs>
        <rect width="600" height="760" rx="74" fill="url(#personBg)" />
        <circle cx="105" cy="120" r="64" fill="#FFFFFF" opacity=".72" />
        <circle cx="500" cy="160" r="86" fill="${accent}" opacity=".08" />
        <circle cx="85" cy="640" r="120" fill="${accent}" opacity=".08" />
        <path d="M135 760 C150 590 218 520 300 520 C382 520 450 590 465 760 Z" fill="${shirt}" />
        <path d="M258 480 L342 480 L350 575 L250 575 Z" fill="${skin}" />
        <ellipse cx="300" cy="365" rx="128" ry="145" fill="${skin}" />
        ${hairShape}
        <circle cx="170" cy="365" r="24" fill="${skin}" />
        <circle cx="430" cy="365" r="24" fill="${skin}" />
        <ellipse cx="252" cy="365" rx="11" ry="14" fill="#17191D" />
        <ellipse cx="348" cy="365" rx="11" ry="14" fill="#17191D" />
        ${
          glasses
            ? `
              <rect x="212" y="335" width="78" height="54" rx="18" fill="none" stroke="#20242A" stroke-width="8" />
              <rect x="310" y="335" width="78" height="54" rx="18" fill="none" stroke="#20242A" stroke-width="8" />
              <path d="M290 357 L310 357" stroke="#20242A" stroke-width="8" stroke-linecap="round" />
            `
            : ""
        }
        <path d="M300 380 L289 420 L308 424" fill="none" stroke="#9D624A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M270 450 C288 465 312 465 330 450" fill="none" stroke="#754837" stroke-width="7" stroke-linecap="round" />
        <circle cx="100" cy="260" r="8" fill="${accent}" opacity=".65" />
        <circle cx="505" cy="290" r="7" fill="${accent}" opacity=".5" />
        ${
          play
            ? `
              <g>
                <circle cx="500" cy="555" r="54" fill="#FFFFFF" opacity=".95" />
                <path d="M486 525 L486 585 L528 555 Z" fill="${accent}" />
              </g>
            `
            : `
              <g opacity=".85">
                <circle cx="500" cy="555" r="52" fill="#FFFFFF" />
                <text x="500" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="${accent}">${firstLetter}</text>
              </g>
            `
        }
        <text x="300" y="705" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="#17191D" opacity=".8">WORLDWIDE DIPO</text>
      </svg>
    `)}`;
  }

  if (type === "company") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760">
        <defs>
          <linearGradient id="companyBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bg}" />
            <stop offset="100%" stop-color="#FFFFFF" />
          </linearGradient>
        </defs>
        <rect width="600" height="760" rx="74" fill="url(#companyBg)" />
        <circle cx="480" cy="120" r="105" fill="${accent}" opacity=".08" />
        <circle cx="110" cy="620" r="125" fill="${accent}" opacity=".08" />
        <rect x="115" y="210" width="370" height="390" rx="34" fill="#FFFFFF" stroke="#E3E7EC" stroke-width="4" />
        <rect x="160" y="270" width="280" height="55" rx="16" fill="${accent}" opacity=".12" />
        <rect x="160" y="355" width="72" height="72" rx="18" fill="${accent}" />
        <rect x="264" y="355" width="72" height="72" rx="18" fill="${accent}" opacity=".75" />
        <rect x="368" y="355" width="72" height="72" rx="18" fill="${accent}" opacity=".48" />
        <rect x="160" y="462" width="280" height="20" rx="10" fill="#DDE2E8" />
        <rect x="160" y="505" width="205" height="20" rx="10" fill="#E8EBEF" />
        <circle cx="300" cy="128" r="48" fill="#FFFFFF" stroke="#E3E7EC" stroke-width="5" />
        <text x="300" y="143" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="900" fill="${accent}">${firstLetter}</text>
        <text x="300" y="670" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" font-weight="800" fill="#17191D">BUSINESS DIPO</text>
      </svg>
    `)}`;
  }

  if (type === "brand") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760">
        <defs>
          <linearGradient id="brandBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bg}" />
            <stop offset="100%" stop-color="#FFFFFF" />
          </linearGradient>
        </defs>
        <rect width="600" height="760" rx="74" fill="url(#brandBg)" />
        <circle cx="480" cy="140" r="105" fill="${accent}" opacity=".08" />
        <path d="M145 565 C150 390 190 260 300 230 C410 260 450 390 455 565 Z" fill="#FFFFFF" stroke="#E2E6EB" stroke-width="5" />
        <path d="M205 470 C245 420 355 420 395 470" fill="none" stroke="${accent}" stroke-width="22" stroke-linecap="round" />
        <circle cx="300" cy="330" r="88" fill="${accent}" opacity=".12" />
        <circle cx="300" cy="330" r="66" fill="${accent}" />
        <text x="300" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="58" font-weight="900" fill="#FFFFFF">${firstLetter}</text>
        <circle cx="125" cy="170" r="18" fill="${accent}" />
        <circle cx="475" cy="590" r="25" fill="${accent}" opacity=".2" />
        <text x="300" y="670" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" font-weight="800" fill="#17191D">BRAND DIPO</text>
      </svg>
    `)}`;
  }

  if (type === "shop") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760">
        <defs>
          <linearGradient id="shopBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bg}" />
            <stop offset="100%" stop-color="#FFFFFF" />
          </linearGradient>
        </defs>
        <rect width="600" height="760" rx="74" fill="url(#shopBg)" />
        <rect x="105" y="250" width="390" height="300" rx="28" fill="#FFFFFF" stroke="#E1E5EA" stroke-width="5" />
        <path d="M90 260 L510 260 L475 165 L125 165 Z" fill="${accent}" />
        <path d="M125 165 L165 260 L210 165 L255 260 L300 165 L345 260 L390 165 L435 260 L475 165" fill="none" stroke="#FFFFFF" stroke-width="16" />
        <rect x="155" y="330" width="90" height="95" rx="16" fill="${accent}" opacity=".14" />
        <rect x="255" y="330" width="90" height="95" rx="16" fill="${accent}" opacity=".22" />
        <rect x="355" y="330" width="90" height="95" rx="16" fill="${accent}" opacity=".32" />
        <rect x="235" y="455" width="130" height="95" rx="16" fill="#17191D" />
        <circle cx="300" cy="105" r="48" fill="#FFFFFF" stroke="#E2E6EA" stroke-width="5" />
        <text x="300" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" font-weight="900" fill="${accent}">${firstLetter}</text>
        <text x="300" y="650" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" font-weight="800" fill="#17191D">SHOP DIPO</text>
      </svg>
    `)}`;
  }

  if (type === "online") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760">
        <defs>
          <linearGradient id="onlineBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bg}" />
            <stop offset="100%" stop-color="#FFFFFF" />
          </linearGradient>
        </defs>
        <rect width="600" height="760" rx="74" fill="url(#onlineBg)" />
        <circle cx="485" cy="125" r="100" fill="${accent}" opacity=".08" />
        <rect x="145" y="125" width="310" height="480" rx="48" fill="#17191D" />
        <rect x="164" y="148" width="272" height="430" rx="32" fill="#FFFFFF" />
        <circle cx="300" cy="178" r="7" fill="#D4D9DF" />
        <rect x="205" y="230" width="190" height="85" rx="20" fill="${accent}" opacity=".12" />
        <circle cx="300" cy="272" r="34" fill="${accent}" />
        <text x="300" y="285" text-anchor="middle" font-family="Arial, sans-serif" font-size="31" font-weight="900" fill="#FFFFFF">${firstLetter}</text>
        <rect x="205" y="345" width="190" height="18" rx="9" fill="#E1E5EA" />
        <rect x="205" y="385" width="150" height="18" rx="9" fill="#E8EBEF" />
        <rect x="205" y="435" width="190" height="58" rx="18" fill="#17191D" />
        <path d="M250 520 L350 520" stroke="#DDE1E5" stroke-width="7" stroke-linecap="round" />
        <text x="300" y="670" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" font-weight="800" fill="#17191D">ONLINE DIPO</text>
      </svg>
    `)}`;
  }

  if (type === "education") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760">
        <defs>
          <linearGradient id="eduBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bg}" />
            <stop offset="100%" stop-color="#FFFFFF" />
          </linearGradient>
        </defs>
        <rect width="600" height="760" rx="74" fill="url(#eduBg)" />
        <path d="M110 275 L300 170 L490 275 L300 380 Z" fill="${accent}" />
        <path d="M165 320 L165 455 C235 500 365 500 435 455 L435 320" fill="#FFFFFF" stroke="#E1E5EA" stroke-width="5" />
        <path d="M230 375 L370 375" stroke="${accent}" stroke-width="16" stroke-linecap="round" opacity=".35" />
        <path d="M230 420 L345 420" stroke="#DDE2E7" stroke-width="15" stroke-linecap="round" />
        <circle cx="300" cy="115" r="48" fill="#FFFFFF" stroke="#E1E5EA" stroke-width="5" />
        <text x="300" y="132" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="900" fill="${accent}">${firstLetter}</text>
        <text x="300" y="650" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" font-weight="800" fill="#17191D">EDUCATION DIPO</text>
      </svg>
    `)}`;
  }

  if (type === "professional") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760">
        <defs>
          <linearGradient id="proBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bg}" />
            <stop offset="100%" stop-color="#FFFFFF" />
          </linearGradient>
        </defs>
        <rect width="600" height="760" rx="74" fill="url(#proBg)" />
        <circle cx="470" cy="125" r="105" fill="${accent}" opacity=".08" />
        <circle cx="300" cy="300" r="115" fill="#FFFFFF" stroke="#E1E5EA" stroke-width="6" />
        <circle cx="300" cy="270" r="54" fill="${skin}" />
        <path d="M247 255 C245 205 270 180 302 180 C338 180 366 208 360 258 C340 230 320 220 298 220 C278 220 260 232 247 255 Z" fill="${hair}" />
        <path d="M210 470 C215 365 250 330 300 330 C350 330 385 365 390 470 Z" fill="${shirt}" />
        <rect x="170" y="505" width="260" height="30" rx="15" fill="${accent}" opacity=".12" />
        <rect x="205" y="555" width="190" height="24" rx="12" fill="#E1E5EA" />
        <text x="300" y="650" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" font-weight="800" fill="#17191D">PROFESSIONAL DIPO</text>
      </svg>
    `)}`;
  }

  return "";
}

function getProfileImage(profile) {
  if (
    profile?.avatar_url &&
    typeof profile.avatar_url === "string"
  ) {
    return profile.avatar_url;
  }

  return createAvatarSvg(profile);
}

function getMasonrySize(profile) {
  const seed = hashString(
    profile?.slug || profile?.name || "dipo"
  );

  const sizes = [
    "short",
    "medium",
    "tall",
    "medium",
    "short",
    "tall",
    "medium",
    "short",
  ];

  return sizes[seed % sizes.length];
}

function DipoDiscoveryCard({ profile, index, onOpen }) {
  const isDemo = Boolean(profile?.is_demo);
  const type = getProfileType(profile);
  const image = getProfileImage(profile);
  const size = getMasonrySize(profile);
  const categoryLabel = getCategoryLabel(profile?.category);
  const name = safeText(profile?.name, "Worldwide DIPO");
  const profession = safeText(profile?.profession, categoryLabel);
  const location = safeText(profile?.location, "");

  return (
    <article
      className={`dipoPinCard dipoPinCard-${size} ${
        isDemo
          ? ""
          : `dipoRealCard dipoPlan-${planKey(profile.plan)}`
      }`}
      style={{ "--card-index": index % 12 }}
    >
      <button
        type="button"
        className="dipoPinImageButton"
        onClick={() => onOpen(profile)}
        aria-label={`Open ${name} DIPO`}
      >
        <div className="dipoPinImage">
          <img
            src={image}
            alt=""
            className="dipoCharacterImage"
            loading={index < 8 ? "eager" : "lazy"}
            decoding="async"
          />

          <div className="dipoPinImageGradient" />

          <div className="dipoPinImageTop">
            <span className="dipoPinCategory">
              {categoryLabel}
            </span>

            {isDemo ? (
              <span className="dipoPinDemo">
                ✦ DIPO Demo
              </span>
            ) : (
              <span className="dipoPinLive">
                ● Live
              </span>
            )}
          </div>

          <div className="dipoPinImageBottom">
            <span>
              {type === "creator"
                ? "Creator"
                : type === "company"
                  ? "Company"
                  : type === "brand"
                    ? "Brand"
                    : type === "shop"
                      ? "Shop"
                      : type === "online"
                        ? "Online"
                        : type === "professional"
                          ? "Professional"
                          : type === "education"
                            ? "Education"
                            : "Digital Identity"}
            </span>

            <span className="dipoPinOpenIcon">
              ↗
            </span>
          </div>
        </div>
      </button>

      {!isDemo && (
        <div className="dipoPlanLabel">
          <PlanBadge plan={profile.plan} />

          {profile.is_owner && (
            <span className="dipoYours">
              Your DIPO
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        className="dipoPinInfo"
        onClick={() => onOpen(profile)}
      >
        <div className="dipoPinTitleRow">
          <h3>{name}</h3>
          <span className="dipoPinArrow">↗</span>
        </div>

        <p className="dipoPinProfession">
          {profession}
        </p>

        <div className="dipoPinMeta">
          <span>{categoryLabel}</span>

          {location ? (
            <>
              <i>·</i>
              <span>{location}</span>
            </>
          ) : null}
        </div>
      </button>
    </article>
  );
}

function DemoDipoFullPage({ profile, onClose }) {
  const image = getProfileImage(profile);
  const category = getCategoryLabel(profile?.category);
  const name = safeText(profile?.name, "Worldwide DIPO");
  const profession = safeText(profile?.profession, category);

  const headline = safeText(
    profile?.headline,
    "Digital identity on Worldwide DIPO"
  );

  const description = safeText(
    profile?.description,
    safeText(
      profile?.bio,
      "A digital identity showcase on Worldwide DIPO."
    )
  );

  const knownFor = safeText(
    profile?.known_for,
    "Digital identity"
  );

  const story = safeText(
    profile?.story,
    "Worldwide DIPO brings identity, work and important online destinations into one clean digital place."
  );

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="dipoDemoModal"
      role="dialog"
      aria-modal="true"
      aria-label={`${name} DIPO showcase`}
    >
      <div
        className="dipoModalBackdrop"
        onClick={onClose}
      />

      <div className="dipoModalSheet">
        <button
          type="button"
          className="dipoModalClose"
          onClick={onClose}
          aria-label="Close DIPO"
        >
          ×
        </button>

        <div className="dipoModalHero">
          <img
            src={image}
            alt=""
            className="dipoModalHeroImage"
          />

          <div className="dipoModalHeroShade" />

          <div className="dipoModalHeroContent">
            <span className="dipoModalDemoBadge">
              ✦ DIPO Demo
            </span>

            <span className="dipoModalCategory">
              {category}
            </span>

            <h2>{name}</h2>
            <p>{profession}</p>
          </div>
        </div>

        <div className="dipoModalBody">
          <div className="dipoModalIdentity">
            <div>
              <span>WORLDWIDE DIPO</span>
              <h3>{name}</h3>
              <p>{headline}</p>
            </div>

            <span className="dipoModalLive">
              DEMO
            </span>
          </div>

          <div className="dipoModalStats">
            <div>
              <span>CATEGORY</span>
              <strong>{category}</strong>
            </div>

            <div>
              <span>LOCATION</span>
              <strong>
                {safeText(profile?.location, "Worldwide")}
              </strong>
            </div>

            <div>
              <span>SINCE</span>
              <strong>
                {safeText(profile?.since, "—")}
              </strong>
            </div>
          </div>

          <section className="dipoModalSection">
            <span>ABOUT</span>
            <h3>About {name}</h3>
            <p>{description}</p>
          </section>

          <section className="dipoModalSection">
            <span>KNOWN FOR</span>
            <h3>{knownFor}</h3>
            <p>{story}</p>
          </section>

          {Array.isArray(profile?.tags) &&
          profile.tags.length > 0 ? (
            <div className="dipoModalTags">
              {profile.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}

          <div className="dipoModalAction">
            <button
              type="button"
              onClick={onClose}
            >
              ← Back to Explore
            </button>
          </div>

          <p className="dipoModalDisclaimer">
            Demo showcase profile — not an official Worldwide
            DIPO profile.
          </p>
        </div>
      </div>
    </div>
  );
}

function DipoTips() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TIPS.length;

  useEffect(() => {
    if (paused) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % total);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [paused, total]);

  const tip = TIPS[active];

  const previous = () => {
    setActive((current) => (current - 1 + total) % total);
  };

  const next = () => {
    setActive((current) => (current + 1) % total);
  };

  return (
    <section
      className="dipoTips"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="dipoTipsIcon">
        {tip.icon}
      </div>

      <div
        className="dipoTipsContent"
        key={active}
      >
        <span>
          WORLDWIDE DIPO · TIP {active + 1}/{total}
        </span>

        <strong>{tip.title}</strong>
        <p>{tip.text}</p>
      </div>

      <div className="dipoTipsControls">
        <button
          type="button"
          onClick={previous}
          aria-label="Previous tip"
        >
          ←
        </button>

        <div>
          {TIPS.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === active ? "active" : ""}
              onClick={() => setActive(index)}
              aria-label={`Show tip ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next tip"
        >
          →
        </button>
      </div>
    </section>
  );
}

function DipoSkeletonCard({ index }) {
  const sizes = ["short", "medium", "tall"];

  return (
    <div
      className={`dipoSkeletonCard dipoSkeleton-${sizes[index % 3]}`}
    >
      <div className="dipoSkeletonImage" />
      <div className="dipoSkeletonLine large" />
      <div className="dipoSkeletonLine small" />
    </div>
  );
}

export default function ExplorePage({
  isSignedIn = false,
  ownSlug = null,
  initialProfiles = [],
  initialDemoProfiles = [],
  initialError = null,
  initialHasMore = false,
}) {
  const initialDemo =
    Array.isArray(initialDemoProfiles) &&
    initialDemoProfiles.length
      ? initialDemoProfiles
      : getAllDemoProfiles();

  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const [realProfiles, setRealProfiles] = useState(
    Array.isArray(initialProfiles) ? initialProfiles : []
  );

  const [demoProfiles, setDemoProfiles] = useState(initialDemo);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [realError, setRealError] = useState(initialError);
  const [hasMore, setHasMore] = useState(Boolean(initialHasMore));

  const [offset, setOffset] = useState(
    Array.isArray(initialProfiles) ? initialProfiles.length : 0
  );

  const [selectedDemo, setSelectedDemo] = useState(null);

  const requestRef = useRef(0);
  const abortRef = useRef(null);
  const searchTimerRef = useRef(null);

  const visibleDemoProfiles = useMemo(() => {
    const q = searchInput.trim();

    if (q && category !== "all") {
      return initialDemo.filter(
        (profile) =>
          categoryMatches(profile?.category, category) &&
          profileSearchMatch(profile, q)
      );
    }

    if (q) {
      return searchDemoProfiles(q).filter((profile) =>
        categoryMatches(profile?.category, category)
      );
    }

    if (category !== "all") {
      return getDemoProfilesByCategory(category);
    }

    return demoProfiles;
  }, [searchInput, category, initialDemo, demoProfiles]);

  const fetchRealProfiles = useCallback(
    async ({
      nextQuery = "",
      nextCategory = "all",
      nextOffset = 0,
      append = false,
    } = {}) => {
      const requestId = ++requestRef.current;

      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setRealError(null);
      }

      try {
        const params = new URLSearchParams();

        if (nextQuery.trim()) {
          params.set("q", nextQuery.trim());
        }

        if (nextCategory && nextCategory !== "all") {
          params.set("category", nextCategory);
        }

        params.set("limit", String(PAGE_SIZE));
        params.set(
          "offset",
          String(Math.max(0, Number(nextOffset) || 0))
        );

        const response = await fetch(
          `/api/explore?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );

        let data = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.error ||
              `Explore request failed (${response.status})`
          );
        }

        if (requestId !== requestRef.current) {
          return;
        }

        const nextProfiles = Array.isArray(data.profiles)
          ? data.profiles
          : [];

        if (append) {
          setRealProfiles((current) => {
            const existing = new Set(
              current.map((item) => item.slug)
            );

            const unique = nextProfiles.filter(
              (item) =>
                item?.slug &&
                !existing.has(item.slug)
            );

            return [...current, ...unique];
          });
        } else {
          setRealProfiles(nextProfiles);
        }

        const pagination = data.pagination || {};

        const nextHasMore =
          typeof pagination.hasMore === "boolean"
            ? pagination.hasMore
            : nextProfiles.length >= PAGE_SIZE;

        setHasMore(nextHasMore);

        setOffset(
          Number(pagination.offset ?? nextOffset) +
            nextProfiles.length
        );
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        if (requestId !== requestRef.current) {
          return;
        }

        setRealError(
          "Real Worldwide DIPO profiles could not load right now."
        );

        if (!append) {
          setRealProfiles([]);
          setHasMore(false);
          setOffset(0);
        }
      } finally {
        if (requestId === requestRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = window.setTimeout(() => {
      const next = searchInput.trim();
      setQuery(next);

      fetchRealProfiles({
        nextQuery: next,
        nextCategory: category,
        nextOffset: 0,
        append: false,
      });
    }, SEARCH_DELAY);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchInput, category, fetchRealProfiles]);

  const changeCategory = useCallback(
    (nextCategory) => {
      setCategory(nextCategory);

      const next = searchInput.trim();
      setQuery(next);

      fetchRealProfiles({
        nextQuery: next,
        nextCategory,
        nextOffset: 0,
        append: false,
      });
    },
    [searchInput, fetchRealProfiles]
  );

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) {
      return;
    }

    fetchRealProfiles({
      nextQuery: query,
      nextCategory: category,
      nextOffset: offset,
      append: true,
    });
  }, [
    loading,
    loadingMore,
    hasMore,
    query,
    category,
    offset,
    fetchRealProfiles,
  ]);

  const retry = useCallback(() => {
    fetchRealProfiles({
      nextQuery: query,
      nextCategory: category,
      nextOffset: 0,
      append: false,
    });
  }, [query, category, fetchRealProfiles]);

  const openProfile = useCallback((profile) => {
    if (!profile) {
      return;
    }

    if (profile.is_demo) {
      setSelectedDemo(profile);
      return;
    }

    if (profile.slug) {
      window.location.href = `/p/${encodeURIComponent(profile.slug)}`;
    }
  }, []);

  const totalDemo = visibleDemoProfiles.length;
  const totalReal = realProfiles.length;

  return (
    <>
      <main className="dipoExplorePage">
        <header className="dipoHeader">
          <Link
            href="/"
            className="dipoLogo"
            aria-label="Worldwide DIPO Home"
          >
            Worldwide DIPO<span>.</span>
          </Link>

          <nav className="dipoHeaderNav">
            <Link href="/pricing">Pricing</Link>
            <Link href="/about">About</Link>
            <Link href="/support">Support</Link>
          </nav>

          <div className="dipoHeaderActions">
           
<Link
  href="/creator"
  className="dipoLoginButton"
>
  ✦ Creator
</Link>
 
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="dipoLoginButton"
                >
                  Dashboard
                </Link>

                <Link
                  href={
                    ownSlug
                      ? "/dashboard/profile"
                      : "/onboarding"
                  }
                  className="dipoCreateButton"
                >
                  {ownSlug ? "My DIPO ↗" : "Create DIPO ↗"}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="dipoLoginButton"
                >
                  Login
                </Link>

                <Link
                  href="/auth/signup"
                  className="dipoCreateButton"
                >
                  Create Your DIPO
                  <span>↗</span>
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="dipoHero">
          <div className="dipoHeroPill">
            <span />
            Explore Worldwide DIPO
          </div>

          <h1>
            Discover
            <br />
            <span>digital identities.</span>
          </h1>

          <p className="dipoHeroDescription">
            Explore creators, businesses, shops,
            professionals, brands and more — each with
            their own digital identity.
          </p>

          <div className="dipoHeroStats">
            <span>
              <b>∞</b>
              identities
            </span>

            <i>•</i>

            <span>
              <b>1</b>
              simple link
            </span>

            <i>•</i>

            <span>
              <b>🌎</b>
              worldwide
            </span>
          </div>
        </section>

        <section className="dipoSearchArea">
          <div className="dipoSearchBox">
            <span className="dipoSearchIcon">
              ⌕
            </span>

            <input
              type="search"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search name, creator, business, shop..."
              aria-label="Search Worldwide DIPO"
              autoComplete="off"
            />

            {searchInput ? (
              <button
                type="button"
                className="dipoSearchClear"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
              >
                ×
              </button>
            ) : null}

            <span className="dipoSearchSpark">
              ✦
            </span>
          </div>

          <div
            className="dipoCategories"
            role="tablist"
            aria-label="DIPO categories"
          >
            {CATEGORIES.map((item, index) => {
              const active = category === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={active ? "active" : ""}
                  style={{ "--cat-index": index }}
                  onClick={() => changeCategory(item.id)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        <DipoTips />

        <section className="dipoFeed">
          <section className="dipoRealSection">
            <div className="dipoRealHeader">
              <div>
                <span>LIVE PROFILES</span>

                <h2>Worldwide DIPO</h2>

                <p>
                  Public DIPO profiles currently active and
                  discoverable.
                </p>
              </div>

              <div className="dipoLivePill">
                <span />
                Live
              </div>
            </div>

            {loading && realProfiles.length === 0 ? (
              <div className="dipoPinterestGrid dipoSkeletonGrid">
                {Array.from({ length: 8 }).map((_, index) => (
                  <DipoSkeletonCard
                    key={index}
                    index={index}
                  />
                ))}
              </div>
            ) : null}

            {!loading && totalReal > 0 ? (
              <div className="dipoPinterestGrid">
                {realProfiles.map((profile, index) => (
                  <DipoDiscoveryCard
                    key={profile.id || profile.slug}
                    profile={profile}
                    index={index}
                    onOpen={openProfile}
                  />
                ))}
              </div>
            ) : null}

            {!loading && realError ? (
              <div className="dipoError">
                <div>!</div>

                <h3>
                  Real DIPO profiles couldn&apos;t load
                </h3>

                <p>
                  The demo showcase is still available.
                </p>

                <button
                  type="button"
                  onClick={retry}
                >
                  Try Again
                  <span>↻</span>
                </button>
              </div>
            ) : null}

            {!loading && !realError && totalReal === 0 ? (
              <div className="dipoRealEmpty">
                <span>✦</span>

                <h3>No real DIPO profiles yet</h3>

                <p>
                  Active public DIPO profiles will appear here.
                </p>

                <Link href="/auth/signup">
                  Create Your DIPO
                  <span>↗</span>
                </Link>
              </div>
            ) : null}

            {!loading &&
            !realError &&
            totalReal > 0 &&
            hasMore ? (
              <div className="dipoLoadMore">
                <button
                  type="button"
                  disabled={loadingMore}
                  onClick={loadMore}
                >
                  {loadingMore ? (
                    <>
                      <span className="dipoSpinner" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load more profiles
                      <b>↓</b>
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </section>

          <div className="dipoFeedHeader">
            <div>
              <span>SHOWCASE</span>

              <h2>✦ DIPO Demo</h2>

              <p>
                Explore how different digital identities can
                look on Worldwide DIPO.
              </p>
            </div>

            <strong>{totalDemo} examples</strong>
          </div>

          {totalDemo > 0 ? (
            <div className="dipoPinterestGrid">
              {visibleDemoProfiles.map((profile, index) => (
                <DipoDiscoveryCard
                  key={profile.id || profile.slug}
                  profile={profile}
                  index={index}
                  onOpen={openProfile}
                />
              ))}
            </div>
          ) : (
            <div className="dipoEmpty">
              <div>⌕</div>

              <h3>No showcase found</h3>

              <p>Try another name or category.</p>

              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setQuery("");
                  changeCategory("all");
                }}
              >
                Explore All
              </button>
            </div>
          )}
        </section>

        <section className="dipoBottomCTA">
          <div className="dipoCTAGlow" />

          <div className="dipoCTAAvatar">
            <div>D</div>
            <span>✦</span>
            <span>✧</span>
          </div>

          <div className="dipoCTAContent">
            <span>YOUR TURN</span>

            <h2>
              Your digital
              <br />
              identity deserves a home.
            </h2>

            <p>
              One link. Your identity. Your digital home.
            </p>

            <Link href="/auth/signup">
              Create Your DIPO
              <span>↗</span>
            </Link>
          </div>

          <div className="dipoCTAGlobe">
            🌎
          </div>
        </section>

        <footer className="dipoFooter">
          <div>
            <strong>Worldwide DIPO.</strong>
            <p>One digital identity. Worldwide.</p>
          </div>

          <div className="dipoFooterLinks">
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/about">About</Link>
            <Link href="/support">Support</Link>
          </div>

          <div className="dipoFooterCopyright">
            <p>Made With ❤️ in India</p>
            <p>𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱</p>

            <small>
              All copyrights reserved @ 𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
            </small>
          </div>
        </footer>
      </main>

      {selectedDemo ? (
        <DemoDipoFullPage
          profile={selectedDemo}
          onClose={() => setSelectedDemo(null)}
        />
      ) : null}

      <style jsx global>{`
        :root {
          --dipo-ink: #111318;
          --dipo-text: #20242b;
          --dipo-muted: #69717e;
          --dipo-soft: #929ba8;
          --dipo-border: #e4e7eb;
          --dipo-surface: #ffffff;
          --dipo-soft-bg: #f7f8fa;
          --dipo-radius: 28px;
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          background: #ffffff;
          color: var(--dipo-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        button, input { font: inherit; }
        button, a { -webkit-tap-highlight-color: transparent; }
        a { color: inherit; text-decoration: none; }

        .dipoExplorePage {
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: radial-gradient(
            circle at 50% -10%,
            rgba(17, 19, 24, 0.035),
            transparent 38%
          ), #ffffff;
        }

        .dipoHeader {
          width: min(1240px, calc(100% - 48px));
          min-height: 74px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          border-bottom: 1px solid rgba(17, 19, 24, 0.08);
        }

        .dipoLogo {
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -0.8px;
          white-space: nowrap;
        }

        .dipoLogo span { color: #6b5cff; }

        .dipoHeaderNav {
          display: flex;
          align-items: center;
          gap: 30px;
          color: #626a76;
          font-size: 14px;
          font-weight: 650;
        }

        .dipoHeaderNav a {
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .dipoHeaderNav a:hover {
          color: var(--dipo-ink);
          transform: translateY(-1px);
        }

        .dipoHeaderActions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .dipoLoginButton, .dipoCreateButton {
          min-height: 42px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .dipoLoginButton {
          border: 1px solid var(--dipo-border);
          background: #fff;
        }

        .dipoCreateButton {
          gap: 7px;
          background: var(--dipo-ink);
          color: #fff;
          box-shadow: 0 10px 30px rgba(17, 19, 24, 0.13);
        }

        .dipoCreateButton:hover, .dipoLoginButton:hover {
          transform: translateY(-2px);
        }

        .dipoCreateButton span { font-size: 15px; }

        .dipoHero {
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
          padding: 88px 20px 58px;
          text-align: center;
        }

        .dipoHeroPill {
          width: fit-content;
          margin: 0 auto 22px;
          padding: 10px 17px;
          border: 1px solid var(--dipo-border);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.8);
          color: #5d6572;
          font-size: 14px;
          font-weight: 800;
          box-shadow: 0 8px 30px rgba(17, 19, 24, 0.045);
        }

        .dipoHeroPill span {
          display: inline-block;
          width: 7px;
          height: 7px;
          margin-right: 8px;
          border-radius: 50%;
          background: #111318;
          vertical-align: 1px;
          box-shadow: 0 0 0 5px rgba(17, 19, 24, 0.05);
        }

        .dipoHero h1 {
          margin: 0;
          font-size: clamp(58px, 8.8vw, 116px);
          line-height: 0.88;
          letter-spacing: -0.075em;
          font-weight: 950;
        }

        .dipoHero h1 span {
          background: linear-gradient(
            100deg, #111318 0%, #505867 50%, #111318 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .dipoHeroDescription {
          max-width: 710px;
          margin: 35px auto 0;
          color: #5f6875;
          font-size: 18px;
          line-height: 1.7;
        }

        .dipoHeroStats {
          margin-top: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          color: #89919d;
          font-size: 13px;
        }

        .dipoHeroStats span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .dipoHeroStats b {
          color: var(--dipo-ink);
          font-size: 15px;
        }

        .dipoHeroStats i { color: #d0d4d9; font-style: normal; }

        .dipoSearchArea {
          width: min(1240px, calc(100% - 32px));
          margin: 0 auto;
        }

        .dipoSearchBox {
          position: relative;
          min-height: 70px;
          display: flex;
          align-items: center;
          border: 1px solid #dfe3e8;
          border-radius: 23px;
          background: #fff;
          box-shadow: 0 14px 50px rgba(17, 19, 24, 0.07);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .dipoSearchBox:focus-within {
          border-color: #bfc6d0;
          box-shadow: 0 16px 55px rgba(17, 19, 24, 0.1);
        }

        .dipoSearchIcon {
          width: 64px;
          display: grid;
          place-items: center;
          color: #20242b;
          font-size: 28px;
        }

        .dipoSearchBox input {
          min-width: 0;
          flex: 1;
          height: 68px;
          border: 0;
          outline: 0;
          background: transparent;
          color: #17191d;
          font-size: 17px;
          font-weight: 600;
        }

        .dipoSearchBox input::placeholder {
          color: #9aa4b2;
          font-weight: 500;
        }

        .dipoSearchClear {
          width: 36px;
          height: 36px;
          margin-right: 6px;
          border: 0;
          border-radius: 50%;
          background: #f0f2f5;
          color: #59616d;
          cursor: pointer;
          font-size: 22px;
        }

        .dipoSearchSpark {
          width: 58px;
          display: grid;
          place-items: center;
          color: #929aa6;
          font-size: 17px;
        }

        .dipoCategories {
          width: 100%;
          margin-top: 14px;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 2px 0 8px;
          scrollbar-width: none;
        }

        .dipoCategories::-webkit-scrollbar { display: none; }

        .dipoCategories button {
          flex: 0 0 auto;
          min-height: 43px;
          padding: 0 18px;
          border: 1px solid var(--dipo-border);
          border-radius: 999px;
          background: #fff;
          color: #5d6673;
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          transition: transform 0.2s ease, background 0.2s ease,
            color 0.2s ease, border-color 0.2s ease;
        }

        .dipoCategories button:hover {
          transform: translateY(-2px);
          border-color: #c9ced5;
        }

        .dipoCategories button.active {
          border-color: #111318;
          background: #111318;
          color: #fff;
          box-shadow: 0 9px 25px rgba(17, 19, 24, 0.13);
        }

        .dipoTips {
          width: min(1240px, calc(100% - 32px));
          min-height: 125px;
          margin: 24px auto 72px;
          padding: 22px;
          display: grid;
          grid-template-columns: 58px minmax(0, 1fr) auto;
          align-items: center;
          gap: 17px;
          border: 1px solid var(--dipo-border);
          border-radius: 28px;
          background: linear-gradient(135deg, #ffffff, #fafbfc);
          box-shadow: 0 18px 60px rgba(17, 19, 24, 0.055);
          overflow: hidden;
        }

        .dipoTipsIcon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          background: #111318;
          color: #fff;
          font-size: 24px;
          box-shadow: 0 10px 25px rgba(17, 19, 24, 0.15);
        }

        .dipoTipsContent {
          animation: dipoTipIn 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .dipoTipsContent > span {
          display: block;
          margin-bottom: 5px;
          color: #9aa2ae;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .dipoTipsContent strong {
          display: block;
          font-size: 17px;
          letter-spacing: -0.03em;
        }

        .dipoTipsContent p {
          max-width: 650px;
          margin: 5px 0 0;
          color: #66707d;
          font-size: 12px;
          line-height: 1.5;
        }

        .dipoTipsControls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dipoTipsControls > button {
          width: 36px;
          height: 36px;
          border: 1px solid var(--dipo-border);
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
        }

        .dipoTipsControls > div {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .dipoTipsControls > div button {
          width: 7px;
          height: 7px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: #d7dbe0;
          cursor: pointer;
          transition: width 0.2s ease, background 0.2s ease;
        }

        .dipoTipsControls > div button.active {
          width: 20px;
          background: #111318;
        }

        .dipoFeed {
          width: min(1240px, calc(100% - 32px));
          margin: 0 auto;
        }

        .dipoFeedHeader, .dipoRealHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .dipoFeedHeader > div > span,
        .dipoRealHeader > div > span {
          color: #9aa2ae;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.2em;
        }

        .dipoFeedHeader h2, .dipoRealHeader h2 {
          margin: 6px 0 0;
          font-size: 34px;
          letter-spacing: -0.055em;
          line-height: 1;
        }

        .dipoFeedHeader p, .dipoRealHeader p {
          max-width: 600px;
          margin: 12px 0 0;
          color: #707985;
          font-size: 14px;
          line-height: 1.55;
        }

        .dipoFeedHeader > strong {
          flex: 0 0 auto;
          color: #111318;
          font-size: 13px;
        }

        .dipoPinterestGrid {
          column-count: 4;
          column-gap: 16px;
          width: 100%;
        }

        .dipoPinCard {
          position: relative;
          display: inline-block;
          width: 100%;
          margin: 0 0 17px;
          break-inside: avoid;
          vertical-align: top;
          animation: dipoCardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: calc(var(--card-index) * 35ms);
        }

        .dipoPinImageButton, .dipoPinInfo {
          width: 100%;
          padding: 0;
          border: 0;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .dipoPinImage {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 22px;
          background: #f0f2f5;
          isolation: isolate;
        }

        .dipoPinCard-short .dipoPinImage { aspect-ratio: 0.92; }
        .dipoPinCard-medium .dipoPinImage { aspect-ratio: 0.79; }
        .dipoPinCard-tall .dipoPinImage { aspect-ratio: 0.68; }

        .dipoCharacterImage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .dipoPinImageButton:hover .dipoCharacterImage {
          transform: scale(1.045);
        }

        .dipoPinImageGradient {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.25) 0%,
            transparent 28%,
            transparent 62%,
            rgba(0, 0, 0, 0.5) 100%
          );
        }

        .dipoPinImageTop, .dipoPinImageBottom {
          position: absolute;
          z-index: 2;
          left: 11px;
          right: 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 7px;
        }

        .dipoPinImageTop { top: 11px; }

        .dipoPinImageBottom {
          bottom: 11px;
          color: #fff;
          font-size: 9px;
          font-weight: 800;
        }

        .dipoPinCategory, .dipoPinDemo, .dipoPinLive {
          min-width: 0;
          padding: 7px 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.91);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #2a3038;
          font-size: 8px;
          font-weight: 900;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .dipoPinDemo {
          background: rgba(17, 19, 24, 0.88);
          color: #fff;
        }

        .dipoPinLive { color: #0b6f46; }

        .dipoPinOpenIcon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.94);
          color: #111318;
          font-size: 14px;
          backdrop-filter: blur(10px);
        }

        .dipoPinInfo { padding: 9px 3px 2px; }

        .dipoPinTitleRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .dipoPinTitleRow h3 {
          min-width: 0;
          margin: 0;
          overflow: hidden;
          color: #16191e;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: -0.025em;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .dipoPinArrow {
          flex: 0 0 auto;
          color: #9ca4af;
          font-size: 13px;
        }

        .dipoPinProfession {
          margin: 4px 0 0;
          overflow: hidden;
          color: #727b88;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .dipoPinMeta {
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 5px;
          overflow: hidden;
          color: #a0a7b1;
          font-size: 8px;
          font-weight: 700;
        }

        .dipoPinMeta span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .dipoPinMeta i { font-style: normal; color: #c8ccd1; }
        .dipoRealSection { margin-top: 90px; }

        .dipoLivePill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          border: 1px solid #dfe4e9;
          border-radius: 999px;
          color: #69717d;
          font-size: 11px;
          font-weight: 850;
        }

        .dipoLivePill span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #1c9a66;
          box-shadow: 0 0 0 5px rgba(28, 154, 102, 0.1);
        }

        .dipoEmpty, .dipoError, .dipoRealEmpty {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          border: 1px dashed #dfe3e8;
          border-radius: 28px;
          text-align: center;
          background: #fafbfc;
        }

        .dipoEmpty > div, .dipoError > div, .dipoRealEmpty > span {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          margin-bottom: 13px;
          border-radius: 18px;
          background: #111318;
          color: #fff;
          font-size: 23px;
        }

        .dipoEmpty h3, .dipoError h3, .dipoRealEmpty h3 {
          margin: 0;
          font-size: 19px;
          letter-spacing: -0.03em;
        }

        .dipoEmpty p, .dipoError p, .dipoRealEmpty p {
          max-width: 420px;
          margin: 8px 0 20px;
          color: #7a828e;
          font-size: 13px;
          line-height: 1.55;
        }

        .dipoEmpty button, .dipoError button, .dipoRealEmpty a {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 17px;
          border: 0;
          border-radius: 999px;
          background: #111318;
          color: #fff;
          cursor: pointer;
          font-size: 12px;
          font-weight: 850;
        }

        .dipoError {
          border-style: solid;
          border-color: #eadde0;
          background: #fffafb;
        }

        .dipoError > div { background: #d94c5a; }

        .dipoLoadMore {
          display: flex;
          justify-content: center;
          padding: 34px 0 10px;
        }

        .dipoLoadMore button {
          min-height: 48px;
          padding: 0 21px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid #dce1e6;
          border-radius: 999px;
          background: #fff;
          color: #111318;
          cursor: pointer;
          font-size: 12px;
          font-weight: 850;
          box-shadow: 0 8px 30px rgba(17, 19, 24, 0.055);
        }

        .dipoLoadMore button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .dipoSpinner {
          width: 15px;
          height: 15px;
          border: 2px solid #d7dbe0;
          border-top-color: #111318;
          border-radius: 50%;
          animation: dipoSpin 0.75s linear infinite;
        }

        .dipoSkeletonCard {
          width: 100%;
          margin-bottom: 17px;
          break-inside: avoid;
        }

        .dipoSkeletonImage {
          width: 100%;
          border-radius: 22px;
          background: linear-gradient(90deg, #f0f2f4, #fafafa, #f0f2f4);
          background-size: 220% 100%;
          animation: dipoShimmer 1.5s ease-in-out infinite;
        }

        .dipoSkeleton-short .dipoSkeletonImage { aspect-ratio: 0.92; }
        .dipoSkeleton-medium .dipoSkeletonImage { aspect-ratio: 0.79; }
        .dipoSkeleton-tall .dipoSkeletonImage { aspect-ratio: 0.68; }

        .dipoSkeletonLine {
          height: 12px;
          margin-top: 9px;
          border-radius: 999px;
          background: linear-gradient(90deg, #f0f2f4, #fafafa, #f0f2f4);
          background-size: 220% 100%;
          animation: dipoShimmer 1.5s ease-in-out infinite;
        }

        .dipoSkeletonLine.large { width: 72%; }
        .dipoSkeletonLine.small { width: 45%; height: 8px; }

        .dipoBottomCTA {
          position: relative;
          width: min(1240px, calc(100% - 32px));
          min-height: 330px;
          margin: 100px auto 65px;
          padding: 48px;
          display: flex;
          align-items: center;
          gap: 30px;
          overflow: hidden;
          border-radius: 38px;
          background: radial-gradient(
            circle at 90% 30%,
            rgba(255, 255, 255, 0.13),
            transparent 30%
          ), #111318;
          color: #fff;
        }

        .dipoCTAGlow {
          position: absolute;
          width: 300px;
          height: 300px;
          right: 80px;
          top: -120px;
          border-radius: 50%;
          background: rgba(112, 93, 255, 0.18);
          filter: blur(55px);
        }

        .dipoCTAAvatar {
          position: relative;
          width: 145px;
          height: 145px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 38px;
          background: linear-gradient(145deg, #fff, #dfe4eb);
          color: #111318;
          transform: rotate(-5deg);
          box-shadow: 0 20px 55px rgba(0, 0, 0, 0.22);
        }

        .dipoCTAAvatar > div {
          font-size: 76px;
          font-weight: 950;
          letter-spacing: -0.12em;
        }

        .dipoCTAAvatar span { position: absolute; color: #fff; }

        .dipoCTAAvatar span:nth-child(2) {
          top: 14px;
          right: 18px;
          font-size: 22px;
        }

        .dipoCTAAvatar span:nth-child(3) {
          bottom: 18px;
          left: 18px;
          font-size: 16px;
        }

        .dipoCTAContent { position: relative; z-index: 1; }

        .dipoCTAContent > span {
          color: #a9b1bc;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.2em;
        }

        .dipoCTAContent h2 {
          margin: 8px 0 12px;
          font-size: clamp(36px, 5vw, 62px);
          line-height: 0.96;
          letter-spacing: -0.065em;
        }

        .dipoCTAContent p {
          margin: 0 0 22px;
          color: #aeb5c0;
          font-size: 14px;
        }

        .dipoCTAContent a {
          min-height: 47px;
          padding: 0 19px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border-radius: 999px;
          background: #fff;
          color: #111318;
          font-size: 12px;
          font-weight: 900;
        }

        .dipoCTAGlobe {
          position: relative;
          z-index: 1;
          margin-left: auto;
          font-size: 120px;
          filter: grayscale(1) brightness(1.5);
          opacity: 0.8;
        }

        .dipoFooter {
          width: min(1240px, calc(100% - 32px));
          margin: 0 auto;
          padding: 0 0 42px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: end;
          gap: 30px;
          color: #7d8590;
        }

        .dipoFooter strong {
          color: #111318;
          font-size: 17px;
          font-weight: 900;
        }

        .dipoFooter p { margin: 7px 0 0; font-size: 10px; }

        .dipoFooterLinks {
          display: flex;
          gap: 22px;
          font-size: 11px;
          font-weight: 750;
        }

        .dipoFooterLinks a:hover { color: #111318; }
        .dipoFooterCopyright { text-align: right; }
        .dipoFooterCopyright p { color: #555d68; font-weight: 750; }

        .dipoFooterCopyright small {
          display: block;
          margin-top: 3px;
          font-size: 8px;
          color: #a1a8b1;
        }

        .dipoDemoModal {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .dipoModalBackdrop {
          position: absolute;
          inset: 0;
          background: rgba(10, 12, 16, 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: dipoFadeIn 0.25s ease both;
        }

        .dipoModalSheet {
          position: relative;
          z-index: 1;
          width: min(620px, 100%);
          max-height: calc(100vh - 36px);
          overflow-y: auto;
          border-radius: 32px;
          background: #fff;
          box-shadow: 0 35px 100px rgba(0, 0, 0, 0.25);
          animation: dipoModalIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .dipoModalClose {
          position: absolute;
          z-index: 5;
          top: 13px;
          right: 13px;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          background: rgba(17, 19, 24, 0.78);
          color: #fff;
          cursor: pointer;
          font-size: 25px;
          line-height: 1;
        }

        .dipoModalHero {
          position: relative;
          height: 390px;
          overflow: hidden;
          background: #f1f3f5;
        }

        .dipoModalHeroImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .dipoModalHeroShade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top, rgba(0, 0, 0, 0.72) 0%, transparent 65%
          );
        }

        .dipoModalHeroContent {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 23px;
          color: #fff;
        }

        .dipoModalDemoBadge, .dipoModalCategory {
          display: inline-flex;
          padding: 7px 10px;
          margin-right: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          color: #111318;
          font-size: 9px;
          font-weight: 900;
        }

        .dipoModalDemoBadge { background: #111318; color: #fff; }

        .dipoModalHeroContent h2 {
          margin: 13px 0 2px;
          font-size: 39px;
          line-height: 1;
          letter-spacing: -0.055em;
        }

        .dipoModalHeroContent p {
          margin: 7px 0 0;
          color: #e2e5e9;
          font-size: 13px;
          font-weight: 650;
        }

        .dipoModalBody { padding: 27px; }

        .dipoModalIdentity {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .dipoModalIdentity > div > span, .dipoModalSection > span {
          color: #9ba3ae;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.18em;
        }

        .dipoModalIdentity h3 {
          margin: 5px 0 4px;
          font-size: 26px;
          letter-spacing: -0.045em;
        }

        .dipoModalIdentity p {
          margin: 0;
          color: #69727e;
          font-size: 12px;
          line-height: 1.5;
        }

        .dipoModalLive {
          padding: 8px 11px;
          border-radius: 999px;
          background: #f0f2f4;
          color: #6b7380;
          font-size: 9px;
          font-weight: 900;
        }

        .dipoModalStats {
          margin-top: 23px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid #e5e8ec;
          border-radius: 20px;
          overflow: hidden;
        }

        .dipoModalStats div {
          min-width: 0;
          padding: 16px;
          border-right: 1px solid #e5e8ec;
        }

        .dipoModalStats div:last-child { border-right: 0; }

        .dipoModalStats span {
          display: block;
          color: #9aa2ad;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .dipoModalStats strong {
          display: block;
          margin-top: 5px;
          overflow: hidden;
          color: #252a31;
          font-size: 11px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .dipoModalSection { margin-top: 28px; }

        .dipoModalSection h3 {
          margin: 6px 0 8px;
          font-size: 18px;
          letter-spacing: -0.03em;
        }

        .dipoModalSection p {
          margin: 0;
          color: #626b77;
          font-size: 13px;
          line-height: 1.7;
        }

        .dipoModalTags {
          margin-top: 23px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .dipoModalTags span {
          padding: 8px 11px;
          border: 1px solid #e2e6ea;
          border-radius: 999px;
          color: #68717d;
          font-size: 10px;
          font-weight: 800;
        }

        .dipoModalAction { margin-top: 27px; }

        .dipoModalAction button {
          width: 100%;
          min-height: 50px;
          border: 0;
          border-radius: 17px;
          background: #111318;
          color: #fff;
          cursor: pointer;
          font-size: 12px;
          font-weight: 900;
        }

        .dipoModalDisclaimer {
          margin: 13px 0 0;
          color: #a1a8b2;
          text-align: center;
          font-size: 9px;
          font-weight: 700;
        }

        @keyframes dipoCardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes dipoTipIn {
          from { opacity: 0; transform: translateY(9px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes dipoShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -20% 0; }
        }

        @keyframes dipoSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes dipoFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes dipoModalIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 1050px) {
          .dipoPinterestGrid { column-count: 3; }
          .dipoHeaderNav { display: none; }
        }

        @media (max-width: 700px) {
          .dipoHeader {
            width: calc(100% - 20px);
            min-height: 62px;
            gap: 8px;
          }

          .dipoLogo { font-size: 17px; }
          .dipoHeaderActions { gap: 5px; }

          .dipoLoginButton, .dipoCreateButton {
            min-height: 36px;
            padding: 0 10px;
            font-size: 9px;
          }

          .dipoCreateButton span { font-size: 12px; }

          .dipoHero {
            width: calc(100% - 20px);
            padding: 55px 5px 42px;
          }

          .dipoHeroPill { padding: 9px 13px; font-size: 11px; }
          .dipoHero h1 { font-size: clamp(49px, 15vw, 76px); }

          .dipoHeroDescription {
            margin-top: 25px;
            font-size: 14px;
            line-height: 1.65;
          }

          .dipoHeroStats { gap: 8px; font-size: 9px; }
          .dipoHeroStats b { font-size: 12px; }
          .dipoSearchArea { width: calc(100% - 14px); }

          .dipoSearchBox {
            min-height: 58px;
            border-radius: 19px;
          }

          .dipoSearchIcon { width: 45px; font-size: 24px; }
          .dipoSearchBox input { height: 56px; font-size: 13px; }
          .dipoSearchSpark { width: 39px; }
          .dipoCategories { gap: 6px; }

          .dipoCategories button {
            min-height: 39px;
            padding: 0 14px;
            font-size: 11px;
          }

          .dipoTips {
            width: calc(100% - 14px);
            min-height: 118px;
            margin: 17px auto 45px;
            padding: 16px;
            grid-template-columns: 45px minmax(0, 1fr);
            gap: 12px;
            border-radius: 22px;
          }

          .dipoTipsIcon {
            width: 45px;
            height: 45px;
            border-radius: 14px;
            font-size: 18px;
          }

          .dipoTipsContent > span { font-size: 7px; }
          .dipoTipsContent strong { font-size: 14px; }
          .dipoTipsContent p { font-size: 9px; }

          .dipoTipsControls {
            grid-column: 2;
            justify-content: space-between;
            gap: 5px;
          }

          .dipoTipsControls > button { width: 30px; height: 30px; }
          .dipoFeed { width: calc(100% - 14px); }

          .dipoFeedHeader, .dipoRealHeader {
            align-items: flex-start;
            margin-bottom: 21px;
          }

          .dipoFeedHeader h2, .dipoRealHeader h2 { font-size: 28px; }

          .dipoFeedHeader p, .dipoRealHeader p {
            max-width: 280px;
            margin-top: 8px;
            font-size: 11px;
          }

          .dipoFeedHeader > strong { font-size: 9px; }
          .dipoPinterestGrid { column-count: 2; column-gap: 9px; }
          .dipoPinCard { margin-bottom: 12px; }
          .dipoPinImage { border-radius: 16px; }
          .dipoPinCard-short .dipoPinImage { aspect-ratio: 0.9; }
          .dipoPinCard-medium .dipoPinImage { aspect-ratio: 0.76; }
          .dipoPinCard-tall .dipoPinImage { aspect-ratio: 0.66; }

          .dipoPinImageTop { top: 7px; left: 7px; right: 7px; }
          .dipoPinImageBottom { left: 7px; right: 7px; bottom: 7px; }

          .dipoPinCategory, .dipoPinDemo, .dipoPinLive {
            max-width: 76%;
            padding: 5px 7px;
            font-size: 6.5px;
          }

          .dipoPinOpenIcon {
            width: 23px;
            height: 23px;
            font-size: 11px;
          }

          .dipoPinInfo { padding: 6px 2px 1px; }
          .dipoPinTitleRow h3 { font-size: 11px; }
          .dipoPinArrow { font-size: 10px; }
          .dipoPinProfession { margin-top: 3px; font-size: 8px; }

          .dipoPinMeta {
            margin-top: 3px;
            gap: 3px;
            font-size: 6.5px;
          }

          .dipoRealSection { margin-top: 58px; }
          .dipoLivePill { padding: 7px 9px; font-size: 8px; }

          .dipoBottomCTA {
            width: calc(100% - 14px);
            min-height: 300px;
            margin: 70px auto 45px;
            padding: 26px 20px;
            border-radius: 28px;
            align-items: flex-end;
          }

          .dipoCTAAvatar {
            position: absolute;
            width: 90px;
            height: 90px;
            top: 22px;
            right: 20px;
            border-radius: 25px;
          }

          .dipoCTAAvatar > div { font-size: 47px; }
          .dipoCTAContent h2 { font-size: 36px; }
          .dipoCTAContent p { max-width: 220px; font-size: 11px; }

          .dipoCTAGlobe {
            position: absolute;
            right: -18px;
            bottom: -18px;
            font-size: 110px;
            opacity: 0.16;
          }

          .dipoFooter {
            width: calc(100% - 30px);
            grid-template-columns: 1fr;
            gap: 18px;
            padding-bottom: 35px;
          }

          .dipoFooterLinks { gap: 15px; flex-wrap: wrap; }
          .dipoFooterCopyright { text-align: left; }

          .dipoModalSheet {
            max-height: calc(100vh - 18px);
            border-radius: 25px;
          }

          .dipoModalHero { height: 330px; }

          .dipoModalHeroContent {
            left: 18px;
            right: 18px;
            bottom: 18px;
          }

          .dipoModalHeroContent h2 { font-size: 32px; }
          .dipoModalBody { padding: 20px; }
          .dipoModalStats { grid-template-columns: repeat(3, 1fr); }
          .dipoModalStats div { padding: 11px; }
          .dipoModalStats strong { font-size: 9px; }
        }

        @media (max-width: 390px) {
          .dipoPinterestGrid { column-gap: 7px; }
          .dipoPinTitleRow h3 { font-size: 10px; }
          .dipoPinProfession { font-size: 7px; }
          .dipoPinMeta { font-size: 6px; }
          .dipoHero h1 { font-size: 48px; }
        }

        button:focus-visible,
        a:focus-visible,
        input:focus-visible {
          outline: 3px solid rgba(54, 93, 220, 0.28);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }

          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </>
  );
}