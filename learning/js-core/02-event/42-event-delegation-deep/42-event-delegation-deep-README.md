# Day 42 — Event Delegation 심화 (Deep)

## 🏷 Topic
Event Delegation Deep / Bubbling vs Capture / stopPropagation / Event Architecture

## 🔎 관련 검색어
- event delegation deep dive
- stopPropagation use cases
- event bubbling vs capture
- closest event delegation
- dom event architecture

---

## ✅ 한 줄 요약
이벤트 위임은 편의 기술이 아니라 **버블링을 전제로 한 아키텍처 선택**이며, 깨질 수 있다는 사실까지 설계에 포함해야 한다.

---

## 📌 프로젝트 개요 (WHY)
Day 42는 “이벤트 위임을 쓴다”에서 끝나지 않는다.  
**언제 위임이 깨지고, 왜 깨지며, 어떻게 통제하는지**를 실험으로 체득하는 단계다.

Day 41에서 우리는:
- 단일 루트 리스너
- data-action 기반 의미 해석
- state → render 흐름

을 만들었다.

Day 42의 질문은 이것이다.

> “이 구조는 언제 실패하는가?”

---

## 🎯 미션 목표
- 버블링과 캡처의 실행 순서를 실제로 확인한다
- stopPropagation이 위임에 미치는 영향을 이해한다
- closest()가 왜 필수인지 체감한다
- 위임이 안전하게 유지되는 조건을 정리한다

---

## 🧠 핵심 사고

### 1) Event Delegation은 버블링 전제다
위임은 **캡처 단계에서는 성립하지 않는다**.  
target에서 발생한 이벤트가 부모로 전파되어야만 중앙에서 처리할 수 있다.

---

### 2) stopPropagation은 구조를 끊는다
`stopPropagation()`은 단순한 이벤트 제어가 아니라  
**이벤트 아키텍처를 끊는 행위**다.

- 특정 컴포넌트 보호 ⭕
- 전체 위임 구조 파괴 ❌

---

### 3) closest()는 위임의 안전벨트
실제 클릭 대상은 버튼 내부 아이콘/텍스트일 수 있다.  
`closest()` 없이는 “어느 아이템의 이벤트인지” 보장할 수 없다.

---

## 🧠 핵심 이론 보강

### Bubbling vs Capture
- **Capture**: document → target
- **Bubble**: target → document

위임은 **Bubble 단계**를 사용한다.

---

### target / currentTarget
- `target` : 실제 클릭된 요소
- `currentTarget` : 리스너가 붙은 요소

위임 구조에서는 항상 `target`을 기준으로 해석한다.

---

## 🧩 상태 모델
```js
let items = [];
let nextId = 1;
```

```js
{ id: number, text: string, done: boolean }
```

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 단일 루트 리스너 + 위임
```js
document.addEventListener('click', rootHandler, useCapture);
```

---

### 2️⃣ 의미 해석은 data-action
```js
const action = e.target.dataset.action;
if (!action) return;
```

---

### 3️⃣ closest로 컨텍스트 확보
```js
const itemEl = e.target.closest('.item');
```

---

### 4️⃣ 의도적 파손 실험
```js
e.stopPropagation();
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 리스너 수는 고정
- 위임 구조는 버블링 전제
- stopPropagation은 명확한 이유 있을 때만 사용

### 기른 역량
- 이벤트 흐름 디버깅 능력
- 위임 구조의 한계 인식
- SPA 이벤트 설계 기반 확보

---

## 📂 파일 구조
```
42-event-delegation-deep/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] 캡처/버블 실행 순서를 설명할 수 있는가
- [ ] stopPropagation의 영향 범위를 알고 있는가
- [ ] closest 없이 위임이 불안정한 이유를 이해했는가
- [ ] 동적 요소에서도 이벤트가 유지되는가

---

## 🎯 얻어가는 점
- 이벤트는 기능이 아니라 **흐름**
- 위임은 자동 해결책이 아니라 **조건부 전략**
- 이후 Form / SPA 이벤트 설계의 기준 확보
