# Day 17 — Control Flow & Loops (Senior-Level Theory)

> 기준: **MDN Web Docs 최신 정의**  
> 관점: **Control Flow Graph / Iteration Model / State Transition**

---

## 📌 개요

이 문서는 JavaScript의 제어 흐름(Control Flow)과 반복문(Loops)을  
“문법 묶음”이 아니라 **실행 경로 설계와 상태 전이(State Transition)** 관점에서 설명한다.

핵심 질문은 다음이다.

- 조건문은 왜 흐름을 ‘분기’시키는가?
- 반복문은 왜 상태 머신(state machine)으로 봐야 하는가?
- `for`, `while`, `forEach`의 본질적 차이는 무엇인가?
- 언제 반복문이 코드 냄새(code smell)가 되는가?

---

## 1️⃣ Control Flow란 무엇인가

### MDN 정의 요약
> Control flow is the order in which individual statements, instructions, or function calls are executed.

### 실무적 재정의
> Control Flow란  
> **프로그램이 실행되면서 선택·반복·탈출을 통해  
> 어떤 경로를 밟는지에 대한 설계**다.

📌 JS는 기본적으로 **위에서 아래로** 실행되며,  
제어문은 이 흐름을 **의도적으로 꺾는 장치**다.

---

## 2️⃣ 조건문은 “분기 장치”다

### if / else의 본질

```js
if (condition) {
  A();
} else {
  B();
}
```

- condition은 Boolean으로 **평가(evaluate)** 된다
- 실행 경로는 **하나만 선택**

📌 핵심:
> 조건문은 값을 만드는 게 아니라  
> **실행 경로를 선택**한다.

---

## 3️⃣ switch 문 (언제 써야 하는가)

```js
switch (status) {
  case "idle":
    renderIdle();
    break;
  case "loading":
    renderLoading();
    break;
  default:
    renderError();
}
```

### 실무 기준
- 동일한 대상에 대한 **다중 분기**
- 상태(enum-like value) 처리에 적합

📌 주의:
- `break` 누락 → fall-through
- 복잡해지면 객체 맵이 더 낫다

```js
const handlers = {
  idle: renderIdle,
  loading: renderLoading,
};
handlers[status]?.();
```

---

## 4️⃣ Loop란 무엇인가 (핵심 재정의)

### MDN 정의 요약
> Loops offer a quick and easy way to do something repeatedly.

### 시니어 관점 재정의
> Loop는  
> **조건이 만족되는 동안  
> 동일한 상태 전이 규칙을 반복 적용하는 구조**다.

---

## 5️⃣ for / while / do...while 비교

### for
```js
for (let i = 0; i < n; i++) {}
```
- 반복 횟수 명확
- 인덱스 기반

### while
```js
while (condition) {}
```
- 종료 조건 중심
- 무한 루프 위험

### do...while
```js
do {} while (condition);
```
- 최소 1회 실행 보장

📌 기준:
> 반복 횟수가 명확하면 `for`,  
> 조건 중심이면 `while`.

---

## 6️⃣ break / continue / return (탈출 제어)

### break
- 반복문 종료

### continue
- 현재 반복 스킵

### return
- **함수 자체를 종료**

📌 시니어 기준:
> 중첩 루프에서 `return`은  
> 가장 강력한 탈출 수단이다.

---

## 7️⃣ 배열 반복 메서드 vs 반복문

### forEach의 오해

```js
arr.forEach(item => {
  if (item === 3) return;
});
```

- ❌ 반복 종료 불가
- `break`, `continue` 없음

📌 핵심:
> `forEach`는 **제어 흐름 도구가 아니다.**

---

### 언제 map / filter / reduce 인가?

- `map` → 변환
- `filter` → 제거
- `reduce` → 축약

📌 기준:
> “반복”이 아니라  
> **의도(Intent)** 로 선택한다.

---

## 8️⃣ 중첩 루프 = 경고 신호

```js
for (...) {
  for (...) {
    for (...) {}
  }
}
```

📌 의미:
- 시간 복잡도 급증
- 가독성 붕괴

👉 분리 / 함수화 / 자료구조 변경 필요

---

## 9️⃣ Control Flow와 State 사고

```js
if (isLoading) return renderLoading();
if (hasError) return renderError();
return renderData();
```

- 상태 우선 판단
- 조기 반환(Early Return)

📌 시니어 패턴:
> **if 중첩 대신 return 분기**

---

## 🔟 실무에서 자주 터지는 실수 TOP 3

### ❌ 1. 조건 누락 무한 루프
```js
while (true) {}
```

### ❌ 2. break 없는 switch
```js
case "A":
  doSomething();
// 다음 case 실행됨
```

### ❌ 3. forEach로 제어하려다 실패
```js
return arr.forEach(...)
```

---

## ✅ 핵심 요약

- Control Flow는 **실행 경로 설계**
- 조건문은 분기 장치
- Loop는 상태 전이 반복
- forEach는 흐름 제어 불가
- Early Return은 가독성 무기

---

## 🧠 마무리

> 좋은 제어 흐름은  
> “많은 조건”이 아니라  
> **읽히는 실행 경로**다.

이 관점이 잡히면  
JS 코드는 짧아지고,  
버그는 급격히 줄어든다.
