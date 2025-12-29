/**
 * ===================================================================================
 * ✨ My Ultimate Dashboard - Habit Tracker + Daily Progress 모듈 ✨
 * ===================================================================================
 *
 * 역할:
 *  - 습관 그룹 및 개별 습관 관리 (CRUD)
 *  - LocalStorage에 날짜별 저장 및 초기화
 *  - PC: 더블 클릭 / 모바일: 길게 눌러 카테고리 이름 편집
 *  - 아코디언 방식 카테고리 접기/펼치기
 *  - Daily Progress 차트와 연동하여 전체 진행률 시각화
 *
 * 핵심 구조:
 *  - habitData: [{ category, items: [{id, text, completed}] }]
 *  - renderHabits: DOM 렌더링
 *  - saveHabits: LocalStorage 저장
 *  - showCustomPrompt: 사용자 입력 모달 제어
 *  - initHabitTracker: 모듈 초기화 및 이벤트 바인딩
 *
 * SPA/실시간 업데이트 포인트:
 *  - habitUpdated 이벤트 발생 → Daily Progress 차트 갱신
 *  - 날짜 변경 시 completed 상태 초기화
 * ===================================================================================
 */

import { saveToStorage, loadFromStorage } from '../utils/storage.js';
import { initDailyProgress } from './daily.js';

// -------------------- 1️⃣ 전역 상태 및 모달 요소 --------------------
let habitData = [];
const promptOverlay = document.getElementById('custom-prompt-overlay');
const promptModal = document.getElementById('custom-prompt-modal');
const promptTitle = document.getElementById('prompt-title');
const promptInput = document.getElementById('prompt-input');
const confirmBtn = document.getElementById('prompt-confirm-btn');
const cancelBtn = document.getElementById('prompt-cancel-btn');

// -------------------- 2️⃣ 커스텀 모달 제어 --------------------
function showCustomPrompt(
   title,
   placeholder = '이름을 입력하세요...',
   initialValue = '',
) {
   return new Promise((resolve) => {
      promptTitle.textContent = title;
      promptInput.placeholder = placeholder;
      promptInput.value = initialValue;
      promptOverlay.classList.remove('hidden');
      setTimeout(() => promptInput.focus(), 50);

      const closeModalAndResolve = (value) => {
         promptOverlay.classList.add('hidden');
         confirmBtn.removeEventListener('click', onConfirm);
         cancelBtn.removeEventListener('click', onCancel);
         promptOverlay.removeEventListener('click', onOverlayClick);
         document.removeEventListener('keydown', onKeydown);
         resolve(value);
      };

      const onConfirm = () =>
         closeModalAndResolve(promptInput.value.trim() || null);
      const onCancel = () => closeModalAndResolve(null);
      const onKeydown = (e) => {
         if (e.key === 'Enter') onConfirm();
         if (e.key === 'Escape') onCancel();
      };
      const onOverlayClick = (e) => {
         if (e.target === promptOverlay) onCancel();
      };

      confirmBtn.addEventListener('click', onConfirm);
      cancelBtn.addEventListener('click', onCancel);
      promptOverlay.addEventListener('click', onOverlayClick);
      document.addEventListener('keydown', onKeydown);
   });
}

// -------------------- 3️⃣ 렌더링 & 데이터 관리 --------------------
function renderHabits(habitListContainer) {
   if (!habitListContainer) return;

   const openCategories = new Set(
      [...habitListContainer.querySelectorAll('.habit-group.open')].map(
         (el) => el.dataset.index,
      ),
   );

   habitListContainer.innerHTML = '';

   habitData.forEach((group, index) => {
      const groupEl = document.createElement('div');
      groupEl.className = 'habit-group';
      groupEl.dataset.index = index;

      let itemsHTML = '';
      group.items.forEach((habit) => {
         itemsHTML += `
            <li class="habit-item ${habit.completed ? 'done' : ''}">
               <input type="checkbox" id="habit-${habit.id}" data-id="${habit.id}" ${habit.completed ? 'checked' : ''}>
               <label for="habit-${habit.id}">${habit.text}</label>
               <button class="delete-habit-btn" data-id="${habit.id}" aria-label="습관 삭제">🗑️</button>
            </li>
         `;
      });

      groupEl.innerHTML = `
         <div class="habit-category-header">
            <h3 class="habit-category-title" data-index="${index}" data-category="${group.category}">${group.category}</h3>
            <div class="category-controls">
               <button class="add-habit-to-category-btn" data-index="${index}" aria-label="이 카테고리에 습관 추가">+</button>
               <button class="delete-category-btn" data-index="${index}" aria-label="카테고리 삭제">🗑️</button>
            </div>
         </div>
         <ul class="habit-list">${itemsHTML}</ul>
      `;

      if (openCategories.has(String(index))) groupEl.classList.add('open');
      habitListContainer.appendChild(groupEl);
   });

   // Daily Progress 차트 갱신
   document.dispatchEvent(new Event('habitUpdated'));
}

function getTodayDateString() {
   return new Date().toISOString().split('T')[0];
}
function saveHabits() {
   saveToStorage('habitTracker', {
      date: getTodayDateString(),
      data: habitData,
   });
}
function updateHabitStatus(habitId, isCompleted) {
   habitData.forEach((group) => {
      const habit = group.items.find((h) => h.id === habitId);
      if (habit) habit.completed = isCompleted;
   });
   saveHabits();
}

// -------------------- 4️⃣ CRUD 기능 --------------------
async function addHabit(categoryIndex, habitListContainer) {
   const text = await showCustomPrompt(
      '새 습관 추가',
      '습관 내용을 입력하세요...',
   );
   if (!text) return;
   habitData[categoryIndex].items.push({
      id: Date.now(),
      text,
      completed: false,
   });
   saveHabits();
   renderHabits(habitListContainer);
}

async function addCategory(habitListContainer) {
   const categoryName = await showCustomPrompt(
      '새 카테고리 추가',
      '카테고리 이름을 입력하세요...',
   );
   if (!categoryName) return;
   habitData.push({ category: categoryName, items: [] });
   saveHabits();
   renderHabits(habitListContainer);
}

function deleteHabit(habitId) {
   habitData.forEach(
      (group) => (group.items = group.items.filter((h) => h.id !== habitId)),
   );
   saveHabits();
}

function deleteCategory(index) {
   if (!habitData[index]) return;
   if (
      confirm(
         `"${habitData[index].category}" 카테고리를 정말 삭제하시겠습니까?`,
      )
   ) {
      habitData.splice(index, 1);
      saveHabits();
   }
}

function updateCategoryName(index, newName) {
   if (habitData[index]) {
      habitData[index].category = newName;
      saveHabits();
   }
}

function getDefaultHabits() {
   return [
      {
         category: '아침 루틴',
         items: [
            { id: Date.now() + 1, text: '물 한 잔', completed: false },
            { id: Date.now() + 2, text: '스트레칭', completed: false },
         ],
      },
      {
         category: '저녁 루틴',
         items: [{ id: Date.now() + 3, text: '일기 쓰기', completed: false }],
      },
   ];
}

// -------------------- 5️⃣ 모듈 초기화 --------------------
export function initHabitTracker() {
   const habitWidget = document.querySelector('.habit-widget');
   const habitListContainer = document.getElementById('habit-list-container');
   if (!habitWidget || !habitListContainer) return;

   // 데이터 로드 및 날짜별 초기화
   const savedData = loadFromStorage('habitTracker');
   const todayString = getTodayDateString();
   if (savedData && Array.isArray(savedData.data)) {
      habitData =
         savedData.date === todayString
            ? savedData.data
            : savedData.data.map((group) => ({
                 ...group,
                 items: group.items.map((h) => ({ ...h, completed: false })),
              }));
   } else habitData = getDefaultHabits();

   saveHabits();
   renderHabits(habitListContainer);

   // -------------------- 6️⃣ 이벤트 위임 --------------------
   const handleInteraction = (e) => {
      const target = e.target;
      if (target.closest('#add-category-btn')) {
         addCategory(habitListContainer);
         return;
      }
      if (target.type === 'checkbox') {
         updateHabitStatus(Number(target.dataset.id), target.checked);
         renderHabits(habitListContainer);
         return;
      }
      if (target.closest('.delete-habit-btn')) {
         if (confirm('이 습관을 정말 삭제하시겠어요?')) {
            deleteHabit(Number(target.dataset.id));
            renderHabits(habitListContainer);
         }
         return;
      }
      if (target.closest('.delete-category-btn')) {
         deleteCategory(Number(target.dataset.index));
         renderHabits(habitListContainer);
         return;
      }
      if (target.closest('.add-habit-to-category-btn')) {
         addHabit(Number(target.dataset.index), habitListContainer);
         return;
      }
      const header = target.closest('.habit-category-header');
      if (header) header.parentElement.classList.toggle('open');
   };
   habitWidget.removeEventListener('click', handleInteraction);
   habitWidget.addEventListener('click', handleInteraction);

   // -------------------- 7️⃣ 카테고리 이름 편집 --------------------
   let pressTimer = null;
   const startEdit = async (titleEl) => {
      const originalName = titleEl.dataset.category;
      const index = Number(titleEl.dataset.index);
      const newName = await showCustomPrompt(
         '카테고리 이름 수정',
         '새 이름을 입력하세요',
         originalName,
      );
      if (newName && newName !== originalName)
         updateCategoryName(index, newName);
      renderHabits(habitListContainer);
   };
   habitListContainer.addEventListener('dblclick', (e) => {
      if (e.target.classList.contains('habit-category-title'))
         startEdit(e.target);
   });
   habitListContainer.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('habit-category-title')) {
         pressTimer = setTimeout(() => {
            e.preventDefault();
            startEdit(e.target);
         }, 500);
      }
   });
   habitListContainer.addEventListener('touchend', () =>
      clearTimeout(pressTimer),
   );
   habitListContainer.addEventListener('touchmove', () =>
      clearTimeout(pressTimer),
   );

   // -------------------- 8️⃣ Daily Progress 초기화 --------------------
   initDailyProgress();
}
