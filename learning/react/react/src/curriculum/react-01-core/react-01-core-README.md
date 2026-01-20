
# Phase 01 — React Core

## 🗓 기간
- React Journey Phase 01

## 📝 과제명
- JSX · Component · Props 기반 렌더 구조 이해

---

## 🧠 기획 의도 / 구조 설계 방향

Phase 01은 React 문법을 나열하는 단계가 아니다.  
JavaScript에서 이미 체득한 **표현식 기반 사고(state → 계산 → 결과)**를  
React의 **렌더 모델**로 이전하는 것이 목적이다.

이 단계에서 다루는 모든 코드는 다음 질문에 답하기 위해 존재한다.

- React는 왜 DOM을 직접 조작하지 않는가?
- JSX는 왜 HTML 템플릿이 아닌가?
- 컴포넌트는 왜 기능이 아니라 구조 단위인가?

---

## 🔍 상세 요구사항

### Mission 01 — JSX는 표현식이다
- JSX 내부에서 변수, 삼항 연산자, 논리 연산자 사용
- 조건 분기는 **값을 반환하는 표현식**으로만 처리
- `{}`의 역할을 말로 설명 가능해야 함

### Mission 02 — 컴포넌트는 구조 단위다
- Header / Content처럼 **역할 중심**으로 분리
- 컴포넌트 이름만 보고 UI 위치와 역할이 추론 가능해야 함

### Mission 03 — Props는 단방향 데이터 흐름이다
- 부모 → 자식 방향 데이터 전달만 허용
- children을 **구조 슬롯**으로 사용
- 자식 컴포넌트는 데이터를 수정하지 않음

---

## 🔥 핵심

> React는 화면을 “만드는” 도구가 아니라  
> **렌더 결과를 선언하는 규칙 집합**이다.

---

## 🧩 문법 / 이론 정리

- JSX 표현식 렌더링
- Function Component
- props / children
- 단방향 데이터 흐름(one-way data flow)

---

## 🧠 기준 / 역량

Phase 01 종료 시 설명 가능해야 하는 기준:

- JSX와 HTML의 차이
- React 렌더 흐름 (함수 실행 → JSX 반환 → 결과 반영)
- 컴포넌트 분리 기준
- props 흐름 방향의 이유

---

## 🔑 검색 키워드

- React JSX expression
- React render flow
- React component structure
- React props children

---

## 🧪 핵심 코드 스냅샷

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      {children}
    </div>
  )
}
```

이 코드는 UI를 조립하는 코드가 아니라  
**구조를 선언하는 코드**다.

---

## 🎯 얻어가는 점

- React 렌더 모델의 본질 이해
- 컴포넌트 분리 기준 정립
- Hooks Phase로 넘어갈 사고 준비 완료

---

## 💻 사용 기술
- React
- Vite
- JSX
- CSS (가독성 보조용)
