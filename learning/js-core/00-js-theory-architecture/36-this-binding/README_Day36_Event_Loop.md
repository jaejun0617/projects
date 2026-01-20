# Day 36 — Async Theory: Event Loop

## Fri, Jan 30, 2026

### Topic
Event Loop (Task Queue / Microtasks / Non-blocking)

### Goal
`setTimeout`만으로 **정확한 타이머 / 스톱워치** 구현  
(재귀 타이머 + 실제 시간 기반 보정)

---

## ✅ 한 줄 요약
JavaScript는 **단일 스레드**지만, Event Loop와 Queue 구조 덕분에  
**기다리는 일은 밖에 맡기고(non-blocking)** 화면은 멈추지 않는다.

---

## 1. Event Loop 핵심 구조 (실무 기준)

### 1-1. Call Stack
- 현재 실행 중인 **동기 코드**
- 한 번에 하나만 실행
- 비어야 다음 작업 가능

### 1-2. Web APIs (브라우저 영역)
- 타이머, 네트워크, DOM 이벤트 등
- “기다리는 일”을 JS 대신 처리

### 1-3. Task Queue (Macrotask)
- `setTimeout`, `setInterval`, DOM 이벤트
- **한 번에 하나**씩 Call Stack으로 이동

### 1-4. Microtask Queue
- `Promise.then`, `queueMicrotask`
- **Task보다 우선**
- 스택이 비면 → 전부 실행 후 Task 1개

### 1-5. Event Loop 실행 규칙
```
Call Stack 비었나?
 → Microtask 전부 실행
 → Task 하나 실행
 → 반복
```

---

## 2. 왜 setTimeout은 정확하지 않은가?

- 최소 지연(minimum delay)일 뿐
- Call Stack이 바쁘면 지연
- 렌더링, CPU 부하, 백그라운드 탭 영향
- 그래서 **실제 시간 기준 계산**이 필요

---

## 3. setInterval 대신 재귀 setTimeout

### ❌ setInterval 문제
- 콜백이 늦어지면 밀림(drift)
- 중복 실행 위험

### ✅ 재귀 setTimeout 장점
- 다음 실행 시점 직접 제어
- 드리프트 보정 가능

---

## 4. 정확한 타이머 설계 핵심

### 상태(State)
- `isRunning`
- `timerId`
- `startAt`
- `pausedAt`
- `pausedTotal`
- `expectedAt`

### 원칙
- 계산은 **ms**
- 표시는 **초**
- 실제 시간(`performance.now`) 기준

---

## 5. Drift 보정 공식

```js
expectedAt += 1000;
delay = expectedAt - now;
setTimeout(tick, Math.max(0, delay));
```

- “다음 tick이 울려야 할 목표 시각” 기준

---

## 6. 핵심 코드 스켈레톤

```html
<div id="display">00:00</div>
<button id="start">시작</button>
<button id="stop">정지</button>
<button id="reset">초기화</button>
```

```js
let isRunning = false;
let timerId = null;
let startAt = 0;
let pausedAt = 0;
let pausedTotal = 0;
let expectedAt = 0;

function tick() {
  if (!isRunning) return;
  render();
  expectedAt += 1000;
  const delay = Math.max(0, expectedAt - performance.now());
  timerId = setTimeout(tick, delay);
}
```

---

## 7. 자주 터지는 버그 체크

- 시작 여러 번 → isRunning 체크 누락
- 정지 후에도 진행 → clearTimeout 누락
- 탭 전환 후 시간 이상 → 실제 시간 기반 계산 안 함

---

## 8. 핵심 용어 정리

- **Blocking**: 스택이 막혀 UI 정지
- **Non-blocking**: 대기 작업을 외부로 위임
- **Task Queue**: 타이머 / 이벤트
- **Microtask Queue**: Promise 후속
- **Event Loop**: 실행 순서 감시자

---

## 🎯 이 Day의 진짜 목적
- 비동기 = 문법이 아니라 **구조**
- 타이머 구현 = Event Loop 이해 증명
- 이후 Promise / async-await 이해의 기반
