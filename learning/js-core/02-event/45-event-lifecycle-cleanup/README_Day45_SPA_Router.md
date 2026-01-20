# Day 45 — SPA Routing Principle  
**Sun, Feb 8, 2026**

새로고침 없이 URL이 바뀌고 페이지 내용이 변경되는 **'SPA 라우터'** 직접 구현

---

## 🧠 오늘의 핵심 요약 (한 줄)
> **SPA 라우팅 = “페이지는 그대로(1개) 두고, URL과 화면만 ‘동기화’하는 기술”**

---

## 🎯 미션 목표
- **History API**로 새로고침 없이 URL 변경하기 (`pushState`)
- 브라우저 **뒤로/앞으로가기**를 감지하기 (`popstate`)
- URL(`location.pathname`)에 따라 **화면(#app)과 document.title**을 렌더링하기
- `<a>` 링크 클릭을 **가로채서** SPA 방식으로 전환하기 (`preventDefault`)

---

## 📌 왜 이걸 배우는가 (실무 관점)
- MPA: 링크 클릭 → 서버에 새 HTML 요청 → 전체 리로드(깜빡임)
- SPA: **한 HTML** 안에서 필요한 영역만 바꿈 → 앱처럼 부드러움
- React Router / Vue Router 같은 라우터도 내부적으로 **History API + popstate**로 동작

---

## 🧩 핵심 이론 정리

### 1️⃣ MPA vs SPA
**MPA (Multi Page Application)**
- 페이지마다 HTML이 따로 존재
- 이동 시 전체 문서가 교체됨

**SPA (Single Page Application)**
- HTML은 1개
- 화면 전환은 JS가 DOM 일부만 갈아끼움
- 그래서 “페이지 이동처럼 보이는 것”을 **직접 구현**해야 함 → 라우터

---

### 2️⃣ History API (진짜 핵심)
브라우저는 **히스토리 스택**(뒤로/앞으로가기)을 관리한다.  
History API는 이 스택을 **리로드 없이** 조작한다.

#### `history.pushState(state, title, url)`
- **URL 변경 + 히스토리 스택에 기록 추가**
- **리로드 없음**
- SPA에서 “이동”을 만드는 메서드

```js
history.pushState({ path: "/about" }, "", "/about");
```

#### `history.replaceState(state, title, url)`
- 현재 기록을 **교체(덮어쓰기)**
- 로그인 후 리다이렉트 같은 “뒤로가기 방지”에 자주 씀

```js
history.replaceState({ path: "/" }, "", "/");
```

#### `popstate` 이벤트
- 사용자가 **뒤로/앞으로가기**를 눌러 히스토리가 바뀌면 발생
- 여기서 **현재 URL에 맞게 다시 렌더링**해야 함

```js
window.addEventListener("popstate", () => {
  render();
});
```

---

### 3️⃣ location.pathname (라우팅 기준값)
- 현재 주소의 **경로(path)** 만 가져온다
- 예: `https://site.com/about?x=1#top`
  - `pathname` → `/about`
  - `search` → `?x=1`
  - `hash` → `#top`

```js
console.log(location.pathname);
```

---

### 4️⃣ 라우터가 하는 일 (정확한 정의)
라우터는 결국 이 2가지를 “동기화”한다:

1) **URL → 화면** (주소가 바뀌면 화면도 바뀐다)  
2) **화면 전환 → URL** (클릭으로 화면을 바꾸면 주소도 바뀐다)

---

## ⚠️ 실무에서 자주 터지는 포인트 (핵심 개념 보강)

### A) `<a>` 클릭 기본 동작을 반드시 막아야 함
`<a href="/about">`는 기본적으로 서버에 요청한다 → **리로드 발생**  
그래서 SPA에서는:

- `event.preventDefault()`로 기본 이동 막기
- `pushState`로 URL만 바꾸기
- `render()`로 화면 바꾸기

---

### B) “내부 링크만” 가로채야 한다
아래는 SPA로 가로채면 안 됨:
- `target="_blank"` (새 탭 이동 의도)
- `download` 속성
- 외부 링크 (`https://...`)
- `mailto:`, `tel:` 같은 프로토콜

---

### C) 서버 설정(정적 배포) 이슈
SPA는 `/about`로 직접 새로고침하면 서버가 `/about` 파일을 찾으려 한다.  
실무 배포에서는 “모든 경로를 index.html로 보내는 설정”이 필요하다.  
(오늘 미션은 로컬 단일 HTML 기준이므로 개념만 기억)

---

## 🏗️ 미션 구현 (단일 HTML + script)

아래는 **요구사항을 모두 충족하는 최소 + 정석 구현**이다.

### ✅ index.html (한 파일로 완성)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My SPA</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
    nav { display: flex; gap: 12px; margin-bottom: 16px; }
    a { text-decoration: none; }
    a.active { font-weight: 700; text-decoration: underline; }
    #app { padding: 16px; border: 1px solid #ddd; border-radius: 12px; }
  </style>
</head>
<body>
  <h1>SPA Routing Principle</h1>

  <nav>
    <a href="/" data-link>Home</a>
    <a href="/about" data-link>About</a>
    <a href="/contact" data-link>Contact</a>
  </nav>

  <div id="app"></div>

  <script>
    // 1) 라우트 테이블 (URL -> {title, content})
    const routes = {
      "/": {
        title: "홈 | My SPA",
        content: "<h1>홈</h1><p>이곳은 홈 페이지입니다.</p>",
      },
      "/about": {
        title: "About | My SPA",
        content: "<h1>About</h1><p>우리는 이런 팀입니다.</p>",
      },
      "/contact": {
        title: "Contact | My SPA",
        content: "<h1>Contact</h1><p>연락을 기다립니다.</p>",
      },
    };

    const $app = document.getElementById("app");

    // 2) 현재 URL을 읽어서 렌더링하는 함수
    function render() {
      const path = location.pathname;
      const route = routes[path];

      // 404 처리
      if (!route) {
        document.title = "404 | My SPA";
        $app.innerHTML = "<h1>404</h1><p>페이지를 찾을 수 없습니다.</p>";
        setActiveNav(path);
        return;
      }

      document.title = route.title;
      $app.innerHTML = route.content;
      setActiveNav(path);
    }

    // 3) URL 변경(리로드 없이) + 렌더
    function navigate(to) {
      history.pushState({ path: to }, "", to);
      render();
    }

    // 4) 링크 클릭 가로채기 (내부 링크만)
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-link]");
      if (!link) return;

      // (선택) 예외 케이스 방어
      if (link.target === "_blank") return;
      if (link.hasAttribute("download")) return;

      const href = link.getAttribute("href");

      // 외부/특수 링크 방어 (이번 미션은 내부만이라 단순 처리)
      if (!href || !href.startsWith("/")) return;

      e.preventDefault();
      navigate(href);
    });

    // 5) 뒤로/앞으로가기 처리
    window.addEventListener("popstate", () => {
      render();
    });

    // 6) 네비게이션 active 표시 (UX)
    function setActiveNav(path) {
      document.querySelectorAll("a[data-link]").forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === path);
      });
    }

    // 7) 초기 로딩 시 현재 URL에 맞춰 렌더
    render();
  </script>
</body>
</html>
```

---

## ✅ 요구사항 체크리스트
- [x] 단일 HTML 파일
- [x] `#app`에 동적 렌더
- [x] `/`, `/about`, `/contact` 3개 페이지
- [x] 클릭 시 리로드 없이 URL 변경 (`pushState`)
- [x] 뒤로/앞으로가기 대응 (`popstate`)
- [x] 초기 로딩 시 현재 URL 기반 렌더
- [x] 없는 경로 404 처리

---

## 🔥 오늘 반드시 가져가야 할 것 (실무 기준)
- SPA 라우팅의 본질은 **URL과 UI의 동기화**
- `pushState`는 **이동을 “기록”**한다
- `popstate`는 **히스토리 이동을 “감지”**한다
- `render()`는 항상 “**현재 URL을 기준으로**” 그려야 유지보수가 된다

---

## 🚀 (선택) 확장 과제
- 쿼리스트링(`location.search`) 읽어서 렌더에 반영하기
- 동적 라우트: `/users/:id` 형태 파싱하기
- `replaceState`로 리다이렉트 구현하기
- 404 페이지에서 “홈으로” 버튼 만들기
- “가드” 구현: 특정 페이지는 로그인 상태일 때만 접근

---

## 📚 참고 키워드
- History API / pushState / replaceState
- popstate
- location.pathname
- preventDefault
- SPA Router / Client-side routing
