# Day 45 — Event Lifecycle & Cleanup

## 🏷 Topic
Event Lifecycle / Mount & Unmount / Cleanup / Memory Leak Prevention

## 🔎 관련 검색어
- javascript event cleanup
- event listener memory leak
- mount unmount lifecycle
- removeEventListener best practice
- useEffect cleanup concept

---

## ✅ 한 줄 요약
이벤트는 “추가하는 순간”보다 **제거하지 않았을 때** 문제가 된다.  
UI의 생명주기와 이벤트의 생명주기는 반드시 함께 관리되어야 한다.

---

## 📌 프로젝트 개요 (WHY)
Day 45는 새로운 UI를 만드는 날이 아니다.  
**이미 만든 UI가 시간이 지날수록 왜 망가지는지**를 직접 재현하고 이해하는 단계다.

SPA 환경에서는:
- 화면은 사라지지만
- 이벤트는 남아 있는 경우가 많다

이 Day의 목적은 다음 질문에 답하는 것이다.

> “이 뷰가 사라질 때,  
> 이 이벤트도 함께 사라지고 있는가?”

---

## 🎯 미션 목표
- View의 Mount / Unmount 개념을 체감한다
- 이벤트 리스너 중복 등록 문제를 재현한다
- Cleanup 유무에 따른 동작 차이를 비교한다
- 이벤트 누수가 왜 버그로 이어지는지 이해한다

---

## 🧠 핵심 사고

### 1️⃣ View와 Event는 같은 생명주기를 가져야 한다
```js
mountView()
unmountView()
```

- View가 생길 때 이벤트를 등록하고
- View가 사라질 때 이벤트를 제거한다

👉 이 두 동작은 항상 **쌍(pair)** 으로 설계되어야 한다.

---

### 2️⃣ Cleanup이 없으면 “보이지 않는 중복”이 생긴다
```js
btn.addEventListener('click', onCountClick);
```

이 줄은 실행될 때마다:
- 새로운 리스너를 하나 더 쌓는다
- 이전 리스너를 덮지 않는다

👉 결과는 **한 번 클릭에 여러 번 실행**

---

### 3️⃣ 문제는 즉시 드러나지 않는다
- 처음엔 정상
- 화면 전환 몇 번 뒤부터 이상 행동
- 디버깅 난이도 급상승

👉 그래서 Cleanup은 **사전 설계 요소**다.

---

## 🧠 핵심 이론 보강

### addEventListener는 “누적”이다
- 같은 핸들러라도
- 제거하지 않으면 계속 남는다

---

### removeEventListener의 조건
```js
btn.removeEventListener('click', onCountClick);
```

- 동일한 함수 참조 필요
- 익명 함수 사용 ❌
- 그래서 handler를 분리한다

---

### Cleanup 함수 패턴
```js
cleanupFn = () => {
  btn.removeEventListener('click', onCountClick);
};
```

👉 React `useEffect` cleanup과 동일한 사고 구조

---

## 🧩 상태 모델
```js
let mounted = false;
let count = 0;
let cleanupFn = null;
```

- mounted : View 존재 여부
- count : UI 상태
- cleanupFn : 정리 로직 저장소

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ Mount 시 이벤트 등록
```js
btn.addEventListener('click', onCountClick);
cleanupFn = () => {
  btn.removeEventListener('click', onCountClick);
};
```

---

### 2️⃣ Unmount 시 Cleanup 실행
```js
if (useCleanup && cleanupFn) {
  cleanupFn();
}
```

---

### 3️⃣ Cleanup 미실행 시 문제 재현
```js
log('⚠️ cleanup skipped');
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 이벤트 등록과 제거를 항상 세트로 설계
- Cleanup 함수는 명시적으로 관리
- View 전환 시 이벤트 상태를 점검

### 기른 역량
- 이벤트 누수 원인 파악 능력
- SPA 기반 사고 준비
- React useEffect cleanup 개념 선이해

---

## 📂 파일 구조
```
45-event-lifecycle-cleanup/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] Mount / Unmount 개념을 설명할 수 있는가
- [ ] 이벤트 중복 실행 원인을 이해했는가
- [ ] removeEventListener 조건을 알고 있는가
- [ ] Cleanup이 왜 필수인지 설명할 수 있는가

---

## 🎯 얻어가는 점
- 이벤트는 영구적이지 않다
- UI 수명 = 이벤트 수명
- Cleanup 없는 코드는 잠재적 버그다
- 이후 SPA / React에서 생명주기 사고를 자연스럽게 연결할 수 있다
