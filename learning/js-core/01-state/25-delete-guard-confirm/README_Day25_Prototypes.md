# Day 25 — Theory: Prototypes  
**Mon, Jan 19, 2026**

**주제:** Prototypes  
**목표:** ES6 `class` 없이 **프로토타입 체인만으로 상속(동물 → 강아지)** 구현 (`Object.create()` 기반)

---

## 🎯 미션 목표

- `Object.create()`로 **부모(프로토타입) 연결**
- “상속”을 **복사(copy)**가 아니라 **탐색(lookup)**으로 이해
- `animalPrototype → dogPrototype → myDog` 체인 구성
- `class / extends` **금지**
- `__proto__`는 **관찰용(읽기)**만 사용 (수정 지양)

---

## ✅ 오늘 끝나면 얻는 감각

- **객체에서 메서드를 찾는 과정**을 눈으로 그릴 수 있음
- “왜 `myDog.makeSound()`가 되지?”를 **lookup 단계**로 설명 가능
- `hasOwnProperty`, `Object.getPrototypeOf`로 **상속/직접 소유** 구분 가능
- 나중에 `class`를 배워도 **결국 내부는 prototype 체인**이라는 걸 이해

---

## 🧠 핵심 개념 보강

### 1) 프로토타입이란?

자바스크립트의 객체는 내부적으로 `[[Prototype]]`(숨겨진 링크)을 하나 가질 수 있고,  
속성/메서드가 없으면 **부모(프로토타입)로 올라가며 찾는다.**

이 “올라가는 경로”가 **Prototype Chain**.

> 정리: **상속 = 부모 것을 복사하는 게 아니라, 없으면 부모에서 “찾아 쓰는 것”**

---

### 2) 속성/메서드 탐색 순서(lookup) — 진짜 중요

`myDog.makeSound()` 호출 시 엔진은 대략 이렇게 탐색:

1. `myDog` 자체에 `makeSound` 있나? (own property)
2. 없으면 `Object.getPrototypeOf(myDog)`(= `dogPrototype`)에 있나?
3. 없으면 `Object.getPrototypeOf(dogPrototype)`(= `animalPrototype`)에 있나?
4. 없으면 `Object.prototype`에 있나?
5. 끝까지 없으면 `undefined` → 호출하면 `TypeError`

---

### 3) `__proto__` vs `prototype` vs `[[Prototype]]` (헷갈림 종결)

| 용어 | 대상 | 의미 | 권장 |
|---|---|---|---|
| `[[Prototype]]` | 내부 슬롯 | 객체가 부모를 가리키는 **진짜 링크** | 직접 접근 불가 |
| `obj.__proto__` | 객체 | `[[Prototype]]`에 접근하는 **접근자(관찰용)** | 읽기 OK, 수정 지양 |
| `Func.prototype` | 함수(생성자) | `new Func()`로 만든 객체의 “부모 후보” | `new` 사용할 때 중요 |

✅ 오늘 미션은 **`new`를 안 쓰고**, `Object.create()`로 `[[Prototype]]`를 직접 지정한다.

---

### 4) `Object.create(proto)`가 하는 일

```js
const child = Object.create(parent);
```

- `child`라는 새 객체를 만들고,
- **child의 프로토타입(`[[Prototype]]`)을 parent로 설정**

즉, `child`는 `parent`를 **부모로 둔 객체**가 된다.

---

### 5) Shadowing(가리기) — “부모가 바뀌었는데 왜 난 그대로지?”의 원인

같은 이름의 속성이 **내 객체에 생기면**, 부모의 같은 속성은 **가려진다**.

```js
animalPrototype.name = "동물";
myDog.name = "바둑이";     // myDog가 name을 “직접 소유” → 부모 name은 가려짐
delete myDog.name;        // 내 name 삭제 → 다시 부모 name이 보임
```

---

### 6) “원본이 바뀌나?” — 공유(참조) vs 소유(own)

- **프로토타입의 메서드**는 모든 자식이 **공유**한다.
  - `animalPrototype.makeSound`를 바꾸면, 그걸 상속받는 모든 객체의 동작이 바뀔 수 있음
- 반면 **인스턴스에 직접 추가한 속성**은 그 인스턴스만 소유한다.

---

## 🏗️ 미션 요구사항

### ✅ 1) `animalPrototype` 만들기
- 공통 속성: `name`, `sound`
- 공통 메서드: `makeSound()`
  - 콘솔 출력: `"[이름] : [소리]"`

### ✅ 2) `dogPrototype` 만들기
- `dogPrototype`는 **animalPrototype을 상속**
- 강아지 고유 속성: `breed`
- 강아지 고유 메서드: `fetch()`
  - 콘솔 출력: `"[이름]가 공을 가져왔습니다!"`

### ✅ 3) `myDog` 만들기
- `myDog`는 **dogPrototype을 상속**
- `myDog.name`, `myDog.sound`, `myDog.breed`를 직접 할당

### ✅ 4) 검증
- `myDog.makeSound()` (부모에서 상속)
- `myDog.fetch()` (강아지 고유)
- 체인 검증:
  - `Object.getPrototypeOf(myDog) === dogPrototype`
  - `Object.getPrototypeOf(dogPrototype) === animalPrototype`

---

## 💻 구현 코드 (index.html 단일 파일)

> 그대로 저장해서 실행 → **Console(F12)** 확인

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>Day 25 - Prototypes (Animal -> Dog)</title>
  </head>
  <body>
    <h1>Day 25 - Prototypes</h1>
    <p>콘솔(F12)에서 결과를 확인하세요.</p>

    <script>
      // ===== 1) 부모 프로토타입: animalPrototype =====
      const animalPrototype = {
        name: "",
        sound: "",
        makeSound() {
          console.log(`${this.name} : ${this.sound}`);
        },
      };

      // ===== 2) 자식 프로토타입: dogPrototype (animalPrototype 상속) =====
      const dogPrototype = Object.create(animalPrototype);

      // dog 전용 상태/메서드
      dogPrototype.breed = "";
      dogPrototype.fetch = function () {
        console.log(`${this.name}가 공을 가져왔습니다!`);
      };

      // ===== 3) 인스턴스: myDog (dogPrototype 상속) =====
      const myDog = Object.create(dogPrototype);

      // 인스턴스 고유 값 할당(own properties)
      myDog.name = "바둑이";
      myDog.sound = "왈왈";
      myDog.breed = "진돗개";

      // ===== 4) 동작 확인 =====
      console.log("=== 메서드 호출 ===");
      myDog.makeSound(); // animalPrototype에서 찾음(상속)
      myDog.fetch();     // dogPrototype에서 찾음(상속)

      console.log("\n=== 프로토타입 체인 확인 ===");
      console.log("myDog:", myDog);

      console.log("\n=== 체인 검증 (권장) ===");
      console.log(Object.getPrototypeOf(myDog) === dogPrototype); // true
      console.log(Object.getPrototypeOf(dogPrototype) === animalPrototype); // true
      console.log(Object.getPrototypeOf(animalPrototype) === Object.prototype); // true

      // (관찰용) __proto__ 확인 — 수정은 지양
      console.log("\n=== 관찰용 __proto__ ===");
      console.log(myDog.__proto__ === dogPrototype); // true
    </script>
  </body>
</html>
```

---

## 🧪 추가 실험(이거 하면 “완전히” 잡힘)

### 1) Shadowing 확인

```js
animalPrototype.name = "동물";

console.log(myDog.name); // "바둑이" (myDog가 가림)
delete myDog.name;
console.log(myDog.name); // "동물" (이제 부모에서 찾아옴)
```

### 2) 공유 메서드 교체(프로토타입 공유의 파워/위험)

```js
animalPrototype.makeSound = function () {
  console.log(`[업데이트] ${this.name} -> ${this.sound}`);
};

myDog.makeSound(); // 업데이트된 버전으로 실행됨
```

### 3) “내 것(own)”인지 “상속(inherited)”인지 구분

```js
console.log(myDog.hasOwnProperty("fetch")); // false (상속)
console.log(myDog.hasOwnProperty("breed")); // true  (myDog에 직접 할당했으면 true)
```

> 참고: 최신 JS에선 `Object.hasOwn(obj, "key")`도 가능(더 깔끔).

### 4) for...in vs Object.keys 차이(상속 포함 여부)

```js
for (const key in myDog) console.log("for...in:", key); // 상속 포함(열거 가능한 것)
console.log("Object.keys:", Object.keys(myDog));       // own enumerable만
```

---

## ⚠️ 자주 터지는 함정 3개

1) **없는 메서드 호출**
```js
myDog.fly(); // undefined → fly() 호출이면 TypeError
```

2) **프로토타입에 “상태”를 넣는 실수**
- `animalPrototype.health = 100` 같은 “공유 상태”를 두면  
  의도치 않게 모두가 같은 값을 공유하는 구조가 될 수 있음(특히 객체/배열이면 치명적).
- 상태는 보통 **인스턴스에**, 메서드는 **프로토타입에**.

3) `__proto__`를 코드에서 직접 수정
- 가능은 하지만 디버깅/성능/예측성이 나빠질 수 있어 권장하지 않음  
- 체인 변경은 `Object.create`, `Object.setPrototypeOf`(필요 시)로 명시적으로

---

## ✅ 체크리스트

- [ ] `Object.create()`로 `dogPrototype`가 `animalPrototype`을 상속했다
- [ ] `Object.create()`로 `myDog`가 `dogPrototype`을 상속했다
- [ ] `makeSound()`는 `animalPrototype`에만 있는데 `myDog.makeSound()`가 실행된다
- [ ] `fetch()`는 `dogPrototype`에 있고 `myDog.fetch()`가 실행된다
- [ ] `Object.getPrototypeOf` 검증이 모두 `true`다
- [ ] `myDog.hasOwnProperty("fetch")`는 `false`다(상속)

---

## 🔥 핵심 정리(암기 4줄)

- 상속은 **복사**가 아니라 **체인 탐색(lookup)**이다.  
- `Object.create(proto)`는 “부모 링크”를 만든다.  
- 인스턴스에 같은 이름 속성을 만들면 **부모 속성은 가려진다(Shadowing)**.  
- 메서드는 프로토타입에 두면 **공유**되어 메모리/구조가 좋아진다.

---

## 📚 참고 자료 (MDN)

- `Object.create()`
- `Object.getPrototypeOf()`
- `Object.prototype`
- Inheritance and the prototype chain
