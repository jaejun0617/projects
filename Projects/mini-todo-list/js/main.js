'use strict';

// 1. DOMContentLoaded 이벤트 리스너: HTML 문서가 모두 로드되면 스크립트 실행 시작
document.addEventListener('DOMContentLoaded', () => {
   console.log('✅ DOM 로딩 완료! ToDo 앱 시작.');

   // --- DOM 요소 선택: 필요한 HTML 요소들을 미리 변수에 담아두기 (성능 최적화) ---
   const todoList = document.querySelector('.todo-list');
   const todoInput = document.querySelector('.todo-input');
   const addBtn = document.querySelector('.add-btn');
   const deleteAllBtn = document.querySelector('.delete-all-btn');
   const themeToggle = document.querySelector('#theme-toggle');
   const progressFill = document.querySelector('.progress-fill');
   const progressText = document.querySelector('.progress-text');
   const filterBtns = document.querySelectorAll('.filter-btn');
   const todoTitleElement = document.querySelector('.todo-title');
   const titleChangeBtn = document.querySelector('.title-change-btn');

   // --- 상태(State) 관리: 앱의 모든 데이터를 변수로 관리 ---
   // 로컬스토리지에서 기존 데이터를 불러오거나, 없으면 빈 배열/기본값으로 시작
   let todos = JSON.parse(localStorage.getItem('todos')) || [];
   let currentFilter = localStorage.getItem('filter') || 'all';
   let title = localStorage.getItem('todoTitle') || 'ToDo List';
   console.log('초기 상태 로드:', { todos, currentFilter, title });

   // --- 상태 저장 함수: 현재 상태(todos, filter, title)를 로컬스토리지에 저장 ---
   const saveState = () => {
      console.log('💾 상태 저장 중...', { todos, currentFilter, title });
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('filter', currentFilter);
      localStorage.setItem('todoTitle', title);
   };

   // --- 렌더링 함수: 현재 상태를 기반으로 화면을 다시 그리는 핵심 함수 ---
   const render = () => {
      console.log(`🎨 렌더링 시작... (필터: ${currentFilter})`);
      todoList.innerHTML = ''; // 기존 목록 비우기
      todoTitleElement.textContent = title; // 제목 업데이트

      // 현재 필터에 맞는 데이터만 걸러내기
      const filteredTodos = todos.filter((todo) => {
         if (currentFilter === 'active') return !todo.completed;
         if (currentFilter === 'completed') return todo.completed;
         return true;
      });
      console.log(`${filteredTodos.length}개 항목 렌더링.`);

      // 필터링된 데이터를 기반으로 li 요소 생성
      filteredTodos.forEach((todo) => {
         const originalIndex = todos.findIndex((t) => t === todo);
         const li = document.createElement('li');
         li.setAttribute('draggable', 'true');
         li.dataset.index = originalIndex;
         if (todo.completed) li.classList.add('completed');

         const label = document.createElement('label');
         const checkbox = document.createElement('input');
         checkbox.type = 'checkbox';
         checkbox.checked = todo.completed;
         checkbox.classList.add('todo-check');
         const span = document.createElement('span');
         span.textContent = todo.text;
         span.classList.add('todo-text');
         label.appendChild(checkbox);
         label.appendChild(span);

         const editBtn = document.createElement('button');
         editBtn.innerHTML = '✏️';
         editBtn.classList.add('edit-btn');
         editBtn.setAttribute('aria-label', '할 일 수정');

         const deleteBtn = document.createElement('button');
         deleteBtn.innerHTML = '🗑️';
         deleteBtn.classList.add('delete-btn');
         deleteBtn.setAttribute('aria-label', '할 일 삭제');

         li.appendChild(label);
         li.appendChild(editBtn);
         li.appendChild(deleteBtn);
         todoList.appendChild(li);
      });

      // 렌더링 후 필요한 UI 업데이트 함수들 호출
      addDragAndDrop();
      updateProgress();
      updateFilterButtons();
      console.log('🎨 렌더링 완료.');
   };

   // --- 기능 함수들 ---

   // 진행률 업데이트 함수
   const updateProgress = () => {
      const total = todos.length;
      const completed = todos.filter((t) => t.completed).length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
      progressFill.style.width = percent + '%';
      progressText.textContent = `${percent}%`;
      console.log(`📈 진행률 업데이트: ${completed}/${total} (${percent}%)`);
   };

   // 필터 버튼 활성화 상태 업데이트 함수
   const updateFilterButtons = () => {
      filterBtns.forEach((btn) => {
         btn.classList.toggle('active', btn.dataset.filter === currentFilter);
      });
   };

   // 할 일 추가 함수
   const addTodo = () => {
      const text = todoInput.value.trim();
      if (!text) return; // 입력값이 없으면 아무것도 안 함
      console.log(`➕ 할 일 추가: "${text}"`);
      todos.push({ text, completed: false });
      saveState();
      render();
      todoInput.value = '';
      todoInput.focus();
   };

   // 할 일 수정 함수
   const editTodo = (index) => {
      console.log(`✏️ ${index}번 항목 수정 모드 시작.`);
      const li = todoList.querySelector(`li[data-index='${index}']`);
      if (!li || li.querySelector('.edit-input')) return; // 이미 수정 중이면 중복 실행 방지

      const span = li.querySelector('.todo-text');
      const currentText = todos[index].text;

      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = currentText;
      editInput.classList.add('edit-input');

      span.parentElement.replaceChild(editInput, span);
      editInput.focus();
      editInput.select();

      // 수정 완료 로직 (blur 또는 Enter)
      const saveEdit = () => {
         const newText = editInput.value.trim();
         todos[index].text = newText || currentText; // 비워두면 원래 텍스트로 복원
         console.log(`✅ ${index}번 항목 수정 완료: "${todos[index].text}"`);
         saveState();
         render();
      };
      editInput.addEventListener('blur', saveEdit);
      editInput.addEventListener('keydown', (e) => {
         if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
         }
      });
   };

   // 제목 수정 함수
   const editTitle = () => {
      const newTitle = prompt('새로운 제목을 입력하세요', title);
      if (newTitle && newTitle.trim() !== '') {
         title = newTitle.trim();
         console.log(`👑 제목 변경: "${title}"`);
         saveState();
         render();
      }
   };

   // --- 이벤트 리스너 연결 ---
   // 할 일 목록(ul)에서 발생하는 클릭 이벤트를 위임받아 처리
   todoList.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      const index = li.dataset.index;
      // 수정 버튼 클릭
      if (e.target.closest('.edit-btn')) {
         console.log(`🖱️ 수정 버튼 클릭: ${index}번 항목`);
         editTodo(index);
      }
      // 삭제 버튼 클릭
      else if (e.target.closest('.delete-btn')) {
         console.log(`🗑️ 삭제 버튼 클릭: ${index}번 항목`);
         todos.splice(index, 1);
         saveState();
         render();
      }
      // 체크박스 클릭
      else if (e.target.classList.contains('todo-check')) {
         todos[index].completed = e.target.checked;
         console.log(
            `✔️ 체크박스 클릭: ${index}번 항목, 완료 상태: ${todos[index].completed}`,
         );
         saveState();
         render();
      }
   });

   // '+' 추가 버튼 클릭
   addBtn.addEventListener('click', () => {
      console.log("🖱️ '+' 추가 버튼 클릭.");
      addTodo();
   });

   // --- 한/영 등 IME 입력 중 Enter 키 중복 방지 로직 ---
   let isComposing = false;
   todoInput.addEventListener('compositionstart', () => {
      isComposing = true;
   });
   todoInput.addEventListener('compositionend', () => {
      isComposing = false;
   });

   // input에서 Enter 키 입력
   todoInput.addEventListener('keydown', (e) => {
      // isComposing이 false일 때, 즉 한글 조합 중이 아닐 때만 Enter 키로 추가
      if (e.key === 'Enter' && !isComposing) {
         console.log('⌨️ Input에서 Enter 키 입력.');
         e.preventDefault(); // form 제출 등 기본 동작 방지
         addTodo();
      }
   });

   // (선택) form 태그가 있을 경우를 대비한 이중 방어 코드
   const todoForm = todoInput.closest('form');
   if (todoForm) {
      todoForm.addEventListener('submit', (e) => e.preventDefault());
   }

   // 전체 삭제 버튼 클릭
   deleteAllBtn.addEventListener('click', () => {
      if (
         todos.length > 0 &&
         confirm('모든 할 일을 정말로 삭제하시겠습니까?')
      ) {
         console.log('💥 전체 삭제 실행.');
         todos = [];
         saveState();
         render();
      }
   });

   // 필터 버튼들 클릭
   filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
         currentFilter = btn.dataset.filter;
         console.log(`🔎 필터 변경: ${currentFilter}`);
         saveState();
         render();
      });
   });

   // 테마 토글 스위치 변경
   themeToggle.addEventListener('change', () => {
      const isDarkMode = themeToggle.checked;
      document.body.classList.toggle('dark-theme', isDarkMode);
      const theme = isDarkMode ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      console.log(`🎨 테마 변경: ${theme} 모드`);
   });

   // 제목 변경 버튼 클릭
   titleChangeBtn.addEventListener('click', () => {
      console.log('🖱️ 제목 변경 버튼 클릭.');
      editTitle();
   });

   // --- 드래그 앤 드롭 기능 함수 ---
   const addDragAndDrop = () => {
      const items = todoList.querySelectorAll('li[draggable="true"]');
      let dragStartIndex;

      // 드래그가 끝난 후, 화면에 보이는 순서대로 원본 todos 배열을 재정렬하는 함수
      const reorderTodos = () => {
         const newOrder = Array.from(todoList.querySelectorAll('li')).map(
            (li) => todos[+li.dataset.index],
         );
         todos = newOrder;
         console.log('🔄 드래그 앤 드롭으로 순서 변경 완료.');
         saveState();
         render();
      };

      items.forEach((item) => {
         // 드래그 시작
         item.addEventListener('dragstart', () => {
            dragStartIndex = +item.dataset.index;
            console.log(`✋ 드래그 시작: ${dragStartIndex}번 항목`);
            // setTimeout으로 감싸야 브라우저가 드래그 '고스트 이미지'를 생성할 시간을 줌
            setTimeout(() => item.classList.add('dragging'), 0);
         });
         // 드래그 종료
         item.addEventListener('dragend', () => {
            console.log(`👌 드래그 종료: ${dragStartIndex}번 항목`);
            item.classList.remove('dragging');
            reorderTodos(); // 최종 순서로 저장 및 렌더링
         });
      });

      // 다른 요소 위로 드래그 중일 때
      todoList.addEventListener('dragover', (e) => {
         e.preventDefault(); // drop 이벤트를 허용하기 위해 필수
         const draggingItem = document.querySelector('.dragging');
         if (!draggingItem) return;

         // 드래그 중인 요소를 다른 요소 위/아래로 시각적으로 이동
         const afterElement = [
            ...todoList.querySelectorAll('li:not(.dragging)'),
         ].reduce(
            (closest, child) => {
               const box = child.getBoundingClientRect();
               const offset = e.clientY - box.top - box.height / 2;
               return offset < 0 && offset > closest.offset
                  ? { offset, element: child }
                  : closest;
            },
            { offset: Number.NEGATIVE_INFINITY },
         ).element;

         if (afterElement) {
            todoList.insertBefore(draggingItem, afterElement);
         } else {
            todoList.appendChild(draggingItem);
         }
      });
   };

   // --- 초기 실행 ---
   // 페이지 로드 시, 저장된 테마가 있으면 적용
   const savedTheme = localStorage.getItem('theme');
   if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.checked = true;
      console.log('저장된 다크 테마 적용.');
   } else {
      console.log('라이트 테마로 시작.');
   }
   render(); // 페이지 로드 시 첫 화면 렌더링
});
