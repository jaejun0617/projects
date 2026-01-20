export function Home() {
   return `
      <div class="card">
        <h2>Home</h2>
        <p>Vite 기반 SPA 실전 프로젝트</p>
      </div>
    `;
}

export function About() {
   return `
      <div class="card">
        <h2>About</h2>
        <p>
          이 프로젝트는 순수 JavaScript로
          SPA 구조를 설계한 포트폴리오 예제입니다.
        </p>
      </div>
    `;
}

export function Todos(state) {
   const visible = state.todos.filter((todo) => {
      if (state.filter === 'active') return !todo.completed;
      if (state.filter === 'completed') return todo.completed;
      return true;
   });

   return `
      <div class="card">
        <h2>Todos</h2>
  
        <div class="filters">
          ${['all', 'active', 'completed']
             .map(
                (f) =>
                   `<button data-filter="${f}" ${state.filter === f ? 'class="active"' : ''}>
              ${f}
            </button>`,
             )
             .join('')}
        </div>
  
        ${visible
           .map(
              (todo) => `
          <div class="todo ${todo.completed ? 'completed' : ''}">
            ${todo.title}
          </div>
        `,
           )
           .join('')}
      </div>
    `;
}
