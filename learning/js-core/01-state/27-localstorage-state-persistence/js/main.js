const STORAGE_KEY = 'day27-items';

/* -----------------------------
   Reference State (기준 상태)
----------------------------- */
const INITIAL_ITEMS = [
   { id: 1, text: 'Learn JS', selected: false },
   { id: 2, text: 'Practice DOM', selected: false },
   { id: 3, text: 'Persist State', selected: false },
];

/* -----------------------------
   State
----------------------------- */
let items = loadState() ?? structuredClone(INITIAL_ITEMS);

const listEl = document.getElementById('list');
const bulkDeleteBtn = document.getElementById('bulkDelete');
const countText = document.getElementById('countText');
const masterCheckbox = document.getElementById('masterCheckbox');
const resetBtn = document.getElementById('resetState');

/* -----------------------------
   Persistence
----------------------------- */
function saveState() {
   localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadState() {
   const raw = localStorage.getItem(STORAGE_KEY);
   return raw ? JSON.parse(raw) : null;
}

function resetState() {
   localStorage.removeItem(STORAGE_KEY);
   items = structuredClone(INITIAL_ITEMS);
   render();
}

/* -----------------------------
   Derived State
----------------------------- */
function getSelectionState() {
   const total = items.length;
   const selectedCount = items.filter((i) => i.selected).length;

   return {
      total,
      selectedCount,
      all: total > 0 && selectedCount === total,
      none: selectedCount === 0,
      some: selectedCount > 0 && selectedCount < total,
   };
}

/* -----------------------------
   Render
----------------------------- */
function render() {
   const selection = getSelectionState();

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

   countText.textContent = `선택 ${selection.selectedCount} / ${selection.total}`;

   masterCheckbox.checked = selection.all;
   masterCheckbox.indeterminate = selection.some;

   bulkDeleteBtn.disabled = selection.none;

   saveState();
}

/* -----------------------------
   Events
----------------------------- */
listEl.addEventListener('change', (e) => {
   const id = Number(e.target.dataset.id);

   items = items.map((item) =>
      item.id === id ? { ...item, selected: e.target.checked } : item,
   );

   render();
});

masterCheckbox.addEventListener('change', (e) => {
   items = items.map((item) => ({
      ...item,
      selected: e.target.checked,
   }));

   render();
});

bulkDeleteBtn.addEventListener('click', () => {
   items = items.filter((item) => !item.selected);
   render();
});

resetBtn.addEventListener('click', resetState);

/* -----------------------------
   Init
----------------------------- */
render();
