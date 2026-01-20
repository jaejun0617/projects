/* -----------------------------
   Reference State
----------------------------- */
const INITIAL_ITEMS = [
   { id: 1, text: 'Item A' },
   { id: 2, text: 'Item B' },
   { id: 3, text: 'Item C' },
];

/* -----------------------------
    History State
 ----------------------------- */
let history = [structuredClone(INITIAL_ITEMS)];

const listEl = document.getElementById('list');
const undoBtn = document.getElementById('undoBtn');
const resetBtn = document.getElementById('resetBtn');

/* -----------------------------
    Helpers
 ----------------------------- */
function getCurrentState() {
   return history[history.length - 1];
}

function pushState(nextState) {
   history.push(structuredClone(nextState));
   render();
}

/* -----------------------------
    Render
 ----------------------------- */
function render() {
   const items = getCurrentState();

   listEl.innerHTML = items
      .map(
         (item) => `
       <li data-id="${item.id}">
          ${item.text}
       </li>
    `,
      )
      .join('');

   undoBtn.disabled = history.length <= 1;
}

/* -----------------------------
    Events
 ----------------------------- */
// 클릭 시 아이템 제거 (상태 변경 예시)
listEl.addEventListener('click', (e) => {
   const id = Number(e.target.dataset.id);
   const current = getCurrentState();

   const next = current.filter((item) => item.id !== id);
   pushState(next);
});

// Undo
undoBtn.addEventListener('click', () => {
   if (history.length > 1) {
      history.pop();
      render();
   }
});

// Reset
resetBtn.addEventListener('click', () => {
   history = [structuredClone(INITIAL_ITEMS)];
   render();
});

/* -----------------------------
    Init
 ----------------------------- */
render();
