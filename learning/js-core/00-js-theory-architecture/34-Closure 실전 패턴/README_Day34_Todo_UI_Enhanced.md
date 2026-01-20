# Day 34 — Mini Project: Todo List UI
**Wed, Jan 28, 2026**  
**Topic:** CRUD (Create / Read / Update / Delete)  
**Goal:** 입력값으로 리스트를 만들고, 클릭하면 **완료 토글 / 삭제**되는 **Todo Web App UI** 구현 (순수 JS)

---

## 🎯 미션 한 줄 요약
**Todo UI가 아니라 “데이터 흐름(CRUD) + 상태 기반 렌더링(state → render)” 훈련**.

---

## ✅ 오늘의 “진짜 핵심” (정답 구조 4줄)
1) **State(상태)**: `todos[]` 배열이 “진짜 데이터”  
2) **Render(그리기)**: `render()`는 state를 읽어서 DOM을 다시 그림  
3) **Action(행동)**: 추가/완료/삭제는 **state를 먼저 변경**하고  
4) **Re-render**: 변경 후 `render()` 재호출

> DOM을 직접 수정해서 맞추려 하면 금방 꼬입니다.  
> **상태를 바꾸고 → 다시 그리는 방식**이 가장 안정적입니다.

---

## 🧠 핵심 이론 보강

### 1) Single Source of Truth (단일 진실)
- 화면에 보이는 `<li>`가 진짜가 아니라, **`todos` 배열이 진짜**입니다.
- `render()`는 언제든 다시 실행될 수 있어야 하고, **그 기준은 state**입니다.

✅ 올바른 규칙  
- “지우기” = DOM 삭제가 아니라 **배열에서 제거**
- “완료 표시” = DOM 클래스 토글이 아니라 **배열의 `completed` 변경**

---

### 2) 왜 Todo는 문자열 배열이 아니라 “객체 배열”인가?
문자열만 저장하면:
- 삭제(식별) 어려움
- 완료 상태 저장 불가능
- 수정(Edit) 확장 불가능

그래서 최소 모델은 이 형태입니다:

```js
{
  id: Date.now(),      // 고유 식별자
  text: "운동하기",     // 내용
  completed: false     // 완료 여부
}
```

---

### 3) CRUD를 Todo에 매핑하기
- **Create**: 입력값으로 객체 생성 → `todos.push(newTodo)`
- **Read**: `render()`로 목록 출력
- **Update**: 클릭 시 `completed` 토글
- **Delete**: 삭제 버튼 클릭 시 해당 todo 제거

---

### 4) 이벤트 버블링 함정 (완료 토글 + 삭제가 같이 터지는 문제)
- 삭제 버튼은 `<li>` 내부에 있으므로 클릭 이벤트가 부모로 **버블링**됩니다.
- 그래서 삭제 클릭 시 완료 토글이 같이 실행되는 버그가 흔합니다.

해결:
```js
delBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // 부모 클릭 방지
});
```

---

### 5) `innerHTML +=`를 추천하지 않는 이유
```js
// ❌ 비추천
$list.innerHTML += `<li>${text}</li>`;
```

문제:
- 기존 DOM을 다시 파싱/재생성 → 이벤트/상태 꼬임
- 입력을 그대로 HTML로 넣으면 XSS 위험

✅ 해결: `createElement` + `textContent` + `appendChild`

---

## ⚠️ 함정 Top 5 (실전에서 진짜 많이 터짐)
1) **DOM만 지우고 배열 안 지움** → 재렌더/새로고침 시 부활  
2) 완료 클릭과 삭제 클릭이 같이 터짐 → `stopPropagation()`  
3) `innerHTML +=`로 계속 붙임 → 이벤트/상태 꼬임  
4) 공백 입력 방어 없음 → `.trim()` 필수  
5) 완료를 DOM만 바꿈 → render 시 초기화됨 (**state도 변경해야 함**)

---

## ✅ 최소 요구사항 체크리스트
- [ ] input + 추가 버튼
- [ ] 추가 시 목록 `<li>` 생성
- [ ] `<li>` 클릭 시 완료 토글(취소선)
- [ ] 삭제 버튼으로 제거
- [ ] 추가 후 input 비우기 + focus
- [ ] 빈 입력 방지(공백 포함)

---

## 🧩 기본 구현 템플릿 (단일 index.html)
> 이벤트를 항목마다 다는 “학습용 기본 버전”

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Todo UI</title>
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
    .del { border: none; }
  </style>
</head>
<body>
  <h1>Todo</h1>

  <div class="row">
    <input id="todoInput" type="text" placeholder="할 일을 입력" />
    <button id="addBtn">추가</button>
  </div>

  <ul id="todoList"></ul>

  <script>
    // 1) State
    let todos = [];

    // 2) Cache DOM
    const $input = document.getElementById('todoInput');
    const $addBtn = document.getElementById('addBtn');
    const $list = document.getElementById('todoList');

    // 3) Render: state -> DOM
    function render() {
      $list.innerHTML = '';

      for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];

        const li = document.createElement('li');
        li.dataset.id = String(todo.id);
        if (todo.completed) li.classList.add('completed');

        const textSpan = document.createElement('span');
        textSpan.className = 'text';
        textSpan.textContent = todo.text;

        const delBtn = document.createElement('button');
        delBtn.className = 'del';
        delBtn.type = 'button';
        delBtn.textContent = 'X';

        // Update: 완료 토글
        textSpan.addEventListener('click', () => {
          todo.completed = !todo.completed; // state 변경
          render(); // re-render
        });

        // Delete: 삭제
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // 부모 클릭(완료) 막기
          const id = todo.id;
          todos = todos.filter(t => t.id !== id); // state 변경
          render(); // re-render
        });

        li.appendChild(textSpan);
        li.appendChild(delBtn);
        $list.appendChild(li);
      }
    }

    // Create: 추가
    function addTodo() {
      const value = $input.value.trim();
      if (!value) return;

      const newTodo = {
        id: Date.now(),
        text: value,
        completed: false
      };

      todos.push(newTodo); // state 변경
      $input.value = '';
      $input.focus();
      render(); // re-render
    }

    $addBtn.addEventListener('click', addTodo);

    // (선택) Enter로 추가
    $input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addTodo();
    });

    render(); // 초기 렌더
  </script>
</body>
</html>
```

---

## 🔥 “완벽” 기준 보강 (실무 감각 업그레이드)

### 1) 이벤트 위임 (권장)
항목마다 리스너를 달면(학습용 OK) 항목 수가 늘 때 부담이 됩니다.  
실무에서는 보통 **부모(ul)에 한 번만** 이벤트를 달아 처리합니다.

핵심:
- `e.target` : 실제 클릭된 요소
- `closest('li')` : 클릭한 곳이 어디든 해당 todo의 `<li>` 찾기
- `li.dataset.id` : 어떤 todo인지 식별

**위임 버전 예시 (핵심만):**
```js
$list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);

  // 삭제 버튼 클릭
  if (e.target.matches("button.del")) {
    todos = todos.filter(t => t.id !== id);
    render();
    return;
  }

  // 텍스트/나머지 영역 클릭 → 완료 토글
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  render();
});
```

---

### 2) 불변성(Immutable) 패턴으로 Update 하기
- `todo.completed = !todo.completed`는 간단하지만, 다음 단계(React) 기준으론 불변성이 더 좋습니다.

```js
todos = todos.map(t =>
  t.id === id ? { ...t, completed: !t.completed } : t
);
```

---

### 3) LocalStorage 저장/복구 (선택)
새로고침해도 유지되게 만들려면:

```js
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function load() {
  const raw = localStorage.getItem("todos");
  todos = raw ? JSON.parse(raw) : [];
}

load();
render();

// state가 바뀌는 곳(추가/토글/삭제)마다 save() 호출
```

---

## 🧪 디버깅 포인트
- 추가가 안 되면: `console.log($input.value)`
- render가 비면: `console.log(todos)`, `$list`가 null인지 확인
- 삭제 클릭 시 완료도 되면: `stopPropagation()` 또는 위임 분기 확인
- 완료가 유지 안 되면: DOM만 바꾸고 state를 안 바꾼 것

---

## ✅ 제출 기준(실무형)
- 기능: Create/Read/Update/Delete 정상 동작
- 구조: `state → render` 패턴 유지
- 보안: 사용자 입력 출력은 `textContent`
- UX: 빈 입력 방지 + 추가 후 focus 유지

---

## 🔥 포트폴리오 한 줄
> “Todo UI를 상태 기반(state → render)으로 구현했고, CRUD 흐름을 분리했으며, 이벤트 버블링 문제를 고려해 안정적으로 토글/삭제를 처리했습니다.”
