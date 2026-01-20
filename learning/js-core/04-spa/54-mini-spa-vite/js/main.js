// =====================
// STATE
// =====================
let state = {
   route: '/',
};

// =====================
// ROUTER
// =====================
const routes = {
   '/': () => `<h2>Home</h2><p>Vite SPA 홈</p>`,
   '/todos': () => `<h2>Todos</h2><p>새로고침 OK</p>`,
   '/about': () => `<h2>About</h2><p>SPA 실전 환경</p>`,
};

// =====================
// DOM
// =====================
const app = document.getElementById('app');
const navLinks = document.querySelectorAll('[data-link]');

// =====================
// RENDER
// =====================
function render() {
   navLinks.forEach((link) =>
      link.classList.toggle(
         'active',
         link.getAttribute('href') === state.route,
      ),
   );

   const view = routes[state.route];
   app.innerHTML = view ? view() : `<h2>404</h2>`;
}

// =====================
// NAVIGATION
// =====================
function navigate(route) {
   history.pushState({ route }, '', route);
   state.route = route;
   render();
}

// =====================
// EVENTS
// =====================
document.addEventListener('click', (e) => {
   const link = e.target.closest('[data-link]');
   if (!link) return;

   e.preventDefault();
   navigate(link.getAttribute('href'));
});

window.addEventListener('popstate', (e) => {
   state.route = e.state?.route || location.pathname;
   render();
});

// =====================
// INIT
// =====================
function init() {
   state.route = location.pathname;
   history.replaceState({ route: state.route }, '', state.route);
   render();
}

init();
