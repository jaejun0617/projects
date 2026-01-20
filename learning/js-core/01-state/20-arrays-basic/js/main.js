const inputEl = document.getElementById('todoInput');
const btnAdd = document.getElementById('btnAdd');
const listEl = document.getElementById('todoList');

// 리스트 전체를 대표하는 상태
const state = {
   todos: [],
};

// 단일 Todo 엔티티 생성
function createTodo(text) {
   return {
      text,
   };
}

// 상태 → UI 계산
function renderTodos() {
   listEl.innerHTML = '';

   for (let i = 0; i < state.todos.length; i++) {
      const todo = state.todos[i];

      const li = document.createElement('li');
      li.className = 'todo-item';
      li.textContent = todo.text;

      const btnDelete = document.createElement('button');
      btnDelete.textContent = '삭제';

      // index 기반 삭제
      btnDelete.addEventListener('click', () => {
         state.todos.splice(i, 1);
         renderTodos();
      });

      li.appendChild(btnDelete);
      listEl.appendChild(li);
   }
}

// 인터랙션 = 상태 변경
btnAdd.addEventListener('click', () => {
   const value = inputEl.value.trim();
   if (value.length === 0) return;

   state.todos.push(createTodo(value));
   inputEl.value = '';
   renderTodos();
});

// 초기 렌더
renderTodos();
