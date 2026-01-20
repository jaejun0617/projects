# Day 26 — Deep Dive: Array Methods (forEach / map / filter / reduce)
**Tue, Jan 20, 2026**

> **미션:** `for / while` 없이 고차 함수만으로 쇼핑몰(장바구니) 데이터를 **분석 · 가공 · 집계**한다.  
> **핵심:** 불변성(원본 보존) + 데이터 파이프라인 사고(필터 → 변환 → 집계)

---

## 🗓 일정
- Tue, Jan 20, 2026

---

## 🎯 미션 목표
- `for` 없이 **forEach / map / filter / reduce**로만 배열 데이터를 처리한다.
- **원본 배열은 보존(불변성)**하고, 결과는 **새 배열 또는 단일 값**으로 만든다.
- 실무에서 흔한 **장바구니/주문 데이터 처리 흐름**(필터링 → 가공 → 집계)을 익힌다.

---

## 🧠 핵심 개념 & 핵심 이론 (완전 보강)

### 0) 고차 함수(Higher-Order Function) 관점
배열 메서드(`map`, `filter`, `reduce`, `forEach`)는 **“함수(콜백)를 인자로 받는 함수”**다.

- **데이터(배열)** + **규칙(콜백)** → 결과
- 반복문의 “어떻게(How)” 대신 “무엇을(What)”에 집중한다.

---

### 1) 공통 콜백 시그니처 (헷갈리면 이걸로 통일)
대부분 이렇게 생겼다:

```js
(arrayMethod)((currentValue, index, array) => {
  // ...
});
```

- `currentValue`: 현재 요소
- `index`: 현재 인덱스
- `array`: 원본 배열(참고용)

📌 **주의:** `array`를 직접 수정하면 “불변성”이 깨지고 디버깅 지옥이 열린다.

---

### 2) forEach — “각 요소에 대해 실행(반환 없음)”
- **반환값:** 항상 `undefined`
- **의미:** 결과를 “만드는” 용도라기보다 **행동(side-effect)**을 하는 용도
- **실무 사용:** 로깅, DOM 업데이트, 이벤트 바인딩, 네트워크 요청 트리거 등

```js
cart.forEach((item, idx) => {
  console.log(idx, item.name);
});
```

✅ 판단 기준  
- “출력/실행”이 목적이면 `forEach`  
- “결과 배열/값”이 목적이면 `map/filter/reduce`

---

### 3) map — “같은 길이의 새 배열 만들기”
- **반환값:** 변환된 결과로 만든 **새 배열**
- **원본 보존:** ✅ (원본 배열 자체는 안 바뀜)
- **실무 사용:** 데이터 형태 변환(서버 응답 → UI 렌더용 DTO)

```js
const names = cart.map((item) => item.name);
```

📌 map은 **길이가 항상 동일**하다.  
- “선택(제거)”이 필요하면 map이 아니라 filter.

---

### 4) filter — “조건에 맞는 요소만 새 배열”
- **반환값:** 조건이 `true`인 것만 모은 **새 배열**
- **원본 보존:** ✅
- **실무 사용:** 검색, 카테고리 선택, 가격 범위, 상태(품절/재고) 필터링

```js
const electronics = cart.filter((item) => item.category === "전자기기");
```

📌 filter는 “부분집합”을 만든다.  
- 개수는 줄어들 수도, 그대로일 수도 있다.

---

### 5) reduce — “여러 개를 하나로 응축(집계/변환/그룹핑)”
- **반환값:** 누적 결과(숫자/문자열/객체/배열 전부 가능)
- **핵심 3요소**
  - `acc`(누적값)
  - `cur`(현재값)
  - `initialValue`(초기값)

```js
const total = numbers.reduce((acc, n) => acc + n, 0);
```

#### ✅ reduce 실무 포인트 (중요)
- **초기값은 거의 항상 넣는다.**
  - 빈 배열에서도 안전
  - 결과 타입이 명확(숫자면 0, 객체면 {}, 배열이면 [])
- reduce는 “만능”이지만, 무조건 reduce로만 쓰면 가독성이 떨어질 수 있다.  
  - 변환은 map, 선택은 filter, 집계는 reduce로 “역할 분리”가 기본.

---

## 🧨 실무에서 자주 터지는 함정 TOP 5

### 1) map에서 조건 분기로 요소를 걸러내려 함
```js
// ❌ map은 제거가 아니라 변환이다 (undefined가 남을 수 있음)
const wrong = cart.map(item => item.price >= 100000 ? item : undefined);
```
✅ 정답: `filter` 후 `map`

---

### 2) reduce 초기값 생략
```js
// ⚠️ 빈 배열이면 TypeError, 타입 예측 어려움
const sum = cart.reduce((acc, item) => acc + item.price * item.quantity);
```
✅ 정답:
```js
const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
```

---

### 3) 원본을 건드리는 코드(불변성 파괴)
```js
// ❌ 원본 item을 직접 변경
cart.map(item => {
  item.quantity += 1;
  return item;
});
```
✅ 정답(새 객체 생성):
```js
const next = cart.map(item => ({ ...item, quantity: item.quantity + 1 }));
```

---

### 4) forEach에서 결과를 반환하려고 함
```js
// ❌ forEach는 반환값을 모으지 않음
const result = cart.forEach(item => item.name);
```
✅ 정답: map 사용

---

### 5) `sort()`는 원본을 바꾼다
Day26 메서드는 아니지만 실무에서 같이 쓰며 터진다.
```js
// ⚠️ sort는 원본 배열을 변경한다
cart.sort((a, b) => a.price - b.price);
```
✅ 정답:
```js
const sorted = [...cart].sort((a, b) => a.price - b.price);
```

---

## 📦 실습 데이터(장바구니)

```js
const cart = [
  { id: "a101", name: "스마트폰", category: "전자기기", price: 1000000, quantity: 1 },
  { id: "b202", name: "블루투스 이어폰", category: "전자기기", price: 150000, quantity: 2 },
  { id: "c303", name: "기계식 키보드", category: "컴퓨터 주변기기", price: 120000, quantity: 1 },
  { id: "d404", name: "게이밍 마우스", category: "컴퓨터 주변기기", price: 70000, quantity: 3 },
  { id: "e505", name: "웹캠", category: "전자기기", price: 80000, quantity: 1 },
];
```

---

## 🏗️ 미션 요구사항

1. **총 결제 금액 계산 (reduce)**  
   - `price * quantity` 총합

2. **고가 상품 목록 필터링 (filter)**  
   - `price >= 100000`

3. **상품 정보 요약 (map)**  
   - `'상품명: [상품명] (수량: [수량]개)'` 문자열 배열

4. **전자기기만 추출 후 총 수량 계산 (filter + reduce)**  
   - `category === '전자기기'` 필터 → `quantity` 합산

---

## 💻 구현 코드 (index.html + console)

> 아래 코드는 **요구사항 1~4 + 원본 보존 검증**까지 포함한 “제출용 완성본”.

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Day 26 - Array Methods</title>
  </head>
  <body>
    <h1>Day 26 — Array Methods</h1>
    <p>콘솔(F12)에서 확인하세요.</p>

    <script>
      console.log("===== Day 26: Array Methods =====");

      const cart = [
        { id: "a101", name: "스마트폰", category: "전자기기", price: 1000000, quantity: 1 },
        { id: "b202", name: "블루투스 이어폰", category: "전자기기", price: 150000, quantity: 2 },
        { id: "c303", name: "기계식 키보드", category: "컴퓨터 주변기기", price: 120000, quantity: 1 },
        { id: "d404", name: "게이밍 마우스", category: "컴퓨터 주변기기", price: 70000, quantity: 3 },
        { id: "e505", name: "웹캠", category: "전자기기", price: 80000, quantity: 1 },
      ];

      // ✅ 원본 보존 검증용(참고): 변경을 막는 건 아니지만, 비교에는 유용
      const cartSnapshot = JSON.stringify(cart);

      // 1) 총 결제 금액 (reduce)
      const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      console.log("1) 총 결제 금액:", totalPrice);

      // 2) 고가 상품 목록 (filter)
      const expensiveItems = cart.filter((item) => item.price >= 100000);
      console.log("2) 고가 상품 목록(10만원 이상):", expensiveItems);

      // 3) 상품 요약 문자열 (map)
      const summaries = cart.map((item) => `상품명: ${item.name} (수량: ${item.quantity}개)`);
      console.log("3) 상품 요약:", summaries);

      // 4) 전자기기 총 수량 (filter + reduce)
      const electronicsQty = cart
        .filter((item) => item.category === "전자기기")
        .reduce((acc, item) => acc + item.quantity, 0);
      console.log("4) 전자기기 총 수량:", electronicsQty);

      // ✅ 원본 변경 여부 체크
      console.log("원본 cart 변경 없음:", cartSnapshot === JSON.stringify(cart));
    </script>
  </body>
</html>
```

---

## 🔥 핵심(실무 기준) — “데이터 파이프라인” 사고
실무에서는 이렇게 읽히는 코드가 가장 안정적이다:

- **선택(filter)** → **변환(map)** → **집계(reduce)**

```js
const electronicsNames = cart
  .filter((item) => item.category === "전자기기")
  .map((item) => item.name);

const electronicsTotal = cart
  .filter((item) => item.category === "전자기기")
  .reduce((acc, item) => acc + item.price * item.quantity, 0);
```

---

## ✅ 체크리스트
- [ ] `for / while` 사용 안 함
- [ ] 원본 `cart` 변경 없음
- [ ] reduce에 초기값 넣음(숫자면 `0`, 객체면 `{}`)
- [ ] 출력이 요구사항과 일치
- [ ] 필터 → 집계 흐름이 자연스럽게 읽힘

---

## 🎯 얻어가는 점
- 반복문 기반 사고에서 벗어나 **변환/선택/집계**로 사고하는 방식 확립
- 실무 데이터 처리의 기본 루틴:
  - **필터링 → 가공 → 집계**
- 다음 단계에서 **서버 응답(JSON)** 처리도 똑같이 적용 가능

---

## 💻 사용 기술
- JavaScript: `forEach`, `map`, `filter`, `reduce`, 템플릿 리터럴
- 실행: `index.html` + `<script>` + `console.log()`

---

## 🧪 보너스(선택 과제) — 실무 감각 올리는 문제

### 1) 카테고리별 총액 객체 만들기 (reduce → group by)
- 결과 예:
  - `{ "전자기기": 1380000, "컴퓨터 주변기기": 330000 }`

```js
const totalByCategory = cart.reduce((acc, item) => {
  const key = item.category;
  const sum = item.price * item.quantity;

  acc[key] = (acc[key] ?? 0) + sum;
  return acc;
}, {});

console.log("카테고리별 총액:", totalByCategory);
```

---

### 2) 장바구니 총 수량(모든 quantity 합)
```js
const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
console.log("총 수량:", totalQty);
```

---

### 3) “최고가 상품” 하나 찾기 (reduce)
```js
const mostExpensive = cart.reduce((best, item) => {
  if (!best) return item;
  return item.price > best.price ? item : best;
}, null);

console.log("최고가 상품:", mostExpensive);
```

---

## 📚 참고 자료 (MDN)
- Array.prototype.forEach()
- Array.prototype.map()
- Array.prototype.filter()
- Array.prototype.reduce()
- Spread syntax (`...`)
