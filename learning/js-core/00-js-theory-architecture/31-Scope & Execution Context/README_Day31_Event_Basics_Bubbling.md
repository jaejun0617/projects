# Day 31 — Event Basics & Bubbling
**Sun, Jan 25, 2026**

> 목표: **이벤트 버블링 + 이벤트 위임(Event Delegation)**으로 계산기 버튼 클릭을 **부모 1곳에서만** 처리한다.  
> 핵심: `addEventListener`, `event.target`, `event.currentTarget`, Bubbling, Delegation

---

## 🗓 일정
- Sun, Jan 25, 2026

---

## 🎯 오늘의 미션 목표
- 이벤트가 “어떻게 전달(전파)되는지”를 **흐름으로 이해**한다.
- 버튼마다 리스너를 붙이지 않고, **부모 컨테이너 1개**에만 리스너를 붙인다.
- 클릭된 버튼을 `event.target`으로 정확히 판별하고, **버튼이 아닌 영역 클릭**을 안전하게 막는다.
- `target` / `currentTarget` 차이를 콘솔로 확인한다.

---

## ✅ 최종 결과물
- 계산기 버튼(최소 10개 이상)을 화면에 배치
- 버튼 클릭 시:
  - 클릭된 버튼 텍스트를 `console.log`
  - `event.target` / `event.currentTarget` 출력
- **개별 버튼에 addEventListener 금지**
- **부모에만 addEventListener 1개**

---

## 🧠 핵심 개념 & 이론 (실무 기준 보강)

### 1) 이벤트(Event)란?
사용자의 행동(클릭/입력/스크롤 등)이 발생하면 브라우저는 **Event 객체**를 만들어 JS로 전달한다.

- “클릭”은 단순히 눌렀다의 의미가 아니라  
  **어떤 요소에서 발생했고**, **어떤 좌표에서 발생했고**, **키가 눌렸는지** 같은 정보까지 포함한다.
- 이벤트 처리의 핵심은 항상 이 한 문장으로 정리된다:

> **이벤트 객체(event)로 “무슨 일이 어디에서” 일어났는지 확인하고, 그에 맞는 로직을 실행한다.**

---

### 2) addEventListener가 하는 일
```js
element.addEventListener("click", handler);
```

- `element`: 리스너가 붙는 대상(“감시자”)
- `"click"`: 감시할 이벤트 종류
- `handler`: 이벤트가 발생했을 때 실행되는 함수

**실무 팁**
- DOM을 직접 조작하는 코드에서는 리스너를 “필요한 최소 지점”에만 붙여라.
- 리스너가 많아질수록:
  - 성능(메모리) 부담 ↑
  - 해제/관리 난이도 ↑
  - 디버깅 난이도 ↑

---

### 3) event.target vs event.currentTarget (★★★★★)
| 구분 | 의미 | 한 줄 요약 |
|---|---|---|
| `event.target` | **실제로 클릭된(발생지)** 요소 | “진짜 눌린 애” |
| `event.currentTarget` | 리스너가 **붙어있는(처리자)** 요소 | “감시자(부모)” |

예시 상황:
- `#calculator-buttons`(부모)에 리스너 1개
- 그 안에 `<button>` 여러 개(자식)

버튼을 클릭하면:
- `event.target` → `<button>`
- `event.currentTarget` → `#calculator-buttons`

> 이벤트 위임은 **target으로 “진짜 눌린 것”을 판별**하는 패턴이다.

---

### 4) 이벤트 전파(Propagation): Capturing → Target → Bubbling
이벤트는 DOM 트리를 따라 **전파**된다. 기본 흐름은 이 3단계:

1. **Capturing(캡처링)**: 바깥 → 안쪽으로 내려옴  
2. **Target 단계**: 실제 이벤트가 발생한 요소 도착  
3. **Bubbling(버블링)**: 안쪽 → 바깥으로 올라감 (기본적으로 이게 자주 보임)

버블링은 이렇게 생각하면 된다:
```text
button → 부모 div → body → html → document → window
```

**중요**
- 이벤트 위임은 **버블링을 “활용”**하는 것이다.
- 즉, “자식에서 일어난 클릭이 부모까지 올라온다”는 성질을 이용해서  
  **부모 하나로 자식들의 클릭을 처리**한다.

---

### 5) 이벤트 위임(Event Delegation)이 실무에서 필수인 이유
#### ✅ 이유 1: 리스너를 1개로 줄인다
- 버튼 16개면 리스너도 16개…가 아니라  
  **부모 1개**로 끝.

#### ✅ 이유 2: 동적으로 생성되는 요소도 자동 대응
- 나중에 버튼을 JS로 추가해도
- 부모 리스너는 그대로 동작한다.

#### ✅ 이유 3: 유지보수/확장에 강함
- 계산기 → 메뉴 → 리스트 → 카드 → 테이블  
  구조가 커져도 패턴이 동일하다.

---

### 6) stopPropagation / preventDefault (언제 쓰나)
| 메서드 | 역할 | 언제 쓰나 |
|---|---|---|
| `event.preventDefault()` | 기본 동작 막기 | `<a>` 이동, `<form>` 제출 막을 때 |
| `event.stopPropagation()` | 전파(버블링) 중단 | “부모 위임 로직”과 충돌을 끊어야 할 때 |

**주의**
- `stopPropagation()`은 남발하면 구조를 망가뜨린다.
- 위임 기반에서는 가능하면 **조건 분기**로 해결하고, 정말 필요할 때만 사용.

---

## 🏗️ 미션 요구사항 체크리스트
- [ ] 계산기 버튼 10개 이상 존재
- [ ] 버튼에 개별 리스너 없음
- [ ] 부모 컨테이너에만 `click` 리스너 1개
- [ ] `event.target`이 버튼인지 검사
- [ ] 버튼 텍스트 출력
- [ ] `event.target` / `event.currentTarget` 차이 로그 확인

---

## 🧩 추천 설계 (현업 감각)
**핵심은 “클릭 → 무엇을 눌렀는지 분기 → 처리”**다.

1) 버튼들의 부모 컨테이너를 잡는다  
2) 부모에 `click` 리스너 1개 등록  
3) `event.target`이 버튼인지 확인  
4) 버튼 텍스트(값)를 읽고 처리

---

## 💻 구현 예시 (index.html 단일 파일)

> 아래 코드는 “위임 + 방어 + target/currentTarget 확인”까지 포함된 **정답급 기본 템플릿**이다.  
> (계산기 로직은 Day 32~에서 확장)

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Day 31 - Event Basics & Bubbling</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; }
      #calculator-container { width: 280px; }
      #display {
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 12px;
        margin-bottom: 12px;
        text-align: right;
        font-size: 24px;
      }
      #calculator-buttons {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }
      button {
        padding: 12px 0;
        border: 1px solid #333;
        border-radius: 10px;
        background: #fff;
        cursor: pointer;
        font-size: 16px;
      }
      button:active { transform: translateY(1px); }
    </style>
  </head>
  <body>
    <h1>Day 31 — Event Basics & Bubbling</h1>

    <div id="calculator-container">
      <div id="display">0</div>

      <!-- ✅ 리스너는 이 부모에만 붙일 것 -->
      <div id="calculator-buttons">
        <button data-value="7">7</button>
        <button data-value="8">8</button>
        <button data-value="9">9</button>
        <button data-value="+">+</button>

        <button data-value="4">4</button>
        <button data-value="5">5</button>
        <button data-value="6">6</button>
        <button data-value="-">-</button>

        <button data-value="1">1</button>
        <button data-value="2">2</button>
        <button data-value="3">3</button>
        <button data-value="*">*</button>

        <button data-value="C">C</button>
        <button data-value="0">0</button>
        <button data-value="=">=</button>
        <button data-value="/">/</button>
      </div>
    </div>

    <script>
      const buttonContainer = document.getElementById("calculator-buttons");
      const display = document.getElementById("display");

      buttonContainer.addEventListener("click", (event) => {
        // 1) target이 버튼인지 확인 (방어 로직)
        const btn = event.target.closest("button");
        if (!btn || !buttonContainer.contains(btn)) return;

        // 2) 눌린 값 추출
        const value = btn.dataset.value ?? btn.textContent;

        // 3) 로그로 차이 확인
        console.log("클릭된 버튼 value:", value);
        console.log("event.target:", event.target);
        console.log("event.currentTarget:", event.currentTarget);

        // 4) (임시) display에 찍어보기
        // Day 31은 위임 구조 학습이 목표라, 계산기 로직은 최소만.
        display.textContent = value;
      });
    </script>
  </body>
</html>
```

---

## 🧪 빠른 테스트 시나리오
- 버튼을 여러 개 눌러서:
  - 콘솔에 버튼 값이 찍히는지
  - `event.target`이 버튼(또는 버튼 내부 노드)로 나오는지
  - `event.currentTarget`이 항상 `#calculator-buttons`인지 확인
- 버튼 사이의 빈 공간(그리드 gap)을 클릭해도 에러 없이 조용히 무시되는지 확인

---

## 🔥 실무 핵심 포인트 요약
- 이벤트 위임은 “버블링을 이용해서 리스너를 최소화”하는 패턴
- `target`은 “발생지”, `currentTarget`은 “처리자”
- 방어 코드는 필수: `closest("button")` + `contains()`
- 동적 UI(리스트/카드/테이블)는 거의 다 이 구조로 간다

---

## 🎯 얻어가는 점
- 이벤트가 “한 점”이 아니라 **전파되는 흐름**이라는 감각
- 리스너를 “요소마다”가 아니라 **구조(부모)에 붙이는 사고**
- 실무에서 자주 보는 Delegation 패턴을 계산기로 체득

---

## 📚 참고 키워드 (MDN)
- EventTarget.addEventListener
- Event.target
- Event.currentTarget
- Event bubbling & capturing
- Element.closest
- Event delegation
