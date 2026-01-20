# Day 20 — Arrays & Data Collections (ULTIMATE Master Edition)
# 이론 + 문법 사전 + 설명서 + 실무 + 아키텍처 완전 통합판

> 기준: **MDN Web Docs 최신 정의 (2026 기준)**  
> 관점: **Data Collection / Iteration Model / Transformation Pipeline / Immutability**

---

## 📌 이 문서의 목적

이 문서는 JavaScript의 배열(Array)을  
❌ “리스트 자료형”  
❌ “반복문 대상”  

으로 보지 않는다.

> **배열은 순서를 가진 데이터 컬렉션이며,  
> map / filter / reduce는 이를 변환하는 파이프라인이다.**

이 관점이 잡히면:
- 반복문 사고 → 데이터 흐름 사고
- 로직 단순화
- React state / derived data 설계  
로 바로 연결된다.

---

## 1️⃣ Array의 MDN 공식 정의 (재해석)

### MDN 정의
> Arrays are list-like objects whose prototype has methods to perform traversal and mutation operations.

### 실무적 재정의
> 배열은  
> **순서를 가진 컬렉션 + 고수준 순회/변환 API를 가진 자료구조**다.

📌 핵심
- 배열 = 데이터 묶음
- 메서드 = 데이터 변환 규칙

---

## 2️⃣ 배열 생성 문법 사전 (Syntax Reference)

### 2-1. Array Literal (기본)
```js
const nums = [1, 2, 3];
```

---

### 2-2. Array Constructor
```js
const arr = new Array(3); // length 3
```

📌 실무 금지  
> 의미 혼동 위험 → literal 사용

---

### 2-3. Array.from
```js
Array.from("hello"); // ["h","e","l","l","o"]
```

- iterable → array
- NodeList 변환에 자주 사용

---

### 2-4. Spread
```js
const copy = [...nums];
```

- 얕은 복사
- 불변 패턴 필수

---

## 3️⃣ 배열과 메모리 (중요)

```js
const a = [1, 2];
const b = a;
b.push(3);
```

- Heap 저장
- 참조 공유
- mutable

📌 결론  
> 배열은 **항상 새로 만들어 변환**하라.

---

## 4️⃣ 반복문의 위치 (for vs Array Method)

### for / while
- 제어 흐름 중심
- break / continue 가능

### Array Method
- 의도 중심
- 불변 데이터 처리

📌 실무 기준  
> **데이터 변환 → 배열 메서드**  
> 제어 흐름 → 반복문

---

## 5️⃣ map (Transformation)

```js
const doubled = nums.map(n => n * 2);
```

### 설명서
- 길이 동일
- 값 변환 전용
- side-effect ❌

📌 map은 “변환기”다.

---

## 6️⃣ filter (Selection)

```js
const evens = nums.filter(n => n % 2 === 0);
```

### 설명서
- 조건 통과만 유지
- 길이 변함

📌 filter는 “거름망”이다.

---

## 7️⃣ reduce (Aggregation) — 핵심

```js
const sum = nums.reduce((acc, cur) => acc + cur, 0);
```

### MDN 정의 요약
> reduce executes a reducer function on each element, resulting in a single output value.

### 실무적 재정의
> reduce는  
> **배열을 어떤 형태든 축약할 수 있는 범용 도구**다.

---

### reduce 패턴 예시

#### 7-1. 합계
```js
nums.reduce((a, c) => a + c, 0);
```

#### 7-2. 객체로 변환
```js
users.reduce((acc, u) => {
  acc[u.id] = u;
  return acc;
}, {});
```

#### 7-3. 그룹화
```js
items.reduce((acc, item) => {
  const key = item.type;
  acc[key] = acc[key] || [];
  acc[key].push(item);
  return acc;
}, {});
```

📌 핵심  
> map + filter로 안 되면 reduce.

---

## 8️⃣ 실무 파이프라인 패턴

```js
const result = users
  .filter(u => u.active)
  .map(u => u.name);
```

- 선언적
- 읽기 쉬움
- 디버깅 용이

---

## 9️⃣ 배열 메서드 설명서 (Quick Manual)

| 메서드 | 역할 |
|---|---|
| map | 변환 |
| filter | 선택 |
| reduce | 축약 |
| find | 단일 탐색 |
| some | 조건 하나라도 |
| every | 전부 만족 |
| includes | 포함 여부 |
| sort | 정렬 (주의) |

📌 sort는 원본 변경 → 복사 후 사용

---

## 🔟 불변 패턴 (React 직결)

```js
setItems(prev => [...prev, newItem]);
```

- push ❌
- concat / spread ⭕

---

## 1️⃣1️⃣ 흔한 실수 TOP 7

1. map에서 return 누락
2. filter에서 Boolean 아닌 값 반환
3. reduce 초기값 생략
4. sort 원본 훼손
5. forEach로 값 생성
6. 깊은 복사 착각
7. 배열을 값처럼 취급

---

## 1️⃣2️⃣ 통과 기준 (면접/실무)

설명 가능해야 할 질문:
- map과 for의 차이
- reduce를 쓰는 기준
- 왜 불변 패턴이 필요한가?
- 배열 메서드 체인이 왜 안전한가?

---

## 🧠 최종 결론

> 배열은  
> 반복의 대상이 아니라  
> **변환의 출발점**이다.

이 문서를 이해하면  
데이터 처리 로직은 더 이상 복잡하지 않다.
