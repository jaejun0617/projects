# React App Architecture & Folder Structure Design (실무 기준)

> 이 문서는 정답 폴더 구조를 제시하지 않는다.  
> **왜 프로젝트가 커질수록 구조가 먼저 무너지는지**, 그리고 이를 어떻게 예방하는지를 설명한다.

---

## 🧭 이 챕터의 위치

- React Server State & Data Fetching Design **이후**
- 실전 React 프로젝트 **시작 직전**

즉,
- boilerplate 따라치기 ❌
- **규모 확장을 견디는 구조 사고 체계** ✅

---

## 🎯 목표

- 역할 중심으로 폴더를 나눈다
- 변경 이유가 다른 코드들을 분리한다
- 팀/규모가 커져도 무너지지 않는 기준을 갖는다

---

## 1. 대부분의 React 프로젝트가 망가지는 이유

### 초기 상태

```txt
components/
pages/
utils/
```

### 몇 주 후

- components 비대화
- utils 잡동사니 폴더
- 어디에 코드를 둬야 할지 모름

👉 **구조 원칙 부재**

---

## 2. 구조 설계의 핵심 질문

> 이 코드는 **무엇 때문에 변경되는가?**

- UI 변경?
- 비즈니스 로직 변경?
- API 변경?

👉 변경 이유가 다르면 **같은 폴더에 있으면 안 된다**

---

## 3. 역할 중심 아키텍처

### 기본 레이어

```txt
app/        → 앱 진입점 / 전역 설정
pages/      → 라우트 단위 화면
features/   → 도메인 단위 기능
shared/     → 공용 UI / 유틸
```

- 파일 개수가 아니라 **책임 단위**가 기준

---

## 4. Feature 기반 구조

```txt
features/
 └─ user/
    ├─ api/
    ├─ hooks/
    ├─ components/
    ├─ types/
```

- 한 기능의 모든 것
- 이동/삭제/확장 용이

---

## 5. API / Service 레이어 분리

### 왜 필요한가

- UI에서 fetch 제거
- 서버 변경에 강해짐

```txt
features/user/api/user.api.ts
features/user/services/user.service.ts
```

---

## 6. 공용 코드(shared)의 경계

### 포함 가능

- Button / Modal
- formatDate

### 포함 금지

- 도메인 로직
- 특정 화면 전용 코드

---

## 7. 페이지는 조립자다

- 페이지에 로직 최소화
- feature를 조합만 한다

👉 Page = Container of Features

---

## 8. 구조 설계 체크리스트

- [ ] 이 코드는 어떤 이유로 변경되는가?
- [ ] 이 기능을 통째로 이동할 수 있는가?
- [ ] 특정 페이지에 종속되지 않는가?

---

## 🎯 이 챕터를 마치면

- 구조 때문에 리팩터링하지 않는다
- 기능 단위로 사고한다
- 프로젝트 확장이 두렵지 않다

---

## 다음 챕터 예고

> **React Routing & Navigation Design**  
> URL은 왜 상태인가

---

**이 문서는 실전 프로젝트 설계 기준 문서다.**