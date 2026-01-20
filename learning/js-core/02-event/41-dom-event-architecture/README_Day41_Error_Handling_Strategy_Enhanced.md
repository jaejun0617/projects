# Day 41 — Error Handling Strategy
**Wed, Feb 4, 2026**  
네트워크 끊김 / API 오류 발생 시 사용자에게 **예쁜 에러 모달**을 띄우는 처리 (Vanilla JS)

---

## 🎯 오늘의 “진짜 목표”
에러 처리는 **기능 구현**이 아니라 **UX 설계**다.

- 사용자는 **친절한 메시지 + 다음 행동(재시도/닫기)** 를 받는다.
- 개발자는 **원인(로그/스택/상태/요청 정보)** 를 남겨서 재현·수정한다.
- 동기/비동기 어디서 터져도 **같은 UI(에러 모달)** 로 통일한다.

---

## ✅ 오늘 결과물 체크리스트 (필수)
- [ ] 네트워크 끊김/타임아웃에서 **모달** 표시
- [ ] HTTP 4xx/5xx에서 `response.ok` 체크 후 **모달** 표시
- [ ] JSON 파싱/데이터 형식 문제도 **모달** 표시
- [ ] 로컬(기능단 try/catch)에서 잡은 에러는 **원하면 모달로도, 콘솔만도** 선택 가능
- [ ] 전역(Global)에서 `window.onerror`, `unhandledrejection`로 **마지막 안전망**
- [ ] 사용자 메시지(친절) / 개발자 정보(상세) **분리**
- [ ] (선택) 재시도 버튼 + 이전 요청 재실행
- [ ] (선택) ESC 닫기 + 포커스 처리(접근성)

---

# 1) 🧠 핵심 이론 보강 (실무 기준)

## 1-1. 에러를 “분류”해야 전략이 선다
프론트에서 자주 만나는 에러 4종(최소):

### A. Network Error (네트워크/환경)
- 인터넷 끊김, DNS, CORS, 타임아웃, Abort
- 특징: 응답을 못 받거나 `fetch()`가 **reject** / AbortError
- UX: “연결을 확인 후 다시 시도”

### B. HTTP Error (상태 코드)
- 서버는 응답했지만 2xx가 아님(404/500 등)
- ⚠️ 핵심: `fetch()`는 404/500에서도 **reject가 아니라 resolve** 됨 → `response.ok` 필수
- UX: “서버 응답에 문제가 있어요. 잠시 후 다시 시도”

### C. Parse/Data Error (파싱/스키마)
- `res.json()` 실패, 기대 필드 누락/타입 불일치
- UX: “데이터 형식 오류. 다시 시도”

### D. Runtime Error (코드 버그)
- `undefined is not a function`, null 접근 등
- UX: “예상치 못한 오류”

> 분류 목적: **사용자 메시지/재시도 전략/로그 레벨**을 다르게 하기 위함.

---

## 1-2. 3층 구조로 잡으면 실무처럼 된다
### 1층 — Local(기능 단)
- API 호출/DOM 조작 등 “터질 구간”을 `try/catch`로 감싼다.
- 실패 시: 모달 띄우기 + 필요하면 재시도 가능하게.

### 2층 — Common Wrapper(공통 유틸)
- `safeFetchJson()` 같은 래퍼에서
  - `ok` 체크
  - 타임아웃
  - JSON 파싱
  - 에러 타입 표준화
  를 통일한다.

### 3층 — Global Safety Net(전역 안전망)
- 로컬에서 누락된 에러를 **마지막으로** 잡아 같은 모달 UX로 보여준다.
  - 동기: `window.onerror`
  - 비동기: `unhandledrejection`

> 원칙: **로컬이 1순위**, 글로벌은 “마지막 그물망”.

---

## 1-3. 사용자 메시지 vs 개발자 정보 분리 원칙
- 사용자: **짧고 행동 지향**
  - “네트워크가 불안정해요. 다시 시도해주세요.”
- 개발자: **원인 + 상황**
  - type/status/url/requestId/stack/cause

> 모달에 `TypeError: ...` 같은 기술 용어를 그대로 노출하지 않는다.

---

# 2) 🧱 설계: AppError로 에러 “표준화”
에러가 통일되면 UI/로깅/재시도 구현이 쉬워진다.

```js
class AppError extends Error {
  constructor(userMessage, { type = "unknown", status = null, cause = null, meta = {} } = {}) {
    super(userMessage);          // 사용자에게 보여줄 메시지
    this.name = "AppError";
    this.type = type;            // network | http | parse | runtime | unknown
    this.status = status;        // HTTP status
    this.cause = cause;          // 원본 에러(Error)
    this.meta = meta;            // 부가 정보(url, method, requestId, ...)
  }
}
```

### ✅ toAppError: 어떤 에러든 AppError로 변환
```js
function toAppError(err, meta = {}) {
  if (err instanceof AppError) return err;

  // fetch 네트워크 실패는 브라우저에서 TypeError로 오는 경우가 많음
  if (err instanceof TypeError) {
    return new AppError("네트워크 연결에 문제가 있어요. 연결을 확인 후 다시 시도해 주세요.", {
      type: "network",
      cause: err,
      meta
    });
  }

  return new AppError("예상치 못한 오류가 발생했어요. 다시 시도해 주세요.", {
    type: "unknown",
    cause: err,
    meta
  });
}
```

---

# 3) 🧰 공통 요청 래퍼: safeFetchJson
**실무 핵심:** `fetch`는 HTTP 에러를 reject로 주지 않기 때문에 **ok 체크 + 에러 표준화**가 필수.

```js
async function safeFetchJson(url, { timeoutMs = 8000, ...options } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const meta = {
    url,
    method: options.method ?? "GET",
    timeoutMs
  };

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });

    // ✅ HTTP 에러 처리: ok 체크
    if (!res.ok) {
      throw new AppError("서버 응답에 문제가 있어요. 잠시 후 다시 시도해 주세요.", {
        type: "http",
        status: res.status,
        meta: { ...meta, statusText: res.statusText }
      });
    }

    // ✅ JSON 파싱 에러 분리
    try {
      return await res.json();
    } catch (e) {
      throw new AppError("데이터 형식을 읽을 수 없어요. 잠시 후 다시 시도해 주세요.", {
        type: "parse",
        cause: e,
        meta
      });
    }
  } catch (e) {
    // ✅ 타임아웃/취소
    if (e?.name === "AbortError") {
      throw new AppError("요청 시간이 초과됐어요. 네트워크를 확인 후 다시 시도해 주세요.", {
        type: "network",
        cause: e,
        meta
      });
    }

    throw toAppError(e, meta);
  } finally {
    clearTimeout(timeoutId);
  }
}
```

---

# 4) 🪟 에러 모달 UI 설계 (접근성 포함)

## 4-1. UX 요구사항(실무형)
- backdrop 클릭 닫기
- 닫기 버튼
- (선택) 재시도 버튼(직전 액션 재실행)
- (선택) ESC 닫기
- (권장) 모달 열리면 포커스 이동 + 닫히면 원래 포커스 복귀

## 4-2. HTML
```html
<button id="syncErrorBtn">동기 오류 발생(전역)</button>
<button id="asyncErrorBtn">비동기 오류 발생(전역)</button>
<button id="localCatchBtn">로컬 try/catch</button>

<div id="errorBackdrop" class="hidden"></div>

<div id="errorModal"
     class="hidden"
     role="dialog"
     aria-modal="true"
     aria-labelledby="errorTitle"
     aria-describedby="errorMessage">
  <h2 id="errorTitle">문제가 발생했어요</h2>
  <p id="errorMessage"></p>

  <div class="actions">
    <button id="retryBtn" type="button" class="secondary">다시 시도</button>
    <button id="closeModalBtn" type="button">닫기</button>
  </div>

  <details class="dev">
    <summary>개발자 정보</summary>
    <pre id="errorDetails"></pre>
  </details>
</div>
```

## 4-3. CSS (예쁜 기본)
```css
.hidden { display: none; }

#errorBackdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
}

#errorModal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.25);
}

#errorModal h2 { margin: 0 0 10px; }
#errorModal p { margin: 0 0 14px; line-height: 1.5; }

#errorModal .actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

#errorModal button {
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

#errorModal .secondary { background: #eee; }

#errorModal .dev { margin-top: 14px; opacity: 0.9; }

#errorDetails {
  white-space: pre-wrap;
  word-break: break-word;
  background: #f6f6f6;
  padding: 10px;
  border-radius: 10px;
}
```

---

# 5) 🧠 모달 컨트롤: 단 하나의 “에러入口”
모달 띄우는 함수를 **openErrorModal() 하나로 통일**.

```js
const $ = (id) => document.getElementById(id);

const backdrop = $("errorBackdrop");
const modal = $("errorModal");
const messageEl = $("errorMessage");
const detailsEl = $("errorDetails");
const closeBtn = $("closeModalBtn");
const retryBtn = $("retryBtn");

let lastRetry = null;
let lastFocus = null;

function openErrorModal(err, { retry = null } = {}) {
  const appErr = toAppError(err);

  // 사용자 메시지
  messageEl.textContent = appErr.message;

  // 개발자 정보(디버깅용)
  detailsEl.textContent = JSON.stringify({
    name: appErr.name,
    type: appErr.type,
    status: appErr.status,
    meta: appErr.meta,
    cause: appErr.cause ? String(appErr.cause) : null
  }, null, 2);

  lastRetry = typeof retry === "function" ? retry : null;
  retryBtn.style.display = lastRetry ? "inline-block" : "none";

  // 접근성: 포커스 이동/복귀
  lastFocus = document.activeElement;
  backdrop.classList.remove("hidden");
  modal.classList.remove("hidden");
  closeBtn.focus();
}

function closeErrorModal() {
  backdrop.classList.add("hidden");
  modal.classList.add("hidden");
  lastRetry = null;

  if (lastFocus && typeof lastFocus.focus === "function") {
    lastFocus.focus();
  }
  lastFocus = null;
}

closeBtn.addEventListener("click", closeErrorModal);
backdrop.addEventListener("click", closeErrorModal);

// (선택) ESC 닫기
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeErrorModal();
});

// 재시도
retryBtn.addEventListener("click", async () => {
  if (!lastRetry) return;
  closeErrorModal();
  try {
    await lastRetry();
  } catch (e) {
    openErrorModal(e, { retry: lastRetry });
  }
});
```

---

# 6) 🌍 Global Error Boundary (전역 안전망)

## 6-1. 동기 전역 에러
```js
window.onerror = function (message, source, lineno, colno, error) {
  const err = error ?? new Error(String(message));
  openErrorModal(toAppError(err));
  return true; // 브라우저 기본 핸들러를 막고 싶으면 true
};
```

## 6-2. 비동기 전역 에러(미처리 Promise)
```js
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
  openErrorModal(toAppError(reason));
  event.preventDefault();
});
```

> 전역은 “누락”을 잡는 용도. 가능하면 로컬에서 try/catch로 처리.

---

# 7) 🧪 미션용 버튼(에러 시뮬레이션)
```js
document.getElementById("syncErrorBtn").addEventListener("click", () => {
  throw new Error("강제 동기 에러!");
});

document.getElementById("asyncErrorBtn").addEventListener("click", () => {
  // 일부러 catch를 붙이지 않음 -> unhandledrejection 유도
  safeFetchJson("https://jsonplaceholder.typicode.com/invalid-endpoint");
});

document.getElementById("localCatchBtn").addEventListener("click", () => {
  try {
    throw new Error("로컬에서 잡는 에러!");
  } catch (e) {
    console.warn("로컬 캐치:", e.message);
    // 필요하면: openErrorModal(e);  // “로컬도 같은 UX”로 통일하고 싶을 때
  }
});
```

---

# 8) 🔥 실무 보강 포인트(하면 티 남)

## 8-1. “재시도”를 진짜로 연결하는 패턴
에러 모달을 열 때 **직전 액션 함수**를 넘긴다.

```js
async function loadPosts() {
  const data = await safeFetchJson("https://jsonplaceholder.typicode.com/posts");
  console.log(data);
}

document.getElementById("loadBtn").addEventListener("click", async () => {
  try {
    await loadPosts();
  } catch (e) {
    openErrorModal(e, { retry: loadPosts });
  }
});
```

## 8-2. 로깅 전략(개발자용)
- 콘솔: 개발 중
- 실제 서비스: 서버 로깅(Sentry 등)로 `type/status/url/stack/userAgent` 보내기

## 8-3. 에러 메시지 템플릿(추천)
- network: “연결 확인 후 다시 시도”
- http 401/403: “로그인이 필요해요”
- http 404: “요청한 정보를 찾을 수 없어요”
- http 5xx: “서버가 불안정해요”
- parse/data: “데이터 형식 문제”
- runtime: “예상치 못한 오류”

---

# 9) ✅ 제출 기준(완벽 기준)
- 에러 타입 분류(AppError)로 **UI/로그 표준화**
- `safeFetchJson`에서 `ok 체크 + timeout + json parse` 처리
- 전역 핸들러 2종(window.onerror / unhandledrejection)
- 모달 닫기 UX(backdrop/버튼/ESC) + (선택) 재시도
- 사용자 메시지와 개발자 정보 분리

---

## 오늘의 핵심 한 줄
**에러는 “잡는 것”이 아니라 “사용자 경험으로 디자인하는 것”이다.**
