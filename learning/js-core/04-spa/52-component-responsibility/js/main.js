// ====================
// STORE (Single Source of Truth)
// ====================
let state = {
   count: 0,
};

function setState(next) {
   state = { ...state, ...next };
   renderApp();
}

// ====================
// COMPONENTS
// ====================

// CounterDisplay: "보여주기" 책임
function CounterDisplay({ count }) {
   const el = document.createElement('div');
   el.className = 'panel';
   el.innerHTML = `<strong>Count:</strong> ${count}`;
   return el;
}

// CounterControls: "행동" 책임
function CounterControls({ onIncrement, onDecrement }) {
   const el = document.createElement('div');
   el.className = 'panel';

   const incBtn = document.createElement('button');
   incBtn.textContent = '+';
   incBtn.onclick = onIncrement;

   const decBtn = document.createElement('button');
   decBtn.textContent = '-';
   decBtn.onclick = onDecrement;

   el.append(incBtn, decBtn);
   return el;
}

// ====================
// APP (Composition Root)
// ====================
const appEl = document.getElementById('app');

function App() {
   appEl.innerHTML = '';

   const display = CounterDisplay({ count: state.count });
   const controls = CounterControls({
      onIncrement: () => setState({ count: state.count + 1 }),
      onDecrement: () => setState({ count: state.count - 1 }),
   });

   appEl.append(display, controls);
}

function renderApp() {
   App();
}

// init
renderApp();
