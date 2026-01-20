# Day 21 — Memory, Call Stack & Heap (ULTIMATE Master Edition)
# 이론 + 문법 개념 + 설명서 + 실무 + 디버깅 관점 완전 통합판

> 기준: **MDN Web Docs + ECMAScript 실행 모델**  
> 관점: **Execution Context / Call Stack / Heap / Garbage Collection**

---

## 📌 이 문서의 목적

이 문서는 JavaScript의 메모리 구조를  
❌ “어려운 내부 이야기”  
❌ “면접용 이론”  

로 다루지 않는다.

> **메모리 구조는 JS의 모든 이상 행동을 설명하는 근본 원인**이다.

이 문서를 이해하면:
- 왜 값이 복사되고 객체는 공유되는지
- 왜 클로저가 메모리를 잡아먹는지
- 왜 콜스택 오버플로우가 발생하는지
- 왜 메모리 누수가 생기는지  
를 전부 설명할 수 있다.

---

## 1️⃣ JavaScript 메모리 모델 개요

### 핵심 구조
```
┌──────────────┐
│  Call Stack  │  ← 실행 컨텍스트 (LIFO)
└──────────────┘
┌──────────────┐
│     Heap     │  ← 객체 / 함수 / 참조 타입
└──────────────┘
```

📌 JS는 **싱글 스레드 + 콜스택 기반** 실행 모델을 가진다.

---

## 2️⃣ Execution Context와 메모리

### 실행 컨텍스트란?
> 코드가 실행되기 위해 필요한 모든 환경 정보의 묶음

### 구성 요소
- Lexical Environment
- Variable Environment
- this Binding

📌 실행 컨텍스트 생성 =  
> **메모리 공간 예약 + 식별자 바인딩**

---

## 3️⃣ Call Stack (실행 흐름의 핵심)

```js
function a() {
  b();
}
function b() {
  c();
}
function c() {}

a();
```

### 스택 흐름
```
Global
a()
b()
c()
```

- 함수 호출 → push
- 함수 종료 → pop

📌 핵심  
> JS는 항상 **스택 최상단 함수만 실행**한다.

---

## 4️⃣ Stack 메모리 (원시 값)

```js
let x = 10;
let y = x;
y = 20;
```

### 동작 설명
- 값 복사
- 서로 독립

📌 Stack 특징
- 빠름
- 고정 크기
- 자동 해제

---

## 5️⃣ Heap 메모리 (참조 값)

```js
const a = { value: 1 };
const b = a;
b.value = 2;
```

### 동작 설명
- 주소 복사
- 동일 객체 참조

📌 Heap 특징
- 동적 크기
- 느림
- GC 대상

---

## 6️⃣ 함수와 Heap (중요)

```js
function greet() {}
```

- 함수 자체도 Heap 객체
- Stack에는 참조만 저장

📌 함수 = 1급 객체

---

## 7️⃣ Closure와 메모리 유지

```js
function outer() {
  const data = "secret";
  return function inner() {
    console.log(data);
  };
}
```

- outer 실행 종료
- inner가 data 참조 유지

📌 핵심  
> 클로저는 **필요한 메모리를 GC로부터 보호**한다.

---

## 8️⃣ Garbage Collection (설명서)

### 기본 원리
- Reachability
- 참조 불가능 → 제거

### 대표 알고리즘
- Mark & Sweep

📌 개발자가 할 일
- 참조 끊기
- 전역 변수 최소화

---

## 9️⃣ 메모리 누수 실무 패턴

### ❌ 1. 전역 변수
```js
window.cache = {};
```

### ❌ 2. 해제 안 된 이벤트
```js
el.addEventListener("click", handler);
```

### ❌ 3. 불필요한 클로저
```js
setInterval(() => {
  heavyObject.use();
}, 1000);
```

---

## 🔟 Call Stack Overflow

```js
function loop() {
  loop();
}
```

- 재귀 탈출 조건 없음
- 스택 초과

📌 해결
- 종료 조건
- 반복문 전환

---

## 1️⃣1️⃣ 실무 디버깅 체크리스트

- 값인가? 참조인가?
- 스택에 쌓이는가?
- 힙에 남아 있는가?
- 참조가 끊겼는가?

---

## 1️⃣2️⃣ 통과 기준 (면접/실무)

설명 가능해야 할 질문:
- 원시 타입과 참조 타입 메모리 차이
- 클로저는 왜 메모리를 유지하는가?
- GC는 언제 객체를 제거하는가?
- 메모리 누수는 어떻게 생기는가?

---

## 🧠 최종 결론

> JavaScript 메모리는  
> **보이지 않지만 모든 버그의 원인**이다.

이 구조를 이해하면  
JS 동작은 더 이상 미스터리가 아니다.
