const inputEl = document.getElementById('todoInput');
const btnAdd = document.getElementById('btnAdd');
const listEl = document.getElementById('todoList');

// 전체 상태
const state = {
   todos: [],
};

// Todo 엔티티
function createTodo(text) {
   return {
      text,
      isDone: false,
      isEditing: false,
   };
}

// 렌더
function renderTodos() {
   listEl.innerHTML = '';

   for (let i = 0; i < state.todos.length; i++) {
      const todo = state.todos[i];
      const li = document.createElement('li');
      li.className = 'todo-item';

      if (todo.isDone) li.classList.add('done');
      if (todo.isEditing) li.classList.add('editing');

      // ✅ View 모드
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
            todo.isEditing = true;
            renderTodos();
         });

         const btnDelete = document.createElement('button');
         btnDelete.textContent = '삭제';
         btnDelete.addEventListener('click', () => {
            state.todos.splice(i, 1);
            renderTodos();
         });

         li.append(span, btnEdit, btnDelete);
      }

      // ✅ Edit 모드
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

// 추가
btnAdd.addEventListener('click', () => {
   const value = inputEl.value.trim();
   if (value.length === 0) return;

   state.todos.push(createTodo(value));
   inputEl.value = '';
   renderTodos();
});

renderTodos();
