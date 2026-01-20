# Day 30 — State Architecture (총정리)

## 🏷 Topic
State Architecture / Source of Truth / Derived State / Frontend Design

## 🔎 관련 검색어
- frontend state architecture
- source of truth frontend
- derived state pattern
- state driven ui design
- react state architecture basics

---

## ✅ 한 줄 요약
상태 관리는 기능 구현이 아니라 **상태를 분류하고 흐름을 고정하는 설계 문제**다.

---

## 📌 프로젝트 개요 (WHY)
Day 30은 새로운 기능을 추가하지 않는다.  
대신 Day 15~29 동안 구현한 모든 기능을 **하나의 상태 설계 언어로 정리**한다.

이 단계의 목적은 단순하다.

> “이 상태는 왜 필요하고,  
> 이 상태는 왜 저장하지 않는가?”를 설명할 수 있는가

이 질문에 답할 수 있다면,  
React · 상태 관리 라이브러리로 넘어가도 길을 잃지 않는다.

---

## 🎯 미션 목표
- 지금까지 사용한 모든 상태를 **종류별로 분류**한다
- 상태 변경의 **공통 흐름**을 하나의 공식으로 정리한다
- 저장해야 할 상태와 계산으로 충분한 상태를 구분한다
- 이후 JS 엔진 / Closure 학습의 연결 고리를 만든다

---

## 🧠 핵심 사고

### 1. 모든 상태는 동일하지 않다
상태는 용도에 따라 명확히 구분되어야 한다.

| 분류 | 역할 | 예시 |
|---|---|---|
| Source of Truth | 앱의 실제 데이터 | `items` |
| Derived State | 계산 결과 | `filteredItems`, `selectedCount` |
| UI State | 화면 모드 | `filter`, `isEditing` |
| Reference State | 기준 상태 | `INITIAL_ITEMS` |
| History State | 시간 축 상태 | `history[]` |

---

### 2. 저장 대상은 극히 제한적이다
```text
저장 ⭕ : Source of Truth
저장 ❌ : Derived / UI / History
```

저장은 **편의 기능**이 아니라  
상태 생명주기의 일부일 뿐이다.

---

### 3. 상태 변경 흐름은 항상 동일하다
```text
Event
 → State Change (immutable)
 → Derived State 계산
 → Render
 → Side Effect (Storage)
```

이 흐름이 무너지면:
- 버그가 늘고
- 상태가 꼬이고
- Undo / Reset이 불가능해진다

---

## 🧩 상태 모델 (통합 관점)

```js
// Source
items

// Derived
filteredItems
selectionState

// UI
filter
isEditing

// Reference
INITIAL_ITEMS

// History
history
```

이 분류는 **기능이 늘어나도 변하지 않는다**.

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 상태 변경의 단일 진입점
```js
function updateState(nextItems) {
  items = nextItems;
  render();
}
```

---

### 2️⃣ 파생 상태는 항상 계산
```js
const selectedCount = items.filter(i => i.selected).length;
```

---

### 3️⃣ 사이드 이펙트는 render 이후
```js
function render() {
  drawUI();
  saveToStorage();
}
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 상태 변경은 항상 불변성 유지
- render는 중앙 허브 역할
- 이벤트는 상태 변경 트리거일 뿐

### 기른 역량
- 상태를 분류하는 사고 능력
- UI 중심 사고 → 상태 중심 사고 전환
- React 상태 관리 개념 선행 이해

---

## 📂 파일 구조 (개념적)
```
state/
├─ source.js
├─ derived.js
├─ ui.js
├─ history.js
└─ render.js
```

(실제 분리는 선택 사항)

---

## ☑️ 체크리스트
- [ ] 이 상태가 왜 필요한지 설명할 수 있는가
- [ ] 저장 대상과 계산 대상이 명확히 구분되는가
- [ ] Reset / Undo 흐름이 설계상 자연스러운가
- [ ] React로 옮겨도 구조가 유지되는가

---

## 🎯 얻어가는 점
- 상태 관리에 대한 공통 언어 확보
- 기능 추가보다 설계가 중요하다는 감각
- JS 엔진 / Closure 학습으로 자연스럽게 연결되는 발판
