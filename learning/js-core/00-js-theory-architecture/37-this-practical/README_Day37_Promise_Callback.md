# Day 37 — Promise & Callback
**Sat, Jan 31, 2026**  
**Topic:** Promise & Callback  
**Goal:** 콜백 지옥 코드를 **Promise 체이닝**으로 리팩토링해서 가독성과 에러 처리를 개선한다.

---

## ✅ 오늘의 결론 (3줄)
1) **Callback** = “끝나면 이 함수 실행” → 순차 비동기가 길어지면 중첩되어 **콜백 지옥**이 된다.  
2) **Promise** = “미래의 성공/실패 결과” → `then/catch`로 **흐름(순서)**과 **에러 전파**를 표준화한다.  
3) **체이닝의 핵심 규칙**: `then` 안에서 **값/Promise를 return** 해야 다음 단계가 **그 결과를 받아서** 이어진다.

---

## 1) Callback Hell — 왜 생기고 왜 위험한가?

### 1-1. Callback의 역할
비동기 작업(타이머/요청/파일 등)이 끝났을 때 실행할 함수를 **인자로 넘기는 패턴**.

```js
doSomethingAsync((err, data) => {
  if (err) return;
  // data 사용
});
```

### 1-2. Callback Hell이 생기는 조건
“A가 끝나야 B, B가 끝나야 C…”처럼 **순차 비동기**가 이어지면:

- 들여쓰기가 계속 깊어지고
- 각 단계마다 에러 분기(예: `if (err) return ...`)가 반복된다

### 1-3. 콜백 지옥의 진짜 문제 3가지
- **가독성 붕괴**: 흐름이 한눈에 안 들어옴  
- **에러 처리 분산**: 단계별로 에러 처리 코드가 흩어져 누락 가능  
- **유지보수 난이도 상승**: 단계 추가/삭제/순서 변경이 어렵고 실수하기 쉬움

---

## 2) Promise — “비동기 결과를 담는 객체”

### 2-1. Promise 상태(States)
- `pending` : 진행 중  
- `fulfilled` : 성공(값이 생김)  
- `rejected` : 실패(에러가 생김)

> 상태는 **한 번만** 바뀐다: `pending → fulfilled` 또는 `pending → rejected`

### 2-2. Promise는 왜 “체이닝”이 되는가?
`then()`은 **항상 Promise를 반환**한다.  
그래서 `then → then → then`처럼 줄줄이 이어서 “순서”를 표현할 수 있다.

---

## 3) then / catch / finally — 흐름 연결과 에러 전파

### 3-1. then
성공(`fulfilled`)했을 때 실행할 함수를 등록한다.

- `then` 안에서 **값을 return** → 다음 `then`이 그 값을 받는다  
- `then` 안에서 **Promise를 return** → 다음 `then`은 그 Promise가 끝날 때까지 기다린다

```js
doA()
  .then((a) => {
    return a + 1; // ✅ 값 return
  })
  .then((v) => {
    console.log(v); // a+1
  });
```

```js
doA()
  .then((a) => {
    return doB(a); // ✅ Promise return (기다림)
  })
  .then((b) => {
    console.log(b); // doB 결과
  });
```

### 3-2. catch
실패(`rejected`)했을 때 실행할 함수를 등록한다.

- 체인 중간 어디서든 `reject`되거나 `throw`되면
- 아래로 전파되어 **가까운 catch**에서 잡힌다

```js
doA()
  .then(doB)
  .then(doC)
  .catch((err) => {
    console.error("ERROR:", err.message);
  });
```

### 3-3. finally
성공/실패와 관계없이 항상 실행된다. (정리 작업에 사용)

```js
doA()
  .then(doB)
  .catch(handleErr)
  .finally(() => console.log("cleanup"));
```

---

## 4) 가장 자주 터지는 버그 TOP 3 (이거만 잡아도 실무급)

### ✅ 1) `return` 누락
```js
// ❌ 다음 then이 doB를 기다리지 않음
doA().then(() => {
  doB(); // return 없음
}).then(() => {
  console.log("B 끝난 줄 착각");
});
```

```js
// ✅ return 해야 기다림
doA().then(() => {
  return doB();
}).then(() => {
  console.log("B 끝난 뒤 실행");
});
```

### ✅ 2) then 안에서 throw는 reject로 전파됨
```js
doA()
  .then(() => {
    throw new Error("boom");
  })
  .catch((e) => console.log(e.message)); // boom
```

### ✅ 3) catch를 “끝”에 두면 기본적으로 가장 깔끔함
- 대부분의 순차 작업은 `catch` 1개로 처리한다
- 특정 단계에서만 복구가 필요하면 “중간 catch + 복구값 return”을 사용한다

```js
doA()
  .then(doB)
  .catch(() => "fallback") // 복구
  .then((v) => console.log("continue:", v));
```

---

## 5) Promise와 Event Loop (Microtask) — 최소로만 정확히

Promise의 `then/catch/finally` 콜백은 일반적으로 **Microtask Queue**로 들어간다.  
그래서 `setTimeout(..., 0)` 같은 Task(=Macrotask)보다 먼저 실행될 수 있다.

```js
console.log(1);

setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => console.log("promise"));

console.log(2);

// 보통 결과: 1, 2, promise, timeout
```

---

## 6) 미션 요구사항 체크리스트

### A) 콜백 버전
- [ ] `loadResourceCallback(name, duration, successRate, callback)`
- [ ] 성공: `callback(null, result)`
- [ ] 실패: `callback(error, null)`
- [ ] 3단계 이상 “순차 흐름” 콜백 지옥 코드 작성

### B) Promise 버전
- [ ] `loadResourcePromise(name, duration, successRate)` → `new Promise(...)` 반환
- [ ] `then` 체이닝으로 동일 순서 구현
- [ ] `.catch()` 1번으로 에러 처리
- [ ] `return` 규칙을 지켜서 “기다림”이 유지되게 만들기

---

## 7) 정답 템플릿 (index.html에 그대로 붙여서 실행)

### 7-1) Callback 버전 + 콜백 지옥(3단계)

```js
function loadResourceCallback(resourceName, duration, successRate, callback) {
  console.log(`(CB) START: ${resourceName}`);
  setTimeout(() => {
    const ok = Math.random() < successRate;

    if (ok) {
      const result = `${resourceName} ✅`;
      console.log(`(CB) SUCCESS: ${resourceName}`);
      callback(null, result);
      return;
    }

    const err = new Error(`${resourceName} ❌ 로드 실패`);
    console.log(`(CB) FAIL: ${resourceName}`);
    callback(err, null);
  }, duration);
}

// 콜백 지옥(순차 3단계)
loadResourceCallback("유저 정보", 1000, 0.8, (err1, user) => {
  if (err1) return console.error("ERROR:", err1.message);

  loadResourceCallback("게시물 목록", 1500, 0.7, (err2, posts) => {
    if (err2) return console.error("ERROR:", err2.message);

    loadResourceCallback("댓글 목록", 500, 0.9, (err3, comments) => {
      if (err3) return console.error("ERROR:", err3.message);

      console.log("DONE (CB):", { user, posts, comments });
    });
  });
});
```

---

### 7-2) Promise 버전 + 체이닝 리팩토링

```js
function loadResourcePromise(resourceName, duration, successRate) {
  console.log(`(P) START: ${resourceName}`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ok = Math.random() < successRate;

      if (ok) {
        console.log(`(P) SUCCESS: ${resourceName}`);
        resolve(`${resourceName} ✅`);
        return;
      }

      console.log(`(P) FAIL: ${resourceName}`);
      reject(new Error(`${resourceName} ❌ 로드 실패`));
    }, duration);
  });
}

loadResourcePromise("유저 정보", 1000, 0.8)
  .then((user) => {
    console.log("STEP1:", user);
    return loadResourcePromise("게시물 목록", 1500, 0.7); // ✅ return
  })
  .then((posts) => {
    console.log("STEP2:", posts);
    return loadResourcePromise("댓글 목록", 500, 0.9); // ✅ return
  })
  .then((comments) => {
    console.log("STEP3:", comments);
    console.log("DONE (P)");
  })
  .catch((err) => {
    console.error("ERROR (P):", err.message);
  })
  .finally(() => {
    console.log("FINALLY: 정리 작업");
  });
```

---

## 8) 디버깅 체크리스트(실무형)
- **순서가 이상함** → `then`에서 Promise를 `return` 했는지 확인  
- **catch가 안 잡힘** → `reject/throw`가 실제로 발생하는지, 체인이 끊기지 않았는지 확인  
- **timeout보다 promise가 먼저 찍힘** → Microtask 우선순위(정상)

---

## 9) 면접/포트폴리오 한 줄
- “순차 비동기 로직을 콜백 중첩에서 Promise 체이닝으로 리팩토링했고, `return` 규칙을 지켜 **흐름 제어**와 **에러 전파(catch 단일화)**를 안정적으로 구성했습니다.”

---

## 다음 단계(Day 38) 연결
- `async/await`로 체이닝을 “동기 코드처럼” 읽히게 만들기  
- `try/catch`로 에러 처리 통합하기
