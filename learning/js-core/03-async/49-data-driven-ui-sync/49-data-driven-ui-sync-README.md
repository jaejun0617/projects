# Day 49 — Data-driven UI & State Sync

## 🏷 Topic
Data-driven UI / Derived State / State Sync / LocalStorage / Single Source of Truth

## 🔎 관련 검색어
- data driven ui javascript
- derived state vs stored state
- single source of truth frontend
- localstorage state sync
- state driven rendering pattern

---

## ✅ 한 줄 요약
UI는 이벤트에 반응하는 것이 아니라  
**데이터와 상태의 변화 결과로 ‘자동 생성’되어야 한다.**

---

## 📌 프로젝트 개요 (WHY)
Day 49는 새로운 인터랙션을 만드는 날이 아니다.  
**“데이터가 UI를 지배한다”는 프론트엔드의 핵심 원칙을 완성하는 단계**다.

지금까지 우리는:
- 이벤트를 설계했고
- 상태를 분리했고
- 비동기를 통제했다

이제 남은 질문은 하나다.

> “서버 데이터가 바뀌면, UI는 어떻게 자동으로 따라와야 하는가?”

---

## 🎯 미션 목표
- 서버 데이터를 단일 상태로 관리한다
- 파생 상태(filter/search)를 계산으로만 만든다
- 상태 변경 시 UI가 자동으로 동기화된다
- 새로고침 이후에도 상태를 복원한다

---

## 🧠 핵심 사고

### 1️⃣ Single Source of Truth
```js
items: [] // 서버에서 받은 원본 데이터
```

- 데이터는 한 곳에만 존재
- UI는 데이터를 소유하지 않는다
- 이벤트는 데이터 자체를 모른다

---

### 2️⃣ 파생 상태는 저장하지 않는다
```js
function getVisibleItems() { ... }
```

- ❌ visibleItems를 state에 저장
- ⭕ 항상 계산

👉 필터, 검색은 **의도(intent)** 이지 사실(fact)이 아니다.

---

### 3️⃣ 이벤트는 ‘의도’만 바꾼다
```js
state = { ...state, filter: 'completed' };
```

- 이벤트 → 데이터 ❌
- 이벤트 → 상태 조각 ⭕

---

## 🧠 핵심 이론 보강

### Fact vs Intent
| 구분 | 예시 |
|---|---|
| Fact | items |
| Intent | filter, search |
| Result | visibleItems (계산) |

---

### State Sync의 의미
- 상태 저장 = 사용자 맥락 보존
- 새로고침은 “앱 종료”가 아니다
- LocalStorage는 **간단한 persistence 레이어**

---

## 🧩 상태 모델
```js
let state = {
  status: 'idle' | 'loading' | 'success' | 'error',
  items: [],
  filter: 'all',
  search: '',
};
```

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 파생 상태 계산
```js
const items = getVisibleItems();
```

---

### 2️⃣ 상태 저장
```js
localStorage.setItem(STORAGE_KEY, JSON.stringify({...}));
```

---

### 3️⃣ 상태 복원
```js
restoreState();
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 데이터는 단일 상태로 관리
- 파생 값은 계산
- render는 상태 결과만 표현

### 기른 역량
- Data-driven UI 설계 능력
- Derived state 사고
- SPA/React 구조로의 자연스러운 연결

---

## 📂 파일 구조
```
49-data-driven-ui-sync/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] 데이터와 의도를 구분했는가
- [ ] 파생 상태를 저장하지 않았는가
- [ ] 새로고침 후 상태가 복원되는가
- [ ] UI가 상태 결과로만 그려지는가

---

## 🎯 얻어가는 점
- UI는 결과다
- 데이터가 중심이다
- 이벤트는 보조다
- 이 구조가 SPA/React의 기본 뼈대다
