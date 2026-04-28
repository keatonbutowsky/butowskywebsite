// Data model for the constellation.
// `pos` = position on the chart (% of viewport, x and y), tuned for desktop.
// `mobilePos` = override on narrow screens.
// `joined` = "birth" or year (for spouses, the marriage year that brought them in).
// `coords` = faux-astronomical readout for the hover HUD (cosmetic).

export const members = {
  ed: {
    short: "Ed",
    name: "Ed Butowsky",
    born: 1962,
    role: "Investment · Markets",
    based: "Plano, TX",
    joined: "birth",
    pos: { x: 26, y: 30 },
    mobilePos: { x: 24, y: 28 },
    coords: "RA 02h 15m · DEC +89° 04'",
    labelSide: "left",
    tagline: "Two billion in client assets, one disciplined philosophy.",
    paragraphs: [
      "Ed Butowsky began his career at Morgan Stanley, rising to the firm's top producer nationwide and managing more than one billion dollars in client assets. He later founded Chapwood Investments, where he serves as Managing Partner — focused on disciplined investment strategy, market analysis, and risk management.",
      "He earned a B.A. in Communications from the University of Texas at Austin."
    ],
    related: ["dani", "lauren", "keaton"],
    links: [
      { url: "https://edbutowsky.com/", label: "Site" },
      { url: "https://www.linkedin.com/in/edbutowsky/", label: "LinkedIn" }
    ]
  },
  dani: {
    short: "Dani",
    name: "Dani Butowsky",
    born: 1964,
    role: "Family · Community",
    based: "Plano, TX",
    joined: "birth",
    pos: { x: 74, y: 30 },
    mobilePos: { x: 76, y: 28 },
    coords: "RA 03h 41m · DEC +87° 12'",
    labelSide: "right",
    tagline: "Family first. Community always.",
    paragraphs: [
      "Dani Butowsky has devoted her life to family, community, and service. Raised across multiple locations during her father's military career, she developed adaptability, cultural awareness, and a strong sense of connection from an early age.",
      "After settling in Overland Park, Kansas, she attended the University of Texas at Austin, where she was a member of the Pom Squad. She earned a B.A. in Communications."
    ],
    related: ["ed", "lauren", "keaton"],
    links: []
  },
  lauren: {
    short: "Lauren",
    name: "Lauren Sheppard",
    born: 1995,
    role: "Strategic Comms",
    based: "Dallas, TX",
    joined: "birth",
    pos: { x: 30, y: 56 },
    mobilePos: { x: 26, y: 52 },
    coords: "RA 05h 22m · DEC +82° 48'",
    labelSide: "left",
    tagline: "Sharp messaging for fast-moving brands.",
    paragraphs: [
      "Lauren Sheppard is a strategic communications professional with experience across media strategy, branding, and corporate messaging. A Dallas native, she has worked with respected companies across the city, building a reputation for creativity, clarity, and leadership in fast-paced environments.",
      "She earned a B.J. in Strategic Communications from the University of Missouri."
    ],
    related: ["ed", "dani", "ben"],
    links: [
      { url: "https://www.linkedin.com/in/lauren-butowsky/", label: "LinkedIn" }
    ]
  },
  keaton: {
    short: "Keaton",
    name: "Keaton Butowsky",
    born: 1998,
    role: "Real Estate · Investment",
    based: "Dallas, TX",
    joined: "birth",
    pos: { x: 70, y: 56 },
    mobilePos: { x: 74, y: 52 },
    coords: "RA 07h 09m · DEC +80° 15'",
    labelSide: "right",
    tagline: "Models. Markets. Decisions.",
    paragraphs: [
      "Keaton Butowsky is a real estate and investment professional focused on financial modeling, investment analysis, and strategic decision-making across modern capital markets. He is currently pursuing an MBA with a concentration in Investments and Real Estate at Southern Methodist University.",
      "He earned a B.A. in Economics from Vanderbilt University."
    ],
    related: ["ed", "dani", "megan"],
    links: [
      { url: "https://www.linkedin.com/in/keaton-butowsky/", label: "LinkedIn" }
    ]
  },
  ben: {
    short: "Ben",
    name: "Ben Sheppard",
    born: 1994,
    role: "Finance · Operations",
    based: "Dallas, TX",
    joined: 2024,
    pos: { x: 14, y: 80 },
    mobilePos: { x: 14, y: 76 },
    coords: "RA 09h 14m · DEC +74° 33'",
    labelSide: "right",
    tagline: "Numbers, brisket, and the Cowboys.",
    paragraphs: [
      "Ben Sheppard is a finance and management professional with a strong quantitative background grounded in analytics, operations, and financial reporting. Outside of work, Ben enjoys barbecuing, cheering on the Dallas Cowboys, and spending time with his pitbull, Marcy.",
      "He earned a B.S. in Logistics from the University of Maryland and an M.S. in Accounting from Texas A&M University–Corpus Christi."
    ],
    related: ["lauren"],
    links: [
      { url: "https://www.linkedin.com/in/benjamin-sheppard-0aa34487/", label: "LinkedIn" }
    ]
  },
  megan: {
    short: "Megan",
    name: "Megan Williams",
    born: 2000,
    role: "Social Strategy · Founder",
    based: "Dallas, TX",
    joined: 2026,
    pos: { x: 86, y: 80 },
    mobilePos: { x: 86, y: 76 },
    coords: "RA 11h 02m · DEC +71° 19'",
    labelSide: "left",
    tagline: "A passion for the arts, built into a business.",
    paragraphs: [
      "Megan Williams is a social media strategist and entrepreneur who turned a lifelong passion for the arts into a growing business. She works as a Social Media Manager at Three Headed Monster while building her own firm, 519 Strategy.",
      "She earned a B.S. in Public Relations from Texas Christian University."
    ],
    related: ["keaton"],
    links: [
      { url: "https://www.linkedin.com/in/meganwilliams519/", label: "LinkedIn" },
      { url: "https://www.519strategy.com/", label: "519 Strategy" }
    ]
  }
};

// Connector lines — each gets drawn at the right scene/time.
// `scene` = scroll-scene index when this line should activate (0-indexed).
// `kind` = "binary" | "lineage" | "projected"
// `label` = text shown at line midpoint (mono uppercase). null = no label.
export const lines = [
  { id: "ed-dani",       from: "ed",     to: "dani",   kind: "binary",   label: "1991", scene: 1 },
  { id: "ed-lauren",     from: "ed",     to: "lauren", kind: "lineage",  label: null,      scene: 2 },
  { id: "ed-keaton",     from: "ed",     to: "keaton", kind: "lineage",  label: null,      scene: 2 },
  { id: "dani-lauren",   from: "dani",   to: "lauren", kind: "lineage",  label: null,      scene: 2 },
  { id: "dani-keaton",   from: "dani",   to: "keaton", kind: "lineage",  label: null,      scene: 2 },
  { id: "lauren-ben",    from: "lauren", to: "ben",    kind: "binary",   label: "2024", scene: 3 },
  { id: "keaton-megan",  from: "keaton", to: "megan",  kind: "binary",   label: "2026", scene: 4 }
];

// Scene metadata — title HUD shows briefly when entering each scene.
export const scenes = [
  { idx: 0, title: "ConstellationCHART · BUTOWSKY",      sub: "INITIALIZE" },
  { idx: 1, title: "GEN · 01 · 1962 — 1991",             sub: "BINARY · ED ⨯ DANI" },
  { idx: 2, title: "GEN · 02 · 1995 — 1998",             sub: "DESCENT · LAUREN · KEATON" },
  { idx: 3, title: "ARRIVAL · 2024",                     sub: "INBOUND · BEN SHEPPARD" },
  { idx: 4, title: "ARRIVAL · 2026",                     sub: "PROJECTED · MEGAN WILLIAMS" },
  { idx: 5, title: "STAR CHART · COMPLETE",              sub: "EXPLORE" }
];

// When does each member become "active" on the chart?
// Used by both scroll-pinned reveal and time-scrub.
export const memberAppearance = {
  ed:     { scene: 1, year: 1962 },
  dani:   { scene: 1, year: 1964 },
  lauren: { scene: 2, year: 1995 },
  keaton: { scene: 2, year: 1998 },
  ben:    { scene: 3, year: 2024 },
  megan:  { scene: 4, year: 2026 }
};

// Year ticks for the time-scrub bar
export const timelineYears = [1962, 1991, 1995, 1998, 2024, 2026];
export const TIME_MIN = 1962;
export const TIME_MAX = 2026;
