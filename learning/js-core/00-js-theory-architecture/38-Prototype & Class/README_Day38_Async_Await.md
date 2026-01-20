# Day 38 — Async/Await
**Sun, Feb 1, 2026**  
**Topic:** Async/Await  
**Goal:** `async/await`로 **여러 단계 데이터를 “순차적으로”** 가져오는 로직 작성 (에러 처리 포함)

---

## ✅ 오늘 한 줄 요약
`async/await`는 **Promise 기반 비동기 흐름을 “동기 코드처럼” 읽히게** 만드는 문법이고, `try/catch/finally`로 **전체 플로우의 성공/실패/정리**를 한 자리에서 관리한다.

---

## 🎯 오늘 미션에서 “진짜로” 잡아야 하는 것
1) **순차 의존성**: 앞 단계 결과가 다음 단계 입력값이 되는 구조(IDs → User → Posts)  
2) **에러 전파**: 중간 단계에서 실패하면 아래 단계는 실행되지 않고 `catch`로 점프  
3) **non-blocking**: `await`는 “JS 전체를 멈추지 않고” **해당 async 함수의 다음 줄만 잠깐 보류**한다  
4) **가독성/유지보수성**: 체이닝보다 “흐름(위→아래)”이 명확해진다

---

## 🧠 핵심 이론 보강 (실무 기준)

### 1) `async` 함수의 반환 규칙 (필수)
- `async function`은 **항상 Promise를 반환**
- `return value` → `Promise.resolve(value)`로 감싼 것처럼 동작
- `throw error` → `Promise.reject(error)`로 감싼 것처럼 동작

```js
async function ok() { return 10; }     // Promise<10>
async function fail() { throw new Error("x"); } // Promise reject
```

---

### 2) `await`의 정체 (딱 2줄)
- `await promise`는 **resolve되면 결과값을 돌려주고**
- **reject되면 그 자리에서 에러를 던진다(throw)** → 그래서 `try/catch`가 필요

```js
try {
  const v = await somePromise; // 성공 값
} catch (e) {
  // somePromise가 reject되면 여기로
}
```

---

### 3) `try/catch/finally` 3종 세트 사용처
- `try`: 정상 플로우(순차 로딩)
- `catch`: **체인 전체 실패를 한 번에** 처리 (로그/알림/복구)
- `finally`: 성공/실패 상관없이 **정리 작업** (로딩 UI 종료 등)

```js
try { /* await... */ }
catch (e) { /* 에러 처리 */ }
finally { /* 로딩 끄기 */ }
```

---

### 4) 순차 vs 병렬 (성능 갈리는 포인트)
- **순차(Sequential)**: 다음 단계가 이전 결과를 필요로 할 때
- **병렬(Parallel)**: 서로 의존이 없을 때는 `Promise.all`로 동시에

```js
// 병렬(의존 없음)
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

> 오늘 미션은 “IDs → User → Posts”로 **의존이 있으니 순차가 정답**.

---

### 5) 자주 터지는 실수 TOP 6 (실무 디버깅 체크리스트)
1. `await`를 `async` 밖에서 사용 (SyntaxError)
2. `try/catch` 없이 await → Unhandled Promise Rejection
3. `forEach` 안에 `await` 사용 → 의도한 순차가 안 됨  
   → **`for...of`**로 바꿔라
4. 에러 났는데도 아래 단계에서 `undefined`를 사용 (NPE/TypeError)
5. 에러 메시지만 찍고 **복구 전략 없이** UI가 멈춤(로딩 유지)
6. 의존 없는 요청도 전부 순차로 await → 불필요하게 느려짐

---

## 🧩 미션 설계 (정답 흐름)
**Step 1)** `fetchUserIds()` → `ids[0]`  
**Step 2)** `fetchUserDetails(ids[0])` → `user.id`  
**Step 3)** `fetchUserPosts(user.id)` → posts 리스트  
**전체를** `try/catch`로 감싼다.

---

## 💻 실행 코드 (index.html 1파일)
브라우저에서 열고 **F12 → Console** 확인.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 38 — Async/Await</title>
</head>
<body>
  <h1>Day 38 — Async/Await</h1>
  <p>콘솔(F12) 확인</p>

  <script>
    // ========== 0) 유틸 ==========
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // 성공 확률(0~1). 0.9면 10% 실패
    const maybeFail = (successRate = 1) => Math.random() > successRate;

    // ========== 1) Fake API ==========
    function fetchUserIds() {
      console.log("1) fetchUserIds: 요청 시작");
      return new Promise(async (resolve, reject) => {
        await delay(1000);

        const successRate = 0.9;
        if (maybeFail(successRate)) return reject(new Error("User ID 목록 로드 실패"));

        resolve(["user1", "user2", "user3"]);
      });
    }

    function fetchUserDetails(userId) {
      console.log(`2) fetchUserDetails(${userId}): 요청 시작`);
      return new Promise(async (resolve, reject) => {
        await delay(1200);

        if (!userId) return reject(new Error("userId가 없습니다"));

        const users = {
          user1: { id: "user1", name: "김코딩", email: "kim@example.com" },
          user2: { id: "user2", name: "박해커", email: "park@example.com" },
          user3: { id: "user3", name: "이프론트", email: "lee@example.com" },
        };

        const user = users[userId];
        if (!user) return reject(new Error("해당 유저를 찾을 수 없음"));

        resolve(user);
      });
    }

    function fetchUserPosts(userId) {
      console.log(`3) fetchUserPosts(${userId}): 요청 시작`);
      return new Promise(async (resolve, reject) => {
        await delay(1500);

        if (!userId) return reject(new Error("userId가 없습니다"));

        const posts = {
          user1: ["첫 번째 게시물", "두 번째 게시물"],
          user2: ["새로운 아이디어", "코드 스니펫"],
          user3: ["프론트엔드 트렌드", "리액트 가이드"],
        };

        const list = posts[userId];
        if (!list) return reject(new Error("게시물 없음"));

        resolve(list);
      });
    }

    // ========== 2) Main (순차 로딩 + 에러 처리) ==========
    async function mainProcess() {
      console.log("=== mainProcess 시작 ===");

      try {
        // Step 1) ids
        const ids = await fetchUserIds();
        console.log("✅ ids:", ids);

        // Step 2) user (첫 유저만)
        const firstId = ids[0];
        const user = await fetchUserDetails(firstId);
        console.log("✅ user:", user);

        // Step 3) posts
        const posts = await fetchUserPosts(user.id);
        console.log("✅ posts:", posts);

        console.log("🎉 모든 데이터 로드 완료!");
      } catch (err) {
        console.error("❌ mainProcess 실패:", err.message);
      } finally {
        console.log("=== mainProcess 종료 ===");
      }
    }

    mainProcess();
  </script>
</body>
</html>
```

---

## ✅ 체크리스트 (완료 기준)
- [ ] `async function mainProcess()` 작성
- [ ] `await`로 **3단계 순차 로딩**
- [ ] 중간 실패 시 아래 단계가 실행되지 않고 `catch`로 이동
- [ ] `finally`에서 정리 로그/로딩 종료 수행
- [ ] 실패 확률을 낮춰(예: 0.5) 에러 플로우도 테스트

---

## 🚀 실무 업그레이드 (선택)
### 1) “복구 전략” 넣기 (Posts 실패는 빈 배열로 대체)
```js
let posts = [];
try {
  posts = await fetchUserPosts(user.id);
} catch (e) {
  console.warn("게시물 로드 실패 → 빈 배열로 대체:", e.message);
}
```

### 2) 여러 유저를 동시에 상세 조회 (의존 없는 구간 병렬)
```js
const ids = await fetchUserIds();
const users = await Promise.all(ids.map((id) => fetchUserDetails(id)));
console.log(users);
```

### 3) 순차 반복이 필요하면 `for...of`
```js
for (const id of ids) {
  const user = await fetchUserDetails(id); // 순차
  console.log(user);
}
```

---

## 🔥 핵심 정리
- `async`는 **Promise 반환**, `await`는 **결과를 동기처럼 받기**(실패는 throw)
- “여러 단계 순차”는 `try/catch`로 **전체 플로우를 한 방에**
- 의존 없으면 `Promise.all`로 병렬 처리해서 성능 확보
