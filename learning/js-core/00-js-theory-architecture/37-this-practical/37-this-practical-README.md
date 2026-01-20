# Day 37 — this 실전 (이벤트 · 클래스 · 콜백 패턴)

## 🏷 Topic
this binding practice / event handler this / class method this / callback this

## 🔎 관련 검색어
- javascript event handler this
- class method this binding
- this in callback javascript
- arrow function this event
- bind vs arrow this

---

## ✅ 한 줄 요약
this 문제는 문법 문제가 아니라 **호출 맥락(context) 설계 문제**다.

---

## 📌 프로젝트 개요 (WHY)
Day 37은 this 규칙을 외운 뒤 실제 코드에서 **깨지는 지점만 집중적으로 다루는 날**이다.

실무에서 this 버그는 대부분:
- 이벤트에 메서드를 그대로 넘겼을 때
- 클래스 메서드를 콜백으로 전달했을 때
- 비동기 콜백 안에서 this를 기대했을 때

발생한다.

Day 37의 목적은 이 질문에 즉답하는 것이다.

> “지금 이 코드에서 this는 누구인가?”

---

## 🎯 미션 목표
- 이벤트 핸들러에서 this를 정확히 판단한다
- 클래스 메서드 this 깨짐을 안전하게 해결한다
- 콜백 전달 시 올바른 패턴을 선택한다
- arrow / bind 사용 기준을 명확히 한다

---

## 🧠 핵심 사고

### this는 ‘누가 호출했는가’로 결정된다
- 정의 위치 ❌
- 호출 방식 ⭕

arrow 함수만 예외적으로 렉시컬 this를 캡처한다.

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ DOM 이벤트에서 this
```js
button.addEventListener('click', function () {
  console.log(this);
});
```

- this === button

---

### 2️⃣ 이벤트에서 가장 흔한 실수
```js
const app = {
  count: 0,
  handleClick() {
    this.count++;
  },
};

button.addEventListener('click', app.handleClick);
```

- this === button
- app.count ❌

---

### ⭕ 해결 패턴 — wrapper + arrow
```js
button.addEventListener('click', () => {
  app.handleClick();
});
```

- this 문제 제거
- 가장 안전한 패턴

---

### 3️⃣ 클래스 메서드 this 깨짐
```js
class Counter {
  count = 0;
  handleClick() {
    this.count++;
  }
}

const counter = new Counter();
button.addEventListener('click', counter.handleClick);
```

- this === button ❌

---

### ⭕ 해결 1 — constructor bind
```js
class Counter {
  constructor() {
    this.count = 0;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.count++;
  }
}
```

---

### ⭕ 해결 2 — class field arrow (현업 최다)
```js
class Counter {
  count = 0;
  handleClick = () => {
    this.count++;
  };
}
```

---

### 4️⃣ 콜백 내부 this
```js
const user = {
  name: 'Kim',
  say() {
    setTimeout(function () {
      console.log(this.name);
    }, 1000);
  },
};
```

- this === undefined

---

### ⭕ 해결 — arrow 캡처
```js
setTimeout(() => {
  console.log(this.name);
}, 1000);
```

---

### 5️⃣ forEach / map 콜백
```js
arr.forEach(function () {
  console.log(this);
});
```

- strict mode → undefined

---

### ⭕ 해결
```js
arr.forEach(() => {
  console.log(this);
});
```

또는

```js
arr.forEach(function () {
  console.log(this);
}, ctx);
```

---

## 📊 실무 선택 가이드

| 상황 | 권장 |
|---|---|
| 이벤트 핸들러 | wrapper + arrow |
| 클래스 메서드 | arrow field |
| 단발성 고정 | bind |
| 콜백 내부 | arrow |
| 성능 민감 루프 | function |

---

## ⚠️ 실무 주의사항

- render 루프 안에서 bind ❌
- arrow 메서드 남발 ❌ (인스턴스별 생성)
- removeEventListener 고려 없이 bind ❌

---

## 🔗 Day 36 / Day 35와의 연결
- Day 36: this 규칙과 우선순위
- Day 35: 이벤트 + 클로저 → cleanup 필수
- Day 37: 안전한 this 패턴 확정

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- this를 예측하지 않는다 → 판단한다
- arrow / bind를 목적에 맞게 선택한다
- 이벤트 생명주기까지 함께 설계한다

### 기른 역량
- this 관련 버그 즉시 진단
- 이벤트/클래스 설계 자신감
- React 클래스/훅 이해 가속

---

## ☑️ 체크리스트
- [ ] 이벤트에서 this가 무엇인지 즉시 말할 수 있는가
- [ ] 클래스 메서드 전달 시 안전한 패턴을 선택할 수 있는가
- [ ] arrow와 bind의 비용 차이를 알고 있는가

---

## 🎯 얻어가는 점
- this 공포 완전 제거
- 실무 패턴 기준 확립
- 이후 Prototype / Class 학습 준비 완료
