# Day 16 — Operators & Logic (Expression-based UI Decision)

🗓 **Date**  
2026-01-10 (Sat)

📌 **Topic**
- 삼항 연산자(`?:`)
- 논리 연산자(`&&`, `||`)
- Truthy / Falsy
- Short-circuit evaluation
- 조건을 **값 결정 규칙 → UI 상태**로 연결하기

---

## ✅ 오늘 한 줄 요약
> 조건은 흐름을 제어하는 문장이 아니라, **UI에 들어갈 값을 결정하는 규칙**이다.

---

## 📌 프로젝트 개요
Day 16은 연산자 문법을 외우는 날이 아니다.  
조건 로직을 **표현식(expression)**으로 만들고, 그 결과를 **UI 상태로 연결**하는 단계다.

이 Day에서는:
- 조건문으로 분기하는 사고 ❌  
- **값을 계산 → UI 상태로 해석 → 화면에 반영하는 사고** ✅  

를 연습한다.

이 사고는 이후:
- DOM 조건 렌더링
- 상태 기반 UI 설계
- React JSX 조건 분기

로 그대로 이어진다.

---

## 🎯 미션 목표 (Mission Goals)
- `if / else` 없이 조건을 **표현식(expression)**으로 구성한다
- 삼항 연산자를 **값 선택 도구**로 사용한다
- `&&`를 활용해 범위 조건을 명확히 표현한다
- 계산 결과를 그대로 쓰지 않고 **UI 상태로 한 번 더 해석**한다
- “계산 코드”가 아닌 **UI 사고 코드**를 작성한다

---

## 🔥 오늘의 핵심 (Key Takeaways)
- 삼항 연산자는 “조건문 축약”이 아니라 **값 선택 연산자**
- 논리 연산자는 boolean이 아니라 **평가된 값**을 반환한다
- 숫자 데이터와 UI 상태는 같이 쓰면 반드시 복잡해진다
- UI는 항상 **state → 계산 → 표현** 흐름을 따른다

---

## 🧠 핵심 개념 / 이론 요약

### 1️⃣ 삼항 연산자 (Ternary Operator)
```js
condition ? valueA : valueB
```
- 반드시 하나의 **값**으로 귀결됨
- 변수 할당, `return`, UI 분기에 적합
- 중첩은 2단계까지만 허용 (그 이상은 가독성 저하)

### 2️⃣ 논리 연산자 `&&`
- 왼쪽이 falsy면 → 왼쪽 값 반환
- 왼쪽이 truthy면 → 오른쪽 값 반환

```js
age >= 8 && age <= 19
```
→ 범위 조건을 표현식으로 묶는 데 사용

### 3️⃣ Truthy / Falsy
Falsy 값:
```txt
false, 0, "", null, undefined, NaN
```
- 조건식에서 자동 변환됨
- UI 기본값 처리 시 의도치 않은 분기 주의

---

## 🏗️ 구현 기준 & 이 과제를 통해 기른 역량

### 내가 구현하면서 지키려던 기준
- 조건식은 **의미 있는 변수명**으로 먼저 분리
- 요금 계산은 **숫자 값만 반환**
- UI 텍스트 / 스타일은 계산 결과를 **한 단계 더 해석해서 결정**

### 이 과제를 통해 기른 핵심 역량
- 조건 → 값 → UI 상태로 이어지는 사고
- 표현식 기반 로직 설계
- 상태 중심 렌더링 흐름 이해

---

## 🏗️ 구현 내용

### A. 기본 요구사항
- `age`를 상태로 관리
- 요금 규칙
  - `0 ~ 7세` → `0원`
  - `8 ~ 19세` → `1000원`
  - `20세 이상` → `2000원`
- ❌ `if / else`를 이용한 요금 계산 금지
- ✅ 삼항 연산자와 논리 연산자만 사용

### B. UI 요구사항
- 요금 결과를 **카드 UI**로 출력
- 요금에 따라:
  - 무료 / 유료 배지 표시
- 잘못된 값일 경우:
  - 카드 렌더링 차단
  - 에러 메시지 UI 출력

---

## 📁 파일 구조
```txt
day-16/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  └─ main.js
└─ README.md
```

---

## ⚙️ 실행 방법
- 브라우저에서 `index.html` 실행
- 버튼 클릭으로 나이 변경
- 카드 UI 및 Console 로그 확인

---

## 📌 핵심 코드 (구조 중심)

```js
function calculateFare(age) {
  const isInvalid = typeof age !== 'number' || age < 0;
  const isFree = age <= 7;
  const isTeen = age >= 8 && age <= 19;

  return isInvalid
    ? null
    : isFree
    ? 0
    : isTeen
    ? 1000
    : 2000;
}
```

```js
function render() {
  const fare = calculateFare(state.age);

  if (fare === null) {
    cardEl.innerHTML = '';
    errorEl.textContent = '잘못된 나이 값입니다.';
    return;
  }

  errorEl.textContent = '';
  cardEl.innerHTML = renderCard(state.age, fare);
}
```

---

## ✅ 제출 체크리스트
- [ ] 요금 계산에 `if / else`를 사용하지 않았다
- [ ] 삼항 연산자는 값 선택에만 사용했다
- [ ] 조건 로직과 UI 렌더링을 분리했다
- [ ] 상태 변경 후 항상 `render()`로 UI를 재계산했다
- [ ] 에러 상태를 UI로 명확히 표현했다

---

## 🎯 얻어가는 점
- 조건을 “흐름”이 아니라 **값 결정 규칙**으로 설계하는 감각
- 계산 로직과 UI 표현을 분리하는 사고
- 이후 React 조건 렌더링의 기반 확보

---

## 💻 사용 기술
- HTML5
- CSS3
- JavaScript (ES6)

---

## 🔎 검색 키워드
- JavaScript ternary operator
- logical operators short circuit
- expression based condition
- UI state rendering

---

## 🧠 마무리
Day 16의 핵심은 연산자를 많이 아는 것이 아니라,

> 조건을 계산한 뒤  
> 그 결과를 **UI 상태로 해석**하는 사고를 만드는 것이다.
