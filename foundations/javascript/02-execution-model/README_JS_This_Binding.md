# JavaScript this 바인딩 완전판

> 이 문서는 `this`를 **암기 대상이 아닌 실행 시점 판단 문제**로 이해하기 위한 기준 문서다.  
> call / apply / bind / arrow function을 하나의 사고 흐름으로 정리한다.

---

## 1. this를 한 문장으로 정의하면

**this는 함수가 호출될 때 결정되는 실행 컨텍스트의 주인 객체다.**

- 선언 시점 ❌
- 실행 시점 ⭕
- 스코프와 다름 ⭕

---

## 2. this 판단의 절대 규칙 (우선순위)

아래 순서로 판단하면 99% 맞는다.

1. `new` 로 호출되었는가?
2. `call / apply / bind` 로 명시적 바인딩 되었는가?
3. 객체의 메서드로 호출되었는가?
4. 그 외 → 기본 바인딩 (strict / non-strict)

---

## 3. 기본 바인딩 (Default Binding)

```js
function foo() {
  console.log(this);
}

foo(); 
```

- strict mode: `undefined`
- non-strict: `window` (브라우저)

❗ 함수 단독 호출 = 전역 또는 undefined

---

## 4. 암시적 바인딩 (Implicit Binding)

```js
const user = {
  name: 'Alex',
  say() {
    console.log(this.name);
  }
};

user.say(); // Alex
```

- `.` 앞의 객체가 this

⚠️ 주의

```js
const fn = user.say;
fn(); // undefined
```

➡️ **참조만 전달되면 this는 끊긴다**

---

## 5. 명시적 바인딩 (call / apply / bind)

### call

```js
foo.call(obj, a, b);
```

### apply

```js
foo.apply(obj, [a, b]);
```

- 차이: 인자 전달 방식만 다름

### bind

```js
const bound = foo.bind(obj);
bound();
```

- this를 고정한 **새 함수 반환**
- 즉시 실행 ❌

---

## 6. new 바인딩

```js
function User(name) {
  this.name = name;
}

const u = new User('Alex');
```

new 동작 순서:
1. 빈 객체 생성
2. this = 그 객체
3. prototype 연결
4. return this

➡️ new는 최상위 우선순위

---

## 7. arrow function의 this

**arrow function은 this를 바인딩하지 않는다.**

```js
const obj = {
  name: 'Alex',
  say: () => {
    console.log(this.name);
  }
};

obj.say(); // undefined
```

- 자신의 this ❌
- 상위 스코프 this를 그대로 사용

### 언제 써야 하나?

- 콜백
- 내부 함수
- 이벤트 핸들러 내부

```js
function Timer() {
  this.count = 0;

  setInterval(() => {
    this.count++;
  }, 1000);
}
```

---

## 8. call/apply vs arrow 차이 핵심

| 구분 | call/apply | arrow |
|---|---|---|
| this 결정 | 실행 시 | 선언 시 |
| 재사용 | 가능 | 불가능 |
| 이벤트 핸들러 | 부적합 | 적합 |
| 메서드 | 적합 | ❌ |

---

## 9. this + 클로저 결합 사고

```js
function Counter() {
  this.count = 0;

  return () => {
    this.count++;
    return this.count;
  };
}
```

- arrow가 외부 this를 캡처
- 클로저 + this 동시 사용

➡️ React Hooks 이해의 핵심

---

## 10. 실무 기준 요약

- 메서드 → 일반 함수
- 콜백 → arrow
- this 고정 필요 → bind
- 생성자 → new

> this는 외우는 게 아니라 **호출 형태를 보는 문제다**

---

## 다음 챕터

1. 이벤트 루프 & 비동기
2. Promise / async-await
3. React에서 this가 사라진 이유

