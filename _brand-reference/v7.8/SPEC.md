# butowsky.com v7.8 spec (changes since v7.1)

Reference build: `mock-desktop-v7.8.html` and `mock-mobile-v7.8.html` in this folder. Each is ONE full page: Focus, Record and Now (v7.3, unchanged since v7.3), Speaking (v7.8), Toolkit (v7.3) and Contact (existing). Gray caption bars between panels are mock labels only; do not ship them. Asset paths are relative to this folder (`live/site.css` is the live site's CSS, included only so the mock renders).

Global rules: no em dashes anywhere. Never name Swain & Baldwin or 90Ten. No GPA. Never say "underwritten". Totals unchanged: $1.07B Acquired / Developed across 82+ deals; $3.41B Owned and Managed.

## 1. Palette (v7.3, green with navy, light)
| Role | Hex |
|---|---|
| Page background | #f4f1e8 |
| Panel / card background | #faf8f2 |
| Ink (headings, figures) | #0f1c2b |
| Body text | #26323f |
| Muted text (labels, mono, captions) | #4a5462 |
| Accent green (eyebrows, links, chips, active nav underline) | #1e6c41 |
| Hairlines | rgba(15,28,43,.14) |
| Inactive nav text | #3b4640 |
| Thumbnail border | rgba(15,28,43,.16) |
Contrast on #f4f1e8: ink 15.2, body 11.6, muted 6.8, accent 5.7 (all AA or better). Remove the old dark background, grain and glow.

## 2. Fonts (match jackraney.com)
Google Fonts link (exact):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=Overpass:ital,wght@0,300..900;1,300..900&family=Overpass+Mono:wght@400;500&display=swap">
```
- Headings, names, big figures, brand: `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif`, weight 500 (brand 600), letter-spacing -.02em; big totals -.035em with tabular lining numerals.
- Body: `"Overpass", "Helvetica Neue", Arial, sans-serif`, 1.0625rem, line-height 1.55 to 1.6. (The mock maps the middle dot U+00B7 to Helvetica/Arial via an "Overpass Dot" @font-face because Overpass's dot renders oddly; optional.)
- Labels / eyebrows / stat labels / org labels: Overpass 800, .72rem, letter-spacing .14em, uppercase. Eyebrows and org labels in accent green, others muted.
- Mono (dates, numbers): `"Overpass Mono", ui-monospace, Menlo, monospace`, .8rem, muted.

## 3. Logos (brand color, all clickable)
Files in `logos/color/`. Show in brand color (no grayscale filter, full opacity). Each logo is wrapped in `<a class="lg-link" href="..." target="_blank" rel="noopener" aria-label="<Company>: company website">`, with a 2px accent underline on hover.
| Card | File | Link |
|---|---|---|
| Oak Wood | oakwood-wordmark.png | https://www.owproperties.com/ |
| Willow Bridge (duo logo, Willow Bridge mark) | willowbridge-purple.png (#432890) | https://www.willowbridgepc.com/ |
| Willow Bridge (duo logo, Lincoln Property Company mark) | lpc-classic-green.png | https://www.willowbridgepc.com/ (Lincoln also goes to Willow Bridge) |
| Civitas Capital Group | civitas-red.png | https://www.civitascapital.com/ |
| Healthcare Realty | hr-blue.png (#005295; source healthcarerealty.svg) | https://www.healthcarerealty.com/ |
Max heights: Oak Wood 34px (max-width 150px), Willow Bridge 34px, LPC 30px.

## 4. Record panel
- Asset-class table ("By asset class"): NO bars. Just the dollar figure, then the detail line.
- Footnotes:
  1. Healthcare Realty acquisitions from SEC filings, with joint venture buildings at full purchase price.
  2. Civitas mezzanine development volume is self-reported.
  3. Oak Wood figures from the company's schedule of real estate owned (SREO).
  (Footnote 3 ends at "(SREO)." Nothing after it.)
- Card stat strips: labels on one line on desktop (`grid-template-columns:auto auto auto`, nowrap). On mobile `auto 1fr 1fr` with label min-height 2.7em so labels never overlap.
- Card copy, totals and figures: unchanged from v7.1 (see the mock HTML).

## 5. Headshot
`headshot/headshot.jpeg` (400x400 source). Placed in the Focus (hero) panel, left of the "Three territories." text on desktop (grid `13rem 1fr`, gap 2.6rem); on mobile it sits above the text at 9.5rem wide. Cropped 4:5, `object-fit:cover`, `object-position:50% 30%`, radius 2px, alt "Keaton Butowsky".

## 6. Speaking panel (v7.8; copy is final)
Speaking panel is wide on desktop. Eyebrow `SPEAKING`. H2 **In the room.**
Lede: Classes and masterclasses on putting AI to work in real estate, from first prompt to working agent.
Trusted by (label "TRUSTED BY", names in heading font 1.25rem): ULI Los Angeles · SMU Cox School of Business · Lucens Capital

"RECENT TALKS", newest first. Each talk: mono date line "Date · Location", org label (green caps), title (heading font 1.6rem), Format and Audience (two columns), one-line takeaway, 16:9 thumbnail with caption. Desktop: text left, thumbnail right (grid `minmax(0,1fr) 22rem`, gap 2rem). Mobile: thumbnail on top, full width.

| # | Date · Location | Org label | Title | Format | Audience | Takeaway | Thumbnail | Caption |
|---|---|---|---|---|---|---|---|---|
| 1 | Nov 12, 2026 · Dallas | SMU COX MBA | Building Agents | Class | SMU Cox MBA students | From chat to agents: a prompt alone gets a generic answer, context makes it specific, and tools plus a loop let the model act, check the result and go again until the job is done. | speaking-assets/thumb-building-agents-c2a-p3-loop.png | Slide: Agents. Give it tools. |
| 2 | Fall 2026 · Los Angeles | ULI LOS ANGELES | AI for CRE: Data to Deal | Masterclass, Session 04: Claude Cowork | ULI Los Angeles masterclass participants | Automate the boring parts: attendees built a data room check and a property news check in Claude Cowork, then saved each as a scheduled task. | speaking-assets/thumb-uli-title.png | Title slide: Automate the boring parts. |
| 3 | May 2026 · Dallas | SMU COX MBA | Intro to AI | Four-hour session | SMU Cox MBA students | How large language models work, prompting with task, context, format and constraints, why context matters, and what an agent is. | speaking-assets/thumb-intro-to-ai-s14-context.png | Slide: AI knows nothing until you tell it to. |
| 4 | Apr 2026 · Buenos Aires, Argentina | CONSULTING | Lucens Capital | Consulting engagement | Lucens Capital leadership | Built an 18-month AI implementation roadmap for a portfolio company: demand forecasting, labor scheduling and customer sentiment. | speaking-assets/thumb-lucens-how-we-evaluate-ai.png | Slide: How we evaluate AI. |

Thumbnail alt text = caption. Thumbnail style: 16:9, 1px border rgba(15,28,43,.16), radius 3px, white background, soft shadow; caption .8rem muted.

Topics (label "TOPICS", green square bullets, hairline between items):
- How large language models work
- Prompting: task, context, format and constraints
- Giving AI the right context
- Agents: tools and a loop
- Scheduled tasks for real estate work: data room checks and property news
- AI implementation roadmaps for portfolio companies

Book block (label "BOOK KEATON TO SPEAK"): "Classes and masterclasses for real estate teams, family offices and business schools." then link `keaton@butowsky.com` (mailto, heading font 600, 1.3rem, accent green, underlined).

Do NOT include: a "PAST"/"Upcoming" status label, an audience size field, any testimonial or quote block, any [EXAMPLE] placeholder, or any em dash.
Lucens entry: never mention SMU, Cox or the Global Leadership Program (org label is CONSULTING; thumbnail has the SMU logo removed). Never mention restaurants, brands, country of the portfolio company, vendors or a pilot.

## 7. Reference renders (`reference/`)
- butowsky-mock-desktop-v7.3.png, butowsky-mock-mobile-v7.3.png: full pages, v7.3 (all non-Speaking panels are final from these).
- butowsky-mock-desktop-v7.8.png, butowsky-mock-mobile-v7.8.png: full pages, v7.8 (final).
- desktop-04-speaking-part1of2.jpg, part2of2.jpg and mobile-04-speaking-part1of6..6of6.jpg: the final Speaking panel.
