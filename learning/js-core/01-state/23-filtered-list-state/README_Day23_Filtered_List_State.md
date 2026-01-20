# Day 23 — Filtered List (Derived State Rendering)

🗓 **Date**  
2026-01-17 (Sat)

📁 **Folder Name**  
`23-filtered-list-state`

> Day 22 폴더명 규칙(`22-edit-mode-toggle`)을 그대로 이어가는 형식  
> 👉 `숫자-핵심개념-kebab-case`

---

## ✅ 오늘 한 줄 요약
> 필터 기능은 데이터를 바꾸는 기능이 아니라, **같은 상태를 조건에 따라 다르게 보여주는 설계 문제**다.

---

## 📌 프로젝트 개요 (WHY)

Day 23은 새로운 기능을 많이 추가하는 날이 아니다.  
이 Day의 핵심은 **원본 상태(state)를 직접 수정하지 않고, 파생된 상태(derived state)를 만들어 화면을 구성하는 사고**를 익히는 것이다.

Todo 필터링은 다음 질문에 대한 답을 코드로 만드는 과정이다.

- ❌ “이 Todo를 수정할까?”
- ⭕ **“지금 어떤 Todo들만 보여줘야 할까?”**

이 사고는 이후:

- 검색 결과 필터링
- 탭 UI
- 카테고리 분기
- React `useMemo`, `computed state`

로 그대로 이어진다.

---

## 🎯 미션 목표 (Mission Goals)

- 원본 Todo 배열을 **단일 source of truth**로 유지
- 필터 조건을 상태(`filter`)로 분리
- 화면에 보여줄 목록을 **계산된 결과**로 생성
- 조건문을 **리스트 선택 규칙**으로만 사용
- 상태 변경과 렌더링 책임 분리

---

## 🔥 오늘의 핵심 (Key Takeaways)

- 필터는 **상태 변경이 아니다**
- UI는 항상 `state → 계산 → 결과` 흐름을 따른다
- 파생 상태는 render 직전에 계산된다
- 조건문은 흐름 제어가 아니라 **선택 규칙**이다

---

## 🧠 핵심 개념 / 설계 요약

### 1️⃣ 상태(State) 구조

```js
const state = {
  todos: [],        // 원본 상태
  filter: 'all',    // all | active | completed
};
```

- `todos`는 절대 직접 가공하지 않는다
- `filter`는 “보기 조건”만 담당

---

### 2️⃣ 파생 상태(Derived State)

```js
function getFilteredTodos() {
  if (state.filter === 'active') {
    return state.todos.filter(todo => !todo.isDone);
  }
  if (state.filter === 'completed') {
    return state.todos.filter(todo => todo.isDone);
  }
  return state.todos;
}
```

- 화면에 보이는 리스트는 항상 계산 결과
- 원본 배열은 그대로 유지

---

### 3️⃣ 필터 전환 = 상태 변경

```js
state.filter = 'completed';
renderTodos();
```

- Todo 자체는 변경 ❌
- “무엇을 볼지”만 변경 ⭕

---

## 🏗️ 구현 기준 & 기른 역량

### 구현 기준

- 원본 상태 불변 유지
- 조건문은 파생 상태 계산에만 사용
- render는 계산된 결과만 그린다
- 필터 버튼은 상태 변경 트리거 역할

### 기른 역량

- 파생 상태 개념 이해
- 배열 + 조건 분기 설계 감각
- 상태 선택 기반 UI 렌더링
- 실무 필터 패턴 기초 완성

---

## 🏗️ 구현 내용 (UI 퍼블리셔 과제)

### A. 요구사항

- Todo 추가
- 완료 / 미완료 토글
- 필터 버튼으로 목록 분기
  - 전체
  - 미완료
  - 완료
- 필터 상태 시각적 표시

### B. UI 구조 예시

```
[ 전체 ] [ 미완료 ] [ 완료 ]

[ 운동하기 ]
[ 책 읽기 ]
```

---

## 📁 파일 구조

```txt
23-filtered-list-state/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  └─ main.js
└─ README.md
```

---

## ⚙️ 핵심 코드 (구조 중심)

```js
const visibleTodos = getFilteredTodos();
```

```js
state.filter = btn.dataset.filter;
renderTodos();
```

---

## ✅ 제출 체크리스트

- [ ] 원본 Todo 배열이 직접 변경되지 않는가?
- [ ] 필터 조건이 상태로 분리되어 있는가?
- [ ] 화면에 보여지는 목록이 파생 상태인가?
- [ ] 상태 변경 후 render로 UI가 재계산되는가?

---

## 🎯 얻어가는 점

- Filter를 상태 선택 문제로 바라보는 관점
- 파생 상태 기반 렌더링 이해
- React 리스트 필터링 패턴 준비 완료

---

## 🧠 마무리

Day 23의 핵심은 필터 기능 구현이 아니라,

> **같은 상태를, 다른 기준으로 바라보는 설계 사고를 완성하는 것**이다.
