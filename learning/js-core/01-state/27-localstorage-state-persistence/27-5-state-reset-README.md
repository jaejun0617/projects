# Day 27.5 — State Reset (Reference State)

## 🏷 Topic
State Reset / Reference State / LocalStorage Cleanup

## 🔎 관련 검색어
- frontend state reset pattern  
- reference state vs current state  
- localStorage reset best practice  
- derived state vs persisted state  
- undo reset state design  

---

## ✅ 한 줄 요약
원상복구는 기능이 아니라 **기준 상태(reference state)를 어디에 두느냐의 문제**다.

---

## 📌 프로젝트 개요 (WHY)
Day 27에서 상태를 영속화했다면, 반드시 따라오는 요구는 **되돌리기(Reset)**다.  
이 단계의 목적은 단순히 “초기화 버튼”을 만드는 것이 아니다.

**상태 설계에서 ‘기준점’을 코드 레벨로 분리하는 것**이 핵심이다.

> LocalStorage는 저장소일 뿐,  
> 상태의 기준(reference)은 될 수 없다.

---

## 🎯 미션 목표
- 코드 상에 **초기 상태(reference state)** 를 명시적으로 정의한다
- 현재 상태와 기준 상태를 명확히 분리한다
- Reset 시 LocalStorage와 UI 상태를 동시에 초기화한다
- Drag & Order, Undo 설계로 확장 가능한 기반을 만든다

---

## 🧠 핵심 사고

### 1. Reset은 Undo가 아니다
- Undo → 이전 상태로 이동  
- Reset → **기준 상태로 재동기화**

Reset은 “과거”가 아니라 “출발점”으로 돌아가는 행위다.

---

### 2. 기준 상태는 반드시 코드에 존재해야 한다
```js
const INITIAL_ITEMS = [...]
```

- LocalStorage ❌  
- 현재 items ❌  
- **명시적인 Reference State ⭕**

---

### 3. 파생 상태는 기준이 될 수 없다
- selectedCount  
- all / some / none  
- checkbox UI 상태  

👉 전부 계산 결과일 뿐, 저장하거나 기준으로 삼지 않는다.

---

## 🧩 상태 모델
```js
const INITIAL_ITEMS = [
  { id: 1, text: 'Learn JS', selected: false },
  { id: 2, text: 'Practice DOM', selected: false },
  { id: 3, text: 'Persist State', selected: false },
];

let items = loadState() ?? structuredClone(INITIAL_ITEMS);
```

- INITIAL_ITEMS: 기준 상태 (Reference)
- items: 현재 상태 (Mutable)
- 두 상태는 **절대 동일 참조를 공유하지 않는다**

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 기준 상태 정의
```js
const INITIAL_ITEMS = [
  { id: 1, text: 'Learn JS', selected: false },
  { id: 2, text: 'Practice DOM', selected: false },
  { id: 3, text: 'Persist State', selected: false },
];
```

---

### 2️⃣ 초기 상태 결정 로직
```js
let items = loadState() ?? structuredClone(INITIAL_ITEMS);
```

- 저장된 상태가 있으면 복원
- 없으면 기준 상태에서 새로 시작

---

### 3️⃣ Reset 로직 (핵심)
```js
function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  items = structuredClone(INITIAL_ITEMS);
  render();
}
```

- 저장소 정리
- 상태 재할당
- UI 재동기화

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 기준 상태는 상수로 분리
- Reset은 상태 재할당 + render
- LocalStorage는 내부 구현 세부사항으로 격리

### 기른 역량
- 상태 기준점 설계 능력
- 영속 상태와 기준 상태 분리 사고
- Drag / Undo / Sync 설계의 안전한 출발점 확보

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
- [ ] 기준 상태가 코드에 명시되어 있는가
- [ ] Reset 시 LocalStorage가 함께 정리되는가
- [ ] 기준 상태와 현재 상태가 참조를 공유하지 않는가
- [ ] Reset 이후 UI가 정상적으로 초기화되는가

---

## 🎯 얻어가는 점
- 원상복구는 버튼 문제가 아니라 **설계 문제**
- 기준 상태가 있어야 상태 확장이 가능하다
- Day 28 Drag & Order에서 “망가질 수 있는 상태”를 다룰 준비 완료
