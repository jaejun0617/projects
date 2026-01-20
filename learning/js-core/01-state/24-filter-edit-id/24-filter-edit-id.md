# Day 24 — Filter + Edit (ID 기반 상태 관리)

📁 **Folder / README Name**  
`24-filter-edit-id`

---

## ✅ 오늘 한 줄 요약
> 필터와 수정은 함께 쓸 수 있지만, **반드시 ‘대상 식별(id)’이 먼저 설계되어야 한다.**

---

## 📌 프로젝트 개요 (WHY)

Day 24는 기능을 하나 더 붙이는 날이 아니다.  
이 Day의 핵심은 **Filter와 Edit를 동시에 사용해도 상태가 꼬이지 않는 구조를 설계하는 것**이다.

Day 23까지는:
- 필터로 “무엇을 볼지”를 결정했고  
- Day 22에서는 “어떤 UI 모드로 보여줄지”를 분리했다.

Day 24에서는 이 두 기능을 **동시에 안전하게 사용하기 위해 ‘id 기반 식별’**을 도입한다.

이 사고는 이후:

- 서버 데이터 렌더링
- 댓글/게시글 수정
- 실시간 리스트 업데이트
- React key / id 설계

의 직접적인 기반이 된다.

---

## 🎯 미션 목표 (Mission Goals)

- Todo 엔티티를 **id 기반으로 식별**
- Filter 상태와 Edit 상태를 동시에 적용
- 인덱스 의존 로직 제거
- “보는 목록”과 “수정 대상”을 분리 설계
- 상태 변경 후 항상 render로 UI 재계산

---

## 🔥 오늘의 핵심 (Key Takeaways)

- Filter는 **파생 상태 선택**
- Edit는 **상태 변경**
- 둘을 같이 쓰려면 **id가 필요**
- index 기반 수정은 필터와 함께 쓰면 위험하다

---

## 🧠 핵심 개념 / 설계 요약

### 1️⃣ 상태(State) 구조

```js
const state = {
  todos: [
    { id, text, isDone, isEditing }
  ],
  filter: 'all'
};
```

- `todos` : 원본 상태
- `filter` : 보기 조건
- 각 Todo는 **고유 id**로만 식별

---

### 2️⃣ id 기반 설계가 필요한 이유

필터가 적용되면:

```js
const visibleTodos = state.todos.filter(...)
```

- 화면에 보이는 배열 ≠ 원본 배열
- 이 상태에서 index로 수정하면 **잘못된 대상이 수정될 수 있음**

👉 해결책: **항상 id로 대상 식별**

---

### 3️⃣ 파생 상태 + 수정 흐름

```txt
원본 todos
 ├─ filter → visibleTodos (파생)
 │
 └─ id 기준으로 수정 / 삭제
```

- 필터는 “보기용”
- 수정/삭제는 “원본 상태 대상”

---

## 🏗️ 구현 기준 & 기른 역량

### 구현 기준

- index 의존 로직 제거
- Filter 결과는 읽기 전용
- Edit는 항상 원본 상태 기준
- 한 번에 하나의 Todo만 편집 가능

### 기른 역량

- 파생 상태와 원본 상태 분리 사고
- id 기반 엔티티 설계
- 복합 인터랙션 안정성 확보
- 실무 리스트 관리 패턴 이해

---

## 🏗️ 구현 내용 (UI 퍼블리셔 과제)

### A. 요구사항

- Todo 추가
- 완료 / 미완료 토글
- 필터(전체/미완료/완료)
- 수정(View/Edit 모드)
- 삭제
- Filter 상태에서도 수정/삭제 정상 동작

---

### B. UI 구조 예시

```
[ 전체 ] [ 미완료 ] [ 완료 ]

[ 운동하기 ] [수정] [삭제]
↓
[ input: 운동하기 ] [저장] [취소]
```

---

## 📁 파일 구조

```txt
24-filter-edit-id/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  └─ main.js
└─ 24-filter-edit-id.md
```

---

## ⚙️ 핵심 코드 (구조 중심)

```js
state.todos = state.todos.filter(t => t.id !== todo.id);
```

```js
state.todos.forEach(t => (t.isEditing = false));
todo.isEditing = true;
```

```js
function getFilteredTodos() {
  // 파생 상태 계산
}
```

---

## ✅ 제출 체크리스트

- [ ] Todo를 id로 식별하는가?
- [ ] Filter와 Edit가 동시에 동작하는가?
- [ ] index 기반 수정 로직이 없는가?
- [ ] render가 단일 DOM 업데이트 지점인가?

---

## 🎯 얻어가는 점

- 실무형 리스트 상태 관리 패턴
- Filter + Edit 동시 설계 경험
- React key / id 설계 개념 완성

---

## 🧠 마무리

Day 24의 핵심은 기능을 많이 넣는 것이 아니라,

> **여러 인터랙션이 동시에 있어도 구조가 무너지지 않게 설계하는 것**이다.
