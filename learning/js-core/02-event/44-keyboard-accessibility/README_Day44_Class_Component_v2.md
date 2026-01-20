# Day 44 — Class-based Components  
**Sat, Feb 7, 2026**

바닐라 JS Class 문법으로 재사용 가능한 `Component` 부모 클래스 만들기

---

## 🧠 오늘의 핵심 요약 (한 줄)
> **Class는 UI를 찍어내는 설계도이고, Component 패턴은 실무 구조의 시작점이다.**

---

## 🎯 미션 목표
- JavaScript **Class 문법** 정확히 이해
- `this` 바인딩 개념 명확히 정리
- **재사용 가능한 Component 부모 클래스** 구현
- 상속(`extends`) 기반 버튼 컴포넌트 구현

---

## 📌 왜 이걸 배우는가 (실무 관점)
- UI는 반복된다  
- 복사로 만든 UI는 유지보수 지옥을 만든다  
- 공통 구조를 **부모 컴포넌트**로 추상화한다  
- React / Vue 컴포넌트 사고방식과 동일하다  

---

## 🧩 핵심 이론 정리

### 1️⃣ Class란?
- 객체를 만들기 위한 **설계도**
- 데이터(속성) + 동작(메서드)을 하나로 묶는다
- 재사용 가능한 구조를 만든다

```js
class User {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    console.log(this.name);
  }
}
```

---

### 2️⃣ constructor의 역할
- `new` 키워드로 객체 생성 시 **자동 실행**
- 객체의 초기 상태를 세팅하는 공간

```js
new User("재준");
// → constructor 실행
```

---

### 3️⃣ this의 정확한 의미
> **this = 지금 이 메서드를 호출한 객체**

| 위치 | this가 가리키는 것 |
|---|---|
| constructor | 생성 중인 인스턴스 |
| 메서드 내부 | 메서드를 호출한 객체 |

```js
user.sayHi();
// sayHi 내부 this === user
```

---

### 4️⃣ 상속 (extends / super)
- 공통 기능 → 부모 클래스
- 개별 기능 → 자식 클래스

```js
class Child extends Parent {
  constructor() {
    super(); // 부모 constructor 실행
  }
}
```

⚠️ 자식 클래스에서 `this` 사용 전 `super()` 호출 필수

---

## 🏗️ 미션 구현

### 1️⃣ HTML 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>Class Component</title>
</head>
<body>
  <h1>Class 기반 컴포넌트</h1>
  <div id="app"></div>

  <script src="index.js"></script>
</body>
</html>
```

---

### 2️⃣ Component 부모 클래스

```js
class Component {
  constructor($element, props = {}) {
    this.$element = $element;
    this.props = props;
  }

  render() {
    console.log("Component.render() called");
  }
}
```

**역할**
- 모든 컴포넌트의 공통 기반
- DOM 제어 대상과 데이터 관리

---

### 3️⃣ MyButtonComponent 자식 클래스

```js
class MyButtonComponent extends Component {
  constructor($element, props = {}) {
    super($element, props);
  }

  render() {
    this.$element.innerHTML = `<button>${this.props.text}</button>`;

    if (this.props.id) {
      this.$element.querySelector("button").id = this.props.id;
    }
  }
}
```

**포인트**
- `render()` 오버라이드
- 구조는 부모, 표현은 자식이 담당

---

### 4️⃣ 인스턴스 생성 & 렌더링

```js
const app = document.getElementById("app");

const button = new MyButtonComponent(app, {
  text: "안녕하세요, Class Component!",
  id: "my-class-button",
});

button.render();
```

---

## 🔥 핵심 개념 정리

### ✔ Component 패턴
- UI = 데이터 + DOM + 로직
- 컴포넌트는 자기 책임만 가진다

### ✔ 부모 / 자식 역할 분리
- 부모: 구조 / 규칙
- 자식: 실제 UI 표현

### ✔ React로 가는 다리
| 지금 | 나중 |
|---|---|
| Component class | React Component |
| render() | return JSX |
| props | props |

---

## 🧠 오늘 반드시 가져가야 할 것
- Class는 문법이 아니라 **구조 설계 도구**
- this는 호출 주체만 보면 해결된다
- 컴포넌트 사고방식은 프론트엔드 실력의 기준이다

---

## 📚 참고 키워드
- JavaScript Class  
- this binding  
- extends / super  
- Component Pattern  
- OOP JavaScript  
