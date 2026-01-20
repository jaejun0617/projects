# Day 40 — Browser Storage (LocalStorage로 Todo 유지)
**Tue, Feb 3, 2026**  
**Topic:** Browser Storage (Cookie / LocalStorage / SessionStorage)  
**Goal:** 새로고침해도 Todo 데이터가 사라지지 않도록 **LocalStorage 저장/복구**를 붙인다.

---

## ✅ 오늘의 결론 (한 줄)
**Todo의 “진짜 데이터”는 `todos(state)`이고, LocalStorage는 그 state를 “문자열(JSON)”로 저장해 복구하는 저장소다.**

---

## 🎯 미션 목표
- Todo 추가/삭제/완료 토글이 **즉시 저장**된다.
- 페이지 새로고침 후에도 **저장된 데이터를 불러와 렌더**한다.
- **LocalStorage는 문자열만 저장**한다는 한계를 **JSON.stringify / JSON.parse**로 해결한다.
- Cookie / LocalStorage / SessionStorage의 역할 차이를 설명할 수 있다.

---

## ✅ 필수 결과물 체크리스트
- [ ] Todo 추가 시 `saveTodos()` 즉시 호출
- [ ] Todo 삭제/완료 토글 시 `saveTodos()` 즉시 호출
- [ ] 페이지 로드 시 `loadTodos()`로 복구 후 `render()`
- [ ] 저장 데이터가 없거나 깨져도 **에러 없이 빈 배열**로 시작
- [ ] DOM을 직접 믿지 않고 **state → render** 흐름 유지

---

# 1) 🧠 핵심 이론 보강

## 1-1. Browser Storage란?
브라우저(클라이언트)가 **사용자 기기(브라우저)에 데이터**를 저장할 수 있는 기능.

### 왜 쓰나?
- **UX 유지**: 다크모드, 언어, Todo, 장바구니
- **캐싱**: 반복 요청/연산 감소
- **오프라인/약한 네트워크**에서도 최소 동작(확장)

---

## 1-2. Cookie vs LocalStorage vs SessionStorage (실무 기준 비교)

| 구분 | Cookie | LocalStorage | SessionStorage |
|---|---|---|---|
| 저장 위치 | 브라우저 | 브라우저 | 브라우저 |
| 유지 기간 | 만료 설정(또는 세션) | 직접 삭제 전까지 | 탭/창 닫으면 종료 |
| 서버 자동 전송 | ✅ 요청마다 자동 포함 | ❌ | ❌ |
| 용량 | 작음(약 4KB) | 큼(대략 5~10MB) | 큼(대략 5~10MB) |
| 타입 | 문자열 | 문자열 | 문자열 |
| 대표 용도 | 인증/세션/식별 | 설정/비회원 상태 | “이 탭에서만” 임시 상태 |

### 핵심 요약
- **Cookie**: 서버가 사용자 식별/인증에 관여할 때(요청마다 서버로 감)
- **LocalStorage**: 오래 유지되는 클라이언트 설정/데이터
- **SessionStorage**: 탭 단위 임시 저장(회원가입 단계 폼 등)

---

## 1-3. LocalStorage는 왜 “문자열만” 저장되나?
LocalStorage는 내부적으로 `key: string → value: string` 구조.

그래서 객체/배열을 그대로 넣으면 원하는 형태로 저장되지 않는다.

```js
localStorage.setItem("todos", [{ id: 1 }]); 
// 실제로는 "[object Object]" 같은 형태로 깨짐(의도와 다름)
```

### ✅ 해결: JSON 직렬화/역직렬화
- 저장: `JSON.stringify(value)` → 문자열로 변환
- 로드: `JSON.parse(string)` → JS 값(객체/배열)로 복원

```js
localStorage.setItem("todos", JSON.stringify(todos));

const raw = localStorage.getItem("todos");
const todos = raw ? JSON.parse(raw) : [];
```

---

## 1-4. 저장/복구 설계의 “정답 규칙” 3개
1) **저장은 state가 바뀌는 순간에**(Create/Update/Delete)  
2) **로드는 최초 1회**(앱 시작 시)  
3) **렌더는 state만 보고**(DOM을 진실로 삼지 않기)

이 규칙을 지키면 “새로고침하면 부활/유실/꼬임”이 거의 사라진다.

---

## 1-5. 실무 방어 포인트 3개
### A) JSON.parse는 깨진 문자열이면 터진다
사용자가 개발자도구에서 값을 직접 바꾸거나, 예전 버전 데이터가 남아 있으면 파싱 에러 발생 가능 → `try/catch`로 방어.

### B) Key 네이밍(충돌 방지)
앱 이름 prefix 추천:
- `"jj-todo:items"`  
- `"myapp:todos"`

### C) 저장 단위
- 실무에선 “매 변경마다 저장”이 일반적(단, 데이터가 매우 크면 debounce 고려)

---

# 2) 🏗️ 구현 전략 (실전 구조)

## 2-1. 최소 함수 4개로 끝내기
- `loadTodos()` : LocalStorage → state 복구
- `saveTodos(todos)` : state → LocalStorage 저장
- `render()` : state → DOM
- `add/toggle/delete` : state 변경 → save → render

---

# 3) 💻 “끼워 넣기용” 필수 코드 (핵심만)

## 3-1. 저장/로드 유틸
```js
const STORAGE_KEY = "jj-todo:items";

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    // 데이터가 깨졌으면 안전하게 초기화
    return [];
  }
}
```

## 3-2. 초기 로드(앱 시작 1회)
> `DOMContentLoaded`를 쓰면 DOM이 준비된 뒤 안전하게 시작 가능.

```js
let todos = [];

document.addEventListener("DOMContentLoaded", () => {
  todos = loadTodos();
  render();
});
```

## 3-3. CRUD마다 “state 먼저 변경 → 저장 → 렌더”
> 아래는 **함수형 스타일(불변)** 예시라 깔끔하고 안전함.

```js
function addTodo(text) {
  const newTodo = { id: Date.now(), text, completed: false };
  todos = [...todos, newTodo];
  saveTodos(todos);
  render();
}

function toggleTodo(id) {
  todos = todos.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos(todos);
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos(todos);
  render();
}
```

---

# 4) ✅ 완성형 예시 (Day 34 Todo에 LocalStorage + 이벤트 위임까지)
> 아래는 **한 파일(index.html)**로 바로 실행 가능한 “제출급” 예시.  
> - state → render 유지  
> - LocalStorage 저장/복구  
> - 이벤트 위임(ul 한 군데)  
> - textContent로 XSS 방어

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Day 40 - Todo with LocalStorage</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 24px; }
    .row { display: flex; gap: 8px; }
    input { padding: 10px; width: 260px; }
    button { padding: 10px 12px; cursor: pointer; }
    ul { list-style: none; padding: 0; margin-top: 16px; }
    li {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;
      margin-bottom: 8px;
    }
    li.completed .text { text-decoration: line-through; opacity: 0.6; }
    .text { flex: 1; cursor: pointer; }
    .del { border: none; background: transparent; font-weight: 700; }
    .muted { color: #666; font-size: 13px; margin-top: 10px; }
  </style>
</head>
<body>
  <h1>Todo</h1>

  <div class="row">
    <input id="todoInput" type="text" placeholder="할 일을 입력" />
    <button id="addBtn" type="button">추가</button>
  </div>

  <ul id="todoList"></ul>
  <div id="meta" class="muted"></div>

  <script>
    // ===== 1) Storage =====
    const STORAGE_KEY = "jj-todo:items";

    function saveTodos(todos) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    function loadTodos() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    // ===== 2) State =====
    let todos = [];

    // ===== 3) DOM 캐싱 =====
    const $input = document.getElementById('todoInput');
    const $addBtn = document.getElementById('addBtn');
    const $list = document.getElementById('todoList');
    const $meta = document.getElementById('meta');

    // ===== 4) Render =====
    function render() {
      $list.innerHTML = '';

      const frag = document.createDocumentFragment();

      for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];

        const li = document.createElement('li');
        li.dataset.id = String(todo.id);
        if (todo.completed) li.classList.add('completed');

        const textSpan = document.createElement('span');
        textSpan.className = 'text';
        textSpan.textContent = todo.text; // ✅ XSS 방어

        const delBtn = document.createElement('button');
        delBtn.className = 'del';
        delBtn.type = 'button';
        delBtn.textContent = 'X';
        delBtn.dataset.action = 'delete';

        li.appendChild(textSpan);
        li.appendChild(delBtn);
        frag.appendChild(li);
      }

      $list.appendChild(frag);

      const left = todos.filter(t => !t.completed).length;
      $meta.textContent = `전체 ${todos.length}개 · 남은 할 일 ${left}개`;
    }

    // ===== 5) Actions (CRUD) =====
    function addTodo() {
      const value = $input.value.trim();
      if (!value) return;

      const newTodo = { id: Date.now(), text: value, completed: false };
      todos = [...todos, newTodo];

      saveTodos(todos);
      $input.value = '';
      $input.focus();
      render();
    }

    function toggleTodo(id) {
      todos = todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      saveTodos(todos);
      render();
    }

    function deleteTodo(id) {
      todos = todos.filter(t => t.id !== id);
      saveTodos(todos);
      render();
    }

    // ===== 6) Events =====
    $addBtn.addEventListener('click', addTodo);
    $input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addTodo();
    });

    // ✅ 이벤트 위임: ul 한 군데에서 처리
    $list.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;

      const id = Number(li.dataset.id);

      // 삭제 버튼
      if (e.target.matches('button[data-action="delete"]')) {
        deleteTodo(id);
        return;
      }

      // 텍스트 클릭(또는 li 클릭 정책 선택)
      if (e.target.classList.contains('text')) {
        toggleTodo(id);
      }
    });

    // ===== 7) Init =====
    document.addEventListener('DOMContentLoaded', () => {
      todos = loadTodos();
      render();
    });
  </script>
</body>
</html>
```

---

# 5) 🔥 핵심 포인트 (면접/실무용 문장)
- “LocalStorage는 문자열 저장소라 Todo 배열을 **JSON.stringify/parse**로 직렬화/복구했고, **CRUD 액션마다 state 변경 → 저장 → 렌더** 순서로 데이터 유실 없이 유지되게 만들었다.”
- “Cookie는 요청마다 서버로 전송되므로 인증/세션에 쓰고, Local/Session Storage는 클라이언트 전용 상태 유지에 쓴다.”

---

# 6) 🧪 디버깅 체크리스트
- [ ] 개발자도구 → Application → Local Storage에 키가 저장되는가?
- [ ] 저장된 값이 JSON 문자열인가? (예: `[{"id":...,"text":...}]`)
- [ ] 새로고침 후 `loadTodos()`가 배열을 복구하는가?
- [ ] 저장값이 없을 때 `null` 처리로 빈 배열로 시작하는가?
- [ ] 완료/삭제 후 저장값이 즉시 바뀌는가?

---

## 💻 사용 기술
- `localStorage.getItem / setItem / removeItem`
- `JSON.stringify / JSON.parse`
- `DOMContentLoaded`
- state → render 패턴(CRUD)

---

## 🚀 다음 확장(선택)
- 필터(전체/완료/미완료)
- 전체 삭제 / 완료 일괄 삭제
- 데이터 버전 관리(마이그레이션)
- Drag & Drop 정렬 + 저장
