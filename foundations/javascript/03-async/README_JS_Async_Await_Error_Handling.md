# README — Async/Await 에러 처리 전략 (try/catch 설계) 완전판

> 목표: `try/catch`를 “문법”이 아니라 **에러 전파/복구/UX/관측(로그)**까지 포함한 **설계 도구**로 쓰기.

---

## 0) 핵심 한 줄

- **catch는 “잡기”가 아니라 “의미 있는 처리 후 재던지기(또는 복구)”가 목적**이다.
- **에러는 빨리 실패(fail fast), 경계에서만 처리(handle at boundary)**가 기본 전략이다.

---

## 1) 왜 async/await 에러 처리가 중요한가

### 1-1. async 함수는 “Promise를 반환”한다
- `async function f()`는 항상 Promise를 반환한다.
- 함수 내부에서 `throw`하면 **그 Promise는 reject**된다.
- `await`는 **reject를 throw로 바꿔서** 현재 스택에서 예외처럼 다룰 수 있게 만든다.

```js
async function f() {
  throw new Error("boom"); // => Promise.reject
}

(async () => {
  try {
    await f();             // reject => throw
  } catch (e) {
    console.error(e);
  }
})();
```

---

## 2) 에러 처리의 “3계층 설계” (실무 기준)

에러 처리는 계층별로 역할이 다르다.

### 2-1. Domain(도메인) 계층: 의미 있는 에러 만들기
- HTTP/네트워크 에러를 “도메인 문제”로 바꿔야 UI가 안정적이다.
- 예: `NotFoundError`, `AuthError`, `ValidationError`, `RateLimitError`

```js
class HttpError extends Error {
  constructor(message, { status, code, cause } = {}) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.cause = cause;
  }
}
```

### 2-2. Service(서비스) 계층: 변환 + 전파
- 여기서는 **에러를 삼키지 않는다.**
- 필요하면 에러를 “정규화(normalize)”한다.

```js
function normalizeError(err) {
  if (err instanceof HttpError) return err;

  // fetch 실패(네트워크) 등
  return new HttpError("Network or unknown error", {
    status: 0,
    code: "NETWORK_ERROR",
    cause: err,
  });
}
```

### 2-3. UI/Boundary(경계) 계층: 사용자 경험(UX) 처리
- 로딩/토스트/리트라이/에러 화면은 여기서.
- **여기서만 “잡고 끝내기”가 허용**된다.

---

## 3) try/catch “어디에” 두는가: 경계에만 둔다

### 3-1. 안 좋은 패턴: 모든 함수에 try/catch
- 문제: 에러가 어디서 사라졌는지 추적 불가, 로직 중복, 관측 불가

```js
async function getUser() {
  try {
    return await fetchUser();
  } catch (e) {
    console.log(e); // 그냥 로그만 남기고
    return null;    // 에러를 삼켜버림(원인 은폐)
  }
}
```

### 3-2. 좋은 패턴: 도메인/서비스에서는 throw, UI에서 handle
```js
async function fetchJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new HttpError("Request failed", { status: res.status, code: "HTTP_ERROR" });
  }
  return res.json();
}

async function loadUserUI(userId) {
  try {
    const data = await fetchJson(`/api/users/${userId}`);
    render(data);
  } catch (e) {
    const err = normalizeError(e);
    showErrorUI(err);
  }
}
```

---

## 4) try/catch 설계 패턴 8가지 (실전)

### 패턴 1) “변환 후 재던지기” (log + rethrow)
- 로그는 남기되, 상위에서 처리할 수 있게 한다.

```js
async function serviceCall() {
  try {
    return await fetchJson("/api/data");
  } catch (e) {
    const err = normalizeError(e);
    console.error("[serviceCall]", err);
    throw err; // ✅ 핵심
  }
}
```

### 패턴 2) “선택적 복구(fallback)” (에러를 값으로 바꾸기)
- 캐시/디폴트/부분 데이터로 UX 유지가 가능할 때만.

```js
async function getProfileWithFallback() {
  try {
    return await fetchJson("/api/profile");
  } catch (e) {
    const err = normalizeError(e);
    if (err.code === "NETWORK_ERROR") {
      return { name: "Guest", cached: true };
    }
    throw err;
  }
}
```

### 패턴 3) “사용자 취소”는 에러가 아니다 (AbortController)
- **취소는 정상 흐름**으로 취급하고, UI를 깨지지 않게 한다.

```js
function isAbortError(e) {
  return e?.name === "AbortError";
}

async function loadWithAbort(signal) {
  try {
    const res = await fetch("/api/search", { signal });
    return await res.json();
  } catch (e) {
    if (isAbortError(e)) return null; // ✅ 취소는 조용히 종료
    throw normalizeError(e);
  }
}
```

### 패턴 4) “에러 타입 분기” (정확한 UX)
```js
function showErrorUI(err) {
  if (err.status === 401) return openLoginModal();
  if (err.status === 404) return showNotFound();
  if (err.code === "NETWORK_ERROR") return showToast("네트워크를 확인해 주세요.");
  return showToast("문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
}
```

### 패턴 5) “finally는 정리(cleanup)만” 한다
- `finally`에서 `return`/`throw`를 하면 **원래 에러가 덮인다(매우 위험)**

```js
async function bad() {
  try {
    await fetchJson("/api/data");
  } finally {
    return "ok"; // ❌ 원래 에러를 덮어버림
  }
}
```

✅ 올바른 사용:
```js
async function good(setLoading) {
  setLoading(true);
  try {
    return await fetchJson("/api/data");
  } finally {
    setLoading(false); // ✅ cleanup only
  }
}
```

### 패턴 6) “병렬 처리에서 에러 폭발” 제어 (Promise.all)
- 하나라도 실패하면 전체 reject. 실패 정책을 명확히 해야 한다.

```js
async function loadAll() {
  try {
    const [a, b] = await Promise.all([fetchJson("/a"), fetchJson("/b")]);
    return { a, b };
  } catch (e) {
    throw normalizeError(e);
  }
}
```

부분 성공 허용이면 `allSettled`로 전환:
```js
async function loadPartial() {
  const results = await Promise.allSettled([fetchJson("/a"), fetchJson("/b")]);
  const ok = results.filter(r => r.status === "fulfilled").map(r => r.value);
  const fail = results.filter(r => r.status === "rejected").map(r => normalizeError(r.reason));
  return { ok, fail };
}
```

### 패턴 7) “에러 래핑” (원인 보존)
- 최신 런타임에서는 `new Error(msg, { cause })` 패턴을 쓸 수 있다(지원 범위는 환경에 따라 다름).

```js
try {
  await serviceCall();
} catch (e) {
  throw new Error("Failed to load user", { cause: e });
}
```

호환성이 필요하면 직접 `cause`를 넣어라(앞의 HttpError 참고).

### 패턴 8) “리트라이 정책” (조건/횟수/지연)
- 무조건 리트라이는 서버를 더 아프게 만든다.
- 네트워크/502/503/504 등 **일시 장애**에만 제한적으로.

```js
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function retry(fn, { retries = 2, delay = 300 } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); }
    catch (e) {
      lastErr = normalizeError(e);
      const retriable = lastErr.code === "NETWORK_ERROR" || [502,503,504].includes(lastErr.status);
      if (!retriable || i === retries) throw lastErr;
      await sleep(delay * (i + 1));
    }
  }
  throw lastErr;
}
```

---

## 5) 흔한 실수 Top 10 (체크리스트)

1. `catch`에서 **에러를 삼키고** `null`/`[]`로 돌려버림  
2. `finally`에서 `return`/`throw`로 **원래 에러를 덮음**  
3. 모든 함수에 try/catch를 넣어 **경계가 사라짐**  
4. `Promise.all` 실패 정책 없이 병렬 처리  
5. 네트워크 취소(Abort)를 일반 에러처럼 처리  
6. 사용자 메시지에 **원문 에러를 그대로 노출**  
7. 로딩 상태 해제 누락(실패 시 스피너 무한)  
8. 재시도 정책 없이 무한 리트라이  
9. `console.log`만 하고 “무슨 상황인지” 컨텍스트 없음  
10. 에러 타입/코드가 없어서 UI에서 분기 불가

---

## 6) 권장 템플릿 (바로 복붙용)

### 6-1. Fetch + Error Normalize + UI Boundary
```js
class AppError extends Error {
  constructor(message, { code, status, cause } = {}) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.cause = cause;
  }
}

function normalizeError(err) {
  if (err instanceof AppError) return err;
  return new AppError("Unknown error", { code: "UNKNOWN", status: 0, cause: err });
}

async function fetchJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new AppError("HTTP error", { code: "HTTP_ERROR", status: res.status });
  return res.json();
}

// boundary
async function runTask(setLoading) {
  setLoading(true);
  try {
    const data = await fetchJson("/api/data");
    return data;
  } catch (e) {
    const err = normalizeError(e);
    showErrorUI(err);
    return null; // boundary에서는 “잡고 끝내기” 허용
  } finally {
    setLoading(false);
  }
}
```

---

## 7) 다음 단계 추천
- **비동기 성능/정책**: 병렬 vs 순차, 백프레셔, 큐(Queue)
- **에러 관측**: 로그 컨텍스트, 사용자 세션/트레이싱
- **React 적용**: `useEffect` cleanup(Abort), 에러 바운더리 전략

---

## 8) 요약
- try/catch는 “여기저기 넣기”가 아니라 **경계에서 UX를 완성**하는 장치다.
- 도메인/서비스 계층에서는 **정규화 + 재던지기**가 기본.
- `finally`는 정리만, `AbortError`는 정상 흐름.
- 병렬 처리(`all`, `allSettled`)는 **실패 정책이 설계의 핵심**이다.
