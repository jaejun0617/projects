const inputEl = document.getElementById('todoInput');
const btnAdd = document.getElementById('btnAdd');
const listEl = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter');

// 전체 상태
const state = {
   todos: [],
   filter: 'all', // all | active | completed
};

// Todo 엔티티
function createTodo(text) {
   return {
      text,
      isDone: false,
   };
}

// 파생 상태 계산
function getFilteredTodos() {
   if (state.filter === 'active') {
      return state.todos.filter((todo) => !todo.isDone);
   }
   if (state.filter === 'completed') {
      return state.todos.filter((todo) => todo.isDone);
   }
   return state.todos;
}

// 렌더
function renderTodos() {
   listEl.innerHTML = '';

   const visibleTodos = getFilteredTodos();

   for (let i = 0; i < visibleTodos.length; i++) {
      const todo = visibleTodos[i];
      const li = document.createElement('li');
      li.className = 'todo-item';
      if (todo.isDone) li.classList.add('done');

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;

      span.addEventListener('click', () => {
         todo.isDone = !todo.isDone;
         renderTodos();
      });

      li.appendChild(span);
      listEl.appendChild(li);
   }
}

// 필터 버튼
filterBtns.forEach((btn) => {
   btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      renderTodos();
   });
});

// 추가
btnAdd.addEventListener('click', () => {
   const value = inputEl.value.trim();
   if (value.length === 0) return;

   state.todos.push(createTodo(value));
   inputEl.value = '';
   renderTodos();
});

renderTodos();
