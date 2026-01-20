# Day 33 — Mini Project: Carousel (Vanilla JS)
**Tue, Jan 27, 2026**  
라이브러리 없이 순수 JS로 **이미지 슬라이더(캐러셀)**을 구현한다.  
버튼 전환 + **무한 루프** + **3초 자동 넘김(setInterval)** + (선택) **유저 조작 리셋 / 호버 일시정지**까지 완성한다.

---

## 🎯 최종 목표
- `Prev / Next` 버튼으로 이미지 전환
- **무한 루프**
  - 마지막에서 Next → 첫 번째
  - 첫 번째에서 Prev → 마지막
- `setInterval`로 **3초마다 자동 Next**
- (선택) 사용자 조작 시 자동 넘김 **리셋**
- (선택) 캐러셀 위 **hover 시 정지**, 벗어나면 재시작

---

## 🧠 핵심 개념 (실무 기준으로 “원리”까지)
### 1) 캐러셀은 “상태(State) + 렌더(Render)”
캐러셀은 결국 **현재 몇 번 슬라이드를 보여줄지**만 알면 된다.

- **State:** `currentIndex` (0 ~ total-1)
- **Render:** state를 기준으로 **DOM/CSS 업데이트** (translateX)

> 프레임워크로 가면 `setState → re-render`로 바뀌지만, 본질은 동일하다.

---

### 2) 무한 루프 인덱싱 (버그 방지 핵심)
인덱스가 범위를 벗어나면 UI가 깨진다.  
아래 두 줄로 범위를 항상 안전하게 유지한다.

```js
// next
currentIndex = (currentIndex + 1) % total;

// prev (음수 방지)
currentIndex = (currentIndex - 1 + total) % total;
```

**왜 prev에 +total을 하냐?**  
JS에서 `-1 % 4 === -1` 이라서 그대로 쓰면 음수가 남는다.  
그래서 `+ total`로 양수로 만든 뒤 `% total`로 접어준다.

---

### 3) 구현 방식 2가지 (학습 vs 실전)
#### A. 숨기기 방식 (display/opacity)
- 모든 슬라이드를 숨기고 하나만 보이게
- 쉽지만 매번 여러 요소를 건드려 비용이 커질 수 있음

#### B. 이동 방식 (translateX) ✅ 추천
- 슬라이드를 가로로 나열하고 `track` 자체를 이동
- 더 자연스럽고, 일반적으로 성능/확장성이 좋음

---

### 4) setInterval “중복 실행”이 가장 위험
버튼 클릭할 때마다 `setInterval`을 새로 만들면:
- 타이머가 여러 개 돌아서 **점점 빨라지는 버그** 발생

해결: **timerId 저장 → 시작 전에 항상 clear**

```js
let timerId = null;

function startAuto() {
  stopAuto();
  timerId = setInterval(next, 3000);
}
function stopAuto() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}
```

---

### 5) “유저 조작 시 자동 리셋”이 UX를 만든다 (선택)
유저가 버튼을 눌렀다면 **3초 카운트를 다시 시작**하는 게 자연스럽다.

```js
function onUserAction(moveFn) {
  moveFn();
  startAuto(); // 리셋
}
```

---

## ✅ 요구사항 체크리스트
- [ ] 첫 로드 시 1번 이미지가 보인다
- [ ] Next: 다음 이미지로 이동
- [ ] Prev: 이전 이미지로 이동
- [ ] 마지막에서 Next → 첫 번째로
- [ ] 첫 번째에서 Prev → 마지막으로
- [ ] 3초마다 자동으로 Next
- [ ] interval 중복 실행 없음
- [ ] (선택) hover 시 정지 / leave 시 재시작
- [ ] (선택) 버튼 클릭 시 자동 넘김 리셋

---

## 🧩 설계 팁 (구조를 잡으면 구현이 쉬워진다)
### 핵심 함수 역할 분리
- `render()` : **UI 반영만**
- `next()/prev()` : **상태 변경 + render 호출**
- `startAuto()/stopAuto()` : **타이머 제어만**
- `onUserAction()` : **UX 정책(리셋)만**

이 분리만 해도 코드가 “프로젝트 코드”처럼 보인다.

---

## 💻 구현 코드 (index.html 단일 파일)
> 그대로 복사 → `index.html`로 실행

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Day 33 - Carousel</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; }

    .carousel {
      width: 640px;
      max-width: 100%;
      margin: 0 auto;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      border: 1px solid #e5e7eb;
      background: #fff;
    }

    .viewport { overflow: hidden; }
    .track {
      display: flex;
      transition: transform 300ms ease;
      will-change: transform;
    }
    .slide {
      flex: 0 0 100%;
      height: 360px;
      object-fit: cover;
      display: block;
      user-select: none;
      pointer-events: none;
    }

    .controls {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: 12px;
    }
    button {
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      background: white;
      cursor: pointer;
    }
    button:active { transform: translateY(1px); }
    .meta { text-align: center; margin-top: 8px; color: #6b7280; }

    /* (선택) 접근성: 포커스 표시 */
    button:focus-visible {
      outline: 2px solid #111;
      outline-offset: 2px;
    }
  </style>
</head>
<body>
  <h1>Day 33 - Carousel</h1>

  <div class="carousel" id="carousel" aria-label="이미지 캐러셀">
    <div class="viewport">
      <div class="track" id="track">
        <img class="slide" src="https://picsum.photos/id/237/1200/700" alt="slide1" />
        <img class="slide" src="https://picsum.photos/id/1025/1200/700" alt="slide2" />
        <img class="slide" src="https://picsum.photos/id/1003/1200/700" alt="slide3" />
        <img class="slide" src="https://picsum.photos/id/1011/1200/700" alt="slide4" />
      </div>
    </div>
  </div>

  <div class="controls">
    <button id="prevBtn" type="button" aria-label="이전 이미지">Prev</button>
    <button id="nextBtn" type="button" aria-label="다음 이미지">Next</button>
  </div>
  <div class="meta" id="meta" aria-live="polite"></div>

  <script>
    // ===== 0) DOM 캐싱 =====
    const track = document.getElementById('track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const meta = document.getElementById('meta');
    const carousel = document.getElementById('carousel');

    const slides = track.querySelectorAll('.slide');
    const total = slides.length;

    // ===== 1) 상태(State) =====
    let currentIndex = 0;
    let timerId = null;

    // ===== 2) 렌더(Render) =====
    function render() {
      // -index * 100% 만큼 이동
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      meta.textContent = `${currentIndex + 1} / ${total}`;
    }

    // ===== 3) 상태 변경 + 렌더 =====
    function next() {
      currentIndex = (currentIndex + 1) % total;
      render();
    }

    function prev() {
      currentIndex = (currentIndex - 1 + total) % total;
      render();
    }

    // ===== 4) 자동 넘김 (중복 방지 핵심) =====
    function stopAuto() {
      if (timerId) clearInterval(timerId);
      timerId = null;
    }

    function startAuto() {
      stopAuto();
      timerId = setInterval(next, 3000);
    }

    // ===== 5) 유저 조작 UX (선택) =====
    function onUserAction(moveFn) {
      moveFn();
      startAuto(); // 유저 조작 시 자동 넘김 리셋
    }

    // ===== 6) 이벤트 =====
    prevBtn.addEventListener('click', () => onUserAction(prev));
    nextBtn.addEventListener('click', () => onUserAction(next));

    // (선택) hover 시 정지/재시작
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // (선택) 탭이 비활성화되면 멈추기 (실무에서 자주 넣음)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAuto();
      else startAuto();
    });

    // ===== 7) 초기 실행 =====
    render();
    startAuto();
  </script>
</body>
</html>
```

---

## 🧪 테스트 시나리오 (버그 잡는 순서)
1. 첫 로드 → `1 / N` 표시 + 1번 이미지 보임
2. Next 5번 클릭 → 끝에서 다시 1번으로 돌아오는지
3. Prev 5번 클릭 → 1번에서 끝으로 가는지
4. 10초 가만히 → 3초마다 자동으로 넘어가는지
5. Next/Prev 연타 → **속도가 빨라지지 않는지** (중복 interval 체크)
6. 캐러셀에 마우스 올림 → 자동 멈춤 / 내림 → 재시작

---

## 🔥 실무 포인트
### 1) “상태가 하나면” 구조가 단단해진다
`currentIndex`만 신뢰하면 되고, 나머지는 `render()`가 해결한다.

### 2) interval은 항상 “단 하나”만 존재하게 관리
- 시작 전에 clear
- `timerId`가 곧 “자동 재생이 켜져있는가?” 상태로도 활용 가능

### 3) 확장할 때는 “정책”을 함수로 묶어라
- 유저 조작 리셋 정책: `onUserAction`
- hover 정책: mouseenter/leave
- 탭 비활성 정책: visibilitychange

---

## 🚀 업그레이드 아이디어 (선택)
- Dot Indicator(1/2/3/4) + 클릭 이동
- 키보드 방향키(`ArrowLeft/ArrowRight`) 지원
- 드래그/스와이프(모바일) 지원
- 이미지 로딩 실패 시 fallback 처리
- `prefers-reduced-motion` 대응(transition 줄이기)

---

## 🧾 포트폴리오 한 줄
> “캐러셀을 **상태(currentIndex)** 기반으로 설계하고, **무한 루프 인덱싱(modulo)** 과 **interval 중복 방지(clearInterval)** 로 자동 슬라이드를 안정적으로 제어했습니다.”

