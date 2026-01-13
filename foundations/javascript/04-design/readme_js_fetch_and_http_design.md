# JavaScript Fetch & HTTP Design (실무 기준)

> 이 문서는 fetch API 사용법을 설명하지 않는다.  
> **네트워크 요청을 어떻게 상태로 해석하고 설계해야 하는지**를 다룬다.

---

## 🧭 이 챕터의 위치

- State & Rendering Design **이후**
- React 진입 **직전 또는 직후 모두 사용 가능**

즉,
- fetch 문법 학습 ❌
- **네트워크 = 상태 전이 문제**로 해석하는 단계 ✅

---

## 🎯 목표

- HTTP 실패와 JS 에러를 명확히 구분한다
- fetch 결과를 **UI 상태로 변환**할 수 있다
- React / 비동기 환경에서도 재사용 가능한 패턴을 만든다

---

## 1. 가장 흔한 오해

```js
fetch(url)
  .then(res => res.json())
  .then(data => render(data))
  .catch(err => console.error(err));
```

### 문제점

- HTTP 실패를 성공처럼 처리함
- 실패 원인을 UI가 알 수 없음
- 상태 분리 불가

👉 fetch를 **네트워크 호출 함수**로만 사용한 결과

---

## 2. HTTP 에러 vs JavaScript 에러

### JavaScript 에러

- 문법 오류
- 런타임 오류
- 네트워크 자체 실패 (DNS, CORS 등)

👉 Promise reject → catch로 이동

### HTTP 에러

- 400 / 401 / 404 / 500

👉 **fetch는 reject하지 않는다**

---

## 3. fetch의 본질

```js
const response = await fetch(url);
```

- 요청 성공 ≠ 응답 성공
- fetch 성공 = 서버에 연결됨

👉 응답의 성공 여부는 **response.ok**가 판단한다

---

## 4. 올바른 fetch 기본 설계

```js
async function request(url) {
  const response = await fetch(url);

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  const data = await response.json();
  return { ok: true, data };
}
```

- 네트워크 결과를 **값으로 반환**
- throw 남발 금지

---

## 5. 상태 전이 관점에서의 fetch

```js
// before
state = { status: 'loading' };
render(state);

// after
state = { status: 'success', data };
render(state);
```

또는

```js
state = { status: 'error', code: 401 };
render(state);
```

👉 fetch는 상태를 **변경시키는 트리거**

---

## 6. try / catch를 최소화하는 이유

```js
try {
  const res = await fetch(url);
} catch (e) {
  setError(e);
}
```

### 문제

- 에러 종류 분기 불가능
- UI 설계 불리

👉 catch는 **진짜 예외**만 처리

---

## 7. 실무용 fetch 레이어 분리

### 역할 분리

- fetch layer: 네트워크
- service layer: 비즈니스 판단
- UI layer: 상태 표현

```txt
api/
 └─ user.api.js
services/
 └─ user.service.js
ui/
 └─ UserPage.jsx
```

---

## 8. React와 연결되는 지점

- fetch → useEffect ❌
- fetch → 상태 머신 ✅

```js
{ status: 'idle' | 'loading' | 'success' | 'error' }
```

React Query / SWR은 이 구조를 자동화한 것

---

## 9. 실무 체크리스트

- [ ] HTTP 에러를 catch로 처리하고 있지 않은가?
- [ ] fetch 결과가 상태로 변환되는가?
- [ ] UI는 실패 상태를 표현할 수 있는가?
- [ ] 네트워크 로직이 UI에서 분리되어 있는가?

---

## 🎯 이 챕터를 마치면

- fetch를 무의식적으로 쓰지 않는다
- 네트워크 실패를 설계할 수 있다
- React에서 비동기 코드가 단순해진다

---

## 다음 챕터 예고

> **React Entry: useState & useEffect Design**  
> 왜 이 두 훅이 핵심인가

---

**이 문서는 React 실무로 바로 연결 가능한 설계 문서다.**

