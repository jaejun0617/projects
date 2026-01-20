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
const statusEl = document.getElementById('status');
const listEl = document.getElementById('list');
const errorBoxEl = document.getElementById('errorBox');
const errorMsgEl = document.getElementById('errorMsg');

// --------------------
// RENDER
// --------------------
function render() {
   statusEl.textContent = '';
   listEl.innerHTML = '';
   errorBoxEl.classList.add('hidden');

   if (state.status === 'idle') {
      statusEl.textContent = '대기 중';
   }

   if (state.status === 'loading') {
      statusEl.textContent = '불러오는 중...';
      statusEl.classList.add('loading');
   }

   if (state.status === 'error') {
      statusEl.textContent = '오류 발생';
      errorBoxEl.classList.remove('hidden');
      errorMsgEl.textContent = state.error;
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
async function fetchData() {
   if (state.status === 'loading') return;

   state = { status: 'loading', data: [], error: null };
   render();

   try {
      // ❗ 일부러 실패 확률을 만든다
      const shouldFail = Math.random() < 0.5;
      const url = shouldFail
         ? 'https://jsonplaceholder.typicode.com/invalid-endpoint'
         : 'https://jsonplaceholder.typicode.com/todos?_limit=5';

      const res = await fetch(url);

      if (!res.ok) {
         if (res.status >= 500) {
            throw new Error('서버에 문제가 발생했습니다.');
         }
         throw new Error('요청을 처리할 수 없습니다.');
      }

      const data = await res.json();
      state = { status: 'success', data, error: null };
   } catch (err) {
      state = {
         status: 'error',
         data: [],
         error: err.message || '알 수 없는 오류',
      };
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

   if (action === 'load') fetchData();
   if (action === 'retry') fetchData();
   if (action === 'reset') reset();
});

// initial
render();
