const inputEl = document.getElementById('todoInput');
const btnAdd = document.getElementById('btnAdd');
const listEl = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter');

// 전체 상태
const state = {
   todos: [],
   filter: 'all', // all | active | completed
};

// ID 생성 (간단한 고유값)
function createId() {
   return Date.now() + Math.random();
}

// Todo 엔티티
function createTodo(text) {
   return {
      id: createId(),
      text,
      isDone: false,
      isEditing: false,
   };
}

// 파생 상태 계산 (필터)
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

   for (const todo of visibleTodos) {
      const li = document.createElement('li');
      li.className = 'todo-item';
      if (todo.isDone) li.classList.add('done');
      if (todo.isEditing) li.classList.add('editing');

      // View 모드
      if (!todo.isEditing) {
         const span = document.createElement('span');
         span.className = 'todo-text';
         span.textContent = todo.text;

         span.addEventListener('click', () => {
            todo.isDone = !todo.isDone;
            renderTodos();
         });

         const btnEdit = document.createElement('button');
         btnEdit.textContent = '수정';
         btnEdit.addEventListener('click', () => {
            // 다른 항목 편집 중이면 종료
            state.todos.forEach((t) => (t.isEditing = false));
            todo.isEditing = true;
            renderTodos();
         });

         const btnDelete = document.createElement('button');
         btnDelete.textContent = '삭제';
         btnDelete.addEventListener('click', () => {
            state.todos = state.todos.filter((t) => t.id !== todo.id);
            renderTodos();
         });

         li.append(span, btnEdit, btnDelete);
      }

      // Edit 모드
      if (todo.isEditing) {
         const editInput = document.createElement('input');
         editInput.value = todo.text;

         const btnSave = document.createElement('button');
         btnSave.textContent = '저장';
         btnSave.addEventListener('click', () => {
            const value = editInput.value.trim();
            if (value.length === 0) return;
            todo.text = value;
            todo.isEditing = false;
            renderTodos();
         });

         const btnCancel = document.createElement('button');
         btnCancel.textContent = '취소';
         btnCancel.addEventListener('click', () => {
            todo.isEditing = false;
            renderTodos();
         });

         li.append(editInput, btnSave, btnCancel);
      }

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
