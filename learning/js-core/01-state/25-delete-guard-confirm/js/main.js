const inputEl = document.getElementById('todoInput');
const btnAdd = document.getElementById('btnAdd');
const listEl = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter');
const statusEl = document.getElementById('status');

// 단일 상태
const state = {
   todos: [],
   filter: 'all', // all | active | completed
   deletingId: null, // Guard: 삭제 중인 대상 (중복 클릭 방지)
};

// 간단 id
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

// 상태 메시지 (UI 피드백)
function setStatus(message) {
   statusEl.textContent = message;
}

// Guard: id로 대상 찾기
function findTodoById(id) {
   for (const todo of state.todos) {
      if (todo.id === id) return todo;
   }
   return null;
}

// 파생 상태 (필터)
function getFilteredTodos() {
   if (state.filter === 'active') {
      return state.todos.filter((todo) => !todo.isDone);
   }
   if (state.filter === 'completed') {
      return state.todos.filter((todo) => todo.isDone);
   }
   return state.todos;
}

// 삭제: Confirm + Guard
function requestDelete(todoId) {
   // Guard 1) 이미 삭제 프로세스 진행 중이면 중복 클릭 무시
   if (state.deletingId !== null) {
      setStatus('삭제 처리 중입니다. 잠시만 기다리세요.');
      return;
   }

   // Guard 2) 대상이 실제로 존재하는지 확인 (필터/렌더 상태 어긋남 방지)
   const target = findTodoById(todoId);
   if (!target) {
      setStatus('삭제 실패: 대상이 존재하지 않습니다.');
      return;
   }

   // Guard 3) 편집 중이면 삭제 대신 흐름을 명확히 막는다
   if (target.isEditing) {
      setStatus(
         '삭제 불가: 현재 수정 중인 항목입니다. 저장/취소 후 삭제하세요.',
      );
      return;
   }

   // Confirm: 사용자 의도 확인
   const ok = window.confirm(`정말 삭제할까요?\n\n- ${target.text}`);
   if (!ok) {
      setStatus('삭제가 취소되었습니다.');
      return;
   }

   // Guard 4) 이제부터 삭제 중 상태로 잠금
   state.deletingId = todoId;

   // 실제 삭제(원본 상태 기준 id 제거)
   state.todos = state.todos.filter((t) => t.id !== todoId);

   // 삭제 완료 후 잠금 해제
   state.deletingId = null;

   setStatus(`삭제 완료: "${target.text}"`);
   renderTodos();
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

      // View
      if (!todo.isEditing) {
         const span = document.createElement('span');
         span.className = 'todo-text';
         span.textContent = todo.text;

         span.addEventListener('click', () => {
            todo.isDone = !todo.isDone;
            setStatus(todo.isDone ? '완료 처리됨' : '미완료로 변경됨');
            renderTodos();
         });

         const btnEdit = document.createElement('button');
         btnEdit.textContent = '수정';
         btnEdit.addEventListener('click', () => {
            // 한 번에 하나만 편집
            state.todos.forEach((t) => (t.isEditing = false));
            todo.isEditing = true;
            setStatus('수정 모드 진입');
            renderTodos();
         });

         const btnDelete = document.createElement('button');
         btnDelete.textContent = '삭제';
         btnDelete.disabled = state.deletingId !== null; // Guard: 삭제 중이면 전체 잠금
         btnDelete.addEventListener('click', () => {
            requestDelete(todo.id);
         });

         li.append(span, btnEdit, btnDelete);
      }

      // Edit
      if (todo.isEditing) {
         const editInput = document.createElement('input');
         editInput.value = todo.text;

         const btnSave = document.createElement('button');
         btnSave.textContent = '저장';
         btnSave.addEventListener('click', () => {
            const value = editInput.value.trim();
            if (value.length === 0) {
               setStatus('저장 실패: 내용이 비어있습니다.');
               return;
            }
            todo.text = value;
            todo.isEditing = false;
            setStatus('저장 완료');
            renderTodos();
         });

         const btnCancel = document.createElement('button');
         btnCancel.textContent = '취소';
         btnCancel.addEventListener('click', () => {
            todo.isEditing = false;
            setStatus('수정 취소');
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

      setStatus(`필터 변경: ${state.filter}`);
      renderTodos();
   });
});

// 추가
btnAdd.addEventListener('click', () => {
   const value = inputEl.value.trim();
   if (value.length === 0) {
      setStatus('추가 실패: 내용이 비어있습니다.');
      return;
   }

   state.todos.push(createTodo(value));
   inputEl.value = '';
   setStatus('추가 완료');
   renderTodos();
});

renderTodos();
