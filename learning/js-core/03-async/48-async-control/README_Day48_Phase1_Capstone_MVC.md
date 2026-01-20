# Day 48 — Phase 1 Capstone: Logic  
**Wed, Feb 11, 2026**

쇼핑몰 프로젝트를 위한 **데이터 모델(Model)**과 **뷰(View)** 분리 아키텍처 설계 (MVC 기본)

---

## 🧠 오늘의 핵심 요약 (한 줄)
> **아키텍처의 시작 = “데이터(원인)와 화면(결과)을 분리하고, 연결은 한 통로로만 관리한다.”**

---

## 🎯 미션 목표
- 쇼핑몰의 **상품 데이터(Model)**를 순수 데이터로 분리한다
- 화면 렌더링 로직을 **View 함수**로 분리한다
- (MVC 관점) Model ↔ View 사이 연결을 **Controller(또는 App)**에서 수행한다
- “데이터가 바뀌면 화면을 다시 그린다”는 기본 흐름을 설계한다

---

## 📌 왜 이걸 배우는가 (실무 관점)
초기에는 다 한 파일에 때려 넣어도 된다.  
하지만 조금만 커지면 아래가 즉시 터진다:

- 데이터 수정 로직이 여기저기 흩어짐
- UI 변경하려면 데이터 코드까지 같이 건드림
- 버그가 나도 어디가 원인인지 추적 불가
- 협업 시 충돌 폭발

그래서 실무는 항상 “역할 분리”로 간다:

- Model: 데이터를 책임
- View: 화면을 책임
- Controller/App: 둘을 연결하고 흐름을 제어

React를 쓰더라도 본질은 동일하다.  
(컴포넌트 내부에서도 “상태/렌더/이벤트”를 분리해야 유지보수가 된다)

---

## 🧩 핵심 이론 정리

### 1️⃣ MVC 패턴 (가장 단순한 정의)
- **Model**: 데이터, 비즈니스 규칙(가격 계산, 재고 감소 등)
- **View**: 화면 출력(HTML 생성, DOM 업데이트)
- **Controller**: 입력 처리(클릭/필터/정렬) → Model 변경 → View 업데이트

> 오늘 미션은 “Model-View 분리”가 핵심이므로, Controller는 **App** 함수/객체로 간단히 표현해도 된다.

---

### 2️⃣ Model과 View를 분리하는 기준
#### ✅ Model에 들어가면 좋은 것
- 상품 배열(데이터)
- 상품 추가/삭제/수정 함수
- 필터/정렬 결과를 만드는 함수
- 총액 계산, 재고 감소 같은 “규칙”

#### ✅ View에 들어가면 좋은 것
- DOM 요소 캐싱
- 템플릿 만들기(HTML 문자열/요소 생성)
- 렌더 함수 (`renderProducts(list)`)
- 이벤트 리스너 연결(단, 처리 흐름은 Controller/App로 넘기는 게 좋음)

---

### 3️⃣ Architecture(아키텍처)의 핵심 규칙 3개
1) **단일 진실의 원천(Single Source of Truth)**  
   - 상품 데이터는 한 곳(Model)에서만 관리

2) **단방향 흐름(One-way Flow)**  
   - 사용자 입력 → Controller/App → Model 업데이트 → View 렌더

3) **의존성 방향**  
   - View는 Model을 직접 수정하지 않는다  
   - Model은 DOM을 모르고, View는 데이터 규칙을 최소화한다

---

## 🏗️ 미션 구현 (단일 HTML + script)

이번 구현은 “한 파일 안에서”라도 **폴더 분리한 것처럼 역할 분리**한다.

- `ProductModel` (데이터/규칙)
- `ProductView` (렌더)
- `AppController` (연결/흐름)

---

## ✅ index.html (한 파일로 완성)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shop - Phase 1 Capstone</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
    .layout { display: grid; gap: 12px; max-width: 900px; }
    .toolbar { display: flex; gap: 8px; flex-wrap: wrap; }
    button { padding: 10px 12px; border-radius: 10px; border: 1px solid #ccc; cursor: pointer; }
    input { padding: 10px 12px; border-radius: 10px; border: 1px solid #ccc; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
    .card { border: 1px solid #ddd; border-radius: 12px; padding: 14px; }
    .name { font-weight: 800; margin: 0 0 6px; }
    .meta { margin: 4px 0; color: #333; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 999px; border: 1px solid #ddd; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Shopping Mall Architecture (Model / View 분리)</h1>

  <div class="layout">
    <div class="toolbar">
      <input id="search-input" placeholder="상품명 검색..." />
      <button id="sort-price-asc">가격 ↑</button>
      <button id="sort-price-desc">가격 ↓</button>
      <button id="filter-instock">재고 있는 것만</button>
      <button id="reset">초기화</button>
    </div>

    <div id="app-root"></div>
  </div>

  <script>
    // ==================================================
    // 1) MODEL: 데이터 + 규칙 (DOM 모름)
    // ==================================================
    const ProductModel = (() => {
      const state = {
        products: [
          { id: 1, name: "프리미엄 면 티셔츠", price: 25000, stock: 10 },
          { id: 2, name: "클래식 데님 청바지", price: 49000, stock: 5 },
          { id: 3, name: "고급 가죽 지갑", price: 75000, stock: 0 },
          { id: 4, name: "캐주얼 스니커즈", price: 62000, stock: 8 },
        ],
      };

      // 원본 보존용 (reset)
      const initial = JSON.parse(JSON.stringify(state.products));

      function getProducts() {
        // 외부에서 실수로 state를 바꾸지 못하도록 복사본 반환 (얕은 복사)
        return state.products.map((p) => ({ ...p }));
      }

      function setProducts(nextList) {
        state.products = nextList.map((p) => ({ ...p }));
      }

      function reset() {
        state.products = initial.map((p) => ({ ...p }));
      }

      function filterByName(keyword) {
        const k = keyword.trim().toLowerCase();
        if (!k) return getProducts();
        return getProducts().filter((p) => p.name.toLowerCase().includes(k));
      }

      function filterInStock(list) {
        return list.filter((p) => p.stock > 0);
      }

      function sortByPriceAsc(list) {
        return [...list].sort((a, b) => a.price - b.price);
      }

      function sortByPriceDesc(list) {
        return [...list].sort((a, b) => b.price - a.price);
      }

      return {
        getProducts,
        setProducts,
        reset,
        filterByName,
        filterInStock,
        sortByPriceAsc,
        sortByPriceDesc,
      };
    })();

    // ==================================================
    // 2) VIEW: 화면 렌더링 (비즈니스 규칙 최소)
    // ==================================================
    const ProductView = (() => {
      const $root = document.getElementById("app-root");

      function productCard(p) {
        const stockLabel = p.stock > 0 ? `재고: ${p.stock}개` : "품절";
        const badge = p.stock > 0 ? `<span class="badge">In Stock</span>` : `<span class="badge">Sold Out</span>`;

        return `
          <div class="card" data-id="${p.id}">
            <p class="name">${p.name}</p>
            <p class="meta">가격: ${p.price.toLocaleString()}원</p>
            <p class="meta">${stockLabel}</p>
            ${badge}
          </div>
        `;
      }

      function renderProducts(list) {
        if (!list.length) {
          $root.innerHTML = "<p>표시할 상품이 없습니다.</p>";
          return;
        }

        $root.innerHTML = `
          <div class="grid">
            ${list.map(productCard).join("")}
          </div>
        `;
      }

      return { renderProducts };
    })();

    // ==================================================
    // 3) CONTROLLER / APP: 흐름 제어 (Model <-> View 연결)
    // ==================================================
    const AppController = (() => {
      const $searchInput = document.getElementById("search-input");
      const $sortAsc = document.getElementById("sort-price-asc");
      const $sortDesc = document.getElementById("sort-price-desc");
      const $filterInStock = document.getElementById("filter-instock");
      const $reset = document.getElementById("reset");

      // 화면에 반영될 “현재 리스트 상태” (UI 상태)
      let currentList = ProductModel.getProducts();

      function commitRender() {
        ProductView.renderProducts(currentList);
      }

      function init() {
        // 초기 렌더
        commitRender();

        // 검색
        $searchInput.addEventListener("input", () => {
          currentList = ProductModel.filterByName($searchInput.value);
          commitRender();
        });

        // 정렬
        $sortAsc.addEventListener("click", () => {
          currentList = ProductModel.sortByPriceAsc(currentList);
          commitRender();
        });

        $sortDesc.addEventListener("click", () => {
          currentList = ProductModel.sortByPriceDesc(currentList);
          commitRender();
        });

        // 필터
        $filterInStock.addEventListener("click", () => {
          currentList = ProductModel.filterInStock(currentList);
          commitRender();
        });

        // 초기화
        $reset.addEventListener("click", () => {
          ProductModel.reset();
          $searchInput.value = "";
          currentList = ProductModel.getProducts();
          commitRender();
        });
      }

      return { init };
    })();

    // 실행
    AppController.init();
  </script>
</body>
</html>
```

---

## ✅ 요구사항 체크리스트
- [x] 상품 데이터 `products`를 Model로 분리
- [x] 화면 렌더 함수 `renderProducts(productList)`를 View로 분리
- [x] HTML에 `#app-root` 컨테이너 생성
- [x] 초기 로딩 시 `renderProducts(products)` 실행
- [x] (보강) Controller/App에서 흐름을 통합 관리

---

## 🔥 오늘 반드시 가져가야 할 것 (실무 기준)
- **Model은 DOM을 몰라야 한다** → 테스트/확장/재사용 쉬워짐
- **View는 규칙을 최소화** → 디자인 변경이 쉬워짐
- **Controller(App)가 흐름을 책임** → “어디서 무엇이 바뀌는지” 한눈에 보임
- “작은 프로젝트일수록 아키텍처가 필요 없다”가 아니라  
  **작을 때 잡아야 커졌을 때 안 죽는다**

---

## 🚀 (선택) 확장 과제
- “장바구니 Model” 추가하고, 상품 클릭 시 장바구니에 담기
- `ProductModel`에 `decreaseStock(productId)` 같은 규칙 함수 추가
- View에 “품절 상품은 카드 흐리게 처리” 같은 UI 룰 추가
- Day 46의 Store 패턴과 결합해서 “상태 변경 시 자동 렌더”로 업그레이드

---

## 📚 참고 키워드
- MVC / Architecture
- Separation of Concerns (관심사 분리)
- Single Source of Truth
- One-way Data Flow
- Model / View / Controller
