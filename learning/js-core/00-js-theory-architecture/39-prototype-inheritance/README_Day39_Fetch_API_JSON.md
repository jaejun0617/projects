# Day 39 — Fetch API & JSON  
**Mon, Feb 2, 2026**  
**Topic:** Fetch API & JSON  
**Goal:** JSONPlaceholder API에서 게시글을 가져와 **카드 UI**로 렌더링

---

## ✅ 오늘의 결론 (한 줄)
`fetch`는 **네트워크 요청을 Promise로 다루는 표준 API**이고, **HTTP 성공/실패는 `response.ok`로 판단**한다. JSON은 `response.json()`으로 **문자열 → 객체**로 바꿔 UI에 렌더링한다.

---

## 🎯 미션 목표
- `fetch()`로 `GET /posts` 호출
- `response.ok`로 HTTP 성공 여부 체크
- `response.json()`으로 JSON 파싱
- 게시글을 **카드 UI**로 렌더링 (`title`, `body`)
- 로딩/에러/성공 상태를 분리해서 UI 흐름을 예측 가능하게 만들기

---

## 🧠 핵심 개념 보강 (실무 기준)

### 1) HTTP = Request ↔ Response 계약
클라이언트(브라우저)가 서버에 **요청(Request)**을 보내고, 서버가 **응답(Response)**을 준다.

요청을 구성하는 4요소:
- **URL**: 어디로 보낼지 (`/posts`)
- **Method**: 무엇을 할지 (`GET`, `POST`, `PATCH`, ...)
- **Headers**: 형식/권한/캐시 같은 부가정보
- **Body**: 실제 데이터(주로 POST/PUT/PATCH)

오늘은 **GET**이라 body가 없고, 목록 조회가 목적이다.

---

### 2) HTTP Method 의미(REST 관점)
- **GET**: 조회(Read)
- **POST**: 생성(Create)
- **PUT**: 전체 수정(리소스 통째로 교체)
- **PATCH**: 부분 수정(실무에서 자주 씀)
- **DELETE**: 삭제(Delete)

✅ 오늘 미션은 **GET /posts**.

---

### 3) Status Code = 서버의 “결과 메시지”
- **2xx** 성공 (200 OK)
- **3xx** 리다이렉트
- **4xx** 클라이언트 오류 (401/403/404…)
- **5xx** 서버 오류 (500/503…)

#### ⚠️ 실무 핵심: `fetch`는 404여도 reject가 아니다
`fetch()`는 **네트워크 레벨 실패**(DNS/연결 실패 등)만 reject로 처리하는 경우가 많다.  
즉, **HTTP 404/500도 “응답을 받았기 때문에” resolve**될 수 있다.

그래서 실무는 거의 항상 이렇게 간다:

```js
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
```

---

### 4) Headers = “형식/권한/캐시” 힌트
자주 쓰는 헤더:
- `Accept`: 나는 이런 응답 형식을 원한다(보통 JSON)
- `Content-Type`: 내가 보내는 body 형식(POST/PATCH에서 중요)
- `Authorization`: 인증/토큰

GET만 하는 오늘 미션은 `Accept: application/json` 정도만 있어도 충분.

---

### 5) JSON은 “문자열 포맷”이다
JSON은 JS 객체처럼 보이지만 실제로는 **문자열로 직렬화된 데이터 포맷**.

- `JSON.parse(jsonString)` : 문자열 → 객체
- `JSON.stringify(obj)` : 객체 → 문자열

`response.json()`은 내부적으로 JSON을 파싱해서 **객체/배열**로 만들어 준다.

```js
const data = await res.json(); // Array<{ userId, id, title, body }>
```

---

### 6) UI는 3가지 상태로 관리하면 절대 안 꼬인다
실무 UI는 거의 무조건 아래 3상태를 갖는다.

- **Loading**: 요청 중(스피너/문구)
- **Success**: 데이터 렌더
- **Error**: 실패 문구 + 재시도

이 3가지만 분리해도 코드가 “예측 가능”해진다.

---

### 7) 보안 습관: `innerHTML` 남발 금지
서버에서 받은 문자열을 `innerHTML`로 넣으면 **XSS 위험**이 생긴다.  
기본은 **`textContent`**.

✅ 안전한 렌더링 기본:
- `createElement`
- `textContent`
- `appendChild / append`
- (성능) `DocumentFragment`

---

### 8) 비동기 흐름의 표준 형태(실무 패턴)
- `try/catch/finally`
- `finally`에서 로딩 끄기
- `catch`에서 상태 초기화/메시지 세팅

```js
state.loading = true;
try { ... }
catch (e) { ... }
finally { state.loading = false; }
```

---

## 🏗️ 요구사항 체크리스트
- [ ] `GET https://jsonplaceholder.typicode.com/posts` 호출
- [ ] `response.ok` 체크
- [ ] `response.json()`으로 파싱
- [ ] 카드 UI 렌더링 (title/body)
- [ ] 로딩/에러 UI 처리
- [ ] 렌더링 중복 방지(컨테이너 비우기)
- [ ] `textContent` 사용

---

## 🧩 추천 구조(실전형)
**State → Render → Action** 패턴으로 간다.

1) DOM 캐싱  
2) state: `{ loading, error, posts }`  
3) `fetchPosts()`에서 데이터 로드  
4) `render()`는 state만 보고 화면 갱신  

---

## 💻 정답급 예시 코드 (index.html 1파일)

> 복붙 후 실행 → 화면에서 카드 확인 + 콘솔 확인

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Day 39 - Fetch & JSON</title>
  <style>
    body { font-family: system-ui, -apple-system, Arial, sans-serif; margin: 24px; }
    header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom: 16px; }
    .btn { padding: 10px 14px; border: 1px solid #ddd; border-radius: 10px; background: #fff; cursor: pointer; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
    .card { border: 1px solid #eee; border-radius: 14px; padding: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); background: #fff; }
    .card h3 { margin: 0 0 8px; font-size: 16px; line-height: 1.3; }
    .card p { margin: 0; color: #444; font-size: 14px; line-height: 1.5; white-space: pre-line; }
    .muted { color: #666; }
    .error { color: #b00020; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1 style="margin:0;">Posts</h1>
      <div id="status" class="muted">대기중</div>
    </div>
    <div style="display:flex; gap:8px;">
      <button id="reloadBtn" class="btn" type="button">다시 불러오기</button>
      <button id="clearBtn" class="btn" type="button">비우기</button>
    </div>
  </header>

  <main>
    <div id="posts" class="grid"></div>
  </main>

  <script>
    // ===== 0) 상수/DOM 캐싱 =====
    const API_URL = "https://jsonplaceholder.typicode.com/posts";
    const $status = document.getElementById("status");
    const $posts = document.getElementById("posts");
    const $reloadBtn = document.getElementById("reloadBtn");
    const $clearBtn = document.getElementById("clearBtn");

    // ===== 1) 상태(State) =====
    const state = {
      loading: false,
      error: null,
      posts: [],
    };

    // ===== 2) 렌더(Render) =====
    function setStatus(text, type) {
      $status.textContent = text;
      $status.className = type === "error" ? "error" : "muted";
    }

    function renderPosts(posts) {
      $posts.innerHTML = ""; // 중복 방지

      const frag = document.createDocumentFragment();

      posts.forEach((post) => {
        const card = document.createElement("article");
        card.className = "card";

        const title = document.createElement("h3");
        title.textContent = post.title;

        const body = document.createElement("p");
        body.textContent = post.body;

        card.appendChild(title);
        card.appendChild(body);
        frag.appendChild(card);
      });

      $posts.appendChild(frag);
    }

    function render() {
      $reloadBtn.disabled = state.loading;

      if (state.loading) {
        setStatus("로딩중...", "muted");
        return;
      }

      if (state.error) {
        setStatus(`에러: ${state.error}`, "error");
        return;
      }

      setStatus(`성공: ${state.posts.length}개`, "muted");
      renderPosts(state.posts);
    }

    // ===== 3) 데이터 로드(Action) =====
    async function fetchPosts() {
      state.loading = true;
      state.error = null;
      render();

      try {
        const res = await fetch(API_URL, {
          method: "GET",
          headers: { "Accept": "application/json" },
        });

        // ✅ fetch는 404여도 reject가 아님 → ok 체크 필수
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }

        const data = await res.json(); // JSON -> JS 객체
        state.posts = data;            // 필요하면 data.slice(0, 10)
      } catch (err) {
        state.error = err?.message ?? String(err);
        state.posts = [];
      } finally {
        state.loading = false;
        render();
      }
    }

    // ===== 4) 이벤트 =====
    $reloadBtn.addEventListener("click", fetchPosts);

    $clearBtn.addEventListener("click", () => {
      state.posts = [];
      state.error = null;
      state.loading = false;
      $posts.innerHTML = "";
      setStatus("비움", "muted");
      $reloadBtn.disabled = false;
    });

    // ===== 5) 시작 =====
    fetchPosts();
  </script>
</body>
</html>
```

---

## 🔥 실무 업그레이드(선택)

### A) 일부만 렌더링(성능/UX)
```js
state.posts = data.slice(0, 10);
```

### B) 중복 요청 취소(AbortController)
버튼 연타/페이지 이동에서 안정성을 올릴 때 사용.

```js
let controller = null;

async function fetchPosts() {
  if (controller) controller.abort();
  controller = new AbortController();

  const res = await fetch(API_URL, { signal: controller.signal });
}
```

### C) 에러 유형 분리(디버깅 쉬움)
- HTTP 에러(4xx/5xx)
- 네트워크 에러
- JSON 파싱 에러

---

## ✅ 제출 기준(실무형)
- `response.ok` 체크 + 실패 시 에러 UI 표시
- 로딩/성공/에러 3상태가 명확
- 렌더링은 `textContent` 기반
- 중복 렌더링/중복 요청 버그 없음

---

## 🔍 참고 키워드
- `fetch response.ok`
- `HTTP status code 4xx 5xx`
- `JSON stringify parse`
- `AbortController fetch`
- `CORS`
