// Single source of truth for member data.
// Keep prose tight + specific; serif-friendly punctuation.

export const members = {
  ed: {
    name: "Ed Butowsky",
    short: "Ed",
    role: "Investment Professional",
    born: 1962,
    tagline: "Two billion in client assets, one disciplined philosophy.",
    paragraphs: [
      "Ed Butowsky began his career at Morgan Stanley, rising to the firm's top producer nationwide and managing more than one billion dollars in client assets. He later founded Chapwood Investments, where he serves as Managing Partner — focused on disciplined investment strategy, market analysis, and risk management.",
      "He earned a B.A. in Communications from the University of Texas at Austin."
    ],
    links: [
      { url: "https://edbutowsky.com/", label: "Website" },
      { url: "https://www.linkedin.com/in/edbutowsky/", label: "LinkedIn" }
    ]
  },
  dani: {
    name: "Dani Butowsky",
    short: "Dani",
    role: "Family · Community",
    born: 1964,
    tagline: "Family first. Community always.",
    paragraphs: [
      "Dani Butowsky has devoted her life to family, community, and service. Raised across multiple locations during her father's military career, she developed adaptability, cultural awareness, and a strong sense of connection from an early age.",
      "After settling in Overland Park, Kansas, she attended the University of Texas at Austin, where she was a member of the Pom Squad. She earned a B.A. in Communications."
    ],
    links: []
  },
  lauren: {
    name: "Lauren Sheppard",
    short: "Lauren",
    role: "Strategic Communications",
    born: 1995,
    tagline: "Sharp messaging for fast-moving brands.",
    paragraphs: [
      "Lauren Sheppard is a strategic communications professional with experience across media strategy, branding, and corporate messaging. A Dallas native, she has worked with respected companies across the city, building a reputation for creativity, clarity, and leadership in fast-paced environments.",
      "She earned a B.J. in Strategic Communications from the University of Missouri."
    ],
    links: [
      { url: "https://www.linkedin.com/in/lauren-butowsky/", label: "LinkedIn" }
    ]
  },
  keaton: {
    name: "Keaton Butowsky",
    short: "Keaton",
    role: "Real Estate · Investment",
    born: 1998,
    tagline: "Models. Markets. Decisions.",
    paragraphs: [
      "Keaton Butowsky is a real estate and investment professional focused on financial modeling, investment analysis, and strategic decision-making across modern capital markets. He is currently pursuing an MBA with a concentration in Investments and Real Estate at Southern Methodist University.",
      "He earned a B.A. in Economics from Vanderbilt University."
    ],
    links: [
      { url: "https://www.linkedin.com/in/keaton-butowsky/", label: "LinkedIn" }
    ]
  },
  ben: {
    name: "Ben Sheppard",
    short: "Ben",
    role: "Finance · Operations",
    born: 1994,
    tagline: "Numbers, brisket, and the Cowboys.",
    paragraphs: [
      "Ben Sheppard is a finance and management professional with a strong quantitative background grounded in analytics, operations, and financial reporting. Outside of work, Ben enjoys barbecuing, cheering on the Dallas Cowboys, and spending time with his pitbull, Marcy.",
      "He earned a B.S. in Logistics from the University of Maryland and an M.S. in Accounting from Texas A&M University–Corpus Christi."
    ],
    links: [
      { url: "https://www.linkedin.com/in/benjamin-sheppard-0aa34487/", label: "LinkedIn" }
    ]
  },
  megan: {
    name: "Megan Williams",
    short: "Megan",
    role: "Social Strategy · Founder",
    born: 2000,
    tagline: "A passion for the arts, built into a business.",
    paragraphs: [
      "Megan Williams is a social media strategist and entrepreneur who turned a lifelong passion for the arts into a growing business. She works as a Social Media Manager at Three Headed Monster while building her own firm, 519 Strategy.",
      "She earned a B.S. in Public Relations from Texas Christian University."
    ],
    links: [
      { url: "https://www.linkedin.com/in/meganwilliams519/", label: "LinkedIn" },
      { url: "https://www.519strategy.com/", label: "519 Strategy" }
    ]
  }
};

// Tree topology: who connects to whom, and which connector renders the relationship label.
export const relationships = [
  { from: "ed",     to: "dani",   label: "Married 1991",     id: "ed-dani" },
  { from: "ed",     to: "lauren", label: null,               id: "ed-lauren" },
  { from: "ed",     to: "keaton", label: null,               id: "ed-keaton" },
  { from: "dani",   to: "lauren", label: null,               id: "dani-lauren" },
  { from: "dani",   to: "keaton", label: null,               id: "dani-keaton" },
  { from: "lauren", to: "ben",    label: "Married 2024",     id: "lauren-ben" },
  { from: "keaton", to: "megan",  label: "Will Marry 2026",  id: "keaton-megan" }
];
