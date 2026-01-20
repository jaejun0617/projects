import { store } from './store.js';
import { navigate, initRouter } from './router.js';
import { Home, About, Todos } from './views.js';

const app = document.getElementById('app');
const links = document.querySelectorAll('[data-link]');

const routes = {
   '/': Home,
   '/about': About,
   '/todos': () => Todos(store.state),
};

window.render = function () {
   links.forEach((link) =>
      link.classList.toggle(
         'active',
         link.getAttribute('href') === store.state.route,
      ),
   );

   const view = routes[store.state.route];
   app.innerHTML = view ? view() : '<h2>404</h2>';
};

document.addEventListener('click', (e) => {
   const link = e.target.closest('[data-link]');
   if (link) {
      e.preventDefault();
      navigate(link.getAttribute('href'));
   }

   const filter = e.target.dataset.filter;
   if (filter) {
      store.set({ filter });
   }
});

async function loadTodos() {
   store.set({ status: 'loading' });
   const res = await fetch(
      'https://jsonplaceholder.typicode.com/todos?_limit=8',
   );
   const data = await res.json();
   store.set({ todos: data, status: 'success' });
}

initRouter();
loadTodos();
store.set({});
