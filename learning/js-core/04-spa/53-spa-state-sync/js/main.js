// ====================
// STATE
// ====================
let state = {
   route: '/', // URL path
   filter: 'all', // UI state
};

// ====================
// ROUTE TABLE
// ====================
const routes = {
   '/': () => `<h2>Home</h2><p>홈 화면</p>`,
   '/todos': () =>
      `<h2>Todos</h2><p>현재 필터: <strong>${state.filter}</strong></p>`,
   '/about': () => `<h2>About</h2><p>소개 페이지</p>`,
};

// ====================
// URL <-> STATE SYNC
// ====================
function syncStateToURL() {
   const params = new URLSearchParams();
   if (state.filter !== 'all') params.set('filter', state.filter);

   const url = state.route + (params.toString() ? `?${params.toString()}` : '');

   history.pushState({ ...state }, '', url);
}

function syncURLToState() {
   const { pathname, search } = location;
   const params = new URLSearchParams(search);

   state = {
      route: pathname,
      filter: params.get('filter') || 'all',
   };
}

// ====================
// DOM
// ====================
const viewEl = document.getElementById('view');
const routeBtns = document.querySelectorAll('[data-route]');
const filterBtns = document.querySelectorAll('[data-filter]');

// ====================
// RENDER
// ====================
function render() {
   routeBtns.forEach((btn) =>
      btn.classList.toggle('active', btn.dataset.route === state.route),
   );

   filterBtns.forEach((btn) =>
      btn.classList.toggle('active', btn.dataset.filter === state.filter),
   );

   const view = routes[state.route];
   viewEl.innerHTML = view ? view() : `<h2>404</h2><p>페이지 없음</p>`;
}

// ====================
// EVENTS
// ====================
document.addEventListener('click', (e) => {
   const route = e.target.dataset.route;
   const filter = e.target.dataset.filter;

   if (route) {
      state = { ...state, route };
      syncStateToURL();
      render();
   }

   if (filter) {
      state = { ...state, filter };
      syncStateToURL();
      render();
   }
});

window.addEventListener('popstate', () => {
   syncURLToState();
   render();
});

// ====================
// INIT
// ====================
function init() {
   syncURLToState();
   history.replaceState({ ...state }, '', location.href);
   render();
}

init();
