# Day 19 — Objects & Composition (ULTIMATE Master Edition)
# 이론 + 문법 사전 + 설명서 + 실무 + 아키텍처 완전 통합판

> 기준: **MDN Web Docs 최신 정의 (2026 기준)**  
> 목적: JavaScript 객체를 **문법 → 사용법 → 설계 → 아키텍처**까지 한 번에 끝낸다.

---

## 📌 이 문서의 성격 (절대 중요)

이 README는 다음을 **모두 포함**한다.

- ✅ 엔진 관점 이론 (Memory / this / Prototype)
- ✅ **문법 사전 (Syntax Reference)**
- ✅ **설명서(Manual: 언제/왜/주의점)**
- ✅ 실무 예제 코드
- ✅ 아키텍처 설계 기준

👉 객체 파트의 **최종 기준 문서**다.

---

## 1️⃣ Object란 무엇인가 (MDN + 엔진 관점)

### MDN 정의
> An object is a collection of properties, and a property is an association between a name (key) and a value.

### 실무적 재정의
> 객체는  
> **상태(State)와 행위(Behavior)를 함께 소유하는  
> 최소 단위의 도메인 모델**이다.

📌 핵심
- Property = 상태
- Method = 행위
- 객체는 “데이터 덩어리”가 아니라 **역할 단위**

---

## 2️⃣ 객체 생성 문법 사전 (완전판)

### 2-1. Object Literal (가장 기본)
```js
const user = {
  name: "Jaejun",
  age: 25,
};
```
**언제 쓰나**
- 데이터 모델 정의
- 설정 객체

---

### 2-2. 동적 프로퍼티 (Computed Property)
```js
const key = "email";

const user = {
  [key]: "test@mail.com",
};
```
**언제 쓰나**
- 폼 데이터
- API 응답 매핑

---

### 2-3. Object.create
```js
const baseUser = { role: "guest" };
const user = Object.create(baseUser);
user.name = "Jaejun";
```

**설명**
- 명시적 프로토타입 지정
- 상속 구조 학습용

---

### 2-4. Constructor Function
```js
function User(name) {
  this.name = name;
}
const u = new User("Jaejun");
```

**설명**
- this + new 바인딩 학습
- Class의 내부 동작 이해용

---

### 2-5. Class Syntax
```js
class User {
  constructor(name) {
    this.name = name;
  }
}
```

📌 class는 **prototype 기반 문법 설탕**

---

### 2-6. Factory Function (실무 최우선)
```js
function createUser(name) {
  return {
    name,
    isOnline: false,
  };
}
```

**장점**
- this 불필요
- 테스트 쉬움
- 합성에 유리

---

## 3️⃣ Property 접근 & 관리 설명서

```js
user.name;        // dot
user["name"];     // bracket
```

### 언제 bracket?
- 키가 변수일 때
- 공백/특수문자 키

---

### 존재 여부 확인
```js
"name" in user;
user.hasOwnProperty("name");
```

---

## 4️⃣ 객체와 메모리 구조 (중요)

```js
const a = { x: 1 };
const b = a;
b.x = 2;
```

### 메모리 모델
- 객체는 Heap
- 변수는 Stack에 주소 저장
- 참조 공유

📌 결론  
> 객체는 **항상 가변(mutable)** 이다.

---

## 5️⃣ 얕은 복사 vs 깊은 복사 (설명서)

### 얕은 복사
```js
const copy = { ...user };
```

### 깊은 복사 (주의)
```js
structuredClone(user);
```

📌 JSON 방식은 함수/Date 손실

---

## 6️⃣ this 완전 설명서 (객체 핵심)

### this 결정 규칙 요약
1. new 바인딩
2. 명시적 바인딩 (call/apply/bind)
3. 암시적 바인딩 (obj.method())
4. 기본 바인딩

```js
const user = {
  name: "Jaejun",
  greet() {
    console.log(this.name);
  },
};
```

📌 핵심 문장  
> this는 **호출 시점**에 결정된다.

---

## 7️⃣ Method 설계 규칙 (실무)

### ❌ 나쁜 구조
```js
let count = 0;
function increase() {
  count++;
}
```

### ✅ 좋은 구조
```js
const counter = {
  count: 0,
  increase() {
    this.count++;
  },
};
```

---

## 8️⃣ Composition vs Inheritance (아키텍처)

### 상속 ❌
```js
class Admin extends User {}
```

### 합성 ⭕
```js
const withTimestamp = (obj) => ({
  ...obj,
  createdAt: Date.now(),
});
```

📌 실무 결론  
> **합성은 유연하고, 상속은 경직된다.**

---

## 9️⃣ 실무 패턴 설명서

### 9-1. 옵션 객체 패턴
```js
function initModal({ closeOnEsc = true, dim = true }) {}
```

### 9-2. 객체 맵 패턴
```js
const handlers = {
  idle: renderIdle,
  loading: renderLoading,
};
handlers[state]?.();
```

---

## 🔟 Object 유틸리티 사전

| 메서드 | 용도 |
|---|---|
| Object.keys | 키 순회 |
| Object.values | 값 순회 |
| Object.entries | 구조 분해 |
| Object.freeze | 불변 |
| Object.seal | 추가 금지 |
| Object.assign | 병합 |

---

## 1️⃣1️⃣ 흔한 실수 TOP 7

1. 객체를 값처럼 취급
2. this를 변수처럼 사용
3. 깊은 복사 오해
4. class 남용
5. 상속 과신
6. 메서드 분리 실패
7. 상태와 로직 혼합

---

## 1️⃣2️⃣ 이 단계 통과 기준 (면접 기준)

설명 가능해야 할 질문:
- 객체는 왜 Heap에 저장되는가?
- 참조 공유의 위험은?
- this는 언제 결정되는가?
- 상속보다 합성이 좋은 이유는?
- Factory가 class보다 나은 경우는?

---

## 🧠 최종 결론

> 객체는  
> 문법이 아니라 **설계 단위**다.

이 문서를 이해하면  
JS 객체 → 컴포넌트 → 상태 관리 → React 설계까지  
한 번에 이어진다.
