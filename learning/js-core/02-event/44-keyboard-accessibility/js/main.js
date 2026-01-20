// --------------------
// STATE
// --------------------
const items = ['React', 'Vue', 'Svelte', 'Node', 'Figma'];
let keyword = '';
let focusedIndex = -1;

// --------------------
// DERIVED
// --------------------
function getFiltered() {
   return items.filter((name) =>
      name.toLowerCase().includes(keyword.toLowerCase()),
   );
}

// --------------------
// RENDER
// --------------------
const listEl = document.getElementById('list');
const statusEl = document.getElementById('status');

function render() {
   const filtered = getFiltered();

   listEl.innerHTML = filtered
      .map(
         (name, idx) => `
    <li
      class="item"
      role="option"
      tabindex="-1"
      aria-selected="${idx === focusedIndex}"
      data-index="${idx}"
    >
      ${name}
    </li>
  `,
      )
      .join('');

   statusEl.textContent =
      focusedIndex >= 0 && filtered[focusedIndex]
         ? `${filtered[focusedIndex]} 선택됨`
         : '대기 중';
}

// --------------------
// EVENT ARCHITECTURE
// --------------------
document.addEventListener('input', (e) => {
   if (e.target.dataset.action === 'search') {
      keyword = e.target.value;
      focusedIndex = -1;
      render();
   }
});

document.addEventListener('keydown', (e) => {
   const filtered = getFiltered();

   // 리스트 포커스 이동
   if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusedIndex = Math.min(focusedIndex + 1, filtered.length - 1);
      focusItem();
   }

   if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusedIndex = Math.max(focusedIndex - 1, 0);
      focusItem();
   }

   // 선택
   if (e.key === 'Enter' && focusedIndex >= 0) {
      statusEl.textContent = `${filtered[focusedIndex]} 확정`;
   }

   // 포커스 해제
   if (e.key === 'Escape') {
      focusedIndex = -1;
      statusEl.textContent = '포커스 해제';
      render();
   }
});

function focusItem() {
   render();
   const el = listEl.querySelector(`.item[data-index="${focusedIndex}"]`);
   if (el) el.focus();
}

// initial
render();
