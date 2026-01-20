// --------------------
// STATE
// --------------------
let state = {
   status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
   data: [],
   error: null,
};

// --------------------
// DOM
// --------------------
const listEl = document.getElementById('list');
const statusEl = document.getElementById('status');
const errorEl = document.getElementById('error');

// --------------------
// RENDER
// --------------------
function render() {
   statusEl.className = 'status';
   errorEl.textContent = '';
   listEl.innerHTML = '';

   if (state.status === 'idle') {
      statusEl.textContent = '대기 중';
   }

   if (state.status === 'loading') {
      statusEl.textContent = '불러오는 중...';
      statusEl.classList.add('loading');
   }

   if (state.status === 'error') {
      statusEl.textContent = '오류 발생';
      errorEl.textContent = state.error;
   }

   if (state.status === 'success') {
      statusEl.textContent = '완료';
      listEl.innerHTML = state.data
         .map((item) => `<li class="item">${item.title}</li>`)
         .join('');
   }
}

// --------------------
// ASYNC LOGIC
// --------------------
async function loadData() {
   if (state.status === 'loading') return; // 중복 요청 방지

   state = { status: 'loading', data: [], error: null };
   render();

   try {
      const res = await fetch(
         'https://jsonplaceholder.typicode.com/todos?_limit=5',
      );

      if (!res.ok) throw new Error('네트워크 오류');

      const data = await res.json();

      state = { status: 'success', data, error: null };
   } catch (err) {
      state = { status: 'error', data: [], error: err.message };
   }

   render();
}

function reset() {
   state = { status: 'idle', data: [], error: null };
   render();
}

// --------------------
// EVENT ARCHITECTURE
// --------------------
document.addEventListener('click', (e) => {
   const action = e.target.dataset.action;
   if (!action) return;

   if (action === 'load') loadData();
   if (action === 'reset') reset();
});

// initial
render();
