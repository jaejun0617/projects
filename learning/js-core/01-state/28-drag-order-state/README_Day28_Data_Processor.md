# Day 28 — Week 2 Project: Data Processor  
**Thu, Jan 22, 2026**

가짜 유저 데이터 1000개를 로딩해 **성별/나이별 필터링 + 통계**를 내는 “대시보드 로직”을 만든다.  
UI(DOM)는 없고 **콘솔 출력만**으로 검증한다.

---

## 🎯 목표

- **Fake User 1000개 생성**
- 원본 `allUsers`는 **절대 수정하지 않고(불변성)** 조건별 필터 배열을 만든다
- 필터 결과 + 전체 기준 통계를 계산한다 (평균/카운트)
- 함수 분리로 **예측 가능한 데이터 흐름**을 만든다 (대시보드 로직 스타일)

---

## 🧠 핵심 개념 / 핵심 이론 (보강)

### 1) 데이터 파이프라인 사고 (Dashboard Pipeline)
대시보드 로직은 보통 아래 흐름이 반복된다.

1. **Load**: 데이터를 로딩/생성한다  
2. **Filter**: 기준에 맞는 하위 집합을 만든다  
3. **Aggregate**: 합계/평균/카운트 등 통계를 만든다  
4. **Report**: 숫자를 보기 좋게 출력한다

> 핵심은 “데이터 → 가공 → 결과”가 **단방향**으로 흐르게 만드는 것.

---

### 2) FP Basics (함수형 사고의 최소 단위)
완전한 FP가 목표가 아니라, 실무에서 중요한 **3가지 습관**이 목표다.

- **입력 → 출력**이 명확한 함수로 쪼갠다  
- “한 함수는 한 가지 일만” 한다 (SRP: Single Responsibility)
- 가능하면 같은 입력이면 같은 출력이 나오게 만든다 (테스트 쉬움)

예)  
- `generateUserData(id)` : id를 받아 유저 1명을 만든다  
- `filterKoreanMale(users)` : 조건에 맞는 유저 배열을 반환한다  
- `calcAverageAge(users)` : 평균 나이를 반환한다

---

### 3) Immutability (불변성) — 이 프로젝트의 1순위
**불변성 = 원본 데이터를 직접 수정하지 않는다.**

- 원본: `allUsers`  
- 결과: `koreanMaleUsers`, `adultFemaleUsers`, 통계 값들

✅ 불변이 왜 중요하냐?
- 로직이 예측 가능해짐 (어디서 데이터가 바뀌는지 추적할 필요 없음)
- 디버깅이 쉬움 (원인 범위가 좁아짐)
- React 상태 관리의 기본 원리(새 배열/새 객체 생성)와 직결

❌ 위험한 원본 변경 메서드 예시
- `sort()` (원본 배열을 정렬해버림)
- `splice()` (원본에서 잘라냄)
- `pop()/shift()` (원본에서 제거)

---

### 4) “랜덤 데이터”를 다루는 실무 감각
이번 프로젝트는 “가짜 데이터”라 랜덤이 들어간다. 랜덤은 테스트를 어렵게 만든다.

그래서 최소한 아래 2가지는 지킨다:

- 랜덤은 **데이터 생성 단계에서만** 사용 (가공/통계 단계에 섞지 않기)
- 평균 계산은 **0명일 때 방어** (NaN 방지)

---

### 5) 평균/카운트 계산 패턴 (정석)
- 평균: `sum / count`  
- 합계: `sum += value`  
- 카운트: `count++`  
- 0명 방어: `count === 0 ? "N/A" : (sum / count)`

---

## ✅ 요구사항 체크리스트

### 데이터 생성
- [ ] `generateUserData(id)` 함수 작성
- [ ] `allUsers` 1000개 생성

유저 스펙:

| key | type | rule |
|---|---|---|
| `id` | number | 1~1000 |
| `name` | string | `"User " + id` |
| `gender` | string | `"male"` or `"female"` 랜덤 |
| `age` | number | 18~60 랜덤 정수 |
| `country` | string | `"Korea" \| "USA" \| "Japan"` 랜덤 |

### 필터링 (불변 유지)
- [ ] `koreanMaleUsers`: `country === "Korea" && gender === "male"`
- [ ] `adultFemaleUsers`: `gender === "female" && 25 <= age < 40`

### 통계
- [ ] `koreanMaleUsers` 평균 나이 (소수점 1자리)
- [ ] `adultFemaleUsers` 총 인원수
- [ ] `allUsers` 전체 성별 인원수 (`male`, `female`)

### 출력
- [ ] `allUsers.length`, `koreanMaleUsers.length`, `adultFemaleUsers.length`
- [ ] 평균/카운트 결과를 보기 좋게 출력

---

## 🧩 추천 설계 (함수 분리 버전)

> “대시보드 로직”답게 함수 단위로 쪼개는 버전.  
> (Week 2 수준: `for + if` 기반)

- `randomInt(min, max)`
- `randomPick(arr)`
- `generateUserData(id)`
- `loadUsers(count)`
- `filterKoreanMale(users)`
- `filterAdultFemale(users)`
- `calcAverageAge(users)`
- `countGender(users)`
- `report(...)`

---

## 💻 구현 코드 (index.html 안 `<script>`에 그대로)

> ✅ 요구사항 충족 + 방어 로직(0명 평균) + 함수 분리까지 포함한 “정답급” 예시

```js
// =========================
// 1) Random Utilities
// =========================
function randomInt(min, max) {
  // min ~ max (둘 다 포함)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// =========================
// 2) Data Generator (1 user)
// =========================
function generateUserData(id) {
  const name = "User " + id;
  const gender = Math.random() < 0.5 ? "male" : "female";
  const age = randomInt(18, 60);
  const country = randomPick(["Korea", "USA", "Japan"]);

  return { id, name, gender, age, country };
}

// =========================
// 3) Load Users (1000)
// =========================
function loadUsers(count) {
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push(generateUserData(i));
  }
  return users; // ✅ 새 배열 반환
}

// =========================
// 4) Filters (immutability)
// =========================
function filterKoreanMale(users) {
  const result = [];
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    if (u.country === "Korea" && u.gender === "male") result.push(u);
  }
  return result; // ✅ 새 배열 반환
}

function filterAdultFemale(users) {
  const result = [];
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    if (u.gender === "female" && u.age >= 25 && u.age < 40) result.push(u);
  }
  return result; // ✅ 새 배열 반환
}

// =========================
// 5) Stats
// =========================
function calcAverageAge(users) {
  if (users.length === 0) return "N/A";
  let sum = 0;
  for (let i = 0; i < users.length; i++) sum += users[i].age;
  return (sum / users.length).toFixed(1);
}

function countGender(users) {
  let male = 0;
  let female = 0;

  for (let i = 0; i < users.length; i++) {
    if (users[i].gender === "male") male++;
    else if (users[i].gender === "female") female++;
  }

  return { male, female };
}

// =========================
// 6) Report
// =========================
function report({ allUsers, koreanMaleUsers, adultFemaleUsers }) {
  const koreanMaleAvgAge = calcAverageAge(koreanMaleUsers);
  const adultFemaleCount = adultFemaleUsers.length;
  const genderStats = countGender(allUsers);

  console.log("=== Day 28 | Data Processor 결과 ===");
  console.log("전체 유저 수:", allUsers.length);

  console.log("한국 남성 유저 수:", koreanMaleUsers.length);
  console.log("한국 남성 유저 평균 나이:", koreanMaleAvgAge);

  console.log("25세 이상 40세 미만 여성 유저 수:", adultFemaleUsers.length);
  console.log("adultFemaleUsers 총 인원수:", adultFemaleCount);

  console.log("전체 남성 유저 수:", genderStats.male);
  console.log("전체 여성 유저 수:", genderStats.female);

  console.log("====================================");

  // 샘플 확인(선택)
  console.log("샘플(allUsers[0]):", allUsers[0]);
  console.log("샘플(koreanMaleUsers[0]):", koreanMaleUsers[0]);
  console.log("샘플(adultFemaleUsers[0]):", adultFemaleUsers[0]);
}

// =========================
// 7) Run
// =========================
const allUsers = loadUsers(1000);
const koreanMaleUsers = filterKoreanMale(allUsers);
const adultFemaleUsers = filterAdultFemale(allUsers);

report({ allUsers, koreanMaleUsers, adultFemaleUsers });
```

---

## 🧪 검증 포인트 (실무식 체크)

### 1) 불변성 체크
- 필터/통계 이후에도 `allUsers.length === 1000` 유지되는지
- `allUsers`를 정렬/삭제/변형하는 코드가 없는지

### 2) 평균 계산 방어
- 결과가 `NaN`으로 나오면 0명 케이스가 처리 안 된 것  
  → `users.length === 0` 방어 추가

### 3) 범위 조건 정확도
- `25 <= age < 40` 은 JS에서 한 번에 못 씀  
  ✅ `age >= 25 && age < 40` 로 써야 한다

---

## 🔥 오늘의 핵심 (한 줄 요약)
> **원본(allUsers)은 손대지 말고, 필터/통계를 “새 결과”로만 만든다.**

---

## 🚀 선택 업그레이드: for 없이 FP 파이프라인 (Day 26 연계)

> 실무에서는 API 응답을 이런 식으로 처리하는 일이 정말 많다.

```js
const koreanMaleUsers2 = allUsers.filter(
  (u) => u.country === "Korea" && u.gender === "male"
);

const adultFemaleUsers2 = allUsers.filter(
  (u) => u.gender === "female" && u.age >= 25 && u.age < 40
);

const koreanMaleAvgAge2 =
  koreanMaleUsers2.length === 0
    ? "N/A"
    : (
        koreanMaleUsers2.reduce((sum, u) => sum + u.age, 0) /
        koreanMaleUsers2.length
      ).toFixed(1);

const genderStats2 = allUsers.reduce(
  (acc, u) => {
    if (u.gender === "male") acc.male++;
    else if (u.gender === "female") acc.female++;
    return acc;
  },
  { male: 0, female: 0 }
);

console.log("FP 평균 나이:", koreanMaleAvgAge2);
console.log("FP 성별 통계:", genderStats2);
```

---

## 📚 참고 키워드 (MDN)
- `Math.random()`, `Math.floor()`
- Array `push`, `length`
- (선택) `filter`, `reduce`
- “immutability”, “data pipeline”, “aggregation”
