// 상태 모델
let items = [
   { id: 1, text: 'Learn JS', selected: false },
   { id: 2, text: 'Practice DOM', selected: false },
   { id: 3, text: 'Build State UI', selected: false },
];

const listEl = document.getElementById('list');
const selectAllBtn = document.getElementById('selectAll');
const clearAllBtn = document.getElementById('clearAll');
const bulkDeleteBtn = document.getElementById('bulkDelete');

// 렌더
function render() {
   listEl.innerHTML = items
      .map(
         (item) => `
       <li>
          <input 
             type="checkbox" 
             ${item.selected ? 'checked' : ''} 
             data-id="${item.id}"
          />
          <span>${item.text}</span>
       </li>
    `,
      )
      .join('');

   const hasSelected = items.some((item) => item.selected);
   bulkDeleteBtn.disabled = !hasSelected;
}

// 개별 선택
listEl.addEventListener('change', (e) => {
   const id = Number(e.target.dataset.id);

   items = items.map((item) =>
      item.id === id ? { ...item, selected: e.target.checked } : item,
   );

   render();
});

// 전체 선택
selectAllBtn.addEventListener('click', () => {
   items = items.map((item) => ({ ...item, selected: true }));
   render();
});

// 전체 해제
clearAllBtn.addEventListener('click', () => {
   items = items.map((item) => ({ ...item, selected: false }));
   render();
});

// Bulk Delete
bulkDeleteBtn.addEventListener('click', () => {
   items = items.filter((item) => !item.selected);
   render();
});

// 초기 렌더
render();
