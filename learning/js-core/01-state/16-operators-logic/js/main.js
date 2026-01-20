const cardEl = document.querySelector('#card');
const errorEl = document.querySelector('#error');
// WHY: 카드 UI와 에러 UI는 서로 다른 "UI 상태"이므로 DOM도 분리한다
// WHY: 정상 상태(card) / 에러 상태(error)를 동시에 보여주지 않기 위함

// ====== 상태 ======
let state = {
   age: 5,
};
// WHY: 화면에 영향을 주는 값은 state로 묶어 관리한다
// WHY: 이벤트 → state 변경 → render 흐름을 유지하기 위함

// ====== 요금 계산 (표현식 기반) ======
function calculateFare(age) {
   // WHY: 조건식을 바로 쓰지 않고 의미 있는 이름으로 분리해 가독성을 높인다
   // WHY: 조건이 늘어나도 로직을 읽기 쉬운 구조로 유지하기 위함
   const isInvalid = typeof age !== 'number' || age < 0;
   // WHY: 데이터가 잘못된 경우를 가장 먼저 걸러내기 위함

   const isFree = age <= 7;
   // WHY: 무료 요금 기준을 하나의 규칙으로 명확히 분리

   const isTeen = age >= 8 && age <= 19;
   // WHY: 논리 AND를 사용해 범위 조건을 표현식으로 묶는다

   // WHY: 삼항 연산자는 "흐름 제어"가 아니라 "값 선택"에만 사용한다
   // WHY: 이 함수는 항상 하나의 결과 값(fare)을 반환해야 한다
   const fare = isInvalid ? null : isFree ? 0 : isTeen ? 1000 : 2000;

   return fare;
   // WHY: 계산 결과만 반환하고 UI(DOM)는 절대 건드리지 않는다
}

// ====== UI 생성 ======
function renderCard(age, fare) {
   // WHY: 이 함수는 UI 모양만 책임지고, 계산/검증 로직은 포함하지 않는다
   // WHY: "데이터 → UI 표현" 역할만 담당하도록 분리

   const badgeClass = fare === 0 ? 'free' : 'paid';
   // WHY: 요금 값에 따라 시각적 상태(class)를 결정한다
   // WHY: 숫자 데이터를 UI 상태로 변환하는 지점

   const badgeText = fare === 0 ? '무료 요금' : '유료 요금';
   // WHY: 내부 데이터(fare)를 사용자에게 보여줄 텍스트로 변환

   return `
    <section class="card">
      <h2>나이: ${age}세</h2>
      <p>요금: ${fare}원</p>
      <span class="badge ${badgeClass}">${badgeText}</span>
    </section>
  `;
   // WHY: 템플릿 리터럴은 문자열 결합이 아니라 UI 구조를 만드는 도구다
}

// ====== 렌더 ======
function render() {
   const fare = calculateFare(state.age);
   // WHY: render는 항상 "현재 state"를 기준으로 UI를 다시 계산한다
   // WHY: UI는 직접 수정하지 않고, 계산 결과에 따라 다시 그린다

   // 잘못된 값 처리
   if (fare === null) {
      cardEl.innerHTML = '';
      // WHY: 잘못된 데이터로 카드 UI를 그리지 않기 위함

      errorEl.textContent = '잘못된 나이 값입니다.';
      // WHY: 에러도 하나의 UI 상태이므로 화면에 명확히 표시한다

      return;
      // WHY: 에러 상태에서는 이후 정상 렌더링을 차단한다
   }

   // 정상 렌더링
   errorEl.textContent = '';
   // WHY: 이전 에러 상태를 초기화한다

   cardEl.innerHTML = renderCard(state.age, fare);
   // WHY: DOM 수정은 render 함수 한 곳에서만 수행한다

   console.log({ age: state.age, fare });
   // WHY: 학습 단계에서 state와 계산 결과의 연결을 콘솔로 확인하기 위함
}

// ====== 이벤트 ======
document.querySelectorAll('button').forEach((btn) => {
   btn.addEventListener('click', () => {
      state = { ...state, age: Number(btn.dataset.age) };
      // WHY: 이벤트는 DOM을 직접 수정하지 않고 state만 변경한다
      // WHY: 새 객체로 교체해 상태 변경을 명확히 한다

      render();
      // WHY: state 변경 후 UI를 다시 계산한다
   });
});

// ====== 초기 렌더 ======
render();
// WHY: 페이지 진입 시 최초 UI를 한 번 그려 사용자에게 기본 상태를 보여주기 위함
