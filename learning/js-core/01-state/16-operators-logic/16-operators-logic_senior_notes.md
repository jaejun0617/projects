# Day 16 — Operators & Logic (Senior-Level Theory)

> 기준: **MDN Web Docs 최신 정의**  
> 관점: **Expression / Evaluation / Control Flow / Short-circuit Logic**

---

## 📌 개요

이 문서는 JavaScript의 연산자와 논리를  
“계산 문법”이 아니라 **평가(Evaluation)와 흐름 제어(Control Flow)** 관점에서 설명한다.

핵심 질문은 다음이다.

- 연산자는 값을 만드는가, 흐름을 만드는가?
- 논리 연산자는 왜 조건문을 대체할 수 있는가?
- `&&`, `||`는 왜 값(value)을 반환하는가?
- 실무에서 `if`가 과해지는 순간은 언제인가?

---

## 1️⃣ Operator란 무엇인가 (MDN 재정의)

### MDN 정의
> An operator is a symbol or keyword that performs an operation on operands.

### 실무적 재정의
> JavaScript 연산자는  
> **값을 계산하는 도구이자, 실행 흐름을 결정하는 평가 규칙**이다.

📌 JS에서 모든 연산은 **Expression**이다.

```js
1 + 2;        // 값
a && b;       // 값
condition ? x : y; // 값
```

---

## 2️⃣ Expression vs Statement (중요)

### Expression
- 값을 반환한다
- 다른 Expression 안에 포함 가능

```js
const result = a > b ? a : b;
```

### Statement
- 실행 단위
- 값을 반환하지 않음

```js
if (a > b) {
  result = a;
}
```

📌 핵심:
> **논리 연산자와 삼항 연산자는 if를 대체할 수 있다.**

---

## 3️⃣ 산술 연산자 & 암묵적 형 변환

```js
1 + "2";   // "12"
1 - "2";   // -1
```

### 내부 동작 요약
- `+` : 문자열 우선
- `- * /` : 숫자 변환 우선

📌 실무 규칙:
> 연산 전에 타입을 **명시적으로 맞춰라**.

---

## 4️⃣ 비교 연산자 (== vs ===)

### MDN 권장
> Avoid `==`, prefer `===`.

```js
0 == false;   // true
0 === false;  // false
```

📌 핵심:
- `==` : 추상 동등 비교 (변환 포함)
- `===` : 엄격 비교 (타입 포함)

👉 실무에서는 **===만 사용**

---

## 5️⃣ 논리 연산자 (&&, ||, !)

### 가장 중요한 사실
> 논리 연산자는 **Boolean을 반환하지 않는다.  
> 마지막으로 평가된 값을 반환한다.**

```js
"a" && "b"; // "b"
null || "fallback"; // "fallback"
```

---

### Short-circuit Evaluation

```js
user && user.name;
```

- 앞이 falsy면 뒤 평가 ❌
- 안전한 접근 패턴

📌 핵심 문장:
> 논리 연산자는 조건문이 아니라  
> **조건 기반 값 선택 도구**다.

---

## 6️⃣ Truthy / Falsy (실무 기준)

### Falsy 값 (암기)
- false
- 0
- ""
- null
- undefined
- NaN

나머지는 전부 Truthy

📌 실무 실수:
```js
if (value) { ... } // 0, "" 처리 주의
```

---

## 7️⃣ 삼항 연산자 (Conditional Operator)

```js
condition ? A : B;
```

### 사용 기준
- 단일 조건
- 값 선택

### ❌ 금지 패턴
```js
a ? b ? c : d : e;
```

📌 핵심:
> 삼항은 **짧게**,  
> 길어지면 가독성 붕괴.

---

## 8️⃣ 논리 연산자로 if 제거하기

### before
```js
if (isLogin) {
  renderProfile();
}
```

### after
```js
isLogin && renderProfile();
```

📌 기준:
- 부작용(side-effect) 있는 경우에만 사용
- 복잡해지면 if가 낫다

---

## 9️⃣ 연산자 우선순위 (실무 관점)

```js
a && b || c
```

### 평가 순서
1. &&
2. ||

📌 실무 규칙:
> 헷갈리면 **괄호를 써라**.  
> 성능 차이 없다.

---

## 🔟 논리 설계 실수 TOP 3

### ❌ 1. Boolean 반환 착각
```js
const isValid = value && value.length;
```

- isValid는 숫자 가능
- 명시적 Boolean 변환 필요

---

### ❌ 2. OR 기본값 오용
```js
const count = input || 10;
```

- input = 0 → 10 ❌

👉 대안:
```js
const count = input ?? 10;
```

---

### ❌ 3. 조건 로직 중첩
```js
if (a && b && c && d) { ... }
```

👉 분리 필요

---

## 1️⃣1️⃣ 논리 연산자와 상태(State)

```js
const label = isOnline ? "Online" : "Offline";
```

- 상태 → 표현 매핑
- UI 설계 핵심 패턴

---

## ✅ 핵심 요약

- JS 연산자는 **값을 만든다**
- 논리 연산자는 흐름 제어 도구다
- && / || 는 Boolean이 아니라 **값 반환**
- if는 만능이 아니다
- ?? 는 기본값 설계의 핵심

---

## 🧠 마무리

> JavaScript의 논리는  
> 조건문을 많이 쓰는 것이 아니라,  
> **조건을 값으로 다루는 사고**다.

이 관점을 이해하면  
UI 로직과 상태 분기가 극도로 단순해진다.
