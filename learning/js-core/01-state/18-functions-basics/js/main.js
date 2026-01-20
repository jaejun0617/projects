const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const operatorSelect = document.getElementById('operator');
const resultEl = document.getElementById('result');
const btnCalc = document.getElementById('btnCalc');

// 화면을 결정하는 단일 상태
const state = {
   num1: 0,
   num2: 0,
   operator: 'add',
};

// 계산만 담당하는 함수들
function add(a, b) {
   return a + b;
}

const subtract = function (a, b) {
   return a - b;
};

const multiply = (a, b) => a * b;

const divide = (a, b) => {
   if (b === 0) return '0으로 나눌 수 없습니다!';
   return a / b;
};

// 연산 선택용 매핑
const OPERATIONS = {
   add,
   subtract,
   multiply,
   divide,
};

// 선택만 담당하는 계산기
function calculator(a, b, operator) {
   const operation = OPERATIONS[operator];
   if (!operation) return '유효하지 않은 연산자입니다.';
   return operation(a, b);
}

// 상태 → UI 반영
function render() {
   const result = calculator(state.num1, state.num2, state.operator);
   resultEl.textContent = result;
}

// 인터랙션 = 상태 변경
btnCalc.addEventListener('click', () => {
   state.num1 = Number(num1Input.value);
   state.num2 = Number(num2Input.value);
   state.operator = operatorSelect.value;

   render();
});

// 초기 렌더
render();
