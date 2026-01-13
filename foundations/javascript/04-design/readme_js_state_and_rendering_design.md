# JavaScript State & Rendering Design (Pre-React 사고 체계)

> 이 문서는 React 문법을 가르치지 않는다.  
> **React가 왜 그렇게 설계될 수밖에 없었는지**를 JavaScript 관점에서 설명한다.

---

## 🧭 이 챕터의 위치

- JavaScript 실행 모델 / 비동기 / 에러 설계 **이후**
- React 학습 **직전 필수 단계**

즉,
- useState / useEffect를 외우기 전
- **상태와 UI의 관계를 먼저 고정**하는 단계

---

## 🎯 목표

- UI를 **명령이 아닌 결과**로 바라본다
- DOM 조작 중심 사고에서 **상태 중심 사고**로 전환한다
- 렌더링이 왜 반복되어도 안전해야 하는지 이해한다

---

## 1. 기존 JS 사고의 한계

### 전통적인 접근 (명령형)

```js
button.addEventListener('click', () => {
  modal.style.display = 'block';
});
```

### 문제점

- 현재 UI 상태를 코드가 기억해야 함
- 상태가 늘어날수록 분기 폭발
- 비동기 + UI 결합 시 복잡도 급증

👉 **UI가 코드의 결과가 아니라 코드의 대상이 된다**

---

## 2. 상태(State)란 무엇인가

### 실무 정의

> **UI를 결정하는 최소한의 데이터 집합**

- boolean 하나
- 숫자 하나
- 객체 하나

이 상태가 바뀌면
→ **UI는 다시 계산되어야 한다**

---

## 3. 상태와 렌더링의 관계

### 핵심 공식

```
UI = f(State)
```

- UI는 상태의 함수다
- UI를 직접 조작하지 않는다

👉 바뀌는 건 **상태**고, UI는 항상 결과

---

## 4. 잘못된 패턴

```js
if (isOpen) {
  modal.style.display = 'block';
}
```

- 상태와 DOM이 이중 관리됨
- 어느 쪽이 진짜인지 불분명

---

## 5. 올바른 사고 전환

```js
const state = { isOpen: true };
render(state);
```

```js
function render(state) {
  modal.style.display = state.isOpen ? 'block' : 'none';
}
```

- 상태는 단 하나의 진실
- render는 **순수 함수에 가깝게** 유지

---

## 6. 렌더링은 왜 여러 번 일어나야 하는가

### 오해
- 렌더링 = 무겁다

### 실제
- 렌더링은 **계산**이다
- DOM 변경이 비싼 것

👉 그래서 React는 **Virtual DOM**을 선택했다

---

## 7. 상태 설계의 핵심 원칙

### 1️⃣ 최소 상태
- 계산 가능한 값은 상태로 두지 않는다

### 2️⃣ 단방향 흐름
- 상태 → UI
- UI → 이벤트 → 상태 변경

### 3️⃣ 상태는 항상 실패 가능
- loading / success / error

---

## 8. 비동기와 상태

```js
state = { status: 'loading' };
render(state);
```

```js
state = { status: 'success', data };
render(state);
```

- 비동기는 **상태 전이 문제**다
- fetch는 상태를 채우는 수단일 뿐

---

## 9. 이 사고가 React로 연결되는 지점

- useState → 상태의 캡슐화
- re-render → 상태 변경의 결과
- useEffect → 상태 변화에 따른 부수 효과

👉 문법이 아니라 **필연적 구조**다

---

## 🎯 이 챕터를 마치면

- DOM을 직접 만질 이유가 사라진다
- 렌더링을 두려워하지 않는다
- React 문법이 설명처럼 느껴진다

---

## 다음 챕터 예고

> **Fetch & HTTP Design**  
> 네트워크 결과를 어떻게 상태로 바꾸는가

---

**이 문서는 React 학습 전에 반드시 거쳐야 하는 사고 체계 문서다.**