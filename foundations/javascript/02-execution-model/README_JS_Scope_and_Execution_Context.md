# JavaScript — Scope & Execution Context

## 이 챕터의 목적
이 문서는 JavaScript의 **스코프(Scope)** 와 **실행 컨텍스트(Execution Context)** 를
암기용 개념이 아니라 *코드를 예측할 수 있는 사고 도구*로 이해하기 위해 작성되었다.

---

## 1. Scope란 무엇인가

**Scope = 변수를 어디서 접근할 수 있는가에 대한 규칙**

```js
let a = 10;

function test() {
  let b = 20;
  console.log(a); // ✅ 접근 가능
}

console.log(b); // ❌ ReferenceError
```

### Scope의 핵심 역할
- 변수 충돌 방지
- 메모리 사용 범위 제한
- 코드 예측 가능성 확보

---

## 2. Scope의 종류

### 1) Global Scope
- 파일 최상단
- 어디서든 접근 가능
- 남용 시 충돌 위험 ↑

```js
var globalVar = 'danger';
```

### 2) Function Scope
- 함수 단위 스코프
- `var`는 여기까지만 유효

```js
function example() {
  var x = 10;
}
```

### 3) Block Scope (중요)
- `{}` 기준
- `let`, `const`만 해당

```js
if (true) {
  let a = 1;
}
console.log(a); // ❌
```

---

## 3. Lexical Scope (정적 스코프)

**선언 위치 기준으로 스코프가 결정된다**

```js
const x = 10;

function outer() {
  const x = 20;
  function inner() {
    console.log(x);
  }
  inner();
}

outer(); // 20
```

👉 함수가 *어디서 실행됐는지* ❌  
👉 함수가 *어디서 선언됐는지* ⭕

---

## 4. Execution Context란?

**코드가 실행되기 위해 필요한 환경 정보 묶음**

### 실행 컨텍스트의 구성 요소
1. Variable Environment
2. Lexical Environment
3. This Binding

---

## 5. 실행 컨텍스트 생성 단계

### 1️⃣ Creation Phase (생성 단계)
- 스코프 결정
- 변수/함수 메모리 등록
- `this` 바인딩

```js
console.log(a); // undefined
var a = 10;
```

### 2️⃣ Execution Phase (실행 단계)
- 코드 한 줄씩 실행
- 값 할당

---

## 6. Hoisting의 정체

### var 호이스팅
```js
console.log(a); // undefined
var a = 10;
```

### let / const
```js
console.log(b); // ❌ ReferenceError
let b = 10;
```

👉 메모리에 올라가지만  
👉 **TDZ (Temporal Dead Zone)** 때문에 접근 불가

---

## 7. Call Stack과 실행 흐름

```js
function a() {
  b();
}

function b() {
  console.log('b');
}

a();
```

**Call Stack 흐름**
1. global()
2. a()
3. b()
4. pop b
5. pop a

---

## 8. 실무에서 중요한 이유

### 버그 원인 TOP
- 스코프 오해
- 클로저 오작동
- this 혼동

### React / JS 실무 연결
- 상태 캡처 문제
- 이벤트 핸들러 동작
- 비동기 콜백 이해

---

## 9. 핵심 요약

- Scope = 접근 범위
- JS는 **Lexical Scope**
- Execution Context는 *실행 환경 스냅샷*
- Hoisting은 생성 단계의 부산물
- Call Stack은 실행 순서의 실체

---

## 다음 챕터
👉 **Closure (클로저)**  
👉 Scope + Execution Context의 결과물
