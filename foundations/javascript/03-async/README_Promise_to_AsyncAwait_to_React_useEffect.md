# README — Promise → async/await → React useEffect 패턴 (완벽정리)

> 목적: **Promise 기반 비동기 흐름**을 정확히 이해하고, 이를 **async/await**로 안전하게 설계한 뒤, React의 **useEffect 데이터 패칭 패턴**까지 “실무형”으로 연결한다.  
> 핵심: **경쟁 상태(race)**, **취소(abort)**, **에러 표준화**, **StrictMode(개발) 이펙트 2회 실행**, **의존성/클린업**을 누락 없이 처리한다.

---

## 0. 큰 그림: “비동기 = 상태 머신”

비동기 로직은 결국 아래 상태를 오간다.

- `idle` → `loading` → `success`
- `idle` → `loading` → `error`
- `loading` → `cancelled` (취소 / 언마운트 / 최신 요청 우선)

React에서 특히 중요한 건:
- 화면이 이미 다른 상태로 넘어갔는데도 **늦게 도착한 응답**이 상태를 덮어쓰는 **race**를 막는 것.
- 컴포넌트가 사라졌는데도 setState 하려는 **unmounted update**를 막는 것.
- 개발환경 StrictMode에서 이펙트가 **2번 실행되는 것**을 전제로 안정성을 확보하는 것.

---

## 1. Promise 완전 핵심

### 1) Promise란?
Promise는 “**미래에 완료될 값**”을 표현하는 객체다.

- `pending`(대기) → `fulfilled`(성공) / `rejected`(실패)
- `.then()`은 성공 값을, `.catch()`는 실패를 다룬다.
- `.finally()`는 성공/실패와 무관하게 마무리 정리를 한다.

### 2) then 체이닝의 본질
`then`은 **새 Promise**를 반환한다. 그래서 체이닝이 가능하다.

```js
fetch('/api/user')
  .then(res => res.json())
  .then(user => user.name)
  .catch(err => console.error(err));
```

규칙:
- `then` 내부에서 **값을 return**하면 다음 `then`으로 전달된다.
- `then` 내부에서 **Promise를 return**하면 다음 `then`은 그 Promise의 결과를 기다린다.
- `throw`하면 rejection으로 넘어간다(즉 `catch`로 간다).

### 3) Promise.all / race / allSettled / any (요약)
- `Promise.all`: **모두 성공**해야 성공, 하나라도 실패하면 즉시 실패
- `Promise.race`: 가장 먼저 끝난 것(성공/실패)을 반환
- `Promise.allSettled`: 성공/실패 **결과를 모두 수집**
- `Promise.any`: 하나라도 성공하면 성공, 모두 실패하면 AggregateError

---

## 2. async/await로 “안전하게” 바꾸기

### 1) async/await의 정체
`async` 함수는 **항상 Promise**를 반환한다.  
`await`은 Promise가 완료될 때까지 **함수 실행을 잠시 멈추고** 결과를 꺼낸다(문법 설탕).

```js
async function getUser() {
  const res = await fetch('/api/user');
  if (!res.ok) throw new Error('HTTP error');
  return res.json();
}
```

### 2) try/catch 설계
실무에서 중요한 원칙:

- `try`에는 “실패 가능 지점”을 묶는다.
- `catch`에서는 **표준 에러 포맷**으로 변환한다(응답/네트워크/파싱/취소 분리).
- `finally`에서는 로딩 상태/리소스 정리를 한다.

```js
async function requestJson(url, { signal } = {}) {
  try {
    const res = await fetch(url, { signal });

    // HTTP 실패는 fetch 자체가 reject가 아니므로 직접 처리
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const err = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      err.body = text;
      throw err;
    }

    return await res.json();
  } catch (e) {
    // Abort는 “에러”로 처리할지 “취소”로 처리할지 팀 규칙 필요
    if (e?.name === 'AbortError') {
      const err = new Error('Request aborted');
      err.code = 'ABORTED';
      throw err;
    }
    throw e;
  }
}
```

### 3) “병렬 vs 순차” 선택 기준
- 병렬: 서로 독립 → `Promise.all`
- 순차: 이전 결과가 다음 입력 → `await` 순서대로

```js
// 병렬
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// 순차
const a = await fetchA();
const b = await fetchB(a.id);
```

---

## 3. React useEffect 패턴: 데이터 패칭 “정답” 세트

### 0) useEffect의 규칙 (실무 필수)
- Effect는 “렌더 이후” 실행된다.
- Cleanup은 다음 Effect 실행 전 / 언마운트 시 실행된다.
- 의존성 배열은 Effect가 참조하는 외부 값(프롭/상태/함수)을 반영해야 한다.
- 개발 StrictMode에서 mount/unmount/mount가 **의도적으로 반복**될 수 있다(부작용 안전성 테스트).

---

## 4. 패턴 A — 가장 기본(하지만 race 위험 존재)

```jsx
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false; // 최소한의 언마운트 방지(완전한 취소는 아님)
    setStatus('loading');
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!ignore) {
          setData(json);
          setStatus('success');
        }
      } catch (e) {
        if (!ignore) {
          setError(e);
          setStatus('error');
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Error: {String(error?.message ?? error)}</p>;
  if (!data) return null;

  return <div>{data.name}</div>;
}
```

한계:
- 이전 요청을 **실제 취소하지 못함**
- 네트워크가 느릴 때 “늦게 온 응답”이 덮어쓰는 race를 완전히 차단하지 못함(조건부로 막을 뿐)

---

## 5. 패턴 B — AbortController로 “진짜 취소 + race 차단”

**권장 패턴.**

```jsx
import { useEffect, useState } from 'react';

function useUser(userId) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();
    const { signal } = controller;

    setStatus('loading');
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/users/${userId}`, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // signal이 abort되면 아래 setState는 실행되기 전에 catch로 이동하거나,
        // 이미 실행 라인에 들어왔다면 cleanup에서 abort되고, 이후 로직을 막을 수 있어야 한다.
        setData(json);
        setStatus('success');
      } catch (e) {
        // abort는 UI에 에러로 표시하지 않는 정책이 보통
        if (e?.name === 'AbortError') return;
        setError(e);
        setStatus('error');
      }
    })();

    return () => {
      controller.abort(); // ✅ 이전 요청 취소
    };
  }, [userId]);

  return { data, status, error };
}
```

효과:
- `userId`가 바뀌면 cleanup에서 이전 요청을 abort → **오래 걸린 요청이 나중에 도착해도 영향 없음**
- StrictMode 2회 실행에도 안전(첫 실행의 요청이 abort됨)

---

## 6. 패턴 C — “요청 ID(시퀀스)”로 최신 요청만 반영 (Abort 불가 환경 대비)

Abort가 어려운 API(또는 polyfill 불가)에서도 race를 막는 패턴.

```jsx
import { useEffect, useRef, useState } from 'react';

function useUser(userId) {
  const reqIdRef = useRef(0);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const reqId = ++reqIdRef.current;

    setStatus('loading');
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // ✅ 최신 요청만 반영
        if (reqId === reqIdRef.current) {
          setData(json);
          setStatus('success');
        }
      } catch (e) {
        if (reqId === reqIdRef.current) {
          setError(e);
          setStatus('error');
        }
      }
    })();
  }, [userId]);

  return { data, status, error };
}
```

---

## 7. 실무형 에러 표준화 (권장)

UI에서 에러를 다루기 쉽도록 “에러 형태”를 통일한다.

```js
function normalizeError(e) {
  // Abort는 별도 코드로 분리
  if (e?.name === 'AbortError' || e?.code === 'ABORTED') {
    return { type: 'aborted', message: '요청이 취소되었습니다.' };
  }

  // HTTP 에러
  if (typeof e?.status === 'number') {
    return { type: 'http', status: e.status, message: `HTTP ${e.status}` };
  }

  // 네트워크/기타
  return { type: 'unknown', message: e?.message ?? '알 수 없는 오류' };
}
```

React에서 사용:

```jsx
const err = error ? normalizeError(error) : null;
if (err?.type === 'http') return <ErrorView title="서버 오류" detail={err.message} />;
```

---

## 8. 의존성 배열(Dependency) 설계 — 실수 방지 체크리스트

Effect 내부에서 참조하는 값이:
- props/state (예: `userId`, `query`) → 의존성에 포함
- 외부 함수(예: `fetchUser`) → 안정적인 참조가 아니면 포함(혹은 `useCallback`으로 고정)
- “일부러 제외”하려면 근거가 있어야 함(보통 잘못임)

### 1) 함수 의존성 문제 예시
```jsx
function Comp({ userId }) {
  const fetchUser = () => fetch(`/api/users/${userId}`);
  // fetchUser는 렌더마다 새 함수 → 의존성에 넣으면 effect 매번 실행됨
}
```

해결:
- 함수 내부에서 직접 fetch (가장 단순)
- 또는 `useCallback`으로 안정화

---

## 9. cleanup(정리) — 무엇을 정리해야 하나?

- 네트워크 요청: `AbortController.abort()`
- 타이머: `clearTimeout`, `clearInterval`
- 이벤트 리스너: `removeEventListener`
- 구독: unsubscribe

원칙: “Effect가 만든 것”은 cleanup에서 정리한다.

---

## 10. “로딩 점프(레이아웃 점프)” 최소화 팁 (UI 안정화)

데이터 패칭과 별개로, 화면의 안정성을 위해 아래를 같이 적용한다.

- Skeleton/placeholder를 **고정 높이**로 확보
- 상태 전환 시 영역의 최소 높이(`min-height`) 유지
- 리스트는 “빈 상태”일 때도 layout frame 유지

예시:
```css
.panel {
  min-height: 480px; /* 로딩/에러/성공 모두 같은 프레임 */
}
```

---

## 11. 실전 템플릿: “useAsyncState” 훅 (재사용)

```jsx
import { useEffect, useState } from 'react';

export function useAsyncResource(key, fetcher) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (key == null) return;

    const controller = new AbortController();
    const { signal } = controller;

    setStatus('loading');
    setError(null);

    (async () => {
      try {
        const result = await fetcher({ signal });
        setData(result);
        setStatus('success');
      } catch (e) {
        if (e?.name === 'AbortError') return;
        setError(e);
        setStatus('error');
      }
    })();

    return () => controller.abort();
  }, [key, fetcher]);

  return { data, status, error };
}
```

사용:
```jsx
const { data, status, error } = useAsyncResource(userId, ({ signal }) =>
  requestJson(`/api/users/${userId}`, { signal })
);
```

주의:
- `fetcher`는 `useCallback`으로 안정화하거나, 컴포넌트 밖으로 빼서 참조 안정성을 확보한다.

---

## 12. 체크리스트 (면접/실무에서 바로 쓰는 요약)

- [ ] fetch는 4xx/5xx에서 reject가 아니다 → `res.ok` 체크 필수
- [ ] useEffect 패칭은 **AbortController**로 취소한다
- [ ] 늦게 온 응답이 최신 UI를 덮지 않게 **race 방지**한다
- [ ] StrictMode에서 이펙트 2번 실행 → 부작용 안전해야 한다
- [ ] loading/success/error UI는 **레이아웃 점프 최소화**로 설계한다
- [ ] 에러는 표준화(normalize)해서 UI가 간단해지게 만든다

---

## 13. 추천 연습 미션 (바로 포트폴리오화)

1) **검색 자동완성**: 입력 변화마다 fetch, 이전 요청 abort, 최신 결과만 반영  
2) **탭 전환 데이터 패칭**: 탭 바뀔 때 요청 취소 + skeleton 고정 높이  
3) **병렬 로딩 대시보드**: Promise.all + allSettled로 부분 실패 대응

---

### 부록: 자주 나오는 “나쁜 패턴” 3개

1) `useEffect(async () => {...})` 직접 쓰기  
- Effect 콜백은 Promise를 반환하면 안 된다(React가 cleanup으로 오해할 수 있음)
- ✅ 내부에 IIFE 사용

2) `setState`를 “언마운트 후” 호출  
- ✅ abort/ignore 패턴으로 방지

3) 의존성 배열 무시  
- 재현 불가 버그의 근원
- ✅ lint 규칙을 켠다(react-hooks/exhaustive-deps)

---

끝.
