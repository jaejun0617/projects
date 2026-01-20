# Day 22 — Theory: Memory & Call Stack  
**Fri, Jan 16, 2026**

JavaScript에서 “왜 값이 이상하게 같이 바뀌지?” 같은 버그의 80%는 **메모리(Heap/Stack) + 참조(Reference)**를 제대로 이해하면 끝납니다.  
오늘은 **참조 공유 버그를 재현 → 원인 설명 → 해결(Spread) → 한계(Shallow) → 실무 패턴(불변성)**까지 한 번에 정리합니다.

---

## 🧠 오늘의 핵심 요약 (한 줄)

> **Primitive는 ‘값 복사’, Object/Array는 ‘주소 복사’다. UI 상태는 주소가 바뀌어야(새 객체) 변경으로 인식된다.**

---

## 🎯 미션 목표

- Call Stack이 **함수 실행 순서를 어떻게 관리**하는지 이해
- Heap/Stack 관점으로 **Primitive vs Reference 저장 방식** 정리
- 객체 복사 시 발생하는 **참조 공유(Reference Bug)**를 콘솔에서 재현
- `...spread`로 **얕은 복사(Shallow Copy)** 해결
- 얕은 복사의 한계(중첩 객체)까지 확인하고 **실무 대응 방향**을 잡기

---

## 1) Call Stack (콜 스택)

### 1-1. 역할
- **함수 호출의 “실행 순서”**를 관리하는 공간
- 실행 중인 함수의 “현재 위치(컨텍스트)”가 쌓인다.

### 1-2. 구조
- **LIFO**: Last In, First Out (마지막에 들어온 게 먼저 나감)

### 1-3. 스택이 쌓이는 흐름

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  console.log("끝");
}

a();
```

실행 흐름(개념):
1. `a()` 호출 → Stack에 a 프레임 push  
2. `b()` 호출 → Stack에 b 프레임 push  
3. `c()` 호출 → Stack에 c 프레임 push  
4. `c()` 종료 → pop  
5. `b()` 종료 → pop  
6. `a()` 종료 → pop

### 1-4. Stack Overflow는 언제?
- 재귀가 끝나지 않거나, 함수 호출이 무한히 이어질 때
- 대표: **종료 조건 없는 재귀**

```js
function boom() {
  boom();
}
boom(); // RangeError: Maximum call stack size exceeded
```

---

## 2) Heap (힙)

### 2-1. 역할
- **크기가 유동적인 데이터**를 저장하는 공간  
- 대표적으로: `Object`, `Array`, `Function`

### 2-2. 핵심 포인트
- Stack에는 “실제 값”이 아니라 **Heap을 가리키는 주소(reference)**가 저장된다.
- 그래서 “복사”를 해도 **주소만 복사**되면 같은 데이터를 공유한다.

---

## 3) Primitive vs Reference (⭐ 가장 중요한 표)

| 구분 | Primitive | Reference |
|---|---|---|
| 예시 | number, string, boolean, null, undefined, symbol, bigint | object, array, function |
| 저장 방식 | 값 자체를 복사 | 주소(참조)를 복사 |
| 복사 결과 | 서로 독립 | 같은 데이터를 공유할 수 있음 |
| 주 저장 위치 | Stack | Heap(데이터) + Stack(주소) |

---

## 4) 참조 문제(Reference Bug) 재현

### 4-1. “복사했는데 같이 바뀜” (주소 공유)

```js
let user = {
  name: "김철수",
  age: 25,
  job: "학생",
};

let admin = user; // ❌ 주소 복사 (같은 객체를 바라봄)

admin.job = "관리자";

console.log("user:", user);
console.log("admin:", admin);
```

결과(핵심):
- `admin.job`만 바꿨는데 `user.job`도 바뀜  
- 이유: `admin`과 `user`가 **같은 Heap 객체**를 가리킴

### 4-2. “같은 객체인지” 확인하는 디버깅

```js
console.log(user === admin); // true (같은 참조)
```

---

## 5) 해결: Spread로 얕은 복사(Shallow Copy)

### 5-1. 객체 얕은 복사

```js
let user = {
  name: "김철수",
  age: 25,
  job: "학생",
};

let manager = { ...user }; // ✅ 새로운 객체 생성(겉껍데기 복사)

manager.job = "팀 리더";

console.log("user:", user);
console.log("manager:", manager);
console.log(user === manager); // false
```

### 5-2. 배열 얕은 복사

```js
const a = [1, 2, 3];
const b = [...a];

b.push(4);

console.log(a); // [1,2,3]
console.log(b); // [1,2,3,4]
```

---

## 6) Spread의 한계: 얕은 복사만 한다 (중첩은 공유)

### 6-1. 중첩 객체는 여전히 같은 주소

```js
const user = {
  name: "철수",
  address: { city: "서울" },
};

const copy = { ...user }; // 겉 객체만 새로 생김
copy.address.city = "부산";

console.log(user.address.city); // "부산" (같이 바뀜)
console.log(user.address === copy.address); // true (중첩 참조 공유)
```

✅ 결론  
- `...spread`는 **1-depth(1단계)**까지만 안전

---

## 7) 실무에서 진짜 중요한 이유: “불변성(Immutability)”

프론트엔드(특히 React)에서 상태 변경을 감지하는 기본 방식은 보통:

- **참조(주소)가 바뀌었는가?**  
- 주소가 그대로면 “변경 없음”으로 판단할 수 있음 (최적화/리렌더링 기준)

### 7-1. 나쁜 패턴: 직접 수정(mutating)

```js
// ❌ 기존 객체를 직접 수정
state.user.name = "변경";
```

### 7-2. 좋은 패턴: 새 객체 만들기(immutable update)

```js
// ✅ 새 객체를 만들어서 참조를 바꿈
setState({
  ...state,
  user: {
    ...state.user,
    name: "변경",
  },
});
```

---

## 8) Deep Copy는 언제 필요?

### 8-1. 선택 기준
- 데이터가 1단계(flat)면 → Spread로 충분
- **중첩이 있고**, 그 중첩까지 바꿔야 하면 → “해당 경로만” 새로 만들기(구조적 공유)  
- “전체를 통째로 복제”는 비용이 커서 신중히

### 8-2. 가장 안전한 실무 마인드
- **바꿀 경로만 새로 만들고**, 나머지는 재사용(구조적 공유)
- 불필요한 Deep Copy는 성능 낭비

---

## 🧪 미션 체크리스트

- [ ] `admin = user`로 참조 공유가 발생하는지 확인했는가?
- [ ] `user === admin`이 `true`로 찍히는지 확인했는가?
- [ ] `{ ...user }`로 새 객체가 만들어지는지 확인했는가?
- [ ] 얕은 복사의 한계를 중첩 객체 예제로 재현했는가?
- [ ] “상태는 새 객체로 업데이트”라는 실무 결론을 말로 설명할 수 있는가?

---

## 🔥 오늘의 핵심

- Call Stack: **함수 실행 순서 관리(LIFO)**
- Heap: **객체/배열/함수의 실제 데이터 저장**
- Primitive: **값 복사**
- Reference: **주소 복사 → 참조 공유 버그 발생 가능**
- Spread: **얕은 복사(1-depth 안전)**
- 실무 결론: **상태 변경 = 새 참조 생성(불변성)**

---

## 📚 참고 키워드

- JavaScript Heap vs Stack
- Call Stack / Stack Overflow
- Primitive vs Reference
- Shallow Copy vs Deep Copy
- Immutability / Structural Sharing

---
