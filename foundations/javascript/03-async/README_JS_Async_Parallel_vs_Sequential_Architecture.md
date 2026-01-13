# README — 비동기 처리 아키텍처: 병렬(Parallel) vs 순차(Sequential) (완전판)

> 목표: “Promise.all 쓰면 끝” 수준을 넘어, **성능/안정성/비용/사용자 경험**을 동시에 만족시키는 비동기 처리 구조를 설계할 수 있게 만든다.

---

## 0. 이 문서에서 다루는 것

### 다루는 것
- 병렬(Parallel) vs 순차(Sequential)의 **정확한 의미**
- **언제** 병렬이 이득이고, **언제** 순차가 더 안전한지
- `Promise.all / allSettled / race / any`의 **아키텍처적 사용법**
- **동시성 제한(concurrency limit)**, **큐/풀**, **레이트 리밋**, **부분 실패 처리**
- **취소(AbortController)**, **타임아웃**, **재시도(backoff)**, **서킷 브레이커** 개념
- UI/UX 관점에서의 **스켈레톤/점진적 렌더링** 전략
- 실무에서 자주 쓰는 **패턴 템플릿 + 코드**

### 다루지 않는 것
- 네트워크 프로토콜(HTTP/2, QUIC) 깊은 내용
- 백엔드의 DB 트랜잭션/락 설계 (필요 시 별도 문서)

---

## 1. 핵심 정의 3가지: “동기/비동기”, “순차/병렬”, “동시성/병렬성”

### 1) 비동기(Async)
- 작업을 시작해두고 **완료를 기다리는 동안** 다른 일을 할 수 있는 구조
- JS에서는 네트워크/타이머/파일 등 “기다림”이 많은 작업을 **Promise/콜백**으로 처리

### 2) 순차(Sequential)
- A 작업이 끝난 뒤에 B 작업을 시작  
- “의존성(Dependency)”이 있을 때 필수

### 3) 병렬(Parallel)
- A, B를 **같은 시점에 시작**해 “기다림”을 겹치게 함  
- JS 단일 스레드라도 **I/O 기다림**은 겹칠 수 있어 병렬 처리 이득이 큼

### 4) 동시성(Concurrency) vs 병렬성(Parallelism)
- **동시성**: 여러 작업이 “겹쳐 진행되는 것처럼” 처리 (I/O에서 특히 중요)
- **병렬성**: 실제로 동시에 실행 (멀티코어, 워커, GPU 등)

> 프론트엔드에서 흔히 말하는 “병렬 처리”는 실제로는 **동시성(Concurrent I/O)** 인 경우가 많다.

---

## 2. 병렬 vs 순차: 결론부터 (결정 트리)

아래 질문에 “예”가 나오면 순차(또는 제한 병렬)로 가는 쪽이 안전하다.

### ✅ 순차가 유리한 경우
- (의존성) B가 A의 결과를 필요로 한다
- (순서 보장) 반드시 순서대로 처리되어야 한다 (로그/결제/재고/업로드 chunk)
- (레이트 리밋) API가 초당/분당 호출 제한이 빡세다
- (서버 부담) 동시 요청이 서버/브라우저에 부담(이미지 수백장, 대용량)
- (사용자 가치) “첫 화면”에 필요한 것만 먼저 보여주고 나머지는 뒤로 미뤄도 된다

### ✅ 병렬이 유리한 경우
- (독립성) 서로 의존하지 않는 작업들이다
- (대기 시간이 큼) 네트워크 I/O가 병목이다
- (UX) 여러 데이터가 있어야 한 화면이 완성된다 (대시보드)
- (총 시간 단축) 전체 완료 시간을 최소화해야 한다

---

## 3. 시간 관점으로 이해하기 (정확한 감각)

예) 각 요청이 500ms 걸린다고 가정

- 순차: A(500) → B(500) → C(500) = **1500ms**
- 병렬: A,B,C 동시에 시작 = **~500ms (+오버헤드)**

단, 다음이 있으면 병렬이 항상 이득이 아니다.
- 서버가 동시 요청을 **스로틀링**하거나,
- 브라우저 연결 제한(도메인별 동시 연결 제한),
- 디바이스/메모리/렌더링 부담

---

## 4. Promise 조합 API를 “아키텍처”로 쓰는 법

### 4.1 `Promise.all` — “모두 성공해야 다음으로”
- 하나라도 실패하면 전체 실패(즉시 reject)
- “한 화면을 완성하는 필수 데이터”에 적합

```js
const [user, feed, config] = await Promise.all([
  fetchUser(),
  fetchFeed(),
  fetchConfig(),
]);
```

**주의 포인트**
- 실패 하나로 전체가 날아가면 UX가 망가질 수 있다 → 중요한 화면은 `allSettled` 고려

---

### 4.2 `Promise.allSettled` — “부분 실패 허용”
- 성공/실패 결과를 모두 받는다
- “대시보드 위젯”, “추천 섹션”처럼 일부 실패해도 화면을 유지할 때

```js
const results = await Promise.allSettled([a(), b(), c()]);
const values = results.map(r => (r.status === "fulfilled" ? r.value : null));
```

---

### 4.3 `Promise.race` — “가장 빠른 응답 1개”
- 가장 먼저 settle되는 것(성공/실패)을 사용
- “미러 서버”, “CDN fallback”, “타임아웃”과 결합

```js
const res = await Promise.race([
  fetch(primary),
  fetch(backup),
]);
```

---

### 4.4 `Promise.any` — “성공하는 것 중 제일 빠른 1개”
- 실패는 무시하고 성공만 기다림(모두 실패 시 AggregateError)
- “여러 후보 중 하나만 성공해도 되는 리소스”에 적합

```js
const res = await Promise.any([fetch(a), fetch(b), fetch(c)]);
```

---

### 4.5 `finally` — “정리(로딩/락 해제)”
- 성공/실패와 무관하게 항상 실행
- 로딩 스피너, 버튼 disabled 해제, 리소스 정리

```js
setLoading(true);
try {
  await doWork();
} finally {
  setLoading(false);
}
```

---

## 5. 실무에서 가장 중요한 개념: “동시성 제한(Concurrency Limit)”

### 왜 필요한가?
- 무제한 병렬은:
  - 서버/네트워크/브라우저에 부담
  - 레이트 리밋에 걸림
  - 모바일에서 렌더링/메모리 폭발
  - 실패율 증가

> 결론: 대량 작업은 “병렬”이 아니라 **“제한된 병렬(풀)”** 이 정답인 경우가 많다.

---

## 6. 패턴 1 — 순차 처리 템플릿 (의존성/순서 보장)

```js
async function runSequential(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}
```

### 언제 쓰나
- 업로드 chunk
- 결제 단계(검증 → 승인 → 영수증)
- A 결과를 B가 사용하는 파이프라인

---

## 7. 패턴 2 — 제한 병렬 처리(Worker Pool) 템플릿 (필수)

아래는 “동시 실행 개수 N개”를 유지하는 풀 구현이다.

```js
async function runWithConcurrencyLimit(tasks, limit = 4) {
  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const current = nextIndex++;
      results[current] = await tasks[current]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);
  await Promise.all(workers);

  return results;
}
```

### 사용 예
```js
const tasks = urls.map((url) => () => fetch(url).then(r => r.json()));
const data = await runWithConcurrencyLimit(tasks, 6);
```

### 장점
- 전체 시간 단축 + 레이트리밋/부하 관리
- “대량 fetch”, “이미지 프리로드”, “배치 변환”에 매우 유효

---

## 8. 패턴 3 — 부분 실패 허용 + 제한 병렬 (실무형)

```js
async function runLimitAllSettled(tasks, limit = 4) {
  const settled = await runWithConcurrencyLimit(
    tasks.map((t) => async () => {
      try {
        return { ok: true, value: await t() };
      } catch (e) {
        return { ok: false, error: e };
      }
    }),
    limit
  );
  return settled;
}
```

---

## 9. 패턴 4 — 타임아웃 + AbortController (프론트엔드 필수)

### 9.1 타임아웃 래퍼
```js
function withTimeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${ms}ms`)), ms)
    ),
  ]);
}
```

### 9.2 fetch 취소 포함(추천)
```js
async function fetchWithTimeout(url, { timeoutMs = 8000, ...init } = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}
```

---

## 10. 패턴 5 — 재시도(Backoff) 설계 (서버 친화)

> “무조건 3번 재시도”가 아니라, **실패 종류에 따라** 재시도 여부를 결정해야 한다.

```js
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function retry(fn, { retries = 3, baseDelay = 300 } = {}) {
  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      const delay = baseDelay * 2 ** i; // exponential backoff
      await sleep(delay);
    }
  }

  throw lastError;
}
```

### 실무 포인트
- 4xx(클라이언트 오류)는 보통 재시도 의미가 없음
- 429(Too Many Requests)는 `Retry-After` 헤더를 우선 고려
- 5xx/네트워크 오류는 재시도 가치가 있음

---

## 11. UI/UX 관점 아키텍처 (프론트엔드의 본질)

### 11.1 “전체 완료” vs “점진적 렌더링”
- **전체 완료**: 대시보드 한 번에 완성 (all)
- **점진적 렌더링**: 중요한 것부터 보여주고 나머지는 늦게 (sequential + background)

#### 점진적 렌더링 예시
```js
// 1) 핵심 데이터 먼저
const critical = await fetchCritical();

// 2) 비필수는 백그라운드로 (단, limit로 제어)
runWithConcurrencyLimit(nonCriticalTasks, 3).then(updateUI);
```

### 11.2 “로딩 1개” vs “로딩 다중”
- 섹션별 스켈레톤을 두면 체감 UX가 좋아진다
- 에러도 섹션별로 분리 (한 섹션 실패가 전체를 망치지 않게)

---

## 12. 설계 체크리스트 (이걸로 결정하면 된다)

### A. 의존성
- 결과를 다음 작업이 쓰는가? → 순차
- 독립인가? → 병렬/제한 병렬

### B. 실패 허용
- 하나라도 실패하면 화면이 깨지는가? → all
- 일부 실패해도 화면 유지 가능한가? → allSettled + fallback

### C. 부하/비용
- 요청 수가 많나? → 제한 병렬
- API 레이트리밋 있나? → 제한 병렬 + backoff

### D. UX
- 첫 화면에 꼭 필요한가? → 우선 처리
- 나중에 로드해도 되는가? → lazy / background

### E. 취소/전환
- 탭 전환/페이지 이동 시 취소해야 하는가? → AbortController

---

## 13. “탭 UI(너의 섹션6)”에 그대로 적용하기 (실전 연결)

탭 전환 시 네가 겪는 핵심은:
- **패널 높이 점프 최소화**(레이아웃 안정)
- 비동기 데이터가 붙으면:
  - 이전 탭 요청이 늦게 도착해 **현재 탭을 덮어쓰기**(stale response)
  - 탭 전환 시 **취소** 필요

### 추천 구조
- 탭 클릭 시:
  1) 현재 요청 Abort
  2) 새 요청 시작
  3) 로딩 스켈레톤
  4) 완료 시 렌더
- 다수 리소스(이미지/데이터)라면:
  - 탭 내부에서 `Promise.allSettled`
  - “필수”만 all, “추천/부가”는 background

---

## 14. 실무 예제: “필수는 병렬, 부가는 제한 병렬”

```js
async function loadTabData(tabId) {
  // 필수 데이터는 병렬
  const [hero, copy] = await Promise.all([fetchHero(tabId), fetchCopy(tabId)]);

  // 부가 데이터는 제한 병렬
  const cards = await runWithConcurrencyLimit(
    getCardUrls(tabId).map((u) => () => fetch(u).then(r => r.json())),
    3
  );

  return { hero, copy, cards };
}
```

---

## 15. 결론 (핵심만 5줄)

- 병렬은 “빨라 보이지만” **무제한 병렬은 사고의 지름길**이다.
- 순차는 느려도 **의존성/순서/정합성**을 보장한다.
- 실무 정답은 대개 **제한 병렬(풀) + 부분 실패(allSettled) + 취소(Abort)** 조합이다.
- UX는 “전체 완료”가 아니라 **중요도 기반 점진적 렌더링**이 승률이 높다.
- 네 코드에서 다음 레벨은: **limit + timeout + abort + stale 방지**를 설계로 넣는 것.

---

## 부록 A. 빠른 레시피 표

| 상황 | 추천 |
|---|---|
| 필수 3개 데이터가 모두 있어야 화면 완성 | `Promise.all` |
| 일부 실패해도 화면 유지 | `Promise.allSettled` |
| 후보 여러 개 중 하나만 성공하면 됨 | `Promise.any` |
| 가장 빠른 응답만 필요(타임아웃 포함) | `Promise.race` |
| 대량 작업(20개+) | **concurrency limit** |
| 탭 전환/페이지 이동 | **AbortController** |
| 네트워크 불안정 | retry(backoff) + timeout |

---

## 부록 B. 용어 한 번 더

- 병렬(Parallel): “같은 시점에 시작”
- 순차(Sequential): “하나 끝나고 다음 시작”
- 동시성 제한: “동시에 몇 개까지만”

---

