# Day 36 — this 바인딩 (call / apply / bind / arrow)

## 🏷 Topic
this binding / call apply bind / arrow function this

## 🔎 관련 검색어
- javascript this binding
- call apply bind difference
- arrow function this
- event handler this javascript
- this keyword explained js

---

## ✅ 한 줄 요약
`this`는 정의 위치가 아니라 **호출 방식으로 결정되며, arrow 함수만 예외적으로 렉시컬 this를 캡처한다.**

---

## 📌 프로젝트 개요 (WHY)
Day 36은 자바스크립트에서 가장 많은 버그를 만드는 키워드인  
`this`를 **규칙 기반으로 해석**하는 단계다.

이 Day를 넘기면:
- 이벤트 핸들러의 this가 왜 바뀌는지
- 콜백에서 this가 깨지는 이유
- React / class 코드에서 bind가 필요한 이유

를 **외우지 않고 설명**할 수 있다.

---

## 🎯 미션 목표
- this 결정 규칙을 우선순위로 정리한다
- call / apply / bind 차이를 명확히 구분한다
- arrow 함수의 this 동작을 정확히 이해한다
- 실무 상황에서 올바른 선택을 할 수 있다

---

## 🧠 핵심 사고

### this는 실행 시점에 결정된다
- 선언 시점 ❌
- 호출 시점 ⭕

단, **arrow 함수만 예외**다.

---

## 🧠 this 결정 우선순위

1. new 바인딩  
2. 명시적 바인딩 (call / apply / bind)  
3. 암시적 바인딩 (객체.메서드)  
4. 기본 바인딩 (strict: undefined)

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 기본 바인딩
```js
function f() {
  console.log(this);
}
f(); // strict: undefined
```

---

### 2️⃣ 암시적 바인딩
```js
const obj = {
  x: 10,
  f() {
    console.log(this.x);
  },
};

obj.f(); // 10

const g = obj.f;
g(); // undefined
```

---

### 3️⃣ 명시적 바인딩
```js
function f(a, b) {
  console.log(this.x, a, b);
}

const ctx = { x: 42 };

f.call(ctx, 1, 2);
f.apply(ctx, [1, 2]);
const h = f.bind(ctx);
h(1, 2);
```

- call / apply: 즉시 실행
- bind: 고정된 함수 반환

---

### 4️⃣ new 바인딩
```js
function Person(name) {
  this.name = name;
}

const p = new Person('A');
```

- new는 this 바인딩 최우선

---

### 5️⃣ arrow 함수 this
```js
const obj = {
  x: 10,
  f() {
    const g = () => {
      console.log(this.x);
    };
    g();
  },
};

obj.f(); // 10
```

- arrow는 this를 가지지 않음
- 상위 렉시컬 this 캡처
- call/apply/bind 무시

---

## ⚠️ 흔한 함정

### 1. 메서드 분리
```js
setTimeout(obj.f, 0);
```

### 2. 이벤트 핸들러
```js
button.addEventListener('click', obj.f);
```

### 3. forEach 콜백
```js
arr.forEach(function () {
  console.log(this);
});
```

---

## 📊 실무 선택 가이드

| 상황 | 권장 |
|---|---|
| 객체 메서드 | function |
| 콜백 | arrow |
| 이벤트 내부 콜백 | arrow |
| this 고정 | bind |
| class 메서드 | function + bind |

---

## 🔗 Closure와의 연결
- arrow는 this를 **클로저로 캡처**
- bind는 this 참조를 고정
- 이벤트 cleanup과 함께 설계 필요

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- this를 암기하지 않는다
- 호출 방식을 먼저 본다
- arrow는 목적에 맞게 사용한다

### 기른 역량
- this 관련 버그 즉시 진단
- 이벤트 / 클래스 / React 코드 이해력 상승
- 안정적인 콜백 설계

---

## ☑️ 체크리스트
- [ ] this 결정 규칙을 우선순위로 말할 수 있는가
- [ ] arrow와 function 차이를 설명할 수 있는가
- [ ] call/apply/bind 사용 시점을 알고 있는가

---

## 🎯 얻어가는 점
- this에 대한 공포 제거
- 이벤트/콜백 설계 자신감
- 이후 class / React Hook 이해 가속
