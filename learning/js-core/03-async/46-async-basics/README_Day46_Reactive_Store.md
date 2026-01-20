# Day 46 — State Management Pattern  
**Mon, Feb 9, 2026**

상태(데이터)가 변하면 화면이 자동으로 바뀌는 **'반응형 스토어'** 기초 구현

---

## 🧠 오늘의 핵심 요약 (한 줄)
> **상태 관리의 본질 = “상태가 바뀌면, 그 상태를 구독한 UI가 자동으로 다시 그려지게 만든다.”**

---

## 🎯 미션 목표
- **Observer Pattern**의 구조를 코드로 구현한다
- **Pub/Sub** 개념을 구분해서 이해한다
- `updateState()`로 상태 변경 시 **구독자(렌더 함수)**가 자동 실행되게 만든다
- 버튼 클릭 → 상태 증가 → 화면 자동 업데이트 흐름을 완성한다

---

## 📌 왜 이걸 배우는가 (실무 관점)
UI는 “데이터를 보여주는 뷰(View)”다.  
문제는 데이터가 바뀔 때마다 UI를 **수동으로** 바꾸면 코드가 폭발한다.

- 어디서 상태가 바뀌는지 추적이 어려움
- UI 업데이트를 빼먹기 쉬움
- 화면과 데이터가 쉽게 불일치함

그래서 실무는 대부분 아래 구조로 간다:

- 상태를 중앙에서 관리(Store)
- 상태 변경은 한 통로(Set/Dispatch)
- 상태가 바뀌면 구독한 화면이 자동 업데이트(Reactive)

Redux / Zustand / Vuex / Pinia도 결국 이 원리의 확장판이다.

---

## 🧩 핵심 이론 정리

### 1️⃣ State(상태)란?
- 앱의 “현재 데이터” 전체
- 예: 카운터 값, 로그인 유저, 장바구니 목록, 필터 값…

상태는 **원인**, UI는 **결과**로 보는 게 핵심이다.

---

### 2️⃣ Observer Pattern (옵저버 패턴)
**정의**
- 어떤 대상(Subject)의 변화가 생기면
- 그 대상을 지켜보는 관찰자(Observer)들에게 **자동으로 알린다**

**구성 요소**
- Subject: 상태를 가진 주체(Store)
- Observers: 상태 변경 시 실행될 함수들(렌더러, 핸들러)

**핵심 장점**
- 상태 변경 로직과 UI 업데이트 로직을 분리할 수 있음

---

### 3️⃣ Pub/Sub (발행-구독)
Observer와 비슷하지만 **중간에 브로커(이벤트 버스)가 낀다**는 점이 핵심이다.

- Publisher(발행자): “이벤트/메시지 발행”
- Subscriber(구독자): “특정 이벤트를 구독”
- Broker(중개자): 구독 목록을 관리하고 전달

> 오늘 미션은 “Store가 직접 구독자를 관리”하므로 **Observer에 가깝다**.  
> 다만, 설계 관점에서는 Pub/Sub 형태로 확장 가능하다.

---

### 4️⃣ 반응형(Reactive)의 정확한 의미
**내가 DOM을 직접 바꾸는 게 아니라**  
“상태만 바꾸면 화면은 따라오게” 만드는 방식.

즉,
- 개발자가 하는 일: `setState()` (상태 변경)
- 시스템이 하는 일: 구독자 실행 → 렌더 업데이트

---

## ⚠️ 실무에서 망하는 포인트 (핵심 개념 보강)

### A) “상태 변경”과 “렌더링”을 한 곳에서 섞지 말 것
나쁜 예:
- 버튼 클릭 이벤트 안에서 DOM 직접 조작 + 상태 조작 동시에 함

좋은 예:
- 이벤트는 상태만 바꿈
- UI는 구독자로 자동 갱신

---

### B) 구독(Observer)이 늘어날수록 중요해지는 규칙
- “상태 변경 시 notify는 항상 실행되어야 한다”
- 상태는 외부에서 마음대로 바꾸게 두면 디버깅 불가능
  - 그래서 `updateState()` 같은 단일 통로가 필요

---

### C) 구독 해제(unsubscribe) 개념도 결국 필요해진다
오늘 미션에서는 생략 가능하지만,
실무에서는 컴포넌트가 사라질 때 구독을 해제하지 않으면
- 메모리 누수
- 중복 렌더
- 이벤트 중복 실행
이 발생한다.

---

## 🏗️ 미션 구현 (단일 HTML + script)

### ✅ index.html (한 파일로 완성)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reactive Store - Day 46</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
    .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; max-width: 420px; }
    #counter-display { font-size: 40px; font-weight: 800; margin: 12px 0; }
    button { padding: 10px 12px; border-radius: 10px; border: 1px solid #ccc; cursor: pointer; }
    button:active { transform: translateY(1px); }
  </style>
</head>
<body>
  <h1>State Management Pattern</h1>

  <div class="card">
    <p>상태가 바뀌면 화면이 자동으로 바뀌는 구조를 만든다.</p>
    <div id="counter-display">0</div>
    <button id="increase-button">증가</button>
  </div>

  <script>
    // =========================================
    // 1) Core State (단일 원천)
    // =========================================
    let myCoreState = 0;

    // =========================================
    // 2) Subscribers (옵저버 목록)
    // =========================================
    const subscribers = [];

    // =========================================
    // 3) subscribe: 구독 등록
    //    - 상태가 바뀔 때 실행될 함수를 등록한다.
    //    - (확장) unsubscribe도 반환할 수 있다.
    // =========================================
    function addObserver(observerFn) {
      subscribers.push(observerFn);

      // (선택) 구독 해제 함수 반환 (실무 패턴)
      return function unsubscribe() {
        const idx = subscribers.indexOf(observerFn);
        if (idx >= 0) subscribers.splice(idx, 1);
      };
    }

    // =========================================
    // 4) notify: 상태 변경을 모든 구독자에게 알림
    // =========================================
    function notifySubscribers() {
      subscribers.forEach((fn) => fn(myCoreState));
    }

    // =========================================
    // 5) updateState: 상태 변경 단일 통로
    //    - 상태 변경 + 알림까지 책임진다.
    // =========================================
    function updateState(newValue) {
      // (선택) 동일 값이면 스킵: 불필요한 렌더 방지
      if (Object.is(myCoreState, newValue)) return;

      myCoreState = newValue;
      notifySubscribers();
    }

    // =========================================
    // 6) UI (Observer): 상태를 받아 화면을 갱신하는 함수
    // =========================================
    const $counterDisplay = document.getElementById("counter-display");
    const $increaseButton = document.getElementById("increase-button");

    function renderCounterDisplay(currentCount) {
      $counterDisplay.textContent = currentCount;
    }

    // 옵저버 등록
    addObserver(renderCounterDisplay);

    // =========================================
    // 7) Event -> State Update
    // =========================================
    $increaseButton.addEventListener("click", () => {
      updateState(myCoreState + 1);
    });

    // =========================================
    // 8) 초기 렌더링
    // =========================================
    notifySubscribers();
  </script>
</body>
</html>
```

---

## ✅ 요구사항 체크리스트
- [x] `#counter-display`에 카운터 값 표시
- [x] `#increase-button` 클릭 시 +1
- [x] 상태(`myCoreState`)와 구독자(`subscribers`) 구현
- [x] `addObserver()`, `notifySubscribers()`, `updateState()` 구현
- [x] 상태 변경 시 UI 자동 업데이트
- [x] 초기 로딩 시 화면 렌더 완료

---

## 🔥 오늘 반드시 가져가야 할 것 (실무 기준)
- UI는 결과다. **원인은 상태다.**
- 이벤트는 “DOM 변경”이 아니라 **상태 변경**만 해야 한다.
- `updateState()` 같은 **단일 통로**가 있어야 디버깅이 된다.
- 옵저버/구독자 함수는 “현재 상태를 받아 렌더”만 해야 한다.

---

## 🚀 (선택) 확장 과제
- `decrease` 버튼 추가하기
- `reset` 버튼 추가하기
- 상태를 `{ count: 0 }` 객체로 바꾸고, 부분 렌더 적용하기
- 여러 UI 구독자 추가하기 (예: “두 배 값”, “메시지”)
- `batchUpdate`로 연속 변경을 한 번만 notify 하도록 개선하기

---

## 📚 참고 키워드
- Observer Pattern
- Pub/Sub Pattern
- Reactive Programming
- state store / single source of truth
- subscribe / unsubscribe
