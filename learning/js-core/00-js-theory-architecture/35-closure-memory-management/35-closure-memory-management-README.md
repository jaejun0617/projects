# Day 35 — Closure 심화 & 메모리 관리 (Memory Leak Points)

## 🏷 Topic
Closure Memory / Garbage Collection / Memory Leak / Event Cleanup

## 🔎 관련 검색어
- javascript closure memory leak
- garbage collection reference javascript
- event listener memory leak
- closure unsubscribe pattern
- javascript memory management basics

---

## ✅ 한 줄 요약
Closure는 자동으로 만들어지지만 **자동으로 사라지지 않는다** — 참조가 남아 있으면 메모리는 유지된다.

---

## 📌 프로젝트 개요 (WHY)
Day 35는 Closure를 **안전하게 사용하는 기준을 확정**하는 단계다.

Day 33~34에서 우리는:
- Closure로 상태를 유지하고
- 전역 변수를 제거하며
- Store / Factory 패턴을 만들었다

하지만 이 구조는 잘못 쓰면 **조용한 메모리 누수**로 이어진다.

> 오늘의 핵심 질문  
> **“이 상태는 언제까지 살아 있어야 하는가?”**

---

## 🎯 미션 목표
- Garbage Collector의 판단 기준을 이해한다
- Closure가 메모리에 남는 조건을 설명한다
- 대표적인 메모리 누수 패턴을 식별한다
- 반드시 포함해야 할 cleanup 설계를 익힌다

---

## 🧠 핵심 사고

### 1. GC는 ‘의도’를 보지 않는다
Garbage Collector는 오직 하나만 본다.

> **참조(reference)가 남아 있는가?**

- 필요 없어 보여도 ❌
- 참조가 있으면 ⭕ 유지

---

### 2. Closure는 살아 있는 렉시컬 환경이다
- Execution Context는 종료될 수 있다
- 하지만 렉시컬 환경이 참조되면 유지된다

```js
function outer() {
  let bigData = new Array(1000000).fill('*');

  return function inner() {
    console.log(bigData.length);
  };
}

const fn = outer();
```

👉 `bigData`는 fn이 살아 있는 한 해제되지 않는다.

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 이벤트 + Closure 누수 패턴 (가장 흔함)
```js
function bind() {
  let count = 0;

  button.addEventListener('click', () => {
    count++;
    console.log(count);
  });
}
```

**문제**
- 핸들러 참조 제거 불가
- bind 재호출 시 중복 등록
- count 메모리 누적

---

### ⭕ 해결 — cleanup 경로 제공
```js
function bind() {
  let count = 0;

  function handler() {
    count++;
    console.log(count);
  }

  button.addEventListener('click', handler);

  return () => {
    button.removeEventListener('click', handler);
  };
}

const cleanup = bind();
// cleanup(); // 해제
```

---

### 2️⃣ Store / Subscriber 누수
```js
const unsubscribe = store.subscribe(() => {
  console.log('update');
});

// 컴포넌트 제거 시
unsubscribe();
```

- 구독 = 참조 추가
- 해제 = 참조 제거

---

### 3️⃣ 캐시 클로저 남용
```js
function cache(fn) {
  const store = {};

  return function (key) {
    if (store[key]) return store[key];
    store[key] = fn(key);
    return store[key];
  };
}
```

**문제**
- store 무한 성장
- GC 불가

**대응**
- 크기 제한
- TTL
- 수동 초기화

---

## ⚠️ 실무에서 반드시 지킬 3대 원칙

### ✅ 원칙 1 — 등록에는 해제가 따라야 한다
- addEventListener ↔ removeEventListener
- subscribe ↔ unsubscribe

---

### ✅ 원칙 2 — 상태 생존 범위를 명확히 한다

| 상태 종류 | 위치 | 해제 시점 |
|---|---|---|
| 앱 전역 | Store | 앱 종료 |
| 화면 단위 | Closure | 화면 제거 |
| 이벤트 | Handler | cleanup |

---

### ✅ 원칙 3 — Closure 캡처 범위 최소화
```js
// ❌ 과도한 캡처
let hugeObject;

// ⭕ 필요한 값만
let count;
```

---

## 🔗 이전 Day와의 연결
- Day 33: Closure 구조 이해
- Day 34: 실전 패턴 사용
- **Day 35: 안전한 사용과 해제**

이후:
- Day 36~37: this 바인딩
- Day 41~: DOM 이벤트와 결합

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- cleanup 없는 클로저 사용 금지
- 이벤트/구독은 생명주기 기준으로 관리
- 참조 제거 경로 명시

### 기른 역량
- 메모리 누수 감지 감각
- SPA 구조에서 안전한 상태 설계
- React cleanup(useEffect) 개념 선행 이해

---

## ☑️ 체크리스트
- [ ] 어떤 참조가 메모리를 유지시키는지 설명할 수 있는가
- [ ] 이벤트/구독 해제 구조를 설계할 수 있는가
- [ ] 클로저를 최소 범위로 캡처하고 있는가

---

## 🎯 얻어가는 점
- Closure는 강력하지만 책임이 따른다
- 메모리 누수는 “안 보이는 버그”다
- 이후 대형 앱에서도 안전하게 상태를 유지할 수 있는 기준 확보
