# Day 41 — DOM Event Architecture (버블링 · 위임 · 단일 리스너)

## 🏷 Topic
DOM Event Architecture / Bubbling & Delegation / Single Listener / State-driven UI

## 🔎 관련 검색어
- dom event bubbling delegation
- event delegation dataset action
- addEventListener capture vs bubble
- event target vs currentTarget
- event delegation best practices

---

## ✅ 한 줄 요약
DOM 이벤트는 “버튼마다 붙이는 기술”이 아니라 **이벤트 흐름을 하나의 해석 지점으로 모으는 아키텍처 문제**다.

---

## 📌 프로젝트 개요 (WHY)
Day 41은 투두리스트 기능을 늘리는 날이 아니다.  
Day 15~29에서 이미 상태 모델링은 충분히 했고, 이제는 **상태 변경을 트리거하는 이벤트 구조**를 설계한다.

Day 15~29의 핵심이
- “무엇을 바꿀 것인가”(state 모델)

였다면, Day 41의 핵심은
- “누가, 언제, 어디서 바꾸게 할 것인가”(event architecture)

다.

> 이벤트를 잘 설계하면, 상태 변경의 경로가 통제되고  
> UI가 커져도 유지보수가 무너지지 않는다.

---

## 🎯 미션 목표
- 이벤트 리스너를 **여러 개**가 아니라 **1개(루트)** 로 운영한다
- 클릭의 의미를 `data-action`으로 표준화한다
- 동적 요소(추가된 아이템)도 **추가 바인딩 없이** 동작하게 만든다
- 이벤트 → 상태 연산 → render 흐름을 유지한다

---

## 🧠 핵심 사고

### 1) 이벤트는 “발생”보다 “전파”가 중요하다
DOM 이벤트는 한 지점에서 끝나지 않고, 기본적으로 **버블링(bubbling)** 한다.

- target에서 시작
- 부모로 전파
- document까지 도달 가능

👉 그래서 “한 곳에서 받는 구조”가 가능해진다.

---

### 2) Event Delegation = 이벤트를 위임하는 구조
버튼마다 리스너를 붙이지 않고,
**공통 조상(루트)에서 이벤트를 받고** 실제 행동은 target을 해석해 결정한다.

장점
- 동적으로 추가된 요소도 즉시 동작
- 리스너 수가 고정
- 이벤트 고려 범위가 한 곳으로 모임

---

### 3) 의미는 DOM 구조가 아니라 data로 정의한다
클릭의 의미를 CSS 클래스나 텍스트로 판단하면 구조 변경에 취약하다.

```html
<button data-action="toggle">완료</button>
<button data-action="remove">삭제</button>
```

👉 이벤트 설계의 핵심은 “의미의 표준화”다.

---

### 4) 이벤트는 상태를 바꾸는 트리거일 뿐
DOM을 직접 수정하지 않는다.

- 이벤트 → 상태 연산
- 상태 → render
- DOM은 결과물

👉 Day 15~29의 state → render 사고를 이벤트 구조에 결합한다.

---

## 🧠 핵심 이론 보강 (빠지기 쉬운 포인트)

### target vs currentTarget
- `e.target` : 실제 클릭된 가장 안쪽 요소
- `e.currentTarget` : 리스너가 붙은 요소(여기선 document)

위임 구조에서는 **target 기반 해석**이 필수다.

---

### closest()가 필요한 이유
버튼을 눌러도 실제 target은 아이콘/스팬일 수 있다.

```js
const itemEl = e.target.closest('.item');
```

👉 “어느 아이템에 속한 클릭인가”를 안정적으로 찾는 도구다.

---

### capture vs bubble (지금은 bubble만 사용)
`addEventListener(type, handler, true)` 는 capture 단계에서 동작한다.
Day 41은 기본값(bubble)을 사용해 **버블링 기반 위임**만 다룬다.

---

## 🧩 상태 모델
```js
let items = [];
let nextId = 1;
```

각 아이템은 다음 구조를 가진다.

```js
{ id: number, text: string, done: boolean }
```

- 배열 = 리스트 상태
- 객체 = 단일 아이템 상태
- done = 완료 상태

---

## 🧠 핵심 코드 스냅샷

### 1) 단일 리스너 (루트에서 해석)
```js
document.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  // 상단 컨트롤
  if (action === 'add') addItem();
  if (action === 'clear') clearAll();

  // 리스트 아이템(위임)
  const itemEl = e.target.closest('.item');
  if (itemEl) {
    const id = Number(itemEl.dataset.id);
    if (action === 'toggle') toggleItem(id);
    if (action === 'remove') removeItem(id);
  }

  render();
});
```

---

### 2) 상태 연산은 배열 메서드로만
```js
function toggleItem(id) {
  items = items.map((it) =>
    it.id === id ? { ...it, done: !it.done } : it
  );
}

function removeItem(id) {
  items = items.filter((it) => it.id !== id);
}
```

---

### 3) render는 결과만 그린다
```js
function render() {
  list.innerHTML = items
    .map((item) => `
      <li class="item ${item.done ? 'done' : ''}" data-id="${item.id}">
        <span>${item.text}</span>
        <div class="actions">
          <button data-action="toggle">완료</button>
          <button data-action="remove">삭제</button>
        </div>
      </li>
    `)
    .join('');
}
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 리스너는 1개 (루트)
- 행동 의미는 `data-action`으로 고정
- DOM 직접 수정 ❌
- 상태 변경 후 render만 호출

### 기른 역량
- 이벤트 버블링 기반 위임 구조 설계
- 동적 UI에서도 유지되는 이벤트 처리
- 상태 아키텍처와 이벤트 아키텍처 연결

---

## 📂 파일 구조
```
41-dom-event-architecture/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] 리스너가 1개인지 확인했는가
- [ ] 동적으로 추가된 아이템도 별도 바인딩 없이 동작하는가
- [ ] 클릭 의미를 data-action으로만 판별하는가
- [ ] 이벤트 이후 DOM 직접 수정 없이 render로만 갱신하는가
- [ ] e.target / closest 흐름을 설명할 수 있는가

---

## 🎯 얻어가는 점
- 이벤트는 기능이 아니라 **흐름 설계**
- UI가 커져도 이벤트 관리가 무너지지 않는 구조
- Day 42~43에서 **위임 심화 / 폼 상태 처리**로 자연스럽게 확장 가능
