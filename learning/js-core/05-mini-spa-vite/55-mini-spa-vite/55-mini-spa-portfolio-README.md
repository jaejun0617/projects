# Day 55 — Mini SPA 실전 완성 (Vite 기반)

## 🏷 Topic
Mini SPA Project / Vite / Client-side Routing / State Architecture / Portfolio SPA

## 🔎 관련 검색어
- vite spa portfolio
- vanilla js spa architecture
- client side routing vite
- spa state management vanilla js
- spa fallback production

---

## ✅ 한 줄 요약
프레임워크 없이도  
**상태 · 라우팅 · 비동기 · UI를 통합한 SPA는 충분히 설계할 수 있다.**

---

## 📌 프로젝트 개요 (WHY)
Day 55는 학습을 위한 예제가 아니다.  
**“실제 서비스처럼 동작하는 SPA를 완성하는 단계”**다.

이 프로젝트는:
- Live Server의 한계를 넘고
- SPA fallback이 적용된 서버 환경(Vite)에서
- 새로고침 / 직접 진입 / 뒤로가기까지 정상 동작한다

즉, **배포 가능한 구조를 전제로 한 순수 JS SPA**다.

---

## 🎯 미션 목표
- Vite 기반 SPA 실전 구조 완성
- Router / Store / View 책임 분리
- 비동기 데이터 로딩 통합
- 포트폴리오 설명 가능한 아키텍처 구축

---

## 🧠 핵심 사고

### 1️⃣ SPA는 구조의 문제다
- 화면 전환 ❌
- **상태 변경 → 렌더 결과 ⭕**

---

### 2️⃣ Router는 화면이 아니라 상태를 바꾼다
```js
navigate('/todos');
```

- DOM 이동 ❌
- route 상태 변경 ⭕

---

### 3️⃣ Store는 단일 진실 공급원이다
```js
store.set({ todos });
```

- 상태는 한 곳에만 존재
- 모든 UI는 상태의 결과

---

## 🧩 상태 모델
```js
{
  route: '/',
  todos: [],
  filter: 'all',
  status: 'idle'
}
```

- route : View 결정
- todos : 서버 데이터
- filter : 파생 상태
- status : 비동기 상태

---

## 🧠 핵심 코드 스냅샷

### Store 패턴
```js
set(next) {
  this.state = { ...this.state, ...next };
  render();
}
```

---

### Router
```js
history.pushState({ route }, '', route);
```

---

### 비동기 데이터 로딩
```js
await fetch('/todos');
```

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- Live Server 사용 ❌
- Vite Dev Server 사용 ⭕
- SPA fallback 전제
- 역할 분리 구조 유지

### 기른 역량
- SPA 아키텍처 설계 능력
- 상태 기반 UI 사고
- 서버 환경 이해
- React/Next.js로 확장 가능한 기반

---

## 📂 파일 구조
```
mini-spa-vite/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ store.js
│  ├─ router.js
│  ├─ views.js
│  └─ main.js
```

---

## ☑️ 체크리스트
- [ ] 새로고침 / 직접 진입 정상 동작
- [ ] Router / Store / View 설명 가능
- [ ] 상태 흐름을 말로 설명 가능
- [ ] React로 옮길 수 있는 구조인지 확인

---

## 🎯 얻어가는 점
- SPA의 본질은 프레임워크가 아니다
- 서버 fallback이 핵심이다
- React는 구조를 대체하는 도구가 아니라 압축하는 도구다
- 이제 React를 **이해한 상태로** 시작할 수 있다
