export type PanelId =
  | "focus"
  | "record"
  | "now"
  | "speaking"
  | "modules"
  | "contact";

export const panelOrder: PanelId[] = [
  "focus",
  "record",
  "now",
  "speaking",
  "modules",
  "contact",
];

export const navLabels: Record<PanelId, string> = {
  focus: "Focus",
  record: "Record",
  now: "Now",
  speaking: "Speaking",
  modules: "Resources",
  contact: "Contact",
};

export const widePanels: ReadonlySet<PanelId> = new Set<PanelId>([
  "record",
  "speaking",
]);

export const focus = {
  eyebrow: "Focus",
  headline: "Three territories.",
  items: [
    { idx: "01", title: "Investments" },
    { idx: "02", title: "Real Estate" },
    { idx: "03", title: "Artificial Intelligence" },
  ],
  teaser: {
    label: "Free resources",
    line: "Free interactive lessons, one idea each.",
  },
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
    "Oak Wood figures from the company\u2019s schedule of real estate owned (SREO).",
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
        src: "/logos/oakwood-wordmark.png",
        alt: "Oak Wood Properties",
        width: 1034,
        height: 225,
        variant: "ow" as const,
        href: "https://www.owproperties.com/",
        label: "Oak Wood Properties: company website",
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
            src: "/logos/willowbridge-purple.png",
            alt: "Willow Bridge Property Company",
            width: 276,
            height: 102,
            variant: "wb" as const,
            href: "https://www.willowbridgepc.com/",
            label: "Willow Bridge Property Company: company website",
          },
          {
            src: "/logos/lpc-classic-green.png",
            alt: "Lincoln Property Company",
            width: 400,
            height: 197,
            variant: "lpc" as const,
            href: "https://www.willowbridgepc.com/",
            label: "Lincoln Property Company: company website",
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
        src: "/logos/civitas-red.png",
        alt: "Civitas Capital Group",
        width: 399,
        height: 400,
        variant: "sq" as const,
        href: "https://www.civitascapital.com/",
        label: "Civitas Capital Group: company website",
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
        src: "/logos/hr-blue.png",
        alt: "Healthcare Realty",
        width: 1411,
        height: 400,
        variant: "default" as const,
        href: "https://www.healthcarerealty.com/",
        label: "Healthcare Realty: company website",
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
  eyebrow: "Speaking",
  headline: "In the room.",
  lede: "Classes and masterclasses on putting AI to work in real estate, from first prompt to working agent.",
  trustedLabel: "Trusted by",
  trusted: [
    "ULI Los Angeles",
    "SMU Cox School of Business",
    "Lucens Capital",
  ],
  recentLabel: "Recent talks",
  talks: [
    {
      when: "Nov 12, 2026 \u00b7 Dallas",
      org: "SMU Cox MBA",
      title: "Building Agents",
      format: "Class",
      audience: "SMU Cox MBA students",
      takeaway:
        "From chat to agents: a prompt alone gets a generic answer, context makes it specific, and tools plus a loop let the model act, check the result and go again until the job is done.",
      image: "/speaking/thumb-building-agents-c2a-p3-loop.png",
      caption: "Slide: Agents. Give it tools.",
    },
    {
      when: "Fall 2026 \u00b7 Los Angeles",
      org: "ULI Los Angeles",
      title: "AI for CRE: Data to Deal",
      format: "Masterclass, Session 04: Claude Cowork",
      audience: "ULI Los Angeles masterclass participants",
      takeaway:
        "Automate the boring parts: attendees built a data room check and a property news check in Claude Cowork, then saved each as a scheduled task.",
      image: "/speaking/thumb-uli-refi-chart.png",
      caption: "Refi module from cre.butowsky.com: where the cash goes.",
    },
    {
      when: "May 2026 \u00b7 Dallas",
      org: "SMU Cox MBA",
      title: "Intro to AI",
      format: "Four-hour session",
      audience: "SMU Cox MBA students",
      takeaway:
        "How large language models work, prompting with task, context, format and constraints, why context matters, and what an agent is.",
      image: "/speaking/thumb-intro-to-ai-s14-context.png",
      caption: "Slide: AI knows nothing until you tell it to.",
    },
    {
      when: "Apr 2026 \u00b7 Buenos Aires, Argentina",
      org: "Consulting",
      title: "Lucens Capital",
      format: "Consulting engagement",
      audience: "Lucens Capital leadership",
      takeaway:
        "Built an 18-month AI implementation roadmap for a portfolio company: demand forecasting, labor scheduling and customer sentiment.",
      image: "/speaking/thumb-lucens-how-we-evaluate-ai.png",
      caption: "Slide: How we evaluate AI.",
    },
  ],
  topicsLabel: "Topics",
  topics: [
    "How large language models work",
    "Prompting: task, context, format and constraints",
    "Giving AI the right context",
    "Agents: tools and a loop",
    "Scheduled tasks for real estate work: data room checks and property news",
    "AI implementation roadmaps for portfolio companies",
  ],
  bookLabel: "Book Keaton to speak",
  book: "Classes and masterclasses for real estate teams, family offices and business schools.",
  email: "keaton@butowsky.com",
};

export const modules = {
  eyebrow: "Free Resources",
  headline: "The legal pad, turned interactive.",
  lede: "I\u2019ve drawn the same pictures on a legal pad for every intern and new analyst I\u2019ve trained in commercial real estate. So I turned them into free interactive modules. Drag the inputs and watch the deal change. Best on desktop.",
  href: "https://cre.butowsky.com",
};
