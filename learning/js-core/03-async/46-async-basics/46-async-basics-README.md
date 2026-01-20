# Day 46 — Async Basics (비동기 상태 사고)

## 🏷 Topic
Async Basics / Fetch / Async State Machine / Loading–Success–Error Flow

## 🔎 관련 검색어
- javascript async state handling
- fetch loading error success pattern
- async ui state machine
- prevent duplicate fetch request
- async await ui architecture

---

## ✅ 한 줄 요약
비동기는 “fetch 문법” 문제가 아니라  
**시간에 따라 변하는 UI 상태를 어떻게 모델링하느냐의 문제**다.

---

## 📌 프로젝트 개요 (WHY)
Day 46은 API를 많이 호출하는 날이 아니다.  
**비동기 작업이 UI를 망가뜨리는 이유를 구조적으로 해결하는 단계**다.

동기 코드와 달리 비동기는 항상 다음 질문을 던진다.

- 아직 안 끝났을 때 화면은?
- 실패했을 때 화면은?
- 요청이 겹치면 어떻게 할 것인가?

이 Day의 목적은 fetch를 통해  
**“시간이 개입된 상태 전이”를 설계하는 사고**를 만드는 것이다.

---

## 🎯 미션 목표
- 비동기 상태를 명시적으로 모델링한다
- loading / success / error 상태를 UI로 분기한다
- 중복 요청을 방지한다
- fetch를 상태 변경 트리거로만 사용한다

---

## 🧠 핵심 사고

### 1️⃣ 비동기 = 상태 전이 문제
```js
status: 'idle' | 'loading' | 'success' | 'error'
```

비동기 작업은 값이 아니라  
**상태의 변화 과정**을 가진다.

---

### 2️⃣ fetch는 주인공이 아니다
```js
const res = await fetch(url);
```

fetch는 단지:
- loading 상태를 시작시키고
- 결과에 따라 success / error로 전이시키는
**트리거 역할**만 한다.

---

### 3️⃣ 중복 요청은 구조로 막는다
```js
if (state.status === 'loading') return;
```

- 버튼 연타 ❌
- 네트워크 폭주 ❌
- 상태 조건으로 흐름 통제 ⭕

---

## 🧠 핵심 이론 보강

### Async UI State Machine
```
idle
 ↓
loading
 ↓
success / error
```

UI는 항상 **현재 상태 하나**만 가진다.

---

### try / catch 위치의 의미
- try: 네트워크 성공 경로
- catch: 실패 상태 전이

에러를 잡는 목적은 로그가 아니라  
**UI를 error 상태로 이동시키기 위함**이다.

---

## 🧩 상태 모델
```js
let state = {
  status: 'idle',
  data: [],
  error: null,
};
```

- status : 현재 비동기 단계
- data : 성공 결과
- error : 실패 메시지

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 비동기 시작
```js
state = { status: 'loading', data: [], error: null };
render();
```

---

### 2️⃣ 성공 전이
```js
state = { status: 'success', data, error: null };
```

---

### 3️⃣ 실패 전이
```js
state = { status: 'error', data: [], error: err.message };
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 비동기 상태를 반드시 분리해서 관리
- fetch 결과에 따라 상태만 변경
- render는 상태 결과만 표현

### 기른 역량
- Async UI 설계 능력
- fetch를 구조 안에서 사용하는 사고
- 이후 Error UX / Race Condition 대비 기반

---

## 📂 파일 구조
```
46-async-basics/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] loading / success / error를 설명할 수 있는가
- [ ] fetch가 UI를 직접 건드리지 않는 구조인가
- [ ] 중복 요청을 상태로 막고 있는가
- [ ] 실패 시 UI가 명확히 바뀌는가

---

## 🎯 얻어가는 점
- 비동기는 시간 문제다
- UI는 항상 상태의 결과다
- fetch는 설계의 일부일 뿐이다
- 이후 Day 47 에러 UX / Day 48 요청 제어로 자연스럽게 확장된다
