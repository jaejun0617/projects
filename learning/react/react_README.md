# React Journey — Curriculum Declaration

## 🎯 목적 선언
이 React 커리큘럼의 목적은 **React 문법 학습**이 아니다.  
JavaScript로 직접 완주한 SPA 아키텍처 사고를 **React라는 구조 자동화 도구로 이전**하는 것이다.

- React는 해결책이지 목표가 아니다.
- UI는 상태의 결과다.
- 컴포넌트는 구조 단위다.
- Hook은 사고를 강제하는 장치다.

---

## 🧠 전제 조건
- js-core 커리큘럼 완주
- state → render 사고 체계 보유
- 이벤트 / 비동기 / 라우팅을 JS로 직접 구현해본 상태

이 문서는 **React 입문서가 아니라 React 도입 선언문**이다.

---

## 🧩 전체 커리큘럼 구조

```
react/
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   │
   ├─ curriculum/
   │  ├─ react-01-core/
   │  ├─ react-02-hooks/
   │  ├─ react-03-event-async/
   │  ├─ react-04-router/
   │  ├─ react-05-state-management/
   │  └─ react-06-mini-spa/
   │
   ├─ shared/
   │  ├─ components/
   │  ├─ hooks/
   │  └─ utils/
   │
   └─ router/
      └─ index.jsx
```

---

## 🟦 Phase별 선언

### Phase 01 — React Core
**대응:** js-core / state 기반 UI

- JSX 문법
- 컴포넌트 구조
- props
- 단방향 데이터 흐름

👉 React가 **왜 template 엔진이 아닌지** 설명 가능해야 한다.

---

### Phase 02 — Hooks
**대응:** JS 엔진 / 실행 컨텍스트 / 클로저

- useState
- useEffect
- Hook 규칙
- 의존성 배열 사고

👉 Hook을 문법이 아니라 **상태 관리 규칙**으로 이해한다.

---

### Phase 03 — Event & Async
**대응:** event architecture / async control

- Synthetic Event
- 폼 / 키보드 / 접근성
- 비동기 요청 상태 관리
- loading / error / cancel

👉 React는 이벤트를 숨기지 않고 **구조화**한다.

---

### Phase 04 — Router
**대응:** SPA / History API

- React Router
- URL = State
- Layout Route
- Dynamic Route

👉 페이지 이동이 아니라 **상태 전이**라는 관점을 유지한다.

---

### Phase 05 — State Management
**대응:** Architecture Retrospective

- Context API
- 상태 스코프 분리
- 전역 상태의 필요 조건
- 상태 관리 라이브러리 도입 기준

👉 "언제 써야 하는지"를 설명할 수 있어야 한다.

---

### Phase 06 — Mini SPA (React)
**대응:** js-core Mini SPA

- 통합 미니 프로젝트
- 구조 정리
- 리팩토링
- 성능 관점 회고

👉 React를 **선택한 이유**를 코드로 증명한다.

---

## 🔁 작업 방식 (고정)

1. 폴더 구조 및 초기 코드 먼저 제공
2. 실행 가능한 최소 단위 확보
3. 그 코드 기준으로 README.md 작성
4. 문법 + 구조 + 기준을 동시에 정리

문서가 먼저 오지 않는다.  
항상 **코드가 기준**이다.

---

## 📌 최종 목표

- React를 "쓸 줄 아는 사람" ❌
- React를 "왜 쓰는지 설명 가능한 사람" ⭕

이 커리큘럼은 학습 기록이 아니라  
**아키텍처 포트폴리오**다.
