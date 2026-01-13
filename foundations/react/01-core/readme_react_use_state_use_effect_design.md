# React useState & useEffect Design (사고 체계 중심)

> 이 문서는 React 훅의 문법을 설명하지 않는다.  
> **왜 React가 useState와 useEffect라는 구조를 선택했는지**를 설계 관점에서 설명한다.

---

## 🧭 이 챕터의 위치

- JavaScript State & Rendering Design **이후**
- Fetch & HTTP Design **이후**
- React 학습의 **실제 시작점**

즉,
- "React 문법 입문" ❌
- **React 렌더링 엔진 사고 체계 입문** ✅

---

## 🎯 목표

- 상태 변경과 렌더링의 관계를 정확히 이해한다
- useEffect를 비동기 도구로 오해하지 않는다
- React 렌더 사이클에서 안전한 코드 기준을 갖는다

---

## 1. React의 본질

### React는 무엇을 해결하는가

> **상태가 바뀌면 UI가 다시 계산되어야 한다**

- DOM 조작 자동화 ❌
- **렌더링 규칙의 자동화** ✅

---

## 2. useState는 무엇인가

### 실무적 정의

> **렌더링을 다시 발생시키는 상태 컨테이너**

```js
const [count, setCount] = useState(0);
```

- 값 저장 + 렌더 트리거
- 일반 변수와 결정적 차이

---

## 3. 왜 setState는 비동기처럼 보이는가

### 이유

- 상태 변경 즉시 렌더 ❌
- 상태 변경 예약 → 렌더 스케줄링 ✅

👉 React는 여러 상태 변경을 묶어 처리한다

---

## 4. 렌더링과 함수 컴포넌트

```js
function Component() {
  const [x, setX] = useState(0);
  console.log('render');
  return <div />;
}
```

- 상태 변경 → 함수 재실행
- 렌더링 = 함수 호출

👉 컴포넌트는 **상태의 스냅샷**

---

## 5. useEffect의 오해

### 잘못된 인식

- useEffect = fetch용
- useEffect = 생명주기 대체

### 올바른 정의

> **렌더 결과에 반응하는 부수 효과 실행기**

---

## 6. useEffect가 필요한 이유

### 렌더 중에 하면 안 되는 것

- DOM 직접 접근
- 네트워크 요청
- 구독 / 타이머

👉 렌더는 **순수 계산 단계**여야 한다

---

## 7. 의존성 배열의 본질

```js
useEffect(() => {
  subscribe(id);
}, [id]);
```

- 언제 다시 실행할 것인가에 대한 **명시적 선언**
- React에게 주는 힌트

---

## 8. 잘못된 패턴

```js
useEffect(() => {
  fetchData();
}, []);
```

- 의존성 숨김
- 상태 불일치 위험

👉 빈 배열은 **의도적으로 고정할 때만**

---

## 9. 올바른 사고 흐름

1. 상태 설계
2. 렌더링 계산
3. 렌더 결과에 따른 effect

```txt
State → Render → Effect
```

---

## 10. fetch와 useEffect의 관계

- fetch는 effect 중 하나
- 모든 effect가 fetch는 아님

```js
useEffect(() => {
  load();
}, [userId]);
```

- 상태 변화에 반응한 결과

---

## 11. 실무 체크리스트

- [ ] 이 코드는 렌더 중 실행돼도 안전한가?
- [ ] effect의 트리거가 명확한가?
- [ ] 상태 변경과 effect 실행이 섞이지 않았는가?

---

## 🎯 이 챕터를 마치면

- useEffect 공포가 사라진다
- 의존성 배열을 숨기지 않는다
- React 코드의 예측 가능성이 올라간다

---

## 다음 챕터 예고

> **React Rendering & Performance Design**  
> 언제 리렌더가 일어나고, 왜 최적화가 필요한가

---

**이 문서는 React 실무 설계 기준 문서다.**