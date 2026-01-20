// --------------------
// STATE
// --------------------
let formState = {
   name: '',
   active: false,
   category: 'all',
};

let searchKeyword = '';

// 고정 데이터 (원본 상태)
const items = [
   { id: 1, name: 'React', category: 'frontend', active: true },
   { id: 2, name: 'Vue', category: 'frontend', active: false },
   { id: 3, name: 'Node', category: 'backend', active: true },
   { id: 4, name: 'Figma', category: 'design', active: true },
];

// --------------------
// DERIVED STATE
// --------------------
function getFilteredItems() {
   return items.filter((item) => {
      const matchName =
         formState.name === '' ||
         item.name.toLowerCase().includes(formState.name.toLowerCase());

      const matchCategory =
         formState.category === 'all' || item.category === formState.category;

      const matchActive = !formState.active || item.active === true;

      const matchSearch =
         searchKeyword === '' ||
         item.name.toLowerCase().includes(searchKeyword.toLowerCase());

      return matchName && matchCategory && matchActive && matchSearch;
   });
}

// --------------------
// RENDER
// --------------------
const listEl = document.getElementById('list');

function render() {
   const filtered = getFilteredItems();

   listEl.innerHTML = filtered
      .map(
         (item) => `
      <li class="item ${item.active ? '' : 'inactive'}">
        ${item.name}
        <span class="badge">${item.category}</span>
        ${item.active ? '' : '<span class="badge">inactive</span>'}
      </li>
    `,
      )
      .join('');
}

// --------------------
// EVENT ARCHITECTURE
// --------------------
document.addEventListener('input', (e) => {
   // Form fields
   const field = e.target.dataset.field;
   if (field) {
      if (e.target.type === 'checkbox') {
         formState = { ...formState, [field]: e.target.checked };
      } else {
         formState = { ...formState, [field]: e.target.value };
      }
      render();
   }

   // Search
   if (e.target.dataset.action === 'search') {
      searchKeyword = e.target.value;
      render();
   }
});

// initial
render();
