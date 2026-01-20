# Day 48 — Async Control (Race / Cancel / Disable)

## 🏷 Topic
Async Control / Race Condition / AbortController / Request Disable Strategy

## 🔎 관련 검색어
- javascript race condition fetch
- abortcontroller fetch cancel
- prevent duplicate async requests
- latest request wins pattern
- async request control ux

---

## ✅ 한 줄 요약
비동기 문제의 핵심은 “요청을 보내는 것”이 아니라  
**동시에 발생하는 요청을 어떻게 통제하느냐**다.

---

## 📌 프로젝트 개요 (WHY)
Day 48은 새로운 API를 다루는 날이 아니다.  
**비동기 요청이 겹칠 때 UI가 망가지는 근본 원인**을 해결하는 단계다.

실무에서는 다음 문제가 항상 발생한다.

- 버튼 연타
- 느린 네트워크
- 먼저 보낸 요청이 나중에 도착

이 Day의 목적은  
**Race / Cancel / Disable** 세 가지 전략을 명확히 분리해서 체득하는 것이다.

---

## 🎯 미션 목표
- Race condition을 직접 재현하고 차단한다
- AbortController로 요청을 취소한다
- 중복 요청을 UX 차원에서 방지한다
- 최신 요청만 UI에 반영한다

---

## 🧠 핵심 사고

### 1️⃣ Race Condition은 시간 문제다
```js
const requestId = ++currentRequestId;
```

- 먼저 시작한 요청이
- 나중에 끝날 수 있다

👉 “마지막으로 보낸 요청만 유효하다”는 기준이 필요하다.

---

### 2️⃣ Cancel은 사용자 제어다
```js
abortController.abort();
```

- 네트워크를 기다릴 필요 없음
- 사용자가 흐름을 끊을 수 있음
- AbortError는 정상적인 종료다

---

### 3️⃣ Disable은 UX 전략이다
```js
if (disableDuringLoad && state.status === 'loading') return;
```

- 기술적 해결 ❌
- 사용자 행동을 제한해 문제를 예방 ⭕

---

## 🧠 핵심 이론 보강

### Latest Request Wins 패턴
```js
if (requestId !== currentRequestId) return;
```

- 오래된 응답 무시
- 상태 오염 방지
- Race의 가장 단순한 해법

---

### AbortController의 역할
- fetch 자체를 중단
- catch에서 AbortError 분기
- Cancel UI와 직접 연결

---

### 세 전략의 관계
| 전략 | 목적 |
|---|---|
| Race | 응답 순서 제어 |
| Cancel | 사용자 중단 |
| Disable | UX 차단 |

👉 실무에서는 **항상 조합**한다.

---

## 🧩 상태 모델
```js
let state = {
  status: 'idle' | 'loading' | 'success' | 'cancelled',
  data: [],
};
```

- status : 비동기 단계
- data : 최신 요청 결과

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 요청 시작 & ID 갱신
```js
const requestId = ++currentRequestId;
```

---

### 2️⃣ 이전 요청 취소
```js
if (abortController) abortController.abort();
abortController = new AbortController();
```

---

### 3️⃣ Race 방어
```js
if (requestId !== currentRequestId) return;
```

---

### 4️⃣ Cancel 처리
```js
if (err.name === 'AbortError') {
  state = { status: 'cancelled', data: [] };
}
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 최신 요청만 상태 반영
- 요청 취소 가능
- UX 차원의 중복 방지 포함

### 기른 역량
- 비동기 동시성 제어 사고
- AbortController 실전 활용
- 실무형 async UX 설계 능력

---

## 📂 파일 구조
```
48-async-control/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] Race condition을 설명할 수 있는가
- [ ] Cancel과 Disable 차이를 이해했는가
- [ ] 최신 요청만 반영되는 구조인가
- [ ] AbortError를 정상 흐름으로 처리했는가

---

## 🎯 얻어가는 점
- 비동기는 통제 대상이다
- Race는 반드시 발생한다
- Cancel은 UX다
- 이 구조는 React/SPA 비동기 패턴의 기반이 된다
