# Day 34 — Closure 실전 패턴 (Practical Patterns)

## 🏷 Topic
Closure Patterns / State Encapsulation / Factory Function / Store Pattern

## 🔎 관련 검색어
- javascript closure patterns
- factory function vs class
- private state javascript
- closure store pattern
- javascript state encapsulation

---

## ✅ 한 줄 요약
Closure는 문법이 아니라 **상태를 안전하게 캡슐화하기 위한 설계 패턴의 집합**이다.

---

## 📌 프로젝트 개요 (WHY)
Day 34는 Closure를 “이해했다”에서 끝내지 않고,  
**실제 코드 설계에서 언제 어떤 형태로 써야 하는지 판단 기준을 세우는 단계**다.

Day 33에서 우리는 다음을 확정했다.
- 상태는 변수에 있는 게 아니라 스코프에 있다
- 참조가 남아 있으면 상태는 유지된다

Day 34의 목적은 이 질문에 답하는 것이다.

> “이 상황에서 어떤 클로저 구조를 써야  
> 코드가 단순해지고, 상태가 안전해질까?”

---

## 🎯 미션 목표
- 대표적인 Closure 패턴 4가지를 구분한다
- 각 패턴의 **사용 시점 / 장단점**을 설명한다
- 전역 변수 없이 상태를 설계하는 감각을 만든다
- Class 이전 단계의 상태 설계 능력을 확보한다

---

## 🧠 핵심 사고

### 1. Closure는 ‘기억’이 아니라 ‘접근 제한 구조’
- 중요한 것은 값이 살아 있는 것 ❌
- **어디서 접근 가능한지**가 핵심 ⭕

👉 Closure = 상태 접근 범위를 통제하는 장치

---

### 2. 패턴은 문제 유형에 따라 선택한다
Closure를 무조건 쓰는 게 아니라,  
**상태의 성격**에 따라 패턴을 고른다.

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ Counter 패턴 (누적 상태)

#### 언제 사용?
- 증가 / 감소
- 횟수 누적
- 호출 카운트

```js
function createCounter(initial = 0) {
  let count = initial;

  return {
    inc() {
      count++;
      return count;
    },
    dec() {
      count--;
      return count;
    },
    get() {
      return count;
    },
  };
}
```

**특징**
- 단일 숫자 상태
- 외부 접근 차단
- 가장 단순한 Closure 활용

---

### 2️⃣ Toggle 패턴 (Boolean 상태)

#### 언제 사용?
- 열림 / 닫힘
- 활성 / 비활성
- on / off

```js
function createToggle(initial = false) {
  let on = initial;

  return {
    toggle() {
      on = !on;
      return on;
    },
    isOn() {
      return on;
    },
  };
}
```

**특징**
- Boolean 상태에 최적
- UI 상태 관리에 자주 사용

---

### 3️⃣ Factory 패턴 (상태 + 행동 묶기)

#### 언제 사용?
- 아이템 단위 상태
- 여러 인스턴스 생성
- 클래스 대체 용도

```js
function createTodo(text) {
  let completed = false;

  return {
    getText() {
      return text;
    },
    toggle() {
      completed = !completed;
      return completed;
    },
    isCompleted() {
      return completed;
    },
  };
}
```

**특징**
- 객체처럼 사용
- 상태는 여전히 스코프에 존재
- class 없이 캡슐화 가능

---

### 4️⃣ Store 패턴 (전역 상태 원형)

#### 언제 사용?
- 앱 전역 상태
- 여러 구독자 필요
- 상태 변경 감지

```js
function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(next) {
    state = next;
    listeners.forEach(fn => fn(state));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return { getState, setState, subscribe };
}
```

**특징**
- 상태 은닉
- 변경 알림 구조
- Redux / Zustand의 개념적 출발점

---

## 📊 패턴 선택 가이드

| 문제 유형 | 권장 패턴 | 이유 |
|---|---|---|
| 숫자 누적 | Counter | 단순·명확 |
| Boolean UI | Toggle | 의도 명확 |
| 개별 아이템 | Factory | 인스턴스 분리 |
| 앱 전역 | Store | 상태 집중 관리 |

---

## ⚠️ 흔한 실수와 주의점

- ❌ 모든 상태를 Closure로 해결하려는 습관
- ❌ 불필요한 함수 재생성
- ❌ 참조 해제 없이 이벤트에 바인딩

👉 **필요한 곳에만 사용**

---

## 🔗 다음 단계와의 연결
- Day 35: Closure + 메모리 관리 (누수 포인트)
- Day 36~37: this 바인딩 (Closure와 차이 비교)
- Day 41~: DOM 이벤트 구조에서 Closure 실전 사용

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 전역 상태 제거
- 상태 접근 인터페이스 명확화
- 패턴 선택 이유를 설명할 수 있을 것

### 기른 역량
- Closure를 설계 도구로 사용하는 능력
- Class 이전 단계의 상태 설계 감각
- React/Store 패턴 이해 기반

---

## ☑️ 체크리스트
- [ ] 상황별 Closure 패턴을 구분할 수 있는가
- [ ] 왜 이 패턴을 선택했는지 설명할 수 있는가
- [ ] 전역 변수 없이 상태를 유지할 수 있는가

---

## 🎯 얻어가는 점
- Closure는 트릭이 아니라 **구조적 선택**
- 상태 설계의 선택지가 명확해짐
- 이후 Class / Store / Hook 이해가 쉬워짐
