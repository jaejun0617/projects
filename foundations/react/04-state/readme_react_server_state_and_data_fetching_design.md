# React Server State & Data Fetching Design (실무 아키텍처 기준)

> 이 문서는 React Query 사용법을 설명하지 않는다.  
> **왜 서버 상태(Server State)는 일반 상태와 분리되어야 하는지**를 설계 관점에서 다룬다.

---

## 🧭 이 챕터의 위치

- React State Management Design **이후**
- React Query / SWR 도입 **이전 필수 단계**

즉,
- 라이브러리 튜토리얼 ❌
- **서버 데이터의 본질을 이해하는 단계** ✅

---

## 🎯 목표

- 서버 상태의 특성을 명확히 정의한다
- Client State와 Server State를 구분한다
- 데이터 패칭 아키텍처를 설계할 수 있다

---

## 1. 서버 상태란 무엇인가

### 정의

> **클라이언트가 소유하지 않은 상태**

- 서버에 원본이 존재
- 언제든 변경될 수 있음
- 클라이언트는 "조회"만 가능

---

## 2. 서버 상태의 특징 (문제의 근원)

- 비동기
- 실패 가능
- 최신성 보장 불가
- 여러 컴포넌트에서 공유

👉 일반 state 관리 방식으로는 한계

---

## 3. 잘못된 접근 방식

```js
const [data, setData] = useState(null);

useEffect(() => {
  fetchData().then(setData);
}, []);
```

### 문제점

- 캐시 없음
- 중복 요청
- 최신성 판단 불가

👉 상태 관리가 아니라 **요청 관리**가 되어버림

---

## 4. Server State vs Client State

| 구분 | Client State | Server State |
|---|---|---|
| 소유권 | 클라이언트 | 서버 |
| 변경 주체 | 사용자 | 서버 |
| 최신성 | 보장 가능 | 불확실 |
| 캐시 | 선택 | 필수 |

---

## 5. 서버 상태의 핵심 과제

1. 캐싱
2. 중복 요청 제거
3. 로딩 / 에러 상태 관리
4. 재검증 (refetch)

👉 이것이 React Query가 해결하는 문제

---

## 6. 서버 상태를 직접 관리하면 생기는 일

- useEffect 남발
- loading / error 분기 폭발
- invalidate 로직 중복

👉 복잡도는 기하급수적으로 증가

---

## 7. 서버 상태 설계 기준

### 원칙

- 서버 데이터는 **상태가 아니라 리소스**
- 클라이언트는 캐시를 본다

```txt
Server → Cache → UI
```

---

## 8. React Query의 사고 모델 (개념)

- queryKey = 리소스 ID
- cache = 최신성 판단 도구
- refetch = 재검증

👉 라이브러리는 구현체일 뿐

---

## 9. 언제 Server State 라이브러리가 필요한가

- 동일 데이터 여러 곳 사용
- 데이터 최신성이 중요
- 캐시 전략 필요

👉 하나라도 해당되면 도입 고려

---

## 10. 실무 체크리스트

- [ ] 이 데이터는 서버 소유인가?
- [ ] 최신성이 중요한가?
- [ ] 여러 컴포넌트에서 사용되는가?
- [ ] 캐시 전략이 필요한가?

---

## 🎯 이 챕터를 마치면

- useEffect + fetch 패턴을 벗어난다
- 서버 데이터를 상태처럼 다루지 않는다
- React Query를 "왜" 쓰는지 설명할 수 있다

---

## 다음 챕터 예고

> **React App Architecture & Folder Structure Design**  
> 규모가 커질수록 무엇이 먼저 무너지는가

---

**이 문서는 Server State 설계 기준 문서다.**