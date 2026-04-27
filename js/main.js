// butowsky.com — main script
// - hero wordmark per-letter reveal + variable-font weight breathing on scroll
// - tree connector lines drawn between portraits, animated in on intersection
// - relationship label placement along midpoints of connector lines
// - hash-routed bio overlay
// - custom cursor (desktop only)
// - reduced-motion respected

import { members, relationships } from "./data.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer  = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ------------------------------------------------------------
   1. Hero wordmark — per-letter reveal
   ------------------------------------------------------------ */
function buildWordmark() {
  const el = document.querySelector(".hero-wordmark");
  if (!el) return;
  const word = "Butowsky";
  el.innerHTML = "";
  word.split("").forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = ch;
    span.style.setProperty("--i", i);
    el.appendChild(span);
  });
}

/* ------------------------------------------------------------
   2. Variable-font weight modulation as the user scrolls past hero
   ------------------------------------------------------------ */
function bindWordmarkBreathing() {
  if (reduceMotion) return;
  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  let raf = null;
  const update = () => {
    const rect = hero.getBoundingClientRect();
    // progress 0 -> 1 as hero exits viewport
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
    const weight = Math.round(280 + progress * 320); // 280 -> 600
    const opsz   = Math.round(144 - progress * 50);  // tighter optical size as it shrinks
    root.style.setProperty("--wm-weight", weight);
    const wm = document.querySelector(".hero-wordmark");
    if (wm) {
      wm.style.fontVariationSettings = `"opsz" ${opsz}, "SOFT" ${30 + progress*40}, "WONK" 0, "wght" ${weight}`;
    }
    raf = null;
  };
  window.addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }, { passive: true });
  update();
}

/* ------------------------------------------------------------
   3. Hero parallax (foreground photo drifts up slower than scroll)
   ------------------------------------------------------------ */
function bindHeroParallax() {
  if (reduceMotion) return;
  const img = document.querySelector(".hero-photo img");
  if (!img) return;
  let raf = null;
  const update = () => {
    const y = window.scrollY;
    const dy = Math.min(140, y * 0.18);
    img.style.transform = `scale(1.06) translate3d(0, ${dy}px, 0)`;
    raf = null;
  };
  window.addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }, { passive: true });
  update();
}

/* ------------------------------------------------------------
   4. Interlude quote reveal on scroll
   ------------------------------------------------------------ */
function bindInterlude() {
  const stage = document.querySelector(".interlude-stage");
  const quote = document.querySelector(".interlude-quote");
  if (!stage || !quote) return;
  const update = () => {
    const rect = stage.getBoundingClientRect();
    // Reveal quote when stage roughly centered
    const vh = window.innerHeight;
    const center = rect.top + rect.height / 2;
    const dist = Math.abs(center - vh / 2);
    const op = Math.max(0, 1 - dist / (vh * 0.6));
    quote.style.setProperty("--quote-op", op.toFixed(3));
    quote.style.setProperty("--quote-y", `${(1 - op) * 24}px`);
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* ------------------------------------------------------------
   5. Tree connector lines + label positioning
   ------------------------------------------------------------ */
function getCenter(el, refRect) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left - refRect.left + r.width / 2,
    y: r.top  - refRect.top  + r.height / 2
  };
}

function drawTreeLines() {
  const tree = document.getElementById("tree");
  const svg  = document.getElementById("treeSvg");
  if (!tree || !svg) return;
  const refRect = tree.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${refRect.width} ${refRect.height}`);
  svg.setAttribute("width", refRect.width);
  svg.setAttribute("height", refRect.height);

  const centers = {};
  for (const id of Object.keys(members)) {
    const node = tree.querySelector(`.member.${id} .member-portrait`);
    if (node) centers[id] = getCenter(node, refRect);
  }

  const ns = "http://www.w3.org/2000/svg";

  for (const rel of relationships) {
    const a = centers[rel.from], b = centers[rel.to];
    if (!a || !b) continue;

    // Reuse existing path if present (preserves .in class + dashoffset state)
    let path = svg.querySelector(`path[data-rel="${rel.id}"]`);
    if (!path) {
      path = document.createElementNS(ns, "path");
      path.setAttribute("class", "line");
      path.dataset.rel = rel.id;
      svg.appendChild(path);
    }

    const dx = b.x - a.x, dy = b.y - a.y;
    const c1x = a.x + dx * 0.25;
    const c1y = a.y + dy * 0.55;
    const c2x = a.x + dx * 0.75;
    const c2y = a.y + dy * 0.45;
    path.setAttribute("d", `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`);
    const length = Math.hypot(dx, dy) * 1.05;
    path.style.setProperty("--len", length.toFixed(0));

    if (rel.label) {
      const label = tree.querySelector(`.rel-label[data-rel="${rel.id}"]`);
      if (label) {
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        label.style.left = `${mx}px`;
        label.style.top  = `${my}px`;
      }
    }
  }
}

/* ------------------------------------------------------------
   6. Reveal members + lines as they enter viewport
   ------------------------------------------------------------ */
function bindReveal() {
  const tree = document.getElementById("tree");
  if (!tree) return;
  const members = tree.querySelectorAll(".member");
  const lines   = () => document.querySelectorAll(".line");
  const labels  = () => document.querySelectorAll(".rel-label");

  if (reduceMotion) {
    members.forEach(m => m.classList.add("in"));
    lines().forEach(l => l.classList.add("in"));
    labels().forEach(l => l.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        // Reveal corresponding lines a beat later
        const id = e.target.dataset.id;
        if (id) {
          setTimeout(() => {
            relationships.forEach(rel => {
              if (rel.from === id || rel.to === id) {
                document.querySelector(`.line[data-rel="${rel.id}"]`)?.classList.add("in");
                document.querySelector(`.rel-label[data-rel="${rel.id}"]`)?.classList.add("in");
              }
            });
          }, 220);
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4, rootMargin: "0px 0px -10% 0px" });

  members.forEach(m => io.observe(m));
}

/* ------------------------------------------------------------
   7. Bio overlay — hash-routed
   ------------------------------------------------------------ */
function buildBioImage(member) {
  const id = idOf(member);
  return `
    <source type="image/webp" srcset="img/portraits/${id}-640.webp 640w, img/portraits/${id}-1024.webp 1024w" sizes="(max-width: 860px) 100vw, 50vw" />
    <img src="img/portraits/${id}-1024.jpg" alt="${member.name}" />
  `;
}
function idOf(member) {
  return Object.keys(members).find(k => members[k] === member);
}

const bio = document.getElementById("bio");
const bioImg = document.getElementById("bioImg");
const bioRole = document.getElementById("bioRole");
const bioName = document.getElementById("bioName");
const bioTag  = document.getElementById("bioTagline");
const bioBody = document.getElementById("bioBody");
const bioLinks = document.getElementById("bioLinks");

function openBio(id, push = true) {
  const m = members[id];
  if (!m || !bio) return;
  bioImg.innerHTML = buildBioImage(m);
  bioRole.textContent = `${m.role} · b. ${m.born}`;
  bioName.textContent = m.name;
  bioTag.textContent  = m.tagline || "";
  bioBody.innerHTML = "";
  m.paragraphs.forEach(p => {
    const el = document.createElement("p");
    el.textContent = p;
    bioBody.appendChild(el);
  });
  bioLinks.innerHTML = "";
  (m.links || []).forEach(l => {
    const a = document.createElement("a");
    a.href = l.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.textContent = l.label;
    bioLinks.appendChild(a);
  });

  bio.hidden = false;
  // next frame so the transition runs
  requestAnimationFrame(() => bio.classList.add("open"));
  document.body.style.overflow = "hidden";
  if (push) history.replaceState(null, "", `#${id}`);
  document.title = `${m.name} · Butowsky`;
  bioName.focus?.();
}

function closeBio(push = true) {
  if (!bio) return;
  bio.classList.remove("open");
  document.body.style.overflow = "";
  if (push) history.replaceState(null, "", "#");
  document.title = "Butowsky";
  setTimeout(() => { bio.hidden = true; }, 480);
}

function bindBioRouting() {
  document.querySelectorAll(".member").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (members[id]) {
        if (document.startViewTransition) {
          document.startViewTransition(() => openBio(id));
        } else {
          openBio(id);
        }
      }
    });
  });

  document.getElementById("bioClose")?.addEventListener("click", () => closeBio());
  bio?.addEventListener("click", (e) => { if (e.target === bio) closeBio(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBio(); });

  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "");
    if (members[id]) openBio(id, false); else closeBio(false);
  });

  const initial = location.hash.replace("#", "");
  if (members[initial]) openBio(initial, false);
}

/* ------------------------------------------------------------
   8. Custom cursor
   ------------------------------------------------------------ */
function bindCursor() {
  if (!finePointer || reduceMotion) return;
  const c = document.getElementById("cursor");
  const lbl = document.getElementById("cursorLabel");
  if (!c || !lbl) return;

  let tx = 0, ty = 0, x = 0, y = 0, running = false;
  window.addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!running) { running = true; requestAnimationFrame(tick); }
  });

  const tick = () => {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    c.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    lbl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) {
      running = false; return; // idle
    }
    requestAnimationFrame(tick);
  };

  const expandTargets = "button, a, .member";
  document.addEventListener("mouseover", (e) => {
    const t = e.target.closest(expandTargets);
    if (!t) return;
    c.classList.add("expanded");
    if (t.classList.contains("member")) {
      lbl.textContent = "View";
      lbl.classList.add("visible");
    }
  });
  document.addEventListener("mouseout", (e) => {
    const t = e.target.closest(expandTargets);
    if (!t) return;
    c.classList.remove("expanded");
    lbl.classList.remove("visible");
  });
}

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
function boot() {
  buildWordmark();
  bindWordmarkBreathing();
  bindHeroParallax();
  bindInterlude();
  drawTreeLines();
  bindReveal();
  bindBioRouting();
  bindCursor();

  // Recompute lines after fonts/images load + on resize
  window.addEventListener("load", drawTreeLines);
  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(drawTreeLines, 120);
  });
  // Image load events also nudge tree positions
  document.querySelectorAll(".member img").forEach(img => {
    img.addEventListener("load", () => drawTreeLines(), { once: true });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
