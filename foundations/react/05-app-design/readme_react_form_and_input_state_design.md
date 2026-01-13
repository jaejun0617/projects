# React Form & Input State Design (실무 설계 기준)

> 이 문서는 input 사용법을 설명하지 않는다.  
> **왜 입력(Form)은 React에서 가장 복잡한 상태인지**, 그리고 어떻게 설계해야 하는지를 다룬다.

---

## 🧭 이 챕터의 위치

- React Side Effect & Lifecycle Design **이후**
- 실무 폼 구현 **직전 필수 단계**

즉,
- onChange 패턴 나열 ❌
- **입력 상태의 책임 분리 사고 체계** ✅

---

## 🎯 목표

- 입력 상태의 본질을 이해한다
- 제어 컴포넌트의 역할을 정확히 구분한다
- validation과 UI 책임을 분리한다

---

## 1. 왜 Form은 어려운가

### 이유

- 사용자 입력은 예측 불가
- 동기/비동기 검증 혼재
- UI 상태와 도메인 상태가 섞이기 쉬움

👉 단순한 값 저장 문제가 아니다

---

## 2. 입력 상태의 분류

### 2-1. Input Value State

- 텍스트 값
- 체크 여부

👉 즉각적인 UI 반영 목적

---

### 2-2. UI Meta State

- touched / focused
- error 표시 여부

👉 UX를 위한 상태

---

### 2-3. Submission State

- submitting
- submit error

👉 서버와 연결되는 상태

---

## 3. 제어 컴포넌트의 본질

### 정의

> **입력 값을 React 상태가 소유**

```js
<input value={value} onChange={onChange} />
```

- DOM이 아니라 React가 진실

---

## 4. 제어 vs 비제어 (판단 기준)

### 제어가 적합한 경우

- validation 필요
- 값 추적 필요

### 비제어가 적합한 경우

- 단순 제출
- 성능 민감

👉 무조건 제어 ❌

---

## 5. validation 책임 분리

### 나쁜 구조

- onChange마다 서버 검증
- UI 로직과 검증 로직 혼합

### 좋은 구조

- 입력 단계: UI 검증
- 제출 단계: 도메인/서버 검증

---

## 6. Form 상태 설계 원칙

1. 입력 값과 메타 상태 분리
2. 검증 로직 분리
3. 제출 상태 명시

---

## 7. Form과 Server State의 경계

- Form State ≠ Server State
- submit 결과는 서버 상태

👉 실패/성공 흐름 분리

---

## 8. 라이브러리가 필요한 시점

- 필드 수 증가
- 검증 규칙 복잡
- 반복 패턴 증가

👉 react-hook-form, Formik은 **자동화 도구**

---

## 9. 실무 체크리스트

- [ ] 입력 값과 UI 상태가 분리돼 있는가?
- [ ] 검증 책임이 명확한가?
- [ ] 제출 상태가 명시적인가?

---

## 🎯 이 챕터를 마치면

- 폼이 두렵지 않다
- validation 버그가 줄어든다
- 복잡한 입력도 구조로 해결한다

---

## 다음 챕터 예고

> **React Error Boundary & Resilience Design**  
> 앱은 어떻게 실패를 견뎌야 하는가

---

**이 문서는 React Form 설계 기준 문서다.**

