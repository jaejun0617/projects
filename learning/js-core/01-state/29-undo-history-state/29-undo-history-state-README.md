# Day 29 — Undo / History (State Time Machine)

## 🏷 Topic
Undo / Redo / State History / Time Travel State

## 🔎 관련 검색어
- javascript undo state pattern
- state history stack frontend
- undo redo implementation js
- time travel state management
- immutable state history

---

## ✅ 한 줄 요약
Undo는 버튼 기능이 아니라 **상태 변경 이력을 관리하는 구조**다.

---

## 📌 프로젝트 개요 (WHY)
Day 29는 “되돌리기 버튼”을 만드는 날이 아니다.  
상태가 시간에 따라 어떻게 변화해 왔는지를 **구조적으로 보존하는 사고**를 학습하는 단계다.

지금까지 우리는 상태를 “현재”로만 다뤘다.  
이제 상태에 **시간 축(Time Axis)** 을 추가한다.

> 현재 상태란,  
> 히스토리 스택의 가장 마지막 상태일 뿐이다.

---

## 🎯 미션 목표
- 상태 변경 시마다 스냅샷을 저장한다
- 이전 상태로 되돌릴 수 있는 Undo 구조를 만든다
- Reset을 통해 기준 상태로 복구한다
- 상태 변경과 렌더링 흐름을 명확히 분리한다

---

## 🧠 핵심 사고

### 1. 현재 상태는 항상 마지막 스냅샷이다
```js
const current = history[history.length - 1];
```

- 단일 state ❌
- **state history stack ⭕**

---

### 2. 상태는 덮어쓰지 않는다
```js
history.push(structuredClone(nextState));
```

- mutate ❌
- 스냅샷 추가 ⭕

Undo가 가능한 이유는  
**과거 상태를 파괴하지 않기 때문**이다.

---

### 3. Undo는 스택을 되돌리는 연산이다
```js
history.pop();
```

- 특별한 로직 ❌
- 마지막 상태 제거 ⭕

---

## 🧩 상태 모델
```js
const INITIAL_ITEMS = [...];

let history = [
  structuredClone(INITIAL_ITEMS)
];
```

- history = 상태 타임라인
- history[n] = 특정 시점의 상태
- 현재 상태는 항상 `history.at(-1)`

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 상태 추가
```js
function pushState(nextState) {
  history.push(structuredClone(nextState));
  render();
}
```

---

### 2️⃣ Undo 처리
```js
undoBtn.addEventListener('click', () => {
  if (history.length > 1) {
    history.pop();
    render();
  }
});
```

---

### 3️⃣ Reset 처리
```js
history = [structuredClone(INITIAL_ITEMS)];
render();
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 상태 변경은 항상 새 스냅샷 생성
- render는 현재 상태만 참조
- history 길이에 따라 UI 제어

### 기른 역량
- 상태 불변성 사고
- 시간 축을 포함한 상태 설계
- Redux / React DevTools 개념 선행 이해

---

## 📂 파일 구조
```
29-undo-history-state/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] 상태 변경 시 history가 누적되는가
- [ ] Undo 시 이전 상태로 정확히 복구되는가
- [ ] 초기 상태로 Reset 가능한가
- [ ] 현재 상태 기준 render가 유지되는가

---

## 🎯 얻어가는 점
- Undo는 기능이 아니라 **아키텍처**
- 상태는 현재만 존재하지 않는다
- 이후 복잡한 앱 상태 관리의 핵심 개념 확보
