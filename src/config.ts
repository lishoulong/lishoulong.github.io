import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://lishoulong.github.io/",
  author: "Fred Lee",
  base: "",
  desc: "Co-founder at Kiwoo, building AI agents and interactive products.",
  title: "Fred Lee",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/lishoulong",
    linkTitle: "Fred Lee on GitHub",
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/fred-lee-84073276/",
    linkTitle: "Fred Lee on LinkedIn",
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:lishoulong@outlook.com",
    linkTitle: "Email Fred Lee",
    active: true,
  },
];
