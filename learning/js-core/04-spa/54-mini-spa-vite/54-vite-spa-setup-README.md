# Day 54 — Vite + SPA 프로젝트 세팅 (실전 환경)

## 🏷 Topic
Vite Dev Server / SPA Fallback / History API / Client-side Routing Environment

## 🔎 관련 검색어
- vite spa refresh issue
- spa fallback index.html
- cannot get todos vite
- history api spa server
- client side routing refresh solution

---

## ✅ 한 줄 요약
SPA에서 새로고침이 되는 이유는  
**프레임워크가 아니라 서버가 SPA를 이해하기 때문**이다.

---

## 📌 프로젝트 개요 (WHY)
Day 54는 기능을 추가하는 날이 아니다.  
**“왜 Live Server에서는 안 되고, Vite에서는 되는가”를 명확히 이해하는 전환점**이다.

지금까지 만든 SPA는 구조적으로 완성되어 있었지만,
- 새로고침 시 `/todos`, `/about`에서 404 발생
- 이는 코드 문제가 아닌 **서버 인식 문제**

이 Day의 목적은  
**SPA가 실제 서비스 환경에서 어떻게 동작해야 하는지를 체감하는 것**이다.

---

## 🎯 미션 목표
- Live Server와 Vite의 차이를 설명할 수 있다
- SPA fallback 개념을 이해한다
- History API 기반 SPA가 새로고침 되는 환경을 만든다
- “왜 Vite가 필요한지”를 구조적으로 설명한다

---

## 🧠 오늘의 핵심 깨달음

### 1️⃣ Vite를 써야 되는 게 아니라, fallback이 있어야 된다
> ❌ Vite라서 된다  
> ⭕ SPA fallback을 제공하는 서버라서 된다

Vite Dev Server는 모든 요청에 대해:
```
/todos
/about
```
→ 항상 `index.html`을 반환한다.

---

### 2️⃣ Home(`/`)만 새로고침 되던 이유
- `/` → 서버가 알고 있는 실제 리소스
- `/todos` → 서버가 모르는 경로

👉 서버가 모르는 경로를 **SPA가 해석할 기회를 못 얻은 것**

---

### 3️⃣ Cannot GET /todos의 진짜 의미
- Router 실패 ❌
- JavaScript 오류 ❌
- **서버 라우팅 미설정 ⭕**

---

## 🧠 핵심 이론 보강

### SPA에서 서버의 역할
| 역할 | 설명 |
|---|---|
| 정적 파일 제공 | index.html, js, css |
| 모든 경로 fallback | SPA 라우팅 전제 |
| 상태 복원 시작점 | URL 기반 진입 |

---

### Live Server가 실전에서 쓰이지 않는 이유
- fallback 미지원
- SPA 라우팅 고려 없음
- 학습용 정적 서버

👉 실무에서는 사용되지 않는다.

---

## 🧩 상태 모델 (변화 없음)
```js
{
  route: '/todos'
}
```

- 상태는 동일
- **환경만 바뀌었을 뿐**

---

## 🧠 핵심 코드 스냅샷

### History API 기반 라우팅
```js
history.pushState({ route }, '', route);
```

---

### Vite Dev Server의 역할
```txt
모든 요청 → index.html
```

(코드가 아니라 **서버 정책**)

---

## ⚙️ 구현 기준 & 기른 역량

### 구현 기준
- Live Server 사용 ❌
- Vite Dev Server 사용 ⭕
- 새로고침 / 직접 진입 정상 동작

### 기른 역량
- SPA 서버 의존성 이해
- 실전 배포 환경 사고
- 프론트엔드 ↔ 서버 경계 인식

---

## 📂 파일 구조
```
mini-spa-vite/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  └─ main.js
└─ vite.config.js
```

---

## ☑️ 체크리스트
- [ ] Live Server와 Vite 차이를 설명할 수 있는가
- [ ] SPA fallback 개념을 이해했는가
- [ ] 새로고침 오류의 원인을 서버 관점에서 설명할 수 있는가
- [ ] React Router의 필요성을 언어로 설명할 수 있는가

---

## 🎯 얻어가는 점
- SPA는 브라우저만의 기술이 아니다
- 서버는 SPA의 일부다
- 프레임워크는 문제를 숨긴 게 아니라 해결해준다
- 이제 React/Next.js를 “이해한 상태”로 배울 준비가 끝났다
