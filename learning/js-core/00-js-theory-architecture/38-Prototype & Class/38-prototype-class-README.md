# Day 38 — Prototype & Class (JS 객체 모델의 본질)

## 🏷 Topic
Prototype Chain / Class Syntax / Object Model / Method Delegation

## 🔎 관련 검색어
- javascript prototype chain
- class vs prototype javascript
- javascript object model
- prototype delegation
- arrow method vs prototype method

---

## ✅ 한 줄 요약
JavaScript의 객체 모델은 **class가 아니라 prototype 위임 구조**다.

---

## 📌 프로젝트 개요 (WHY)
Day 38은 “class 문법을 쓰는 법”을 배우는 날이 아니다.  
JavaScript에서 객체가 **어떻게 행동을 공유하고, 메서드를 재사용하는지**를 구조적으로 이해하는 단계다.

이 개념을 이해하지 못하면:
- 메서드가 어디서 오는지 설명 못 하고
- this와 prototype을 따로 이해하게 되며
- 성능/메모리 판단을 감으로 하게 된다.

---

## 🎯 미션 목표
- Prototype Chain 구조를 설명할 수 있다
- Class 문법이 내부적으로 무엇을 만드는지 이해한다
- 메서드 공유와 메모리 차이를 판단할 수 있다
- Closure vs Prototype 선택 기준을 확립한다

---

## 🧠 핵심 사고

### 1. 객체는 위임 구조다
객체는 메서드를 “소유”하지 않는다.  
**필요할 때 prototype 체인을 따라 위임(delegate)** 한다.

```text
instance
 └─ [[Prototype]] → Constructor.prototype
                      └─ [[Prototype]] → Object.prototype
                                           └─ null
```

---

### 2. Prototype Chain 탐색
```js
const user = { name: 'Kim' };
user.toString();
```

- user ❌
- user.__proto__ ❌
- Object.prototype ⭕  

👉 메서드는 체인을 따라 검색된다.

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 함수 + prototype
```js
function Person(name) {
  this.name = name;
}

Person.prototype.sayHi = function () {
  console.log(this.name);
};

const p1 = new Person('A');
const p2 = new Person('B');
```

- sayHi 메서드 1개
- 모든 인스턴스가 공유
- 메모리 효율 ⭕  

---

### 2️⃣ class 문법
```js
class Person {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    console.log(this.name);
  }
}
```

👉 내부적으로는 prototype 메서드와 동일하다.

---

### 3️⃣ arrow 메서드의 차이
```js
class Person {
  sayHi = () => {
    console.log(this.name);
  };
}
```

- 인스턴스마다 함수 생성
- prototype 공유 ❌
- 메모리 비용 증가

---

## 🔗 this와 prototype의 연결
```js
p1.sayHi();
```

실행 과정:
1. p1에 sayHi 없음
2. Person.prototype에서 발견
3. this = p1

👉 this는 호출 주체, prototype은 탐색 경로

---

## 📊 Closure vs Prototype 선택 가이드

| 기준 | Closure | Prototype |
|---|---|---|
| 상태 은닉 | ⭕ | ❌ |
| 메서드 공유 | ❌ | ⭕ |
| 인스턴스 수 | 적음 | 많음 |
| 메모리 효율 | 낮음 | 높음 |

---

## ⚠️ 흔한 오해
- class가 JS의 객체 모델이다 ❌
- 메서드는 객체에 복사된다 ❌
- arrow 메서드는 항상 좋다 ❌

👉 **Prototype이 본체, Class는 표현**이다.

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 다수 인스턴스 → prototype 메서드
- private 필요 → closure
- 성능/메모리 기준 판단

### 기른 역량
- JS 객체 모델 이해
- this / prototype 연결 사고
- class 사용 시 성능 판단 능력

---

## ☑️ 체크리스트
- [ ] Prototype Chain을 설명할 수 있는가
- [ ] class와 prototype의 관계를 말할 수 있는가
- [ ] arrow 메서드의 비용을 이해하는가

---

## 🎯 얻어가는 점
- JavaScript 객체 모델에 대한 오해 제거
- 메서드 공유 구조 이해
- 이후 상속/extends 개념 학습 준비 완료
