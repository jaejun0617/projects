/* Cinematic Z-axis Narrative Scroll (A ver: Vanilla + Lerp + rAF) */

const root = document.documentElement;

const step1 = document.querySelector('.step--s1');
const step2 = document.querySelector('.step--s2');
const step3 = document.querySelector('.step--s3');

const camera = document.querySelector('.camera');
const mg = document.querySelector('.panel--mg');
const fg = document.querySelector('.panel--fg');

const plateS2 = document.querySelector('.plate--s2');
const plateS3 = document.querySelector('.plate--s3');

const blackout = document.querySelector('.blackout');

const cursorGlow = document.querySelector('.cursor-glow');

const cfg = {
   smoothing: 0.075,

   // Section 01: Deep Zoom-in (camera advance)
   camZMax: 2400, // ✅ 더 깊게 “빨려들기”
   camScaleMax: 1.35, // ✅ 화면 꽉 채우는 줌(빈틈은 SCSS 오버스캔이 막아줌)

   // Section1: MG/FG 통과를 더 명확히 (opacity)
   mgIn: [0.16, 0.4],
   mgOut: [0.46, 0.74],
   fgIn: [0.62, 0.98],

   // Section2: background plate scale up + title blur to clear
   s2PlateScaleFrom: 1.18,
   s2PlateScaleTo: 1.04,

   // Section3: blackout + crossfade + saturation + title slide/spacing
   blackIn: [0.02, 0.22],
   blackOut: [0.26, 0.46], // blackout 유지 후 서서히 걷힘
};

let targetP = 0;
let currentP = 0;
let rafId = null;

const clamp01 = (n) => Math.max(0, Math.min(1, n));
const lerp = (a, b, t) => a + (b - a) * t;
const invLerp = (a, b, v) => clamp01((v - a) / (b - a));
const easeInOut = (t) =>
   t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = (t) => 1 - Math.pow(1 - t, 4);

function splitLiquidText() {
   const el = document.querySelector('.liquid[data-text]');
   if (!el) return;

   const text = el.getAttribute('data-text');
   el.innerHTML = '';

   [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'liquid__ch';
      span.textContent = ch === ' ' ? '\u00A0' : ch;

      // per-letter amplitude + delay (liquid 느낌)
      const amp = 10 + (i % 4) * 2; // 10..16px
      const delay = i * 60; // stagger
      span.style.setProperty('--a', `${amp}px`);
      span.style.setProperty('--d', `${delay}ms`);

      el.appendChild(span);
   });
}

function getOverallProgress() {
   // track 전체를 0..1로 매핑
   const doc = document.documentElement;
   const max = doc.scrollHeight - window.innerHeight;
   if (max <= 0) return 0;
   return clamp01(window.scrollY / max);
}

function seg(p, a, b) {
   return clamp01((p - a) / (b - a));
}

function fade01(p, a, b) {
   return easeInOut(invLerp(a, b, p));
}

function apply(p) {
   // 3 sections equally split (0..1)
   const p1 = seg(p, 0.0, 0.3333);
   const p2 = seg(p, 0.3333, 0.6666);
   const p3 = seg(p, 0.6666, 1.0);

   root.style.setProperty('--p', p.toFixed(5));
   root.style.setProperty('--p1', p1.toFixed(5));
   root.style.setProperty('--p2', p2.toFixed(5));
   root.style.setProperty('--p3', p3.toFixed(5));

   /* ========= Section 01: Zoom-through ========= */
   const e1 = easeOut(p1);

   // deep zoom-in: translateZ (negative -> forward into scene)
   const camZ = -cfg.camZMax * e1;
   const camS = lerp(1.0, cfg.camScaleMax, e1);

   root.style.setProperty('--camZ', `${camZ.toFixed(2)}px`);
   root.style.setProperty('--camS', camS.toFixed(4));

   // MG/FG opacity "pass-through"
   const mgVis = clamp01(
      fade01(p1, cfg.mgIn[0], cfg.mgIn[1]) *
         (1 - fade01(p1, cfg.mgOut[0], cfg.mgOut[1])),
   );
   const fgVis = fade01(p1, cfg.fgIn[0], cfg.fgIn[1]);

   root.style.setProperty('--mgOpacity', lerp(0.0, 1.0, mgVis).toFixed(3));
   root.style.setProperty('--fgOpacity', lerp(0.0, 1.0, fgVis).toFixed(3));

   // hello: liquid wave intensity + zoom out of view
   // wave: 초반 강, 끝에 약
   const wave = lerp(1.0, 0.25, easeOut(clamp01((p1 - 0.05) / 0.85)));
   root.style.setProperty('--wave', wave.toFixed(3));

   // text scale up + fade out near end of section1
   const helloOut = easeInOut(invLerp(0.62, 1.0, p1));
   const helloScale = lerp(1.0, 2.35, helloOut);
   const helloFade = lerp(1.0, 0.0, easeOut(invLerp(0.72, 1.0, p1)));

   root.style.setProperty('--helloScale', helloScale.toFixed(3));
   root.style.setProperty('--helloFade', helloFade.toFixed(3));

   /* ========= Section 02: Discovery ========= */
   // plate s2: scale-up + alpha
   const s2In = easeInOut(invLerp(0.02, 0.22, p2));
   const s2Hold = easeInOut(invLerp(0.22, 0.92, p2));

   const s2Alpha = clamp01(s2In * 1.0);
   const s2Scale = lerp(cfg.s2PlateScaleFrom, cfg.s2PlateScaleTo, s2Hold);

   root.style.setProperty('--s2Alpha', s2Alpha.toFixed(3));
   root.style.setProperty('--s2Scale', s2Scale.toFixed(4));

   // title blur->clear
   const blur = lerp(18, 0, easeOut(invLerp(0.1, 0.45, p2)));
   root.style.setProperty('--s2Blur', `${blur.toFixed(2)}px`);

   // grid stagger trigger (enter)
   if (p2 > 0.18) step2.classList.add('is-active');
   else step2.classList.remove('is-active');

   /* ========= Section 03: Cinema ========= */
   // blackout in/out
   const blackIn = fade01(p3, cfg.blackIn[0], cfg.blackIn[1]);
   const blackOut = fade01(p3, cfg.blackOut[0], cfg.blackOut[1]);
   const black = clamp01(blackIn * (1 - blackOut));
   root.style.setProperty('--black', black.toFixed(3));

   // s3 plate crossfade + saturation restore
   const s3Alpha = easeInOut(invLerp(0.22, 0.62, p3));
   const s3Sat = lerp(0.55, 1.08, easeOut(invLerp(0.3, 0.78, p3)));
   root.style.setProperty('--s3Alpha', s3Alpha.toFixed(3));
   root.style.setProperty('--s3Sat', s3Sat.toFixed(3));

   // title slide + letterspacing tighten
   const t3 = easeOut(invLerp(0.32, 0.88, p3));
   const x = lerp(-46, 0, t3);
   const ls = lerp(0.42, 0.02, t3); // em
   root.style.setProperty('--cinemaX', `${x.toFixed(2)}px`);
   root.style.setProperty('--cinemaLS', `${ls.toFixed(3)}em`);

   // step activation (optional)
   if (p3 > 0.1) step3.classList.add('is-active');
   else step3.classList.remove('is-active');
}

function tick() {
   targetP = getOverallProgress();
   currentP = lerp(currentP, targetP, cfg.smoothing);
   apply(currentP);
   rafId = requestAnimationFrame(tick);
}

/* Cursor glow (one more “cinematic detail”) */
let mouseX = 0,
   mouseY = 0;
let glowX = -9999,
   glowY = -9999;

function onMouseMove(e) {
   mouseX = e.clientX;
   mouseY = e.clientY;
}
window.addEventListener('mousemove', onMouseMove, { passive: true });

function glowTick() {
   // cursor smoothing
   glowX = lerp(glowX, mouseX, 0.12);
   glowY = lerp(glowY, mouseY, 0.12);

   // center align
   const x = glowX - 140;
   const y = glowY - 140;
   cursorGlow.style.transform = `translate3d(${x}px, ${y}px, 0)`;

   requestAnimationFrame(glowTick);
}

function start() {
   if (rafId == null) rafId = requestAnimationFrame(tick);
   requestAnimationFrame(glowTick);
}

splitLiquidText();
start();
