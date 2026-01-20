# Day 56 — State Architecture 정리 (Phase 5 시작)

## 🏷 Topic
State Architecture / Unidirectional Data Flow / Store Pattern / UI Architecture

## 🔎 관련 검색어
- unidirectional data flow frontend
- state architecture vanilla js
- single source of truth ui
- store pattern javascript
- frontend architecture explanation

---

## ✅ 한 줄 요약
상태 아키텍처란  
**“데이터가 어디서 태어나고, 어떻게 흐르고, 어디서 소비되는지”를 규칙으로 만드는 일**이다.

---

## 📌 프로젝트 개요 (WHY)
Day 56은 새로운 코드를 만드는 날이 아니다.  
**Day 15–55 동안 만들었던 모든 구조를 하나의 아키텍처 언어로 정리하는 단계**다.

지금까지 우리는 이미:
- 상태를 만들었고
- 상태로 UI를 그리고
- 상태를 URL·비동기·이벤트와 연결했다

이제 필요한 것은  
👉 **“이 구조를 설명할 수 있는 언어”**다.

---

## 🎯 미션 목표
- 단방향 데이터 흐름을 명확히 정의한다
- Store / View / Event의 책임을 분리해 설명한다
- 지금까지 만든 SPA 구조를 말로 설명할 수 있다
- React 아키텍처와 연결될 준비를 마친다

---

## 🧠 핵심 사고

### 1️⃣ 단방향 데이터 흐름 (Unidirectional Flow)
```
Event → State → Render → UI
```

- UI가 상태를 바꾸지 않는다
- 상태 변경이 항상 **출발점**
- UI는 결과만 표현

👉 이 규칙이 깨지면 디버깅이 불가능해진다.

---

### 2️⃣ Single Source of Truth
```js
store.state
```

- 상태는 한 곳에만 존재
- 여러 컴포넌트가 같은 상태를 복사 ❌
- 모든 View는 동일한 상태를 바라본다 ⭕

---

### 3️⃣ 상태는 UI보다 먼저 설계한다
- 화면부터 그린다 ❌
- 상태 모델부터 정의 ⭕

UI는 상태의 **시각적 결과물**일 뿐이다.

---

## 🧩 상태 아키텍처 모델

```txt
[ User Event ]
      ↓
[ Action / Handler ]
      ↓
[ Store (State) ]
      ↓
[ Render Function ]
      ↓
[ View (DOM) ]
```

이 구조는:
- Vanilla JS
- React
- Vue
- Svelte

모두 동일하다.

---

## 🧠 핵심 이론 보강

### Store의 책임
- 상태 소유
- 상태 변경
- 렌더 트리거

```js
store.set(nextState)
```

---

### View의 책임
- 상태 해석
- DOM 생성
- 직접 상태 변경 ❌

---

### Event의 책임
- 사용자 의도 전달
- 상태 변경 요청
- 로직 포함 ❌

---

## 🧠 핵심 코드 스냅샷

### Store 패턴
```js
const store = {
  state: {},
  set(next) {
    this.state = { ...this.state, ...next };
    render();
  }
};
```

---

### Render의 역할
```js
function render() {
  View(store.state);
}
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 상태 직접 변경 금지
- render는 상태 결과만 사용
- 이벤트는 상태 변경 요청만 수행

### 기른 역량
- 프론트엔드 아키텍처 설명 능력
- 단방향 데이터 흐름 이해
- React 아키텍처 선행 학습 완료

---

## 📂 파일 구조 (개념 기준)
```
/store
/views
/router
/main
```

---

## ☑️ 체크리스트
- [ ] 단방향 데이터 흐름을 설명할 수 있는가
- [ ] Store / View / Event 역할을 구분하는가
- [ ] 상태 중심으로 UI를 설명할 수 있는가
- [ ] React 구조와 연결해서 설명할 수 있는가

---

## 🎯 얻어가는 점
- 프론트엔드는 “화면 개발”이 아니다
- 상태 흐름을 설계하는 일이다
- React는 새로운 개념이 아니라 **이 구조의 구현체**다
- 이제 Phase 5를 시작할 준비가 끝났다
