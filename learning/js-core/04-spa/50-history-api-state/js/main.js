// --------------------
// STATE
// --------------------
let state = {
   route: '/', // URL = State
};

// --------------------
// ROUTE TABLE
// --------------------
const routes = {
   '/': () => `<h2>Home</h2><p>홈 화면입니다.</p>`,
   '/todos': () => `<h2>Todos</h2><p>할 일 목록 화면</p>`,
   '/about': () => `<h2>About</h2><p>소개 페이지</p>`,
};

// --------------------
// DOM
// --------------------
const viewEl = document.getElementById('view');
const navBtns = document.querySelectorAll('[data-route]');

// --------------------
// RENDER
// --------------------
function render() {
   navBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.route === state.route);
   });

   const renderView = routes[state.route];
   viewEl.innerHTML = renderView
      ? renderView()
      : `<h2>404</h2><p>페이지를 찾을 수 없습니다.</p>`;
}

// --------------------
// HISTORY CONTROL
// --------------------
function navigate(route) {
   if (route === state.route) return;

   history.pushState({ route }, '', route);
   state = { ...state, route };
   render();
}

// --------------------
// EVENTS
// --------------------
document.addEventListener('click', (e) => {
   const route = e.target.dataset.route;
   if (!route) return;
   navigate(route);
});

// 뒤로가기 / 앞으로가기
window.addEventListener('popstate', (e) => {
   const route = e.state?.route || location.pathname;
   state = { ...state, route };
   render();
});

// --------------------
// INIT (직접 진입 대응)
// --------------------
function init() {
   const initialRoute = location.pathname;
   state = { ...state, route: initialRoute };
   history.replaceState({ route: initialRoute }, '', initialRoute);
   render();
}

init();
