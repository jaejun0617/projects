# Day 39 — Prototype 상속 & 메서드 오버라이딩 (extends / super)

## 🏷 Topic
Prototype Inheritance / extends super / Method Overriding / JS Inheritance Model

## 🔎 관련 검색어
- javascript extends super
- prototype inheritance javascript
- method overriding js
- class inheritance pitfalls
- prototype chain inheritance

---

## ✅ 한 줄 요약
JavaScript의 상속은 **복사가 아니라 prototype 체인 연결**이며, 오버라이딩은 탐색 우선순위를 바꾸는 행위다.

---

## 📌 프로젝트 개요 (WHY)
Day 39는 “class 상속 문법”을 배우는 날이 아니다.  
**JavaScript에서 상속이 실제로 무엇을 의미하는지**를 구조적으로 이해하는 단계다.

이걸 이해하지 못하면:
- super를 왜 호출해야 하는지
- 오버라이딩이 왜 위험한지
- 상속 깊이가 왜 유지보수를 망치는지

설명할 수 없다.

---

## 🎯 미션 목표
- prototype 기반 상속 구조를 설명한다
- extends가 내부적으로 무엇을 하는지 이해한다
- super의 정확한 역할을 정의한다
- 안전한 오버라이딩 기준을 세운다

---

## 🧠 핵심 사고

### 1. JS 상속은 연결이다
- 부모를 복사 ❌
- 부모 prototype에 연결 ⭕

```text
instance
 └─ [[Prototype]] → Child.prototype
                      └─ [[Prototype]] → Parent.prototype
                                           └─ Object.prototype
                                                └─ null
```

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 기본 상속 구조
```js
class Animal {
  speak() {
    console.log('sound');
  }
}

class Dog extends Animal {
  bark() {
    console.log('woof');
  }
}

const d = new Dog();
d.speak();
```

- Dog에는 speak 없음
- Animal.prototype에서 탐색

---

### 2️⃣ 메서드 오버라이딩
```js
class Dog extends Animal {
  speak() {
    console.log('bark');
  }
}
```

- 동일 이름 → 자식 우선
- 부모 메서드 가려짐

---

### 3️⃣ super 호출
```js
class Dog extends Animal {
  speak() {
    super.speak();
    console.log('woof');
  }
}
```

- super = Parent.prototype 접근자
- this는 그대로 Dog 인스턴스

---

### 4️⃣ constructor + super 규칙
```js
class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);
  }
}
```

- extends 사용 시
- constructor 내부 super() 필수

---

## ⚠️ 오버라이딩 실무 위험

### ❌ 무분별한 재정의
```js
class Button {
  render() {}
}

class FancyButton extends Button {
  render() {}
}
```

- 부모 동작 소실
- 예측 불가

---

### ⭕ 안전한 패턴
```js
class FancyButton extends Button {
  render() {
    super.render();
    // 확장 로직
  }
}
```

---

## 📊 상속 vs Composition 선택 가이드

| 기준 | 상속 | Composition |
|---|---|---|
| 행동 확장 | ⭕ | ⭕ |
| 깊은 구조 | ❌ | ⭕ |
| 유연성 | 낮음 | 높음 |
| 변경 내성 | 낮음 | 높음 |

👉 **깊은 상속은 위험**

---

## 🔗 이전 Day와의 연결
- Day 38: Prototype & Class
- Day 39: Prototype 체인 확장
- Day 40: Composition으로 대체

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 상속 깊이 최소화
- override 시 super 고려
- 행동 확장 목적만 상속 사용

### 기른 역량
- JS 상속 구조 완전 이해
- class 사용 시 위험 요소 인지
- 객체 설계 판단력 상승

---

## ☑️ 체크리스트
- [ ] prototype 체인 상속을 설명할 수 있는가
- [ ] super의 역할을 정확히 말할 수 있는가
- [ ] 오버라이딩 위험을 인지하는가

---

## 🎯 얻어가는 점
- JS 상속에 대한 환상 제거
- 안전한 extends 사용 기준 확립
- 다음 단계 Composition 설계 준비 완료
