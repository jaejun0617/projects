const inputEl = document.getElementById('todoInput');
const btnAdd = document.getElementById('btnAdd');
const listEl = document.getElementById('todoList');

// 리스트 전체 상태
const state = {
   todos: [],
};

// Todo 엔티티 생성
function createTodo(text) {
   return {
      text,
      isDone: false,
   };
}

// 상태 → UI 렌더
function renderTodos() {
   listEl.innerHTML = '';

   for (let i = 0; i < state.todos.length; i++) {
      const todo = state.todos[i];

      const li = document.createElement('li');
      li.className = todo.isDone ? 'todo-item done' : 'todo-item';
      li.textContent = todo.text;

      // 클릭 = 완료/미완료 토글
      li.addEventListener('click', () => {
         todo.isDone = !todo.isDone;
         renderTodos();
      });

      const btnDelete = document.createElement('button');
      btnDelete.textContent = '삭제';

      btnDelete.addEventListener('click', (e) => {
         e.stopPropagation(); // 토글 방지
         state.todos.splice(i, 1);
         renderTodos();
      });

      li.appendChild(btnDelete);
      listEl.appendChild(li);
   }
}

// 추가 인터랙션
btnAdd.addEventListener('click', () => {
   const value = inputEl.value.trim();
   if (value.length === 0) return;

   state.todos.push(createTodo(value));
   inputEl.value = '';
   renderTodos();
});

// 초기 렌더
renderTodos();
