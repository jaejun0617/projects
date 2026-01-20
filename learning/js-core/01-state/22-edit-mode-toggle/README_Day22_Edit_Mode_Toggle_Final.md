# Day 22 — Edit Mode (View ↔ Edit State Toggle)

🗓 **Date**  
2026-01-16 (Fri)

📁 **Folder Name**  
`22-edit-mode-toggle`

> Day 21 폴더명 규칙(`21-conditional-state-toggle`)을 그대로 이어가는 형식  
> 👉 `숫자-핵심개념-kebab-case`

---

## ✅ 오늘 한 줄 요약
> Edit 기능은 입력을 추가하는 문제가 아니라, **상태에 따라 UI 모드를 전환하는 설계 문제**다.

---

## 📌 프로젝트 개요 (WHY)

Day 22는 “수정 기능을 붙이는 날”이 아니다.  
이 Day의 핵심은 **하나의 Todo 데이터를 두 가지 UI 모드(View / Edit)로 표현하는 구조를 설계하는 것**이다.

이번 미션은 Day 21의 Todo 토글 구조를 그대로 확장한다.

- ❌ input을 하나 더 붙이는 사고  
- ⭕ **같은 데이터를, 다른 모드로 표현하는 사고**

이 사고는 이후:

- 인라인 수정 UI
- 설정 화면 수정 모드
- 프로필 편집 화면
- React Edit Mode 패턴

으로 그대로 이어진다.

---

## 🎯 미션 목표 (Mission Goals)

- `isEditing` Boolean 상태로 UI 모드 분리
- View / Edit UI를 **동시에 렌더하지 않기**
- 조건문을 **UI 선택용**으로만 사용
- 저장 / 취소에 따른 상태 전이 흐름 명확화
- Day 15~21 상태 기반 렌더링 사고 종합

---

## 🔥 오늘의 핵심 (Key Takeaways)

- 수정 기능의 본질은 **입력 처리**가 아니라 **모드 전환**
- UI는 항상 하나의 모드만 가진다 (View OR Edit)
- 조건문은 실행이 아니라 **표현 선택**을 담당
- 입력값은 저장되기 전까지 **임시 데이터**

---

## 🧠 핵심 개념 / 설계 요약

### 1️⃣ Todo 상태 모델

```js
{
  text: "운동하기",
  isDone: false,
  isEditing: false
}
```

- `text` : 실제 데이터
- `isDone` : 완료 상태
- `isEditing` : UI 모드 상태

👉 **렌더 분기는 오직 `isEditing` 기준**

---

### 2️⃣ UI 모드 분기 기준

```js
if (!todo.isEditing) {
  // View UI
}

if (todo.isEditing) {
  // Edit UI
}
```

- 흐름 제어 ❌
- **렌더 결과 선택 ⭕**

---

### 3️⃣ 상태 전이 흐름

```txt
View 모드
 └─ [수정] 클릭
     ↓
Edit 모드
 ├─ [저장] → text 변경 → View 복귀
 └─ [취소] → 변경 없음 → View 복귀
```

---

## 🏗️ 구현 기준 & 기른 역량

### 구현 기준

- 상태는 단일 source of truth
- DOM 조작은 render 함수에만 존재
- 이벤트 핸들러는 상태 전이만 담당
- Edit 중 입력값은 DOM에만 임시 존재

### 기른 역량

- UI 모드 분리 설계 능력
- Boolean 상태 설계 심화
- 배열 + 객체 복합 상태 관리
- 이후 React Edit 패턴 완벽 대응

---

## 🏗️ 구현 내용 (UI 퍼블리셔 과제)

### A. 요구사항

- Todo 추가
- 완료 / 미완료 토글
- 수정 버튼 클릭 시 Edit 모드 진입
- input으로 내용 수정
- 저장 시 반영
- 취소 시 원래 상태 유지
- 삭제 기능 유지

### B. UI 구조 예시

```
[ 운동하기 ] [수정] [삭제]
↓
[ input: 운동하기 ] [저장] [취소]
```

---

## 📁 파일 구조

```txt
22-edit-mode-toggle/
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
if (!todo.isEditing) {
  // View UI 렌더
}
```

```js
if (todo.isEditing) {
  // Edit UI 렌더
}
```

```js
todo.isEditing = true;  // 수정 진입
todo.isEditing = false; // 저장/취소
```

---

## ✅ 제출 체크리스트

- [ ] isEditing 상태로 UI가 분기되는가?
- [ ] View/Edit UI가 동시에 렌더되지 않는가?
- [ ] 저장/취소가 상태 전이로만 처리되는가?
- [ ] 상태 변경 후 render로 UI가 재계산되는가?

---

## 🎯 얻어가는 점

- Edit 기능을 구조적으로 설계하는 사고
- 상태 기반 UI 모드 전환 완전 이해
- 실무형 인터랙티브 패턴 체득

---

## 🧠 마무리

Day 22의 핵심은 “수정 기능 구현”이 아니라,

> **같은 데이터를, 다른 모드로 보여주는 설계 사고를 완성하는 것**이다.
