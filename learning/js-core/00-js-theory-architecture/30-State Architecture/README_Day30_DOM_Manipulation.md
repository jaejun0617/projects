# Day 30 — DOM Manipulation
**Sat, Jan 24, 2026**  
버튼 클릭 시 배경색이 랜덤하게 바뀌고 박스가 움직이는 **Interactive Box** 구현

---

## 🎯 미션 목표

- DOM 요소를 **선택/조작**해 UI 상태 변화를 만들 수 있다.
- `click` 이벤트를 연결해 **사용자 입력 → 로직 실행** 흐름을 만든다.
- `style` 조작으로 **시각적 변화(색/위치)**를 즉시 반영한다.
- (실무 감각) “값 변경 → 화면 반영”을 **일관된 함수 구조**로 정리한다.

---

## ✅ 구현 요구사항 체크리스트

- [ ] 버튼 1개, 박스 1개
- [ ] 버튼 클릭 시
  - [ ] 박스 배경색 랜덤 변경
  - [ ] 박스 위치 랜덤 이동 (화면 밖으로 나가지 않게)
  - [ ] (선택) 박스 텍스트 변경
- [ ] 초기 HTML은 단순하게(필요 최소)
- [ ] `textContent`를 기본으로 사용(안전)
- [ ] **position 기준(absolute/relative)**을 명확히 설정

---

## 🧠 핵심 이론 보강

### 1) DOM Manipulation이란?

JavaScript로 HTML 요소를:

- **선택**하고 (`querySelector`, `getElementById`)
- **생성/추가**하고 (`createElement`, `append`)
- **수정/이동**하고 (`textContent`, `classList`, `style`)
- **삭제**하는 (`remove`) 작업

즉, “정적 HTML”을 “동작하는 UI”로 바꾸는 핵심 기술이다.

---

### 2) DOM 조작 3단 흐름 (실무형)

1. **요소 캐싱**: 필요한 요소를 변수에 저장  
2. **상태/로직 함수**: 바꿀 값(색, 위치)을 계산  
3. **렌더링(적용)**: 계산한 값을 DOM에 반영  

이 패턴을 고정하면 규모가 커져도 유지보수가 쉬워진다.

---

### 3) `createElement` / `append`

```js
const box = document.createElement("div"); // 생성
document.body.append(box);                 // 배치(붙이기)
```

- 생성만으로는 화면에 안 보임 → **붙여야(render)** 보인다.

---

### 4) `textContent` vs `innerHTML` (왜 중요한가)

| 구분 | textContent | innerHTML |
|---|---|---|
| HTML 해석 | ❌ 안 함 | ⭕ 함 |
| 보안 | ✅ 안전 | ❌ XSS 위험 가능 |
| 권장 | ✅ 기본 | 정말 필요할 때만 |

**원칙:** 유저 입력/외부 데이터가 섞이면 `innerHTML`은 위험해질 수 있다.

---

### 5) `style` 조작 — “원리 이해용, 실무는 class 토글이 많음”

```js
box.style.backgroundColor = "red";
box.style.left = "120px";
box.style.top = "80px";
```

- JS에서 CSS 속성은 **camelCase** (`background-color` → `backgroundColor`)
- 위치 이동하려면 **position**이 필요:
  - `position: absolute;` (부모 기준으로 이동)
  - 부모에 `position: relative;`를 주면 “부모 영역 안”에서 움직이게 만들 수 있음

---

## ⚠️ 자주 터지는 함정 (이거 잡으면 실무 급상승)

### 1) `%` + `transform: translate(-50%, -50%)` 조합
- 가운데 정렬을 위해 `transform`을 쓰고, `top/left`를 `%`로 바꾸면  
  이동 계산이 직관적이지 않고, “튀는 느낌”이 생길 수 있다.

✅ 해결: **컨테이너를 만들고 px 기반으로 랜덤 이동**시키는 방식이 안정적이다.

### 2) 화면 밖으로 나가는 문제
- 랜덤 좌표가 박스 크기를 고려하지 않으면 박스가 잘린다.

✅ 해결: `containerWidth - boxWidth` 범위 안에서만 좌표를 뽑는다.

---

## 🧩 추천 DOM 구조

- `#stage`: 박스가 움직일 “무대(컨테이너)”
- `#box`: 움직이는 박스

```txt
body
 ├─ button
 └─ #stage (relative)
     └─ #box (absolute)
```

---

## 💻 완성 예시 코드 (바로 실행 가능 / 안정 버전)

> 포인트: **컨테이너 기준으로 px 좌표 랜덤 이동** + **박스가 밖으로 안 나가게 제한**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Day 30 - Interactive Box</title>
    <style>
      body {
        font-family: system-ui, -apple-system, sans-serif;
        padding: 20px;
      }

      button {
        padding: 10px 12px;
        border: 1px solid #111;
        border-radius: 10px;
        background: #fff;
        cursor: pointer;
      }

      /* 박스가 움직일 무대 */
      #stage {
        margin-top: 16px;
        width: min(720px, 100%);
        height: 420px;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        position: relative; /* ✅ 자식 absolute 기준 */
        overflow: hidden;   /* ✅ 밖으로 나가면 숨김 */
      }

      #interactiveBox {
        width: 100px;
        height: 100px;
        background: gray;
        position: absolute; /* ✅ stage 기준 이동 */
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 800;
        border-radius: 14px;
        user-select: none;
      }
    </style>
  </head>
  <body>
    <h1>Interactive Box</h1>
    <button id="changeButton" type="button">랜덤 변경</button>

    <div id="stage">
      <div id="interactiveBox">BOX</div>
    </div>

    <script>
      // ===== 1) 요소 캐싱 =====
      const button = document.getElementById("changeButton");
      const stage = document.getElementById("stage");
      const box = document.getElementById("interactiveBox");

      // ===== 2) 유틸 함수 =====
      const randomInt = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

      function getRandomColor() {
        const r = randomInt(0, 255);
        const g = randomInt(0, 255);
        const b = randomInt(0, 255);
        return `rgb(${r}, ${g}, ${b})`;
      }

      function getRandomPositionWithinStage() {
        const stageRect = stage.getBoundingClientRect();
        const boxRect = box.getBoundingClientRect();

        // ✅ 박스가 안 잘리게: (컨테이너 크기 - 박스 크기) 범위
        const maxLeft = Math.max(0, Math.floor(stageRect.width - boxRect.width));
        const maxTop = Math.max(0, Math.floor(stageRect.height - boxRect.height));

        return {
          left: randomInt(0, maxLeft),
          top: randomInt(0, maxTop),
        };
      }

      // ===== 3) 렌더 함수(적용) =====
      function applyRandomChange() {
        const color = getRandomColor();
        const pos = getRandomPositionWithinStage();

        box.style.backgroundColor = color;
        box.style.left = `${pos.left}px`;
        box.style.top = `${pos.top}px`;

        // 선택: 텍스트도 상태처럼 변경
        box.textContent = "MOVE!";
      }

      // ===== 4) 이벤트 =====
      button.addEventListener("click", applyRandomChange);

      // 초기 한 번 배치(선택)
      applyRandomChange();
    </script>
  </body>
</html>
```

---

## 🔥 핵심 포인트 (암기용)

- DOM 조작 기본 콤보  
  **선택(query) → 이벤트(addEventListener) → 값 계산 → style/text 반영**
- 랜덤 이동에서 중요한 건 “랜덤”이 아니라  
  **범위 제한(박스 크기 고려)** 이다.
- 실무에서는 `style 직접 변경`보다  
  `classList.toggle()`로 상태를 표현하는 경우가 많다(오늘은 원리 학습).

---

## 🧪 디버깅 체크

- 버튼 클릭해도 안 움직임 → `position` 확인
  - 박스: `position: absolute`
  - 컨테이너: `position: relative`
- 좌표가 적용되는데도 이상함 → `transform` 제거/확인
- 값이 제대로 나오나?  
  - `console.log(getRandomPositionWithinStage())` 찍어보기

---

## 🚀 추가 미션 (선택 업그레이드)

1) **부드러운 이동 애니메이션**
```css
#interactiveBox { transition: top 200ms ease, left 200ms ease, background-color 200ms ease; }
```

2) **클릭할 때마다 이동 거리/횟수 카운트**
- `let count = 0;`
- 클릭 시 `count++` 후 텍스트에 표시

3) **키보드로 이동 (WASD / 방향키)**
- `keydown` 이벤트로 `left/top` 업데이트

4) **박스 여러 개 만들기**
- `createElement`로 박스 N개 생성 후 무작위 배치

---

## 🎯 얻어가는 점

- “DOM + 이벤트 + 스타일” 연결이 손에 익는다.
- 다음 단계(토글/모달/탭/드래그)에서 똑같은 구조로 확장된다.
- UI는 결국 **데이터(값) → 화면(렌더)** 변환이다.

---

## 📚 참고 키워드 (MDN)

- `document.createElement()`
- `Element.append() / appendChild()`
- `Element.textContent`
- `Element.innerHTML`
- `HTMLElement.style`
- `Element.getBoundingClientRect()`
- `addEventListener()`
