# Day 53 — SPA State Sync (URL ↔ State 통합)

## 🏷 Topic
SPA State Sync / URL as State / History API / Query Parameter Sync

## 🔎 관련 검색어
- spa url state sync
- history api state synchronization
- cannot get todos spa
- client side routing refresh issue
- url query state management

---

## ✅ 한 줄 요약
SPA에서 URL은 링크가 아니라  
**상태를 저장하고 복원하기 위한 또 하나의 State Container**다.

---

## 📌 프로젝트 개요 (WHY)
Day 53은 “라우팅을 만드는 날”이 아니다.  
**SPA에서 상태가 어디까지 확장되는지를 이해하는 단계**다.

지금까지 우리는:
- 상태를 분리했고
- 이벤트를 통제했고
- URL을 상태로 다루기 시작했다

이 Day의 목표는  
**UI 상태 ↔ URL ↔ 브라우저 히스토리**를 하나의 흐름으로 묶는 것이다.

---

## 🎯 미션 목표
- URL을 1급 상태로 취급한다
- 상태 변경 시 URL이 자동으로 반영된다
- URL 직접 진입 시 상태가 복원된다
- 뒤로가기/새로고침에도 상태가 유지된다

---

## 🧠 핵심 사고

### 1️⃣ URL은 결과가 아니라 상태다
```js
state = {
  route: '/todos',
  filter: 'completed'
};
```

- URL은 “이동 경로” ❌
- URL은 “현재 앱 상태의 표현” ⭕

---

### 2️⃣ 상태 ↔ URL은 양방향이다
| 방향 | 의미 |
|---|---|
| State → URL | 공유 / 기록 |
| URL → State | 진입 / 복원 |

---

### 3️⃣ Query String은 파생 상태 저장소다
```txt
/todos?filter=active
```

- 서버용 ❌
- 클라이언트 상태 복원용 ⭕

---

## 🧠 핵심 이론 보강

### 왜 새로고침 시 `Cannot GET /todos`가 뜨는가

#### 현상
- `/todos` 상태에서 새로고침
- 서버가 `/todos`를 실제 리소스로 요청받음
- 서버에 해당 파일/라우트 없음 → 404

#### 원인
- SPA는 **클라이언트 라우팅**
- 서버는 **SPA fallback 설정이 없음**

👉 **코드 문제가 아니라 서버 설정 문제**

---

### CSP 오류 메시지의 정체
```
Connecting to '.well-known/appspecific/com.chrome.devtools.json'
violates Content Security Policy
```

- Chrome DevTools 내부 요청
- Live Server 보안 정책 차단
- SPA 동작과 무관

👉 **완전히 무시해도 되는 메시지**

---

## 🧩 상태 모델
```js
let state = {
  route: '/',
  filter: 'all',
};
```

- route : View 결정
- filter : UI 상태
- URL과 항상 동기화

---

## 🧠 핵심 코드 스냅샷

### 1️⃣ State → URL
```js
history.pushState({ ...state }, '', url);
```

---

### 2️⃣ URL → State
```js
const params = new URLSearchParams(location.search);
state.filter = params.get('filter') || 'all';
```

---

### 3️⃣ 뒤로가기 복원
```js
window.addEventListener('popstate', syncURLToState);
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- URL을 상태로 취급
- render는 상태 결과만 표현
- 새로고침 오류를 구조적으로 이해

### 기른 역량
- SPA 상태 동기화 설계 능력
- URL 기반 상태 복원 사고
- React Router / Next.js routing 선행 이해

---

## 📂 파일 구조
```
53-spa-state-sync/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   └─ main.js
```

---

## ☑️ 체크리스트
- [ ] URL을 상태로 설명할 수 있는가
- [ ] Query String의 역할을 이해했는가
- [ ] 새로고침 오류의 원인을 구분할 수 있는가
- [ ] 서버 fallback의 필요성을 설명할 수 있는가

---

## 🎯 얻어가는 점
- SPA는 상태 기반 애플리케이션이다
- URL은 상태 저장소다
- 새로고침 문제는 서버 책임이다
- 이 구조가 SPA의 완성형이다
