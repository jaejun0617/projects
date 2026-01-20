# Day 28 — Drag & Order (List Order State)

## 🏷 Topic
Drag & Drop / List Order State / Array Reordering

## 🔎 관련 검색어
- javascript drag and drop list reorder
- array reorder state pattern
- drag drop state management
- frontend list order persistence
- reorder list without dom manipulation

---

## ✅ 한 줄 요약
드래그는 DOM을 움직이는 기술이 아니라 **배열 순서를 재배열하는 상태 연산**이다.

---

## 📌 프로젝트 개요 (WHY)
Day 28은 드래그 UI를 멋있게 만드는 날이 아니다.  
리스트의 **순서 자체를 상태로 다루는 사고**를 완성하는 단계다.

지금까지 우리는:
- 추가 / 삭제 / 수정
- 선택 / 필터 / 영속화 / 리셋

을 다뤘다.  
이제 마지막으로 남은 퍼즐은 이것이다.

> “순서가 바뀌는 변화도 상태로 다룰 수 있는가?”

---

## 🎯 미션 목표
- 리스트 아이템의 순서를 **배열 상태로 관리**한다
- Drag 이벤트는 상태 변경의 트리거로만 사용한다
- DOM 이동 없이 render 결과로 순서를 반영한다
- Reset을 통해 언제든 기준 순서로 복구한다

---

## 🧠 핵심 사고

### 1. Drag는 UI 이벤트일 뿐이다
- 드래그했다 ❌
- **배열의 index가 바뀌었다 ⭕**

UI에서 발생한 모든 인터랙션은
결국 **상태 연산**으로 환원된다.

---

### 2. 순서는 값이다
```js
[
  { id: 1, text: 'Item A' },
  { id: 2, text: 'Item B' },
  { id: 3, text: 'Item C' },
]
```

- 순서는 DOM 위치 ❌
- 순서는 **배열의 index ⭕**

---

### 3. 이동은 제거 + 삽입이다
```js
const [moved] = updated.splice(fromIndex, 1);
updated.splice(toIndex, 0, moved);
```

- 교환(swap) ❌
- 재배열(reorder) ⭕

---

## 🧩 상태 모델
```js
const INITIAL_ITEMS = [
  { id: 1, text: 'Item A' },
  { id: 2, text: 'Item B' },
  { id: 3, text: 'Item C' },
  { id: 4, text: 'Item D' },
];

let items = structuredClone(INITIAL_ITEMS);
```

- 배열 = 순서를 포함한 상태
- index 변화 = 상태 변화
- DOM은 결과 표현

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 드래그 대상 식별
```js
let draggedId = null;

listEl.addEventListener('dragstart', (e) => {
  draggedId = Number(e.target.dataset.id);
});
```

---

### 2️⃣ index 계산
```js
const fromIndex = items.findIndex(i => i.id === draggedId);
const toIndex = items.findIndex(i => i.id === targetId);
```

---

### 3️⃣ 배열 재배열 (핵심)
```js
const updated = [...items];
const [moved] = updated.splice(fromIndex, 1);
updated.splice(toIndex, 0, moved);

items = updated;
render();
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- DOM 직접 이동 금지
- Drag 이벤트는 상태 변경 트리거 역할만 수행
- render는 항상 상태의 결과

### 기른 역량
- 순서를 상태로 다루는 사고
- 복잡한 인터랙션을 단순한 배열 연산으로 환원
- 실무 Drag & Drop 라이브러리 이해 기반 확보

---

## 📂 파일 구조
```
28-drag-order-state/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] 드래그 후 배열 순서가 변경되는가
- [ ] DOM 직접 조작 없이 UI가 갱신되는가
- [ ] Reset으로 기준 순서 복구가 가능한가
- [ ] 상태 → render 흐름이 유지되는가

---

## 🎯 얻어가는 점
- Drag는 기술이 아니라 **상태 설계 문제**
- 리스트 상태의 모든 변형(CRUD + Order) 완성
- 이후 Undo / Sync / React로 자연스럽게 확장 가능
