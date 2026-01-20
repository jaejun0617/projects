# Day 33 — Closure (상태를 기억하는 함수)

## 🏷 Topic
Closure / Lexical Environment / Private State / Factory Pattern

## 🔎 관련 검색어
- javascript closure explained
- lexical environment closure
- private state with closure
- factory function closure pattern
- closure memory reference

---

## ✅ 한 줄 요약
Closure는 문법이 아니라 **함수가 자신의 렉시컬 환경을 참조해 상태를 유지하는 구조**다.

---

## 📌 프로젝트 개요 (WHY)
Day 33은 “클로저 문법”을 배우는 날이 아니다.  
지금까지 다뤄온 **state가 어디에 저장되고 왜 유지되는지**를 언어 내부 원리로 확정하는 단계다.

Day 15~30에서 우리는 상태를 이렇게 다뤘다.

- `items` 같은 상태를 변경하고
- `render()`로 UI를 업데이트하며
- LocalStorage/Undo 같은 확장을 했다

그런데 핵심 질문은 남아 있다.

> “함수가 끝났는데,  
> 왜 그 안의 값은 계속 살아 있는가?”

이 질문의 답이 Closure다.

---

## 🎯 미션 목표
- Closure를 “현상”이 아니라 “구조”로 설명한다
- 실행 컨텍스트 종료 이후에도 값이 유지되는 이유를 이해한다
- 클로저를 이용해 **Private State(은닉 상태)** 를 만든다
- 전역 상태가 아닌 **캡슐화된 상태 설계**로 연결한다

---

## 🧠 핵심 사고

### 1. Closure의 정확한 정의
> **함수가 자신이 정의된 렉시컬 환경(Lexical Environment)을 기억하고  
> 그 환경에 접근할 수 있는 구조**

- 함수 호출 위치 ❌
- 함수 정의 위치 ⭕

---

### 2. “함수 종료 = 값 소멸”이 아니다
실행 컨텍스트는 종료되지만,
그 안의 렉시컬 환경이 **참조되고 있다면** 메모리는 유지된다.

👉 **참조가 남아 있으면 해제되지 않는다**

---

### 3. Closure는 상태를 숨기는 가장 강력한 방법
- 변수는 외부에서 직접 접근 불가
- 함수(인터페이스)로만 상태 접근 가능

👉 이것이 **Private State**다.

---

## 🧩 상태 모델 (Closure 관점)
```text
State는 변수에 저장되는 게 아니라,
‘스코프(렉시컬 환경)’에 저장된다.
```

- State = Lexical Environment 내부 값
- UI/로직은 그 값에 접근하는 함수들의 집합

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ Closure가 없는 상태 (상태 유지 실패)
```js
function countUp() {
  let count = 0;
  count++;
  return count;
}

countUp(); // 1
countUp(); // 1
```

- 매 호출마다 `count`가 새로 생성된다
- 상태가 누적되지 않는다

---

### 2️⃣ Closure의 최소 형태 (상태 유지 성공)
```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();

counter(); // 1
counter(); // 2
counter(); // 3
```

**핵심**
- createCounter는 종료됨
- 하지만 내부 함수가 `count`를 참조 중
- `count`가 살아남아 누적된다

---

### 3️⃣ Private State (은닉 상태)
```js
function createSecret() {
  let secret = 'password';

  return {
    get() {
      return secret;
    },
    set(v) {
      secret = v;
    },
  };
}

const vault = createSecret();

vault.get();      // 'password'
vault.set('1234');
vault.get();      // '1234'
```

- `secret` 직접 접근 불가
- get/set 함수가 상태의 “공식 인터페이스”

---

### 4️⃣ 상태 캡슐화 스토어 패턴 (State App 연결)
```js
function createStore(initial) {
  let state = initial;

  function getState() {
    return state;
  }

  function setState(next) {
    state = next;
  }

  return { getState, setState };
}

const store = createStore([{ id: 1, text: 'A' }]);
store.getState();
store.setState([{ id: 1, text: 'B' }]);
```

👉 Day 15~29에서 했던 전역 state를  
**스토어(closure)로 감싸는 원형**이다.

---

## ⚠️ 흔한 오해 정리

| 오해 | 실제 |
|---|---|
| 함수가 return되어야 클로저가 생긴다 | return은 흔한 형태일 뿐, 핵심은 “참조 유지” |
| 클로저는 특별한 문법이다 | 문법이 아니라 “렉시컬 환경 참조 구조” |
| 클로저는 무조건 느리다 | 설계 문제이며 필요할 때 쓰면 된다 |
| 호출 위치가 스코프를 결정한다 | 정의 위치(렉시컬)가 결정한다 |

---

## 🔗 Day 31~32와의 연결
- Day 31: 스코프는 정의 시점(렉시컬)
- Day 32: Creation Phase가 식별자 구조를 만든다
- **Day 33: 그 구조가 “상태 유지”로 확장된다**

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 전역 변수 대신 함수 스코프에 상태를 둔다
- 상태 접근은 인터페이스 함수로만 한다
- “상태 유지”를 DOM/저장소가 아닌 스코프로 해결한다

### 기른 역량
- 상태의 메모리 생존 원리 이해
- 캡슐화 설계(Private State) 습득
- React Hook / Store 패턴의 기반 확보

---

## 📂 파일 구조 (개념적)
```
closure/
├─ createCounter.js
├─ createSecret.js
└─ createStore.js
```

---

## ☑️ 체크리스트
- [ ] 클로저를 “정의”로 설명할 수 있는가
- [ ] 실행 컨텍스트 종료 후에도 값이 유지되는 이유를 말할 수 있는가
- [ ] 전역 변수 없이 상태를 캡슐화할 수 있는가
- [ ] 클로저가 Day 15~29 상태 설계와 연결된다는 걸 설명할 수 있는가

---

## 🎯 얻어가는 점
- 상태는 “변수”가 아니라 **스코프에 살아 있는 값**
- Closure는 “기억”이 아니라 **참조 구조**
- 이후 Day 34~35에서 Closure를 실전 패턴으로 굳힌다
