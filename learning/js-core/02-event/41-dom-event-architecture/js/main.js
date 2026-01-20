// --- STATE ---
let items = [];
let nextId = 1;

// --- RENDER ---
function render() {
   const list = document.getElementById('list');
   list.innerHTML = items
      .map(
         (item) => `
      <li class="item ${item.done ? 'done' : ''}" data-id="${item.id}">
        <span>${item.text}</span>
        <div class="actions">
          <button data-action="toggle">완료</button>
          <button data-action="remove">삭제</button>
        </div>
      </li>
    `,
      )
      .join('');
}

// --- STATE OPERATIONS ---
function addItem() {
   items = [
      ...items,
      { id: nextId++, text: `Item ${nextId - 1}`, done: false },
   ];
}

function toggleItem(id) {
   items = items.map((it) => (it.id === id ? { ...it, done: !it.done } : it));
}

function removeItem(id) {
   items = items.filter((it) => it.id !== id);
}

function clearAll() {
   items = [];
}

// --- EVENT ARCHITECTURE (Single Root Listener) ---
document.addEventListener('click', (e) => {
   const action = e.target.dataset.action;
   if (!action) return;

   // 상단 컨트롤
   if (action === 'add') addItem();
   if (action === 'clear') clearAll();

   // 리스트 아이템 (위임)
   const itemEl = e.target.closest('.item');
   if (itemEl) {
      const id = Number(itemEl.dataset.id);
      if (action === 'toggle') toggleItem(id);
      if (action === 'remove') removeItem(id);
   }

   render();
});

// initial render
render();
