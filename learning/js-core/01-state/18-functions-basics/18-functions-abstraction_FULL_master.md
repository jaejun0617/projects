# Day 18 — Functions & Abstraction (Master-Level: Theory + Syntax + Manual)

> 기준: **MDN Web Docs 최신 정의**  
> 레벨: **이론 · 문법 · 실무 · 설명서 통합판**  
> 목적: 함수에 대한 모든 관점을 *한 문서*로 종결

---

## 📌 이 문서의 성격 (중요)

이 README는 다음을 **모두 포함**한다.

- ✅ 엔진 관점 이론 (Execution Context)
- ✅ 문법 정리 (Syntax Reference)
- ✅ 실무 설계 원칙
- ✅ 설명서/매뉴얼 용도
- ✅ 실무 예시 코드

👉 **“함수 파트 종합 사전”** 으로 사용한다.

---

## 1️⃣ Function이란 무엇인가 (MDN + 재정의)

### MDN 정의
> A function is a block of code designed to perform a particular task.

### 실무·엔진 관점 재정의
> 함수는  
> **호출 시 새로운 실행 컨텍스트를 생성하고,  
> 입력을 받아 출력을 반환하거나 부작용을 발생시키는  
> 독립 실행 단위**다.

📌 핵심
- 함수 호출 = **Call Stack Push**
- 함수 종료 = **Call Stack Pop**

---

## 2️⃣ 함수 문법 총정리 (Syntax Reference)

### 2-1. 함수 선언문 (Function Declaration)
```js
function add(a, b) {
  return a + b;
}
```
- 호이스팅 O
- 가장 안정적인 형태
- 메서드/비즈니스 로직에 적합

---

### 2-2. 함수 표현식 (Function Expression)
```js
const add = function (a, b) {
  return a + b;
};
```
- 호이스팅 X
- 변수에 할당
- 조건부 함수에 유리

---

### 2-3. 화살표 함수 (Arrow Function)
```js
const add = (a, b) => a + b;
```

특징:
- `this`, `arguments` 바인딩 없음
- 간결한 표현식

📌 사용 기준
- 콜백 / 유틸 → Arrow
- 객체 메서드 / 생성자 → ❌

---

### 2-4. 즉시 실행 함수 (IIFE)
```js
(function () {
  console.log("init");
})();
```
- 스코프 분리
- 초기화 코드

---

## 3️⃣ Parameters & Arguments (설명서)

```js
function greet(name = "Guest") {
  console.log(name);
}
```

| 용어 | 의미 |
|----|----|
| Parameter | 선언부 변수 |
| Argument | 호출 시 전달 값 |

- 기본값 가능
- rest parameter 사용 가능

```js
function sum(...nums) {}
```

---

## 4️⃣ Return (설명서 + 이론)

```js
function check(data) {
  if (!data) return null;
  return data.value;
}
```

### 핵심
- return = **함수 종료**
- return 없으면 `undefined`

📌 Early Return은 **가독성 패턴**

---

## 5️⃣ Execution Context 관점 함수 이해

```js
function outer() {
  function inner() {}
  inner();
}
outer();
```

```
Call Stack
---------
Global
outer()
inner()
---------
```

- 함수마다 독립 컨텍스트
- 스코프 체인 생성

---

## 6️⃣ Pure / Impure Function (이론 + 매뉴얼)

### Pure Function
```js
function double(x) {
  return x * 2;
}
```

### Impure Function
```js
let count = 0;
function inc() {
  count++;
}
```

| 구분 | 특징 |
|---|---|
| Pure | 테스트 쉬움 |
| Impure | UI/상태/IO |

📌 실무 원칙  
> 계산은 Pure, 변경은 Impure

---

## 7️⃣ Abstraction (추상화) 설명서

### 나쁜 예
```js
function doIt(x) {
  return x * 1.1;
}
```

### 좋은 예
```js
function applyDiscount(price) {
  return price * 0.9;
}
```

📌 함수 이름 = **의도 설명**

---

## 8️⃣ 실무 설계 원칙 TOP 5

1. 하나의 책임
2. 입력/출력 명확
3. 부작용 분리
4. 이름이 구현을 설명
5. 짧을수록 좋다

---

## 9️⃣ 실무 예제 ① 데이터 → UI 분리

```js
function validateUser(user) {
  return typeof user.name === "string";
}

function createUserHTML(user) {
  return `<h2>${user.name}</h2>`;
}

function mountUser(root, user) {
  if (!validateUser(user)) return;
  root.innerHTML = createUserHTML(user);
}
```

---

## 🔟 실무 예제 ② 상태 관리 패턴

```js
let state = { count: 0 };

function setState(next) {
  state = { ...state, ...next };
  render();
}

function render() {
  document.querySelector("#count").textContent = state.count;
}
```

---

## 1️⃣1️⃣ 흔한 실수 TOP 5

1. 함수가 너무 김
2. return 없는 함수
3. 이름 없는 함수
4. 내부에서 모든 책임 처리
5. this 오해

---

## 1️⃣2️⃣ 이 단계 통과 기준

다음 질문에 설명 가능하면 통과:

- 함수 호출 시 무슨 일이 일어나는가?
- return은 왜 제어 흐름인가?
- Pure/Impure를 왜 나누는가?
- Arrow Function을 왜 함부로 쓰면 안 되는가?

---

## 🧠 최종 정리

> 함수는  
> JS 구조의 시작이자 끝이다.

이 문서를 이해하면  
- JS
- React
- 상태 관리
- 아키텍처  
가 하나의 선으로 이어진다.
