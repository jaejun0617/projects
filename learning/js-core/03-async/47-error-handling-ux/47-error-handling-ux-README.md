# Day 47 — Error Handling & UX

## 🏷 Topic
Async Error Handling / UX for Failure / Retry Flow / Error State Design

## 🔎 관련 검색어
- javascript fetch error handling ux
- async error state ui
- retry pattern fetch
- error handling user experience
- loading success error ui pattern

---

## ✅ 한 줄 요약
에러는 예외 상황이 아니라 **사용자가 반드시 거쳐갈 수 있는 정상적인 상태**이며,  
좋은 UX는 “에러를 숨기는 것”이 아니라 **다음 행동을 안내하는 것**이다.

---

## 📌 프로젝트 개요 (WHY)
Day 47은 에러를 콘솔에 찍는 날이 아니다.  
**에러가 발생했을 때 사용자가 무엇을 보고, 무엇을 할 수 있어야 하는지**를 설계하는 단계다.

실무에서 중요한 질문은 이것이다.

- 실패했는가?
- 왜 실패했는가?
- 사용자는 지금 무엇을 할 수 있는가?

이 Day에서는 에러를 **UI 상태의 하나**로 다루며,
Retry UX까지 포함한 흐름을 완성한다.

---

## 🎯 미션 목표
- 에러를 명시적인 상태로 모델링한다
- 실패 원인에 따라 사용자 메시지를 분기한다
- 에러 이후에도 재시도가 가능하도록 설계한다
- 에러 상태에서도 UI 흐름이 끊기지 않게 만든다

---

## 🧠 핵심 사고

### 1️⃣ 에러는 상태다
```js
status: 'idle' | 'loading' | 'success' | 'error'
```

- 성공/실패는 분기 ❌
- **성공/실패 모두 상태 ⭕**

---

### 2️⃣ try/catch의 목적은 UX 전이다
```js
catch (err) {
  state = { status: 'error', error: err.message };
}
```

- 에러 로그 출력 ❌
- **UI를 error 상태로 이동 ⭕**

---

### 3️⃣ Retry는 별도 기능이 아니다
```js
if (action === 'retry') fetchData();
```

- Retry = 다시 요청
- 로직 재사용
- 상태만 초기화 후 동일 흐름 진입

---

## 🧠 핵심 이론 보강

### 실패 원인별 UX 분기
```js
if (res.status >= 500) {
  throw new Error('서버에 문제가 발생했습니다.');
}
```

- 서버 오류
- 클라이언트 오류
- 네트워크 오류

👉 사용자에게 보여줄 메시지는 달라야 한다.

---

### 에러 후 상태 유지 vs 초기화
- data 유지: 이전 정보 참고 가능
- data 초기화: 혼란 방지

이 예제에서는 **명확성을 위해 초기화**를 선택했다.

---

## 🧩 상태 모델
```js
let state = {
  status: 'idle',
  data: [],
  error: null,
};
```

- status : 현재 단계
- data : 성공 결과
- error : 사용자 메시지

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 비동기 요청 시작
```js
state = { status: 'loading', data: [], error: null };
render();
```

---

### 2️⃣ 실패 처리
```js
state = {
  status: 'error',
  data: [],
  error: err.message || '알 수 없는 오류',
};
```

---

### 3️⃣ Retry 재사용
```js
if (action === 'retry') fetchData();
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 에러 상태를 명시적으로 관리
- 사용자에게 다음 행동 제공
- 실패 후에도 인터랙션 흐름 유지

### 기른 역량
- Async UX 설계 능력
- 에러 상태 모델링
- 실무형 Retry 패턴 이해

---

## 📂 파일 구조
```
47-error-handling-ux/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] 에러를 상태로 설명할 수 있는가
- [ ] 실패 원인에 따른 메시지를 분리했는가
- [ ] Retry가 자연스러운 UX인가
- [ ] 에러 후에도 앱이 멈추지 않는가

---

## 🎯 얻어가는 점
- 에러는 숨길 대상이 아니다
- UX는 실패 순간에 더 중요하다
- Retry는 설계 문제다
- 이후 Day 48 비동기 제어로 자연스럽게 확장된다
