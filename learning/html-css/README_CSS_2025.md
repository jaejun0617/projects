# 📘 CSS 2025 Master Guide (Real-world Standard · FINAL)

> **목표**  
> 단순한 스타일링을 넘어  
> **아키텍처 · 레이아웃 · 반응형 · 성능 · 모션(Motion) · 접근성 · 스크롤 UX · 이미지 안정성**까지  
> **2025년 프론트엔드 실무 기준, CSS의 모든 핵심 뼈대를 완성한다.**

---

## 0. Modern CSS Reset & Box Model (기본기)

```css
*, *::before, *::after {
  box-sizing: border-box;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

> ✔ CLS 방지  
> ✔ 예측 가능한 박스 모델  
> ✔ 접근성 기본값 확보

---

## 1. Cascade Layers (@layer) — 2025 필수 아키텍처

```css
@layer reset, base, theme, layout, components, utilities;
```

- 명시도 경쟁 종료
- `!important` 제거
- 팀 단위 CSS 안정성 확보

---

## 2. Layout & Logical Properties

### 2-1. Logical Properties
```css
.card {
  margin-block: 2rem;
  padding-inline: 1.5rem;
}
```

- RTL / 다국어 대응
- 방향 의존 제거

---

### 2-2. Flexbox (1D)
```css
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
```

---

### 2-3. Grid (2D System)
```css
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}
```

- 미디어 쿼리 없는 반응형
- 디자인 시스템 기반

---

## 3. Units & Typography

### rem vs em
- rem: 전역 기준 (접근성)
- em: 컴포넌트 내부 비례

### Fluid Typography
```css
h1 {
  font-size: clamp(1.2rem, 5vw, 3rem);
}
```

---

## 4. Modern Responsiveness

### Container Queries
```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 500px) {
  .card { flex-direction: row; }
}
```

### Media Queries
```css
@media (max-width: 768px) {
  .sidebar { display: none; }
}
```

---

## 5. Advanced Selectors

```css
.card:has(> img) { background: #f0f0f0; }

:where(header, footer, aside) a:hover {
  color: red;
}
```

- `:has()` → 상태 기반 UI
- `:where()` → 명시도 0

---

## 6. Theming & CSS Variables (Design Tokens)

```css
:root {
  --color-primary: #3b82f6;
  --space-md: 1.6rem;
  --radius-md: 12px;
}
```

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
  }
}
```

---

## 7. Media & Visual Stability

### Aspect Ratio
```css
.hero-image {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

### Backdrop Filter
```css
.modal-overlay {
  backdrop-filter: blur(10px);
}
```

---

## 8. CSS Motion Master Guide

### 성능 원칙
- ✅ transform, opacity
- ❌ width, height, top, left

---

### Transition (Micro Interaction)
```css
.btn {
  transition:
    transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1),
    opacity 0.2s ease;
}

.btn:hover { transform: translateY(-2px); }
.btn:active { transform: scale(0.98); }
```

---

### Keyframes 패턴

#### Skeleton Loading
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

#### Fade Up
```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

### 3D Transform
```css
.scene { perspective: 1000px; }

.card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
```

---

## 9. Scroll UX

### Scroll Snap
```css
.gallery {
  scroll-snap-type: x mandatory;
}
```

### Overscroll
```css
.modal {
  overscroll-behavior: contain;
}
```

### Scrollbar Gutter
```css
html {
  scrollbar-gutter: stable;
}
```

---

## 10. Accessibility & Optimization

### prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### will-change (주의)
```css
.element:hover {
  will-change: transform, opacity;
}
```

---

## 11. 실무 최종 체크리스트

- Reset / Box model 정리
- rem / clamp 사용
- Grid + Flex 시스템
- Logical properties 적용
- @layer / tokens 구조화
- CLS 방지 (aspect-ratio)
- transform 기반 모션
- prefers-reduced-motion 대응
- focus-visible 고려

---

> **“CSS is not about fixing things,  
> it’s about building systems.”**  
> — CSS는 땜질이 아니라, 시스템이다.
