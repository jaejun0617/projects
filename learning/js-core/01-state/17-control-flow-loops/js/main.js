const container = document.getElementById('cardContainer');
const countLabel = document.getElementById('countLabel');

const btnPlus = document.getElementById('btnPlus');
const btnMinus = document.getElementById('btnMinus');

// 화면을 결정하는 기준 값은 하나로 관리한다
// UI는 이 값만 보고 다시 그려진다
const state = {
   count: 0,
};

// 카드 하나의 모양 규칙
// 카드 UI가 바뀌면 이 함수만 수정하면 된다
function createCardHTML(index) {
   return `<div class="card">Card ${index}</div>`;
}

// 카드 개수만큼 같은 UI 규칙을 반복 적용한다
// 반복문의 역할은 "구조 생성"이다
function calculateCards(count) {
   let html = '';

   for (let i = 1; i <= count; i++) {
      html += createCardHTML(i);
   }

   return html;
}

// 현재 상태를 기준으로 화면을 다시 만든다
// 여기서는 UI 반영만 책임진다
function render() {
   countLabel.textContent = state.count;
   container.innerHTML = calculateCards(state.count);
}

// 버튼 클릭은 화면을 직접 건드리지 않는다
// 상태만 바꾸고 다시 렌더를 호출한다
btnPlus.addEventListener('click', () => {
   state.count += 1;
   render();
});

btnMinus.addEventListener('click', () => {
   // 음수 상태는 허용하지 않기 위한 안전장치
   if (state.count === 0) return;

   state.count -= 1;
   render();
});

// 최초 상태 기준으로 화면 한 번 생성
render();
