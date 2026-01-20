import { store } from './store.js';

export function navigate(route) {
   history.pushState({ route }, '', route);
   store.set({ route });
}

export function initRouter() {
   store.set({ route: location.pathname });

   window.addEventListener('popstate', (e) => {
      store.set({ route: e.state?.route || location.pathname });
   });
}
