# Day 23 — Theory: Execution Context
**Sat, Jan 17, 2026**

> 목표: **Hoisting / TDZ / Scope** 때문에 생기는 출력·에러를 “설명할 수 있는 상태”로 만들고,  
> 그걸 **퀴즈 앱(단일 index.html)** 으로 검증한다.

---

## 🗓 일정

- Sat, Jan 17, 2026

---

## 🎯 미션 목표

- 실행 컨텍스트(Execution Context)가 **왜 호이스팅처럼 보이는지** 구조로 이해
- `var` / `let` / `const` / `function`의 **생성 단계 처리 차이**를 구분
- TDZ가 “왜 생기고, 어디까지가 TDZ인지”를 눈으로 확인
- 스코프(전역/함수/블록) + 스코프 체인으로 **변수 탐색 흐름**을 설명
- 위 내용을 퀴즈로 테스트하는 **미니 앱** 제작

---

## ✅ 최종 산출물

- `index.html` 단일 파일
  - HTML/CSS/JS 포함
  - `<input>`으로 답 입력 → 버튼 클릭 → 결과 출력
  - 오답이면 정답 공개
  - 비교 규칙: **공백 제거 + 대소문자 무시**

---

## 🧠 핵심 개념 한 장 요약

### 실행 컨텍스트란?
JS 엔진이 코드를 실행할 때 만드는 **작업 박스**.
- “지금 실행 중인 코드”를 위한 환경
- 변수/함수 선언을 어디에 만들지
- 스코프(접근 범위)와 this를 어떻게 설정할지

### 왜 중요?
- 호이스팅/TDZ/스코프 문제는 **실행 컨텍스트의 생성 단계**를 모르면 100% 감으로 때려맞추게 됨
- React/상태관리/비동기 디버깅까지 전부 여기서 출발

---

## 🧠 핵심 이론 보강

## 1) Execution Context (실행 컨텍스트)

### 1-1. 언제 생기나?
- **Global Execution Context**: 전역 코드 실행 시작 시 1개 생성
- **Function Execution Context**: 함수 호출할 때마다 생성(호출 횟수만큼)
- (참고) `eval`도 컨텍스트를 만들 수 있지만 실무에서는 피하는 편

### 1-2. 실행 컨텍스트의 2단계 (이게 핵심)
실행은 “한 번에”가 아니라 **준비 → 실행**으로 나뉜다.

#### (1) 생성 단계 Creation Phase
- 선언(Declaration)을 먼저 처리
- 식별자(변수/함수 이름)를 등록
- 스코프 체인/this 바인딩 세팅
- 이때 처리가 다르기 때문에 “호이스팅처럼 보이는 현상”이 발생

#### (2) 실행 단계 Execution Phase
- 코드 한 줄씩 실제 실행
- 할당(Assignment) 발생
- 함수 호출 발생 → 새로운 실행 컨텍스트 생성

---

## 2) Hoisting (호이스팅)

> 한 줄 요약: **“선언이 먼저 처리되는 것처럼 보이는 현상”**  
> 정확히는: “생성 단계에서 식별자를 먼저 등록하기 때문에 그렇게 보임”

### 2-1. function declaration (함수 선언문)
- **함수 전체(본문 포함)** 가 생성 단계에서 준비됨
- 선언 이전 호출 가능

```js
hello(); // OK

function hello() {
  console.log("hi");
}
```

### 2-2. var
- **선언만 호이스팅**
- 초기화는 `undefined`로 먼저 세팅되는 것처럼 동작
- 그래서 선언 전에 접근하면 에러가 아니라 `undefined` → 더 위험(조용히 터짐)

```js
console.log(a); // undefined
var a = 10;
console.log(a); // 10
```

### 2-3. let / const
- “호이스팅이 안 된다”가 아니라:
  - **선언은 등록되지만**
  - **초기화 전 접근이 금지**(TDZ)
- 선언문 이전 접근 → `ReferenceError`

```js
console.log(b); // ReferenceError
let b = 10;
```

---

## 3) TDZ (Temporal Dead Zone)

> `let/const` 변수가 **선언 줄에 도달하기 전까지** 접근 불가인 구간

### 3-1. 왜 생기나?
- `var`처럼 `undefined`로 초기화되는 “조용한 버그”를 막기 위해
- “선언 전에 사용하는 실수”를 강제로 에러로 만든 안전장치

### 3-2. TDZ 범위
- **스코프 시작 지점부터 선언 줄까지**
- 블록 스코프에서 자주 체감

```js
{
  // TDZ 시작
  // console.log(x); // ReferenceError
  let x = 1; // TDZ 끝
  console.log(x); // 1
}
```

---

## 4) Scope (스코프) + Scope Chain (탐색 규칙)

### 4-1. 스코프 종류
- **Global scope**: 어디서든 접근 가능(전역)
- **Function scope**: 함수 내부(특히 `var`)
- **Block scope**: `{}` 내부(`let/const`)

```js
if (true) {
  var v = 1;
  let l = 2;
}
console.log(v); // 1
// console.log(l); // ReferenceError
```

### 4-2. 스코프 체인(변수 찾는 순서)
변수를 찾을 때:
1) 현재 스코프에서 찾고  
2) 없으면 바깥 스코프로 올라가고  
3) 끝까지 없으면 ReferenceError

이 “탐색 규칙”을 **스코프 체인**이라고 부른다.

---

## 5) 자주 터지는 함정 정리 (실무형)

### 5-1. 함수 표현식 hoisting 함정
```js
sayHi(); // TypeError (undefined is not a function)
var sayHi = function () {
  console.log("Hi");
};
```
- `var sayHi`는 생성 단계에서 `undefined`
- 실행 단계에서 `sayHi()`를 먼저 호출 → undefined 호출 → TypeError

### 5-2. shadowing(가리기)로 인한 착각
```js
let name = "Alice";
if (true) {
  let name = "Bob";
  console.log(name); // Bob
}
console.log(name); // Alice
```
- 안쪽 스코프의 `name`이 바깥 `name`을 가림

---

## 🏗️ 앱 요구사항 체크리스트

- [x] 제목: `JS 동작 원리 테스트`
- [x] 최소 3문제(권장 6문제)
- [x] 문제 구성: 코드 스니펫 + 답 입력칸 + 확인 버튼 + 결과 영역
- [x] 정답 비교: **공백 제거 + 대소문자 무시**
- [x] 오답이면 정답 공개
- [x] 이벤트 위임으로 버튼 처리(컴포넌트 늘려도 유지보수 쉬움)

---

## 🧩 퀴즈 설계 팁 (정답 포맷 통일)

정답을 길게 쓰게 하면 오타 때문에 억울해짐 → **짧은 키워드로 통일**.

- `undefined`
- `referenceerror`
- `typeerror`
- `called!`
- `alice`
- `bob`

---

## 💻 구현 코드 (index.html 단일 파일)

> 그대로 복사해서 `index.html`로 실행하면 됩니다.  
> (대소문자/공백 무시 채점, 오답 시 정답 공개)

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Day 23 - JS 동작 원리 테스트</title>
    <style>
      body {
        font-family: system-ui, -apple-system, sans-serif;
        padding: 24px;
        line-height: 1.5;
      }
      .card {
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 16px;
        margin: 12px 0;
      }
      pre {
        background: #f6f6f6;
        padding: 12px;
        border-radius: 10px;
        overflow: auto;
      }
      .row {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }
      input {
        padding: 8px 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        min-width: 220px;
      }
      button {
        padding: 8px 10px;
        border: 1px solid #333;
        border-radius: 8px;
        background: #fff;
        cursor: pointer;
      }
      .ok {
        color: #0a7a2f;
        font-weight: 700;
      }
      .no {
        color: #c01515;
        font-weight: 700;
      }
      .hint {
        color: #555;
        font-size: 14px;
        margin-top: 6px;
      }
    </style>
  </head>
  <body>
    <h1>JS 동작 원리 테스트</h1>
    <p class="hint">
      정답 예: <b>undefined</b>, <b>ReferenceError</b>, <b>Called!</b>, <b>Bob</b> …
      (대소문자/공백 무시)
    </p>

    <div id="quiz"></div>

    <script>
      // ===== 1) 문제 데이터 =====
      // answer는 비교를 위해 "정규화된 형태"로 저장 (소문자 권장)
      const QUESTIONS = [
        {
          id: 1,
          title: "Q1. var 호이스팅",
          code: `console.log(fruit);
var fruit = "apple";`,
          ask: "출력 결과는? (예: undefined / ReferenceError)",
          answer: "undefined",
          explain:
            "var는 선언이 먼저 등록되고(생성 단계), 실행 전에 초기값이 undefined처럼 잡힌다."
        },
        {
          id: 2,
          title: "Q2. 함수 선언문 호이스팅",
          code: `callMe();
function callMe() {
  console.log("Called!");
}`,
          ask: "콘솔에 찍히는 문자열은?",
          answer: "called!",
          explain:
            "함수 선언문은 생성 단계에서 함수 전체가 준비되어 선언 전 호출 가능."
        },
        {
          id: 3,
          title: "Q3. let TDZ",
          code: `console.log(quantity);
let quantity = 50;`,
          ask: "발생하는 에러 종류는?",
          answer: "referenceerror",
          explain:
            "let/const는 TDZ 때문에 선언 이전 접근 시 ReferenceError가 발생."
        },
        {
          id: 4,
          title: "Q4. 블록 스코프 shadowing",
          code: `let userName = "Alice";
if (true) {
  let userName = "Bob";
  console.log(userName);
}
console.log(userName);`,
          ask: "첫 번째 console.log 출력은?",
          answer: "bob",
          explain:
            "블록 내부 let userName이 바깥 userName을 가린다(shadowing)."
        },
        {
          id: 5,
          title: "Q5. 블록 스코프 유지",
          code: `let userName = "Alice";
if (true) {
  let userName = "Bob";
}
console.log(userName);`,
          ask: "마지막 console.log 출력은?",
          answer: "alice",
          explain:
            "블록 내부 변수는 블록 밖에 영향을 주지 않는다(블록 스코프)."
        },
        {
          id: 6,
          title: "Q6. 함수 표현식 + var 함정",
          code: `sayHi();
var sayHi = function () {
  console.log("Hi");
};`,
          ask: "무슨 에러가 나는가? (TypeError / ReferenceError / undefined 등)",
          answer: "typeerror",
          explain:
            "var sayHi는 undefined로 준비되고, undefined() 호출로 TypeError가 난다."
        }
      ];

      // ===== 2) 유틸: 입력 정규화 =====
      const normalize = (s) =>
        String(s ?? "")
          .trim()
          .toLowerCase()
          .replaceAll(" ", ""); // 공백 제거

      // ===== 3) UI 렌더 =====
      const quizEl = document.getElementById("quiz");

      quizEl.innerHTML = QUESTIONS.map((q) => {
        // 코드에서 < 를 HTML로 안전하게 표시
        const safeCode = q.code.replaceAll("<", "&lt;");
        return `
          <section class="card" data-id="${q.id}">
            <h3>${q.title}</h3>
            <pre><code>${safeCode}</code></pre>
            <p><b>질문:</b> ${q.ask}</p>
            <div class="row">
              <input type="text" placeholder="정답 입력" />
              <button type="button">정답 확인</button>
            </div>
            <p class="result"></p>
            <p class="hint">해설: ${q.explain}</p>
          </section>
        `;
      }).join("");

      // ===== 4) 이벤트 위임 =====
      quizEl.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const card = e.target.closest(".card");
        const id = Number(card.dataset.id);
        const q = QUESTIONS.find((x) => x.id === id);

        const input = card.querySelector("input");
        const result = card.querySelector(".result");

        const user = normalize(input.value);
        const correct = normalize(q.answer);

        if (user === correct) {
          result.textContent = "정답입니다! 🎉";
          result.className = "result ok";
        } else {
          result.textContent = `오답입니다. 정답은 "${q.answer}" 입니다.`;
          result.className = "result no";
        }
      });
    </script>
  </body>
</html>
```

---

## 🧪 셀프 체크 (이론이 “진짜 이해” 됐는지)

- `var`가 왜 위험한가를 **undefined 출력**으로 설명할 수 있는가?
- `let`은 “호이스팅이 안 된다”가 아니라 **TDZ로 막는 것**이라 말할 수 있는가?
- 함수 선언문과 함수 표현식의 차이를 “생성 단계 관점”으로 설명할 수 있는가?
- 블록 스코프에서 shadowing이 생기면, 어떤 값이 찍힐지 추론할 수 있는가?

---

## 🔥 오늘의 핵심

- 실행 컨텍스트는 **생성 단계 → 실행 단계**로 굴러간다.
- 호이스팅은 “마법”이 아니라 **생성 단계에서 선언을 먼저 등록**하기 때문에 생긴다.
- `var`는 `undefined`로 **조용히** 터지고,
- `let/const`는 TDZ로 **크게** 터져서 실수를 막는다.
- 스코프 체인은 “변수를 어디서 찾는지”의 규칙이며, 디버깅의 기준선이다.

---

## 📚 참고 자료 (MDN 키워드)

- Execution context
- Hoisting
- let / const (TDZ)
- Scope
- Function declarations vs Function expressions
