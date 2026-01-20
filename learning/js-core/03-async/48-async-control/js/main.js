// --------------------
// STATE
// --------------------
let state = {
   status: 'idle', // idle | loading | success | cancelled
   data: [],
};

let currentRequestId = 0; // Race 제어용
let abortController = null; // Cancel 제어용

// --------------------
// DOM
// --------------------
const statusEl = document.getElementById('status');
const listEl = document.getElementById('list');
const noteEl = document.getElementById('note');
const disableToggle = document.getElementById('disableDuringLoad');
const loadBtn = document.querySelector('[data-action="load"]');

// --------------------
// RENDER
// --------------------
function render() {
   statusEl.textContent = '';
   listEl.innerHTML = '';
   noteEl.textContent = '';

   if (state.status === 'idle') {
      statusEl.textContent = '대기 중';
      loadBtn.disabled = false;
   }

   if (state.status === 'loading') {
      statusEl.textContent = '불러오는 중...';
      loadBtn.disabled = disableToggle.checked;
   }

   if (state.status === 'cancelled') {
      statusEl.textContent = '요청 취소됨';
      loadBtn.disabled = false;
   }

   if (state.status === 'success') {
      statusEl.textContent = '완료 (최신 요청만 반영)';
      loadBtn.disabled = false;
      listEl.innerHTML = state.data
         .map((item) => `<li class="item">${item.title}</li>`)
         .join('');
   }
}

// --------------------
// ASYNC CONTROL
// --------------------
async function loadData() {
   // Disable 전략
   if (disableToggle.checked && state.status === 'loading') return;

   // Race 전략: 요청 ID 증가
   const requestId = ++currentRequestId;

   // Cancel 전략: 이전 요청 취소
   if (abortController) abortController.abort();
   abortController = new AbortController();

   state = { status: 'loading', data: [] };
   render();

   noteEl.textContent = 'Race: 최신 requestId만 반영 | Cancel: 이전 요청 abort';

   try {
      // 일부러 지연을 줘서 race를 체감
      const delay = Math.random() * 1500 + 300;
      await new Promise((res) => setTimeout(res, delay));

      const res = await fetch(
         'https://jsonplaceholder.typicode.com/todos?_limit=5',
         { signal: abortController.signal },
      );

      const data = await res.json();

      // Race 방어: 최신 요청만 승자
      if (requestId !== currentRequestId) {
         return; // 패배한 요청 무시
      }

      state = { status: 'success', data };
   } catch (err) {
      if (err.name === 'AbortError') {
         state = { status: 'cancelled', data: [] };
      }
   }

   render();
}

function cancel() {
   if (abortController) {
      abortController.abort();
   }
}

// --------------------
// EVENT
// --------------------
document.addEventListener('click', (e) => {
   const action = e.target.dataset.action;
   if (!action) return;

   if (action === 'load') loadData();
   if (action === 'cancel') cancel();
});

// initial
render();
