# JavaScript 이벤트 루프 & 비동기 (완전판)

> 이 문서는 비동기를 **문법이 아니라 실행 모델**로 이해하기 위한 기준 문서다.  
> 콜 스택 → Web APIs → 큐 → 이벤트 루프 흐름을 하나로 묶는다.

---

## 1. 비동기를 한 문장으로 정의하면

**비동기란, 작업의 완료 시점이 아니라 실행 흐름을 분리하는 구조다.**

- 동시에 실행 ❌  
- 나중에 처리 ⭕  
- 메인 스레드 블로킹 방지 ⭕

---

## 2. 자바스크립트는 왜 비동기가 필요한가

- JS는 **싱글 스레드**
- 긴 작업 = UI 멈춤
- 해결책: 작업을 외부에 맡기고, 완료 시 다시 호출

➡️ 이 조율자가 **이벤트 루프(Event Loop)**

---

## 3. 실행 모델 전체 그림

```text
Call Stack
   ↓
Web APIs (Browser)
   ↓
Callback Queue / Microtask Queue
   ↓
Event Loop
```

이벤트 루프는 **스택이 비었는지만 감시**한다.

---

## 4. Call Stack (콜 스택)

```js
function a() {
  b();
}
function b() {
  console.log('b');
}
a();
```

- LIFO 구조
- 실행 중인 함수 관리
- 하나라도 남아 있으면 이벤트 루프는 개입 ❌

---

## 5. Web APIs

브라우저가 제공하는 비동기 처리 영역

- setTimeout
- setInterval
- DOM Events
- fetch / AJAX

```js
setTimeout(() => {
  console.log('timeout');
}, 0);
```

➡️ 0초여도 즉시 실행 ❌

---

## 6. Queue의 종류 (매우 중요)

### 6-1. Macro Task Queue

- setTimeout
- setInterval
- DOM Events

### 6-2. Microtask Queue

- Promise.then
- queueMicrotask
- MutationObserver

**우선순위**
```
Microtask > Macro task
```

---

## 7. 이벤트 루프의 실제 동작 순서

1. Call Stack 실행
2. Stack 비면
3. Microtask Queue 전부 실행
4. 그 다음 Macro task 하나 실행
5. 반복

---

## 8. 대표 면접 문제

```js
console.log(1);

setTimeout(() => console.log(2), 0);

Promise.resolve().then(() => console.log(3));

console.log(4);
```

### 출력 순서
```
1
4
3
2
```

---

## 9. Promise의 본질

Promise는 **비동기 결과를 담는 객체**가 아니다.

> Promise는 **미래에 실행될 코드를 큐에 등록하는 규약**이다.

```js
Promise.resolve().then(() => {
  console.log('then');
});
```

➡️ Microtask Queue

---

## 10. async / await의 정체

```js
async function foo() {
  console.log(1);
  await Promise.resolve();
  console.log(2);
}
foo();
console.log(3);
```

출력:
```
1
3
2
```

- await = then 문법 설탕
- await 뒤 코드는 **Microtask로 분리**

---

## 11. 흔한 오해 정리

| 오해 | 실제 |
|---|---|
| setTimeout(0) 즉시 실행 | 큐 대기 |
| Promise는 병렬 | 순차 |
| async는 멀티스레드 | ❌ |
| await는 blocking | ❌ |

---

## 12. 클로저 / this 와의 연결

- 콜백은 항상 **클로저**
- this는 실행 시점에 다시 평가
- stale closure 문제 발생

➡️ React에서 문제 폭발 지점

---

## 13. 실무 기준 요약

- UI 작업 → 비동기 필수
- Promise.then vs await = 취향 아님
- Microtask 이해 못 하면 디버깅 불가

> 비동기는 “기다림”이 아니라 **실행 순서 설계**다.

---

## 다음 챕터

1. Promise 심화 패턴
2. async/await 에러 처리
3. React에서 이벤트 루프 이해

