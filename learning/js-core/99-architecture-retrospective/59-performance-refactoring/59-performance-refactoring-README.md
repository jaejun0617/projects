# Day 59 — Performance & Refactoring

## 🏷 Topic
Frontend Performance / Render Optimization / Refactoring Strategy / Structural Performance

## 🔎 관련 검색어
- frontend performance optimization
- avoid unnecessary re-render
- javascript refactoring strategy
- render optimization spa
- react performance mental model

---

## ✅ 한 줄 요약
성능 최적화는 속도를 빠르게 하는 일이 아니라  
**“쓸데없는 일을 안 하게 만드는 구조를 만드는 일”**이다.

---

## 📌 프로젝트 개요 (WHY)
Day 59는 새로운 기능을 추가하는 날이 아니다.  
**지금까지 만든 구조를 ‘오래 써도 망가지지 않게’ 다듬는 단계**다.

대부분의 성능 문제는:
- 알고리즘 ❌
- 브라우저 ❌
- 하드웨어 ❌

👉 **구조 설계 미흡 ⭕** 에서 발생한다.

---

## 🎯 미션 목표
- 불필요한 렌더가 발생하는 지점을 식별한다
- 상태 변경 범위를 최소화한다
- 이벤트/비동기 로직을 정리한다
- 리팩터링의 기준을 명확히 세운다

---

## 🧠 핵심 사고

### 1️⃣ 성능 문제의 80%는 구조 문제다
```txt
State 변경 → 전체 render
```

- 작은 상태 변경
- 큰 렌더 비용

👉 **렌더 범위 설계가 핵심**

---

### 2️⃣ 상태 변경은 “최소 단위”로
```js
store.set({ filter });
```

- 필요한 상태만 변경
- 관련 없는 UI 재계산 방지

---

### 3️⃣ 렌더는 비용이다
- render는 무료 ❌
- DOM 생성/교체는 항상 비용 ⭕

👉 **render 호출 횟수 = 성능 지표**

---

## 🧠 핵심 이론 보강

### 불필요한 렌더가 발생하는 원인
- 상태 객체를 통째로 교체
- render 함수 내부에서 계산 수행
- 이벤트마다 동일 연산 반복

---

### 해결 전략
| 문제 | 전략 |
|---|---|
| 전체 렌더 | 영역 분리 |
| 중복 계산 | 파생 상태 분리 |
| 이벤트 과다 | 위임 / throttle |
| 비동기 중첩 | cancel / disable |

---

## 🧩 리팩터링 기준

### 리팩터링 전 질문
- 이 상태 변경이 어떤 UI에 영향을 주는가?
- 이 render는 꼭 필요했는가?
- 계산 결과를 재사용할 수 있는가?

---

### 좋은 리팩터링의 특징
- 동작 동일
- 코드 감소
- 책임 명확화
- 성능 부수 효과

---

## 🧠 핵심 코드 스냅샷

### 파생 상태 분리
```js
const visibleTodos = getVisibleTodos(state);
```

---

### 이벤트 위임
```js
container.addEventListener('click', handler);
```

---

### 비동기 중복 방지
```js
if (state.loading) return;
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- render 호출 최소화
- 계산 로직 View 외부 이동
- 상태 변경 단위 축소

### 기른 역량
- 성능 병목 식별 능력
- 리팩터링 판단 기준
- React 성능 최적화 사전 감각

---

## ☑️ 체크리스트
- [ ] 렌더 비용을 의식하고 있는가
- [ ] 상태 변경 범위를 설명할 수 있는가
- [ ] 리팩터링 기준이 명확한가
- [ ] React 성능 문제를 예측할 수 있는가

---

## 🎯 얻어가는 점
- 성능은 나중 문제가 아니다
- 구조가 곧 성능이다
- 리팩터링은 감각이 아니라 기준이다
- 이제 “느린 코드”의 원인을 설명할 수 있다
