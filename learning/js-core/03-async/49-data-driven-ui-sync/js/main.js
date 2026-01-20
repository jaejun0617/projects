// --------------------
// STATE (Single Source of Truth)
// --------------------
let state = {
   status: 'idle', // idle | loading | success | error
   items: [], // server data (fact)
   filter: 'all', // intent
   search: '', // intent
};

// --------------------
// STORAGE SYNC
// --------------------
const STORAGE_KEY = 'day49-state';

function saveState() {
   localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
         items: state.items,
         filter: state.filter,
         search: state.search,
      }),
   );
}

function restoreState() {
   const saved = localStorage.getItem(STORAGE_KEY);
   if (!saved) return;

   const parsed = JSON.parse(saved);
   state = {
      ...state,
      status: 'success',
      items: parsed.items || [],
      filter: parsed.filter || 'all',
      search: parsed.search || '',
   };
}

// --------------------
// DERIVED STATE (Never Stored)
// --------------------
function getVisibleItems() {
   return state.items
      .filter((item) => {
         if (state.filter === 'active') return !item.completed;
         if (state.filter === 'completed') return item.completed;
         return true;
      })
      .filter((item) =>
         item.title.toLowerCase().includes(state.search.toLowerCase()),
      );
}

// --------------------
// DOM
// --------------------
const statusEl = document.getElementById('status');
const listEl = document.getElementById('list');
const filterBtns = document.querySelectorAll('[data-filter]');

// --------------------
// RENDER
// --------------------
function render() {
   statusEl.textContent = '';
   listEl.innerHTML = '';

   filterBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === state.filter);
   });

   if (state.status === 'idle') {
      statusEl.textContent = '대기 중';
      return;
   }

   if (state.status === 'loading') {
      statusEl.textContent = '불러오는 중...';
      return;
   }

   if (state.status === 'error') {
      statusEl.textContent = '오류 발생';
      return;
   }

   const items = getVisibleItems();
   statusEl.textContent = `총 ${items.length}개`;

   listEl.innerHTML = items
      .map(
         (item) => `
        <li class="item ${item.completed ? 'completed' : ''}">
          ${item.title}
        </li>
      `,
      )
      .join('');
}

// --------------------
// ASYNC (Data Source)
// --------------------
async function loadData() {
   state = { ...state, status: 'loading' };
   render();

   try {
      const res = await fetch(
         'https://jsonplaceholder.typicode.com/todos?_limit=12',
      );
      const data = await res.json();

      state = {
         ...state,
         status: 'success',
         items: data,
      };
      saveState();
   } catch {
      state = { ...state, status: 'error' };
   }

   render();
}

function reset() {
   localStorage.removeItem(STORAGE_KEY);
   state = {
      status: 'idle',
      items: [],
      filter: 'all',
      search: '',
   };
   render();
}

// --------------------
// EVENTS (Intent Only)
// --------------------
document.addEventListener('click', (e) => {
   const action = e.target.dataset.action;
   const filter = e.target.dataset.filter;

   if (action === 'load') loadData();
   if (action === 'reset') reset();

   if (filter) {
      state = { ...state, filter };
      saveState();
      render();
   }
});

document.addEventListener('input', (e) => {
   if (e.target.dataset.action === 'search') {
      state = { ...state, search: e.target.value };
      saveState();
      render();
   }
});

// --------------------
// INIT
// --------------------
restoreState();
render();
