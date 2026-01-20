# Day 40 — Composition 패턴 & 객체 설계 (상속 대체 전략)

## 🏷 Topic
Composition Pattern / Object Design / Mixin / Factory Pattern

## 🔎 관련 검색어
- composition vs inheritance javascript
- javascript composition pattern
- mixin pattern javascript
- factory function design
- object composition js

---

## ✅ 한 줄 요약
상속은 행동을 **물려받는 구조**이고, Composition은 행동을 **조합하는 구조**다 — JS에서는 조합이 기본이다.

---

## 📌 프로젝트 개요 (WHY)
Day 40은 상속을 대체하기 위한 테크닉을 배우는 날이 아니다.  
**객체를 어떻게 설계해야 변경에 강해지는지 판단 기준을 세우는 단계**다.

상속이 많아질수록:
- 결합도가 높아지고
- 변경 영향 범위가 커지며
- 오버라이딩이 누적된다.

Composition은 이 문제를 구조적으로 해결한다.

---

## 🎯 미션 목표
- 상속의 구조적 한계를 설명한다
- Composition의 기본 형태를 이해한다
- Factory + Composition 설계를 구현한다
- 실무 기준 선택 가이드를 확립한다

---

## 🧠 핵심 사고

### 1. 상속은 is-a, 조합은 has-a
- Button **is-a** UIElement → 상속
- Button **has-a** ClickBehavior → 조합

👉 관계를 먼저 정의한다.

---

### 2. 기능은 “붙이는 것”이지 “물려받는 것”이 아니다
- 행동을 작은 단위로 나눈다
- 필요한 것만 조합한다

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 기본 Composition
```js
function withClickable(target) {
  return {
    click() {
      console.log('clicked');
    },
    ...target,
  };
}

function withDisable(target) {
  return {
    disable() {
      console.log('disabled');
    },
    ...target,
  };
}

const button = withDisable(withClickable({}));
```

---

### 2️⃣ Factory + Composition (실무 최다)
```js
function createButton() {
  const state = { disabled: false };

  return {
    click() {
      if (state.disabled) return;
      console.log('click');
    },
    disable() {
      state.disabled = true;
    },
  };
}
```

- 상태 은닉: Closure
- 행동 조합: Composition

---

### 3️⃣ Mixin 패턴
```js
const canClick = {
  click() {
    console.log('click');
  },
};

const canDisable = {
  disable() {
    console.log('disable');
  },
};

const button = Object.assign({}, canClick, canDisable);
```

- 단순 조합
- 충돌 주의

---

## 📊 상속 vs Composition 선택 가이드

| 기준 | 상속 | Composition |
|---|---|---|
| 관계 | is-a | has-a |
| 변경 내성 | 낮음 | 높음 |
| 테스트 | 어려움 | 쉬움 |
| 유연성 | 낮음 | 높음 |

---

## ⚠️ Composition 사용 시 주의
- 기능 충돌 이름 관리
- 과도한 중첩 방지
- 명확한 책임 분리

---

## 🔗 이전 Day와의 연결
- Day 33~35: Closure (상태 은닉)
- Day 38~39: Prototype & 상속
- Day 40: 조합 기반 설계 확정

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 깊은 상속 금지
- 기능 단위로 분리
- 조합 우선 설계

### 기른 역량
- 객체 설계 판단력
- 유지보수 친화적 구조 설계
- React/Hooks 사고 기반 확보

---

## ☑️ 체크리스트
- [ ] is-a / has-a 구분이 가능한가
- [ ] 상속 대신 조합을 설계할 수 있는가
- [ ] Factory + Composition 구조를 이해했는가

---

## 🎯 얻어가는 점
- 상속에 대한 과신 제거
- JS에 맞는 객체 설계 기준 확립
- 다음 DOM 아키텍처 학습 준비 완료
