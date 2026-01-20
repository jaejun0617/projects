# js-core — Frontend State & Architecture Journey (최종본)

## 🏷 Topic
JavaScript Core / State-driven UI / Frontend Architecture / SPA Fundamentals

## 🔎 관련 검색어
- javascript core frontend roadmap
- state driven ui vanilla js
- frontend architecture without framework
- spa fundamentals javascript
- react readiness javascript core

---

## ✅ 한 줄 요약
이 폴더는 JavaScript 문법 학습 기록이 아니라  
**프레임워크 없이 프론트엔드 아키텍처를 설계할 수 있게 된 전체 여정**이다.

---

## 📌 js-core의 목적 (WHY)
`js-core`는 React를 배우기 위한 예습 폴더가 아니다.  
**React가 왜 필요했는지를 스스로 증명하기 위해 만든 기반 자산**이다.

이 안에서 우리는:
- 상태 중심 UI를 설계했고
- 이벤트와 비동기를 구조로 다뤘으며
- Router와 SPA를 직접 구현했고
- 서버 fallback 문제까지 경험했다

즉, **프론트엔드의 본질을 프레임워크 없이 끝까지 완주한 기록**이다.

---

## 🧭 권장 학습 순서 (STEP 1 ~ 7)

> **UI를 만들고 → 원리를 이해하고 → 구조를 언어로 정리한다**

### STEP 1 — 상태 기반 UI 사고 형성
📁 `01-state/`

- state → render 사고 체득
- 조건 / 반복 / CRUD / 필터 / 히스토리
- Todo 기반 상태 설계

👉 UI는 “조작”이 아니라 **상태의 결과**라는 감각을 만든다.

---

### STEP 2 — 이벤트를 구조로 이해
📁 `02-event/`

- Event bubbling / delegation
- Form / Keyboard / Accessibility
- Event lifecycle / cleanup

👉 이벤트는 로직이 아니라 **상태 변경 요청**이라는 관점 확보.

---

### STEP 3 — 비동기를 상태로 통제
📁 `03-async/`

- fetch / async / await
- loading / error / success
- race / cancel / disable

👉 비동기는 “기다림”이 아니라 **상태 흐름 문제**라는 인식.

---

### STEP 4 — SPA & URL 사고 확장
📁 `04-spa/`

- History API
- Simple Router 구현
- URL = State
- 새로고침 / 직접 진입 문제 이해
- Vite 기반 SPA 환경

👉 상태는 화면을 넘어 **주소창까지 확장**된다.

---

### STEP 5 — 실전 통합 프로젝트
📁 `05-mini-spa-vite/`

- State / Event / Async / Router 통합
- 포트폴리오 기준 Mini SPA
- 실제 배포 구조 경험

👉 “내가 만들 수 있는 최대치”를 한 번에 확인한다.

---

### STEP 6 — JS 엔진 & 언어적 이해
📁 `00-js-theory-architecture/`

- Execution Context / Scope
- Closure / this
- Prototype / Composition
- 메모리 관점

👉 왜 이전 코드가 그렇게 동작했는지 **이론으로 납득**한다.

---

### STEP 7 — 아키텍처 언어화 & 정리
📁 `99-architecture-retrospective/`

- State Architecture 정리
- 왜 React가 필요했는가
- Hook 사고 미리보기
- Performance & Refactoring 기준

👉 학습을 **설명 가능한 자산**으로 전환한다.

---

## 📂 전체 폴더 구조

```
js-core/
├─ 00-js-theory-architecture/
├─ 01-state/
├─ 02-event/
├─ 03-async/
├─ 04-spa/
├─ 05-mini-spa-vite/
└─ 99-architecture-retrospective/
```

---

## 🧠 js-core에서 확보한 역량

- 상태 중심 UI 설계
- 단방향 데이터 흐름 설명 능력
- 이벤트 / 비동기 / SPA 구조 이해
- 서버와 프론트엔드 경계 인식
- React를 “선택지”로 판단할 수 있는 시야

---

## 🎯 이 폴더의 포지션
> 이 `js-core`는  
> **“JavaScript를 배웠다”가 아니라  
> “JavaScript로 프론트엔드를 설계할 수 있다”는 증거**다.

---

## 🚀 다음 단계
- `react/` 폴더 생성
- 동일 Mini SPA를 React로 재구현
- js-core ↔ react 구조 1:1 비교

👉 이제 React는 **외우는 학습이 아니라 이해 기반 확장**이 된다.
