"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import DotField from "@/components/DotField";
import Magnetic from "@/components/Magnetic";
import {
  ContactPanel,
  FocusPanel,
  ModulesPanel,
  NowPanel,
  RecordPanel,
  SpeakingPanel,
  ToolkitPanel,
} from "@/components/Panels";
import {
  navLabels,
  panelOrder,
  widePanels,
  type PanelId,
} from "@/lib/content";

const EASE = [0.76, 0, 0.24, 1] as const;
const ORDER: (PanelId | null)[] = [null, ...panelOrder];

const SHELL =
  "fixed z-30 flex flex-col overflow-y-auto bg-[var(--panel)] px-[clamp(2.5rem,6vw,6rem)] py-[clamp(3rem,9vh,7rem)] max-md:inset-x-0 max-md:top-[156px] max-md:bottom-0 max-md:justify-start max-md:border-t max-md:border-[var(--hair)] max-md:pt-6 md:top-0 md:right-0 md:h-full md:border-l md:border-[var(--hair)]";

function PanelBody({
  id,
  item,
  lessonLabel,
}: {
  id: PanelId;
  item: Variants;
  lessonLabel: string;
}) {
  switch (id) {
    case "focus":
      return <FocusPanel item={item} lessonLabel={lessonLabel} />;
    case "record":
      return <RecordPanel item={item} />;
    case "now":
      return <NowPanel item={item} />;
    case "speaking":
      return <SpeakingPanel item={item} />;
    case "modules":
      return <ModulesPanel item={item} lessonLabel={lessonLabel} />;
    case "toolkit":
      return <ToolkitPanel item={item} />;
    case "contact":
      return <ContactPanel item={item} />;
    default: {
      const unreachable: never = id;
      return unreachable;
    }
  }
}

export default function Site({ lessonLabel }: { lessonLabel: string }) {
  const [active, setActive] = useState<PanelId | null>(null);
  const reduced = useReducedMotion();
  const open = active !== null;
  const lockUntil = useRef(0);

  const home = useCallback(() => setActive(null), []);

  const step = useCallback((dir: 1 | -1) => {
    const now = performance.now();
    if (now < lockUntil.current) return;
    setActive((prev) => {
      const index = ORDER.indexOf(prev);
      const next = Math.min(Math.max(index + dir, 0), ORDER.length - 1);
      if (next === index) return prev;
      lockUntil.current = now + 1200;
      return ORDER[next];
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        home();
      } else if (["ArrowDown", "ArrowRight", "PageDown"].includes(event.key)) {
        event.preventDefault();
        step(1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        step(-1);
      }
    };

    const onWheel = (event: WheelEvent) => {
      const target = event.target;
      const section =
        target instanceof Element ? target.closest("section") : null;
      if (section && section.scrollHeight > section.clientHeight + 4) return;
      const delta = event.deltaMode === 1 ? 33 * event.deltaY : event.deltaY;
      if (Math.abs(delta) < 20) return;
      step(delta > 0 ? 1 : -1);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [home, step]);

  const motionTokens = useMemo(() => {
    const still = Boolean(reduced);
    const navDuration = still ? 0.01 : 0.85;
    const panelDuration = still ? 0.01 : 0.8;
    const panelDelay = still ? 0 : 0.55;
    const list: Variants = {
      hidden: {},
      shown: {
        transition: {
          delayChildren: still ? 0 : panelDelay + 0.4,
          staggerChildren: still ? 0 : 0.08,
        },
      },
    };
    const item: Variants = {
      hidden: { opacity: 0, y: 14 },
      shown: {
        opacity: 1,
        y: 0,
        transition: { duration: still ? 0.01 : 0.5, ease: EASE },
      },
    };
    return { navDuration, panelDuration, panelDelay, list, item };
  }, [reduced]);

  return (
    <main className="relative h-dvh w-screen">
      <DotField />
      <div
        className={
          "pointer-events-none fixed inset-0 z-20 flex " +
          (open
            ? "max-md:items-start max-md:justify-center max-md:pt-6 md:items-center md:justify-start md:pl-[clamp(2.5rem,7vw,6rem)]"
            : "max-md:items-start max-md:justify-center max-md:pt-[72px] md:items-center md:justify-center")
        }
      >
        <motion.nav
          layout
          transition={{ duration: motionTokens.navDuration, ease: EASE }}
          aria-label="Sections"
          className={
            "pointer-events-auto flex flex-col " +
            (open ? "max-md:items-center md:items-start" : "items-center")
          }
        >
          <Magnetic strength={0.1} className="w-fit">
            <motion.button
              layout
              transition={{ duration: motionTokens.navDuration, ease: EASE }}
              type="button"
              aria-label="Return home"
              onClick={home}
              className={
                "brand-button font-display border-0 bg-transparent p-0 font-light leading-[0.95] tracking-[-0.02em] text-[var(--ink)] " +
                (open
                  ? "text-[clamp(2.2rem,4.5vw,3.4rem)]"
                  : "text-[clamp(3.2rem,11vw,8rem)]")
              }
            >
              Butowsky
            </motion.button>
          </Magnetic>
          <motion.div
            layout
            transition={{ duration: motionTokens.navDuration, ease: EASE }}
            className={
              "flex gap-[0.55rem] " +
              (open
                ? "mt-[1.1rem] max-md:max-w-[300px] max-md:flex-row max-md:flex-wrap max-md:justify-center max-md:gap-x-[1.3rem] max-md:gap-y-[0.55rem] md:flex-col md:items-start"
                : "mt-[1.6rem] flex-col items-center")
            }
          >
            {panelOrder.map((id) => (
              <Magnetic key={id} strength={0.22} className="w-fit">
                <motion.button
                  layout
                  transition={{
                    duration: motionTokens.navDuration,
                    ease: EASE,
                  }}
                  type="button"
                  className={
                    "subline border-0 bg-transparent" +
                    (open ? " subline-compact" : "")
                  }
                  data-active={active === id}
                  aria-current={active === id ? "true" : undefined}
                  onClick={() => {
                    if (active === id) home();
                    else setActive(id);
                  }}
                >
                  {navLabels[id]}
                </motion.button>
              </Magnetic>
            ))}
          </motion.div>
        </motion.nav>
      </div>
      {panelOrder.map((id) => {
        const isOpen = active === id;
        const wide = widePanels.has(id);
        return (
          <motion.section
            key={id}
            aria-hidden={!isOpen}
            aria-labelledby={`${id}-title`}
            inert={!isOpen}
            initial={false}
            animate={{ x: isOpen ? "0%" : "105%" }}
            transition={{
              duration: motionTokens.panelDuration,
              ease: EASE,
              delay: isOpen ? motionTokens.panelDelay : 0,
            }}
            style={{ pointerEvents: isOpen ? "auto" : "none" }}
            className={
              SHELL +
              (wide
                ? " md:w-[min(72%,1010px)] md:justify-start"
                : " md:w-[min(56%,720px)] md:justify-center")
            }
          >
            <motion.div
              className="panel-body"
              variants={motionTokens.list}
              initial="hidden"
              animate={isOpen ? "shown" : "hidden"}
            >
              <PanelBody
                id={id}
                item={motionTokens.item}
                lessonLabel={lessonLabel}
              />
            </motion.div>
          </motion.section>
        );
      })}
    </main>
  );
}
