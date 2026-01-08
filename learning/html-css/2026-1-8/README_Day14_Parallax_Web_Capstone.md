# Day 14 — Phase 0 Capstone: Parallax Web

## 🗓 일정
- **Thu, Jan 8, 2026**

---

## 🎯 Mission Goal
스크롤 값을 기반으로 여러 레이어가 서로 다른 속도로 움직이는 **Scroll-driven Parallax Web**을 구현한다.

- 사용자의 스크롤 = 애니메이션 트리거
- 깊이감(Depth)과 레이어 개념을 명확히 표현
- 성능을 고려한 **transform 기반** 구현 (GPU 가속)

> 외부 라이브러리 금지 (Vanilla JS)

---

## ✅ 오늘 한 줄 요약
**스크롤(입력)을 숫자로 바꿔서, 레이어(출력)를 서로 다른 속도로 이동시키면 깊이가 생긴다.**

---

## 🧠 핵심 개념 & 핵심 이론 보강 (완전판)

## 1) Parallax(시차 효과) — “깊이감은 속도 차이에서 나온다”
### ✅ 원리
사람의 눈은 “가까운 물체는 빨리 움직이고, 먼 물체는 느리게 움직인다”는 경험을 기반으로 깊이를 인식한다.

- **Foreground(가까움)**: 더 큰 이동량 → 더 빠르게 움직임
- **Background(멀음)**: 더 작은 이동량 → 더 느리게 움직임

이걸 웹에서는 보통 이렇게 만든다:
- 스크롤 거리 `scrollY`
- 레이어별 속도 계수 `speed`
- 최종 이동량 = `scrollY * speed`

```js
translateY = scrollY * speed
```

---

## 2) Scroll-driven Animation — “스크롤은 0~∞의 연속 값 입력”
### ✅ 핵심은 ‘이벤트’가 아니라 ‘값’이다
스크롤 이벤트는 단지 “값이 바뀌었다”는 신호일 뿐이다.  
진짜 핵심은 매 프레임마다 사용할 **scrollY 숫자**다.

- 입력: `window.scrollY`
- 변환: 속도 계수/보정/클램프
- 출력: `transform`

---

## 3) fixed + translate 조합의 의미
### ✅ 왜 fixed를 쓰나?
레이어를 `position: fixed`로 고정하면:
- 레이어는 화면(Viewport)에 붙어있고
- 움직임은 오직 `transform`으로만 제어된다

즉, “스크롤로 페이지가 내려가는 느낌”이 아니라  
“화면은 고정, 레이어만 다르게 움직이는 느낌”을 만들 수 있다.

---

## 4) 성능 최적화 기초 — “레이아웃을 건드리지 말고 합성(Composite)만 하라”
### ✅ top/margin이 느린 이유
`top`, `margin`, `height` 같은 레이아웃 속성을 바꾸면 브라우저가:
- Layout(리플로우)
- Paint(재그리기)
까지 자주 수행하게 된다.

### ✅ transform이 빠른 이유
`transform: translateY()`는 대부분:
- Layout 거의 없음
- Paint 최소
- **Composite 단계에서 GPU로 합성**

그래서 스크롤 기반 애니메이션은 거의 무조건:
- `transform`
- `opacity`
를 쓴다.

---

## 5) scroll 이벤트 그대로 쓰면 생기는 문제
### ✅ 문제 1: 스크롤 이벤트는 프레임과 동기화되지 않는다
스크롤 이벤트는 매우 자주 발생하고, 발생 타이밍이 랜덤이다.

✅ 해결: `requestAnimationFrame`(rAF)로 “프레임 동기화”
- 스크롤 이벤트에서는 값만 저장
- rAF 루프에서 transform 업데이트

### ✅ 문제 2: 이벤트 내부에서 과도한 연산
DOM 쿼리, 레이아웃 읽기(`getBoundingClientRect`) 같은 작업을 매번 하면 끊김.

✅ 해결:
- 요소 캐싱
- 계산 최소화
- 읽기/쓰기 분리(가능하면)

---

## 6) 레이어 설계 체크 포인트 (애플 스타일 감성의 핵심)
- 레이어는 최소 3개 이상 (BG/MG/FG)
- 각 레이어는 “명확한 깊이”가 보이도록
  - BG: 큰 그라데이션/하늘/패턴 (느림)
  - MG: 산/도형/텍스트 블록 (중간)
  - FG: 전경 오브젝트/빛/디테일 (빠름)
- 속도 계수는 보통:
  - BG: 0.10 ~ 0.30
  - MG: 0.35 ~ 0.60
  - FG: 0.70 ~ 1.00

---

## 🧱 Technical Stack
- **HTML**: 레이어 구조 정의
- **CSS**: 레이어 배치/시각 스타일
- **JavaScript (Vanilla)**: scrollY 기반 transform 업데이트

---

## 🏗️ Implementation Requirements (정리)
- [ ] 레이어 최소 3개 (background/midground/foreground)
- [ ] 각 레이어 속도 계수 다르게 적용
- [ ] `transform: translateY()`만 사용 (top/margin 금지)
- [ ] 요소 캐싱
- [ ] (권장) rAF로 프레임 동기화

---

## 🔧 Implementation (권장 최종 예시)

## 1) HTML
```html
<div class="parallax">
  <div class="layer background"></div>
  <div class="layer midground"></div>
  <div class="layer foreground"></div>
</div>

<div class="spacer"></div>

<script src="./app.js"></script>
```

---

## 2) CSS (Base)
```css
body{
  margin:0;
  overflow-x:hidden;
  height:200vh; /* 스크롤을 만들기 위해 */
  background:#000;
}

.parallax{
  position:relative;
}

.layer{
  position:fixed;
  inset:0;
  height:100vh;
  width:100%;
  will-change: transform; /* 힌트: transform 많이 바뀜 */
}

/* 레이어 깊이 */
.background{ z-index:1; }
.midground{ z-index:2; }
.foreground{ z-index:3; }

/* 예시 배경(최소 시각 구분) */
.background{ background: linear-gradient(#0b1020, #000); opacity:.9; }
.midground{ background: radial-gradient(circle at 30% 40%, rgba(255,255,255,.08), transparent 60%); }
.foreground{ background: radial-gradient(circle at 70% 60%, rgba(255,255,255,.12), transparent 55%); }

.spacer{
  height:200vh; /* 스크롤 영역 */
}
```

---

## 3) JavaScript (권장: rAF 최적화)
```js
const bg = document.querySelector('.background');
const mid = document.querySelector('.midground');
const fg = document.querySelector('.foreground');

let latestScrollY = 0;
let ticking = false;

function update(){
  const y = latestScrollY;

  bg.style.transform  = `translateY(${y * 0.2}px)`;
  mid.style.transform = `translateY(${y * 0.5}px)`;
  fg.style.transform  = `translateY(${y * 0.8}px)`;

  ticking = false;
}

window.addEventListener('scroll', () => {
  latestScrollY = window.scrollY;

  if(!ticking){
    ticking = true;
    requestAnimationFrame(update);
  }
}, { passive: true });
```

### ✅ 왜 이 방식이 좋은가?
- 스크롤 이벤트가 200번 와도, 실제 DOM 업데이트는 프레임(60fps) 기준으로 정리됨
- 이벤트 안에서 “바로 쓰기”를 줄여서 끊김 감소
- `passive: true`로 스크롤 성능 힌트 제공

---

## 🔍 면접/포트폴리오 설명 포인트 (필수)
- **왜 scrollY를 기준으로 계산했는가?**  
  → 스크롤은 연속 값 입력이고, 모든 레이어의 기준 좌표가 되기 때문

- **왜 transform을 사용했는가?**  
  → 레이아웃(top/margin)은 리플로우/페인트를 유발, transform은 합성 단계에서 처리되어 부드러움

- **속도 차이가 왜 깊이감을 만들나?**  
  → 시차(Parallax) 원리: 가까울수록 더 크게/빠르게 움직인다고 뇌가 인식

- **fixed + translate 조합의 의미는?**  
  → 화면에 고정된 레이어를 transform으로만 움직여 “깊이 있는 장면” 연출

---

## ❌ Common Mistakes (자주 망하는 포인트)
- `top`으로 움직임 구현 → 레이아웃 발생, 스크롤 끊김
- 모든 레이어 같은 속도 → 깊이감 0
- 스크롤 이벤트 안에서 DOM 탐색/레이아웃 읽기 남발
- 이미지/레이어가 너무 무거운데 최적화 힌트(will-change) 없음

---

## ✅ Evaluation Criteria (완성도 기준)
- [ ] 레이어 구조가 명확하다 (BG/MG/FG)
- [ ] 속도 차이가 시각적으로 느껴진다
- [ ] 코드가 단순하고 의도가 분명하다
- [ ] 성능 고려 흔적이 있다 (transform, rAF, passive, will-change)

---

## 📌 Keywords
- Parallax Scrolling
- Scroll-driven Animation
- `transform` vs layout
- GPU Acceleration / Compositing
- `requestAnimationFrame`
- Vanilla JS Interaction

---

## 🚀 Outcome
> **CSS를 넘어, “스크롤(사용자 입력)을 설계”하는 단계로 진입**

이 과제는 단순 효과 구현이 아니라,
**사용자 입력(스크롤)을 데이터로 보고 UI를 제어하는 사고**를 평가한다.

Phase 0 Capstone으로 충분한 완성도 과제다.
