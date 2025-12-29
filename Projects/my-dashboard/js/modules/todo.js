/**
 * ===================================================================================
 * ✨ My Ultimate Dashboard - Todo List + Daily Progress 모듈 (모바일 최적화) ✨
 * ===================================================================================
 *
 * 기능:
 * - 할 일 추가/삭제/수정
 * - 완료 체크 및 필터(all/in-progress/done)
 * - 드래그 앤 드롭으로 순서 변경
 * - 진행률 표시 (progress bar)
 * - Daily Progress 차트 연동 (투두 + 습관 달성률)
 * - LocalStorage 저장/로드
 * - 모바일: '길게 누르기'로 수정 기능 지원
 *
 * 주요 구조:
 * - todos 배열 → [{ id, text, done }]
 * - currentFilter → 현재 필터 상태
 *
 * 핵심 함수:
 * - renderTodos() → todos 배열 기준 DOM 렌더링, 필터, 진행률 계산, 저장, Daily Progress 이벤트 발생
 * - saveTodos() → LocalStorage 저장
 * - updateProgress() → 완료/전체 개수, progress bar 갱신
 * - addTodo() → 할 일 추가
 * - enableEdit() → 더블클릭/길게 눌러 할 일 수정
 * - handleFilterClick() → 필터 버튼 클릭 처리
 * - handleListInteraction() → 체크박스/삭제 이벤트 처리
 * - initTodo() → 초기화 및 이벤트 바인딩
 * ===================================================================================
 */

import { saveToStorage, loadFromStorage } from '../utils/storage.js';
import { initDailyProgress } from './daily.js';

export function initTodo() {
   // --- 1️⃣ DOM 요소 가져오기 ---
   const todoWidget = document.querySelector('.todo-widget');
   if (!todoWidget) return;

   const todoInput = todoWidget.querySelector('#todo-input');
   const addBtn = todoWidget.querySelector('#todo-add-btn');
   const clearBtn = todoWidget.querySelector('#todo-clear-btn');
   const todoList = todoWidget.querySelector('#todo-list');
   const categoryBtns = todoWidget.querySelectorAll('.category-btn');
   const progressBar = todoWidget.querySelector('#progress-bar-done');
   const progressText = todoWidget.querySelector('#progress-text');

   // --- 2️⃣ 상태 변수 ---
   let todos = loadFromStorage('todos') || [];
   let currentFilter = 'all';

   // --- 3️⃣ 할 일 렌더링 ---
   const renderTodos = () => {
      const filteredTodos = todos.filter((todo) => {
         if (currentFilter === 'in-progress') return !todo.done;
         if (currentFilter === 'done') return todo.done;
         return true;
      });

      todoList.innerHTML = '';
      if (filteredTodos.length === 0) {
         todoList.innerHTML =
            '<li class="empty-message">목록이 비어있습니다.</li>';
      } else {
         filteredTodos.forEach((todo) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.done ? 'done' : ''}`;
            li.dataset.id = todo.id;
            li.draggable = true;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.done;

            const textSpan = document.createElement('span');
            textSpan.className = 'todo-text';
            textSpan.textContent = todo.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'todo-delete-btn';
            deleteBtn.innerHTML = '🗑️';

            li.append(checkbox, textSpan, deleteBtn);
            todoList.appendChild(li);
         });
      }

      updateProgress(); // 진행률 갱신
      saveTodos(); // LocalStorage 저장
      document.dispatchEvent(new Event('todoUpdated')); // Daily Progress 갱신 이벤트
   };

   // --- 4️⃣ 진행률 계산 ---
   const updateProgress = () => {
      const doneCount = todos.filter((t) => t.done).length;
      const totalCount = todos.length;
      const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

      if (progressBar) progressBar.style.width = `${progress}%`;
      if (progressText) progressText.textContent = `${doneCount}/${totalCount}`;
   };

   // --- 5️⃣ LocalStorage 저장 ---
   const saveTodos = () => saveToStorage('todos', todos);

   // --- 6️⃣ 할 일 추가 ---
   const addTodo = () => {
      const text = todoInput.value.trim();
      if (!text) return;
      if (todos.some((t) => t.text === text)) {
         alert('같은 할 일이 이미 추가되어 있습니다.');
         return;
      }
      todos.unshift({ id: Date.now(), text, done: false });
      todoInput.value = '';
      renderTodos();
   };

   // --- 7️⃣ 할 일 수정 ---
   const enableEdit = (textSpan, id) => {
      const originalText = textSpan.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'todo-edit-input';
      input.value = originalText;

      textSpan.replaceWith(input);
      input.focus();

      const saveEdit = () => {
         const newText = input.value.trim();
         const todo = todos.find((t) => t.id === id);
         if (todo && newText) todo.text = newText;
         renderTodos();
      };

      input.addEventListener('blur', saveEdit);
      input.addEventListener('keydown', (e) => {
         if (e.key === 'Enter') saveEdit();
         if (e.key === 'Escape') renderTodos();
      });
   };

   // --- 8️⃣ 필터 클릭 처리 ---
   const handleFilterClick = (e) => {
      categoryBtns.forEach((btn) => btn.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      renderTodos();
   };

   // --- 9️⃣ 체크박스 / 삭제 처리 ---
   const handleListInteraction = (e) => {
      const target = e.target;
      const li = target.closest('.todo-item');
      if (!li) return;

      const id = Number(li.dataset.id);

      if (target.closest('.todo-delete-btn')) {
         todos = todos.filter((t) => t.id !== id);
         renderTodos();
         return;
      }

      if (target.matches('input[type="checkbox"]')) {
         const todo = todos.find((t) => t.id === id);
         if (todo) todo.done = target.checked;
         renderTodos();
         return;
      }
   };

   // --- 1️⃣0️⃣ 이벤트 바인딩 ---
   // 더블클릭 → 수정
   todoList.addEventListener('dblclick', (e) => {
      const textSpan = e.target.closest('.todo-text');
      if (textSpan) {
         const id = Number(textSpan.closest('.todo-item').dataset.id);
         enableEdit(textSpan, id);
      }
   });

   // 모바일: 길게 눌러 수정
   let pressTimer = null;
   todoList.addEventListener('touchstart', (e) => {
      const textSpan = e.target.closest('.todo-text');
      if (textSpan) {
         pressTimer = setTimeout(() => {
            e.preventDefault();
            const id = Number(textSpan.closest('.todo-item').dataset.id);
            enableEdit(textSpan, id);
         }, 500);
      }
   });
   todoList.addEventListener('touchend', () => clearTimeout(pressTimer));
   todoList.addEventListener('touchmove', () => clearTimeout(pressTimer));

   // 드래그 앤 드롭
   let draggedItem = null;
   todoList.addEventListener('dragstart', (e) => {
      draggedItem = e.target.closest('.todo-item');
      if (draggedItem)
         setTimeout(() => draggedItem.classList.add('dragging'), 0);
   });
   todoList.addEventListener('dragend', () => {
      if (draggedItem) {
         draggedItem.classList.remove('dragging');
         draggedItem = null;
         const newOrderIds = [...todoList.querySelectorAll('.todo-item')].map(
            (li) => Number(li.dataset.id),
         );
         todos.sort(
            (a, b) => newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id),
         );
         saveTodos();
      }
   });
   todoList.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = [
         ...todoList.querySelectorAll('.todo-item:not(.dragging)'),
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
      if (draggedItem) todoList.insertBefore(draggedItem, afterElement || null);
   });

   // 클릭 이벤트
   todoList.addEventListener('click', handleListInteraction);
   addBtn.addEventListener('click', addTodo);
   todoInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') addTodo();
   });
   clearBtn.addEventListener('click', () => {
      if (confirm('모든 할 일을 정말 삭제하시겠습니까?')) {
         todos = [];
         renderTodos();
      }
   });
   categoryBtns.forEach((btn) =>
      btn.addEventListener('click', handleFilterClick),
   );

   // --- 1️⃣1️⃣ 초기 렌더링 & Daily Progress 초기화 ---
   renderTodos();
   initDailyProgress();
}
