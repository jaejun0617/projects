# Day 24 — Theory: Closure & Scope Chain  
**Sun, Jan 18, 2026**

> 목표: **클로저(Closure)**로 전역 변수 없이 동작하는 **Private 카운터 / 뱅킹 시스템**을 구현한다.  
> 핵심: **상태(state)를 숨기고, 공개된 메서드(API)로만 조작**하게 만든다.

---

## 🎯 미션 요약

- ✅ **전역 변수 금지**
- ✅ `createBankAccount()` 또는 `createCounter()`로 **프라이빗 상태(balance/count)** 생성
- ✅ 반환된 메서드(`deposit/withdraw/getBalance`, `inc/dec/get/reset`)로만 **조회/변경**
- ✅ 인스턴스 2개 이상 만들어 **서로 독립**인지 확인

---

## 🧠 핵심 개념 한 방에 잡기

### 1) Lexical Scoping (렉시컬 스코핑)

스코프는 **실행 위치가 아니라 “선언 위치”**로 결정된다.

- 함수가 **어디서 호출됐는지** ❌
- 함수가 **어디서 정의됐는지** ✅

```js
function outer() {
  const secret = 123;

  function inner() {
    return secret; // inner는 outer의 secret에 접근 가능 (선언 위치 기준)
  }

  return inner;
}

const fn = outer();
console.log(fn()); // 123
```

**포인트**  
`inner()`는 전역에서 실행되지만, **태어난 곳(outer)의 환경**을 기준으로 스코프가 정해진다.

---

### 2) Closure (클로저)

> **바깥 함수가 끝났는데도**, 내부 함수가 바깥 변수(환경)를 **기억하고 계속 접근**하는 현상

**정확한 정의(실무용)**  
- 클로저 = **함수 + 그 함수가 캡처한 렉시컬 환경(참조들)**

**클로저가 “발생하는 조건”**  
- 내부 함수가 바깥 변수를 **참조**하는 순간 발생  
- (특별한 문법이 아니라 **동작 원리**)

```js
function makeCounter() {
  let count = 0; // private state

  return function () {
    count += 1; // 외부 변수 count를 참조 → 클로저 발생
    return count;
  };
}

const next = makeCounter();
console.log(next()); // 1
console.log(next()); // 2
```

---

### 3) Scope Chain (스코프 체인)

변수를 찾을 때 JS 엔진은 아래 순서로 탐색한다.

1. **현재 스코프**
2. **바깥 스코프**
3. **더 바깥…**
4. **전역(Global)**

```js
const a = "global";

function outer() {
  const b = "outer";
  function inner() {
    const c = "inner";
    console.log(a, b, c); // global outer inner
  }
  inner();
}
outer();
```

---

### 4) Encapsulation (캡슐화 / 정보 은닉) — 오늘의 본질

- **데이터는 숨긴다(Private)**
- **행동만 공개한다(Public API)**

즉,

- `balance` 같은 중요한 상태는 **직접 접근 불가**
- `deposit/withdraw/getBalance` 같은 함수로만 접근 가능

이 패턴은 실무에서:
- 상태관리(React state)  
- 모듈 설계  
- 보안/무결성(원치 않는 변경 방지)  
에 그대로 사용된다.

---

## 🧩 왜 “전역 변수 금지”가 중요한가?

전역 상태는 규모가 커질수록 문제를 만든다.

- 어디서 바뀌었는지 추적 어려움
- 다른 코드와 충돌/오염
- 테스트/재사용 어려움

클로저로 “상태를 소유한 인스턴스”를 만들면:

- 인스턴스 단위로 독립 상태 보장 ✅
- 외부가 마음대로 수정 불가 ✅
- 기능 단위 테스트 쉬움 ✅

---

## 🏗️ 미션 요구사항

### A. Private Banking System (필수)

`createBankAccount(initialBalance)`를 구현한다.

- 내부에 `balance` 생성 (**외부 접근 불가**)
- 아래 메서드 반환

**deposit(amount)**
- amount는 **양수 숫자만**
- 성공 시 잔액 증가
- 성공/실패를 `boolean`으로 반환 (권장)

**withdraw(amount)**
- amount는 **양수 숫자만**
- 잔액 부족이면 실패
- 성공/실패를 `boolean` 반환 (권장)

**getBalance()**
- 현재 잔액(숫자) 반환

추가 권장:
- `getHistory()`로 로그 배열 반환(선택)
- 금액이 `Number.isFinite`인지 검사(안전)

---

### B. Private Counter (선택)

`createCounter(start)`로 `count`를 숨기고

- `inc(step)`
- `dec(step)`
- `get()`
- `reset(next)`

로만 상태 변경/조회

---

## 💡 구현 전략 (사고 흐름)

1) **상태를 숨길 외부 함수**를 만든다  
2) 외부 함수 내부에 `balance/count` 선언  
3) 내부 함수들이 `balance/count`를 참조하고 조작  
4) 내부 함수들을 객체로 묶어 **return**  
5) 인스턴스 2개 만들어 **독립성** 확인

---

## 💻 구현 코드 (index.html, 콘솔 확인)

> DOM 없이 콘솔로만 확인합니다.  
> 실행: 브라우저 열기 → **F12 → Console**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Day 24 - Closure & Scope Chain</title>
  </head>
  <body>
    <h1>Day 24 - Closure & Scope Chain</h1>
    <p>콘솔(F12)을 열어 결과를 확인하세요.</p>

    <script>
      // =========================
      // A) Private Banking System
      // =========================
      function createBankAccount(initialBalance = 0) {
        // ✅ private state (외부에서 직접 접근 불가)
        let balance = Number.isFinite(initialBalance) ? initialBalance : 0;

        // (선택) 거래 기록: private로 숨기고 getter로만 공개 가능
        const history = [];

        const log = (type, amount, ok) => {
          history.push({
            type,
            amount,
            ok,
            balance,
            at: new Date().toISOString(),
          });
        };

        const deposit = (amount) => {
          if (!Number.isFinite(amount) || amount <= 0) {
            console.log("[입금 실패] amount는 양수 숫자여야 합니다.");
            log("deposit", amount, false);
            return false;
          }

          balance += amount;
          console.log(`[입금 완료] +${amount}원 | 잔액: ${balance}원`);
          log("deposit", amount, true);
          return true;
        };

        const withdraw = (amount) => {
          if (!Number.isFinite(amount) || amount <= 0) {
            console.log("[출금 실패] amount는 양수 숫자여야 합니다.");
            log("withdraw", amount, false);
            return false;
          }

          if (amount > balance) {
            console.log(`[출금 실패] 잔액 부족 | 요청: ${amount}원 | 잔액: ${balance}원`);
            log("withdraw", amount, false);
            return false;
          }

          balance -= amount;
          console.log(`[출금 완료] -${amount}원 | 잔액: ${balance}원`);
          log("withdraw", amount, true);
          return true;
        };

        const getBalance = () => balance;

        // (선택) 외부에 history 배열을 그대로 내보내면 변조 위험 → 복사본 반환
        const getHistory = () => history.map((x) => ({ ...x }));

        // ✅ public API만 반환 (balance/history는 노출되지 않음)
        return { deposit, withdraw, getBalance, getHistory };
      }

      // =========================
      // B) Private Counter (옵션)
      // =========================
      function createCounter(start = 0) {
        let count = Number.isFinite(start) ? start : 0;

        const inc = (step = 1) => {
          if (!Number.isFinite(step)) return count;
          count += step;
          return count;
        };

        const dec = (step = 1) => {
          if (!Number.isFinite(step)) return count;
          count -= step;
          return count;
        };

        const reset = (next = 0) => {
          count = Number.isFinite(next) ? next : 0;
          return count;
        };

        const get = () => count;

        return { inc, dec, reset, get };
      }

      // =========================
      // 테스트 시나리오
      // =========================
      console.log("=== A) Bank Account 테스트 시작 ===");

      const account1 = createBankAccount();      // 0원
      const account2 = createBankAccount(1000);  // 1000원

      // account1
      account1.deposit(10000);
      account1.withdraw(3000);
      console.log("account1 잔액:", account1.getBalance()); // 7000

      // account2 (독립성 확인)
      console.log("account2 잔액(초기):", account2.getBalance()); // 1000
      account2.withdraw(5000); // 실패
      account2.deposit(2000);
      console.log("account2 잔액:", account2.getBalance()); // 3000

      // ✅ private state 직접 접근 불가 확인
      console.log("account1.balance:", account1.balance); // undefined
      console.log("account1.history:", account1.history); // undefined

      // (선택) 거래내역 확인
      console.log("account1 history:", account1.getHistory());

      console.log("=== A) Bank Account 테스트 종료 ===\n");

      console.log("=== B) Counter 테스트 시작 ===");

      const counterA = createCounter(0);
      const counterB = createCounter(10);

      console.log("counterA:", counterA.get()); // 0
      console.log("counterA inc:", counterA.inc()); // 1
      console.log("counterA inc(5):", counterA.inc(5)); // 6

      console.log("counterB:", counterB.get()); // 10
      console.log("counterB dec(3):", counterB.dec(3)); // 7
      console.log("counterB reset(100):", counterB.reset(100)); // 100

      console.log("=== B) Counter 테스트 종료 ===");
    </script>
  </body>
</html>
```

---

## 🧪 체크리스트 (합격 기준)

- [ ] `balance/count`가 전역에 없다 (console에서 `window.balance` 같은 게 없다)
- [ ] 인스턴스 2개가 상태를 공유하지 않는다
- [ ] `account.balance`는 `undefined`다 (직접 접근 불가)
- [ ] `deposit/withdraw`가 입력 검증을 한다 (음수/NaN/Infinity 방어)
- [ ] `withdraw`가 잔액 부족을 막는다

---

## ⚠️ 실무에서 자주 터지는 포인트

### 1) “상태를 return 해버리면” 프라이빗이 아니다
```js
function bad() {
  let balance = 0;
  return { balance }; // ❌ 외부에서 직접 수정 가능
}
```

### 2) 반환 객체를 외부가 바꿔치기 할 수 있다 (API 보호)
```js
const acc = createBankAccount();
acc.deposit = () => console.log("hack"); // 이런 식으로 덮어쓰기 가능
```
➡️ 보안/무결성이 더 필요하면 `Object.freeze(api)` 같은 방어도 고려(심화)

### 3) 클로저는 메모리와 연결된다
- 내부 함수가 외부 변수를 참조하면, 그 변수는 GC(가비지 컬렉션) 대상이 되지 않을 수 있다.
- 대규모 데이터 캡처하면 메모리 누수처럼 보일 수 있음 (심화)

---

## 🔥 핵심 정리 (암기 라인)

- **클로저 = 내부 함수가 외부 변수(렉시컬 환경)를 기억**
- **스코프 체인 = 변수를 찾는 탐색 경로**
- **캡슐화 = 데이터는 숨기고, 기능(API)만 공개**
- 전역 변수 없이도 “상태(state)”를 만들 수 있다 → 실무 기반 체력

---

## 📚 참고 (MDN)

- Closure  
- Scope  
- Lexical scoping  
