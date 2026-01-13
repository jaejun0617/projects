# Promise 심화 (all / race / allSettled / finally) — 완전판

## 1. Promise 기본 복습 (전제)
Promise는 **미래에 완료될 작업의 결과를 나타내는 객체**다.

상태:
- pending
- fulfilled
- rejected

핵심 규칙:
- Promise는 **한 번만 상태가 결정**
- resolve / reject 이후 상태 변경 불가

---

## 2. Promise.all
### 개념
- **모두 성공해야 성공**
- 하나라도 reject → 즉시 reject

### 사용 목적
- 병렬 요청 결과를 한 번에 사용
- 모든 데이터가 있어야 화면 렌더링 가능한 경우

```js
Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
]).then(([user, posts, comments]) => {
  console.log(user, posts, comments);
});
```

### 주의점
- 하나 실패하면 나머지 결과는 버려짐
- 실패 허용이 필요한 경우에는 부적합

---

## 3. Promise.race
### 개념
- **가장 먼저 끝난 Promise 하나만 채택**
- 성공/실패 상관없음

### 사용 목적
- 타임아웃 처리
- 여러 서버 중 가장 빠른 응답 선택

```js
Promise.race([
  fetchData(),
  timeout(3000)
]).then(result => {
  console.log(result);
});
```

---

## 4. Promise.allSettled
### 개념
- **모든 Promise의 결과를 끝까지 수집**
- 성공/실패 여부 상관없음

### 반환 구조
```js
[
  { status: "fulfilled", value: ... },
  { status: "rejected", reason: ... }
]
```

### 사용 목적
- 일부 실패를 허용하는 대시보드
- 로그/통계 수집

```js
Promise.allSettled(tasks).then(results => {
  results.forEach(r => {
    if (r.status === "fulfilled") {
      console.log(r.value);
    }
  });
});
```

---

## 5. Promise.finally
### 개념
- 성공/실패와 관계없이 **항상 실행**
- 값 변형 불가

### 사용 목적
- 로딩 상태 해제
- 공통 정리(clean-up)

```js
fetchData()
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => {
    setLoading(false);
  });
```

---

## 6. 실무 선택 기준 요약

| 상황 | 선택 |
|----|----|
| 전부 성공해야 함 | Promise.all |
| 가장 빠른 하나 | Promise.race |
| 결과 전부 필요 | Promise.allSettled |
| 후처리 | Promise.finally |

---

## 7. async / await 조합 패턴

```js
try {
  const results = await Promise.all(tasks);
  console.log(results);
} catch (e) {
  console.error(e);
} finally {
  console.log("cleanup");
}
```

---

## 8. 흔한 실수
- all에 실패 허용 로직 넣기 ❌
- race를 병렬 처리로 착각 ❌
- finally에서 데이터 처리 ❌

---

## 9. 다음 연결 개념
- async / await 에러 처리 전략
- 병렬 vs 순차 처리 설계
- React useEffect + Promise 패턴
