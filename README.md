# butowsky.com

Personal one-page site for Keaton Butowsky. Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## How it works

- Home is a Butowsky wordmark with section links, centered on a large screen.
- Choosing a section slides the nav to the left rail, then the panel in from the right. On small screens the links wrap under the wordmark and the panel is a bottom sheet.
- Butowsky, Escape, or choosing the open section returns home. The scroll wheel and arrow keys move home, Focus, Record, Now, Speaking, Resources, Contact.
- The background is a cursor-reactive dot grid. Nav items ease toward the pointer. `prefers-reduced-motion` collapses the motion.

## Editing

Copy lives in `lib/content.ts`. The page is cream (`#f4f1e8`) with navy ink and a green accent, set in Inter, Overpass, and Overpass Mono.

The Resources link count is read from `https://cre.butowsky.com/modules.json` (`count`, an integer from 1 to 99) and refreshed every hour. Any other response falls back to "Open the free lessons".
