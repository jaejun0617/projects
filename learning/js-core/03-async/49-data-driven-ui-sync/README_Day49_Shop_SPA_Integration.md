# Day 49 — Phase 1 Capstone: Integration  
**Thu, Feb 12, 2026**

프레임워크 없이 **바닐라 JS만으로 동작하는 ‘컴포넌트 기반 쇼핑몰 SPA’** 최종 완성

---

## 🧠 오늘의 핵심 요약 (한 줄)
> **Vanilla SPA의 본질 = “상태(State) + 라우터(Router) + 컴포넌트(Component)”를 모듈로 분리하고, 상태 변경 → 라우터 렌더로 한 번에 통제한다.**

---

## 🎯 최종 목표
- **컴포넌트 기반 UI**로 상품/장바구니/상세 페이지를 조립한다
- **Hash Router**로 페이지 전환을 만든다 (`#products`, `#cart`, `#product/:id`)
- **전역 상태(Store)**로 `products`, `cartItems`를 관리한다
- 상태가 바뀌면 **자동으로 화면이 다시 그려지게** 만든다(Integration 포인트)

---

## 📌 실무 관점에서 “이 프로젝트가 의미 있는 이유”
React/Vue 같은 프레임워크를 쓰면 아래를 자동으로 해준다:
- 라우팅
- 상태 변경 감지
- 화면 재렌더
- 컴포넌트 조립 규칙

오늘은 그걸 **순수 JS로 직접** 만든다.  
즉, “프레임워크가 해주는 일을 내가 이해하고 구현해본 상태”가 된다.

---

# 🧩 핵심 이론 보강

## 1) Vanilla JS SPA의 3요소
### A. Router (URL → Page)
- URL 해시를 읽어 “지금 보여줄 페이지”를 결정
- `hashchange`, `load` 이벤트로 동작

### B. Store (State 단일 원천)
- 앱 데이터는 `state` 객체 하나로 관리
- `addToCart/removeFromCart` 같은 **단일 변경 함수**로만 state 변경
- 변경 후 `notify()`로 UI 갱신 트리거

### C. Components (UI 조립 블록)
- ProductCard / CartItem / Header처럼 UI를 부품화
- “재사용 가능한 작은 부품 + 조립하는 Page” 구조로 간다

---

## 2) 통합(Integration)의 핵심 규칙 4개
1. **단일 진실의 원천(SSOT)**: state는 한 곳(Store)에서만
2. **단방향 흐름**: 이벤트 → Store 액션 → notify → router(render)
3. **모듈 분리**: data / store / router / components / pages
4. **DOM 업데이트 전략**: “페이지 단위로 교체” (Phase 1 정석)

---

## 3) Hash Router를 쓰는 이유 (Phase 1에 최적)
- 서버 설정 없이 바로 동작 (GitHub Pages에도 쉬움)
- History API보다 구현 난이도 낮음
- 라우팅 원리 학습에 충분

---

# ✅ 최종 산출물 스펙(요구사항 정리)

## 페이지
- 상품 목록: `#products` (기본값)
- 상품 상세: `#product/:id`
- 장바구니: `#cart`

## 공통
- Header 고정 렌더
- 장바구니 개수 표시 (수량 합계 기준 권장)

## 상태
- `state.products`
- `state.cartItems` (상품 + quantity)
- 상태 변경 시 UI 자동 업데이트

---

# 🗂️ 추천 폴더 구조 (ESM 모듈)
아래 구조 그대로 가면 “실무형 폴더링” 감각이 잡힌다.

```
shop-spa/
├─ index.html
├─ style.css
└─ src/
   ├─ main.js
   ├─ router.js
   ├─ data/
   │  └─ products.js
   ├─ store/
   │  └─ store.js
   ├─ components/
   │  ├─ Header.js
   │  ├─ ProductCard.js
   │  └─ CartItem.js
   ├─ pages/
   │  ├─ ProductListPage.js
   │  ├─ ProductDetailPage.js
   │  └─ CartPage.js
   └─ utils/
      ├─ dom.js
      └─ money.js
```

---

# 🧱 구현 코드 (정석 레퍼런스)

> 아래 코드는 “그대로 복붙해서 돌아가게” 구성했다.  
> (단, 이미지는 placeholder 사용)

---

## 1) `index.html`
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vanilla Shop SPA</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <header id="header"></header>
  <main id="app"></main>

  <script type="module" src="./src/main.js"></script>
</body>
</html>
```

---

## 2) `style.css` (최소 스타일)
```css
* { box-sizing: border-box; }
body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; }
header { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #eee; }
.container { max-width: 1000px; margin: 0 auto; padding: 16px; }
.nav { display: flex; gap: 12px; align-items: center; justify-content: space-between; }
.nav a { text-decoration: none; color: #111; }
.badge { display: inline-block; padding: 2px 8px; border: 1px solid #ddd; border-radius: 999px; font-size: 12px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.card { border: 1px solid #eee; border-radius: 12px; padding: 12px; background: #fff; }
.card img { width: 100%; border-radius: 10px; }
.btn { padding: 10px 12px; border-radius: 10px; border: 1px solid #ddd; cursor: pointer; background: #fff; }
.row { display: flex; gap: 12px; align-items: center; justify-content: space-between; }
.muted { color: #555; }
```

---

## 3) `src/data/products.js`
```js
export const products = [
  {
    id: "p1",
    name: "멋진 티셔츠",
    price: 25000,
    imageUrl: "https://via.placeholder.com/400x260?text=T-Shirt",
    description: "가볍고 편한 데일리 티셔츠.",
  },
  {
    id: "p2",
    name: "편안한 바지",
    price: 35000,
    imageUrl: "https://via.placeholder.com/400x260?text=Pants",
    description: "하루 종일 입어도 편안한 팬츠.",
  },
  {
    id: "p3",
    name: "스타일리쉬한 모자",
    price: 18000,
    imageUrl: "https://via.placeholder.com/400x260?text=Cap",
    description: "패션의 완성. 어떤 룩에도 잘 어울림.",
  },
];
```

---

## 4) `src/utils/money.js`
```js
export function formatWon(value) {
  return `${value.toLocaleString()}원`;
}
```

## 5) `src/utils/dom.js`
```js
export function clearEl($el) {
  $el.innerHTML = "";
}
```

---

## 6) `src/store/store.js` (State + Actions + Subscribe)
```js
import { products as initialProducts } from "../data/products.js";

export const state = {
  products: initialProducts,
  cartItems: [], // { id, name, price, imageUrl, quantity }
};

const subscribers = [];

export function subscribe(fn) {
  subscribers.push(fn);
  return () => {
    const idx = subscribers.indexOf(fn);
    if (idx >= 0) subscribers.splice(idx, 1);
  };
}

function notify() {
  subscribers.forEach((fn) => fn(state));
}

// --- selectors (옵션)
export function getCartCount() {
  return state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal() {
  return state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// --- actions
export function addToCart(productId) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;

  const existing = state.cartItems.find((i) => i.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cartItems.push({ ...product, quantity: 1 });
  }
  notify();
}

export function removeFromCart(productId) {
  state.cartItems = state.cartItems.filter((i) => i.id !== productId);
  notify();
}

export function decreaseQty(productId) {
  const item = state.cartItems.find((i) => i.id === productId);
  if (!item) return;
  item.quantity -= 1;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  notify();
}
```

---

## 7) `src/components/Header.js`
```js
import { getCartCount } from "../store/store.js";

export function Header() {
  const $wrap = document.createElement("div");
  $wrap.className = "container nav";

  $wrap.innerHTML = `
    <div class="row" style="gap:12px;">
      <a href="#products"><strong>Vanilla Shop</strong></a>
      <a href="#products">홈</a>
      <a href="#cart">장바구니 <span id="cart-count" class="badge">0</span></a>
    </div>
    <div class="muted">Phase 1 Capstone</div>
  `;

  // count는 router 렌더 때도 갱신하지만, 초기 화면을 위해 한 번 세팅
  $wrap.querySelector("#cart-count").textContent = getCartCount();

  return $wrap;
}
```

---

## 8) `src/components/ProductCard.js`
```js
import { addToCart } from "../store/store.js";
import { formatWon } from "../utils/money.js";

export function ProductCard(product) {
  const $card = document.createElement("div");
  $card.className = "card";

  $card.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}" />
    <h3 style="margin:10px 0 6px;">${product.name}</h3>
    <p class="muted" style="margin:0 0 10px;">${formatWon(product.price)}</p>
    <div class="row">
      <button class="btn" data-action="detail">상세보기</button>
      <button class="btn" data-action="add">담기</button>
    </div>
  `;

  // 이벤트 (카드 단위 핸들링)
  $card.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    if (action === "detail") {
      window.location.hash = `#product/${product.id}`;
    }
    if (action === "add") {
      addToCart(product.id);
    }
  });

  return $card;
}
```

---

## 9) `src/components/CartItem.js`
```js
import { addToCart, decreaseQty, removeFromCart } from "../store/store.js";
import { formatWon } from "../utils/money.js";

export function CartItem(item) {
  const $row = document.createElement("div");
  $row.className = "card";

  $row.innerHTML = `
    <div class="row" style="align-items:flex-start;">
      <div style="flex:1;">
        <strong>${item.name}</strong>
        <div class="muted" style="margin-top:6px;">
          ${formatWon(item.price)} × ${item.quantity} = <strong>${formatWon(item.price * item.quantity)}</strong>
        </div>

        <div class="row" style="justify-content:flex-start; gap:8px; margin-top:10px;">
          <button class="btn" data-action="minus">-</button>
          <button class="btn" data-action="plus">+</button>
          <button class="btn" data-action="remove">삭제</button>
        </div>
      </div>
      <img src="${item.imageUrl}" alt="${item.name}" style="width:120px; border-radius:10px;" />
    </div>
  `;

  $row.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    if (action === "minus") decreaseQty(item.id);
    if (action === "plus") addToCart(item.id);
    if (action === "remove") removeFromCart(item.id);
  });

  return $row;
}
```

---

## 10) `src/pages/ProductListPage.js`
```js
import { state } from "../store/store.js";
import { ProductCard } from "../components/ProductCard.js";

export function ProductListPage() {
  const $page = document.createElement("div");
  $page.className = "container";

  $page.innerHTML = `
    <h2 style="margin:0 0 12px;">상품 목록</h2>
    <div class="grid" id="product-grid"></div>
  `;

  const $grid = $page.querySelector("#product-grid");
  state.products.forEach((p) => $grid.appendChild(ProductCard(p)));

  return $page;
}
```

---

## 11) `src/pages/ProductDetailPage.js`
```js
import { state, addToCart } from "../store/store.js";
import { formatWon } from "../utils/money.js";

export function ProductDetailPage(productId) {
  const product = state.products.find((p) => p.id === productId);

  const $page = document.createElement("div");
  $page.className = "container";

  if (!product) {
    $page.innerHTML = `<h2>상품을 찾을 수 없습니다.</h2>`;
    return $page;
  }

  $page.innerHTML = `
    <button class="btn" id="back">← 목록</button>
    <div class="card" style="margin-top:12px;">
      <img src="${product.imageUrl}" alt="${product.name}" />
      <h2 style="margin:10px 0 6px;">${product.name}</h2>
      <p class="muted" style="margin:0 0 10px;">${formatWon(product.price)}</p>
      <p style="margin:0 0 12px;">${product.description}</p>
      <button class="btn" id="add">장바구니에 담기</button>
    </div>
  `;

  $page.querySelector("#back").addEventListener("click", () => {
    window.location.hash = "#products";
  });

  $page.querySelector("#add").addEventListener("click", () => {
    addToCart(product.id);
  });

  return $page;
}
```

---

## 12) `src/pages/CartPage.js`
```js
import { state, getCartTotal } from "../store/store.js";
import { CartItem } from "../components/CartItem.js";
import { formatWon } from "../utils/money.js";

export function CartPage() {
  const $page = document.createElement("div");
  $page.className = "container";

  $page.innerHTML = `
    <h2 style="margin:0 0 12px;">장바구니</h2>
    <div id="cart-list" style="display:grid; gap:12px;"></div>
    <div class="card" style="margin-top:12px;">
      <div class="row">
        <strong>총액</strong>
        <strong>${formatWon(getCartTotal())}</strong>
      </div>
      <button class="btn" style="margin-top:10px; width:100%;">결제하기</button>
    </div>
  `;

  const $list = $page.querySelector("#cart-list");

  if (state.cartItems.length === 0) {
    $list.innerHTML = `<p class="muted">장바구니가 비어 있습니다.</p>`;
    return $page;
  }

  state.cartItems.forEach((item) => $list.appendChild(CartItem(item)));
  return $page;
}
```

---

## 13) `src/router.js` (Hash Router)
```js
import { state, getCartCount } from "./store/store.js";
import { ProductListPage } from "./pages/ProductListPage.js";
import { ProductDetailPage } from "./pages/ProductDetailPage.js";
import { CartPage } from "./pages/CartPage.js";
import { clearEl } from "./utils/dom.js";

export function router() {
  const hash = window.location.hash || "#products";
  const $app = document.getElementById("app");
  clearEl($app);

  // Header cart-count 갱신 (Header 자체는 고정이지만 count는 변함)
  const $count = document.getElementById("cart-count");
  if ($count) $count.textContent = getCartCount();

  if (hash === "#products") {
    document.title = "상품 목록 | Vanilla Shop";
    $app.appendChild(ProductListPage());
    return;
  }

  if (hash === "#cart") {
    document.title = "장바구니 | Vanilla Shop";
    $app.appendChild(CartPage());
    return;
  }

  if (hash.startsWith("#product/")) {
    const productId = hash.split("/")[1];
    document.title = "상품 상세 | Vanilla Shop";
    $app.appendChild(ProductDetailPage(productId));
    return;
  }

  document.title = "404 | Vanilla Shop";
  $app.innerHTML = `<div class="container"><h2>404 Not Found</h2><p class="muted">존재하지 않는 페이지입니다.</p></div>`;
}
```

---

## 14) `src/main.js` (조립 + 초기화)
```js
import { router } from "./router.js";
import { Header } from "./components/Header.js";
import { subscribe } from "./store/store.js";

// 1) Header 고정 렌더
const $header = document.getElementById("header");
$header.innerHTML = "";
$header.appendChild(Header());

// 2) Store 구독: 상태가 바뀌면 라우터 렌더 (Integration 포인트)
subscribe(() => {
  router();
});

// 3) 라우팅 이벤트
window.addEventListener("load", () => {
  if (!window.location.hash) window.location.hash = "#products";
  router();
});

window.addEventListener("hashchange", () => {
  router();
});
```

---

# ✅ 동작 시나리오 체크리스트 (최종 검증)
- [x] `#products`에서 상품 카드 렌더
- [x] “상세보기” 클릭 → `#product/p1` 이동(새로고침 없음)
- [x] “담기” 클릭 → 장바구니 수량 badge 업데이트
- [x] `#cart`에서 장바구니 목록 + 총액 렌더
- [x] 장바구니 `+/-/삭제` 동작 → 자동 재렌더 + 총액 갱신
- [x] 해시로 라우팅 전환 (load + hashchange)

---

# 🔥 오늘 반드시 가져가야 할 것 (실무 기준)
- “상태가 바뀌면 UI가 자동으로 바뀐다”를 **내 손으로 구현**했다
- 프레임워크가 해주는 일을 이해하면, React 학습 속도가 급상승한다
- 모듈 분리/역할 분리는 “프로젝트가 커질수록” 차이를 만든다

---

# 🚀 다음 단계 추천 (Phase 2로 가기 전에)
- Day 46 Store를 더 강하게: `setState(partial)` 형태로 개선
- DOM 업데이트 최적화: “페이지 전체 교체” → “부분 렌더”로 발전
- 라우팅: hash → History API(`pushState`)로 업그레이드
- 데이터: 더미 → fetch로 API 흉내내기 (mock json)

---

## 📚 참고 키워드
- Vanilla JS SPA
- Hash Router / hashchange
- State Management / Observer(Pub-Sub)
- Component-based Architecture
- ES Modules (type="module", import/export)
