# Day 44 — Keyboard & Accessibility Events

## 🏷 Topic
Keyboard Events / Focus Management / Accessibility (ARIA) / Non-mouse Interaction

## 🔎 관련 검색어
- keyboard accessibility javascript
- focus management aria
- aria-selected listbox example
- keydown arrow navigation
- web accessibility keyboard support

---

## ✅ 한 줄 요약
접근성은 옵션이 아니라 **입력 방식의 확장**이며,  
키보드는 마우스의 대체가 아니라 **동등한 인터랙션 채널**이다.

---

## 📌 프로젝트 개요 (WHY)
Day 44의 목적은 “키보드도 되게 만들자”가 아니다.  
**마우스 중심 사고에서 벗어나, 입력 방식 자체를 추상화**하는 데 있다.

실무 UI는 항상 다음을 만족해야 한다.
- 마우스 사용자
- 키보드 사용자
- 스크린 리더 사용자

이 Day에서는 동일한 기능을 **키보드 이벤트만으로 완결**시키며,  
접근성 속성이 왜 상태의 일부인지 체감한다.

---

## 🎯 미션 목표
- 키보드만으로 검색 / 이동 / 선택이 가능하도록 만든다
- 포커스를 명시적인 상태로 관리한다
- aria 역할/상태를 UI 변화와 동기화한다
- 시각적 선택과 논리적 선택을 분리하지 않는다

---

## 🧠 핵심 사고

### 1️⃣ 포커스는 UI 상태다
```js
let focusedIndex = -1;
```

- 포커스는 브라우저가 알아서 관리하는 부가 기능 ❌
- 명시적으로 관리되는 **상태 값 ⭕**

---

### 2️⃣ 키보드 이벤트는 “명령”이다
```js
ArrowUp / ArrowDown / Enter / Escape
```

- 클릭의 대체가 아니라
- **의미 있는 명령 집합**

---

### 3️⃣ aria 속성은 설명이 아니라 “동기화 대상”
```html
aria-selected="true"
```

- 설명용 텍스트 ❌
- **현재 상태를 외부 도구에 전달하는 인터페이스**

---

## 🧠 핵심 이론 보강

### role=listbox / option
- 스크린 리더에게 “선택 가능한 목록”임을 전달
- div/ul 구조라도 의미를 부여할 수 있음

---

### tabindex 설계
- `tabindex="0"` : 포커스 가능
- `tabindex="-1"` : 프로그래밍적 포커스만 허용

👉 포커스 흐름 제어의 핵심

---

### aria-live
```html
<section aria-live="polite">
```

- 상태 변화를 스크린 리더가 즉시 인지
- 시각적 변화 없는 정보 전달 가능

---

## 🧩 상태 모델
```js
let keyword = '';
let focusedIndex = -1;
```

- keyword : 검색 입력 상태
- focusedIndex : 현재 키보드 포커스 위치

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 키보드 네비게이션
```js
if (e.key === 'ArrowDown') {
  focusedIndex = Math.min(focusedIndex + 1, filtered.length - 1);
  focusItem();
}
```

---

### 2️⃣ 포커스 이동 함수
```js
function focusItem() {
  render();
  const el = listEl.querySelector(
    `.item[data-index="${focusedIndex}"]`
  );
  if (el) el.focus();
}
```

---

### 3️⃣ 접근성 상태 반영
```html
<li
  role="option"
  aria-selected="true"
></li>
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 마우스 없이 모든 기능 사용 가능
- 포커스 상태를 명시적으로 관리
- aria 속성을 UI 상태와 동기화

### 기른 역량
- 키보드 인터랙션 설계 능력
- 접근성 이벤트 이해
- 입력 채널 추상화 사고

---

## 📂 파일 구조
```
44-keyboard-accessibility/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] 마우스 없이 전 기능이 가능한가
- [ ] 포커스 이동을 설명할 수 있는가
- [ ] aria-selected 변경 이유를 이해했는가
- [ ] 스크린 리더 전달 흐름을 설명할 수 있는가

---

## 🎯 얻어가는 점
- 접근성은 별도의 작업이 아니다
- 키보드는 또 하나의 사용자다
- 포커스는 상태이며, 설계 대상이다
- 이후 SPA / Form UX 설계의 필수 기반 확보
