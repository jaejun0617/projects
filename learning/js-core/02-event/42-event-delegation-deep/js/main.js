// --------------------
// STATE
// --------------------
let items = [];
let nextId = 1;

// --------------------
// RENDER
// --------------------
const list = document.getElementById('list');

function render() {
   list.innerHTML = items
      .map(
         (item) => `
    <li class="item ${item.done ? 'done' : ''}" data-id="${item.id}">
      <div>
        <strong>${item.text}</strong>
        <span class="badge">id:${item.id}</span>
      </div>
      <div class="actions">
        <button data-action="toggle">완료</button>
        <button data-action="remove">삭제</button>
        <button data-action="inner">내부</button>
      </div>
    </li>
  `,
      )
      .join('');
}

// --------------------
// STATE OPS
// --------------------
function addItem() {
   items = [...items, { id: nextId, text: `Item ${nextId}`, done: false }];
   nextId += 1;
}
function toggleItem(id) {
   items = items.map((it) => (it.id === id ? { ...it, done: !it.done } : it));
}
function removeItem(id) {
   items = items.filter((it) => it.id !== id);
}
function reset() {
   items = [];
   nextId = 1;
}

// --------------------
// EVENT ARCHITECTURE
// --------------------
const useCaptureEl = document.getElementById('useCapture');
const blockBubbleEl = document.getElementById('blockBubble');

function rootHandler(e) {
   const action = e.target.dataset.action;
   if (!action) return;

   // 상단 컨트롤
   if (action === 'add') addItem();
   if (action === 'reset') reset();

   // 리스트 위임
   const itemEl = e.target.closest('.item');
   if (itemEl) {
      const id = Number(itemEl.dataset.id);
      if (action === 'toggle') toggleItem(id);
      if (action === 'remove') removeItem(id);
      if (action === 'inner') {
         // 내부 버튼에서만 동작 확인
         console.log('inner action on item', id);
      }
   }

   render();
}

// 루트 리스너 (버블/캡처 토글)
let currentCapture = false;
function bindRoot() {
   document.removeEventListener('click', rootHandler, currentCapture);
   currentCapture = useCaptureEl.checked;
   document.addEventListener('click', rootHandler, currentCapture);
}
bindRoot();
useCaptureEl.addEventListener('change', bindRoot);

// 아이템 내부에서 버블 차단 (의도적 파손)
list.addEventListener('click', (e) => {
   if (!blockBubbleEl.checked) return;
   if (e.target.dataset.action === 'inner') {
      e.stopPropagation();
      console.log('stopPropagation() executed');
   }
});

// initial
render();
