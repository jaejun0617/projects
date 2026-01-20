# Day 27 — LocalStorage (State Persistence)

## ✅ 한 줄 요약
LocalStorage는 기능이 아니라 **상태의 생명주기를 브라우저까지 확장하는 수단**이다.

---

## 📌 프로젝트 개요 (WHY)
Day 27의 목적은 데이터를 저장하는 것이 아니다.  
**하나의 source of truth(state)를 새로고침 이후에도 유지하는 구조를 만드는 것**이다.

중요한 질문은 이것이다.

> “어떤 상태를 저장해야 하고, 어떤 상태는 계산으로 충분한가?”

---

## 🎯 미션 목표
- 리스트 상태(`items`)를 LocalStorage에 저장한다
- 새로고침 후에도 동일한 UI 상태를 복원한다
- 파생 상태는 저장하지 않고 항상 계산한다
- `load → render → save` 흐름을 고정한다

---

## 🧠 핵심 사고

### 1. 저장 대상은 단 하나
```js
items
```

- 체크 여부, 개수, 버튼 상태 ❌
- 오직 **상태의 근원(source of truth)** 만 저장 ⭕

---

### 2. 파생 상태는 항상 계산한다
```js
const selectedCount = items.filter(i => i.selected).length;
```

- LocalStorage에 중복 저장 ❌
- 상태 불일치 가능성 제거 ⭕

---

### 3. render는 UI + 저장의 기준점
```js
render() {
  ...
  saveState();
}
```

- 이벤트마다 저장하지 않는다
- **상태가 화면에 반영되는 순간이 곧 저장 타이밍**

---

## 🧩 상태 모델
```js
let items = [
  { id: 1, text: 'Learn JS', selected: false },
  { id: 2, text: 'Practice DOM', selected: false },
  { id: 3, text: 'Persist State', selected: false },
];
```

- 배열 = 리스트 상태
- 객체 = 단일 항목 상태
- 이 구조 그대로 Day 28로 확장된다

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- `loadState()`로 초기 상태 결정
- 상태 변경 후 `render()`만 호출
- LocalStorage는 내부 구현 세부사항

### 기른 역량
- 상태 생명주기 설계 능력
- 새로고침을 고려한 UI 구조 사고
- 이후 Drag / Sync / Server State 전환 기반 확보

---

## 📂 파일 구조
```
27-localstorage-state-persistence/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] 새로고침 후 상태가 유지되는가
- [ ] 파생 상태를 저장하지 않았는가
- [ ] LocalStorage 제거 시 초기 상태로 정상 동작하는가
- [ ] 상태 → render → 저장 흐름이 깨지지 않는가

---

## 🎯 얻어가는 점
- LocalStorage는 보조 수단일 뿐, 설계의 중심은 state
- 저장보다 중요한 것은 **무엇을 저장하지 않는가**
- Day 28 Drag & Order로 자연스럽게 연결되는 구조 완성
