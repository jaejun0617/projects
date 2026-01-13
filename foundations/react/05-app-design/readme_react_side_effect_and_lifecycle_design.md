# React Side Effect & Lifecycle Design (실무 설계 기준)

> 이 문서는 useEffect 문법 설명서가 아니다.  
> **왜 Side Effect가 위험해지는지, 그리고 React가 이를 어떻게 통제하는지**를 설명한다.

---

## 🧭 이 챕터의 위치

- React Routing & Navigation Design **이후**
- 실전 React 앱 안정화 **핵심 단계**

즉,
- effect 사용 요령 ❌
- **렌더링과 부수 효과의 경계 설계** ✅

---

## 🎯 목표

- Side Effect의 정체를 정확히 정의한다
- 렌더 단계와 effect 단계의 책임을 분리한다
- 메모리 누수와 중복 실행을 예방한다

---

## 1. Side Effect란 무엇인가 (재정의)

### 정의

> **렌더링 결과 외부 세계에 영향을 주는 모든 동작**

- 네트워크 요청
- DOM 직접 접근
- 이벤트 등록
- 타이머 / 구독

👉 공통점: **렌더 계산에 포함되면 안 된다**

---

## 2. 왜 렌더 중 Effect가 위험한가

### 렌더의 본질

- 순수 계산
- 여러 번 호출 가능
- 중단/재시작 가능

👉 렌더 중 side effect 실행 = 예측 불가

---

## 3. useEffect의 역할

### 실무적 정의

> **렌더 결과가 확정된 이후 실행되는 부수 효과 실행기**

- 렌더 → 커밋 → effect

👉 effect는 결과에 반응한다

---

## 4. Lifecycle을 함수 관점에서 이해하기

| 단계 | 의미 |
|---|---|
| Render | UI 계산 |
| Commit | DOM 반영 |
| Effect | 외부 영향 |

클래스 생명주기 암기 불필요

---

## 5. 의존성 배열의 진짜 의미

```js
useEffect(() => {
  subscribe(id);
}, [id]);
```

- 언제 다시 실행할 것인가에 대한 선언
- **조건문이 아니다**

👉 숨기면 버그가 생긴다

---

## 6. Cleanup의 본질

```js
useEffect(() => {
  const unsub = subscribe();
  return () => unsub();
}, []);
```

### Cleanup은 무엇인가

> **이 effect가 더 이상 유효하지 않을 때의 정리 책임**

- 메모리 누수 방지
- 중복 구독 방지

---

## 7. 흔한 실패 패턴

### ❌ effect 안에서 상태 폭증

```js
useEffect(() => {
  setState(x + 1);
}, [x]);
```

- 무한 루프 위험

---

### ❌ cleanup 없는 이벤트

```js
window.addEventListener('resize', onResize);
```

- 누적 실행

---

## 8. Effect 설계 원칙

1. effect는 최소화
2. 렌더에 포함될 수 있으면 effect 아님
3. cleanup은 항상 고려

---

## 9. Strict Mode와 Effect

- 개발 환경에서 effect 2번 실행
- 목적: **안전하지 않은 effect 탐지**

👉 버그가 아니라 경고다

---

## 10. 실무 체크리스트

- [ ] 이 코드는 렌더 중 실행돼도 안전한가?
- [ ] effect의 의존성이 정확한가?
- [ ] cleanup이 필요한가?

---

## 🎯 이 챕터를 마치면

- effect를 두려워하지 않는다
- 무한 루프를 만들지 않는다
- 앱 안정성이 눈에 띄게 올라간다

---

## 다음 챕터 예고

> **React Form & Input State Design**  
> 입력은 왜 가장 복잡한 상태인가

---

**이 문서는 React 안정성 설계 기준 문서다.**

