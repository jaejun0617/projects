# Day 52 — Component 분리 & 책임 설계

## 🏷 Topic
Component Responsibility / Props Pattern / State Ownership / Composition

## 🔎 관련 검색어
- javascript component architecture
- separation of concerns frontend
- props pattern without react
- single source of truth ui
- component responsibility design

---

## ✅ 한 줄 요약
컴포넌트는 화면 조각이 아니라  
**“하나의 책임만 가지는 함수”**다.

---

## 📌 프로젝트 개요 (WHY)
Day 52는 컴포넌트를 예쁘게 나누는 날이 아니다.  
**UI 복잡도가 커질 때 구조가 무너지지 않게 만드는 기준을 세우는 단계**다.

상태, 표시, 행동이 한 곳에 섞이면:
- 수정 비용이 증가하고
- 재사용이 불가능해지며
- 구조 설명이 어려워진다

이 Day의 목적은  
**책임 단위로 UI를 분해하는 사고**를 만드는 것이다.

---

## 🎯 미션 목표
- 상태 소유권을 명확히 분리한다
- 컴포넌트는 자신의 책임만 수행한다
- 데이터는 props로만 전달한다
- 상위(App)에서 조합한다

---

## 🧠 핵심 사고

### 1️⃣ 상태는 한 곳에만 존재한다
```js
let state = { count: 0 };
```

- 여러 컴포넌트가 state를 공유 ❌
- Store 단일 소유 ⭕

---

### 2️⃣ 컴포넌트는 “무엇을 할지”만 안다
```js
CounterDisplay({ count })
```

- state를 모른다
- DOM 전체를 모른다
- 전달받은 값만 사용한다

---

### 3️⃣ 행동은 위로 전달된다
```js
CounterControls({ onIncrement })
```

- 이벤트 발생
- 상태 변경 요청
- 실제 변경은 Store에서

---

## 🧠 핵심 이론 보강

### Responsibility 분리 기준
| 영역 | 책임 |
|---|---|
| Store | 상태 소유 / 변경 |
| App | 조합 / 배치 |
| Display | 표시 |
| Controls | 입력 / 이벤트 |

👉 이 경계가 깨지면 유지보수가 무너진다.

---

### Props 패턴의 의미
- 데이터는 내려온다 (Down)
- 이벤트는 올라간다 (Up)

👉 React의 기본 흐름과 동일

---

## 🧩 상태 모델
```js
{
  count: number
}
```

- 단순하지만 구조 설명에 최적
- 복잡해져도 원칙은 동일

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 상태 변경
```js
function setState(next) {
  state = { ...state, ...next };
  renderApp();
}
```

---

### 2️⃣ Display 컴포넌트
```js
function CounterDisplay({ count }) { ... }
```

---

### 3️⃣ Controls 컴포넌트
```js
function CounterControls({ onIncrement, onDecrement }) { ... }
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 컴포넌트는 DOM 조각 반환
- 상태 직접 접근 금지
- 상위에서만 상태 변경

### 기른 역량
- 컴포넌트 책임 설계 능력
- Props 기반 데이터 흐름 이해
- React 컴포넌트 사고의 기초 완성

---

## 📂 파일 구조
```
52-component-responsibility/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] 컴포넌트 책임을 말로 설명할 수 있는가
- [ ] 상태가 단일 소유인가
- [ ] props 없이 상태 접근을 하지 않았는가
- [ ] 상위에서 조합하고 있는가

---

## 🎯 얻어가는 점
- 컴포넌트는 역할이다
- 구조는 미리 정해야 한다
- 이 패턴이 React의 출발점이다
