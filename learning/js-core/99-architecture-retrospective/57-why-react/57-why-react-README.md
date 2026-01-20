# Day 57 — 왜 React가 필요했는가

## 🏷 Topic
Why React / UI Abstraction / Declarative UI / React Motivation

## 🔎 관련 검색어
- why react is needed
- react vs vanilla js architecture
- declarative ui concept
- react problem it solves
- frontend framework necessity

---

## ✅ 한 줄 요약
React는 새로운 개념이 아니라  
**우리가 이미 만든 구조를 덜 힘들게 유지하기 위한 선택지**다.

---

## 📌 프로젝트 개요 (WHY)
Day 57은 React 문법을 배우는 날이 아니다.  
**“우리는 이미 React를 만들었는데, 왜 또 React가 필요한가?”**에 답하는 단계다.

Day 15–56 동안 우리는:
- 상태를 중심으로 UI를 만들었고
- 단방향 데이터 흐름을 지켰고
- Router, Store, View를 직접 설계했다

이 시점에서 React는  
**마법 같은 도구가 아니라, 구조적 피로를 줄여주는 도구**로 보이기 시작한다.

---

## 🎯 미션 목표
- 우리가 직접 만든 SPA 구조를 명확히 정리한다
- Vanilla JS 구조의 한계를 언어로 설명한다
- React가 해결하는 문제를 정확히 정의한다
- “왜 React를 선택하는가”를 설명할 수 있다

---

## 🧠 핵심 사고

### 1️⃣ 우리는 이미 React 사고를 하고 있었다
```txt
Event → State → Render → UI
```

이 흐름은 React의 핵심과 동일하다.

---

### 2️⃣ 문제는 “가능한가”가 아니라 “유지 가능한가”
Vanilla JS에서도:
- 상태 관리 ⭕
- 라우팅 ⭕
- 비동기 ⭕
- 컴포넌트 ⭕

👉 **다 가능하다**

하지만 규모가 커질수록:
- 렌더 호출 위치 증가
- 상태 동기화 부담 증가
- 파일 간 의존성 증가

---

### 3️⃣ React는 문제를 바꾼다
| 문제 | Vanilla JS | React |
|---|---|---|
| 상태 보관 | 직접 구현 | useState |
| 렌더 트리거 | 수동 | 자동 |
| DOM 업데이트 | 직접 관리 | Virtual DOM |
| 구조 유지 | 개발자 책임 | 프레임워크 책임 |

---

## 🧠 핵심 이론 보강

### Declarative UI의 의미
```jsx
return <Todo completed={true} />
```

- “어떻게 바꿀지” ❌
- “어떤 상태인가” ⭕

👉 UI를 **결과로 선언**한다.

---

### React가 제거해주는 것들
- render 호출 타이밍 고민
- DOM 업데이트 순서
- 상태 변경 후 동기화

👉 개발자는 **상태 설계에만 집중**

---

## 🧩 우리가 만든 구조 vs React

### 우리가 만든 것
```js
store.set({ filter: 'completed' });
render();
```

### React에서
```js
setFilter('completed');
```

👉 **개념은 동일, 책임만 이동**

---

## ⚙️ 구현 기준 & 기른 역량

### 깨달은 기준
- React는 필수가 아니다
- 하지만 규모가 커질수록 필요해진다
- React는 구조를 “대체”하지 않는다
- 구조를 “자동화”한다

### 기른 역량
- 프레임워크 선택 기준 확립
- React를 비판적으로 바라보는 시야
- “왜 쓰는지 설명 가능한 개발자” 상태 도달

---

## ☑️ 체크리스트
- [ ] React 없이도 SPA 구조를 설명할 수 있는가
- [ ] Vanilla JS 구조의 한계를 말할 수 있는가
- [ ] React가 해결하는 문제를 정확히 말할 수 있는가
- [ ] React를 선택하는 이유를 설명할 수 있는가

---

## 🎯 얻어가는 점
- React는 학습 대상이 아니라 선택지다
- 우리는 이미 React의 본질을 경험했다
- 이제 React 문법은 **이해 기반 학습**이 된다
- 다음 단계는 Hook 사고로의 자연스러운 연결이다
