// butowsky.com — constellation
// Scrollytelling chart: stars activate per scene, lines draw between them,
// shooting stars trace joining rituals, time-scrub overrides scroll mode,
// completion HUD reveals the chart when all six are surveyed.

import { members, lines, scenes, memberAppearance, timelineYears, TIME_MIN, TIME_MAX } from "./data.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isNarrow     = () => window.matchMedia("(max-width: 860px)").matches;

const sky        = document.getElementById("sky");
const chart      = document.getElementById("chart");
const chartSvg   = document.getElementById("chartSvg");
const sceneTitle = document.getElementById("sceneTitle");
const sceneTitleMain = document.getElementById("sceneTitleMain");
const sceneTitleSub  = document.getElementById("sceneTitleSub");
const hudCoords  = document.getElementById("hudCoords");
const hudCounter = document.getElementById("hudCounter");
const hudYear    = document.getElementById("hudYear");
const hudScene   = document.getElementById("hudScene");
const layers = [document.getElementById("layer1"), document.getElementById("layer2"), document.getElementById("layer3")];
const shootingStarsEl = document.getElementById("shootingStars");

const NS = "http://www.w3.org/2000/svg";

// State
const surveyed = new Set();
let currentScene = 0;
let scrubMode = false;        // when true, time-scrub controls visibility
let scrubYear = TIME_MAX;
let chartComplete = false;

/* ============================================================
   1. Render stars (one per member)
   ============================================================ */
function renderStars() {
  Object.entries(members).forEach(([id, m]) => {
    const star = document.createElement("button");
    star.className = `star label-${m.labelSide || "right"}`;
    star.dataset.id = id;
    star.setAttribute("aria-label", `View ${m.name}`);

    const wrap = document.createElement("span");
    wrap.style.position = "relative";
    wrap.style.display = "block";
    wrap.style.width = "22px";
    wrap.style.height = "22px";

    const marker = document.createElement("span");
    marker.className = "star-marker";

    const ring = document.createElement("span");
    ring.className = "star-ring";

    const coords = document.createElement("span");
    coords.className = "star-coords";
    coords.textContent = m.coords;

    marker.appendChild(ring);
    wrap.appendChild(marker);
    wrap.appendChild(coords);

    const label = document.createElement("span");
    label.className = "star-label";
    label.innerHTML = `<span class="name">${m.name}</span><span class="meta">B. ${m.born}</span>`;

    star.appendChild(wrap);
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
   2. Render lines (SVG paths, soft cubic between star centers)
   ============================================================ */

function getStarCenter(id, refRect) {
  const star = chart.querySelector(`.star[data-id="${id}"]`);
  if (!star) return null;
  const r = star.getBoundingClientRect();
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

    // Place / update label
    if (line.label) {
      let label = chart.querySelector(`.line-label[data-id="${line.id}"]`);
      if (!label) {
        label = document.createElement("span");
        label.className = `line-label ${line.kind}`;
        label.dataset.id = line.id;
        label.textContent = line.label;
        chart.appendChild(label);
      }
      label.style.left = ((a.x + b.x) / 2) + "px";
      label.style.top  = ((a.y + b.y) / 2) + "px";
    }
  }

  // Binary orbits — visual flourish around binary pairs
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
   3. Scene management — driven by scroll OR time-scrub
   ============================================================ */

function getScrollScene() {
  // Find which scene section currently contains the viewport center
  const sceneEls = document.querySelectorAll(".scene");
  const viewportMid = window.scrollY + window.innerHeight / 2;
  for (const el of sceneEls) {
    const top = el.offsetTop;
    const bot = top + el.offsetHeight;
    if (viewportMid >= top && viewportMid < bot) {
      return parseInt(el.dataset.scene, 10);
    }
  }
  return 0;
}

function applySceneState(sceneIdx, animateChange = true) {
  if (scrubMode) return; // scrub overrides
  if (sceneIdx === currentScene && !animateChange) return;

  const previousScene = currentScene;
  currentScene = sceneIdx;

  // Stars: active if their appearance.scene <= currentScene
  Object.entries(memberAppearance).forEach(([id, app]) => {
    const star = chart.querySelector(`.star[data-id="${id}"]`);
    if (!star) return;
    star.classList.toggle("active", app.scene <= sceneIdx);
  });

  // Lines: active if their scene <= currentScene
  lines.forEach(line => {
    const path = chartSvg.querySelector(`path[data-id="${line.id}"]`);
    if (path) path.classList.toggle("active", line.scene <= sceneIdx);
    const lbl = chart.querySelector(`.line-label[data-id="${line.id}"]`);
    if (lbl) lbl.classList.toggle("active", line.scene <= sceneIdx);
  });

  // Binary orbits
  ["ed-dani", "lauren-ben", "keaton-megan"].forEach(id => {
    const line = lines.find(l => l.id === id);
    if (!line) return;
    const orb = chart.querySelector(`.binary-orbit[data-id="${id}"]`);
    if (orb) orb.classList.toggle("active", line.scene <= sceneIdx);
  });

  // Scene title HUD
  const meta = scenes[sceneIdx];
  if (meta) {
    sceneTitleMain.textContent = meta.title;
    sceneTitleSub.textContent  = meta.sub;
    sceneTitle.classList.add("active");
    clearTimeout(applySceneState._titleTimer);
    applySceneState._titleTimer = setTimeout(() => sceneTitle.classList.remove("active"), 1800);
  }

  hudScene.textContent = `SCENE ${String(sceneIdx).padStart(2, "0")} / 05`;

  // Trigger shooting-star arrivals exactly when entering scenes 3 and 4
  if (animateChange && sceneIdx > previousScene) {
    if (sceneIdx === 3) launchShootingStar("ben",   "lauren");
    if (sceneIdx === 4) launchShootingStar("megan", "keaton");
  }
}

/* ============================================================
   4. Shooting star (joining ritual)
   ============================================================ */

function launchShootingStar(arrivingId, partnerId) {
  if (reduceMotion) return;
  const refRect = chart.getBoundingClientRect();
  const target  = getStarCenter(arrivingId, refRect);
  const partner = getStarCenter(partnerId,  refRect);
  if (!target) return;

  const star = document.createElement("div");
  star.className = "shooting-star";
  // start ~30vw beyond viewport edge in the direction the partner is from target
  const fromLeft = (target.x < refRect.width / 2);
  const startX = fromLeft ? -160 : refRect.width + 160;
  const startY = target.y - 80;
  const angle  = Math.atan2(target.y - startY, target.x - startX) * 180 / Math.PI;

  star.style.left = startX + "px";
  star.style.top  = startY + "px";
  star.style.setProperty("--angle", angle + "deg");

  // We use a JS animation to interpolate from start to target instead of pure CSS,
  // so the trail genuinely lands at the star's coordinates.
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
    else { star.remove(); }
  }
  requestAnimationFrame(step);
}

/* ============================================================
   5. Cursor parallax — sky tilts subtly with mouse position
   ============================================================ */

function bindCursorParallax() {
  if (reduceMotion) return;
  let raf = null, mx = 0, my = 0;
  const update = () => {
    layers[0].style.transform = `translate(${mx * 8}px,  ${my * 8}px)`;
    layers[1].style.transform = `translate(${mx * 14}px, ${my * 14}px)`;
    layers[2].style.transform = `translate(${mx * 20}px, ${my * 20}px)`;
    raf = null;
  };
  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });

  // Touch device: gyro tilt
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
   6. Scroll handling — drive scene + progress bar + HUD
   ============================================================ */

let scrollRaf = null;
function onScroll() {
  if (scrollRaf) return;
  scrollRaf = requestAnimationFrame(() => {
    const scene = getScrollScene();
    applySceneState(scene, true);
    scrollRaf = null;
  });
}

// IntersectionObserver-based scene detection — works even when scroll events
// don't fire (programmatic scroll in some embedded contexts).
function bindSceneObserver() {
  const sceneEls = document.querySelectorAll(".scene");
  // Use a thin band around viewport-center as the trigger zone.
  const io = new IntersectionObserver((entries) => {
    // Pick the entry with highest intersectionRatio that's intersecting.
    let best = null;
    entries.forEach(e => {
      if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
    });
    if (best) {
      const idx = parseInt(best.target.dataset.scene, 10);
      applySceneState(idx, true);
    }
  }, {
    // Fire when scene's middle 60% overlaps viewport's middle band
    rootMargin: "-30% 0px -30% 0px",
    threshold: [0, 0.25, 0.5, 0.75, 1]
  });
  sceneEls.forEach(el => io.observe(el));
}

/* ============================================================
   7. Bio open/close + view transitions + URL sync
   ============================================================ */

const bio       = document.getElementById("bio");
const bioEyebrow= document.getElementById("bioEyebrow");
const bioName   = document.getElementById("bioName");
const bioTag    = document.getElementById("bioTagline");
const bioBody   = document.getElementById("bioBody");
const bioLinks  = document.getElementById("bioLinks");
const bioMeta   = document.getElementById("bioMeta");

function joinedDescriptor(m) {
  return m.joined === "birth" ? "BY BIRTH" : `MARRIAGE · ${m.joined}`;
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

  // Right-rail data block
  bioMeta.innerHTML = "";
  const rows = [
    ["Joined",  joinedDescriptor(m)],
    ["Role",    m.role.toUpperCase()],
    ["Based",   (m.based || "").toUpperCase()],
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
    block.innerHTML = `<div class="bio-related-title">RELATED</div>`;
    const list = document.createElement("div");
    list.className = "bio-related-list";
    m.related.forEach(rid => {
      const rm = members[rid];
      if (!rm) return;
      const a = document.createElement("a");
      a.href = `#${rid}`;
      a.dataset.related = rid;
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

  // Mark surveyed + update HUD
  if (!surveyed.has(id)) {
    surveyed.add(id);
    document.querySelector(`.star[data-id="${id}"]`)?.classList.add("surveyed");
    hudCounter.textContent = `${surveyed.size} / 6 SURVEYED`;
    if (surveyed.size === 6 && !chartComplete) {
      triggerChartComplete();
    }
  }

  if (push) history.replaceState(null, "", `#${id}`);
}

function closeBio(push = true) {
  if (!bio) return;
  bio.classList.remove("open");
  document.body.style.overflow = "";
  document.title = "Butowsky · A Constellation";
  if (push) history.replaceState(null, "", "#");
  setTimeout(() => { bio.hidden = true; }, 380);
}

document.getElementById("bioClose")?.addEventListener("click", () => closeBio());
bio?.addEventListener("click", (e) => { if (e.target === bio) closeBio(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBio(); });

window.addEventListener("hashchange", () => {
  const id = location.hash.replace("#", "");
  if (members[id]) openBio(id, false); else closeBio(false);
});

/* ============================================================
   8. Chart complete moment
   ============================================================ */

function triggerChartComplete() {
  chartComplete = true;
  document.body.classList.add("chart-complete");
  hudCounter.textContent = "CHART · COMPLETE";
  // After 2.4s, settle: leave lines lit but normal-colored
  setTimeout(() => {
    document.body.classList.remove("chart-complete");
    document.body.classList.add("chart-complete-settled");
  }, 2400);
}

/* ============================================================
   9. Time-scrub bar
   ============================================================ */

const scrubTrack  = document.getElementById("scrubTrack");
const scrubFill   = document.getElementById("scrubFill");
const scrubHandle = document.getElementById("scrubHandle");
const scrubYearEl = document.getElementById("scrubYear");
const scrub       = document.getElementById("timescrub");

function buildScrubTicks() {
  timelineYears.forEach(year => {
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
  hudYear.textContent = `YEAR · ${Math.round(clamped)}`;
  scrubTrack.setAttribute("aria-valuenow", String(Math.round(clamped)));

  if (fromUser) {
    scrubMode = true;
    applyScrubVisibility(clamped);
  }
}

function applyScrubVisibility(year) {
  // Stars active when their appearance year <= scrub year
  Object.entries(memberAppearance).forEach(([id, app]) => {
    const star = chart.querySelector(`.star[data-id="${id}"]`);
    if (!star) return;
    star.classList.toggle("active", app.year <= year);
  });
  // Lines: tied to the partner pair years
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

function exitScrubMode() {
  scrubMode = false;
  hudYear.textContent = "YEAR · LIVE";
  scrubYearEl.textContent = "LIVE";
  applySceneState(getScrollScene(), false);
}

function trackPctFromEvent(e) {
  const rect = scrubTrack.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  return Math.max(0, Math.min(1, x / rect.width));
}

function bindScrub() {
  buildScrubTicks();
  setScrubPosition(TIME_MAX, false);

  let dragging = false;
  const startDrag = (e) => {
    dragging = true;
    setScrubPosition(TIME_MIN + trackPctFromEvent(e) * (TIME_MAX - TIME_MIN), true);
    e.preventDefault();
  };
  const moveDrag = (e) => {
    if (!dragging) return;
    setScrubPosition(TIME_MIN + trackPctFromEvent(e) * (TIME_MAX - TIME_MIN), true);
  };
  const endDrag = () => { dragging = false; };

  scrubTrack.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("mouseup", endDrag);
  scrubTrack.addEventListener("touchstart", startDrag, { passive: false });
  window.addEventListener("touchmove", moveDrag, { passive: false });
  window.addEventListener("touchend", endDrag);

  // Double-click handle to return to live
  scrubHandle.addEventListener("dblclick", exitScrubMode);

  // Snap-to-tick on click
  scrubTrack.addEventListener("click", (e) => {
    if (e.target === scrubHandle) return;
    setScrubPosition(TIME_MIN + trackPctFromEvent(e) * (TIME_MAX - TIME_MIN), true);
  });

  // Show after intro
  setTimeout(() => scrub.classList.add("visible"), 5000);
}

/* ============================================================
   10. Hover coordinate readout
   ============================================================ */

function bindCoordHover() {
  document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("mouseenter", () => {
      const m = members[star.dataset.id];
      if (m) hudCoords.textContent = m.coords;
    });
    star.addEventListener("mouseleave", () => {
      hudCoords.textContent = "RA — · DEC —";
    });
  });
}

/* ============================================================
   Boot
   ============================================================ */

function boot() {
  renderStars();
  renderLines();
  bindCursorParallax();
  bindScrub();
  bindCoordHover();
  bindSceneObserver();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    repositionAllStars();
    requestAnimationFrame(renderLines);
  });
  // Re-render lines after fonts load (label widths change)
  document.fonts?.ready?.then(() => renderLines());

  // Initial scene
  applySceneState(getScrollScene(), false);

  // Hash-deep-link
  const initialId = location.hash.replace("#", "");
  if (members[initialId]) openBio(initialId, false);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
