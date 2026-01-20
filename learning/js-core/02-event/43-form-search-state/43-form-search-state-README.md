# Day 43 — Form + Search State Handling

## 🏷 Topic
Form State Handling / Controlled Input / Derived State / Search & Filter Architecture

## 🔎 관련 검색어
- controlled form state javascript
- derived state vs stored state
- form input state management
- search filter derived state
- single source of truth ui

---

## ✅ 한 줄 요약
입력(Form)은 **저장되는 상태**이고, 검색/필터 결과는 **계산되는 상태**다.  
같은 결과라도 **상태에 도달하는 경로가 다르면 구조는 완전히 달라진다.**

---

## 📌 프로젝트 개요 (WHY)
Day 43은 투두리스트를 확장하는 날이 아니다.  
**Form 입력과 Search/Filter를 하나의 상태 아키텍처로 묶는 사고**를 만드는 단계다.

실무 UI 대부분은 다음 구조를 가진다.

- 사용자가 조건을 설정한다 (Form)
- 조건이 즉시 결과에 반영된다 (Search / Filter)
- 결과는 저장되지 않고 계산된다

이 Day의 목표는 이 구조를 **명확한 상태 경계**로 구현하는 것이다.

---

## 🎯 미션 목표
- Form 입력을 완전한 **controlled state**로 관리한다
- Search 결과를 **derived state**로 계산한다
- 결과 리스트를 별도 state로 저장하지 않는다
- 이벤트 리스너를 최소화하고 흐름을 단순화한다
- state → render 단방향 흐름을 유지한다

---

## 🧠 핵심 사고

### 1️⃣ Form 입력은 “의도(Intent)”다
Form은 사용자가 “무엇을 보고 싶은지”를 표현하는 수단이다.

```js
let formState = {
  name: '',
  active: false,
  category: 'all',
};
```

- 입력값은 상태로 **저장된다**
- 새로고침/복원/저장 대상이 된다
- UI 설정값의 성격을 가진다

---

### 2️⃣ Search / Filter 결과는 “계산(Result)”이다
검색 결과는 상태가 아니다.

```js
function getFilteredItems() {
  return items.filter(...)
}
```

- 원본 데이터 + 조건 → 계산
- 저장하지 않는다
- 항상 최신 상태를 반영한다

👉 중복 상태를 만들지 않는 것이 핵심이다.

---

### 3️⃣ 결과가 같아도 구조는 다르다
Form과 Search가 같은 조건을 만들 수 있다.  
그 결과 리스트가 같아지는 것은 **정상**이다.

중요한 것은:
- 어떤 상태가 남는가
- 어떤 값이 계산되는가

---

## 🧩 상태 모델

### 저장되는 상태
```js
let formState = {
  name: '',
  active: false,
  category: 'all',
};

let searchKeyword = '';
```

### 원본 데이터
```js
const items = [
  { id: 1, name: 'React', category: 'frontend', active: true },
  { id: 2, name: 'Vue', category: 'frontend', active: false },
  { id: 3, name: 'Node', category: 'backend', active: true },
  { id: 4, name: 'Figma', category: 'design', active: true },
];
```

### 파생 상태
```js
const filteredItems = getFilteredItems();
```

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ 단일 이벤트 처리 (Form + Search)
```js
document.addEventListener('input', (e) => {
  const field = e.target.dataset.field;

  if (field) {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value;

    formState = { ...formState, [field]: value };
    render();
  }

  if (e.target.dataset.action === 'search') {
    searchKeyword = e.target.value;
    render();
  }
});
```

---

### 2️⃣ 파생 상태 계산
```js
function getFilteredItems() {
  return items.filter(item => {
    const matchName =
      formState.name === '' ||
      item.name.toLowerCase().includes(formState.name.toLowerCase());

    const matchCategory =
      formState.category === 'all' ||
      item.category === formState.category;

    const matchActive =
      !formState.active || item.active;

    const matchSearch =
      searchKeyword === '' ||
      item.name.toLowerCase().includes(searchKeyword.toLowerCase());

    return matchName && matchCategory && matchActive && matchSearch;
  });
}
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- 입력값은 항상 state에 저장
- 결과 리스트는 state로 저장하지 않음
- 조건 추가 시 계산 로직만 확장
- DOM 직접 수정 ❌

### 기른 역량
- Controlled Form 설계 능력
- Derived State 구분 능력
- 상태 최소화 사고
- 실무형 필터/검색 구조 이해

---

## 📂 파일 구조
```
43-form-search-state/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] 입력값과 결과값의 역할을 구분했는가
- [ ] 결과 리스트를 state로 저장하지 않았는가
- [ ] 조건이 늘어나도 구조가 유지되는가
- [ ] 같은 결과라도 상태 흐름을 설명할 수 있는가

---

## 🎯 얻어가는 점
- 상태는 “최소한만” 가져야 한다
- 결과는 저장이 아니라 계산이다
- 같은 UI라도 구조에 따라 유지보수 난이도가 달라진다
- 이후 React controlled input / memo 개념으로 자연스럽게 연결된다
