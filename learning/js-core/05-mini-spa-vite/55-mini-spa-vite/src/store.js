export const store = {
   state: {
      todos: [],
      filter: 'all',
      route: '/',
      status: 'idle',
   },

   set(next) {
      this.state = { ...this.state, ...next };
      window.render();
   },
};
