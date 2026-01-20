# Day 21 — Conditional State Toggle (완료 / 미완료 분기)

🗓 **Date**  
2026-01-15 (Thu)

📁 **Folder Name**  
`21-conditional-state-toggle`

> Day 20 폴더명 규칙(`20-arrays-basic`)을 그대로 이어가는 형식  
> 👉 `숫자-핵심개념-kebab-case`

---

## ✅ 오늘 한 줄 요약
> 조건문은 분기문이 아니라, **상태에 따라 UI 표현을 선택하는 규칙**이다.

---

## 📌 프로젝트 개요 (WHY)

Day 21은 조건문을 “맞으면 실행 / 틀리면 실행”로 사용하는 단계를 넘어선다.  
이 Day의 핵심은 **Boolean 상태(`isDone`)가 UI 표현을 어떻게 바꾸는지**를 명확히 설계하는 것이다.

이 프로젝트는 다음 사고 전환을 목표로 한다.

- 조건문으로 흐름 제어 ❌  
- **상태(state) → 조건 판단 → UI 표현 선택** ⭕  

이는 이후:

- 체크박스 토글
- 활성 / 비활성 UI
- 완료 / 미완료 필터
- React 조건 렌더링

의 직접적인 기반이 된다.

---

## 🎯 미션 목표 (Mission Goals)

- Boolean 상태(`isDone`) 기반 UI 분기 설계
- 조건문을 **렌더 결과 선택용**으로만 사용
- 상태 변경과 UI 렌더 로직 분리
- 클릭 이벤트를 **상태 전이(trigger)** 로 해석
- Day 15~20 학습 내용 종합 적용

---

## 🔥 오늘의 핵심 (Key Takeaways)

- 조건문은 로직이 아니라 **표현 선택 도구**
- UI는 항상 `state → 조건 → 결과` 흐름을 따른다
- toggle은 가장 단순하지만 중요한 상태 전이 모델
- render는 **현재 상태의 결과만** 책임진다

---

## 🧠 핵심 개념 / 설계 요약

### 1️⃣ Todo 상태 모델

```js
{
  text: "운동하기",
  isDone: false
}
```

- text: 데이터
- isDone: 상태(Boolean)
- UI 표현은 이 상태로만 결정

---

### 2️⃣ 조건 분기 기준

```js
todo.isDone ? "완료 UI" : "미완료 UI"
```

- 조건은 계산용 ❌
- **클래스 / 스타일 선택용 ⭕**

---

### 3️⃣ 상태 전이 (Toggle)

```js
todo.isDone = !todo.isDone;
```

- true ↔ false
- 가장 기본적인 상태 전이 패턴

---

## 🏗️ 구현 기준 & 기른 역량

### 구현 기준

- 상태는 객체/배열로 관리
- 조건문은 render 단계에만 존재
- 이벤트 핸들러는 상태만 변경
- DOM 조작은 render 함수에 집중

### 기른 역량

- 조건 기반 UI 분기 사고
- Boolean 상태 설계 감각
- 상태 전이 → 재렌더 흐름 이해
- 이후 React 조건 렌더링 준비 완료

---

## 🏗️ 구현 내용 (UI 퍼블리셔 과제)

### A. 요구사항

- Todo 추가
- 클릭 시 완료 / 미완료 토글
- 완료 상태 시 시각적 스타일 변경
- 삭제 버튼으로 항목 제거

### B. UI 구조 예시

```
[ 운동하기 ]   (미완료)
[ 책 읽기 ]   (완료)
```

---

## 📁 파일 구조

```txt
21-conditional-state-toggle/
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
const state = {
  todos: [],
};
```

```js
li.className = todo.isDone ? 'todo-item done' : 'todo-item';
```

```js
todo.isDone = !todo.isDone;
renderTodos();
```

---

## ✅ 제출 체크리스트

- [ ] Boolean 상태로 UI가 분기되는가?
- [ ] 조건문이 render 단계에만 존재하는가?
- [ ] 클릭은 상태 변경만 담당하는가?
- [ ] 상태 변경 후 render로 UI를 재계산하는가?

---

## 🎯 얻어가는 점

- 조건문을 UI 설계 도구로 사용하는 관점
- 상태 기반 렌더링의 기초 완성
- 인터랙티브 UI 사고 본격 진입

---

## 🧠 마무리

Day 21의 핵심은 조건을 쓰는 것이 아니라,

> **상태에 따라 화면을 다르게 보여주는 사고를 갖는 것**이다.
