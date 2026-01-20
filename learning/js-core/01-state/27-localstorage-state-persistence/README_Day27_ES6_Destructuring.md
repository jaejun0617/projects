# Day 27 — Deep Dive: ES6+ Features (Destructuring / Defaults / Rest)
**Wed, Jan 21, 2026**

구조 분해 할당을 적극 활용해 **복잡한 중첩 객체에서 필요한 값만 안전하게 추출**하고,  
UI/상태/props에서 바로 쓰기 좋은 형태로 **정규화(normalize)된 결과 객체**를 반환한다.

---

## 🗓 일정
- Wed, Jan 21, 2026

---

## 🎯 미션 목표
- **Destructuring(구조 분해 할당)** + **Default Args(기본값)** + **Rest Parameter(나머지 매개변수)** 활용
- 중첩 객체에서 필요한 값만 **안전하게** 꺼내기 (누락/undefined 방어)
- 결과를 **일관된 형태**로 만들어 반환 (실무에서 “API 응답 가공” 패턴)

---

## ✅ 요구사항 요약
- 함수명: `processUserData`
- 입력: `userData` (중첩 구조 / 일부 속성 누락 가능)
- 출력: 아래 키를 갖는 새 객체

| key | source | default |
|---|---|---|
| `userId` | `userData.id` | (필수) |
| `fullName` | `personalInfo.firstName + " " + personalInfo.lastName` | (필수) |
| `userEmail` | `personalInfo.email` | `"정보 없음"` |
| `userAge` | `personalInfo.age` | `0` |
| `userCity` | `address.city` | `"알 수 없음"` |
| `userTheme` | `preferences.theme` | `"light"` |

---

## 🧠 핵심 이론 (실무 기준 보강)

### 1) 구조 분해 할당(Destructuring)은 “꺼내기 + 이름짓기 + 기본값”을 한 번에 한다
```js
const user = { id: "u1", personalInfo: { firstName: "김", lastName: "철수" } };

// 1) 별칭(alias): id를 userId로
// 2) 중첩 객체: personalInfo 안에서 firstName/lastName
const { id: userId, personalInfo: { firstName, lastName } } = user;
```

**하지만** `personalInfo`가 없으면 즉시 에러가 난다.
```js
// TypeError: Cannot destructure property 'firstName' of 'undefined'
const { personalInfo: { firstName } } = {}; 
```

✅ 해결: **중첩 객체에는 기본값 {}를 붙여서 방어**
```js
const { personalInfo: info = {} } = userData;
const { firstName, lastName } = info;
```

---

### 2) 기본값(Default)은 “undefined일 때만” 동작한다
```js
const { age = 0 } = { age: undefined }; // 0 (기본값 적용)
const { age = 0 } = { age: null };      // null (기본값 적용 ❌)
const { age = 0 } = { age: 0 };         // 0 (그대로 유지)
```

- 즉, 서버가 `null`을 보내면 기본값이 적용되지 않는다.
- 실무에선 `??`(Nullish coalescing)로 `null/undefined`를 함께 처리하는 경우가 많다.

```js
const userAge = (info.age ?? 0); // null/undefined → 0
```

> 이번 미션은 요구사항이 “default value” 형태라 기본값을 쓰되,  
> 확장 섹션에서 `??` 패턴까지 같이 잡아두면 좋다.

---

### 3) Rest Parameter는 “나머지를 모아서 보관”한다
- 함수 파라미터에서 남는 인자를 배열로 받는다.
- 마지막 파라미터에만 올 수 있다.

```js
function pick(first, ...rest) {
  return { first, rest };
}
pick(1, 2, 3); // { first: 1, rest: [2,3] }
```

✅ 객체 구조분해에서도 rest를 쓸 수 있다.
```js
const { id, personalInfo, ...extras } = userData;
```

- `extras`는 “우리가 아직 처리하지 않은 나머지 필드” 모음
- 디버깅/로깅/추가 파이프라인에서 유용

---

### 4) 정규화(Normalize)는 “앱이 쓰기 쉽게 형태를 고정”하는 작업
- API 응답은 종종 **형태가 들쭉날쭉**하다.
- UI는 “항상 같은 키/타입”이 오는 걸 좋아한다.
- 그래서 **입력 데이터 → 앱 표준 형태**로 변환하는 함수가 필수다.

---

## 🧪 예시 데이터
```js
const complexUserData = {
  id: "user123",
  personalInfo: {
    firstName: "김",
    lastName: "철수",
    age: 28,
    email: "chulsoo@example.com",
  },
  address: { city: "서울", zipCode: "03184" },
  preferences: { theme: "dark", notifications: true },
  membership: "gold",
};

const simpleUserData = {
  id: "user456",
  personalInfo: { firstName: "박", lastName: "영희" },
};
```

---

## ✅ 구현 코드 (요구사항 충족 + 안정성 보강)

### 핵심 전략
- 함수 인자 자체가 없을 수 있으니 `userData = {}`로 1차 방어
- 중첩 객체는 `= {}`로 2차 방어
- 필수값(`id`, `firstName`, `lastName`) 누락 시 **명확한 에러**로 빨리 터뜨린다(디버깅 비용 ↓)
- Rest로 남는 필드도 보관 가능(옵션)

```js
function processUserData(userData = {}) {
  // 1) 1차 구조분해 + 중첩 객체 방어
  const {
    id: userId,
    personalInfo: info = {},
    address: addr = {},
    preferences: prefs = {},
    ...restFields // ✅ 나머지(선택): 디버깅/추가 처리용
  } = userData;

  // 2) 2차 구조분해 + 기본값
  const {
    firstName,
    lastName,
    email: userEmail = "정보 없음",
    age: userAge = 0,
  } = info;

  const { city: userCity = "알 수 없음" } = addr;
  const { theme: userTheme = "light" } = prefs;

  // 3) 필수값 검증(실무 기본)
  if (!userId) throw new Error("processUserData: userData.id(userId)는 필수입니다.");
  if (!firstName || !lastName) throw new Error("processUserData: personalInfo.firstName/lastName은 필수입니다.");

  // 4) 결과 정규화
  return {
    userId,
    fullName: `${firstName} ${lastName}`,
    userEmail,
    userAge,
    userCity,
    userTheme,
    // 필요하면 restFields도 함께 반환하거나, 로그에만 사용
    // restFields,
  };
}
```

---

## 🧾 실행 예시
```js
console.log(processUserData(complexUserData));
/*
{
  userId: "user123",
  fullName: "김 철수",
  userEmail: "chulsoo@example.com",
  userAge: 28,
  userCity: "서울",
  userTheme: "dark"
}
*/

console.log(processUserData(simpleUserData));
/*
{
  userId: "user456",
  fullName: "박 영희",
  userEmail: "정보 없음",
  userAge: 0,
  userCity: "알 수 없음",
  userTheme: "light"
}
*/
```

---

## 🧪 테스트 케이스 (실무식 “망가진 입력”)
```js
// 1) userData 자체가 없을 때
try { processUserData(); } catch (e) { console.log(e.message); }

// 2) personalInfo 누락
try { processUserData({ id: "u1" }); } catch (e) { console.log(e.message); }

// 3) address/preferences 없어도 OK
console.log(processUserData({ id: "u2", personalInfo: { firstName: "최", lastName: "지훈" } }));
```

---

## 🔥 체크리스트
- [ ] `personalInfo`, `address`, `preferences`가 없어도 **에러 없이** 동작(필수값 제외)
- [ ] `email/age/city/theme` 기본값이 요구사항대로 적용
- [ ] 반환 객체 키 이름이 요구사항과 동일
- [ ] 원본 객체(`userData`) 수정 없음(불변성)

---

## 🚀 한 단계 업그레이드 (선택)

### 1) null까지 안전하게: `??`로 기본값 강화
서버가 `null`을 내려보내는 경우가 많으면 아래가 더 안전하다.

```js
const userEmail = (info.email ?? "정보 없음");
const userAge = (info.age ?? 0);
const userCity = (addr.city ?? "알 수 없음");
const userTheme = (prefs.theme ?? "light");
```

### 2) Optional chaining(?.) 조합 (다음 단계에서 최강)
```js
const email = userData.personalInfo?.email ?? "정보 없음";
```

---

## 💡 실무에서 어디에 쓰나
- API 응답을 “컴포넌트 props 형태”로 정리
- 상태 초기화/리듀서 입력 정규화
- 백엔드 스펙 변경(필드 누락)에도 앱이 덜 깨지게 방어

---

## 📚 참고 키워드 (MDN)
- Destructuring assignment
- Default parameters
- Rest parameters
- Spread syntax
- Optional chaining (?.)
- Nullish coalescing (??)
