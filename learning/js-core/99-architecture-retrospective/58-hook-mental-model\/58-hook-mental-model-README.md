# Day 58 — Hook 사고 미리보기

## 🏷 Topic
React Hooks Mental Model / useState / useEffect / Closure & Lifecycle

## 🔎 관련 검색어
- react hooks mental model
- usestate useeffect explained
- closure in react hooks
- react lifecycle vs useeffect
- hooks architecture thinking

---

## ✅ 한 줄 요약
Hook은 문법이 아니라  
**우리가 이미 쓰고 있던 상태·클로저·라이프사이클 사고를 함수로 고정한 규칙**이다.

---

## 📌 프로젝트 개요 (WHY)
Day 58은 Hook 문법을 외우는 날이 아니다.  
**“왜 React는 이런 형태의 API를 선택했는가”를 이해하는 단계**다.

우리는 이미:
- 상태를 Store로 관리했고
- 렌더 타이밍을 고민했고
- 이벤트/비동기/클로저 문제를 직접 겪었다

Hook은 이 문제들을  
**개발자가 실수하지 않도록 강제한 인터페이스**다.

---

## 🎯 미션 목표
- Hook을 기능이 아닌 사고 모델로 이해한다
- useState / useEffect의 본질을 설명한다
- Closure / Async / Event와 Hook의 연결을 이해한다
- React 학습 진입 장벽을 제거한다

---

## 🧠 핵심 사고

### 1️⃣ useState = 상태 소유권 고정
```js
const [count, setCount] = useState(0);
```

- 전역 상태 ❌
- 임의 객체 ❌
- **렌더 사이에 유지되는 상태 슬롯 ⭕**

👉 우리가 만든 `store.state`의 축소판이다.

---

### 2️⃣ Hook은 클로저 위에서 동작한다
```js
function Component() {
  let count = 0;
}
```

React는 이 함수를:
- 매 렌더마다 다시 실행
- **상태는 클로저로 유지**

👉 Closure 개념 없이는 Hook을 이해할 수 없다.

---

### 3️⃣ useEffect = 라이프사이클 + cleanup
```js
useEffect(() => {
  subscribe();
  return () => unsubscribe();
}, []);
```

- mount
- update
- unmount

👉 우리가 Day 45에서 직접 구현했던 패턴의 공식화다.

---

## 🧠 핵심 이론 보강

### 왜 Hook은 조건문 안에서 쓰면 안 되는가
- Hook은 **호출 순서**로 상태를 매핑
- 조건문 → 순서 깨짐 → 상태 꼬임

👉 규칙이 아니라 **구조적 필요**

---

### Async & Effect의 관계
- Effect는 비동기를 직접 관리하지 않는다
- **비동기 시작/종료 시점만 관리**

👉 Day 46–48의 Async Control 개념 그대로다.

---

## 🧩 사고 구조 비교

### 우리가 직접 만든 구조
```txt
Event → State → Render
```

### Hook 기반 React
```txt
Event → setState → Re-render → Effect
```

👉 동일한 흐름을 더 안전하게 고정

---

## ⚙️ 구현 기준 & 기른 역량

### 사고 기준
- Hook은 편의 기능이 아니다
- 실수를 방지하는 구조적 장치다
- Closure 이해가 선행 조건이다

### 기른 역량
- Hook API를 외우지 않고 이해
- React 내부 동작 추론 가능
- useEffect 남용 방지 감각 확보

---

## ☑️ 체크리스트
- [ ] useState를 상태 슬롯으로 설명할 수 있는가
- [ ] Hook과 Closure의 관계를 설명할 수 있는가
- [ ] useEffect의 cleanup 이유를 설명할 수 있는가
- [ ] Hook 규칙의 이유를 이해했는가

---

## 🎯 얻어가는 점
- Hook은 새로운 개념이 아니다
- 우리가 이미 겪은 문제의 해답이다
- 이제 React 문법은 “설명 가능한 코드”가 된다
- 다음 단계는 성능과 리팩터링 관점이다
