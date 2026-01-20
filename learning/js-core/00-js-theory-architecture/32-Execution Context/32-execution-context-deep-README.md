# Day 32 — Execution Context 심화 (Hoisting · TDZ)

## 🏷 Topic
Execution Context / Hoisting / TDZ / var let const

## 🔎 관련 검색어
- javascript hoisting explained
- temporal dead zone javascript
- execution context creation phase
- var let const difference hoisting
- lexical environment hoisting

---

## ✅ 한 줄 요약
에러와 `undefined`의 차이는 **실행 순서 문제가 아니라 Creation Phase 설계 차이**다.

---

## 📌 프로젝트 개요 (WHY)
Day 32는 결과가 헷갈리는 자바스크립트 코드를  
**암기가 아닌 엔진 관점으로 해석하는 단계**다.

Day 31에서 배운 Execution Context 구조를 바탕으로,
- 왜 어떤 코드는 실행되고
- 왜 어떤 코드는 즉시 에러가 발생하는지

를 **Creation Phase / Execution Phase** 기준으로 설명한다.

---

## 🎯 미션 목표
- Execution Context의 두 단계를 명확히 구분한다
- Hoisting의 정확한 의미를 설명한다
- TDZ(Temporal Dead Zone)의 실체를 이해한다
- var / let / const 차이를 엔진 기준으로 정리한다

---

## 🧠 핵심 사고

### 1. Execution Context는 두 단계로 동작한다

#### Creation Phase (실행 전)
- 스코프 구조 확정
- 식별자 등록
- 메모리 공간 확보

#### Execution Phase (실행 중)
- 코드 한 줄씩 실행
- 값 할당
- 함수 호출

👉 **결과는 이미 Creation Phase에서 결정된다**

---

### 2. Hoisting의 정확한 정의
❌ “코드가 위로 끌어올려진다”  
⭕ **“식별자가 Creation Phase에 미리 등록된다”**

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ var Hoisting
```js
console.log(a);
var a = 10;
```

**결과**
```text
undefined
```

**엔진 해석**
- Creation Phase: a → undefined
- Execution Phase: console.log 실행

---

### 2️⃣ Function Declaration Hoisting
```js
foo();

function foo() {
  console.log('hello');
}
```

**결과**
```text
hello
```

**엔진 해석**
- Creation Phase에 함수 전체 등록

---

### 3️⃣ let / const 와 TDZ
```js
console.log(a);
let a = 10;
```

**결과**
```text
ReferenceError
```

**이유**
- 식별자는 등록됨
- 초기화 전 접근 → TDZ

---

### 4️⃣ TDZ 범위 시각화
```js
{
  // TDZ 시작
  console.log(x); // ❌
  let x = 5;
  // TDZ 종료
}
```

TDZ는 **선언 전이 아니라 초기화 전 영역**이다.

---

### 5️⃣ 함수 스코프 내부 var 섀도잉
```js
var a = 1;

function foo() {
  console.log(a);
  var a = 2;
}

foo();
```

**결과**
```text
undefined
```

**이유**
- foo의 Creation Phase에서 a 등록
- 외부 a 가려짐

---

### 6️⃣ let 섀도잉 + TDZ
```js
let a = 1;

function foo() {
  console.log(a);
  let a = 2;
}

foo();
```

**결과**
```text
ReferenceError
```

**이유**
- 내부 a가 TDZ 상태
- 외부 a 접근도 차단

---

## ⚠️ 자주 발생하는 오해 정리

| 오해 | 실제 |
|---|---|
| var는 위로 올라간다 | 식별자만 등록 |
| let은 호이스팅 안 된다 | 등록은 된다 |
| TDZ는 선언 전 | 초기화 전 |
| 에러는 실행 중 문제 | Creation Phase 설계 문제 |

---

## 🔗 Day 31과의 연결
- Day 31: 스코프 구조 이해
- **Day 32: 실행 전 준비 단계가 결과를 결정**
- Day 33: 이 구조가 Closure로 이어짐

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 결과를 먼저 예측
- Creation / Execution 단계로 분해
- 스코프 그림으로 설명

### 기른 역량
- 엔진 기준 코드 해석 능력
- Hoisting/TDZ 문제 암기 탈출
- Closure 학습을 위한 토대 완성

---

## ☑️ 체크리스트
- [ ] undefined와 ReferenceError 차이를 설명할 수 있는가
- [ ] var / let / const 동작을 Creation Phase 기준으로 말할 수 있는가
- [ ] TDZ 범위를 정확히 설명할 수 있는가

---

## 🎯 얻어가는 점
- 실행 결과를 외우지 않아도 되는 사고 체계
- JS 엔진 관점의 디버깅 능력
- Closure / this / 이벤트 이해를 위한 핵심 기반
