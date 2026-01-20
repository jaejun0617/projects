const INITIAL_ITEMS = [
   { id: 1, text: 'Item A' },
   { id: 2, text: 'Item B' },
   { id: 3, text: 'Item C' },
   { id: 4, text: 'Item D' },
];

let items = structuredClone(INITIAL_ITEMS);

const listEl = document.getElementById('list');
const resetBtn = document.getElementById('resetState');

let draggedId = null;

/* -----------------------------
    Render
 ----------------------------- */
function render() {
   listEl.innerHTML = items
      .map(
         (item) => `
       <li draggable="true" data-id="${item.id}">
          ${item.text}
       </li>
    `,
      )
      .join('');
}

/* -----------------------------
    Drag Logic
 ----------------------------- */
listEl.addEventListener('dragstart', (e) => {
   draggedId = Number(e.target.dataset.id);
   e.target.classList.add('dragging');
});

listEl.addEventListener('dragend', (e) => {
   e.target.classList.remove('dragging');
});

listEl.addEventListener('dragover', (e) => {
   e.preventDefault();
});

listEl.addEventListener('drop', (e) => {
   const targetId = Number(e.target.dataset.id);
   if (draggedId === targetId) return;

   const fromIndex = items.findIndex((i) => i.id === draggedId);
   const toIndex = items.findIndex((i) => i.id === targetId);

   const updated = [...items];
   const [moved] = updated.splice(fromIndex, 1);
   updated.splice(toIndex, 0, moved);

   items = updated;
   render();
});

/* -----------------------------
    Reset
 ----------------------------- */
resetBtn.addEventListener('click', () => {
   items = structuredClone(INITIAL_ITEMS);
   render();
});

render();
