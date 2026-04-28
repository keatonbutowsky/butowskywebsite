// butowsky.com — constellation
// Restrained: stars + names, soft connectors, italic-serif year labels.
// Scenes drive what's visible. Time-scrub overrides. Surveyed counter rewards exploration.

import { members, lines, memberAppearance, timelineYears, TIME_MIN, TIME_MAX } from "./data.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isNarrow     = () => window.matchMedia("(max-width: 860px)").matches;

const sky        = document.getElementById("sky");
const chart      = document.getElementById("chart");
const chartSvg   = document.getElementById("chartSvg");
const heroStage  = document.getElementById("heroStage");
const hudCounter = document.getElementById("hudCounter");
const layers = document.querySelectorAll(".starfield");
const shootingStarsEl = document.getElementById("shootingStars");

const NS = "http://www.w3.org/2000/svg";

// State
const surveyed = new Set();
let currentScene = 0;
let scrubMode = false;
let scrubYear = TIME_MAX;
let chartComplete = false;

/* ============================================================
   1. Render stars
   ============================================================ */
function renderStars() {
  Object.entries(members).forEach(([id, m]) => {
    const star = document.createElement("button");
    star.className = `star label-${m.labelSide || "right"}`;
    star.dataset.id = id;
    star.setAttribute("aria-label", `View ${m.name}`);

    const marker = document.createElement("span");
    marker.className = "star-marker";
    star.appendChild(marker);

    const label = document.createElement("span");
    label.className = "star-label";
    label.textContent = m.name;
    star.appendChild(label);

    chart.appendChild(star);
    positionStar(star, m);
    star.addEventListener("click", () => openBio(id));
  });
}

function positionStar(star, m) {
  const p = isNarrow() ? (m.mobilePos || m.pos) : m.pos;
  star.style.left = p.x + "%";
  star.style.top  = p.y + "%";
}

function repositionAllStars() {
  document.querySelectorAll(".star").forEach(star => {
    const m = members[star.dataset.id];
    if (m) positionStar(star, m);
  });
}

/* ============================================================
   2. Render lines
   ============================================================ */

function getStarCenter(id, refRect) {
  // Use the marker child, not the whole .star button (which includes the
  // alongside name label and would offset the center toward the label side).
  const marker = chart.querySelector(`.star[data-id="${id}"] .star-marker`);
  if (!marker) return null;
  const r = marker.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - refRect.left,
    y: r.top  + r.height / 2 - refRect.top
  };
}

function renderLines() {
  const refRect = chart.getBoundingClientRect();
  chartSvg.setAttribute("viewBox", `0 0 ${refRect.width} ${refRect.height}`);
  chartSvg.setAttribute("width", refRect.width);
  chartSvg.setAttribute("height", refRect.height);

  for (const line of lines) {
    const a = getStarCenter(line.from, refRect);
    const b = getStarCenter(line.to, refRect);
    if (!a || !b) continue;

    let path = chartSvg.querySelector(`path[data-id="${line.id}"]`);
    if (!path) {
      path = document.createElementNS(NS, "path");
      path.dataset.id = line.id;
      path.setAttribute("class", `line ${line.kind}`);
      chartSvg.appendChild(path);
    }
    const dx = b.x - a.x, dy = b.y - a.y;
    const c1x = a.x + dx * 0.35;
    const c1y = a.y + dy * 0.55;
    const c2x = a.x + dx * 0.65;
    const c2y = a.y + dy * 0.45;
    path.setAttribute("d", `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`);
    const length = Math.hypot(dx, dy) * 1.08;
    path.style.setProperty("--len", length.toFixed(0));

    if (line.label) {
      let label = chart.querySelector(`.line-label[data-id="${line.id}"]`);
      if (!label) {
        label = document.createElement("span");
        label.className = `line-label ${line.kind}`;
        label.dataset.id = line.id;
        label.textContent = line.labelText || line.label.replace(/^M\.\s*/, "");
        chart.appendChild(label);
      }
      label.style.left = ((a.x + b.x) / 2) + "px";
      label.style.top  = ((a.y + b.y) / 2) + "px";
    }
  }

  // Binary orbits
  ["ed-dani", "lauren-ben", "keaton-megan"].forEach(id => {
    const line = lines.find(l => l.id === id);
    if (!line) return;
    let orb = chart.querySelector(`.binary-orbit[data-id="${id}"]`);
    if (!orb) {
      orb = document.createElement("div");
      orb.className = `binary-orbit ${line.kind === "projected" ? "projected" : ""}`;
      orb.dataset.id = id;
      chart.appendChild(orb);
    }
    const a = getStarCenter(line.from, refRect);
    const b = getStarCenter(line.to, refRect);
    if (!a || !b) return;
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2;
    const radius = Math.hypot(b.x - a.x, b.y - a.y) * 0.62;
    orb.style.left = cx + "px";
    orb.style.top  = cy + "px";
    orb.style.width  = (radius * 2) + "px";
    orb.style.height = (radius * 2) + "px";
  });
}

/* ============================================================
   3. Scene state
   ============================================================ */

function applySceneState(sceneIdx, animateChange = true) {
  if (scrubMode) return;
  const previousScene = currentScene;
  currentScene = sceneIdx;

  Object.entries(memberAppearance).forEach(([id, app]) => {
    const star = chart.querySelector(`.star[data-id="${id}"]`);
    if (!star) return;
    star.classList.toggle("active", app.scene <= sceneIdx);
  });

  lines.forEach(line => {
    const path = chartSvg.querySelector(`path[data-id="${line.id}"]`);
    if (path) path.classList.toggle("active", line.scene <= sceneIdx);
    const lbl = chart.querySelector(`.line-label[data-id="${line.id}"]`);
    if (lbl) lbl.classList.toggle("active", line.scene <= sceneIdx);
  });

  ["ed-dani", "lauren-ben", "keaton-megan"].forEach(id => {
    const line = lines.find(l => l.id === id);
    if (!line) return;
    const orb = chart.querySelector(`.binary-orbit[data-id="${id}"]`);
    if (orb) orb.classList.toggle("active", line.scene <= sceneIdx);
  });

  if (animateChange && sceneIdx > previousScene) {
    if (sceneIdx === 3) launchShootingStar("ben",   "lauren");
    if (sceneIdx === 4) launchShootingStar("megan", "keaton");
  }

  // Auto-advance the scrub handle to track scene progression unless user
  // has taken manual control (scrubMode = true).
  const yearForScene = [1962, 1991, 1998, 2024, 2026, 2026];
  if (!scrubMode && typeof setScrubPosition === "function") {
    setScrubPosition(yearForScene[sceneIdx] ?? 2026, false);
  }
}

function bindSceneObserver() {
  const sceneEls = document.querySelectorAll(".scene");
  const io = new IntersectionObserver((entries) => {
    let best = null;
    entries.forEach(e => {
      if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
    });
    if (best) {
      const idx = parseInt(best.target.dataset.scene, 10);
      applySceneState(idx, true);
    }
  }, {
    rootMargin: "-30% 0px -30% 0px",
    threshold: [0, 0.25, 0.5, 0.75, 1]
  });
  sceneEls.forEach(el => io.observe(el));
}

/* ============================================================
   4. Hero fade — pure scroll-driven CSS variable
   ============================================================ */

function bindHeroFade() {
  let raf = null;
  const update = () => {
    const vh = window.innerHeight;
    // Fade from 1 to 0 as user scrolls from 0 to 0.85 viewports
    const k = Math.max(0, Math.min(1, window.scrollY / (vh * 0.85)));
    document.documentElement.style.setProperty("--hero-fade", String(1 - k));
    raf = null;
  };
  window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  update();
}

/* ============================================================
   5. Shooting star
   ============================================================ */

function launchShootingStar(arrivingId /*, partnerId */) {
  if (reduceMotion) return;
  const refRect = chart.getBoundingClientRect();
  const target  = getStarCenter(arrivingId, refRect);
  if (!target) return;

  const star = document.createElement("div");
  star.className = "shooting-star";
  const fromLeft = (target.x < refRect.width / 2);
  const startX = fromLeft ? -160 : refRect.width + 160;
  const startY = target.y - 80;
  const angle  = Math.atan2(target.y - startY, target.x - startX) * 180 / Math.PI;

  star.style.left = startX + "px";
  star.style.top  = startY + "px";
  star.style.transform = `translate(-100%, -50%) rotate(${angle}deg)`;
  shootingStarsEl.appendChild(star);

  const dur = 1500;
  const start = performance.now();
  function step(t) {
    const k = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - k, 3);
    const x = startX + (target.x - startX) * eased;
    const y = startY + (target.y - startY) * eased;
    star.style.left = x + "px";
    star.style.top  = y + "px";
    star.style.opacity = (k < 0.15) ? (k / 0.15) : (k > 0.85 ? (1 - (k - 0.85) / 0.15) : 1);
    if (k < 1) requestAnimationFrame(step);
    else star.remove();
  }
  requestAnimationFrame(step);
}

/* ============================================================
   6. Cursor parallax
   ============================================================ */

function bindCursorParallax() {
  if (reduceMotion) return;
  let raf = null, mx = 0, my = 0;
  const update = () => {
    layers[0].style.transform = `translate(${mx * 6}px,  ${my * 6}px)`;
    layers[1].style.transform = `translate(${mx * 11}px, ${my * 11}px)`;
    layers[2].style.transform = `translate(${mx * 18}px, ${my * 18}px)`;
    raf = null;
  };
  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma == null || e.beta == null) return;
      mx = Math.max(-0.5, Math.min(0.5, e.gamma / 60));
      my = Math.max(-0.5, Math.min(0.5, e.beta / 90));
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
  }
}

/* ============================================================
   7. Bio
   ============================================================ */

const bio       = document.getElementById("bio");
const bioEyebrow= document.getElementById("bioEyebrow");
const bioName   = document.getElementById("bioName");
const bioTag    = document.getElementById("bioTagline");
const bioBody   = document.getElementById("bioBody");
const bioLinks  = document.getElementById("bioLinks");
const bioMeta   = document.getElementById("bioMeta");

function joinedDescriptor(m) {
  return m.joined === "birth" ? "By birth" : `Marriage · ${m.joined}`;
}

function fillBio(id) {
  const m = members[id];
  if (!m) return;
  bioEyebrow.textContent = `${m.role} · b. ${m.born}`;
  bioName.textContent    = m.name;
  bioTag.textContent     = m.tagline || "";
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

  bioMeta.innerHTML = "";
  const rows = [
    ["Joined",  joinedDescriptor(m)],
    ["Role",    m.role],
    ["Based",   m.based || ""],
    ["Born",    String(m.born)]
  ];
  rows.forEach(([label, val]) => {
    const row = document.createElement("div");
    row.className = "bio-meta-row";
    row.innerHTML = `<b>${label}</b><span class="val">${val}</span>`;
    bioMeta.appendChild(row);
  });
  if (m.related && m.related.length) {
    const block = document.createElement("div");
    block.className = "bio-related";
    block.innerHTML = `<div class="bio-related-title">Related</div>`;
    const list = document.createElement("div");
    list.className = "bio-related-list";
    m.related.forEach(rid => {
      const rm = members[rid];
      if (!rm) return;
      const a = document.createElement("a");
      a.href = `#${rid}`;
      a.textContent = rm.name;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (document.startViewTransition) {
          document.startViewTransition(() => openBio(rid));
        } else {
          openBio(rid);
        }
      });
      list.appendChild(a);
    });
    block.appendChild(list);
    bioMeta.appendChild(block);
  }
}

function openBio(id, push = true) {
  const m = members[id];
  if (!m || !bio) return;
  fillBio(id);
  bio.hidden = false;
  requestAnimationFrame(() => bio.classList.add("open"));
  document.body.style.overflow = "hidden";
  document.title = `${m.name} · Butowsky`;

  if (!surveyed.has(id)) {
    surveyed.add(id);
    document.querySelector(`.star[data-id="${id}"]`)?.classList.add("surveyed");
    updateCounter();
    if (surveyed.size === 6 && !chartComplete) triggerChartComplete();
  }

  if (push) history.replaceState(null, "", `#${id}`);
}

function closeBio(push = true) {
  if (!bio) return;
  bio.classList.remove("open");
  document.body.style.overflow = "";
  document.title = "Butowsky";
  if (push) history.replaceState(null, "", "#");
  setTimeout(() => { bio.hidden = true; }, 380);
}

function updateCounter() {
  const n = surveyed.size;
  hudCounter.innerHTML = n === 6
    ? `<b>Chart complete</b>`
    : `<b>${n}</b> / 6`;
}

document.getElementById("bioClose")?.addEventListener("click", () => closeBio());
bio?.addEventListener("click", (e) => { if (e.target === bio) closeBio(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBio(); });
window.addEventListener("hashchange", () => {
  const id = location.hash.replace("#", "");
  if (members[id]) openBio(id, false); else closeBio(false);
});

function triggerChartComplete() {
  chartComplete = true;
  document.body.classList.add("chart-complete");
  setTimeout(() => {
    document.body.classList.remove("chart-complete");
    document.body.classList.add("chart-complete-settled");
  }, 2400);
}

/* ============================================================
   8. Time-scrub
   ============================================================ */

const scrubTrack  = document.getElementById("scrubTrack");
const scrubFill   = document.getElementById("scrubFill");
const scrubHandle = document.getElementById("scrubHandle");
const scrubYearEl = document.getElementById("scrubYear");
const scrub       = document.getElementById("timescrub");

function buildScrubTicks() {
  // Restrained: only endpoints + a single anchor
  const ticks = [TIME_MIN, 1995, TIME_MAX];
  ticks.forEach(year => {
    const pct = (year - TIME_MIN) / (TIME_MAX - TIME_MIN);
    const tick = document.createElement("span");
    tick.className = "timescrub-tick";
    tick.style.left = `calc(${pct * 100}% )`;
    scrubTrack.appendChild(tick);
    const lbl = document.createElement("span");
    lbl.className = "timescrub-tick-label";
    lbl.textContent = year;
    lbl.style.left = `calc(${pct * 100}% )`;
    scrubTrack.appendChild(lbl);
  });
}

function setScrubPosition(year, fromUser = false) {
  const clamped = Math.max(TIME_MIN, Math.min(TIME_MAX, year));
  scrubYear = clamped;
  const pct = (clamped - TIME_MIN) / (TIME_MAX - TIME_MIN);
  scrubFill.style.width = (pct * 100) + "%";
  scrubHandle.style.left = (pct * 100) + "%";
  scrubYearEl.textContent = String(Math.round(clamped));
  scrubTrack.setAttribute("aria-valuenow", String(Math.round(clamped)));

  if (fromUser) {
    scrubMode = true;
    scrub?.classList.add("manual");
    applyScrubVisibility(clamped);
  }
}

function applyScrubVisibility(year) {
  Object.entries(memberAppearance).forEach(([id, app]) => {
    const star = chart.querySelector(`.star[data-id="${id}"]`);
    if (!star) return;
    star.classList.toggle("active", app.year <= year);
  });
  lines.forEach(line => {
    const lyear = (line.id === "ed-dani") ? 1991
                : (line.id === "lauren-ben") ? 2024
                : (line.id === "keaton-megan") ? 2026
                : Math.max(memberAppearance[line.from].year, memberAppearance[line.to].year);
    const path = chartSvg.querySelector(`path[data-id="${line.id}"]`);
    if (path) path.classList.toggle("active", lyear <= year);
    const lbl = chart.querySelector(`.line-label[data-id="${line.id}"]`);
    if (lbl) lbl.classList.toggle("active", lyear <= year);
  });
  ["ed-dani", "lauren-ben", "keaton-megan"].forEach(id => {
    const orb = chart.querySelector(`.binary-orbit[data-id="${id}"]`);
    if (!orb) return;
    const yr = id === "ed-dani" ? 1991 : id === "lauren-ben" ? 2024 : 2026;
    orb.classList.toggle("active", yr <= year);
  });
}

function trackPctFromEvent(e) {
  const rect = scrubTrack.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  return Math.max(0, Math.min(1, x / rect.width));
}

function bindScrub() {
  buildScrubTicks();
  setScrubPosition(TIME_MIN, false);

  // Pointer Events — single unified path for mouse, touch, pen.
  let activePointerId = null;
  const onDown = (e) => {
    activePointerId = e.pointerId;
    scrubTrack.setPointerCapture(e.pointerId);
    setScrubPosition(TIME_MIN + trackPctFromEvent(e) * (TIME_MAX - TIME_MIN), true);
    e.preventDefault();
  };
  const onMove = (e) => {
    if (e.pointerId !== activePointerId) return;
    setScrubPosition(TIME_MIN + trackPctFromEvent(e) * (TIME_MAX - TIME_MIN), true);
  };
  const onUp = (e) => {
    if (e.pointerId !== activePointerId) return;
    activePointerId = null;
    try { scrubTrack.releasePointerCapture(e.pointerId); } catch {}
  };
  scrubTrack.addEventListener("pointerdown",   onDown);
  scrubTrack.addEventListener("pointermove",   onMove);
  scrubTrack.addEventListener("pointerup",     onUp);
  scrubTrack.addEventListener("pointercancel", onUp);

  // Double-click handle returns to scroll-tracking ("live") mode.
  scrubHandle.addEventListener("dblclick", () => {
    scrubMode = false;
    scrub.classList.remove("manual");
    applySceneState(currentScene, false);
  });

  // Reveal scrub after the hero beat completes
  setTimeout(() => scrub.classList.add("visible"), 5200);
}

/* ============================================================
   Boot
   ============================================================ */

function boot() {
  renderStars();
  renderLines();
  bindCursorParallax();
  bindHeroFade();
  bindScrub();
  bindSceneObserver();

  window.addEventListener("resize", () => {
    repositionAllStars();
    requestAnimationFrame(renderLines);
  });
  document.fonts?.ready?.then(() => renderLines());

  applySceneState(0, false);
  updateCounter();

  const initialId = location.hash.replace("#", "");
  if (members[initialId]) openBio(initialId, false);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
