# Day 29 — DOM Tree & Selection
**Fri, Jan 23, 2026**  
**주제:** DOM Tree & Selection  
**목표:** JS로 HTML 요소를 동적으로 생성/배치해서 **동적 구구단 표**를 화면에 렌더링

---

## 🗓 일정
- Fri, Jan 23, 2026

---

## 🎯 미션 목표
- DOM Tree(노드 트리) 구조를 이해하고, `querySelector`로 원하는 요소를 정확히 선택한다.
- `createElement` + `appendChild/append`로 **HTML을 “문자열로 쓰지 않고” 노드로 생성**한다.
- 2단~9단 구구단을 **정적 HTML 없이**, JS만으로 화면에 렌더링한다.

---

## ✅ 요구사항 체크리스트
- [ ] 초기 HTML에는 **빈 컨테이너 div 1개만** 존재
- [ ] JS에서 `document.createElement()`로 요소를 생성
- [ ] 2단~9단 각각 **별도 섹션**으로 구분 (`section/div`)
- [ ] 각 식(예: `2 × 1 = 2`)은 **개별 요소**로 생성 (`li/p/span`)
- [ ] 최종 결과가 표/그리드 형태로 보이게 구성 (CSS는 선택)
- [ ] (권장) `textContent` 사용 (XSS/안전성)

---

## 🧠 핵심 개념 & 핵심 이론 (보강)

### 1) DOM Tree란?
브라우저는 HTML을 문자열로 “보는” 게 아니라, **노드(Node) 트리**로 파싱해서 메모리에 올립니다.

- **Document**: 전체 문서(최상위)
- **Element Node**: `<div>`, `<section>` 같은 태그
- **Text Node**: 태그 안의 텍스트(공백도 포함될 수 있음)
- **Attribute**: id/class 같은 속성(요소에 붙는 데이터)

✅ 결론: **JS가 HTML을 바꾸는 게 아니라, DOM 노드를 조작해서 화면을 바꿈**.

---

### 2) 요소 선택: `querySelector` / `querySelectorAll`
```js
const el = document.querySelector("#app");        // 첫 1개
const list = document.querySelectorAll(".item");  // 여러 개 (NodeList)
```

- `querySelector` → 조건에 맞는 **첫 번째 요소 1개**
- `querySelectorAll` → **NodeList**(유사 배열) 반환

**실무 팁**
- 선택자는 “가장 좁게” 잡는다: `#container .dan` 처럼 범위를 제한하면 실수/충돌이 줄어듭니다.
- `id`는 화면에서 **유일**하게 유지하는 습관이 좋습니다.

---

### 3) NodeList vs Array
NodeList는 배열처럼 생겼지만 “진짜 Array”가 아닙니다.

- NodeList: `forEach`는 되는 경우가 많음
- Array: `map/filter/reduce` 등 고차함수 풀세트

```js
const nodes = document.querySelectorAll(".item");
const arr = Array.from(nodes); // 또는 [...nodes]
const texts = arr.map((el) => el.textContent);
```

---

### 4) Traversal (탐색/이동)
DOM은 트리라서 “위/아래/옆”으로 이동할 수 있습니다.

- 부모: `parentElement`
- 자식: `children`, `firstElementChild`, `lastElementChild`
- 형제: `nextElementSibling`, `previousElementSibling`

```js
const item = document.querySelector(".item");
console.log(item.parentElement);
console.log(item.nextElementSibling);
```

✅ 실무에서 자주 하는 패턴: “이벤트 발생 요소 → 가장 가까운 카드/섹션 찾기”
```js
e.target.closest(".dan");
```

---

### 5) 요소 생성 & 배치 (오늘의 본체)
DOM 조작의 기본 3단 콤보:

1) 생성: `document.createElement(tag)`
2) 내용/속성: `textContent`, `className`, `setAttribute`
3) 배치: `appendChild`, `append`

```js
const li = document.createElement("li");
li.textContent = "2 × 1 = 2";
ul.appendChild(li);
```

#### `textContent` vs `innerHTML`
- `textContent` ✅: 텍스트만 넣음(안전)
- `innerHTML` ⚠️: HTML 파싱을 다시 함(빠를 때도 있지만 XSS 위험 + 실수 위험)

---

### 6) 성능 포인트 (중요)
DOM에 요소를 “하나씩” 계속 붙이면, 경우에 따라 **레이아웃 계산(리플로우) / 페인트(리페인트)**가 반복될 수 있습니다.

**초급 단계에서는 괜찮지만**, 습관은 이렇게 잡는 게 좋습니다:

- 한 번에 붙이기: `DocumentFragment`
- 또는 문자열 템플릿을 조심해서(검증된 데이터만) `innerHTML`로 한 번에 렌더

```js
const frag = document.createDocumentFragment();
// frag에 다 만들어 담고
container.appendChild(frag); // 마지막에 한 번만 DOM에 붙임
```

---

## 🏗️ 구현 설계 (추천 DOM 구조)
```txt
#container
  section.dan (2단)
    h3
    ul
      li (2 × 1 = 2)
      ...
  section.dan (3단)
  ...
```

- 단(2~9): `section.dan`
- 식(1~9): `li`

---

## 💻 구현 코드 (README용 정답 예시)

### 1) `index.html` (초기 HTML은 컨테이너만)
```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Day 29 - Dynamic Gugudan</title>
    <style>
      /* 선택: 보기 좋게만 */
      body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
      h1 { margin-bottom: 16px; }
      .grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(180px, 1fr));
        gap: 12px;
      }
      .dan {
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 12px;
      }
      .dan h3 { margin: 0 0 8px; }
      .dan ul { margin: 0; padding-left: 18px; }
      .dan li { line-height: 1.6; }
    </style>
  </head>
  <body>
    <h1>구구단 표</h1>

    <!-- ✅ 초기 HTML에는 비어있는 컨테이너만 -->
    <div id="multiplication-table-container" class="grid"></div>

    <script>
      // === 1) 컨테이너 선택 ===
      const container = document.querySelector("#multiplication-table-container");

      // === 2) DocumentFragment로 한 번에 붙이기(권장) ===
      const frag = document.createDocumentFragment();

      // === 3) 2단 ~ 9단 생성 ===
      for (let dan = 2; dan <= 9; dan++) {
        const section = document.createElement("section");
        section.className = "dan";

        const title = document.createElement("h3");
        title.textContent = `${dan}단`;

        const ul = document.createElement("ul");

        for (let num = 1; num <= 9; num++) {
          const li = document.createElement("li");
          li.textContent = `${dan} × ${num} = ${dan * num}`;
          ul.appendChild(li);
        }

        section.append(title, ul);
        frag.appendChild(section);
      }

      // === 4) 마지막에 한 번만 DOM에 부착 ===
      container.appendChild(frag);
    </script>
  </body>
</html>
```

---

## 🧪 체크 포인트
- [ ] HTML에는 컨테이너만 있고, 나머지 UI는 JS로 생성되는가?
- [ ] 2단~9단이 각각 별도 섹션으로 나뉘는가?
- [ ] 각 식이 `li`로 생성되는가?
- [ ] `innerHTML` 남발 없이 `textContent` 중심으로 작성했는가?
- [ ] (권장) `DocumentFragment`로 마지막에 한 번에 붙였는가?

---

## 🔥 오늘의 핵심 요약
- DOM은 “HTML 문자열”이 아니라 **노드 트리**다.
- 동적 UI의 기본은: **선택 → 생성 → 내용/속성 → 배치**
- `createElement + textContent + appendChild`가 기본기.
- 많은 요소를 그릴 땐 `DocumentFragment`로 한 번에 붙이면 더 깔끔하다.

---

## 🎯 얻어가는 점
- DOM 조작의 “렌더링 감각” 확보 (데이터 → UI)
- 이후 프로젝트에서 리스트/카드/테이블/대시보드를 직접 그릴 수 있는 기반
- React를 배우기 전에 “컴포넌트 렌더링”이 무엇인지 감으로 이해하게 됨

---

## 🚀 추가 미션 (선택)
- [ ] 입력으로 “몇 단까지” 받을 수 있게 만들기 (`input` + 버튼)
- [ ] 단 클릭 시 접기/펴기 토글 구현 (`classList.toggle`)
- [ ] 표 형태(`table`)로도 구현해보기 (`thead/tbody` 생성)
- [ ] 이벤트 위임으로 섹션 클릭 핸들링(성능 습관)

---

## 📚 참고 키워드 (MDN)
- DOM (Document Object Model)
- Document.querySelector()
- Document.querySelectorAll()
- Document.createElement()
- Node.appendChild() / Element.append()
- DocumentFragment
- textContent vs innerHTML
