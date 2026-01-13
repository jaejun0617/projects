# README — Closure (클로저) 완전판
> 목표: “클로저 = 함수 + 렉시컬 환경”을 **정확한 메커니즘**으로 이해하고, 실무/면접에서 **설명 가능한 수준**으로 만든다.

---

## 0. 클로저 한 문장 정의
클로저(Closure)는 **함수가 선언될 때의 렉시컬 스코프(외부 변수 환경)를 기억**하고,  
함수가 **나중에 실행되더라도 그 환경에 접근**할 수 있게 해주는 **메커니즘**이다.

- “함수가 만들어질 때(선언 시점)” **어디에 있었는지**를 기억한다.
- “실행될 때” 그 기억을 통해 **외부 스코프 변수에 접근**한다.

핵심: **실행 시점이 아니라, 선언 시점의 스코프 체인(렉시컬 환경)을 캡처한다.**

---

## 1. 클로저가 생성되는 조건 (3단계 공식)
클로저는 아래 3가지가 동시에 만족되면 실무에서 “클로저가 생겼다”고 말한다.

1) **함수 내부에 또 다른 함수가 있다(중첩 함수)**  
2) 내부 함수가 **외부 함수 스코프의 변수를 참조**한다 (free variable)  
3) 내부 함수가 **외부 함수 실행이 끝난 뒤에도 살아남는다** (반환/콜백/이벤트 등)

> 1~2만 있으면 “가능성”이고, 3까지 만족해야 **실제로 메모리 유지가 발생**한다.

---

## 2. 렉시컬 스코프 & 실행 컨텍스트 관점
### 2.1 렉시컬 스코프
JS는 **코드가 작성된 위치(lexical)**로 스코프가 결정된다.  
즉, 함수가 어디서 호출됐는지(call site)가 아니라 **어디서 선언됐는지**가 중요하다.

### 2.2 실행 컨텍스트
함수가 실행되면 실행 컨텍스트(Execution Context)가 만들어지고,  
그 안에 **Lexical Environment(환경 레코드 + 외부 참조)**가 생성된다.

### 2.3 “기억”이 유지되는 이유 (GC 관점)
외부 함수 실행이 끝나면 보통 지역 변수는 GC 대상이 된다.  
하지만 내부 함수가 그 변수를 참조하고 있고 내부 함수가 살아 있으면,  
해당 렉시컬 환경은 **참조가 남아있기 때문에 GC 되지 않는다.**

---

## 3. 가장 기본 예제 (정석)
```js
function outer() {
  const secret = "🍀";
  return function inner() {
    return secret;
  };
}

const fn = outer();
console.log(fn()); // 🍀
```
- `inner`는 `secret`을 참조한다.
- `outer` 실행은 끝났지만 `fn`이 `inner`를 붙잡고 있어 `secret`이 살아 있다.

---

## 4. “클로저는 변수 복사”가 아니다
클로저는 값을 복사해두는 게 아니라 **같은 렉시컬 환경에 대한 참조**를 유지한다.

```js
function make() {
  let count = 0;
  return () => ++count;
}

const inc = make();
console.log(inc()); // 1
console.log(inc()); // 2
```
- `count`는 복사본이 아니라 **같은 스코프의 변수**다.
- 호출할 때마다 같은 `count`를 계속 업데이트한다.

---

## 5. 실무에서 왜 쓰나 (목적 4가지)
### 5.1 상태 은닉 (Encapsulation)
```js
function createCounter() {
  let count = 0;
  return {
    inc() { count++; },
    get() { return count; },
  };
}
const c = createCounter();
c.inc();
console.log(c.get()); // 1
```
- 외부에서 `count` 직접 접근 불가 → **데이터 보호 + API 제공**

### 5.2 부분 적용 / 커링 (Currying)
```js
const add = a => b => a + b;
const add10 = add(10);
console.log(add10(3)); // 13
```
- `a`를 기억 → 나중에 `b`만 받아서 계산

### 5.3 콜백에서 “문맥 유지”
```js
function createLogger(prefix) {
  return (msg) => console.log(`[${prefix}] ${msg}`);
}
const apiLog = createLogger("API");
apiLog("success");
```

### 5.4 모듈 패턴
```js
const store = (() => {
  let state = { count: 0 };
  return {
    getState: () => state,
    setCount: (n) => { state.count = n; }
  };
})();
```
- IIFE + 클로저로 “모듈 내부 상태”를 숨김

---

## 6. 가장 많이 나오는 함정: 반복문 + 클로저
### 6.1 var 사용 시 문제
```js
var funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(() => i);
}
console.log(funcs[0]()); // 3
console.log(funcs[1]()); // 3
console.log(funcs[2]()); // 3
```
- `var`는 함수 스코프 → 반복문이 끝난 뒤 i=3 하나를 모두 공유

### 6.2 let로 해결
```js
let funcs = [];
for (let i = 0; i < 3; i++) {
  funcs.push(() => i);
}
console.log(funcs[0]()); // 0
console.log(funcs[1]()); // 1
console.log(funcs[2]()); // 2
```
- `let`은 블록 스코프 → 루프마다 i가 새로 생성

### 6.3 즉시 실행 함수(IIFE)로도 해결(구식)
```js
var funcs = [];
for (var i = 0; i < 3; i++) {
  (function(iCopy) {
    funcs.push(() => iCopy);
  })(i);
}
```

---

## 7. 클로저와 비동기 (setTimeout)
```js
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), i * 100);
}
```
- `let i`가 각 iteration마다 캡처되므로 원하는 출력

> 비동기에서 “나중에 실행”되기 때문에 클로저가 더 자주 체감된다.

---

## 8. 메모리 누수 위험과 회피
클로저 자체가 누수가 아니라, **불필요한 참조를 오래 유지하면** 문제가 된다.

### 8.1 문제 패턴
```js
function heavy() {
  const big = new Array(1e6).fill("x"); // 큰 데이터
  return () => big.length;
}
const fn = heavy(); // big이 살아남음
```

### 8.2 회피 기준
- 큰 데이터를 캡처하지 말고 **필요한 최소 값만** 캡처
- 이벤트 리스너/타이머는 **해제(removeEventListener/clearTimeout)**
- 사용이 끝난 참조는 `null`로 끊기

---

## 9. 면접에서 통과하는 설명 템플릿
클로저를 설명할 때는 아래 순서로 말하면 실무 이해로 보인다.

1) JS는 렉시컬 스코프다 (선언 위치 기준)  
2) 함수는 생성 시점에 외부 렉시컬 환경 참조를 가진다  
3) 내부 함수가 외부 변수를 참조하고 살아남으면 그 환경이 GC 되지 않는다  
4) 그래서 상태 은닉/부분 적용/콜백 문맥 유지에 활용한다  
5) 단, 큰 데이터 캡처/리스너 방치하면 메모리 문제가 생길 수 있다

---

## 10. React에서의 클로저(예고: Stale Closure)
React Hook에서 “예전 값”을 잡는 문제가 자주 발생한다.

```js
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // stale 가능
  }, 1000);
  return () => clearInterval(id);
}, []);
```
- 의존성 배열이 비어 있으면 effect는 처음 한 번만 실행
- interval 콜백은 **처음 렌더의 count를 캡처**할 수 있다

해결 방향(키워드):
- 의존성 배열 정확히 관리
- functional update: `setCount(c => c + 1)`
- ref 사용

---

## 11. 최소 실전 체크리스트
- [ ] “선언 시점 스코프 캡처”를 말로 설명 가능  
- [ ] var/let 반복문 함정 설명 가능  
- [ ] 상태 은닉/커링 예제 1개씩 구현 가능  
- [ ] 이벤트/타이머 해제 필요성을 GC 관점에서 설명 가능  

---

## 12. 미니 과제 (추천)
1) `createCounter()` 만들기 (inc/dec/get)  
2) `once(fn)` 만들기: 함수가 한 번만 실행되게 하기  
3) `debounce(fn, ms)` 만들기 (클로저로 timer 유지)  

---

끝.
