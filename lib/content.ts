export type PanelId =
  | "focus"
  | "record"
  | "now"
  | "speaking"
  | "toolkit"
  | "contact";

export const panelOrder: PanelId[] = [
  "focus",
  "record",
  "now",
  "speaking",
  "toolkit",
  "contact",
];

export const navLabels: Record<PanelId, string> = {
  focus: "Focus",
  record: "Record",
  now: "Now",
  speaking: "Speaking",
  toolkit: "Toolkit",
  contact: "Contact",
};

export const widePanels: ReadonlySet<PanelId> = new Set<PanelId>(["record"]);

export const focus = {
  eyebrow: "Focus",
  headline: "Three territories.",
  items: [
    { idx: "01", title: "Investments" },
    { idx: "02", title: "Real Estate" },
    { idx: "03", title: "Artificial Intelligence" },
  ],
};

export const contact = {
  eyebrow: "Contact",
  headline: "The door is open.",
  email: "keaton@butowsky.com",
  linkedin: "https://www.linkedin.com/in/keaton-butowsky/",
  location: "Dallas, Texas",
};

export type TextPart = string | { bold: string };

export type TotalLine = {
  text: string;
  note?: 1 | 2 | 3;
  plus?: boolean;
};

export const record = {
  eyebrow: "Record",
  totals: [
    {
      label: "Acquired / Developed",
      figure: "$1.07B",
      lines: [
        { text: "$574M medical office, Healthcare Realty, 27 deals", note: 1 },
        {
          text: "$300M mezzanine development, Civitas, 40+ deals",
          note: 2,
          plus: true,
        },
        {
          text: "$194M manufactured housing and RV, Oak Wood, 15 deals",
          note: 3,
          plus: true,
        },
      ] satisfies TotalLine[],
      sub: "82+ deals",
    },
    {
      label: "Owned and Managed",
      figure: "$3.41B",
      lines: [
        { text: "$1.8B multifamily fund, Willow Bridge, 13 properties" },
        {
          text: "$1.1B manufactured housing and RV, Oak Wood",
          note: 3,
          plus: true,
        },
        { text: "$500M New York office mezzanine loan, Civitas", plus: true },
        { text: "$10M office building, Civitas", plus: true },
      ] satisfies TotalLine[],
      sub: "Funds, portfolios and loans",
    },
  ],
  assetTitle: "By asset class",
  columns: ["Acquired / Developed", "Owned and Managed"] as const,
  assets: [
    {
      name: "Office and medical office",
      acquired: {
        figure: "$574M",
        width: 100,
        detail: "27 deals, 32 medical office buildings at Healthcare Realty",
      },
      managed: {
        figure: "$510M",
        width: 28.3,
        detail:
          "$500M mezzanine construction loan on a 1.6M SF New York tower, plus a $10M office building",
      },
    },
    {
      name: "Multifamily",
      acquired: {
        figure: "$300M",
        width: 52.3,
        detail: "40+ mezzanine development deals at Civitas",
      },
      managed: {
        figure: "$1.8B",
        width: 100,
        detail: "Willow Bridge fund, 13 properties",
      },
    },
    {
      name: "Manufactured housing and RV",
      acquired: {
        figure: "$194M",
        width: 33.8,
        detail: "15 deals, 1,601 sites at Oak Wood",
      },
      managed: {
        figure: "$1.1B",
        width: 61.1,
        detail: "Oak Wood portfolio, 82 communities",
      },
    },
  ],
  notes: [
    "Healthcare Realty acquisitions from SEC filings, with joint venture buildings at full purchase price.",
    "Civitas mezzanine development volume is self-reported.",
    "Oak Wood figures from the company\u2019s schedule of real estate owned (SREO). Bars scale within each column.",
  ],
  currentLabel: "Current",
  current: [
    {
      letters: "FO",
      lead: "AI implementation lead for a confidential family office",
      sub: "Rebuilding insurance operations, invoicing and accounting as AI systems, and asset managing its real estate portfolio.",
    },
    {
      letters: "DV",
      lead: "Advisor, Dani Ventures",
      sub: "Portfolio analysis and models for family offices across developments, single-family rental portfolios and private funds.",
    },
  ],
  previousLabel: "Previously",
  previous: [
    {
      name: "Oak Wood Ventures",
      title: "Senior Analyst, promoted to Associate, Acquisitions",
      logo: {
        type: "image" as const,
        src: "/logos/owproperties.png",
        alt: "Oak Wood Ventures",
        width: 1034,
        height: 225,
        variant: "ow" as const,
      },
      stats: [
        { label: "Deals", value: "15" },
        { label: "Acquired / Developed", value: "$194M", detail: "1,601 sites" },
        { label: "Owned and Managed", value: "$1.1B", detail: "82 communities" },
      ],
      summary: [
        "Acquired ",
        { bold: "15" },
        " manufactured housing and RV communities for ",
        { bold: "$194M" },
        ", growing an 82-community, ",
        { bold: "$1.1B" },
        " portfolio. Sourced the deals, then recapitalized, refinanced and ran operations.",
      ] satisfies TextPart[],
      chips: ["Manufactured housing", "RV parks"],
    },
    {
      name: "Willow Bridge Property Company",
      title: "Analyst, Investments \u00b7 formerly Lincoln Property Company",
      logo: {
        type: "duo" as const,
        marks: [
          {
            src: "/logos/willowbridge.png",
            alt: "Willow Bridge Property Company",
            width: 276,
            height: 102,
            variant: "wb" as const,
          },
          {
            src: "/logos/lpc-classic.png",
            alt: "Lincoln Property Company",
            width: 400,
            height: 197,
            variant: "lpc" as const,
          },
        ],
      },
      stats: [
        { label: "Properties", value: "13" },
        {
          label: "Owned and Managed",
          value: "$1.8B",
          detail: "multifamily fund",
        },
      ],
      summary: [
        "Managed performance across ",
        { bold: "13 properties" },
        " in the ",
        { bold: "$1.8B" },
        " multifamily fund formed when Ontario Teachers\u2019 acquired Lincoln. Reported to LPs and fund leadership every quarter.",
      ] satisfies TextPart[],
      chips: ["Multifamily"],
    },
    {
      name: "Civitas Capital Group",
      title: "Analyst, Investments",
      logo: {
        type: "image" as const,
        src: "/logos/civitas.png",
        alt: "Civitas Capital Group",
        width: 399,
        height: 400,
        variant: "sq" as const,
      },
      stats: [
        { label: "Deals", value: "40+" },
        {
          label: "Acquired / Developed",
          value: "$300M",
          detail: "mezzanine development",
        },
        {
          label: "Owned and Managed",
          value: "$510M",
          detail: "loan and office building",
        },
      ],
      summary: [
        "Originated ",
        { bold: "$300M" },
        " of mezzanine development across ",
        { bold: "40+" },
        " deals, $20M to $120M each. Asset managed a ",
        { bold: "$500M" },
        " construction loan on a 1.6M SF Class A+ New York office tower and a ",
        { bold: "$10M" },
        " office building.",
      ] satisfies TextPart[],
      chips: ["Multifamily", "Office"],
    },
    {
      name: "Healthcare Realty",
      title: "Analyst, Investments",
      logo: {
        type: "image" as const,
        src: "/logos/healthcarerealty.png",
        alt: "Healthcare Realty",
        width: 1411,
        height: 400,
        variant: "default" as const,
      },
      stats: [
        { label: "Deals", value: "27" },
        {
          label: "Acquired / Developed",
          value: "$574M",
          detail: "32 buildings, 1.59M SF",
        },
        {
          label: "Platform",
          value: "$4.69B",
          detail: "public REIT, 227 properties",
        },
      ],
      summary: [
        "Executed ",
        { bold: "27" },
        " medical office acquisitions, ",
        { bold: "$574M" },
        " across 32 buildings in ",
        { bold: "14 markets" },
        ". Built the diligence, valuation models and investment memoranda behind each one.",
      ] satisfies TextPart[],
      chips: ["Medical office"],
    },
  ],
};

export type Entry = {
  idx: string;
  title: string;
  meta?: string[];
  description?: string;
};

export const now = {
  eyebrow: "Now",
  headline: "Real estate, rebuilt with AI.",
  items: [
    {
      idx: "01",
      title: "AI implementation",
      meta: ["A confidential family office"],
      description:
        "AI implementation lead. Manual workflows in insurance operations, invoicing and accounting, rebuilt as AI systems. Asset manager for its single-family rental portfolio.",
    },
    {
      idx: "02",
      title: "Dani Ventures",
      meta: ["Advisor"],
      description:
        "Underwriting, portfolio analysis and models for family offices: developments, single-family rental portfolios, private funds.",
    },
    {
      idx: "03",
      title: "Teaching",
      meta: ["cre.butowsky.com"],
      description: "Interactive CRE modules with a built-in AI tutor.",
    },
    {
      idx: "04",
      title: "SMU Cox",
      meta: ["MBA candidate"],
    },
  ] satisfies Entry[],
};

export const speaking = {
  eyebrow: "Featured speaking",
  headline: "In the room.",
  trustedLabel: "Trusted by",
  trusted: ["ULI Los Angeles", "SMU Cox"],
  items: [
    {
      idx: "01",
      title: "Building Agents",
      // Held Thursday, Nov 12, 2026. Shown as a past session, same shape as the others.
      meta: ["SMU Cox MBA", "Nov 2026"],
      description: "A class for MBA students on building AI agents.",
    },
    {
      idx: "02",
      title: "AI for CRE: Data to Deal",
      meta: ["ULI Los Angeles", "Masterclass", "Fall 2026"],
      description:
        "Speaker in ULI Los Angeles\u2019s masterclass on AI for commercial real estate. Ran the October 13 Cowork session.",
    },
    {
      idx: "03",
      title: "Intro to AI",
      meta: ["SMU Cox MBA", "Four-hour session", "May 2026"],
      description: "A four-hour introduction to AI for MBA students.",
    },
  ] satisfies Entry[],
};

export const toolkit = {
  eyebrow: "Toolkit",
  headline: "Both sides of the desk.",
  items: [
    {
      idx: "01",
      title: "Underwriting",
      description:
        "ARGUS Enterprise, CoStar, Real Capital Analytics, Yardi, RealPage, Juniper Square.",
    },
    {
      idx: "02",
      title: "Building",
      description: "Claude Code, Cursor, agent orchestration.",
    },
  ] satisfies Entry[],
};
