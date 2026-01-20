// --------------------
// STATE
// --------------------
let mounted = false;
let count = 0;
let cleanupFn = null;

// --------------------
// DOM
// --------------------
const viewEl = document.getElementById('view');
const countEl = document.getElementById('count');
const logEl = document.getElementById('log');
const useCleanupEl = document.getElementById('useCleanup');

// --------------------
// UTIL
// --------------------
function log(message) {
   const li = document.createElement('li');
   li.textContent = message;
   logEl.prepend(li);
}

// --------------------
// VIEW LOGIC
// --------------------
function render() {
   viewEl.classList.toggle('hidden', !mounted);
   countEl.textContent = count;
}

// --------------------
// EVENT HANDLERS
// --------------------
function onCountClick() {
   count += 1;
   countEl.textContent = count;
   log(`countBtn clicked → count=${count}`);
}

// --------------------
// LIFECYCLE
// --------------------
function mountView() {
   if (mounted) return;
   mounted = true;
   log('VIEW MOUNT');

   const btn = document.getElementById('countBtn');
   btn.addEventListener('click', onCountClick);
   log('event listener attached');

   // cleanup 함수 저장
   cleanupFn = () => {
      btn.removeEventListener('click', onCountClick);
      log('event listener removed');
   };

   render();
}

function unmountView() {
   if (!mounted) return;
   mounted = false;
   log('VIEW UNMOUNT');

   if (useCleanupEl.checked && cleanupFn) {
      cleanupFn();
   } else {
      log('⚠️ cleanup skipped');
   }

   render();
}

// --------------------
// ROOT EVENT
// --------------------
document.addEventListener('click', (e) => {
   const action = e.target.dataset.action;
   if (!action) return;

   if (action === 'mount') mountView();
   if (action === 'unmount') unmountView();
});

// initial
render();
