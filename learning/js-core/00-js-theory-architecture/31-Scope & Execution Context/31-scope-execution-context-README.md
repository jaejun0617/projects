# Day 31 — Scope & Execution Context

## 🏷 Topic
Scope / Execution Context / Call Stack / Lexical Environment

## 🔎 관련 검색어
- javascript execution context
- lexical scope javascript
- call stack execution context
- scope chain js
- how javascript executes code

---

## ✅ 한 줄 요약
변수와 함수가 살아 있는 이유는 **실행 컨텍스트와 렉시컬 스코프 구조** 때문이다.

---

## 📌 프로젝트 개요 (WHY)
Day 31은 새로운 기능을 만드는 날이 아니다.  
지금까지 사용해 온 모든 **상태(state)와 함수가 어디에 저장되고,  
왜 접근 가능한지**를 설명하기 위한 날이다.

이 개념을 이해하지 못하면:
- Closure는 외워도 이해되지 않고
- 이벤트 핸들러의 동작이 감으로 느껴지며
- React Hook의 원리를 설명할 수 없다

---

## 🎯 미션 목표
- Execution Context의 개념을 정확히 이해한다
- Scope와 실행 시점을 혼동하지 않는다
- Call Stack 관점에서 코드 실행 흐름을 설명할 수 있다
- Closure 학습을 위한 기반을 만든다

---

## 🧠 핵심 사고

### 1. Execution Context란 무엇인가
Execution Context는 **자바스크립트 엔진이 코드를 실행하기 위해 만드는 작업 공간**이다.

각 컨텍스트는 다음 정보를 포함한다.
- Variable Environment
- Lexical Environment
- this 바인딩

---

### 2. 실행은 항상 스택 구조다
```text
Global Execution Context
 └─ Function Execution Context
     └─ Inner Function Execution Context
```

- 함수 호출 → 컨텍스트 생성
- 함수 종료 → 컨텍스트 제거

---

### 3. Scope는 정의 시점에 결정된다
```js
function outer() {
  let x = 10;

  function inner() {
    console.log(x);
  }

  inner();
}
```

- inner는 호출 위치가 아니라
- **정의된 위치의 스코프를 기억한다**

이것이 렉시컬 스코프다.

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ Global → Function Context
```js
let a = 1;

function foo() {
  let b = 2;
  console.log(a + b);
}

foo();
```

- a는 Global Context
- b는 foo Context
- Scope Chain을 따라 탐색

---

### 2️⃣ 렉시컬 스코프 구조
```js
function outer() {
  let x = 10;

  function inner() {
    console.log(x);
  }

  return inner;
}
```

- inner는 outer의 Lexical Environment를 기억
- Closure의 전제 구조

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 실행 흐름을 Call Stack 기준으로 사고
- 스코프는 코드 구조로 판단
- 호출 위치에 속지 않는다

### 기른 역량
- JS 엔진 관점 사고
- Closure / this / 이벤트 흐름 이해 준비
- 상태가 메모리에 존재하는 위치 설명 가능

---

## 📂 파일 구조 (개념적)
```
execution-context/
└─ lexical-environment
```

---

## ☑️ 체크리스트
- [ ] Execution Context와 Scope를 구분할 수 있는가
- [ ] 변수 탐색 경로를 설명할 수 있는가
- [ ] 함수가 자신의 스코프를 기억하는 이유를 말할 수 있는가

---

## 🎯 얻어가는 점
- JS 실행 구조에 대한 명확한 그림
- Closure 학습의 진입 장벽 제거
- 이후 DOM / 이벤트 구조 이해를 위한 기반 확보
