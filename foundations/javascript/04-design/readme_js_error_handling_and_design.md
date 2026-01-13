# JavaScript Error Handling & Design (실무 기준 완전판)

> 이 문서는 **문법 설명서가 아니다**.  
> JavaScript에서 에러를 **어떻게 처리하느냐가 아니라, 왜 그렇게 설계해야 하는지**를 설명한다.

---

## 🧭 이 챕터의 위치

- Promise / async·await / 비동기 흐름 **이후**
- React 진입 **직전**

즉,
- "try/catch 문법"을 배우는 단계 ❌
- **에러를 시스템 관점에서 다루는 사고 체계**를 만드는 단계 ✅

---

## 🎯 목표

- 에러를 **예외 상황**이 아닌 **상태(State)** 로 인식한다
- 에러 전파 흐름을 **예측 가능하게 설계**한다
- React, API, 비동기 환경에서도 **무너지지 않는 에러 구조**를 만든다

---

## 1. 에러란 무엇인가 (정의부터 다시)

### ❌ 잘못된 인식

- 에러 = 버그
- 에러 = 코드가 잘못됨

### ✅ 실무적 정의

> **에러는 시스템이 정상 경로를 벗어났음을 알리는 신호다**

- 네트워크 실패
- 사용자 입력 오류
- 서버 응답 불일치
- 의도적으로 막아야 할 흐름

👉 에러는 **반드시 발생한다**는 전제로 설계해야 한다.

---

## 2. 에러의 분류 (설계 관점)

### 2-1. Recoverable Error (복구 가능)

- 잘못된 입력값
- 일시적 네트워크 오류
- 재시도 가능한 실패

👉 UI에서 **상태로 표현**해야 한다.

### 2-2. Unrecoverable Error (복구 불가)

- 코드 로직 붕괴
- 예상 불가능한 데이터 구조

👉 즉시 중단 + 로깅 대상

---

## 3. try / catch는 왜 위험한가

```js
try {
  doSomething();
} catch (e) {
  console.log(e);
}
```

### 문제점

- 에러가 **삼켜진다**
- 호출자는 실패 여부를 모른다
- 상태가 애매해진다

👉 try/catch는 **처리**가 아니라 **통제**여야 한다.

---

## 4. 에러 전파 설계 (핵심)

### 원칙 1. 에러는 발생 지점에서 해결하지 않는다

```js
function parseUser(data) {
  if (!data.name) {
    throw new Error('INVALID_USER');
  }
}
```

- 판단은 아래에서
- 책임은 위에서

---

### 원칙 2. catch는 최상단에서만

```js
async function main() {
  try {
    await run();
  } catch (error) {
    renderError(error);
  }
}
```

- 비즈니스 로직 내부에 catch ❌
- UI / App Entry에서 catch ✅

---

## 5. 에러를 값처럼 다루기

### throw 대신 Result 패턴

```js
return { ok: false, reason: 'NETWORK_FAIL' };
```

#### 장점
- 흐름이 끊기지 않는다
- React 상태 관리에 유리

👉 **에러 = 또 하나의 상태**

---

## 6. 비동기 환경에서의 에러

### Promise 체인의 함정

```js
fetchData()
  .then(parse)
  .then(render)
  .catch(handle);
```

- 어디서 실패했는지 흐려짐

### async/await 설계 기준

```js
const data = await fetchData();
if (!data.ok) return renderError();
```

- 명시적 분기
- 가독성 우선

---

## 7. React를 위한 에러 사고 체계

### 왜 React에서는 더 중요해지는가

- 렌더링은 반복된다
- 에러는 UI를 **깨뜨릴 수 있다**

### 핵심 원칙

- 에러는 throw하지 말고 **state로 올린다**
- UI는 항상 실패 상태를 가질 수 있어야 한다

```js
const [error, setError] = useState(null);
```

---

## 8. 실무 체크리스트

- [ ] 이 에러는 복구 가능한가?
- [ ] 지금 catch를 쓰는 게 맞는가?
- [ ] 호출자는 실패를 인지할 수 있는가?
- [ ] UI에서 표현 가능한 상태인가?

---

## 🎯 이 챕터를 마치면

- try/catch를 남발하지 않는다
- 에러 흐름을 **설계할 수 있다**
- React의 Error Boundary가 왜 필요한지 이해된다

---

## 다음 챕터 예고

> **State & Rendering Design (Pre-React)**  
> 왜 상태가 UI를 결정하는가

---

**이 문서는 포트폴리오용 설계 문서로 그대로 사용 가능하다.**

