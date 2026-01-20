// --------------------
// ROUTER STATE
// --------------------
let state = {
   route: '/',
};

// --------------------
// ROUTE TABLE
// --------------------
const routes = {
   '/': () => `<h2>Home</h2><p>홈 화면입니다.</p>`,
   '/todos': () => `<h2>Todos</h2><p>Todo 리스트 화면</p>`,
   '/about': () => `<h2>About</h2><p>소개 페이지</p>`,
};

// --------------------
// DOM
// --------------------
const viewEl = document.getElementById('view');
const navLinks = document.querySelectorAll('[data-link]');

// --------------------
// RENDER
// --------------------
function render() {
   navLinks.forEach((link) => {
      link.classList.toggle(
         'active',
         link.getAttribute('href') === state.route,
      );
   });

   const view = routes[state.route];
   viewEl.innerHTML = view
      ? view()
      : `<h2>404</h2><p>페이지를 찾을 수 없습니다.</p>`;
}

// --------------------
// ROUTER CORE
// --------------------
function navigate(route) {
   if (route === state.route) return;

   history.pushState({ route }, '', route);
   state = { route };
   render();
}

// --------------------
// EVENTS
// --------------------
document.addEventListener('click', (e) => {
   const link = e.target.closest('[data-link]');
   if (!link) return;

   e.preventDefault(); // ❗ 서버 이동 차단
   const route = link.getAttribute('href');
   navigate(route);
});

// 뒤로 / 앞으로
window.addEventListener('popstate', (e) => {
   const route = e.state?.route || location.pathname;
   state = { route };
   render();
});

// --------------------
// INIT
// --------------------
function init() {
   const initialRoute = location.pathname;
   history.replaceState({ route: initialRoute }, '', initialRoute);
   state = { route: initialRoute };
   render();
}

init();
